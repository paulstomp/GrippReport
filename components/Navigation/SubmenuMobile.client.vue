<!-- Based on https://tailwindui.com/components/application-ui/navigation/navbars -->

<template>

  <Disclosure as="nav" v-slot="{ open }">

    <!-- Menu name -->

    <DisclosureButton class="block rounded-md px-3 py-2">
      <div class="inline-flex w-full justify-center py-2 text-base text-gray-400">
        {{ props.name }}
        <ChevronDownIcon v-if="!open" class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        <ChevronUpIcon v-else class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
    </DisclosureButton>

    <!-- Menu items -->

    <DisclosurePanel class="sm:hidden">
      <NuxtLink v-for="item in props.items" :key="item.name" :to="item.href" :class="[item.current ? 'text-white' : 'text-indigo-950 hover:bg-indigo-300 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">
        {{ item.name }}
      </NuxtLink>
    </DisclosurePanel>
  </Disclosure>

 </template>

 <script setup>

   import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
   import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid'

   const props = defineProps(['name', 'items']);

 </script>
