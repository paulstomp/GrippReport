<template>

  <ClientOnly>

    <Loading v-if="!departmentPlanning.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Filter -->

      <Card>

        <h1>Booked hours per department</h1>

        <span v-for="(department, index) in filter.departments" :key=index>
          <button class="filter-button" @click="setDepartment(department.id)">
            {{ department.name }}
          </button>
        </span>

      </Card>

      <!-- Report -->

      <Card>

        <!-- Report title -->

        <div v-if="filter.department">
          <h1>{{ filter.department.name }}</h1>
        </div>

        <!-- Week navigation -->

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        <!-- Data -->

        <table>

          <DateSeries :dateSeries="departmentPlanning.dateSeries" />

          <!-- Per employee  -->

          <tbody v-for="(employee, index) in departmentPlanning.employees" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Booked hours per employee per day -->

            <tr style="font-weight: bold">
              <td>{{ employee.firstname }} {{ employee.lastname }}</td>
              <td></td>
              <td></td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getEmployeeBookedHoursTotal(employee.employee_id, date)) }}
              </td>
            </tr>

            <!-- Booked hours per employee per project per day -->

            <tr v-for="(project, index) in departmentPlanning.getEmployeeProjects(employee.employee_id)" :key=index>
              <td>{{ project.company_name.slice(0, 20) }}</td>
              <td>{{ project.project_number }}</td>
              <td>{{ project.project_name.slice(0, 20) }}</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(
                  departmentPlanning.getEmployeeBookedHours(employee.employee_id, project.project_id, date)) }}
              </td>
            </tr>

            <!-- Off schedule hours per employee per day -->

            <tr>
              <td></td>
              <td></td>
              <td>Off schedule</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(
                  departmentPlanning.getEmployeeOffScheduleHours(employee.employee_id, date)) }}
              </td>
            </tr>

            <!-- Absence hours per employee per day -->

            <tr>
              <td></td>
              <td></td>
              <td>Absence/holiday</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getEmployeeAbsenceHours(employee.employee_id, date)) }}
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

  var date = new Date();
  var weeks = 6;

  const filter = ref(new Filter());
  const departmentPlanning = ref(new DepartmentPlanning());

  async function setDepartment(departmentId: number) {
    filter.value.setDepartment(departmentId)
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  }

  async function thisWeek() {
    date = new Date();
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await filter.value.loadDepartments();
    date.setDate(date.getDate() - 35);
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  });

</script>
