export class Gripp {

  csds: any;
  companies: any;
  projects: any;

  csd: any;
  company: any;
  project: any;

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, csd_firstname
      from companies_meta order by csd_firstname`);

    // Set csdFirstname to first found by default
    this.csd = (this.csds.length > 0) ? this.csds[0] : null;

    return this.csds;
  }

  setCsdByFirstname(csdFirstname: string) {
    if(this.csds) {
      const filtered = this.csds.filter((e: any) => e.csd_firstname == csdFirstname);
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

  async loadCsdCompanies() {
    this.companies = await query(`select * from _companies
      where csd_firstname = "${this.csd.csd_firstname}"
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

  setProject(projectId: number) {
    if(this.projects) {
      const filtered = this.projects.filter((e: any) => e.id == projectId);
      this.project = (filtered.length > 0) ? filtered[0] : null;
      return this.project;
    }
    this.project = null;
    return this.project;
  }
}
