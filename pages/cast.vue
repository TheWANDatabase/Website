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

const { data } = useAsyncData(async () => {
  return (await (await fetcher('http://localhost:3000/api/v1/cast?detailed=true', { method: 'POST' })).json()).data
})

</script>
<template>
  <div class="w-10/12 mx-auto my-2 flex-col justify-center text-white">
    <h1 class="w-fit mx-auto font-bold text-3xl">
      Cast
    </h1>
    <p class="text-justify w-fit mx-auto">
      A comprehensive list of everybody who has featured in an episode of The WAN Show
    </p>
    <p class="text-justify w-fit mx-auto">
      (according to our sources)
    </p>
    <div class="w-100 flex justify-center flex-wrap">
      <template v-for="(p,i) in data" :key="i">
        {{ console.log(p) }}
        <div class="flex w-82 mx-auto mt-2 mb-5 bg-slate-800 rounded-lg p-2">
          <div class="flex ml-2 mr-4 my-auto align-middle">
            <UAvatar class="object-cover" size="3xl" :alt="p.name" :src="'https://cdn.thewandb.com/mugs/'+p.mug" />
          </div>
          <div class="flex-col w-52">
            <h1 class="text-xl font-bold -mb-1">
              {{ p.name }}
            </h1>
            <h2 class="font-bold">
              {{ p.role }}
            </h2>
            <a v-if="p.outlet_uri" class="text-lg my-5 h-5" :href="p.outlet_uri">{{ p.outlet }}</a>
            <a v-else class="text-lg my-5 h-5">{{ p.outlet }}</a>
            <div>
              <a
                v-if="p.ltt_forum"
                :href="'https://linustechtips.com/profile/' + p.ltt_forum"
                target="_blank"
              >
                <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo.svg">
              </a>
              <a v-else>
                <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo_grey.svg">
              </a>

              <a v-if="p.imdb" :href="'https://www.imdb.com/name/' + p.imdb" target="_blank">
                <Icon class="w-7 h-7 mx-1" name="bxl:imdb" color="#f3ce13" />
              </a>
              <a v-else>
                <Icon class="w-7 h-7 mx-1 fill-slate-400" name="bxl:imdb" />
              </a>

              <a
                v-if="p.wikipedia"
                :href="'https://en.wikipedia.org/wiki/' + p.wikipedia"
                target="_blank"
              >
                <Icon class="w-7 h-7 mx-1" name="mdi:wikipedia" />
              </a>
              <a v-else>
                <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:wikipedia" />
              </a>

              <a
                v-if="p.instagram"
                :href="'https://www.instagram.com/' + p.instagram"
                target="_blank"
              >
                <Icon class="w-7 h-7 mx-1" name="mdi:instagram" color="#C13584" />
              </a>
              <a v-else>
                <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:instagram" />
              </a>

              <a v-if="p.twitter" :href="'https://twitter.com/' + p.twitter" target="_blank">
                <Icon class="w-7 h-7 mx-1" name="logos:twitter" />
              </a>
              <a v-else>
                <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:twitter" />
              </a>

              <a
                v-if="p.linkedin"
                :href="'https://www.linkedin.com/in/' + p.linkedin"
                target="_blank"
              >
                <Icon class="w-7 h-7 mx-1" name="devicon:linkedin" />
              </a>
              <a v-else>
                <Icon class="w-7 h-7 mx-1" name="devicon-plain:linkedin" />
              </a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
