<script async lang="ts" setup>
import style from './videos.module.css';
import {AsyncData} from "#app";

const route = useRoute();
const {id} = route.params;
const cfg: any = useState('uconf');
const details: AsyncData<any, any> = useAsyncData(async () => {
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
  <template v-if="details.pending.value">
    <div :class="style.container">
      <h1 style="margin: 10rem auto 0; width: fit-content;">
        Loading
      </h1>
      <h2 style="margin: 0.5rem auto 0; width: fit-content;">
        Please Stand By...
      </h2>
    </div>
  </template>
  <template v-else-if="details.data.value">
    <div :class="style.container">
      <div :class="style.viewport">
        <div :class="`${style.headerBar} m-2 p-2 bg-${cfg.theme.primary}-300 rounded-md flex`">
          <div class="flex-grow">
            <h1 class="text-2xl ">{{ details.data.value.title }}</h1>
            <h3 class="text-l ">Originally Recorded on {{ new Date(details.data.value.aired).toLocaleDateString() }} at
              {{ new Date(details.data.value.aired).toLocaleTimeString() }}</h3>
          </div>
          <div class="flex-column justify-around">
            <a :href="`https://youtube.com/watch?v=${details.data.value.id}`" target="_blank">
              <button :class="``">
                Watch on YouTube
              </button>
            </a>
            <a :href="`https://floatplane.com/post/${details.data.value.floatplane}`" target="_blank">
              <button :class="``">
                Watch on Floatplane
              </button>
            </a>
          </div>
        </div>
        <div :class="`${style.sectorBox} m-2 p-2 bg-${cfg.theme.greyscale}-200 rounded-md`">
          <h3 class="text-2xl min-w-max">Hosts & Guests</h3>
          <div :class="`${style.castBox} flex`">
            <template v-for="(cast,i) in details.data.value.cast" :key="i">
              <div :id="cast.id"
                   :class="`${style.castSquare} m-2 p-2 bg-${cfg.theme.primary}-300 rounded-md flex`">
                <div :class="`${style.castImageContainer} mr-2`">
                  <CoreUIImage :id="cast.avatar" :height="128" :width="128"/>
                </div>
                <div :class="`${style.castImageOverlay}`">
                  <h2 class="text-xl">{{ cast.forename }} {{ cast.alias ? `"${cast.alias}"` : "" }} {{
                      cast.surname
                    }}</h2>
                  <h4 class="text-md">{{ cast.job.role }} at {{ cast.job.outlet.name }}</h4>
                  <!--                <pre><code lang="json">{{ JSON.stringify(cast, null, 2) }}</code></pre>-->
                </div>
              </div>
            </template>
          </div>
        </div>
        <div :class="`${style.sectorBox} m-2 p-2 bg-${cfg.theme.greyscale}-200 rounded-md`">
          <h3 class="text-2xl min-w-max">Products Shown</h3>
          <div :class="`${style.productBox} flex`">
            <template v-for="(product,i) in details.data.value.products" :key="i">
              <div :id="product.id"
                   :class="`${style.productSquare} m-2 p-2 bg-${cfg.theme.primary}-300 rounded-md flex-column`">
                <div :class="`${style.productImageContainer} mr-2`">

                  <CoreUIImage v-if="product.media.length > 0" :id="product.media[0].imageId" :height="256"
                               :width="256"/>
                </div>
                <div :class="`${style.productImageOverlay}`">
                  <h2 class="text-xl m-1 text-center">{{ product.title }}</h2>
                  <div class="flex min-w-max justify-around">
                    <CoreUICustomBadge v-show="product.isRetired" :id="product.id" :color="cfg.theme.primary"
                                       label="Product Retired"/>
                    <CoreUICustomBadge v-show="product.isOutOfStock" :id="product.id" :color="cfg.theme.primary"
                                       label="Out Of Stock"/>
                    <CoreUICustomBadge v-show="product.isOnSale" :id="product.id" :color="cfg.theme.primary"
                                       label="On Sale"/>
                    <CoreUICustomBadge :id="product.id" :color="cfg.theme.primary"
                                       :label="product.isOnSale ? `Was $${product.standardPrice} -> Now: $${product.salePrice}` : `$${product.standardPrice}`"/>
                  </div>

                  <!--                  <pre><code lang="json">{{ JSON.stringify(product, null, 2) }}</code></pre>-->
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    Error {{ details.error.value }}
  </template>
</template>
