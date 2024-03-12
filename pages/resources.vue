<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <div class="grid-1">

      <!-- Account manager selection -->

      <div class="card light-dark shadow">
        <h1>Resource demand</h1>

        <span v-for="(tasktype, index) in gripp.tasktypes" :key=index>
          <button @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>
      </div>

      <!-- Planning per account manager -->

      <div class="card light-dark shadow">

        <div v-if="gripp.tasktype">
          <h1>{{ gripp.tasktype.name }}</h1>
        </div>

        <!-- Week navigation -->

        <button @click="previousWeek()">-1 week</button>
        <button @click="thisWeek()">Now</button>
        <button @click="nextWeek()">+1 week</button>

        <table>

          <!-- Table header -->

          <tbody>

            <!-- Month series -->

            <tr>
              <td></td>
              <td></td>
              <td>Month</td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)" width="25">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total demand (hours)</td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)">
                {{ grippResources.getTotalHours(date) }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per project within tasktype scope -->

          <tbody v-for="(project, index) in grippResources.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_type }}</td>
              <td>x{{ project.project_name.slice(0, 20) }} - {{ project.project_number }}</td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)">
                {{ grippResources.getProjectTotalHours(project.project_id, date) }}
              </td>
            </tr>

            <!-- Hours per project per task per day -->

            <tr v-for="(task, index) in grippResources.getProjectsTasks(project.project_id)" :key=index>
              <td></td>
              <td></td>
              <td>{{ task.task_content }} </td>
              <td v-for="(date, index) in grippResources.dateSeries" :key=index :class="bg(date)">
                {{ grippResources.getTaskHours(task.task_id, date) }}
              </td>
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

  function bg(date: Date) {
    const week = getWeek(date);
    return {
      "aquamarine-dark": isToday(date),
      "lavender-dark": isEven(week) && !isToday(date),
      "aliceblue-dark": isOdd(week) && !isToday(date),
      "text-center": true,
      "no-padding": true
    }
  }

  var date = new Date();
  var weeks = 6;

  const gripp = ref(new Gripp());
  const grippResources = ref(new GrippResources());

  async function setTasktype(tasktypeId: number) {
    gripp.value.setTasktype(tasktypeId)
    await grippResources.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    grippResources.value.setDateSeries(date, weeks);
    await grippResources.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function thisWeek() {
    date = new Date();
    grippResources.value.setDateSeries(date, weeks);
    await grippResources.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    grippResources.value.setDateSeries(date, weeks);
    await grippResources.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadTasktypes();
    grippResources.value.setDateSeries(date, weeks);
    await grippResources.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  });

</script>
