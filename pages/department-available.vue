<template>

  <ClientOnly>

    <Loading v-if="!departmentPlanning.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Filter -->

      <Card>

        <h1>Availability per department</h1>

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

          <!-- Totals -->

          <tbody>
            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total available (FTE)</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getTotalAvailableHours(date) / 8) }}
              </td>
            </tr>
          </tbody>

          <!-- Per employee -->

          <tbody v-for="(employee, index) in departmentPlanning.employees" :key=index>
            <tr>
              <td>
                {{ employee.firstname }}
                {{ employee.lastname }}
                {{ employee.employee_tags == 'FREELANCE' ? '(F)' : '' }}
              </td>
              <td>{{ employee.employee_number }}</td>
              <td>{{ employee.employee_active ? 'active' : 'not active' }}</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getEmployeeAvailableHours(employee.employee_id, date) / 8) }}
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

    const route = useRoute()
    console.log(route.params)

    await filter.value.loadDepartments();
    await departmentPlanning.value.loadData(filter.value.department.id, date, weeks);
  });

</script>
