<template>

  <ClientOnly>

    <Loading v-if="!tasktypeAvailable.dataLoaded" />

    <div v-else class="grid grid-cols-1">

      <!-- Filter -->

      <Card>

        <h1>Available per tasktype</h1>

        <span v-for="(tasktype, index) in filter.tasktypes" :key=index>
          <button class="filter-button" @click="setTasktype(tasktype.id)">
            {{ tasktype.name }}
          </button>
        </span>

      </Card>

      <!-- Report -->

      <Card>

        <!-- Report title -->

        <div v-if="filter.tasktype">
          <h1>{{ filter.tasktype.name }}</h1>
        </div>

        <!-- Week navigation -->

        <button class="filter-button" @click="previousWeek()">-1 week</button>
        <button class="filter-button" @click="thisWeek()">Now</button>
        <button class="filter-button" @click="nextWeek()">+1 week</button>

        <!-- Data -->

        <table>

          <DateSeries :dateSeries="tasktypeAvailable.dateSeries" />

          <!-- Totals -->

          <tbody>
            <tr style="font-weight: bold">
              <td></td>
              <td></td>
              <td>Total available (FTE)</td>
              <td v-for="(date, index) in tasktypeAvailable.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeAvailable.getTotalAvailableHours(date) / 8) }}
              </td>
            </tr>
          </tbody>

          <!-- Per employee -->

          <tbody v-for="(employee, index) in tasktypeAvailable.employees" :key=index>
            <tr>
              <td>
                {{ employee.firstname }}
                {{ employee.lastname }}
                {{ employee.employee_tags == 'FREELANCE' ? '(F)' : '' }}
              </td>
              <td>{{ employee.employee_number }}</td>
              <td>{{ employee.employee_active ? 'active' : 'not active' }}</td>
              <td v-for="(date, index) in tasktypeAvailable.dateSeries" :key=index :class="bg(date)">
                {{ prettyfyNumber(tasktypeAvailable.getEmployeeAvailableHours(employee.employee_id, date) / 8) }}
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

  var date = new Date()
  var weeks = 6

  const filter = ref(new Filter())
  const tasktypeAvailable = ref(new TasktypeAvailable())

  async function setTasktype(tasktypeId: number) {
    filter.value.setTasktype(tasktypeId)
    await navigateTo(`tasktype-available?tasktypeId=${tasktypeId}`)
    await tasktypeAvailable.value.loadData(filter.value.tasktype.id, date, weeks)
  }

  async function previousWeek() {
    date.setDate(date.getDate() - 7)
    await tasktypeAvailable.value.loadData(filter.value.tasktype.id, date, weeks)
  }

  async function thisWeek() {
    date = new Date()
    await tasktypeAvailable.value.loadData(filter.value.tasktype.id, date, weeks)
  }

  async function nextWeek() {
    date.setDate(date.getDate() + 7)
    await tasktypeAvailable.value.loadData(filter.value.tasktype.id, date, weeks)
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick()

    await filter.value.loadTasktypes()

    const route = useRoute()
    if (route.query.tasktypeId) {
      filter.value.setTasktype(Number(route.query.tasktypeId))
    }

    await tasktypeAvailable.value.loadData(filter.value.tasktype.id, date, weeks)
  })

</script>
