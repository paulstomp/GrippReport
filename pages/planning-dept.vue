<template>

  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <div class="grid grid-cols-1">

      <!-- Department selection -->

      <Card>
        <h1>Planning per department</h1>

        <span v-for="(department, index) in gripp.departments" :key=index>
          <button class="filter-button" @click="setDepartment(department.id)">
            {{ department.name }}
          </button>
        </span>
      </Card>

      <!-- Planning per departemt -->

      <Card>

        <div v-if="gripp.department">
          <h1>{{ gripp.department.name }}</h1>
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

          <!-- Planning per employee within department -->

          <tbody v-for="(employee, index) in grippPlanning.employees" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Total hours per employee per day -->

            <tr style="font-weight: bold">
              <td>{{ employee.firstname }} {{ employee.lastname }}</td>
              <td></td>
              <td></td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(grippPlanning.getEmployeeTotalHours(employee.employee_id, date)) }}
              </td>
            </tr>

            <!-- Planned hours per employee per project per day -->

            <tr v-for="(project, index) in grippPlanning.getEmployeeProjects(employee.employee_id)" :key=index>
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td>{{ project.project_number }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(grippPlanning.getEmployeeProjectHours(employee.employee_id, project.project_id, date)) }}
              </td>
            </tr>

            <!-- Working hours per employee per day -->

            <tr>
              <td></td>
              <td></td>
              <td>Free</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(grippPlanning.getFreeHours(employee.employee_id, date)) }}
              </td>
            </tr>

            <!-- Absence hours per employee per day -->

            <tr>
              <td></td>
              <td></td>
              <td>Absence/holidays</td>
              <td v-for="(date, index) in grippPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(grippPlanning.getAbsenceHours(employee.employee_id, date)) }}
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

  definePageMeta({ auth: true });

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

  async function setDepartment(departmentId: number) {
    gripp.value.setDepartment(departmentId)
    await grippPlanning.value.loadPlanningByDepartment(gripp.value.department.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByDepartment(gripp.value.department.id);
  }

  async function thisWeek() {
    date = new Date();
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByDepartment(gripp.value.department.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByDepartment(gripp.value.department.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadDepartments();
    grippPlanning.value.setDateSeries(date, weeks);
    await grippPlanning.value.loadPlanningByDepartment(gripp.value.department.id);
  });

</script>
