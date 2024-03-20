<template>
  <ClientOnly>

    <Loading v-if="!departmentPlanning.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Department selection -->

      <Card>
        <h1>Availability per department</h1>

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
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Total hours per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total available (hours)</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getTotalAvailableHours(date)) }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per employee within department -->

          <tbody v-for="(employee, index) in departmentPlanning.employees" :key=index>

            <!-- Total hours per employee per day -->

            <tr>
              <td>
                {{ employee.firstname }}
                {{ employee.lastname }}
                {{ employee.employee_tags == 'FREELANCE' ? '(F)' : '' }}
              </td>
              <td>{{ employee.employee_number }}</td>
              <td>{{ employee.employee_active ? 'active' : 'not active' }}</td>
              <td v-for="(date, index) in departmentPlanning.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(departmentPlanning.getEmployeeAvailableHours(employee.employee_id, date)) }}
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
  const departmentPlanning = ref(new DepartmentPlanning());

  async function setDepartment(departmentId: number) {
    gripp.value.setDepartment(departmentId)
    await departmentPlanning.value.loadPlanning(gripp.value.department.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    departmentPlanning.value.setDateSeries(date, weeks);
    await departmentPlanning.value.loadPlanning(gripp.value.department.id);
  }

  async function thisWeek() {
    date = new Date();
    departmentPlanning.value.setDateSeries(date, weeks);
    await departmentPlanning.value.loadPlanning(gripp.value.department.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    departmentPlanning.value.setDateSeries(date, weeks);
    await departmentPlanning.value.loadPlanning(gripp.value.department.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadDepartments();
    departmentPlanning.value.setDateSeries(date, weeks);
    await departmentPlanning.value.loadPlanning(gripp.value.department.id);
  });

</script>
