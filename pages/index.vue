<script setup>
const { data } = useAsyncData(async () => {
  return null
  // Disabled because feature is not ready for preview
  // const apiReq = await fetcher('live')
  // let details = null

  // if (apiReq.ok) {
  //   details = (await apiReq.json())
  // }

  // return details
})

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
</script>
<template>
  <div>
    <!-- <template v-if="pending === false"> -->
    <template v-if="data !== null">
      <template v-if="data.floatplane.isLive && data.floatplane.isWAN">
        <div class="grower bg-zinc-800 rounded-md">
          <div class="flex mx-2 my-1">
            <div class="flex-col">
              <h1 v-if="!data.youtube.isLive">Upcoming Show - Pre show live on Floatplane</h1>
              <h1 v-else>Live Now</h1>
              <h2 class="font-semibold text-lg">
                {{ data.floatplane.title }}
              </h2>
            </div>
          </div>
          <div class="imgcontainer h-100">
            <CoreUIImage :id="data.floatplane.thumbnail" :width="700" :height="380" :variant="'thumbfullsize'" />
          </div>
        </div>
      </template>
    </template>
    <!-- </template> -->
    <VideoFeed />
  </div>
</template>
<style scoped>
.grower {
  opacity: 1;
  overflow: hidden;
  height: 450px;
  width: 720px;
  margin: 0.5rem auto 0.5rem;
  animation: grow ease-in-out 2s;
}

@keyframes grow {
  0% {
    opacity: 0;
    height: 0px;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
    height: 450px
  }

}
</style>
