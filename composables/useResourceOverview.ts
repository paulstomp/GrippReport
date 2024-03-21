export class ResourceOverview {

  dateSeries: Date[] = [];
  workingHours: any;
  requiredHours: any;
  taskTypes: any;
  dataLoaded = false;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadData() {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.taskTypes = await query(`select id, name from tasktypes
      order by name`);

    this.workingHours = await query(`select tasktype_id, date_str, hours
      from _workinghours
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      and employee_tags <> "FREELANCE"`);

    this.requiredHours = await query(`select tasktype_id, date_str, hours
      from _resourceitems
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.dataLoaded = true;
  }

  getTotalWorkingHours(date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.workingHours) {
      const filtered = this.workingHours.filter((element: any) =>
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

  getTasktypeWorkingHours(tasktypeId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.workingHours) {
      const filtered = this.workingHours.filter((element: any) =>
        element.tasktype_id == tasktypeId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
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

}
