export class GrippPlanning {

  dateSeries: Date[] = [];
  hours: any;
  employees: any;
  departments: any;
  projects: any;
  csds: any;
  projectEmployees: any;
  departmentName: string = '';
  csdFirstname: string = '';
  lastSyncDatetime: string = '';

  constructor(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadDepartments() {
    this.departments = await query(`select name from departments order by name`);
  }

  async loadPlanningByDepartment(departmentName: string) {
    this.departmentName = departmentName;
    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select department_name, company_name, project_id, project_name,
      firstname, date_str, hours
      from _calendaritems
      where department_name = "${departmentName}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.employees = await query(`select distinct firstname
      from _calendaritems
      where department_name = "${departmentName}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by firstname`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_type, firstname
      from _calendaritems
      where department_name = "${departmentName}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, firstname`);
  }

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, csd_firstname from companies_meta`);
  }

  async loadPlanningByCsd(csdFirstname: string) {
    this.csdFirstname = csdFirstname;
    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select department_name, company_name, project_id, project_name,
      firstname, date_str, hours
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.projects = await query(`select distinct project_id, project_name, project_type, company_name
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_type, firstname
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, firstname`);
  }

  getDepartments() {
    const employees = this.projectEmployees.map((e: any) => e.firstname);
    return new Set(employees);
  }

  getEmployeeProjects(firstname: string) {
    if(this.projectEmployees) {
      const filtered = this.projectEmployees.filter((e: any) => e.firstname == firstname);
      return filtered;
    }
    return [];
  }

  getProjectsEmployees(projectName: string) {
    if(this.projectEmployees) {
      const filtered = this.projectEmployees.filter((e: any) => e.project_name == projectName);
      return filtered;
    }
    return [];
  }

  // Todo: can be removed
  sortHoursByEmployee() {
    this.projectEmployees.sort((a: any, b: any) => a.firstname.localeCompare(b.firstname));
  }

  // Todo: can be removed
  sortHoursByCompany() {
    this.projectEmployees.sort((a: any, b: any) => a.company_name.localeCompare(b.company_name));
  }

  getEmployeeTotalHours(firstname: string, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.firstname == firstname &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return (sum > 0) ? sum : '-';
  }

  getProjectTotalHours(projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_id == projectId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return (sum > 0) ? sum : '-';
  }

  getEmployeeProjectHours(firstname: string, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_id == projectId &&
      element.firstname == firstname &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return (sum > 0) ? sum : '-';
  }
}

// Get date series based on initial date and number of weeks

export function getDateSeries(date: Date, weeks: number) {
  let dateIndex = new Date(date);
  var result: Date[] = [];
  dateIndex.setDate(dateIndex.getDate() - (dateIndex.getDay() + 7) % 7); // Previous Monday

  for(let i = 0; i < weeks * 7; i++) {
    dateIndex.setDate(dateIndex.getDate() + 1);
    if(dateIndex.getDay() >= 1 && dateIndex.getDay() <= 5) { // Only working days
      result.push(new Date(dateIndex));
    }
  }
  return result;
}
