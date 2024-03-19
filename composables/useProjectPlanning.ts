export class ProjectPlanning {

  dateSeries: Date[] = [];
  plannedHours: any;
  bookedHours: any;
  projects: any;
  projectEmployees: any;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadPlanning(accountManagerId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.projects = await query(`
      select distinct project_id, project_number, project_name, company_name
      from (
          select project_id, project_number, project_name, company_name
          from _calendaritems
          where accountmanager_id = "${accountManagerId}"
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
        union
          select project_id, project_number, project_name, company_name
          from _hours
          where accountmanager_id = "${accountManagerId}"
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}") as projects
      order by company_name, project_name`);

    this.projectEmployees = await query(`
      select distinct project_id, employee_id, firstname, lastname
      from (
          select project_id, employee_id, firstname, lastname
          from _calendaritems
          where accountmanager_id = "${accountManagerId}"
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
        union
          select project_id, employee_id, firstname, lastname
          from _hours
          where accountmanager_id = "${accountManagerId}"
          and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}") as projects
      order by firstname, lastname`);

    this.plannedHours = await query(`
      select project_id, employee_id, date_str, hours
      from _calendaritems
      where accountmanager_id = "${accountManagerId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.bookedHours = await query(`select company_name, project_id, project_number, project_name,
      employee_id, firstname, lastname, date_str, amount
      from _hours
      where accountmanager_id = "${accountManagerId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);
  }

  getProjectsEmployees(projectId: number) {
    if(this.projectEmployees) {
      const filtered = this.projectEmployees.filter((e: any) => e.project_id == projectId);
      return filtered;
    }
    return [];
  }

  getProjectPlannedHours(projectId: number, employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getProjectPlannedHoursTotal(projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getProjectBookedHours(employeeId: number, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.bookedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }

  getProjectBookedHoursTotal(projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.bookedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }
}
