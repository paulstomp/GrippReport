<!-- Based on https://tailwindui.com/components/application-ui/elements/dropdowns -->

<template>

  <Menu as="div" class="relative inline-block text-left">

    <!-- Menu name -->

    <div>
      <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-white hover:text-blue-900 hover:bg-gray-50">
        {{ props.name }}
        <ChevronDownIcon class="-mr-1 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <!-- Menu items -->

    <MenuItems class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg">
      <div class="py-1">
        <MenuItem v-for="item in props.items" :key="item.name" v-slot="{ active, close }">
          <NuxtLink :to="item.href" :class="[active ? 'bg-gray-100 hover:text-blue-900' : 'hover:text-blue-900', 'block px-4 py-2 text-sm']">

            <!-- Force closing, see https://stackoverflow.com/questions/72775878/nuxt-click-does-not-work-with-nuxt-link -->
            <span @click="close">
              <div class="w-full">{{ item.name }}</div>
            </span>

          </NuxtLink>
        </MenuItem>
      </div>
    </MenuItems>

  </Menu>

</template>

<script setup>

  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { ChevronDownIcon } from '@heroicons/vue/20/solid'

  const props = defineProps(['name', 'items']);

</script>
