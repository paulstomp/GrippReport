export class DepartmentPlanning {

  dateSeries: Date[] = [];
  plannedHours: any;
  workingHours: any;
  absenceHours: any;
  bookedHours: any;
  employees: any;
  employeeProjects: any;
  dataLoaded = false;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadPlanning(departmentId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    // Retrieve employee from working hours

    this.employees = await query(`
      select distinct employee_id, firstname, lastname
      from _workinghours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by firstname`);

    // Retrieve projects per employee from planning and booked hours

    this.employeeProjects = await query(`
      select distinct company_name, project_id, project_name, project_number, employee_id, firstname
      from (
          select company_name, project_id, project_name, project_number, employee_id, firstname
          from _calendaritems
          where department_id = ${departmentId}
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
        union
          select company_name, project_id, project_name, project_number, employee_id, firstname
          from _hours
          where department_id = ${departmentId}
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}") as projects
      order by company_name, project_name`);

    // Retrieve hours

    this.plannedHours = await query(`
      select employee_id, project_id, date_str, hours
      from _calendaritems
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.workingHours = await query(`
      select department_id, employee_id, date_str, hours
      from _workinghours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.absenceHours = await query(`
      select department_id, employee_id, date_str, amount
      from _absencerequestlines
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.bookedHours = await query(`select company_name, project_id, project_number, project_name,
      employee_id, firstname, lastname, date_str, amount
      from _hours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.dataLoaded = true;
  }

  getEmployeeProjects(employeeId: number) {
    if(this.employeeProjects) {
      const filtered = this.employeeProjects.filter((e: any) => e.employee_id == employeeId);
      return filtered;
    }
    return [];
  }

  getEmployeePlannedHours(employeeId: number, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getEmployeePlannedHoursTotal(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    sum += this.getEmployeeAbsenceHours(employeeId, date);
    sum += this.getEmployeeFreeHours(employeeId, date);
    return sum;
  }

  getEmployeeAbsenceHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.absenceHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });
    return sum;
  }

  getEmployeeWorkingHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.workingHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getEmployeeFreeHours(employeeId: number, date: Date) {
    return 8 - this.getEmployeeWorkingHours(employeeId, date); // Inverse of working hours
  }

  getEmployeeAvailableHours(employeeId: number, date: Date) {
    return this.getEmployeeWorkingHours(employeeId, date) - this.getEmployeeAbsenceHours(employeeId, date)
  }

  getTotalAvailableHours(date: Date) {
    let sum = 0;
    if(this.employees) {
      this.employees.forEach((employee: any) => { sum += this.getEmployeeAvailableHours(employee.employee_id, date) });
    }
    return sum;
  }

  getEmployeeBookedHours(employeeId: number, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.bookedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }

  getEmployeeBookedHoursTotal(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.bookedHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }
}
