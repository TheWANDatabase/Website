<script async setup>
import style from './videos.module.css'
import { parse } from 'node-webvtt'
import webstomp from "webstomp-client"


const toast = useToast()
const route = useRoute()
const { id } = route.params
const debug = true
const profile = useState('uprofile', () => undefined)
const canEdit = ref(false)
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
let stomp;
onMounted(() => {
  if (debug) {
    toast.add({
      title: 'Socket Connecting'
    })
  }
  stomp = webstomp.client('wss://mq.thewandb.com/ws');
  stomp.connect('ui', '72MaU*6x2^p5u&T#', (e, x) => {
    if (debug) {
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Socket Connected',
        description: 'Please hold whilst we configure your queues'
      })
    }

    stomp.subscribe('/exchange/ui.notifications', (message) => {
      // process the message
      // acknowledge it
      try {
        let body = JSON.parse(message.body)
        toast.add(body)
        message.ack()
      } catch (e) {
        message.nack();
      }
    }, { 'ack': 'client' })
  })
  // stomp.
  // stomp.

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
  if (stomp) { stomp.disconnect() }
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
  showCorruptionModal.value = data.flags.corrupt
  showContentWarningModal.value = data.flags.cw
  try {
    const cues = await (await fetch(`https://cdn.thewandb.com/captions/${data.id}.vtt`, {
      headers: {
        'Accept': 'text/vtt'
      }
    })).text();

    for (let i = 0; i < data.cast.length; i++) {
      castMap.set(data.cast[i].id, data.cast[i])
      if (data.transcript[data.cast[i].id]) {
        for (let x = 0; x < data.transcript[data.cast[i].id].length; x++) {
          tsMap.set(data.transcript[data.cast[i].id][x], data.cast[i].id)
        }
      }
    }

    let c1 = parse(cues);

    data.cues = c1.cues.map((c) => {
      let speakers = /SPEAKER_[0-9]{2}/.exec(c.text);
      c.text = c.text.split(']: ')[1]
      if (speakers) {
        if (speakers.length > 0) {
          let speaker = speakers[0];
          if (tsMap.has(speaker)) {
            let ca = castMap.get(tsMap.get(speaker))
            c.va = {
              name: ca.forename + (ca.alias ? ' "' + ca.alias + '"' : '') + ' ' + ca.surname,
              avatar: 'https://cdn.thewandb.com/mugs/' + ca.avatar
            }

            return c;
          }
        }
      }
      c.va = {
        name: 'Unknown Speaker',
        avatar: null
      }

      return c;
    });
  } catch (e) {
    console.error("Failed to fetch caption CueFile", e);
  }

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
    ],
    script: [
      {
        src: 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js'
      },
      {
        src: '/scripts/player.js'
      }
    ]
  })
  return data

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
    <template v-if="(showContentWarningModal && showCorruptionModal)">
      <div :class="style.warningModal">
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
      <div :class="style.warningModal">
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
      <div :class="style.warningModal">
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
      <div :class="style.container">
        <div :class="style.viewport">
          <!-- Title Bar Section -->
          <!-- <div :class="style.videoTitleBar">
            <div>
              <h2>{{ data.title }}</h2>
              <h4>Originally Aired: {{ new Date(data.aired).toLocaleDateString() }}</h4>
              <h4>
                Runtime: {{ data.duration_text }}
                (You've watched {{ timeHuman }} | That's {{ timePercentage }}%)
              </h4>
            </div>
            <div :class="style.buttonContainer">
              <a :class="style.watchButton" :href="data.youtube" target="_blank">
                <Icon name="mdi:youtube" color="#ff0000" />
                <span>Watch On YouTube</span>
              </a>
              <a :class="style.watchButton" v-if="data.floatplane" target="_blank"
                :href="data.floatplane">
                <Icon name="simple-icons:floatplane" color="#0d6efd" />
                <span>Watch On Floatplane</span>
              </a>
              <a :class="style.watchButton" v-else>
                <Icon name="simple-icons:floatplane" color="#fff" />
                <span>VOD Unavailable</span>
              </a>
            </div>
          </div> -->

          <!-- Player Section -->
          <div id="fullscreen-container" :class="style.video">
            <!-- Transcript Section -->
            <div :class="style.transcript">
              <div :class="style.transcriptInner">
                <template v-if="data.cues">
                  <template v-for="(segment, index) in data.cues" :key="index">
                    <div
                      :class="(time >= segment.start && time <= segment.end) ? style.highlightedSpan : (time >= segment.end) ? (time >= segment.end) ? style.noDisplay : style.hiddenSpan : undefined">
                      <UAvatar :src="segment.va.icon" :alt="segment.va.name" />
                      <p>{{ segment.text }}</p>
                    </div>
                  </template>
                  <!-- <span>Note: These subtitles are generated using OpenAI&apos;s <a
                      href="https://openai.com/research/whisper">Whisper</a> Automatic Speech Recognition</span> -->
                </template>
                <template v-else>
                  Transcript unavailable
                </template>
              </div>
            </div>
            <span>
              <p>Use WAN DB CDN version (turn off if audio is missing)</p>
              <UToggle v-model="useCDN" />
            </span>
            <video v-if="data.flags.corrupt || useCDN" id="player" playsinline controls
              style="--plyr-color-main: rgb(185, 44, 37);"
              :data-poster="`https://cdn.thewandb.com/thumbs/${data.id}.jpeg`"
              :data-plyr-config='{ "title": data.title, fullscreen: { container: "#fullscreen-container", ratio: "21:9" } }'>
              <source :src="`https://cdn.thewandb.com/vod/${data.id}.mp4`" type="video/mp4" />
            </video>
            <div v-else class="plyr__video-embed" id="player" style="--plyr-color-main: rgb(185, 44, 37);"
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
                        <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
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
                      <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
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
                            <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
                          </p>
                          <p v-else :class="style.topicContributor">Unknown Contributor
                            <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
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
                          :class="[style.castSearchResult, data.cast.includes(person.id) ? style.inclusive : undefined]"
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
              <CastMember :person="person" />
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
