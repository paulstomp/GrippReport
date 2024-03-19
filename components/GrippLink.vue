<template>
  <a :href="url" target="_blank">
    <img width="40" src="img/gripp.webp" class="inline-block">
  </a>
</template>

<script setup lang="ts">

  const config = useRuntimeConfig();
  const props = defineProps(['path']);
  const url = config.public.grippBaseURL + props.path;

</script>
