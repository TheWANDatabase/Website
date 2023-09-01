<script async setup>
import { v4 } from 'uuid'
import style from './videos.module.css'
import { parse } from 'node-webvtt'

const sb = useSupabaseClient()
const route = useRoute()
const { id } = route.params

const profile = useState('uprofile', () => undefined)
const showEditor = ref(false)
const canEdit = ref(false)
const showCorruptionModal = ref(false)
const showContentWarningModal = ref(false)
const meta = ref('Video Viewer')
const time = ref(0)
const watch = ref()
const timeHuman = ref('00:00:00')
const timePercentage = ref('0.00')
const itv = {
  player: null,
  viewport: null
}
const castMap = new Map()
const tsMap = new Map()
const topicEditorList = ref([])
const showTopicEditor = ref(false)
const topicEditor = {
  time: {
    hh: ref(0),
    mm: ref(0),
    ss: ref(0)
  },
  end: {
    hh: ref(0),
    mm: ref(0),
    ss: ref(0)
  },
  type: ref('category'),
  title: ref(''),
  parent: ref(null)
}
const showPersonSearch = ref(false)
const castSearchValue = ref('')




useAsyncData(() => {
  if (profile.value) {
    canEdit.value = ((profile.value.permissions & 1) === 1 || (profile.value.permissions & 2) === 1);
  }
}, {
  watch: [profile]
})



useAsyncData(async () => {
  try {
    if (data) {
      if (Math.round(time.value) >= Math.round(data.value.episode.duration - 60)) {
        if (profile.value && watch.value) {
          await sb.from('episode_progression').update({
            viewed_seconds: Math.floor(data.value.episode.duration)
          }).eq('id', watch.value.id)
        }
      } else if (profile.value && watch.value) {
        if (time.value % 5 === 1) {
          await sb.from('episode_progression').update({
            viewed_seconds: Math.floor(time.value)
          }).eq('id', watch.value.id)
        }
      } else if (profile.value) {
        const x = await sb.from('episode_progression').select('*')
          .eq('viewer', profile.value.id)
          .eq('episode', id).maybeSingle()
        if (x.data) {
          watch.value = x.data
          if (!route.query.t && player) {
            player.seekTo(watch.value.viewed_seconds)
          }
        } else {
          const a = await sb.from('episode_progression').insert({
            viewer: profile.value.id,
            episode: id,
            viewed_seconds: Math.floor(time.value)
          }).select()
          watch.value = a.data[0]
        }
      }
    }
  } catch (e) {
  }
}, {
  server: false,
  watch: [time]
})

