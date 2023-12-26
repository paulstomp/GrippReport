<template>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <div class="grid-1">

        <!-- Selection -->

        <div class="card light-dark shadow">
          <h1>Planning at project level</h1>

          <span v-for="(csd, index) in grippData.csds" :key=index>
            <button @click="reload(csd.csd_firstname)">
              {{ csd.csd_firstname }}
            </button>
          </span>
        </div>

        <!-- Planning per CSD -->

        <div class="card light-dark shadow">
          <h1>{{ grippData.csdFirstname}}</h1>

          <table>

            <!-- Table header -->

            <tbody>

              <!-- Month series -->

              <tr>
                <td></td>
                <td>Month</td>
                <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(getWeek(date))" width="25">
                  {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
                </td>
              </tr>

              <!-- Week series -->

              <tr>
                <td></td>
                <td>Week</td>
                <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(getWeek(date))">
                  {{ (date.getDay() == 1) ? getWeek(date) : '' }}
                </td>
              </tr>

              <!-- Day series -->

              <tr>
                <td></td>
                <td>Day</td>
                <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(getWeek(date))">
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
                <td>{{ project.project_name.slice(0, 20) }}</td>
                <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(getWeek(date))">
                  {{ grippData.getProjectTotalHours(project.project_name, date) }}
                </td>
              </tr>

              <!-- Hours per project per project per day -->

              <tr v-for="(employee, index) in grippData.getProjectsEmployees(project.project_name)" :key=index>
                <td></td>
                <td>{{ employee.firstname }} </td>
                <td v-for="(date, index) in grippData.dateSeries" :key=index :class="bg(getWeek(date))">
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

    function bg(week: number) {
      return {
        "lavender-dark": week % 2 == 0,
        "lightblue-dark": week % 2 != 0,
        "text-center": true
      }
    }

    const weeks = 7;
    const grippData = ref(new GrippData(weeks));

    function reload(csdFirsname: string) {
      grippData.value.loadPlanningByCsd(csdFirsname);
    }

    // Setup when mounted

    onMounted(async () => {
      await nextTick();
      await grippData.value.loadCsds();
      await grippData.value.loadPlanningByCsd('Marcel');
    });

  </script>

