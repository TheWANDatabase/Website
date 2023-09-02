<template>
  <div class="bg-slate-300 text-amber-800">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  font-family: 'Roboto', sans-serif;
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: #cbd5e1;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #cbd5e1;
  }
}
</style>
