<script async setup>
const config = useRuntimeConfig()
const route = useRoute()

const cmap = useState('hcast', () => new Map())
const user = null; //useState('user', () => undefined)

const profile = useState('uprofile', () => undefined)
// const history = useState('history', () => new Map())
const banners = useState('banners', () => [])
const cfg = useState('uconf')
const availableThemes = useState('availableThemes')

const selectableThemes = ref([])
const theme = useState('currentTheme', () => {
  return {
    label: 'Emerald',
    value: 'Emerald'
  }
});

useAsyncData(async () => {
  let processedThemes = Array.from(availableThemes.value.keys()).map((name) => {
    return {
      label: name,
      value: name
    }
  });
  selectableThemes.value = processedThemes;
})

useAsyncData(() => {

  const thm = availableThemes.value.get(theme.value.value)
  if (thm) cfg.value.theme = thm
}, {
  server: false,
  watch: [theme]
})

const error = ref(null)


// useAsyncData(async () => {
//   const bannerReq = await (await fetcher('banners')).json()
//   banners.value = bannerReq.data.map((b) => {
//     let show = true
//
//     if (b.paths) {
//       show = b.paths.includes(route.fullPath)
//     }
//
//     if (b.domains && show) {
//       show = b.domains.includes(config.public.domain)
//     }
//
//     b.show = show
//
//     return b
//   })
//
//   const d = (await (await fetcher('cast')).json()).data
//   d.map((c) => {
//     cmap.value.set(c.id, c)
//     return c
//   })
//
//   if (user.value) {
//     const {data} = await (await fetcher('profile', {
//       method: 'POST',
//       body: JSON.stringify({
//         id: user.value.uid
//       })
//     })).json()
//     if (data === null) {
//       sb.auth.signOut()
//     } else {
//       profile.value = data
//     }
//   } else {
//     profile.value = undefined
//   }
// }, {
//   server: false,
//   watch: [user]
// })

const items = ref([])

// await useAsyncData(() => {
//   if (profile.value) {
//     items.value = [
//       [
//         {
//           label: 'My Profile',
//           icon: 'i-heroicons-arrow-top-right-on-square',
//           click: () => {
//             window.location.href = '/profile'
//           }
//         },
//         {
//           label: 'My Data',
//           icon: 'i-heroicons-arrow-top-right-on-square',
//           click: () => {
//             window.location.href = '/profile/data'
//           }
//         }
//       ],
//       [
//         {
//           label: 'Log Out',
//           icon: 'i-heroicons-arrow-left-on-rectangle',
//           click: () => {
//             sb.auth.signOut()
//             profile.value = undefined
//             user.value = undefined
//             if (window.location.href.startsWith('/profile')) {
//               window.location.href = '/'
//             }
//           }
//         }
//       ],
//       [
//         {
//           label: 'Contribute',
//           icon: 'i-heroicons-code-bracket',
//           click: () => {
//             window.open('https://github.com/TheWANDatabase', '_blank')
//           }
//         },
//         {
//           label: 'Donate',
//           icon: 'i-heroicons-banknotes',
//           click: () => {
//             window.open('https://ko-fi.com/altrius', '_blank')
//           }
//         },
//         {
//           label: 'Join Our Discord',
//           icon: 'i-heroicons-arrow-top-right-on-square',
//           click: () => {
//             window.open('https://discord.gg/sVQm5f35VF', '_blank')
//           }
//         }
//       ]
//     ]
//   } else {
//     items.value = [
//       [
//         {
//           label: 'Log In With Google',
//           click: signinRedirect,
//           icon: 'i-heroicons-arrow-top-right-on-square'
//         }
//         //, {
//         //   label: 'Log In With Discord',
//         //   click: signInWithDiscord,
//         // icon: 'i-heroicons-arrow-top-right-on-square',
//         // }
//       ],
//       [
//         {
//           label: 'Contribute',
//           icon: 'i-heroicons-code-bracket',
//           click: () => {
//             window.open('https://github.com/TheWANDatabase', '_blank')
//           }
//         },
//         {
//           label: 'Donate',
//           icon: 'i-heroicons-banknotes',
//           click: () => {
//             window.open('https://ko-fi.com/altrius', '_blank')
//           }
//         },
//         {
//           label: 'Join Our Discord',
//           icon: 'i-heroicons-arrow-top-right-on-square',
//           click: () => {
//             window.open('https://discord.gg/sVQm5f35VF', '_blank')
//           }
//         }
//       ]
//     ]
//   }
// }, {
//   watch: [profile]
// })

