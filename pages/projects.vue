<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <div class="grid-1">

      <!-- CSD selection -->

      <div class="card light-dark shadow">
        <h1>Planning at project level</h1>

        <span v-for="(csd, index) in grippPlanning.csds" :key=index>
          <button @click="setCsd(csd.csd_firstname)">
            {{ csd.csd_firstname }}
          </button>
        </span>
      </div>

      <!-- Planning per CSD -->

      <div class="card light-dark shadow">
        <h1>{{ grippPlanning.csdFirstname}}</h1>

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
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)" width="25">
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

          <!-- Planning per project within CSD scope -->

          <tbody v-for="(project, index) in grippPlanning.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_type }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ grippPlanning.getProjectTotalHours(project.project_id, date) }}
              </td>
            </tr>

            <!-- Hours per project per project per day -->

            <tr v-for="(employee, index) in grippPlanning.getProjectsEmployees(project.project_name)" :key=index>
              <td></td>
              <td></td>
              <td>{{ employee.firstname }} </td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ grippPlanning.getEmployeeProjectHours(employee.firstname, project.project_id, date) }}
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
  var csdFirstname = 'Marcel';

  const grippPlanning = ref(new GrippPlanning(date, weeks));

  async function reload() {
    grippPlanning.value = new GrippPlanning(date, weeks);
    await grippPlanning.value.loadCsds();
    await grippPlanning.value.loadPlanningByCsd(csdFirstname);
  }

  async function setCsd(toCsdFirstname: string) {
    csdFirstname = toCsdFirstname;
    await reload();
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    await reload();
  }

  async function thisWeek() {
    date = new Date();
    await reload();
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    await reload();
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();
    await reload();
  });

</script>

