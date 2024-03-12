export class GrippHours {

  dateSeries: Date[] = [];
  hours: any;
  employees: any;
  projects: any;
  projectEmployees: any;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadHoursByDepartment(departmentId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select company_name, project_id, project_number, project_name,
      employee_id, firstname, lastname, date_str, amount
      from _hours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.employees = await query(`select distinct employee_id, firstname, lastname
      from _hours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by firstname`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_number, project_type, employee_id, firstname, lastname
      from _hours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, firstname`);
  }

   async loadHoursByAccountManager(employeeId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select company_name, project_id, project_number, project_name,
      employee_id, firstname, lastname, date_str, amount
      from _hours
      where am_employee_id = "${employeeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.projects = await query(`select distinct project_id, project_number, project_name, project_type, company_name
      from _hours
      where am_employee_id = "${employeeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_number, project_type, employee_id, firstname, lastname
      from _hours
      where am_employee_id = "${employeeId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, firstname`);
  }

  getEmployeeProjects(employeeId: number) {
    if(this.projectEmployees) {
      const filtered = this.projectEmployees.filter((e: any) => e.employee_id == employeeId);
      return filtered;
    }
    return [];
  }

  getProjectsEmployees(projectId: number) {
    if(this.projectEmployees) {
      const filtered = this.projectEmployees.filter((e: any) => e.project_id == projectId);
      return filtered;
    }
    return [];
  }

  getEmployeeTotalHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }

  getProjectTotalHours(projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_id == projectId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }

  getEmployeeProjectHours(employeeId: number, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });

    return (sum > 0) ? sum : '-';
  }

  // Todo: can be removed
  sortHoursByEmployee() {
    this.projectEmployees.sort((a: any, b: any) => a.firstname.localeCompare(b.firstname));
  }

  // Todo: can be removed
  sortHoursByCompany() {
    this.projectEmployees.sort((a: any, b: any) => a.company_name.localeCompare(b.company_name));
  }
}
