<template>

  <ClientOnly>

    <Loading v-if="!tasktypeOverview.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Report -->

      <Card>

        <!-- Title -->

        <div>
          <h1>Resources overview</h1>
        </div>

        <!-- Week navigation -->

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        <!-- Data -->

        <table>

          <DateSeries :dateSeries="tasktypeOverview.dateSeries" />

          <!-- Totals -->

          <tbody>
            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total availalbe (FTE)</td>
              <td v-for="(date, index) in tasktypeOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeOverview.getTotalAvailableHours(date) / 8) }}
              </td>
            </tr>

            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total required (FTE)</td>
              <td v-for="(date, index) in tasktypeOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeOverview.getTotalRequiredHours(date) / 8) }}
              </td>
            </tr>
          </tbody>

          <!-- Per tasktype -->

          <tbody v-for="(taskttype, index) in tasktypeOverview.tasktypes" :key=index>

            <!-- Spacer -->

            <tr>
              <td>&nbsp;</td>
            </tr>

            <!-- Available per day for tasktype -->

            <tr>
              <td>{{ taskttype.name.slice(0, 20) }}</td>
              <td></td>
              <td>
                <NuxtLink :to="`tasktype-available?tasktypeId=${taskttype.id}`" class="underline">
                  Available
                </NuxtLink>
              </td>
              <td v-for="(date, index) in tasktypeOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeOverview.getTasktypeAvailableHours(taskttype.id, date) / 8) }}
              </td>
            </tr>

            <!-- Required hours per day for tasktype -->

            <tr>
              <td></td>
              <td></td>
              <td>
                <NuxtLink :to="`tasktype-required?tasktypeId=${taskttype.id}`" class="underline">
                  Required
                </NuxtLink>
              </td>
              <td v-for="(date, index) in tasktypeOverview.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeOverview.getTasktypeRequiredHours(taskttype.id, date) / 8) }}
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

  var date = new Date();
  var weeks = 6;

  const tasktypeOverview = ref(new TasktypeOverview())

  async function previousWeek() {
    date.setDate(date.getDate() - 7)
    await tasktypeOverview.value.loadData(date, weeks)
  }

  async function thisWeek() {
    date = new Date();
    await tasktypeOverview.value.loadData(date, weeks)
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7);
    await tasktypeOverview.value.loadData(date, weeks)
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    await tasktypeOverview.value.loadData(date, weeks)
  });

</script>
