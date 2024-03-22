<template>

  <ClientOnly>

    <Loading v-if="!tasktypeRequired.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Filter -->

      <Card>

        <h1>Required per tasktype</h1>

        <span v-for="(tasktype, index) in filter.tasktypes" :key=index>
          <button class="filter-button" @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>

      </Card>

      <!-- Report -->

      <Card>

        <!-- Report title -->

        <div v-if="filter.tasktype">
          <h1>{{ filter.tasktype.name }}</h1>
        </div>

        <!-- Week navigation -->

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        <!-- Data -->

        <table>

          <DateSeries :dateSeries="tasktypeRequired.dateSeries" />

          <!-- Totals -->

          <tbody>
            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total required (FTE)</td>
              <td v-for="(date, index) in tasktypeRequired.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeRequired.getTotalHours(date) / 8) }}
              </td>
            </tr>
          </tbody>

          <!-- Per project -->

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

  var date = new Date();
  var weeks = 6;

  const filter = ref(new Filter());
  const tasktypeRequired = ref(new TasktypeRequired());

  async function setTasktype(tasktypeId: number) {
    filter.value.setTasktype(tasktypeId)
    await navigateTo(`tasktype-required?tasktypeId=${tasktypeId}`)
    await tasktypeRequired.value.loadData(filter.value.tasktype.id, date, weeks);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    await tasktypeRequired.value.loadData(filter.value.tasktype.id, date, weeks);
  }

  async function thisWeek() {
    date = new Date();
    await tasktypeRequired.value.loadData(filter.value.tasktype.id, date, weeks);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    await tasktypeRequired.value.loadData(filter.value.tasktype.id, date, weeks);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await filter.value.loadTasktypes();

    const route = useRoute()
    if (route.query.tasktypeId) {
      filter.value.setTasktype(Number(route.query.tasktypeId))
    }

    await tasktypeRequired.value.loadData(filter.value.tasktype.id, date, weeks);
  });

</script>
