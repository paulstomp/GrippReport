<template>

  <div class="grid-1">
    <div>
      <h1>Gripp Planning</h1>
    </div>
  </div>

</template>

<script lang="ts" setup>

  definePageMeta({ auth: false })

  var response: any;
  response = await query('select * from calendaritems order by id desc limit 10');
  console.log('response: ' + JSON.stringify(response[0], null, 2));

  function getDateArray(weeks: number) {
    var result: string[] = [];
    var date = new Date();
    date.setDate(date.getDate() - (date.getDay() + 7) % 7);

    for(let i = 0; i < weeks * 7; i++) {
      date.setDate(date.getDate() + 1);
      var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      result.push(dateStr);
    }
    return result;
  }

  console.log(getDateArray(1));


</script>
