<template>
  <div class="bg-zinc-900 text-zinc-200">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

* {
  font-family: 'Open Sans', sans-serif;
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: #18181b;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #18181b;
  }
}
</style>
