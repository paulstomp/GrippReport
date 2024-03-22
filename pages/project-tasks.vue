[<template>

  <ClientOnly>

    <Loading v-if="!projectTasks.dataLoaded" />

    <!-- Filter -->

    <div v-else class="grid grid-cols-1 md:grid-cols-3">

      <!-- Account manager filter -->

      <Card>

        <h1>CSD</h1>

        <span v-for="(accountManager, index) in filter.accountManagers" :key=index>
          <button class="filter-button" @click="setAccountManager(accountManager.accountmanager_id)">
            {{ accountManager.firstname }}
          </button>
        </span>

      </Card>

      <!-- Companie filter -->

      <Card>

        <h1>{{ filter.accountManager ? filter.accountManager.firstname : '' }}</h1>

        <span v-for="(company, index) in filter.companies" :key=index>
          <button class="filter-button" @click="setCompany(company.id)">
            {{ company.name }}
          </button>
        </span>

      </Card>

      <!-- Project filter -->

      <Card>

        <h1>{{ filter.company ? filter.company.name : '' }}</h1>

        <span v-for="(project, index) in filter.projects" :key=index>
          <button class="filter-button" @click="setProject(project.id)">
            {{ project.name }} {{ project.id }}
          </button>
        </span>

      </Card>

    </div>

    <!-- Report -->

    <Card>

      <div v-if="filter.project">
        <h1>{{ filter.project.name }} - {{ filter.project.number }}
          <GrippLink
            :path="'/' + filter.project.type + '/view/' + filter.project.id"
            :key="filter.project.id"
          />
        </h1>

        Type: {{ filter.project.type }}
        | Startdate: {{ prettyfy(filter.project.startdate) }}
        | Deadline {{ prettyfy(filter.project.deadline) }}
        | Database ID {{ filter.project.id }}
      </div>

      <hr>

      <!-- Tasks -->

      <table>

        <!-- Table header -->

        <tbody>

          <tr style="height: 40px;">
            <td>Project line</td>
            <td>Amount</td>
            <td>Tasktype</td>
            <td>Content</td>
            <td>Hours</td>
            <td>Start</td>
            <td>Deadline</td>
            <td>Deadline calc</td>
            <td>Planned</td>
            <td>From</td>
            <td>To</td>
            <td>Booked</td>
          </tr>

        </tbody>

        <!-- Project line -->

        <tbody v-for="(projectLine, index) in projectTasks.projectLines" :key=index>

          <!-- When group -->

          <tr v-if="projectLine.rowtype_id == 2">
            <td colspan="2"><h2>{{ projectLine.additionalsubject }} </h2></td>
          </tr>

          <!-- When product -->

          <tr v-else>
            <td><strong>{{ projectLine.product_name }}</strong></td>
            <td><strong>{{ prettyfy(projectLine.amount, 10) }}</strong></td>
            <td><strong>&#x21B4;</strong></td>
          </tr>

          <!-- When product, but no tasks -->

          <tr v-if="projectLine.rowtype_id == 1 && projectTasks.getProjectLineTasksCount(projectLine.id) == 0">
            <td></td>
            <td></td>
            <td colspan="6" class="bg-red-100">No tasks</td>
            <td colspan="3" class="bg-indigo-50"></td>
            <td colspan="3" class="bg-indigo-100"></td>
          </tr>

          <!-- Tasks -->

          <tr v-for="(task, index) in projectTasks.getProjectLineTasks(projectLine.id)" :key=index>
            <td></td>
            <td></td>
            <td class="bg-indigo-100">{{ task.tasktype_name }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.content, 20) }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.estimatedhours, 10) }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.startdate, 10) }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.deadline, 10) }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.deadline_calc, 10) }}</td>
            <td class="bg-indigo-50">{{ prettyfy(task.hours_planned, 10) }}</td>
            <td class="bg-indigo-50">{{ prettyfy(task.hours_planned_from, 10) }}</td>
            <td class="bg-indigo-50">{{ prettyfy(task.hours_planned_to, 10) }}</td>
            <td class="bg-indigo-100">{{ prettyfy(task.hours_booked, 10) }}</td>
          </tr>

        </tbody>
      </table>
    </Card>

    <GrippSyncInfo />

  </ClientOnly>

</template>

<script lang="ts" setup>

  definePageMeta({ auth: true })

  const filter = ref(new Filter());
  const projectTasks = ref(new ProjectTasks());

  // Set new account manager

  async function setAccountManager(accountManagerId: number) {
    filter.value.setAccountManager(accountManagerId);
    await filter.value.loadAccountManagerCompanies();
    await filter.value.loadCompanyProjects();
    await projectTasks.value.loadData(filter.value.project.id);
  }

  // Set new Company

  async function setCompany(companyId: number) {
    await filter.value.setCompany(companyId);
    await filter.value.loadCompanyProjects();
    await projectTasks.value.loadData(filter.value.project.id);
  }

  // Set new project

  async function setProject(projectId: number) {
    await filter.value.setProject(projectId);
    await projectTasks.value.loadData(projectId);
  }

  // Setup when mounted

  onMounted(async () => {
    await nextTick();

    // Load data
    await filter.value.loadAccountManagers();
    await filter.value.loadAccountManagerCompanies();
    await filter.value.loadCompanyProjects();
    await projectTasks.value.loadData(filter.value.project.id);
  });

</script>
