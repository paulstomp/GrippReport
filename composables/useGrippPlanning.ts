export class GrippPlanning {

  dateSeries: Date[] = [];
  plannedHours: any;
  workingHours: any;
  absenceHours: any;
  employees: any;
  projects: any;
  projectEmployees: any;

  setDateSeries(date: Date, weeks: number) {
    this.dateSeries = getDateSeries(date, weeks);
  }

  async loadPlanningByDepartment(departmentId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.plannedHours = await query(`select department_id, employee_id, date_str, hours,
        company_name, project_id, project_number, project_name
      from _calendaritems
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.workingHours = await query(`select department_id, employee_id, date_str, hours
      from _workinghours
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.absenceHours = await query(`select department_id, employee_id, date_str, amount
      from _absencerequestlines
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.employees = await query(`select distinct employee_id, firstname, lastname
      from _calendaritems
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by firstname`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_number, project_type, employee_id, firstname, lastname
      from _calendaritems
      where department_id = "${departmentId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name, project_name, firstname`);
  }

   async loadPlanningByAccountManager(accountManagerId: number) {

    var minDate = this.dateSeries[0];
    var maxDate = this.dateSeries[this.dateSeries.length - 1];

    this.plannedHours = await query(`select company_name, project_id, project_number, project_name,
      employee_id, firstname, lastname, date_str, hours
      from _calendaritems
      where accountmanager_id = "${accountManagerId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

    this.projects = await query(`select distinct project_id, project_number, project_name, project_type, company_name
      from _calendaritems
      where accountmanager_id = "${accountManagerId}"
      and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"
      order by company_name`);

    this.projectEmployees = await query(`select distinct
      company_name, project_id, project_name, project_number, project_type, employee_id, firstname, lastname
      from _calendaritems
      where accountmanager_id = "${accountManagerId}"
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

  getEmployeeProjectHours(employeeId: number, projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getEmployeeAbsenceHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.absenceHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.amount) });
    return sum;
  }

  getEmployeeWorkingHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.workingHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }

  getEmployeeFreeHours(employeeId: number, date: Date) {
    return 8 - this.getEmployeeWorkingHours(employeeId, date); // Inverse of working hours
  }

  getEmployeeAvailableHours(employeeId: number, date: Date) {
    return this.getEmployeeWorkingHours(employeeId, date) - this.getEmployeeAbsenceHours(employeeId, date)
  }

  getEmployeeTotalHours(employeeId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.employee_id == employeeId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });

    sum += this.getEmployeeAbsenceHours(employeeId, date);
    sum += this.getEmployeeFreeHours(employeeId, date);
    return sum;
  }

  getTotalAvailableHours(date: Date) {
    let sum = 0;
    this.employees.forEach((employee: any) => { sum += this.getEmployeeAvailableHours(employee.employee_id, date) });
    return sum;
  }

  getProjectTotalHours(projectId: number, date: Date) {
    const date_str = getDateStr(date);

    const filtered = this.plannedHours.filter((element: any) =>
      element.project_id == projectId &&
      element.date_str == date_str);

    let sum = 0;
    filtered.forEach((element: any) => { sum += Number(element.hours) });
    return sum;
  }
}
