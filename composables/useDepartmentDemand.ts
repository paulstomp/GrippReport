export class DepartmentDemand {

    dateSeries: Date[] = [];
    damandHours: any;
    tasks: any;
    projects: any;
    projectTasks: any;
    dataLoaded = false;

    setDateSeries(date: Date, weeks: number) {
      this.dateSeries = getDateSeries(date, weeks);
    }

    async loadData(taskTypeId: number) {

      var minDate = this.dateSeries[0];
      var maxDate = this.dateSeries[this.dateSeries.length - 1];

      this.damandHours = await query(`select company_name, project_id, project_name,
        task_id, task_content, date_str, hours
        from _resourceitems
        where tasktype_id = "${taskTypeId}"
        and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

      this.projects = await query(`select distinct project_id, project_number,
        project_name, project_type, company_name
        from _resourceitems
        where tasktype_id = "${taskTypeId}"
        and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
        order by company_name, project_name`);

      this.projectTasks = await query(`select distinct
        company_name, project_id, project_name, project_type, task_id, task_content
        from _resourceitems
        where tasktype_id = "${taskTypeId}"
        and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
        order by company_name, project_name, task_content`);

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

      if (this.damandHours) {
        const filtered = this.damandHours.filter((element: any) =>
          element.date_str == date_str);

        filtered.forEach((element: any) => { sum += Number(element.hours) });
      }

      return sum;
    }

    getProjectTotalHours(projectId: number, date: Date) {
      const date_str = getDateStr(date);
      let sum = 0;

      if (this.damandHours) {
        const filtered = this.damandHours.filter((element: any) =>
          element.project_id == projectId &&
          element.date_str == date_str);

        filtered.forEach((element: any) => { sum += Number(element.hours) });
      }

      return sum;
    }

    getTaskHours(taskId: number, date: Date) {
      const date_str = getDateStr(date);
      let sum = 0;

      if (this.damandHours) {
        const filtered = this.damandHours.filter((element: any) =>
          element.task_id == taskId &&
          element.date_str == date_str);

        filtered.forEach((element: any) => { sum += Number(element.hours) });
      }

      return sum;
    }
  }
