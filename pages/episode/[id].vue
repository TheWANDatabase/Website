<script async lang="ts" setup>
import style from './videos.module.css';

const route = useRoute();
const {id} = route.params;
const cfg: any = useState('uconf');
const {data, error} = useAsyncData(async () => {
  const episode: any = await (await fetcher('episodes/' + id)).json();

  useHead({
    title: episode.title + ' | The WAN DB',
    link: [
      {
        type: 'canonical',
        href: 'https://thewandb.com/episodes/' + episode.id
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.plyr.io/3.7.8/plyr.css'
      }
    ],
    meta: [
      {
        name: 'theme-color',
        content: '#bb2701'
      },
      {
        property: 'robots',
        content: 'index, archive'
      },
      {
        property: 'og:title',
        content: episode.title + ' | The WAN DB'
      },
      {
        property: 'twitter:title',
        content: episode.title + ' | The WAN DB'
      },
      {
        property: 'description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        property: 'og:description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        property: 'twitter:description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        property: 'og:image',
        content: `https://cdn.thewandb.com/media/${episode.thumbnail}.webp`
      },
      {
        property: 'twitter:image',
        content: `https://cdn.thewandb.com/media/${episode.thumbnail}.webp`
      },
      {
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        property: 'og:type',
        content: 'website'
      }
    ]
  })

  return episode;

})
</script>
<template>
  <template v-if="!data && !error">
    <div :class="style.container">
      <h1 style="margin: 10rem auto 0; width: fit-content;">
        Loading
      </h1>
      <h2 style="margin: 0.5rem auto 0; width: fit-content;">
        Please Stand By...
      </h2>
    </div>
  </template>
  <template v-else-if="data">
    <div :class="style.container">
      <div :class="style.viewport">
        <div :class="`${style.headerBar} m-2 px-2 py-2 bg-${cfg.theme.primary}-300 rounded-md flex`">
          <div: class="flex-grow">
            <h1 class="text-2xl ">{{ data.title }}</h1>
            <h3 class="text-l ">Originally Recorded on {{ new Date(data.aired).toLocaleDateString() }} at
              {{ new Date(data.aired).toLocaleTimeString() }}</h3>
          </div:>
          <div class="flex-column">
            <a :href="`https://youtube.com/watch?v=${data.id}`" target="_blank">
              <button :class="``">
                Watch on YouTube
              </button>
            </a>
            <a :href="`https://floatplane.com/post/${data.floatplane}`" target="_blank">
              <button :class="``">
                Watch on Floatplane
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <!--  </template>-->
  <template v-else>
    Error {{ error }}
  </template>
</template>
