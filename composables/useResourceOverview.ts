export class ResourceOverview {

  dateSeries: Date[] = [];
  demandHours: any;
  tasks: any;
  taskTypes: any;
  dataLoaded = false;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadData() {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.demandHours = await query(`select tasktype_id, date_str, hours
      from _resourceitems
      where date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.taskTypes = await query(`select id, name from tasktypes
      order by name`);

    this.dataLoaded = true;
  }

  getTotalDemandHours(date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.demandHours) {
      const filtered = this.demandHours.filter((element: any) =>
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

  getTaskTypeDemandHours(taskTypeId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.demandHours) {
      const filtered = this.demandHours.filter((element: any) =>
        element.tasktype_id == taskTypeId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

}
