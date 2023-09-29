<script async setup>
import { parse } from 'node-webvtt'
import Plyr from 'plyr'
import Hls from 'hls.js'

const route = useRoute()
const { id } = route.params
const profile = useState('uprofile', () => undefined)
// const timeHuman = ref('00:00:00')
// const timePercentage = ref('0.00')
const livePlayer = ref(null)
const itv = {
  player: null,
  viewport: null
}
// const castMap = new Map()
// const tsMap = new Map()

// const { data, error } = useAsyncData(async () => {
//   const episode = await (await fetcher('player', {
//     method: 'POST',
//     body: JSON.stringify({
//       id
//     })
//   })).json();
//   const data = episode.data

useHead({
  // title: data.title + ' | The WAN DB',
  title: 'Live | The WAN DB',
  link: [
    // {
    //   hid: 'canonical',
    //   property: 'canonical',
    //   content: 'https://thewandb.com/videos/' + data.id
    // },
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
    // {
    //   hid: 'og-title',
    //   property: 'og:title',
    //   content: data.title + ' | The WAN DB'
    // },
    // {
    //   hid: 'twitter-title',
    //   property: 'twitter:title',
    //   content: data.title + ' | The WAN DB'
    // },
    {
      hid: 'og-title',
      property: 'og:title',
      content: 'Live | The WAN DB'
    },
    {
      hid: 'twitter-title',
      property: 'twitter:title',
      content: 'Live | The WAN DB'
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
    // {
    //   hid: 'og-image',
    //   property: 'og:image',
    //   content: episode.thumbnail
    // },
    // {
    //   hid: 'twitter-image',
    //   property: 'twitter:image',
    //   content: episode.thumbnail
    // },
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
//   return data
// })

onMounted(() => {
  // 'https://de488bcb61af.us-east-1.playback.live-video.net/api/video/v1/us-east-1.758417551536.channel.yKkxur4ukc0B.m3u8?allow_source=false&token=eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJhd3M6Y2hhbm5lbC1hcm4iOiJhcm46YXdzOml2czp1cy1lYXN0LTE6NzU4NDE3NTUxNTM2OmNoYW5uZWwveUtreHVyNHVrYzBCIiwiYXdzOmFjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiI6Imh0dHBzOi8vd3d3LmZsb2F0cGxhbmUuY29tLGh0dHBzOi8vYmV0YS5mbG9hdHBsYW5lLmNvbSIsImlhdCI6MTY5NTk4Mzg4MywiZXhwIjoxNjk2MDcwMjgzfQ.d_l-G28c31zPr-U-1mjZHC31n99qn_udIOo8mW8qvqy3FypE3cfd4hXHUyMwSQv4pcvmBxzdmzGPt-XFFKGqozxC7GDe6MGrYZdLbJRDMsr3Fe8YN8CB5ySbVuZ0peh3'
  const source = 'https://customer-ii6t7r1l1y4zlr4s.cloudflarestream.com/8b14c81c34f1d7638cd259e19c102d6b/manifest/video.m3u8'
  const player = new Plyr(livePlayer.value, {
    ratio: '16:9',
    title: 'You Okay Intel? - WAN Show',
    muted: true,
    autoplay: true,
    mediaMetadata: {
      title: 'You Okay Intel? - WAN Show',
      artist: 'Linus Tech Tips',
      album: 'The WAN Show',
      artwork: [{
        src: 'https://imagedelivery.net/-cOMdbrgPKVfMhvnN-qKfw/71a0d7db-10f5-4b03-bf03-b48e42593a00/thumbfullsize',
        type: 'image/jpeg'
      }]
    },
    poster: 'https://imagedelivery.net/-cOMdbrgPKVfMhvnN-qKfw/71a0d7db-10f5-4b03-bf03-b48e42593a00/thumbfullsize'
  })

  const hls = new Hls({
    startPosition: -1
  })
  hls.loadSource(source)
  hls.attachMedia(livePlayer.value)
  window.hls = hls
  hls.on('hlsError', (details, e) => {
    console.log('HLS Error', e)
    window.setTimeout(() => {
      hls.loadSource(source)
    }, 200)
  })

  player.on('pause', () => { })
  player.on('')

  player.on('canplay', () => {

  })

  // hls.on(Hls.Events.BUFFER_EOS)

  // setTimeout(() => {
  //   if (player !== null) {
  //     if (route.query.t) {
  //       let t = parseInt(route.query.t)
  //       console.log("Time Query Provided, skipping to", t)
  //       player.currentTime = t
  //     }
  //   }
  // }, 1000)
  // itv.player = setInterval(() => {
  //   try {
  //     if (player !== undefined) {
  //       if (player !== null) {
  //         time.value = player.currentTime
  //         timeHuman.value = toTimestamp(time.value)
  //         timePercentage.value = ((time.value / data.value.duration) * 100).toFixed(2)
  //       }
  //     }
  //   } catch (e) {
  //     if (e.message === 'player is not defined') {
  //       console.log("Player is not loaded yet")
  //     } else {
  //       console.log("Duration Daemon failed:")
  //       console.error(e);
  //     }
  //   }
  // }, 50)
})

onUnmounted(() => {
  if (itv.player) { clearInterval(itv.player) }
  if (itv.viewport) { clearInterval(itv.viewport) }
})
</script>
<template>
  <!-- <template v-if="!data && !error">
    <div class="mx-auto my-auto">
      <h1 style="margin: 10rem auto 0; width: fit-content;">
        Loading
      </h1>
      <h2 style="margin: 0.5rem auto 0; width: fit-content;">
        Please Stand By...
      </h2>
    </div>
  </template> -->
  <!-- <template v-else-if="data"> -->
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
      <div id="fullscreen-container" style="max-height: 90vh; max-width: ">
        <video id="player" ref="livePlayer" playsinline controls style="--plyr-color-main: rgb(185, 44, 37);">
          <!-- <source
            :src="`https://customer-ii6t7r1l1y4zlr4s.cloudflarestream.com/8b14c81c34f1d7638cd259e19c102d6b/manifest/video.m3u8`" /> -->
        </video>
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
  <!-- </template> -->
  <!-- <template v-else> -->
  <!-- Error {{ error }} -->
  <!-- </template> -->
  <!-- eslint-disable vue/no-multiple-template-root -->
  <!-- <div class="">
    <h3>This device is too small for this page to display correctly.</h3>
    <p>Please try viewing on a bigger device.</p>
  </div> -->
</template>
