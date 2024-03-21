<template>
  <ClientOnly>

    <Loading v-if="!resourceOverview.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Planning per tasktype -->

      <Card>
        <div>
          <h1>Available vs required</h1>
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
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
                {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
              </td>
            </tr>

            <!-- Week series -->

            <tr>
              <td></td>
              <td></td>
              <td>Week</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ (date.getDay() == 1) ? getWeek(date) : '' }}
              </td>
            </tr>

            <!-- Day series -->

            <tr>
              <td></td>
              <td></td>
              <td>Day</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ date.getDate() }}
              </td>
            </tr>

            <!-- Total FTE per day -->

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total resources (FTE)</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(resourceOverview.getTotalWorkingHours(date) / 8) }}
              </td>
            </tr>

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total required (FTE)</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(resourceOverview.getTotalRequiredHours(date) / 8) }}
              </td>
            </tr>

          </tbody>

          <!-- Resources and required -->

          <tbody v-for="(taskType, index) in resourceOverview.taskTypes" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Resources per day for tasktype -->

            <tr>
              <td>{{ taskType.name.slice(0, 20) }}</td>
              <td></td>
              <td>Resources</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(resourceOverview.getTasktypeWorkingHours(taskType.id, date) / 8) }}
              </td>
            </tr>

            <!-- Required hours per day for tasktype -->

            <tr>
              <td></td>
              <td></td>
              <td>Required</td>
              <td v-for="(date, index) in resourceOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(resourceOverview.getTasktypeRequiredHours(taskType.id, date) / 8) }}
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

  const resourceOverview = ref(new ResourceOverview());

  async function previousWeek() {
    date.setDate(date.getDate() - 7);
    resourceOverview.value.setDateSeries(date, weeks);
    await resourceOverview.value.loadData();
  }

  async function thisWeek() {
    date = new Date();
    resourceOverview.value.setDateSeries(date, weeks);
    await resourceOverview.value.loadData();
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    resourceOverview.value.setDateSeries(date, weeks);
    await resourceOverview.value.loadData();
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    resourceOverview.value.setDateSeries(date, weeks);
    await resourceOverview.value.loadData();
  });

</script>
