<!-- Based on https://tailwindui.com/components/application-ui/navigation/navbars -->

<template>

  <Disclosure as="nav" v-slot="{ open }">

    <div class="max-full">
      <div class="relative flex h-16 items-center justify-between">

        <!-- Menu button (mobile) -->

        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-indigo-400 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <!-- Logo (desktop & mobile) and navigation (desktop) -->

        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

          <!-- Logo (desktop & mobile)

          <div class="flex flex-shrink-0 items-center">
            <img class="h-8 w-auto" src="/logo.png" alt="Steps Ahead" />
          </div> -->

          <!-- Navigation (desktop) -->

          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <div v-for="item in navigation" :key="item.name">

                <!-- If childs, then show submenu -->

                <NavigationSubmenuDesktop v-if="item.childs" :name=item.name :items=item.childs />

                <!-- If no childs, then show direct link -->

                <div v-else>
                  <NuxtLink :to="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-white hover:hover:text-blue-900 hover:bg-white', 'inline-flex w-full justify-center gap-x-1.5 rounded-md px-2 py-2 text-sm']" :aria-current="item.current ? 'page' : undefined">
                    {{ item.name }}
                  </NuxtLink>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Login/logout (desktop & mobile) -->

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <a v-if="status === 'authenticated'" @click="signOut({ callbackUrl: '/' })" href="" class="text-indigo-950 rounded-md px-3 py-2 text-sm font-medium">
            Logout
          </a>

          <a v-else @click="signIn('credentials')" href="" class="text-indigo-950 rounded-md px-3 py-2 text-sm font-medium">
            Login
          </a>
        </div>

      </div>
    </div>

    <!-- Navigation (mobile) -->

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">

        <div v-for="item in navigation" :key="item.name">

          <!-- If childs, then show submenu -->

          <NavigationSubmenuMobile v-if="item.childs" :name=item.name :items=item.childs  />

          <!-- If no childs, then show direct link -->

          <NuxtLink v-else :to="item.href" :class="[item.current ? 'text-white' : 'text-indigo-950 hover:bg-indigo-300 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">
            {{ item.name }}
          </NuxtLink>

        </div>
      </div>
    </DisclosurePanel>

  </Disclosure>

</template>

<script setup>

  import { Disclosure, DisclosureButton, DisclosurePanel  } from '@headlessui/vue'
  import { Bars3Icon, XMarkIcon  } from '@heroicons/vue/24/outline'

  const { status, data, signOut, signIn } = useAuth();

  const navigation = [

    { name: 'Planning', childs: [
      { name: 'Department', href: 'department-planning' },
      { name: 'Project', href: 'project-planning' }
    ] },

    { name: 'Booked hours', childs: [
      { name: 'Department', href: 'department-booked' },
      { name: 'Project', href: 'project-booked' }
    ] },

    { name: 'Resources', childs: [
      { name: 'Resources', href: 'tasktype-resources' },
      { name: 'Required', href: 'tasktype-required' },
      { name: 'Overview', href: 'resource-overview' }
    ] },

    { name: 'Project tasks', href: 'project-tasks' }
  ]

</script>
