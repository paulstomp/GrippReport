<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <div class="grid grid-cols-1">

      <!-- Account manager selection -->

      <Card>
        <h1>Planning per project</h1>

        <span v-for="(accountManager, index) in gripp.accountManagers" :key=index>
          <button class="filter-button" @click="setAccountManager(accountManager.accountmanager_id)">
            {{ accountManager.firstname }}
          </button>
        </span>
      </Card>

      <!-- Planning per account manager -->

      <Card>
        <div v-if="gripp.accountManager">
          <h1>{{ gripp.accountManager.firstname }}</h1>
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
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per project within account manager scope -->

          <tbody v-for="(project, index) in grippPlanning.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_number }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ grippPlanning.getProjectTotalHours(project.project_id, date) }}
              </td>
            </tr>

            <!-- Hours per project per project per day -->

            <tr v-for="(employee, index) in grippPlanning.getProjectsEmployees(project.project_id)" :key=index>
              <td></td>
              <td></td>
              <td>{{ employee.firstname }} {{ employee.lastname }}</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ grippPlanning.getEmployeeProjectHours(employee.employee_id, project.project_id, date) }}
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
  const grippPlanning = ref(new GrippPlanning());

  async function setAccountManager(accountManagerId: number) {
    gripp.value.setAccountManager(accountManagerId)
    await grippPlanning.value.loadPlanningByAccountManager(gripp.value.accountManager.accountmanager_id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByAccountManager(gripp.value.accountManager.accountmanager_id);
  }

  async function thisWeek() {
    date = new Date();
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByAccountManager(gripp.value.accountManager.accountmanager_id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByAccountManager(gripp.value.accountManager.accountmanager_id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadAccountManagers();
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByAccountManager(gripp.value.accountManager.accountmanager_id);
  });

</script>

