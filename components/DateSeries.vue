<template>
  <tbody>

    <!-- Month series -->

    <tr>
      <td class="min-w-60 w-48"></td>
      <td class="min-w-16 w-16"></td>
      <td class="min-w-60 w-48">Month</td>
      <td v-for="(date, index) in dateSeries" :key=index :class="bg(date)" class="min-w-10 w-10">
        {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
      </td>
    </tr>

    <!-- Week series -->

    <tr>
      <td></td>
      <td></td>
      <td>Week</td>
      <td v-for="(date, index) in dateSeries" :key=index :class="bg(date)">
        {{ (date.getDay() == 1) ? getWeek(date) : '' }}
      </td>
    </tr>

    <!-- Day series -->

    <tr>
      <td></td>
      <td></td>
      <td>Day</td>
      <td v-for="(date, index) in dateSeries" :key=index :class="bg(date)">
        {{ date.getDate() }}
      </td>
    </tr>

  </tbody>
</template>

<script setup lang="ts">

  const props = defineProps(['dateSeries']);
  const dateSeries = props.dateSeries;

</script>
