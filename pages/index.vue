<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <div class="grid-1">

      <!-- Title and selection -->

      <div class="card light-dark shadow">
        <h1>Planning at department level</h1>

        <span v-for="(department, index) in grippData.departments" :key=index>
          <button @click="setDepartment(department.name)">
            {{ department.name }}
          </button>
        </span>
      </div>

      <!-- Planning per departemt -->

      <div class="card light-dark shadow">
        <h1>{{ grippData.departmentName }}</h1>

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

          <!-- Planning per employee within department -->

          <tbody v-for="(employee, index) in grippData.employees" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Hours per employee per day -->

            <tr style="font-weight: bold">
              <td>{{ employee.firstname }}</td>
              <td></td>
              <td></td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(date)">
                {{ grippData.getEmployeeTotalHours(employee.firstname, date) }}
              </td>
            </tr>

            <!-- Hours per employee per project per day -->

            <tr v-for="(project, index) in grippData.getEmployeeProjects(employee.firstname)" :key=index>
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td>{{ project.project_type }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
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

  definePageMeta({ auth: true });

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
  var department = '1. Creatie';

  const grippData = ref(new GrippData(date, weeks));

  async function reload() {
    grippData.value = new GrippData(date, weeks);
    await grippData.value.loadDepartments();
    await grippData.value.loadPlanningByDepartment(department);
  }

  async function setDepartment(toDepartment: string) {
    department = toDepartment;
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
