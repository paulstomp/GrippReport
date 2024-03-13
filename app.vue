<template>
  <div>
    <NavigationMenu/>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">

  useHead({
    title: 'Gripp planning'
  })

  const config = useRuntimeConfig();

  console.log('SERVER_KEY_EXAMPLE: ' + config.serverKeyExample);
  console.log('PUBLIC_KEY_EXAMPLE: ' + config.public.publicKeyExample);

</script>
