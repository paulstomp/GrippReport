<template>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <div class="grid-1-1-1">

        <!-- Table count report -->

        <div class="card light-dark shadow">
            <h1>Table count</h1>
            <DataView :data=countData :maxLength=20></DataView>
        </div>

        <!-- Snapshot report -->

        <div class="card light-dark shadow">
            <h1>Snapshots</h1>
            <DataView :data=snapshotData :maxLength=20></DataView>
        </div>

        <!-- Log report -->

        <div class="card light-dark shadow">
            <h1>Log</h1>
            <DataView :data=logData></DataView>
        </div>

        </div>
    </ClientOnly>
 </template>

<script lang="ts" setup>

    var countData = ref(await query('select * from _count'));
    var snapshotData = ref(await query('select * from _calendaritems_snapshots'));
    var logData = ref(await query('select * from _log limit 10'));

</script>
