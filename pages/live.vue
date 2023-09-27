<script async setup>
import { parse } from 'node-webvtt'
import Plyr from 'plyr'

const route = useRoute()
const { id } = route.params
const profile = useState('uprofile', () => undefined)
const useCDN = useState('useCDN', () => true)
const showCorruptionModal = ref(false)
const showContentWarningModal = ref(false)
const time = ref(0)
const timeHuman = ref('00:00:00')
const timePercentage = ref('0.00')
const itv = {
  player: null,
  viewport: null
}
const castMap = new Map()
const tsMap = new Map()
onMounted(() => {
  let player = new Plyr('#player', {
    ratio: '16:9'
  });
  setTimeout(() => {
    if (player !== null) {
      if (route.query.t) {
        let t = parseInt(route.query.t)
        console.log("Time Query Provided, skipping to", t)
        player.currentTime = t
      }
    }
  }, 1000)
  itv.player = setInterval(() => {
    try {
      if (player !== undefined) {
        if (player !== null) {
          time.value = player.currentTime
          timeHuman.value = toTimestamp(time.value)
          timePercentage.value = ((time.value / data.value.duration) * 100).toFixed(2)
        }
      }
    } catch (e) {
      if (e.message === 'player is not defined') {
        console.log("Player is not loaded yet")
      } else {
        console.log("Duration Daemon failed:")
        console.error(e);
      }
    }
  }, 50)
})

onUnmounted(() => {
  if (itv.player) { clearInterval(itv.player) }
  if (itv.viewport) { clearInterval(itv.viewport) }
})

const { data, error } = useAsyncData(async () => {
  const episode = await (await fetcher('player', {
    method: 'POST',
    body: JSON.stringify({
      id
    })
  })).json();
  const data = episode.data

  useHead({
    title: data.title + ' | The WAN DB',
    link: [
      {
        hid: 'canonical',
        property: 'canonical',
        content: 'https://thewandb.com/videos/' + data.id
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.plyr.io/3.7.8/plyr.css'
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
        content: data.title + ' | The WAN DB'
      },
      {
        hid: 'twitter-title',
        property: 'twitter:title',
        content: data.title + ' | The WAN DB'
      },
      {
        hid: 'description',
        property: 'description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        hid: 'og-description',
        property: 'og:description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        hid: 'twitter-description',
        property: 'twitter:description',
        content: "The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect."
      },
      {
        hid: 'og-image',
        property: 'og:image',
        content: episode.thumbnail
      },
      {
        hid: 'twitter-image',
        property: 'twitter:image',
        content: episode.thumbnail
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
  return data
})
</script>
<template>
  <template v-if="!data && !error">
    <div class="mx-auto my-auto">
      <h1 style="margin: 10rem auto 0; width: fit-content;">
        Loading
      </h1>
      <h2 style="margin: 0.5rem auto 0; width: fit-content;">
        Please Stand By...
      </h2>
    </div>
  </template>
  <template v-else-if="data">
    <template v-if="(showContentWarningModal && showCorruptionModal)">
      <div class="">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.title }}</p>
        <p>
          This video may feature language, phrases,
          or other content which some viewers may find upsetting.
          <br>
          If you choose to view this video anyway, please do not
          try and get upset with me for hosting it on this archive
          <br>
        </p>
        <h3>Additionally:</h3>
        <p>
          This video has sadly been plagued by corruption issues over the time it has been on YouTube.
          It was corrupted before this archive project began, and sadly no safe copy exists that we
          know of.
          <br>
          As a result, this video may be difficult to watch for viewers suffering from color blindness,
          seizures, or anyone who has a discomfort to bright or flashing colors.

          Please do not watch this video if you suffer any of the above, we are not responsible for your
          health.
          <br>
        </p>
        <h3>You have been warned</h3>

        <div>
          <a href="/">Go Back</a>
          <button @click="() => { showContentWarningModal = false; showCorruptionModal = false }">Proceed</button>
        </div>
      </div>
    </template>
    <template v-else-if="showContentWarningModal">
      <div class="">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.title }}</p>
        <p>
          This video may feature language, phrases,
          or other content which some viewers may find upsetting.
          <br>
          If you choose to view this video anyway, please do not
          try and get upset with me for hosting it on this archive
          <br>
        </p>
        <h3>You have been warned</h3>

        <div>
          <a href="/">Go Back</a>
          <button @click="() => showContentWarningModal = false">Proceed</button>
        </div>
      </div>
    </template>
    <template v-else-if="showCorruptionModal">
      <div class="">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.title }}</p>
        <p>
          This video has sadly been plagued by corruption issues over the time it has been on YouTube.
          It was corrupted before this archive project began, and sadly no safe copy exists that we
          know of.
          <br>
          As a result, this video may be difficult to watch for viewers suffering from color blindness,
          seizures, or anyone who has a discomfort to bright or flashing colors.

          Please do not watch this video if you suffer any of the above, we are not responsible for your
          health.
          <br>
        </p>
        <h3>You have been warned</h3>

        <div>
          <a href="/">Go Back</a>
          <button @click="() => showCorruptionModal = false">Proceed</button>
        </div>
      </div>
    </template>
    <template v-else-if="!showCorruptionModal && !showContentWarningModal">
      <div class="">
        <div class="">
          <!-- Title Bar Section -->
          <!-- <div class="">
            <div>
              <h2>{{ data.title }}</h2>
              <h4>Originally Aired: {{ new Date(data.aired).toLocaleDateString() }}</h4>
              <h4>
                Runtime: {{ data.duration_text }}
                (You've watched {{ timeHuman }} | That's {{ timePercentage }}%)
              </h4>
            </div>
            <div class="">
              <a class="">
                <Icon name="mdi:youtube" color="#ff0000" />
                <span>Watch On YouTube</span>
              </a>
              <a class=""
                :href="data.floatplane">
                <Icon name="simple-icons:floatplane" color="#0d6efd" />
                <span>Watch On Floatplane</span>
              </a>
              <a class="" v-else>
                <Icon name="simple-icons:floatplane" color="#fff" />
                <span>VOD Unavailable</span>
              </a>
            </div>
          </div> -->

          <!-- Player Section -->
          <div id="fullscreen-container" class="">
            <div class="plyr__video-embed" id="player" style="--plyr-color-main: rgb(185, 44, 37);"
              :data-poster="`https://cdn.thewandb.com/thumbs/${data.id}.jpeg`"
              :data-plyr-config='{ "title": data.title, fullscreen: { container: "#fullscreen-container", ratio: "21:9" } }'>
              <iframe
                :src="`https://www.youtube.com/embed/${data.id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=0&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
                allowfullscreen allowtransparency allow="autoplay"></iframe>
            </div>
            <!-- <audio id="player" controls
              style="--plyr-color-main: rgb(185, 44, 37);height: fit;margin-bottom:0;margin-top: auto;">
              <source :src="`https://cdn.thewandb.com/aod/${data.id}.mp3`" type="audio/mp3" />
            </audio> -->
            <!-- <iframe v-if="!data.flags.corrupt" id="videoplayeryoutube"
              :src="`https://www.youtube.com/embed/${id}?enablejsapi=1`" title="YouTube video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen /> -->
          </div>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    Error {{ error }}
  </template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <div class="">
    <h3>This device is too small for this page to display correctly.</h3>
    <p>Please try viewing on a bigger device.</p>
  </div>
</template>
