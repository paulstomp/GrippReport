<template>
  <ClientOnly fallback-tag="span" fallback="Loading comments...">
    <Card>

      <h1>Sync info</h1>
      Last sync at {{ lastSyncDatetime }}

    </Card>
  </ClientOnly>
</template>

<script setup lang="ts">

    var lastSyncDatetime = ref('');

    onMounted(async () => {
      await nextTick();
      const result = await query(
        `select convert_tz(cast(createdon as char), '+00:00','+01:00') as createdon_str `+
        `from log order by id desc limit 1;`);

      lastSyncDatetime.value = result[0].createdon_str;
    });

</script>
