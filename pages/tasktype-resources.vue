<template>
  <ClientOnly>

    <Loading v-if="!tasktypeResources.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Account manager selection -->

      <Card>
        <h1>Resources per tasktype</h1>

        <span v-for="(tasktype, index) in gripp.tasktypes" :key=index>
          <button class="filter-button" @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>
      </Card>

      <!-- Resources for tasktype -->

      <Card>
        <div v-if="gripp.tasktype">
          <h1>{{ gripp.tasktype.name }}</h1>
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
              <td v-for="(date, index) in tasktypeResources.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in tasktypeResources.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in tasktypeResources.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Total FTE per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total resources (FTE)</td>
              <td v-for="(date, index) in tasktypeResources.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeResources.getTotalHours(date) / 8) }}
              </td>
            </tr>

          </tbody>

          <!-- Resources per employee for tasktype -->

          <tbody v-for="(employee, index) in tasktypeResources.employees" :key=index>

            <!-- Total FTE per employee per day -->

            <tr>
              <td>
                {{ employee.firstname }}
                {{ employee.lastname }}
                {{ employee.employee_tags == 'FREELANCE' ? '(F)' : '' }}
              </td>
              <td>{{ employee.employee_number }}</td>
              <td>{{ employee.employee_active ? 'active' : 'not active' }}</td>
              <td v-for="(date, index) in tasktypeResources.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeResources.getEmployeeHours(employee.employee_id, date) / 8) }}
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

  definePageMeta({ auth: true })

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
  const tasktypeResources = ref(new TasktypeResources());

  async function setTasktype(tasktypeId: number) {
    gripp.value.setTasktype(tasktypeId)
    await tasktypeResources.value.loadData(gripp.value.tasktype.id);
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    tasktypeResources.value.setDateSeries(date, weeks);
    await tasktypeResources.value.loadData(gripp.value.tasktype.id);
  }

  async function thisWeek() {
    date = new Date();
    tasktypeResources.value.setDateSeries(date, weeks);
    await tasktypeResources.value.loadData(gripp.value.tasktype.id);
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    tasktypeResources.value.setDateSeries(date, weeks);
    await tasktypeResources.value.loadData(gripp.value.tasktype.id);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await gripp.value.loadTasktypes();
    tasktypeResources.value.setDateSeries(date, weeks);
    await tasktypeResources.value.loadData(gripp.value.tasktype.id);
  });

</script>
