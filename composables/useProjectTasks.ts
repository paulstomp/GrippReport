export class ProjectTasks {

  projectLines: any;
  tasks: any;
  dataLoaded = false;

  async loadData(projectId: number) {

    this.projectLines = await query(`select * from _projectlines
      where project_id = ${projectId}
      order by ordering`);

    this.tasks = await query(`select * from _task_hours
      where project_id = ${projectId}`);

    this.dataLoaded = true;
  }

  getProjectLineTasksCount(projectLineId: string) {
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
