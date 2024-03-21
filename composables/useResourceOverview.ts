export class ResourceOverview {

  dateSeries: Date[] = [];
  workingHours: any;
  absenceHours: any;
  requiredHours: any;
  tasktypes: any;
  dataLoaded = false;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadData() {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    // Retrieve tasktypes

    this.tasktypes = await query(`select id, name from tasktypes
      order by name`);

    // Retrieve hours

    this.workingHours = await query(`
      select department_id, tasktype_id, date_str, hours
      from _workinghours
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      and employee_tags <> "FREELANCE"`);

    this.absenceHours = await query(`
      select department_id, tasktype_id, date_str, amount
      from _absencerequestlines
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_active = 1
      and employee_tags <> "FREELANCE"`);

    this.requiredHours = await query(`select tasktype_id, date_str, hours
      from _resourceitems
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.dataLoaded = true;
  }

  getTasktypeAbsenceHours(tasktypeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.absenceHours.filter((element: any) =>
      element.tasktype_id == tasktypeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return sum;
  }

  getTasktypeWorkingHours(tasktypeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.workingHours.filter((element: any) =>
      element.tasktype_id == tasktypeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return sum;
  }

  getTasktypeAvailableHours(tasktypeId: number, date: Date) {
    return this.getTasktypeWorkingHours(tasktypeId, date) - this.getTasktypeAbsenceHours(tasktypeId, date)
  }

  getTotalAvailableHours(date: Date) {
    let sum = 0;
    if(this.tasktypes) {
      this.tasktypes.forEach((tasktype: any) => { sum += this.getTasktypeAvailableHours(tasktype.id, date) });
    }

    return sum;
  }

  getTasktypeRequiredHours(tasktypeId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.requiredHours) {
      const filtered = this.requiredHours.filter((element: any) =>
        element.tasktype_id == tasktypeId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

  getTotalRequiredHours(date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.requiredHours) {
      const filtered = this.requiredHours.filter((element: any) =>
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }
}
