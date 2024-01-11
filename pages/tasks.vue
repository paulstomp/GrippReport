[<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <div class="grid-1">

      <!-- CSD selection -->

      <div class="card light-dark shadow">
        <h1>CSD</h1>

        <span v-for="(csd, index) in grippTasks.csds" :key=index>
          <button @click="setCsd(csd.csd_firstname)">
            {{ csd.csd_firstname }}
          </button>
        </span>
      </div>

      <!-- Project selection -->

      <div class="card light-dark shadow">
        <h1>Projects of {{ csdFirstname }}</h1>

        <span v-for="(project, index) in grippTasks.csdProjects" :key=index>
          <button @click="setProject(project.id)">
            {{ project.name }}
          </button>
        </span>
      </div>

      <!-- Planning per CSD -->

      <div class="card light-dark shadow">
        <h1>
          {{ grippTasks.companyName}}: {{ grippTasks.projectName}}
        </h1>

        <table>

          <!-- Table header -->

          <tbody>

            <tr style="height: 40px;">
              <td>Project line</td>
              <td>Amount</td>
              <td>Task</td>
              <td>Description</td>
              <td>Start</td>
              <td>Deadline</td>
              <td>Completed</td>
            </tr>

          </tbody>

          <!-- Project line -->

          <tbody v-for="(projectLine, index) in grippTasks.projectLines" :key=index>

            <!-- When group -->

            <tr v-if="!projectLine.unit_id">
              <td colspan="2"><h2>{{ projectLine.additionalsubject }} </h2></td>
            </tr>

            <!-- When product -->

            <tr v-else>
              <td><strong>{{ projectLine.productname }} {{ projectLine.id }}</strong></td>
              <td><strong>{{ prettyfy(projectLine.amount, 10) }}</strong></td>
              <td><strong>&#x21B4;</strong></td>
            </tr>

            <!-- When product, but no tasks -->

            <tr v-if="projectLine.unit_id && grippTasks.getProjectLineTaskCount(projectLine.id) == 0">
              <td></td>
              <td></td>
              <td class="lavender-red">No tasks</td>
              <td class="lavender-red"></td>
              <td class="lavender-red"></td>
              <td class="lavender-red"></td>
              <td class="lavender-red"></td>
            </tr>

            <!-- Tasks -->

            <tr v-for="(task, index) in grippTasks.getProjectLineTasks(projectLine.id)" :key=index>
              <td></td>
              <td></td>
              <td class="lavender-dark">{{ task.tasktype_name }}</td>
              <td class="lavender-dark">{{ task.description }}</td>
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

  const grippTasks = ref(new GrippTasks());
  const csdFirstname = ref('');

  // Set new CSD

  async function setCsd(toCsdFirstname: string) {
    csdFirstname.value = toCsdFirstname;
    await grippTasks.value.loadCsdProjects(csdFirstname.value);

    // Select first project by default
    await grippTasks.value.loadTasks(grippTasks.value.csdProjects[0].id);
  }

  // Set new project

  async function setProject(projectId: number) {
    await grippTasks.value.loadTasks(projectId);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();
    await grippTasks.value.loadCsds();

    // Select first CSD by default
    csdFirstname.value = grippTasks.value.csds[0].csd_firstname;
    await grippTasks.value.loadCsdProjects(csdFirstname.value);

    // Select first project by default
    await grippTasks.value.loadTasks(grippTasks.value.csdProjects[0].id);
  });

</script>
