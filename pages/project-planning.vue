<template>

  <ClientOnly>

    <Loading v-if="!projectPlanning.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Filter -->

      <Card>

        <h1>Planning per project</h1>

        <span v-for="(accountManager, index) in filter.accountManagers" :key=index>
          <button class="filter-button" @click="setAccountManager(accountManager.accountmanager_id)">
            {{ accountManager.firstname }}
          </button>
        </span>

      </Card>

      <!-- Week navigation and scoping-->

      <Card>

        Navigation:

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        Scope:

        <button class="filter-button" @click="setWeeks(1)">1 week</button>
        <button class="filter-button" @click="setWeeks(2)">2 weeks</button>
        <button class="filter-button" @click="setWeeks(6)">6 week</button>

        </Card>

      <!-- Report -->

      <Card>

        <!-- Report title -->

        <div v-if="filter.accountManager">
          <h1>{{ filter.accountManager.firstname }}</h1>
        </div>

        <!-- Data -->

        <table>

          <DateSeries :dateSeries="projectPlanning.dateSeries" />

          <!-- Per project -->

          <tbody v-for="(project, index) in projectPlanning.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_number }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in projectPlanning.dateSeries" :key=index :class="bg(date)">
                {{ projectPlanning.getProjectPlannedHoursTotal(project.project_id, date) }}
              </td>
            </tr>

            <!-- Hours per project per project per day -->

            <tr v-for="(employee, index) in projectPlanning.getProjectsEmployees(project.project_id)" :key=index>
              <td></td>
              <td></td>
              <td>{{ employee.firstname }} {{ employee.lastname }}</td>
              <td v-for="(date, index) in projectPlanning.dateSeries" :key=index :class="bg(date)">
                {{ projectPlanning.getProjectPlannedHours(project.project_id, employee.employee_id, date) }}
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
  const projectPlanning = ref(new ProjectPlanning());

  async function setAccountManager(accountManagerId: number) {
    filter.value.setAccountManager(accountManagerId)
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  }

  async function thisWeek() {
    date = new Date();
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  }

  async function setWeeks(w: number) {
    weeks = w
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await filter.value.loadAccountManagers();
    await projectPlanning.value.loadData(filter.value.accountManager.accountmanager_id, date, weeks);
  });

</script>

