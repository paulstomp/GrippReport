export class GrippTasks {

  projectLines: any;
  tasks: any;
  projectId: string = '';
  projectName: string = '';
  companyName: string = '';

  async loadTasks(projectId: number) {

    this.projectLines = await query(`select * from _projectlines
      where project_id = ${projectId}
      order by ordering`);

    this.tasks = await query(`select * from _task_hours
      where project_id = ${projectId}`);

    if (this.projectLines.length > 0) {
      this.projectId = this.projectLines[0].project_id;
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
