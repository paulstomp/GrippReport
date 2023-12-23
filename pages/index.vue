<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <!-- Selection -->

    <div class="grid-1">
      <div class="card light-dark shadow">
        <h1>Planning at department level</h1>

        <span v-for="(department, index) in grippData.departments" :key=index>
          <button @click="reload(department.name)">
            {{ department.name }}
          </button>
        </span>
      </div>

      <!-- Planning per departemt -->

      <div class="card light-dark shadow">
        <h1>{{ grippData.departmentName }}</h1>

        <table>

          <!-- Table header -->

          <tbody>

            <!-- Month series -->

            <tr>
              <td></td>
              <td>Month</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index width="25">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ date.getDate() }}
              </td>
            </tr>

          </tbody>

          <!-- Planning per employee within department -->

          <tbody v-for="(employee, index) in grippData.employees" :key=index>

            <tr><td>&nbsp;</td></tr>

            <!-- Hours per employee per day -->

            <tr style="font-weight: bold">
              <td>{{ employee.firstname }}</td>
              <td></td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ grippData.getEmployeeTotalHours(employee.firstname, date) }}
              </td>
            </tr>

            <!-- Hours per employee per project per day -->

            <tr v-for="(project, index) in grippData.getEmployeeProjects(employee.firstname)" :key=index>
              <td>{{ project.company_name.slice(0, 20) }} </td>
              <td>{{ project.project_name.slice(0, 20) }} </td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ grippData.getEmployeeProjectHours(employee.firstname, project.project_name, date) }}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

  </ClientOnly>
</template>

<script lang="ts" setup>

  definePageMeta({ auth: false })

  const weeks = 7;
  const grippData = ref(new GrippData(weeks));

  function reload(department: string) {
    grippData.value.loadPlanningByDepartment(department);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();
    await grippData.value.loadDepartments();
    await grippData.value.loadPlanningByDepartment('7. Tech');
  });

</script>