const results = ref([])
const epmap = ref({})
// const episodeResults = ref([])
const visible = ref(false)
// const thumbs = ref({})
const query = ref('')

useAsyncData(async () => {
  if (query.value.length > 1) {
    const res = await (await fetch('https://search.thewandb.com/multi-search', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 468247aa732f9f277ac5b6146cbb632c7aaa4aa15c25ed58de6dde806de3db74',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        queries: [
          {
            indexUid: 'topics',
            q: query.value
          },
          {
            indexUid: 'episodes',
            q: query.value
          },
          {
            indexUid: 'transcripts',
            q: query.value,
            attributesToRetrieve: [
              'parent',
              'id',
              'text'
            ],
            showMatchesPosition: true
          }
        ]
      })
    })).json()

    try {
      res.results[2].hits.map((m) => {
        m.matches = []
        m.text = m.text.replaceAll('\\r\\n', ' ')
        for (let i = 0; i < m._matchesPosition.text.length; i++) {
          const x = m._matchesPosition.text[i]
          const regex = new RegExp(`[^.?!]*(?<=[.?\\s!])${m.text.substring(x.start, x.start + x.length)}(?=[\\s.?!])[^.?!]*[.?!]`, 'igm')
          m.matches = m.matches.concat(regex.exec(m.text.substring(x.start - 300, x.start + x.length + 1000)))
        }

        m.matches = m.matches.filter((elem, pos) => m.matches.indexOf(elem) === pos && elem !== null)

        console.log(m.matches)
        m.matches = m.matches.map((elem) => {
          if (elem.length > 150) {
            elem = elem.substring(0, 147)
            elem += '...'
          }

          return elem
        })

        return m
      })

      res.results[2].hits.filter(m => m.matches.length > 0)

      results.value = [
        {
          key: 'topics',
          label: 'Topics',
          icon: 'i-heroicons-chat-bubble-left-right',
          values: res.results[0]
        },
        {
          key: 'episodes',
          label: 'Episodes',
          icon: 'i-heroicons-tv',
          values: res.results[1]
        },
        {
          key: 'transcripts',
          label: 'Transcripts',
          icon: 'i-heroicons-document-text',
          values: res.results[2]
        }
      ]
    } catch (e) {
      console.error(e)
    }

    try {
      epmap.value = (await (await fetcher('search', {
        method: 'POST',
        body: JSON.stringify({
          episodes: [].concat(res.results[0].hits.map(c => c.parent), res.results[2].hits.map(c => c.parent))
        })
      })).json()).data
    } catch (e) {
      console.error('Failed to resolve topic parents')
    }

    visible.value = true
  }
}, {
  watch: [query]
})

