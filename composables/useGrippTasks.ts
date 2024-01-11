export class GrippTasks {

  csds: any;
  csdProjects: any;
  projectLines: any;
  tasks: any;
  projectName: string = '';
  companyName: string = '';

  async loadCsds() {
    this.csds = await query(`select distinct csd_employee_id, csd_firstname from companies_meta`);
  }

  async loadCsdProjects(csdFirstname: string) {
    this.csdProjects = await query(`select * from _projects
      where csd_firstname = "${csdFirstname}" and archived = 0
      and id in (select _projects_running.id from _projects_running)`);
  }

  async loadTasks(projectId: number) {

    this.projectLines = await query(`select * from _projectlines
      where project_id = ${projectId}
      order by ordering`);

    this.tasks = await query(`select * from _tasks
      where project_id = ${projectId}`);

    if (this.projectLines.length > 0) {
      this.projectName = this.projectLines[0].project_name;
      this.companyName = this.projectLines[0].company_name;
    }
  }

  getProjectLineTaskCount(projectLineId: string) {
    if(this.tasks) {
      const filtered = this.tasks.filter((e: any) => e.projectline_id == projectLineId);
      return filtered.length;
    }
    return 0;
  }

  getProjectLineTasks(projectLineId: string) {
    if(this.tasks) {
      const filtered = this.tasks.filter((e: any) => e.projectline_id == projectLineId);
      return filtered;
    }
    return [];
  }
}
