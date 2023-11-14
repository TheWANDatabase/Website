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
      primary: 'emerald',
      greyscale: 'zinc'
    }
  }
})

function loadTheme() {
  let t2 = localStorage.getItem('twdb.theme');
  if (t2) {
    console.log("Loading theme", JSON.parse(t2));
    theme.value = JSON.parse(t2);
    cfg.value.value = themes.value.get(t2.value);
  } else {
    localStorage.setItem('twdb.theme', JSON.stringify(theme.value));
  }
}

onMounted(() => {
  useAsyncData(() => {
    console.log("Updating theme", JSON.stringify(theme.value));
    localStorage.setItem('twdb.theme', JSON.stringify(theme.value));
  }, {
    server: false,
    watch: [theme]
  })

  loadTheme();
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
  transition: color 250ms ease, background-color 250ms ease;
}
</style>
