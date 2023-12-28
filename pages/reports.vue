<template>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <div class="grid-1">

        <!-- Hour report -->

        <div class="card light-dark shadow">
            <h1>Project hours</h1>
            <DataView :data=data :maxLength=20></DataView>
        </div>

        </div>
    </ClientOnly>
</template>

<script lang="ts" setup>

    const sql = `select csd_firstname, company, project, type, hours_offered, ` +
        `hours_planned, hours_planned_until_today, hours_booked, ` +
        `hours_left, hours_planned_from_today, hours_balance ` +
        `from _project_hours ` +
        `where planned_to >= curdate()`

    const data = ref(await query(sql));

</script>
