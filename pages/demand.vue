<template>

  <ClientOnly>

    <Loading v-if="!resourceDemand.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Account manager selection -->

      <Card>
        <h1>Demand per department</h1>

        <span v-for="(tasktype, index) in gripp.tasktypes" :key=index>
          <button class="filter-button" @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>
      </Card>

      <!-- Planning per task type -->

      <Card>
        <div v-if="gripp.tasktype">
          <h1>{{ gripp.tasktype.name }}</h1>
        </div>

        <!-- Week navigation -->

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        <table>

          <!-- Table header -->

          <tbody>

            <!-- Month series -->

            <tr>
              <td class="min-w-60 w-48"></td>
              <td class="min-w-16 w-16"></td>
              <td class="min-w-60 w-48">Month</td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Total hours per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total demand (hours)</td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)">
                {{ resourceDemand.getTotalHours(date) }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per project within tasktype scope -->

          <tbody v-for="(project, index) in resourceDemand.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_number }}</td>
              <td>x{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)">
                {{ resourceDemand.getProjectTotalHours(project.project_id, date) }}
              </td>
            </tr>

            <!-- Hours per project per task per day -->

            <tr v-for="(task, index) in resourceDemand.getProjectsTasks(project.project_id)" :key=index>
              <td></td>
              <td></td>
              <td>{{ task.task_content }} </td>
              <td v-for="(date, index) in resourceDemand.dateSeries" :key=index :class="bg(date)">
                {{ resourceDemand.getTaskHours(task.task_id, date) }}
              </td>
            </tr>

          </tbody>
        </table>
      </Card>

      <GrippSyncInfo />
    </div>

  </ClientOnly>

</template>

<script lang="ts" setup>

  definePageMeta({ auth: true })

  function bg(date: Date) {
    const week = getWeek(date);
    return {
      "bg-amber-200": isToday(date),
      "bg-indigo-50": isEven(week) && !isToday(date),
      "bg-indigo-100": isOdd(week) && !isToday(date),
      "text-center": true,
      "p-0": true
    }
  }

  var date = new Date();
  var weeks = 6;

  const gripp = ref(new Gripp());
  const resourceDemand = ref(new ResourceDemand());

  async function setTasktype(tasktypeId: number) {
    gripp.value.setTasktype(tasktypeId)
    await resourceDemand.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    resourceDemand.value.setDateSeries(date, weeks);
    await resourceDemand.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function thisWeek() {
    date = new Date();
    resourceDemand.value.setDateSeries(date, weeks);
    await resourceDemand.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    resourceDemand.value.setDateSeries(date, weeks);
    await resourceDemand.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadTasktypes();
    resourceDemand.value.setDateSeries(date, weeks);
    await resourceDemand.value.loadPlanningByTasktype(gripp.value.tasktype.id);
  });

</script>
