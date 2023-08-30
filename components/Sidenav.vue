<script setup>
const r = useRoute()

// const { data } = await useAsyncData(() => {

// })

</script>
<template>
  <div class="sidenav">
    <h1>My Profile</h1>
    <hr>
    <a href="/profile" :class="[r.path === '/profile' ? 'active' : undefined]">Profile</a>
    <!-- <a href="/profile/settings" :class="[r.path === '/profile/settings' ? 'active' : undefined]">Settings</a> -->
    <a href="/profile/data" :class="[r.path === '/profile/data' ? 'active' : undefined]">My Data</a>
  </div>
</template>

<style scoped>
.sidenav {
  top: 5.5rem;
  grid-area: sidenav;
  position: sticky;
  height: fit-content;
  margin-right: 0.5rem;
  border-radius: 5px;
  padding: 0.5rem;
  background: #2b2b2b;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: baseline;
}

.sidenav h1 {
  margin: 0.5rem;
}

.sidenav hr {
  width: 100%;
  border-color: #ffa500;
}

.sidenav a {
  margin: 3px;
  padding: 5px 10px;
  color: white;
  text-decoration: none;
  font-size: large;
  transition: 200ms;
  padding-left: 10px;
  border-radius: 5px;
}

.sidenav a:hover {
  padding-left: 20px;
  transition: 200ms;
  color: #ffa500;
  background: #3d3c3d;
}

.sidenav .active {
  padding-left: 20px;
  color: #ffa500;
  background: #3d3c3d;
}
</style>
