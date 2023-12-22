<template>

  <div class="grid-1">

    <div class="card lavender-dark">
      <h1>Departments</h1>

      <ClientOnly fallback-tag="span" fallback="Loading comments...">

        <span v-for="(department, index) in grippData.departments" :key=index>
          <button @click="reload(department.name)">
            {{ department.name }}
          </button>
        </span>

        <h2>{{ grippData.department }}</h2>

        <table>

          <!-- Table header -->

          <tbody>

            <!-- Month starts -->

            <tr>
              <td></td>
              <td>Month</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index width="25">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week starts -->

            <tr>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Days -->

            <tr>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ date.getDate() }}
              </td>
            </tr>

          </tbody>

          <!-- Hours per employee -->

          <tbody v-for="(employee, index) in grippData.employees" :key=index>

            <tr><td>&nbsp;</td></tr>

            <!-- Total hours -->

            <tr style="font-weight: bold">
              <td>{{ employee.firstname }}</td>
              <td></td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ grippData.getEmployeeTotalHours(employee.firstname, date) }}
              </td>
            </tr>

            <!-- Hours per project -->

            <tr v-for="(project, index) in grippData.getEmployeeProjects(employee.firstname)" :key=index>
              <td>{{ project.company_name.slice(0, 20) }} </td>
              <td>{{ project.project_name.slice(0, 20) }} </td>
              <td v-for="(date, index) in grippData.dateSeries" :key=index>
                {{ grippData.getEmployeeProjectHours(employee.firstname, project.project_name, date) }}
              </td>
            </tr>

          </tbody>

        </table>

      </ClientOnly>

    </div>
  </div>

</template>

<script lang="ts" setup>

  definePageMeta({ auth: false })

  const weeks = 6;
  const grippData = ref(new GrippData(weeks));

  function reload(department: string) {
    grippData.value.loadDepartmentData(department);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();
    await grippData.value.loadDepartments();
    await grippData.value.loadDepartmentData('7. Tech');
  });

</script>
