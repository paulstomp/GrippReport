export class TasktypeResources {

  dateSeries: Date[] = [];
  workingHours: any;
  employees: any;
  dataLoaded = false;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadData(tasktypeId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    // Retrieve employee from working hours

    this.employees = await query(`
      select distinct employee_id, employee_number, employee_active, employee_tags,
        firstname, lastname
      from _workinghours
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      order by employee_tags, employee_active desc, firstname`);

    // Retrieve working hours

    this.workingHours = await query(`
      select employee_id, date_str, hours
      from _workinghours
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_tags <> "FREELANCE"`);

    this.dataLoaded = true;
  }

  getTotalHours(date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.workingHours) {
      const filtered = this.workingHours.filter((element: any) =>
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

  getEmployeeHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.workingHours) {
      const filtered = this.workingHours.filter((element: any) =>
        element.employee_id == employeeId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }
}
