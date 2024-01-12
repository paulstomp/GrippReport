[<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <!-- Selection -->

    <div class="grid-1-1-1">

      <!-- CSDs -->

      <div class="card light-dark shadow">
        <h1>CSD</h1>

        <span v-for="(csd, index) in grippCsds.csds" :key=index>
          <button @click="setCsd(csd.csd_firstname)">
            {{ csd.csd_firstname }}
          </button>
        </span>
      </div>

      <!-- Companies -->

      <div class="card light-dark shadow">
        <h1>{{ grippCsds.csd ? grippCsds.csd.csd_firstname : '' }}</h1>

        <span v-for="(company, index) in grippCsds.companies" :key=index>
          <button @click="setCompany(company.id)">
            {{ company.name }}
          </button>
        </span>
      </div>

      <!-- Projects -->

      <div class="card light-dark shadow">
        <h1>{{ grippCsds.company ? grippCsds.company.name : '' }}</h1>

        <span v-for="(project, index) in grippCsds.projects" :key=index>
          <button @click="setProject(project.id)">
            {{ project.name }}
          </button>
        </span>
      </div>

    </div>

    <!-- Project tasks -->

    <div class="grid-1">

      <div class="card light-dark shadow">
        <h1>
          {{ grippTasks.companyName}}: {{ grippTasks.projectName}} {{ grippTasks.projectId}}
        </h1>

        <table>

          <!-- Table header -->

          <tbody>

            <tr style="height: 40px;">
              <td>Project line</td>
              <td>Amount</td>
              <td>Task type</td>
              <td>Content</td>
              <td>Description</td>
              <td>Hours</td>
              <td>Start</td>
              <td>Deadline</td>
              <td>Completed</td>
            </tr>

          </tbody>

          <!-- Project line -->

          <tbody v-for="(projectLine, index) in grippTasks.projectLines" :key=index>

            <!-- When group -->

            <tr v-if="projectLine.rowtype_id == 2">
              <td colspan="2"><h2>{{ projectLine.additionalsubject }} </h2></td>
            </tr>

            <!-- When product -->

            <tr v-else>
              <td><strong>{{ projectLine.productname }}</strong></td>
              <td><strong>{{ prettyfy(projectLine.amount, 10) }}</strong></td>
              <td><strong>&#x21B4;</strong></td>
            </tr>

            <!-- When product, but no tasks -->

            <tr v-if="projectLine.unit_id && grippTasks.getProjectLineTaskCount(projectLine.id) == 0">
              <td></td>
              <td></td>
              <td colspan="7" class="lavender-red">No tasks</td>
            </tr>

            <!-- Tasks -->

            <tr v-for="(task, index) in grippTasks.getProjectLineTasks(projectLine.id)" :key=index>
              <td></td>
              <td></td>
              <td class="lavender-dark">{{ task.tasktype_name }}</td>
              <td class="lavender-dark">{{ prettyfy(task.content, 20) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.description, 20) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.estimatedhours, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.startdate, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.deadlinedate, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.completedon, 10) }}</td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Sync info -->

      <GrippSyncInfo />

    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>

  definePageMeta({ auth: true })

  const grippCsds = ref(new GrippCsds());
  const grippTasks = ref(new GrippTasks());

  // Set new CSD

  async function setCsd(csdFirstname: string) {
    grippCsds.value.setCsdByFirstname(csdFirstname);
    await grippCsds.value.loadCsdCompanies();
    await grippCsds.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(grippCsds.value.projects[0].id);
  }

  // Set new Company

  async function setCompany(companyId: number) {
    await grippCsds.value.setCompanyById(companyId);
    await grippCsds.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(grippCsds.value.project.id);
  }

  // Set new project

  async function setProject(projectId: number) {
    await grippTasks.value.loadTasks(projectId);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    // Load data
    await grippCsds.value.loadCsds();
    await grippCsds.value.loadCsdCompanies();
    await grippCsds.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(grippCsds.value.project.id);
  });

</script>
