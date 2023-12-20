<template>
  <div class="grid-1">
    <div class="header">

      <img src="/img/logo-black.png" width="20" height="20">
      <span class="brandname">&nbsp;steps ahead</span>

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

  /* logo brand name */
  .brandname {
    color: black;
    font-family: Play;
    font-size: 30px;
    font-weight: 400;
  }

  /* Style the header with a grey background and some padding */
  .header {
    overflow: hidden;
    padding: 20px 10px;
  }

  /* Style the header links */
  .header a {
    float: left;
    color: black;
    text-align: center;
    padding: 12px;
    font-size: 18px;
    line-height: 25px;
    border-radius: 4px;
  }

  /* Change the background color on mouse-over */
  .header a:hover {
    background-color: #ddd;
    color: black;
  }

  /* Style the active/current link*/
  .header a.active {
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
