export class TasktypeRequired {

  dateSeries: Date[] = [];
  requiredHours: any;
  tasks: any;
  projects: any;
  projectTasks: any;
  dataLoaded = false;

  async loadData(tasktypeId: number, date: Date, weeks: number) {

    this.dateSeries = getDateSeries(date, weeks)
    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.projects = await query(`select distinct project_id, project_number,
      project_name, project_type, company_name
      from _resourceitems
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name`);

    this.projectTasks = await query(`select distinct
      company_name, project_id, project_name, project_type, task_id, task_content
      from _resourceitems
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, task_id`);

    this.requiredHours = await query(`select project_id, task_id, date_str, hours
      from _resourceitems
      where tasktype_id = "${tasktypeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.dataLoaded = true;
  }

  getProjectsTasks(projectId: number) {
    if(this.projectTasks) {
      const filtered = this.projectTasks.filter((e: any) => e.project_id == projectId);
      return filtered;
    }
    return [];
  }

  getTotalHours(date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.requiredHours) {
      const filtered = this.requiredHours.filter((element: any) =>
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

  getProjectHours(projectId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.requiredHours) {
      const filtered = this.requiredHours.filter((element: any) =>
        element.project_id == projectId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }

  getTaskHours(taskId: number, date: Date) {
    const date_str = getDateStr(date);
    let sum = 0;

    if (this.requiredHours) {
      const filtered = this.requiredHours.filter((element: any) =>
        element.task_id == taskId &&
        element.date_str == date_str);

      filtered.forEach((element: any) => { sum += Number(element.hours) });
    }

    return sum;
  }
}
