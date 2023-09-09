<template>
  <div :class="`bg-${cfg ? cfg.theme.greyscale : 'zinc'}-900 text-${cfg ? cfg.theme.greyscale : 'zinc'}-200`">
    <Header />
    <NuxtPage />
    <Footer />
    <UNotifications />
  </div>
</template>

<script setup>
const cfg = useState('uconf')
</script>

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
