<script async setup>
import style from './Header.module.css'

const sb = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()
const route = useRoute()

const profile = useState('uprofile', () => undefined)
const history = useState('history', () => new Map())
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

onMounted(() => {
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
  const bannerReq = await (await fetch('/api/v1/banners')).json()
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

  if (user.value) {
    const { data } = await (await fetcher('/api/v1/profiles', {
      method: 'POST',
      body: JSON.stringify({
        id: user.value.id
      })
    })).json()
    if (data === null) {
      sb.auth.signOut()
    } else {
      profile.value = data
      if (!history.value) { history.value = new Map() }

      const h = await (await fetch('/api/v1/history', {
        method: 'POST',
        body: JSON.stringify({
          id: user.value.id
        })
      })).json()

      if (h.data) {
        for (let i = 0; i < h.data.length; i++) {
          history.value.set(h.data[i].episode, h.data[i])
        }
      }
    }
  } else {
    profile.value = undefined
  }
}, {
  server: false,
  watch: [user]
})

const signInWithGoogle = async () => {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      //     queryParams: {
      //         access_type: 'offline',
      //         prompt: 'consent',
      //     },
      redirectTo: window.location.hostname === 'localhost' ? 'http://localhost:3000' : `https://${window.location.hostname}`
    }
  })
  if (error) { alert(error) }
}

const signInWithDiscord = async () => {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.hostname === 'localhost' ? 'http://localhost:3000' : `https://${window.location.hostname}`
    }
  })
  if (error) { alert(error) }
}

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
          icon: 'i-mdi-discord',
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
          click: signInWithGoogle,
          icon: 'i-mdi-google'
        },
        {
          label: 'Log In With Discord',
          click: signInWithDiscord,
          icon: 'i-mdi-discord'
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
          icon: 'i-mdi-discord',
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
const episodeResults = ref([])
const visible = ref(false)
const thumbs = ref({})
const query = ref('')

const { pending } = useAsyncData(async () => {
  if (query.value.length > 1) {
    const res = await (await fetch('/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        phrase: query.value,
        lmt: 5,
        ofst: 0
      })
    })).json()
    if (res.data.topics.length === 0) {
      results.value = [{
        error: 'No Results Found'
      }]
    } else {
      for (let i = 0; i < res.data.topics.length; i++) {
        thumbs.value[res.data.topics[i].id] = 'https://cdn.thewandb.com/thumbs/' + res.data.topics[i].id + '.jpeg'
      }

      results.value = res.data.topics
    }

    if (res.data.episodes.length === 0) {
      episodeResults.value = [{
        error: 'No Results Found'
      }]
    } else {
      for (let i = 0; i < res.data.topics.length; i++) {
        thumbs.value[res.data.episodes[i].id] = 'https://cdn.thewandb.com/thumbs/' + res.data.episodes[i].id + '.jpeg'
      }

      episodeResults.value = res.data.episodes
    }

    visible.value = results.value.length > 0
  } else {
    results.value = []
    visible.value = results.value.length > 0
    thumbs.value = {}
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
      <Banner v-if="banner.show" :pid="banner.pid" :fixed="banner.fixed" :bg="banner.bg" :fg="banner.fg">
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
          <UButton :class="`rounded-none hover:bg-${cfg.theme.greyscale}-600 text-${cfg.theme.greyscale}-100`" color="none" trailing-icon="i-heroicons-chevron-down-20-solid">
            <UAvatar :src="profile.avatar_url" alt="Avatar" /> <p :class="`text-${cfg.theme.greyscale}-100`">
              {{ profile.username }}
            </p>
            <template #item="{ item }">
              <template v-if="item">
                <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
                <UAvatar v-else-if="item.avatar" v-bind="item.avatar" class="object-cover mx-2 my-2" :alt="p.name" size="lg" />
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
              <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" class="object-cover mx-2 my-2" :alt="p.name" size="lg" />
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
