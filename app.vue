<template>
  <div>
    <Header/>
    <RouterView/>
  </div>
</template>
<script lang="ts" setup>
import Header from "~/comonents/Header.vue";
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: Open Sans, sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(15, 50px);
  margin: 0;
  padding: 0;
}

.grid__item {
  display: flex;
  text-align: center;
  transition: all 200ms ease;
  background: #eee;
  color: #555;
  border: 1px solid #ddd;
  margin: 0.25rem;
  border-radius: 20px;
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
}

.grid__item:hover {
  background: #ddd;
  color: #444;
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.2);
  transition: all 200ms ease;
}

.button {
  padding: 4px 6px;
  margin: 5px;
  background: #444444;
  color: white;
  border: none;
  border-radius: 20px;
  width: 150px;
  transition: all 200ms ease;
}

.button:hover {
  background: #333333;
  transition: all 200ms ease;
  scale: 1.1;
}
</style>