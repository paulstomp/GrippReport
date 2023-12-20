<template>

  <div class="grid-1">
    <div>
      <h1>Gripp Planning</h1>

      <ClientOnly fallback-tag="span" fallback="Loading comments...">
        <table>

          <!-- Months -->

          <tr>
            <td></td>
            <td v-for="date in dateSeries" width="25">
              {{ (date.getDate() == 1) ? date.getMonth() + 1 : '' }}
            </td>
          </tr>

          <!-- Weeks -->

          <tr>
            <td></td>
            <td v-for="date in dateSeries">
              {{ (date.getDay() == 1) ? getWeek(date) : '' }}
            </td>
          </tr>

          <!-- Days -->

          <tr>
            <td></td>
            <td v-for="date in dateSeries">
              {{ date.getDate() }}
            </td>
          </tr>

          <!-- Employees -->

          <tr v-for="employee in employees">
            <td>{{ employee.firstname }} </td>
            <td v-for="date in dateSeries">
              0
            </td>
          </tr>

        </table>
      </ClientOnly>

    </div>
  </div>

</template>

<script lang="ts" setup>

  definePageMeta({ auth: false })

  function getDateStr(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  function getWeek(date: Date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000)
      + onejan.getDay() + 1) / 7);
  }

  function getDateSeries(weeks: number) {
    var result: Date[] = [];
    var date = new Date();

    date.setDate(date.getDate() - (date.getDay() + 7) % 7); // Previous Monday

    for(let i = 0; i < weeks * 7; i++) {
      date.setDate(date.getDate() + 1);
      if(date.getDay() >= 1 && date.getDay() <= 5) { // Only working days
        result.push(new Date(date));
      }
    }
    return result;
  }

  var dateSeries = ref(getDateSeries(8));
  var minDate = dateSeries.value[0];
  var maxDate = dateSeries.value[dateSeries.value.length - 1];

  console.log(minDate);
  console.log(maxDate);

  var department = '7. Tech';

  var employees: any;
  employees = await query(`select distinct firstname
    from _calendaritems
    where department_name = "${department}"
    and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

  var hours: any;
  hours = await query(`select department_name, company_name, project_name, 
    firstname, date_str, hours
    from _calendaritems
    where department_name = "${department}"
    and date >= "${getDateStr(minDate)}" and date <= "${getDateStr(maxDate)}"`);

  console.log('employees: ' + JSON.stringify(employees, null, 2));

</script>