onMounted(() => {
  setTimeout(() => {
    if (player !== null) {
      if (route.query.t) {
        let t = parseInt(route.query.t)
        console.log("Time Query Provided, skipping to", t)
        player.seekTo(t)
        player.playVideo()
      }
    }
  }, 500)
  itv.player = setInterval(() => {
    if (player !== null) {
      try {
        if (player.getCurrentTime) {
          time.value = player.getCurrentTime()
          timeHuman.value = toTimestamp(player.getCurrentTime())
          timePercentage.value = ((time.value / data.value.episode.duration) * 100).toFixed(2)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, 50)
})

onUnmounted(() => {
  if (itv.player) { clearInterval(itv.player) }
  if (itv.viewport) { clearInterval(itv.viewport) }
})

const { data, error } = useAsyncData(async () => {
  const data = await (await fetch('http://localhost:3000/api/v1/videos/detailed/' + id)).json()
  const episode = data.episode
  showCorruptionModal.value = episode.flags.corrupt
  showContentWarningModal.value = episode.flags.cw

  useHead({
    title: episode.title + ' | The WAN DB',
    link: [
      {
        hid: 'canonical',
        property: 'canonical',
        content: 'https://thewandb.com/videos/' + episode.id
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
        content: episode.title + ' | The WAN DB'
      },
      {
        hid: 'twitter-title',
        property: 'twitter:title',
        content: episode.title + ' | The WAN DB'
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
    ],
    script: [
      {
        src: 'https://www.youtube.com/iframe_api'
      },
      {
        src: '/scripts/player.js'
      }
    ]
  })
  return data

})

function addGroup() {
  showTopicEditor.value = true
  // data.value.topics.push({
  //     id: v4(),
  //     episode: data.value.episode.id,
  //     section: false,
  //     title: 'New Topic',
  //     description: '',
  //     url: '',
  //     timestamp: '00:00:00',
  //     timestamp_raw: 0,
  //     last_modified: new Date(),
  //     hash: hash(new Date().toISOString() + 'new_topic'),
  //     children: []
  // })
}

function addTopicToGroup(id) {
  for (let i = 0; i < data.value.topics.length; i++) {
    if (data.value.topics[i].hash === id) {
      data.value.topics[i].children.push({
        id: v4(),
        episode: data.value.episode.id,
        section: false,
        title: 'New Topic',
        description: '',
        url: '',
        timestamp: '00:00:00',
        timestamp_raw: 0,
        last_modified: new Date()
      })
    }
  }
}

const castSearchResults = useAsyncData(async () => {
  if (castSearchValue.value.length === 0) {
    return []
  } else {
    const d = await sb.rpc('search_cast', {
      search_term: castSearchValue.value
    })
    for (let i = 0; i < d.data.length; i++) {
      d.data[i].avatar = 'https://cdn.thewandb.com/mugs/' + d.data[i].mug
    }
    return d.data
  }
}, {
  watch: [castSearchValue]
})

function seek(timestamp) {
  try {
    if (player) {
      player.seekTo(timestamp)
    }
  } catch (e) {
  }
}

function addPerson() {
  showPersonSearch.value = true
}

function toggleCastMember(id) {
  if (data.value.episode.cast.includes(id)) {
    data.value.episode.cast = data.value.episode.cast.filter(i => i !== id)
  } else { data.value.episode.cast.push(id) }
}

async function saveCastMembers() {
  await sb.from('episodes').update({
    cast: data.value.episode.cast.filter(function (elem, pos) {
      return data.value.episode.cast.indexOf(elem) === pos
    })
  }).eq('id', data.value.episode.id)
  window.location.reload()
}

function closeEditor() {
  showPersonSearch.value = false
  showTopicEditor.value = false
}

function processTopicChanges() {
  const tpc = topicEditor
  if (tpc.type.value === 'category') {
    const start = ((tpc.time.hh.value * 60 * 60) + (tpc.time.mm.value * 60) + tpc.time.ss.value)
    const end = ((tpc.end.hh.value * 60 * 60) + (tpc.end.mm.value * 60) + tpc.end.ss.value)

    topicEditorList.value.push({
      id: v4(),
      accepted: false,
      title: tpc.title.value,
      timestamp_raw: start,
      timestamp: toTimestamp(start),
      end,
      section: true,
      episode: id
    })
  }
}
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
    <template v-if="(showContentWarningModal && showCorruptionModal)">
      <div :class="style.warningModal">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.episode.title }}</p>
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
      <div :class="style.warningModal">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.episode.title }}</p>
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
      <div :class="style.warningModal">
        <h1>Proceed With Caution!</h1>
        <p>Video: {{ data.episode.title }}</p>
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
      <div :class="style.container">
        <div :class="style.viewport">
          <!-- Title Bar Section -->
          <div :class="style.videoTitleBar">
            <div>
              <h2>{{ data.episode.title }}</h2>
              <h4>Originally Aired: {{ new Date(data.episode.aired).toLocaleDateString() }}</h4>
              <h4>
                Runtime: {{ data.episode.duration_text }}
                (You've watched {{ timeHuman }} | That's {{ timePercentage }}%)
              </h4>
            </div>
            <div :class="style.buttonContainer">
              <a :class="style.watchButton" :href="data.episode.youtube" target="_blank">
                <Icon name="mdi:youtube" color="#ff0000" />
                <span>Watch On YouTube</span>
              </a>
              <a :class="style.watchButton" v-if="data.episode.floatplane" target="_blank"
                :href="data.episode.floatplane">
                <Icon name="simple-icons:floatplane" color="#0d6efd" />
                <span>Watch On Floatplane</span>
              </a>
              <a :class="style.watchButton" v-else>
                <Icon name="simple-icons:floatplane" color="#fff" />
                <span>VOD Unavailable</span>
              </a>
            </div>
          </div>

          <!-- Player Section -->
          <div :class="style.video">
            <!-- Transcript Section -->
            <div :class="style.transcript">
              <div :class="style.transcriptInner">
                <template v-if="data.transcript">
                  <template v-for="(segment, index) in data.transcript.vtt.cues" :key="index">
                    <div
                      :class="(time >= segment.start && time <= segment.end) ? style.highlightedSpan : (time >= segment.end) ? (time >= segment.end) ? style.noDisplay : style.hiddenSpan : undefined">
                      <template v-if="segment.va">
                        <img :src="segment.va.mug" />
                        <p>{{ segment.text }}</p>
                      </template>
                      <template v-else>
                        <p>{{ segment.text }}</p>
                      </template>
                    </div>
                  </template>
                  <span>Note: These subtitles are generated using OpenAI&apos;s <a
                      href="https://openai.com/research/whisper">Whisper</a> Automatic Speech Recognition</span>
                </template>
                <template v-else>
                  Transcript unavailable
                </template>
              </div>
            </div>
            <iframe id="videoplayerviewportsector" :src="`https://www.youtube.com/embed/${id}?enablejsapi=1`"
              title="YouTube video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen />
          </div>

          <!-- Topic Section -->
          <ul :class="style.groups">
            <button v-if="canEdit" style="position:sticky;top:0rem;" @click="addGroup()">
              Add Group
            </button>
            <template v-if="profile">
              <div v-if="canEdit" :class="[style.topicEditor, showTopicEditor ? undefined : style.hidden]">
                <div :class="style.topicEditorInner">
                  <button :class="[style.editorClose, style.hoverEffects]" @click="closeEditor()">
                    Close
                  </button>
                  <div :class="style.editorHorizontal">
                    <h1>Topic Editor</h1>
                  </div>
                  <h3>Topic Type</h3>
                  <p>
                    <strong>Container</strong>
                    <br>
                    Collapsible topic container, used to show just a general topic.
                    <br>
                    (eg: Topic 1 - xQc's Reaction Called Out)
                    <br>
                    <br>
                    <strong>Topic</strong>
                    <br>
                    Used for more precise breakdowns of whats going on.
                    <br>(eg: specific Merch Message question)
                  </p>
                  <select v-model="topicEditor.type.value" placeholder="Topic Title Text">
                    <option value="category">
                      Container
                    </option>
                    <option value="topic">
                      Topic
                    </option>
                  </select>
                  <h3>Title</h3>
                  <input v-model="topicEditor.title.value" placeholder="Topic Title Text">
                  <h3>Start Timestamp</h3>
                  <p>
                    At which point should the topic be highlighted in the player view?
                  </p>
                  <div :class="style.editorHorizontal">
                    <input v-model="topicEditor.time.hh.value" type="number" placeholder="00">
                    <input v-model="topicEditor.time.mm.value" type="number" placeholder="00">
                    <input v-model="topicEditor.time.ss.value" type="number" placeholder="00">
                  </div>
                  <h3>End Timestamp</h3>
                  <p>
                    When should the highlight be disabled. This is usually about 1 second before the start time
                    of the next topic.
                  </p>
                  <div :class="style.editorHorizontal">
                    <input v-model="topicEditor.end.hh.value" type="number" placeholder="00">
                    <input v-model="topicEditor.end.mm.value" type="number" placeholder="00">
                    <input v-model="topicEditor.end.ss.value" type="number" placeholder="00">
                  </div>
                  <template v-if="topicEditor.type.value === 'topic'">
                    <h3>Parent Container</h3>
                    <p>
                      Which primary topic this subtopic should be stored within (only works on 'Topic'
                      entries,
                      and not 'Container' entries)
                    </p>
                    <select v-model="topicEditor.parent.value">
                      <option v-for="(topic, index) in topicEditorList" :key="index" :value="topic.id">
                        {{ topic.title }}
                      </option>
                    </select>
                  </template>
                  <h4>Preview</h4>
                  <Accordion v-if="topicEditor.type.value === 'category'" :show="false">
                    <template #header>
                      <h3>{{ topicEditor.title.value }} </h3>
                      <button>Jump To Topic</button>
                    </template>
                    <h4>No sub-topics available</h4>
                  </Accordion>
                  <div v-else :class="[style.topic]">
                    <p :class="style.topicTitle">
                      {{ topicEditor.title.value.length > 0 ? topicEditor.title.value
                        : 'Topic Title Text' }}
                    </p>
                    <span :class="style.topicDetails">
                      <p v-if="profile" :class="style.topicContributor">
                        Contributor: {{
                          profile.username }}
                        <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
                      </p>
                      <p :class="style.topicTimestamp">{{ topicEditor.time.hh }} :
                        {{ topicEditor.time.mm }} : {{ topicEditor.time.ss }}</p>
                    </span>
                  </div>
                  <button @click="processTopicChanges()">
                    Edit Topic
                  </button>
                </div>
              </div>
            </template>
            <template v-if="data.topics.length > 0">
              <template v-for="(group, index) in data.topics" :key="index">
                <Accordion :show="(group.timestamp_raw <= time && group.endpoint - 1 >= time)">
                  <template #header>
                    <h3>
                      {{ group.title }}
                      <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
                    </h3>
                    <button @click="(e) => seek(group.timestamp_raw)">
                      Jump To Topic
                    </button>
                  </template>
                  <span v-if="canEdit" :class="style.topicButtons">
                    <button :class="[style.topicButton, style.hoverEffects]" @click="save(group.id, true)">Save
                      Changes</button>
                    <button :class="[style.topicButton, style.hoverEffects]" @click="addTopicToGroup(group.hash)">Add
                      Topic</button>
                    <button :class="[style.topicButton, style.hoverEffects]" @click="removeGroup(group.hash)">Delete
                      Group</button>
                  </span>
                  <template v-if="group.children">
                    <template v-for="(topic, idx in group.children" :key="idx">
                      <div :id="topic.id"
                        :class="[style.topic, (topic.timestamp_raw <= time && topic.endpoint >= time) ? style.activeTopic : undefined]"
                        @click="(e) => seek(topic.timestamp_raw)">
                        <p :class="style.topicTitle">
                          {{ topic.title }}
                        </p>
                        <span :class="style.topicDetails">
                          <p v-if="topic.contributor" :class="style.topicContributor">
                            Contributor: {{
                              topic.contributor.username }}
                            <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                              color="#1DA1F2" />
                          </p>
                          <p v-else :class="style.topicContributor">Unknown Contributor
                            <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                              color="#1DA1F2" />
                          </p>
                          <p :class="style.topicTimestamp">{{ topic.timestamp }}</p>
                        </span>
                      </div>
                    </template>
                  </template>
                </Accordion>
              </template>
            </template>
            <template v-else>
              <h3>Topics currently unavailable</h3>
            </template>
          </ul>

          <!-- Cast Section -->
          <div :class="style.cast">
            <button v-if="canEdit" style="position:sticky;top:0rem;" @click="addPerson()">
              Add Person
            </button>
            <template v-if="profile">
              <div v-if="canEdit" :class="[style.personEditorSearch, showPersonSearch ? undefined : style.hidden]">
                <div :class="style.personEditorInner">
                  <button :class="[style.editorClose, style.hoverEffects]" @click="closeEditor()">
                    Close
                  </button>
                  <div :class="style.editorHorizontal">
                    <h1>Cast Editor</h1>
                  </div>
                  <div :class="style.editorHorizontal">
                    <input v-model="castSearchValue" :class="[style.searchBar, style.hoverEffects]" type="text"
                      placeholder="Search...">
                    <button :class="[style.editorSave, style.hoverEffects]" @click="saveCastMembers()">
                      Save
                    </button>
                  </div>
                  <div :class="style.editorSearchContainer">
                    <template v-if="castSearchResults.data.value.length > 0">
                      <template v-for="(person, index) in castSearchResults.data.value" :key="index">
                        <div
                          :class="[style.castSearchResult, data.episode.cast.includes(person.id) ? style.inclusive : undefined]"
                          @click="toggleCastMember(person.id)">
                          <img :src="person.avatar">
                          <div>
                            <span>
                              <h3>
                                {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '" ')
                                  : person.name }}
                              </h3>
                              <p>
                                {{ person.role }}
                              </p>
                            </span>
                            <div>
                              <a v-if="person.ltt_forum" :href="'https://linustechtips.com/profile/' + person.ltt_forum"
                                target="_blank">
                                <img src="/2018_Linus_Tech_Tips_logo.svg" />
                              </a>
                              <a v-else>
                                <img src="/2018_Linus_Tech_Tips_logo_grey.svg" />
                              </a>

                              <a v-if="person.imdb" :href="'https://www.imdb.com/name/' + person.imdb" target="_blank">
                                <Icon name="bxl:imdb" color="#f3ce13" />
                              </a>
                              <a v-else>
                                <Icon name="bxl:imdb" color="#3a3a3a" />
                              </a>

                              <a v-if="person.wikipedia" :href="'https://en.wikipedia.org/wiki/' + person.wikipedia"
                                target="_blank">
                                <Icon name="mdi:wikipedia" />
                              </a>
                              <a v-else>
                                <Icon name="mdi:wikipedia" color="#3a3a3a" />
                              </a>

                              <a v-if="person.instagram" :href="'https://www.instagram.com/' + person.instagram"
                                target="_blank">
                                <Icon name="mdi:instagram" color="#C13584" />
                              </a>
                              <a v-else>
                                <Icon name="mdi:instagram" color="#3a3a3a" />
                              </a>

                              <a v-if="person.twitter" :href="'https://twitter.com/' + person.twitter" target="_blank">
                                <Icon name="logos:twitter" />
                              </a>
                              <a v-else>
                                <Icon name="mdi:twitter" color="#3a3a3a" />
                              </a>

                              <a v-if="person.linkedin" :href="'https://www.linkedin.com/in/' + person.linkedin"
                                target="_blank">
                                <Icon name="devicon:linkedin" />
                              </a>
                              <a v-else>
                                <Icon name="devicon-plain:linkedin" color="#3a3a3a" />
                              </a>
                            </div>
                            <h4>
                              <a v-if="person.outlet_uri" :href="person.outlet_uri" target="_blank">
                                {{ person.outlet ? person.outlet : 'No Affiliation' }}
                                <Icon name="ph:link" />
                              </a>
                              <template v-else>
                                {{ person.outlet ? person.outlet : 'No Affiliation'
                                }}
                              </template>
                            </h4>
                          </div>
                        </div>
                      </template>
                    </template>
                    <div v-else>
                      No Results
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-for="(person, index) in data.cast" :key="index">
              <div :class="style.castMember">
                <img :src="person.mug">
                <div>
                  <span>
                    <h3>
                      {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '" ')
                        : person.name }}
                    </h3>
                    <p>
                      {{ person.role }}
                    </p>
                  </span>
                  <div>
                    <a v-if="person.ltt_forum" :href="'https://linustechtips.com/profile/' + person.ltt_forum"
                      target="_blank">
                      <img src="/2018_Linus_Tech_Tips_logo.svg" />
                    </a>
                    <a v-else>
                      <img src="/2018_Linus_Tech_Tips_logo_grey.svg" />
                    </a>

                    <a v-if="person.imdb" :href="'https://www.imdb.com/name/' + person.imdb" target="_blank">
                      <Icon name="bxl:imdb" color="#f3ce13" />
                    </a>
                    <a v-else>
                      <Icon name="bxl:imdb" color="#3a3a3a" />
                    </a>

                    <a v-if="person.wikipedia" :href="'https://en.wikipedia.org/wiki/' + person.wikipedia"
                      target="_blank">
                      <Icon name="mdi:wikipedia" />
                    </a>
                    <a v-else>
                      <Icon name="mdi:wikipedia" color="#3a3a3a" />
                    </a>

                    <a v-if="person.instagram" :href="'https://www.instagram.com/' + person.instagram" target="_blank">
                      <Icon name="mdi:instagram" color="#C13584" />
                    </a>
                    <a v-else>
                      <Icon name="mdi:instagram" color="#3a3a3a" />
                    </a>

                    <a v-if="person.twitter" :href="'https://twitter.com/' + person.twitter" target="_blank">
                      <Icon name="logos:twitter" />
                    </a>
                    <a v-else>
                      <Icon name="mdi:twitter" color="#3a3a3a" />
                    </a>

                    <a v-if="person.linkedin" :href="'https://www.linkedin.com/in/' + person.linkedin" target="_blank">
                      <Icon name="devicon:linkedin" />
                    </a>
                    <a v-else>
                      <Icon name="devicon-plain:linkedin" color="#3a3a3a" />
                    </a>
                  </div>
                  <h4>
                    <a v-if="person.outlet_uri" :href="person.outlet_uri" target="_blank">
                      {{ person.outlet ? person.outlet : 'No Affiliation' }}
                      <Icon name="ph:link" />
                    </a>
                    <template v-else>
                      {{ person.outlet ? person.outlet : 'No Affiliation'
                      }}
                    </template>
                  </h4>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    Error {{ error }}
  </template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <div :class="style.error">
    <h3>This device is too small for this page to display correctly.</h3>
    <p>Please try viewing on a bigger device.</p>
  </div>
</template>
