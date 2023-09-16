<script async setup>
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth'

const auth = useFirebaseAuth()
const user = useCurrentUser()
const config = useRuntimeConfig()
const route = useRoute()

const cmap = useState('hcast', () => new Map())

const profile = useState('uprofile', () => undefined)
// const history = useState('history', () => new Map())
const banners = useState('banners', () => [])
const cfg = useState('uconf', () => {
  return {
    theme: {
      name: 'poppy',
      primary: 'poppy',
      greyscale: 'zinc'
    }
  }
})

const error = ref(null)
function signinRedirect () {
  signInWithRedirect(auth, new GoogleAuthProvider()).catch((reason) => {
    console.error('Failed signinRedirect', reason)
    error.value = reason
  })
}

onMounted(async () => {
  await getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })

  function getConfig () {
    const raw = window.localStorage.getItem('cfgix')
    if (raw) {
      cfg.value = JSON.parse(raw)
    } else {
      window.localStorage.setItem('cfgix', JSON.stringify(cfg.value))
    }
  }

  try {
    getConfig()
  } catch (e) {
    console.error(e)
  }
})

useAsyncData(async () => {
  const bannerReq = await (await fetcher('banners')).json()
  banners.value = bannerReq.data.map((b) => {
    let show = true

    if (b.paths) {
      show = b.paths.includes(route.fullPath)
    }

    if (b.domains && show) {
      show = b.domains.includes(config.public.domain)
    }

    b.show = show

    return b
  })

  const d = (await (await fetcher('cast')).json()).data
  d.map((c) => {
    cmap.value.set(c.id, c)
    return c
  })

  if (user.value) {
    const { data } = await (await fetcher('profile', {
      method: 'POST',
      body: JSON.stringify({
        id: user.value.uid
      })
    })).json()
    if (data === null) {
      sb.auth.signOut()
    } else {
      profile.value = data
      // if (!history.value) { history.value = new Map() }

      // const h = await (await fetch('/api/v1/history', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id: user.value.id
      //   })
      // })).json()

      // if (h.data) {
      //   for (let i = 0; i < h.data.length; i++) {
      //     history.value.set(h.data[i].episode, h.data[i])
      //   }
      // }
    }
  } else {
    profile.value = undefined
  }
}, {
  server: false,
  watch: [user]
})

const items = ref([])

await useAsyncData(() => {
  if (profile.value) {
    items.value = [
      [
        {
          label: 'My Profile',
          icon: 'i-heroicons-arrow-top-right-on-square',
          click: () => {
            window.location.href = '/profile'
          }
        },
        {
          label: 'My Data',
          icon: 'i-heroicons-arrow-top-right-on-square',
          click: () => {
            window.location.href = '/profile/data'
          }
        }
      ],
      [
        {
          label: 'Log Out',
          icon: 'i-heroicons-arrow-left-on-rectangle',
          click: () => {
            sb.auth.signOut()
            profile.value = undefined
            user.value = undefined
            if (window.location.href.startsWith('/profile')) { window.location.href = '/' }
          }
        }
      ],
      [
        {
          label: 'Contribute',
          icon: 'i-heroicons-code-bracket',
          click: () => {
            window.open('https://github.com/TheWANDatabase', '_blank')
          }
        },
        {
          label: 'Donate',
          icon: 'i-heroicons-banknotes',
          click: () => {
            window.open('https://ko-fi.com/altrius', '_blank')
          }
        },
        {
          label: 'Join Our Discord',
          icon: 'i-heroicons-arrow-top-right-on-square',
          click: () => {
            window.open('https://discord.gg/sVQm5f35VF', '_blank')
          }
        }
      ]
    ]
  } else {
    items.value = [
      [
        {
          label: 'Log In With Google',
          click: signinRedirect,
          icon: 'i-heroicons-arrow-top-right-on-square'
        }
        //, {
        //   label: 'Log In With Discord',
        //   click: signInWithDiscord,
        // icon: 'i-heroicons-arrow-top-right-on-square',
        // }
      ],
      [
        {
          label: 'Contribute',
          icon: 'i-heroicons-code-bracket',
          click: () => {
            window.open('https://github.com/TheWANDatabase', '_blank')
          }
        },
        {
          label: 'Donate',
          icon: 'i-heroicons-banknotes',
          click: () => {
            window.open('https://ko-fi.com/altrius', '_blank')
          }
        },
        {
          label: 'Join Our Discord',
          icon: 'i-heroicons-arrow-top-right-on-square',
          click: () => {
            window.open('https://discord.gg/sVQm5f35VF', '_blank')
          }
        }
      ]
    ]
  }
}, {
  watch: [profile]
})

const results = ref([])
const epmap = ref({})
// const episodeResults = ref([])
const visible = ref(false)
// const thumbs = ref({})
const query = ref('')

