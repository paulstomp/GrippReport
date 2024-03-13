export class Gripp {

  accountManagers: any;
  companies: any;
  projects: any;
  departments: any;
  tasktypes: any;

  accountManager: any;
  company: any;
  project: any;
  department: any;
  tasktype: any;

  async loadAccountManagers() {
    this.accountManagers = await query(`
      select distinct accountmanager_id, firstname
      from companies
      inner join employees on employees.id = companies.accountmanager_id
      where companies.id in (select _projects_running.company_id from _projects_running)
      order by employees.firstname`);

    // Set acount manager to first found by default
    this.accountManager = (this.accountManagers.length > 0) ? this.accountManagers[0] : null;

    return this.accountManagers;
  }

  async loadAccountManagerCompanies() {
    this.companies = await query(`
      select * from companies
      where accountmanager_id = "${this.accountManager.accountmanager_id}"
      and id in (select _projects_running.company_id from _projects_running)
      order by name`);

    // Set company to first found by default
    this.company = (this.companies.length > 0) ? this.companies[0] : null;

    return this.companies;
  }

  async loadCompanyProjects() {
    this.projects = await query(`
      select * from _projects
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

  setAccountManager(accountManagerId: number) {
    if(this.accountManagers) {
      const filtered = this.accountManagers.filter((e: any) => e.accountmanager_id == accountManagerId);
      this.accountManager = (filtered.length > 0) ? filtered[0] : null;
      return this.accountManager;
    }
    this.accountManager = null;
    return this.accountManager;
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

