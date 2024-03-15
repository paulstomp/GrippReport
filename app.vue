<template>
  <body class="bg-blue-950">
    <div class="px-6 overflow-hidden">
      <NavigationMenu/>
      <NuxtPage />
    </div>
  </body>
</template>

<script setup lang="ts">

  useHead({
    title: 'Gripp planning'
  })

  const config = useRuntimeConfig();

  console.log('SERVER_KEY_EXAMPLE: ' + config.serverKeyExample);
  console.log('PUBLIC_KEY_EXAMPLE: ' + config.public.publicKeyExample);

</script>
