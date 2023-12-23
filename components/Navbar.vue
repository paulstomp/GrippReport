<template>
  <div class="grid-1">
    <div class="header">

      <NuxtLink to="/">
        <span class="navitem">Departments</span>
      </NuxtLink>

      <NuxtLink to="/projects">
        <span class="navitem">Projects</span>
      </NuxtLink>

      <div class="header-right">

        <button class="button" v-if="status === 'authenticated'" @click="signOut({ callbackUrl: '/' })">
          Logout
        </button>
        <button class="button" v-else @click="signIn('credentials')">
          Login
        </button>

      </div>
    </div>
  </div>
</template>

<style>

  /* Style the header with a grey background and some padding */
  .header {
    overflow: hidden;
    padding: 0px 0px;
  }

  /* Style the header links */
  .navitem {
    float: left;
    color: black;
    text-align: center;
    padding: 12px;
    font-size: 16px;
    border-radius: 4px;
  }

  /* Change the background color on mouse-over */
  .navitem a:hover {
    background-color: #ddd;
    color: black;
  }

  /* Style the active/current link*/
  .navbar a.active {
    background-color: dodgerblue;
    color: white;
  }

  /* Float the link section to the right */
  .header-right {
    float: right;
  }

  /* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
  @media screen and (max-width: 500px) {
    .header a {
      float: none;
      display: block;
      text-align: left;
    }
    .header-right {
      float: none;
    }
  }

</style>

<script setup lang="ts">

  const { status, data, signOut, signIn } = useAuth();

</script>
