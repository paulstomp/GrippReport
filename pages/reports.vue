<template>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
        <div class="grid-1">

            <!-- Hour report -->

            <div class="card light-dark shadow">

                <h1>Project hours</h1>

                <p>booked gap = booked - planned until today</p>
                <p>budgeted left = budgeted - booked</p>
                <p>balance = budgeted left - planned from today</p>

                <DataView :data=data :maxLength=20></DataView>
            </div>

        </div>
    </ClientOnly>
</template>

<script lang="ts" setup>

    const sql = `select csd_firstname as csd, company, name as project, hours_offered as budgeted, ` +
        `hours_planned as planned, hours_planned_until_today as planned_until_today, ` +
        `hours_booked as booked, hours_booked_gap as booked_gap, ` +
        `hours_left as budgeted_left, hours_planned_from_today as planned_from_today, ` +
        `hours_balance as balance ` +
        `from _project_hours ` +
        `where planned_to >= curdate()`

    const data = ref(await query(sql));

</script>
