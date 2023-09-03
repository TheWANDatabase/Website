<template>
  <div class="bg-slate-600 text-amber-800">
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
  background-color: #475569;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #475569;
  }
}
</style>
