<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <div class="grid-1">

      <!-- Selection -->

      <div class="card light-dark shadow">
        <h1>Planning at project level</h1>

        <span v-for="(csd, index) in grippData.csds" :key=index>
          <button @click="setCsd(csd.csd_firstname)">
            {{ csd.csd_firstname }}
          </button>
        </span>
      </div>

      <!-- Planning per CSD -->

      <div class="card light-dark shadow">
        <h1>{{ grippData.csdFirstname}}</h1>

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
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)" width="25">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per project within CSD scope -->

          <tbody v-for="(project, index) in grippData.projects" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per project per day -->

            <tr style="font-weight: bold">
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td style="font-weight: 400">{{ project.project_type }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)">
                {{ grippData.getProjectTotalHours(project.project_name, date) }}
              </td>
            </tr>

            <!-- Hours per project per project per day -->

            <tr v-for="(employee, index) in grippData.getProjectsEmployees(project.project_name)" :key=index>
              <td></td>
              <td></td>
              <td>{{ employee.firstname }} </td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)">
                {{ grippData.getEmployeeProjectHours(employee.firstname, project.project_name, date) }}
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Sync info -->

      <div class="card light-dark shadow">
        <h1>Sync info</h1>
        Last sync at {{ grippData.lastSyncDatetime }}
      </div>

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
      "text-center": true
    }
  }

  var date = new Date();
  var weeks = 6;
  var csd = 'Marcel';

  const grippData = ref(new GrippData(date, weeks));

  async function reload() {
    grippData.value = new GrippData(date, weeks);
    await grippData.value.loadCsds();
    await grippData.value.loadPlanningByCsd(csd);
  }

  async function setCsd(toCsd: string) {
    csd = toCsd;
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

