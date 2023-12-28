<template>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <div class="grid-1">

        <!-- Table count report -->

        <div class="card light-dark shadow">
            <h1>Table count</h1>
            <DataView :data=data :maxLength=20></DataView>
        </div>

        </div>
    </ClientOnly>
 </template>

<script lang="ts" setup>

    const data = ref(await query('select * from _count'));

</script>
