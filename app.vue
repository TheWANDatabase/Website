<template>
  <div :class="`bg-${cfg ? cfg.theme.greyscale : 'scorch'}-100 text-${cfg ? cfg.theme.greyscale : 'scorch'}-900`">
    <Header/>
    <a name="top"/>
    <NuxtPage/>
    <a name="bottom"/>
    <Footer/>
    <UNotifications/>
  </div>
</template>

<script setup>
import {useIntervalFn} from "@vueuse/core";
import {useAsyncData} from "#app";

const themes = useState('availableThemes', () => new Map([
  [
    'Emerald',
    {
      primary: 'emerald',
      greyscale: 'zinc'
    }
  ],
  [
    'Poppy',
    {
      primary: 'poppy',
      greyscale: 'zinc'
    }
  ],
  [
    'Sapphire',
    {
      primary: 'sky',
      greyscale: 'zinc'
    }
  ],
  [
    'Zinc',
    {
      primary: 'zinc',
      greyscale: 'zinc'
    }
  ],
  [
    'Scorch',
    {
      primary: 'scorch',
      greyscale: 'scorch'
    }
  ]
]))
const theme = useState('currentTheme');

const cfg = useState('uconf', () => {
  return {
    theme: {
      name: 'emerald',
      primary: 'emerald',
      greyscale: 'zinc'
    }
  }
})


onMounted(() => {
  useIntervalFn(() => {
    let theme = localStorage.getItem('theme');
    if (theme) {
      cfg.value.value = themes.value.get(theme)
    } else {
      localStorage.setItem('theme', theme.value.value)
    }
  }, 2_000)

  useAsyncData(() => {
    console.log("Updating theme", theme.value.value)
    localStorage.setItem('theme', theme.value.value)
  }, {
    server: false,
    watch: [theme]
  })
})

// useIntervalFn(() => {
//   cfg.value = {
//     theme: themes.value[Math.floor(Math.random() * themes.value.length)]
//   }
// }, 5_000)

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

* {
  font-family: 'Open Sans', sans-serif;
  transition: color 2.5s ease, background-color 2.5s ease;
}
</style>
