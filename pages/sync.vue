<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">

    <div class="grid grid-cols-1 md:grid-cols-3">

      <!-- Table count report -->

      <Card>
          <h1>Table count</h1>
          <DataView :data=countData :maxLength=20></DataView>
      </Card>

      <!-- Snapshot report -->

      <Card>
          <h1>Snapshots</h1>
          <DataView :data=snapshotData :maxLength=20></DataView>
      </Card>

      <!-- Log report -->

      <Card>
          <h1>Log</h1>
          <DataView :data=logData></DataView>
      </Card>

    </div>

  </ClientOnly>
</template>

<script lang="ts" setup>

    var countData = ref(await query('select * from _count'));
    var snapshotData = ref(await query('select * from _calendaritems_snapshots'));
    var logData = ref(await query('select * from _log limit 10'));

</script>
