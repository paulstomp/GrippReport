<template>
  <ClientOnly>

    <Loading v-if="!tasktypeRequired.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Account manager selection -->

      <Card>
        <h1>Required per tasktype</h1>

        <span v-for="(tasktype, index) in gripp.tasktypes" :key=index>
          <button class="filter-button" @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>
      </Card>

      <!-- Required of tasktype -->

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
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Total FTE per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total required (FTE)</td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeRequired.getTotalHours(date) / 8) }}
              </td>
            </tr>

          </tbody>

          <!-- Required per project for tasktype -->

          <tbody v-for="(project, index) in tasktypeRequired.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- FTE per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td>
                <GrippLink
                  :path="'/' + project.project_type + '/view/' + project.project_id"
                  :key="project.project_id"
                />
              </td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeRequired.getProjectHours(project.project_id, date) / 8) }}
              </td>
            </tr>

            <!-- FTE per project per task per day -->

            <tr v-for="(task, index) in tasktypeRequired.getProjectsTasks(project.project_id)" :key=index>
              <td></td>
              <td></td>
              <td>{{ task.task_content }} </td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeRequired.getTaskHours(task.task_id, date) / 8) }}
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
  const tasktypeRequired = ref(new TasktypeRequired());

  async function setTasktype(tasktypeId: number) {
    gripp.value.setTasktype(tasktypeId)
    await tasktypeRequired.value.loadData(gripp.value.tasktype.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    tasktypeRequired.value.setDateSeries(date, weeks);
    await tasktypeRequired.value.loadData(gripp.value.tasktype.id);
  }

  async function thisWeek() {
    date = new Date();
    tasktypeRequired.value.setDateSeries(date, weeks);
    await tasktypeRequired.value.loadData(gripp.value.tasktype.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    tasktypeRequired.value.setDateSeries(date, weeks);
    await tasktypeRequired.value.loadData(gripp.value.tasktype.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadTasktypes();
    tasktypeRequired.value.setDateSeries(date, weeks);
    await tasktypeRequired.value.loadData(gripp.value.tasktype.id);
  });

</script>
