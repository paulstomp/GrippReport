[<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <!-- Selection -->

    <div class="grid-1-1-1">

      <!-- CSDs -->

      <div class="card light-dark shadow">
        <h1>CSD</h1>

        <span v-for="(csd, index) in gripp.csds" :key=index>
          <button @click="setCsd(csd.csd_firstname)">
            {{ csd.csd_firstname }}
          </button>
        </span>
      </div>

      <!-- Companies -->

      <div class="card light-dark shadow">
        <h1>{{ gripp.csd ? gripp.csd.csd_firstname : '' }}</h1>

        <span v-for="(company, index) in gripp.companies" :key=index>
          <button @click="setCompany(company.id)">
            {{ company.name }}
          </button>
        </span>
      </div>

      <!-- Projects -->

      <div class="card light-dark shadow">
        <h1>{{ gripp.company ? gripp.company.name : '' }}</h1>

        <span v-for="(project, index) in gripp.projects" :key=index>
          <button @click="setProject(project.id)">
            {{ project.name }} {{ project.id }}
          </button>
        </span>
      </div>

    </div>

    <!-- Project -->

    <div class="grid-1">

      <div class="card light-dark shadow">

        <div v-if="gripp.project">
          <h1>{{ gripp.project.name }}</h1>
          Type: {{ gripp.project.type }}
          | Startdate: {{ prettyfy(gripp.project.startdate) }}
          | Deadline {{ prettyfy(gripp.project.deadline) }}
          | Database ID {{ gripp.project.id }}
        </div>

        <hr>

        <!-- Tasks -->

        <table>

          <!-- Table header -->

          <tbody>

            <tr style="height: 40px;">
              <td>Project line</td>
              <td>Amount</td>
              <td>Task type</td>
              <td>Content</td>
              <td>Hours</td>
              <td>Start</td>
              <td>Deadline</td>
              <td>Deadline calc</td>
              <td>Planned</td>
              <td>From</td>
              <td>To</td>
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

            <tr v-if="projectLine.rowtype_id == 1 && grippTasks.getProjectLineTasksCount(projectLine.id) == 0">
              <td></td>
              <td></td>
              <td colspan="7" class="lavender-red">No tasks</td>
              <td colspan="3" class="aliceblue-dark"></td>
            </tr>

            <!-- Tasks -->

            <tr v-for="(task, index) in grippTasks.getProjectLineTasks(projectLine.id)" :key=index>
              <td></td>
              <td></td>
              <td class="lavender-dark">{{ task.tasktype_name }}</td>
              <td class="lavender-dark">{{ prettyfy(task.content, 20) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.estimatedhours, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.startdate, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.deadline, 10) }}</td>
              <td class="lavender-dark">{{ prettyfy(task.deadline_calc, 10) }}</td>
              <td class="aliceblue-dark">{{ prettyfy(task.hours_planned, 10) }}</td>
              <td class="aliceblue-dark">{{ prettyfy(task.hours_planned_from, 10) }}</td>
              <td class="aliceblue-dark">{{ prettyfy(task.hours_planned_to, 10) }}</td>
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

  const gripp = ref(new Gripp());
  const grippTasks = ref(new GrippTasks());

  // Set new CSD

  async function setCsd(csdFirstname: string) {
    gripp.value.setCsdByFirstname(csdFirstname);
    await gripp.value.loadCsdCompanies();
    await gripp.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(gripp.value.project.id);
  }

  // Set new Company

  async function setCompany(companyId: number) {
    await gripp.value.setCompany(companyId);
    await gripp.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(gripp.value.project.id);
  }

  // Set new project

  async function setProject(projectId: number) {
    await gripp.value.setProject(projectId);
    await grippTasks.value.loadTasks(projectId);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    // Load data
    await gripp.value.loadCsds();
    await gripp.value.loadCsdCompanies();
    await gripp.value.loadCompanyProjects();
    await grippTasks.value.loadTasks(gripp.value.project.id);
  });

</script>
