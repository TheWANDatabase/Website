<script setup>
import style from './Header.module.css'

const sb = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()
const route = useRoute()

const profile = useState('uprofile', () => undefined)
const history = useState('history', () => new Map())
const banners = useState('banners', () => [])

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
    const { data } = await (await fetch('/api/v1/profiles', {
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

const results = ref([])
const episodeResults = ref([])
const visible = ref(false)
const thumbs = ref({})

async function search (d) {
  const term = d.target.value
  if (term.length > 1) {
    const res = await (await fetch('/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        phrase: term,
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
        thumbs.value[res.data.topics[i].id] = sb.storage.from('thumbs').getPublicUrl(res.data.topics[i].id + '.jpeg').data.publicUrl
      }

      results.value = res.data.topics
    }

    if (res.data.episodes.length === 0) {
      episodeResults.value = [{
        error: 'No Results Found'
      }]
    } else {
      for (let i = 0; i < res.data.topics.length; i++) {
        thumbs.value[res.data.episodes[i].id] = sb.storage.from('thumbs').getPublicUrl(res.data.episodes[i].id + '.jpeg').data.publicUrl
      }

      episodeResults.value = res.data.episodes
    }

    visible.value = results.value.length > 0
  } else {
    results.value = []
    visible.value = results.value.length > 0
    thumbs.value = {}
  }
}

function openVideo (id) {
  window.location.pathname = '/videos/' + id
}

function login () {
  window.location.href = '/login'
}

function logout () {
  sb.auth.signOut()
  profile.value = undefined
}
</script>
<template>
  <div :class="style.headerContainer">
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
    <div :class="style.header">
      <h1 :class="[style.brand, style.wordmark]">
        THE
        <span :class="style.grey1">W</span>
        <span :class="style.orange">A</span>
        <span :class="style.grey2">N</span>
        DB
      </h1>
      <h1 :class="[style.brand, style.miniLogo]">
        <span :class="style.grey1">W</span>
        <span :class="style.orange">A</span>
        <span :class="style.grey2">N</span>
      </h1>
      <ul :class="style.navcontainer">
        <a :class="style.navlink" href="/">Video Index</a>
        <!-- <a :class="style.navlink" href="/contributors">Contributors</a>
            <a :class="style.navlink" href="/cast">Cast & Crew</a> -->
      </ul>

      <button v-if="!user" :class="style.login" @click="login">
        Login
      </button>
      <template v-else>
        <a v-if="profile" href="/profile" :class="style.profilePill">
          <img :src="profile.avatar_url">
          {{ profile.username ? profile.username : profile.full_name }}
        </a>
        <button :class="style.logout" @click="logout">
          Logout
        </button>
      </template>
      <input type="text" autocomplete="off" :class="style.search" placeholder="Search..." @input="search">
      <div
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
      </div>
    </div>
  </div>
</template>
