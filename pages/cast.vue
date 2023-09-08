<script setup>
useHead({
  title: 'Home | The WAN DB',
  link: [
    {
      hid: 'canonical',
      property: 'canonical',
      content: 'https://thewandb.com/'
    }
  ],
  meta: [
    {
      hid: 'theme-color',
      name: 'theme-color',
      content: '#bb2701'
    },
    {
      hid: 'robots',
      property: 'robots',
      content: 'index, archive'
    },
    {
      hid: 'og-title',
      property: 'og:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'twitter-title',
      property: 'twitter:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'description',
      property: 'description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-description',
      property: 'og:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'twitter-description',
      property: 'twitter:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-image',
      property: 'og:image',
      content: 'https://cdn.thewandb.com/assets/WANDB_whiteBackground.png'
    },
    {
      hid: 'twitter-image',
      property: 'twitter:image',
      content: 'https://cdn.thewandb.com/assets/WANDB_whiteBackground.png'
    },
    {
      hid: 'twitter-card',
      property: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      hid: 'og-type',
      property: 'og:type',
      content: 'website'
    }
  ]
})
const config = useRuntimeConfig()

const { data } = useAsyncData(async () => {
  return (await (await fetcher('cast')).json()).data
})

</script>
<template>
  <div class="mx-auto my-2 flex-col justify-center text-white">
    <h1 class="w-fit mx-auto font-bold text-3xl">
      Cast
    </h1>
    <p class="text-justify w-fit mx-auto">
      A comprehensive list of everybody who has featured in an episode of The WAN Show
    </p>
    <p class="text-justify w-fit mx-auto">
      (according to our sources)
    </p>
    <div class="flex w-11/12 mx-auto px-0 justify-evenly flex-wrap">
      <template v-for="(p,i) in data" :key="i">
        <CastMember :person="p" />
      </template>
    </div>
  </div>
</template>
