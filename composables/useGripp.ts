export class Gripp {

  csds: any;
  companies: any;
  projects: any;
  departments: any;
  tasktypes: any;

  csd: any;
  company: any;
  project: any;
  department: any;
  tasktype: any;

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, employees.firstname
      from companies_meta
      inner join employees on employees.id = csd_employee_id
      order by employees.firstname`);

    // Set CSD to first found by default
    this.csd = (this.csds.length > 0) ? this.csds[0] : null;

    return this.csds;
  }

  async loadCsdCompanies() {
    this.companies = await query(`select * from _companies
      where csd_employee_id = "${this.csd.csd_employee_id}"
      and id in (select _projects_running.company_id from _projects_running)
      order by name`);

    // Set company to first found by default
    this.company = (this.companies.length > 0) ? this.companies[0] : null;

    return this.companies;
  }

  async loadCompanyProjects() {
    this.projects = await query(`select * from _projects
      where company_id = "${this.company.id}"
      and id in (select _projects_running.id from _projects_running)
      order by name`);

    // Set project to first found by default
    this.project = (this.projects.length > 0) ? this.projects[0] : null;

    return this.projects;
  }

  async loadDepartments() {
    this.departments = await query(`select * from departments order by name`);

    // Set department to first found by default
    this.department = (this.departments.length > 0) ? this.departments[0] : null;

    return this.departments;
  }

  async loadTasktypes() {
    this.tasktypes = await query(`select * from tasktypes order by name`);

    // Set department to first found by default
    this.tasktype = (this.tasktypes.length > 0) ? this.tasktypes[0] : null;

    return this.tasktypes;
  }

  setCsd(csdEmployeeId: number) {
    if(this.csds) {
      const filtered = this.csds.filter((e: any) => e.csd_employee_id == csdEmployeeId);
      this.csd = (filtered.length > 0) ? filtered[0] : null;
      return this.csd;
    }
    this.csd = null;
    return this.csd;
  }

  setCompany(companyId: number) {
    if(this.companies) {
      const filtered = this.companies.filter((e: any) => e.id == companyId);
      this.company = (filtered.length > 0) ? filtered[0] : null;
      return this.company;
    }
    this.company = null;
    return this.company;
  }

  setProject(projectId: number) {
    if(this.projects) {
      const filtered = this.projects.filter((e: any) => e.id == projectId);
      this.project = (filtered.length > 0) ? filtered[0] : null;
      return this.project;
    }
    this.project = null;
    return this.project;
  }

  setDepartment(departmentId: number) {
    if(this.departments) {
      const filtered = this.departments.filter((e: any) => e.id == departmentId);
      this.department = (filtered.length > 0) ? filtered[0] : null;
      return this.project;
    }
    this.department = null;
    return this.department;
  }

  setTasktype(tasktypeId: number) {
    if(this.tasktypes) {
      const filtered = this.tasktypes.filter((e: any) => e.id == tasktypeId);
      this.tasktype = (filtered.length > 0) ? filtered[0] : null;
      return this.tasktype;
    }
    this.tasktype = null;
    return this.tasktype;
  }
}