</script>
<template>
  <div :class="`shadow-sm shadow-black bg-${cfg.theme.primary}-800 w-100 flex-col`">
    <template v-for="(banner, index) in banners" :key="index">
      <Banner v-if="banner.show" :pid="banner.id" :fixed="banner.fixed" :bg="banner.color.bg" :fg="banner.color.fg">
        <p>
          {{ banner.message }}
          <a :style="{ color: banner.fg }" target="_blank" :href="banner.url">
            <Icon :name="banner.icon"/>
            {{ banner['icon-message'] }}
          </a>
        </p>
      </Banner>
    </template>
    <div class="flex w-100">
      <a
          :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.primary}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.primary}-600 transition-all drop-shadow-xl`"
          href="/"
      >
        <img class="w-32" src="https://cdn.thewandb.com/assets/WANDB_darkBackground.svg">
      </a>
      <a
          :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.primary}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.primary}-600 transition-all drop-shadow-xl`"
          href="/"
      >
        <h3 class="py-3 text-l transition-all">
          Video Feed
        </h3>
      </a>
      <!-- <a
        href="/contributors"
        :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.primary}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.primary}-600 transition-all drop-shadow-xl`"
      >
        <h3 class="hover:font-bold py-3 text-l transition-all">
          Contributors
        </h3>
      </a> -->
      <a
          :class="`uppercase pt-1 pb-1 pl-5 pr-5 mr-auto text-${cfg.theme.primary}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.primary}-600 transition-all drop-shadow-xl`"
          href="/cast"
      >
        <h3 class="h-fit py-3 text-center text-l transition-all">
          Cast
        </h3>
      </a>
      <USelectMenu v-model="theme" :options="selectableThemes">
        <UButton
            :class="`rounded-none hover:bg-${cfg.theme.primary}-600 text-${cfg.theme.primary}-100`"
            :color="cfg.theme.primary"
            trailing-icon="i-heroicons-chevron-down-20-solid"
        >
          <p>{{ theme.value }}</p>
        </UButton>
      </USelectMenu>
      <template v-if="profile">
        <UDropdown :items="items">
          <UButton
              :class="`rounded-none hover:bg-${cfg.theme.primary}-600 text-${cfg.theme.primary}-100`"
              color="none"
              trailing-icon="i-heroicons-chevron-down-20-solid"
          >
            <UAvatar :src="profile.avatar" alt="Avatar"/>
            <p :class="`text-${cfg.theme.primary}-100`">
              {{ profile.username }}
            </p>
          </UButton>
          <template #item="{ item }">
            <template v-if="item">
              <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4"/>
              <UAvatar
                  v-else-if="item.avatar"
                  v-bind="item.avatar"
                  class="object-cover mx-2 my-2"
                  :alt="p.name"
                  size="lg"
              />
              {{ item.label }}
            </template>
          </template>
        </UDropdown>
      </template>
      <template v-else>
        <UDropdown :items="items">
          <UButton color="none" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid"/>
          <template #item>
            <template v-if="selected">
              <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4"/>
              <UAvatar
                  v-else-if="selected.avatar"
                  :alt="p.name"
                  class="object-cover mx-2 my-2"
                  size="lg"
                  v-bind="selected.avatar"
              />
              {{ selected.label }}
            </template>
          </template>
        </UDropdown>
      </template>
      <div class="my-auto mx-2">
        <UInput
            v-model="query"
            :color="cfg.theme.primary"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search..."
            size="sm"
            variant="outline"
        />
      </div>
      <div>
        <UModal v-model="visible" :overlay="false">
          <UCard>
            <template #header>
              <UInput
                  v-model="query"
                  :color="cfg.theme.primary"
                  focus
                  icon="i-heroicons-magnifying-glass-20-solid"
                  placeholder="Search..."
                  size="sm"
                  variant="outline"
              />
            </template>
            <UTabs :items="results" class="w-full">
              <template #default="{ item, selected }">
                <div class="flex items-center gap-2 relative truncate">
                  <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0"/>
                  <span class="truncate">{{ item.label }}</span>
                  <span v-if="selected"
                        :class="`absolute -right-4 w-2 h-2 rounded-full  bg-${cfg.theme.primary}-500 dark:bg-${cfg.theme.primary}-400`"/>
                </div>
              </template>
              <template #item="{ item }">
                <template v-if="item.key==='topics'">
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of
                    {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(t, i) in item.values.hits" :key="i">
                    <NuxtLink :href="`/videos/${t.parent}`">
                      <div
                          :class="`w-full p-2 rounded-md my-2 mr-2 bg-${cfg.theme.primary}-800 dark:bg-${cfg.theme.primary}-800`">
                        <h3 class="text-xl font-semibold">
                          {{ t.title }}
                        </h3>
                        <p class="text-md">
                          <template v-if="epmap[t.parent]">
                            {{ epmap[t.parent].title }}
                          </template>
                          <template v-else>
                            Episode Not Found
                          </template>
                        </p>
                      </div>
                    </NuxtLink>
                  </template>
                </template>
                <template v-else-if="item.key==='episodes'">
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of
                    {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(ep, i) in item.values.hits" :key="i">
                    <NuxtLink :href="`/videos/${ep.id}`">
                      <div
                          :class="`w-full p-2 rounded-md my-2 mr-2 bg-${cfg.theme.primary}-800 dark:bg-${cfg.theme.primary}-800 flex-col`">
                        <img :src="`https://cdn.thewandb.com/thumbs/${ep.id}.jpeg`"
                             class="w-auto aspect-video mx-auto mb-2 mt-1 h-64 rounded-md"
                             @error="src=`https://i.ytimg.com/${ep.id}/maxresdefault.jpeg`">
                        <h3 class="text-lg font-semibold">
                          {{ ep.title }}
                        </h3>
                      </div>
                    </NuxtLink>
                  </template>
                </template>
                <template v-else-if="item.key==='transcripts'">
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of
                    {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(t, i) in item.values.hits" :key="i">
                    <NuxtLink :href="`/videos/${t.parent}`">
                      <div
                          :class="`w-full p-2 rounded-md my-2 mr-2 bg-${cfg.theme.primary}-800 dark:bg-${cfg.theme.primary}-800`">
                        <h3 class="text-xl font-semibold">
                          <template v-if="epmap[t.parent]">
                            {{ epmap[t.parent].title }}
                          </template>
                          <template v-else>
                            Unknown Episode
                          </template>
                        </h3>
                        <ul class=" mx-auto w-80 list-decimal">
                          <template v-for="(m,i2) in t.matches" :key="i2">
                            <li class="my-1" v-html="m"/>
                          </template>
                        </ul>
                      </div>
                    </NuxtLink>
                  </template>
                </template>
              </template>
            </UTabs>
          </UCard>
        </UModal>
      </div>
      <!-- <input type="text" autocomplete="off" :class="style.search" placeholder="Search..." @input="search"> -->

      <!-- <div
        :class="style.searchResults"
        :style="{
          // 'max-height': visible ? ((results.length * 110) + ((episodeResults.length * 110))) + 'px' : '0px',
          opacity: visible ? '0.95' : '0',
          display: visible ? 'block' : 'none'
        }"
      >
        <h2>Topics Matching Search</h2>
        <template v-for="(result, index) in results" :key="index">
          <div v-if="!result.error" :class="style.searchResult" @click="openVideo(result.id)">
            <img :src="thumbs[result.id]">
            <span>
              <h2>{{ result.title }}</h2>
              <ul>
                <li v-for="idx in (result.matched_topics.length > 2 ? 2 : result.matched_topics.length)" :key="idx">
                  {{ result.matched_topics[idx - 1].title }}
                </li>
                <li v-if="result.matched_topics.length > 2">
                  as well as {{ (result.matched_topics.length - 2).toLocaleString() }} other topics
                </li>
              </ul>
            </span>
          </div>
          <div v-else :class="style.searchResultError">
            <h2>No Results Found</h2>
          </div>
        </template>
        <hr>
        <h2>Episodes containing search</h2>
        <template v-for="(result, index) in episodeResults" :key="index">
          <div v-if="!result.error" :class="style.searchResult" @click="openVideo(result.id)">
            <img :src="thumbs[result.id]">
            <span>
              <h2>{{ result.title }}</h2>
            </span>
          </div>
          <div v-else :class="style.searchResultError">
            <h2>No Results Found</h2>
          </div>
        </template>
      </div> -->
    </div>
  </div>
</template>