const { pending } = useAsyncData(async () => {
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
              'id'
            ]
          },
          {
            indexUid: 'cast',
            q: query.value
          }
        ]
      })
    })).json()

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

    try {
      epmap.value = (await (await fetcher('search', {
        method: 'POST',
        body: JSON.stringify({
          episodes: res.results[0].hits.map(c => c.parent)
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

function openVideo (id) {
  window.location.pathname = '/videos/' + id
}

</script>
<template>
  <div :class="`shadow-sm shadow-black bg-${cfg.theme.greyscale}-800 w-100 flex-col`">
    <template v-for="(banner, index) in banners" :key="index">
      <Banner v-if="banner.show" :pid="banner.id" :fixed="banner.fixed" :bg="banner.color.bg" :fg="banner.color.fg">
        <p>
          {{ banner.message }}
          <a :style="{ color: banner.fg }" target="_blank" :href="banner.url">
            <Icon :name="banner.icon" /> {{ banner['icon-message'] }}
          </a>
        </p>
      </Banner>
    </template>
    <div class="flex w-100">
      <a
        href="/"
        :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.greyscale}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.greyscale}-600 transition-all drop-shadow-xl`"
      >
        <img class="w-32" src="https://cdn.thewandb.com/assets/WANDB_darkBackground.svg">
      </a>
      <a
        href="/"
        :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.greyscale}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.greyscale}-600 transition-all drop-shadow-xl`"
      >
        <h3 class="py-3 text-l transition-all">
          Video Feed
        </h3>
      </a>
      <!-- <a
        href="/contributors"
        :class="`uppercase pt-1 pb-1 pl-5 pr-5 text-${cfg.theme.greyscale}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.greyscale}-600 transition-all drop-shadow-xl`"
      >
        <h3 class="hover:font-bold py-3 text-l transition-all">
          Contributors
        </h3>
      </a> -->
      <a
        href="/cast"
        :class="`uppercase pt-1 pb-1 pl-5 pr-5 mr-auto text-${cfg.theme.greyscale}-100 hover:text-${cfg.theme.primary}-500 hover:bg-${cfg.theme.greyscale}-600 transition-all drop-shadow-xl`"
      >
        <h3 class="h-fit py-3 text-center text-l transition-all">
          Cast
        </h3>
      </a>

      <template v-if="profile">
        <UDropdown :items="items">
          <UButton
            :class="`rounded-none hover:bg-${cfg.theme.greyscale}-600 text-${cfg.theme.greyscale}-100`"
            color="none"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          >
            <UAvatar :src="profile.avatar" alt="Avatar" />
            <p :class="`text-${cfg.theme.greyscale}-100`">
              {{ profile.username }}
            </p>
            <template #item="{ item }">
              <template v-if="item">
                <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
                <UAvatar
                  v-else-if="item.avatar"
                  v-bind="item.avatar"
                  class="object-cover mx-2 my-2"
                  :alt="p.name"
                  size="lg"
                />
                {{ item.label }}
              </template>
              {{ console.log(item) }}
            </template>
          </UButton>
        </UDropdown>
      </template>
      <template v-else>
        <UDropdown :items="items">
          <UButton color="none" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
          <template #item>
            <template v-if="selected">
              <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
              <UAvatar
                v-else-if="selected.avatar"
                v-bind="selected.avatar"
                class="object-cover mx-2 my-2"
                :alt="p.name"
                size="lg"
              />
              {{ selected.label }}
              {{ console.log(selected) }}
            </template>
          </template>
        </UDropdown>
      </template>
      <div class="my-auto mx-2">
        <UInput
          v-model="query"
          variant="outline"
          :color="cfg.theme.greyscale"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          placeholder="Search..."
        />
      </div>
      <div>
        <UModal v-model="visible" :overlay="false">
          <UCard>
            <template #header>
              <UInput
                v-model="query"
                variant="outline"
                :color="cfg.theme.greyscale"
                icon="i-heroicons-magnifying-glass-20-solid"
                size="sm"
                placeholder="Search..."
                focus
              />
            </template>
            <UTabs :items="results" class="w-full">
              <template #default="{ item, selected }">
                <div class="flex items-center gap-2 relative truncate">
                  <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                  <span v-if="selected" :class="`absolute -right-4 w-2 h-2 rounded-full  bg-${cfg.theme.greyscale}-500 dark:bg-${cfg.theme.greyscale}-400`" />
                </div>
              </template>
              <template #item="{ item }">
                <template v-if="item.key==='topics'">
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(t, i) in item.values.hits" :key="i">
                    <NuxtLink :href="`/videos/${t.parent}`">
                      <div :class="`w-full p-2 rounded-md my-2 mr-2 bg-${cfg.theme.greyscale}-800 dark:bg-${cfg.theme.greyscale}-800`">
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
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(ep, i) in item.values.hits" :key="i">
                    <NuxtLink :href="`/videos/${ep.id}`">
                      <div :class="`w-full p-2 rounded-md my-2 mr-2 bg-${cfg.theme.greyscale}-800 dark:bg-${cfg.theme.greyscale}-800 flex-col`">
                        <img class="w-auto aspect-video mx-auto h-60" :src="`https://cdn.thewandb.com/thumbs/${ep.id}.jpeg`" @error="this.src=`https://i.ytimg.com/${ep.id}/maxresdefault.jpeg`">
                        <h3 class="text-lg font-semibold">
                          {{ ep.title }}
                        </h3>
                      </div>
                    </NuxtLink>
                  </template>
                </template>
                <template v-else-if="item.key==='cast'">
                  <h2>Showing results 1 - {{ item.values.hits.length.toLocaleString() }} of {{ item.values.estimatedTotalHits.toLocaleString() }}</h2>
                  <template v-for="(c, i) in item.values.hits" :key="i">
                    <CastMember :person="cmap.get(c.id)" />
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
