export class GrippData {

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

  constructor(weeks: number) {
    this.dateSeries = getDateSeries(weeks);
  }

  async loadDepartments() {
    this.departments = await query(`select name from departments order by name`);
  }

  async loadPlanningByDepartment(departmentName: string) {
    this.departmentName = departmentName;
    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select department_name, company_name, project_name,
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
      company_name, project_name, firstname
      from _calendaritems
      where department_name = "${departmentName}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.lastSyncDatetime = await this.getLastSyncDatetime();
  }

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, csd_firstname from companies_meta`);
  }

  async loadPlanningByCsd(csdFirstname: string) {
    this.csdFirstname = csdFirstname;
    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.hours = await query(`select department_name, company_name, project_name,
      firstname, date_str, hours
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.projects = await query(`select distinct project_name, company_name
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name`);

    this.projectEmployees = await query(`select distinct
      company_name, project_name, firstname
      from _calendaritems
      where csd_firstname = "${csdFirstname}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.lastSyncDatetime = await this.getLastSyncDatetime();
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

  getProjectTotalHours(projectName: string, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_name == projectName &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return (sum > 0) ? sum : '-';
  }

  getEmployeeProjectHours(firstname: string, project_name: string, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.hours.filter((element: any) =>
      element.project_name == project_name &&
      element.firstname == firstname &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    return (sum > 0) ? sum : '-';
  }

  async getLastSyncDatetime() {
    const result = await query(
      `select convert_tz(cast(createdon as char), '+00:00','+02:00') as createdon_str `+
      `from log order by id desc limit 1;`);

    return result[0].createdon_str;
  }
}

// General functions

export function getDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

export function getWeek(date: Date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000)
    + onejan.getDay() + 1) / 7);
}

export function getDateSeries(weeks: number) {
  var result: Date[] = [];
  var date = new Date();

  date.setDate(date.getDate() - (date.getDay() + 7) % 7); // Previous Monday

  for(let i = 0; i < weeks * 7; i++) {
    date.setDate(date.getDate() + 1);
    if(date.getDay() >= 1 && date.getDay() <= 5) { // Only working days
      result.push(new Date(date));
    }
  }
  return result;
}

export function compareString(a: string, b: string) {
  return (a > b) ? 1 : 0;
}
