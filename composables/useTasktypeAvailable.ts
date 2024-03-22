export class TasktypeAvailable {

  dateSeries: Date[] = []
  workingHours: any
  absenceHours: any
  plannedHours: any
  employees: any
  dataLoaded = false

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks)
  }

  async loadData(tasktypeId: number, date: Date, weeks: number) {

    this.dateSeries = getDateSeries(date, weeks)
    var minDate = this.dateSeries[0]
    var maxDate = this.dateSeries[this.dateSeries.length - 1]

    // Retrieve employee from working hours

    this.employees = await query(`
      select distinct employee_id, employee_number, employee_active, employee_tags,
        firstname, lastname
      from _workinghours
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      order by employee_tags, employee_active desc, firstname`)

    // Retrieve hours

    this.plannedHours = await query(`
      select employee_id, project_id, date_str, hours
      from _calendaritems
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      and employee_tags <> "FREELANCE"`)

    this.workingHours = await query(`
      select department_id, employee_id, date_str, hours
      from _workinghours
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      and employee_tags <> "FREELANCE"`)

    this.absenceHours = await query(`
      select department_id, employee_id, date_str, amount
      from _absencerequestlines
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      and employee_tags <> "FREELANCE"`)

    this.dataLoaded = true
  }

  getEmployeeTotalPlannedHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date)

    const filtered = this.plannedHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str)

    let sum = 0
    filtered.forEach((element: any) => { sum += Number(element.hours) })

    sum += this.getEmployeeAbsenceHours(employeeId, date)
    sum += this.getEmployeeOffScheduleHours(employeeId, date)

    return sum
  }

  getTotalPlannedHours(date: Date) {
    let sum = 0
    if(this.employees) {
      this.employees.forEach((employee: any) => { sum += this.getEmployeeTotalPlannedHours(employee.employee_id, date) })
    }

    return sum
  }

  getEmployeeAbsenceHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date)

    const filtered = this.absenceHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str)

    let sum = 0
    filtered.forEach((element: any) => { sum += Number(element.amount) })

    return sum
  }

  getEmployeeWorkingHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date)

    const filtered = this.workingHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str)

    let sum = 0
    filtered.forEach((element: any) => { sum += Number(element.hours) })

    return sum
  }

  getEmployeeOffScheduleHours(employeeId: number, date: Date) {
    return 8 - this.getEmployeeWorkingHours(employeeId, date) // Inverse of working hours
  }

  getEmployeeAvailableHours(employeeId: number, date: Date) {
    let sum = this.getEmployeeWorkingHours(employeeId, date) - this.getEmployeeAbsenceHours(employeeId, date)

    return (sum < 0) ? 0 : sum
  }

  getTotalAvailableHours(date: Date) {
    let sum = 0
    if(this.employees) {
      this.employees.forEach((employee: any) => { sum += this.getEmployeeAvailableHours(employee.employee_id, date) })
    }

    return sum
  }
}
