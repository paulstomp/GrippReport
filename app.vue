<template>
  <div class="px-6 overflow-hidden">
    <NavigationMenu/>
    <NuxtPage/>
  </div>
</template>

<script setup lang="ts">

  useHead({
    title: 'Gripp planning',
    bodyAttrs: {class: 'bg-blue-950'}
  })

  const config = useRuntimeConfig();

  console.log('SERVER_KEY_EXAMPLE: ' + config.serverKeyExample);
  console.log('PUBLIC_KEY_EXAMPLE: ' + config.public.publicKeyExample);
  console.log('GRIPP_BASE_URL: ' + config.public.grippBaseURL);

</script>
