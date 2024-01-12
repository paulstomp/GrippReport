export class GrippCsds {

  csds: any;
  companies: any;
  projects: any;

  csd: any;
  company: any;
  project: any;

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, csd_firstname
      from companies_meta`);

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

  setCompanyById(companyId: number) {
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
      and id in (select _projects_running.company_id from _projects_running)`);

    // Set company to first found by default
    this.company = (this.companies.length > 0) ? this.companies[0] : null;

    return this.companies;
  }

  async loadCompanyProjects() {
    this.projects = await query(`select * from _projects
      where company_id = "${this.company.id}"
      and id in (select _projects_running.id from _projects_running)`);

    // Set project to first found by default
    this.project = (this.projects.length > 0) ? this.projects[0] : null;

    return this.projects;
  }
}
