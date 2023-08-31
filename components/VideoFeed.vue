<script setup>
import InfiniteLoading from 'v3-infinite-loading'
import style from './VideoFeed.module.css'

const sb = useSupabaseClient()

const fd = ref([])
const fdm = ref(new Map())
const episodeCount = ref(0)
const { data } = useAsyncData(async () => {
  try {
    const cast = await (await fetch('/api/v1/cast', {
      method: 'POST'
    })).json()
    const stats = (await (await fetch('/api/v1/stats')).json()).data
    return {
      ...stats,
      cdata: cast.data
    }
  } catch (e) {
    console.error(e)
  }
}, { watch: [fd] })
const filters = ref({
  order: 'release-desc',
  startDate: new Date('2012-08-28T00:00:00.000Z'),
  endDate: new Date(),
  members: []
})

let offset = 0

function filter() {
  offset = 0
  fd.value = []
  fdm.value = new Map()
  filters.value.order = document.getElementById('orderBy').value
  const start = document.getElementById('searchStart').valueAsDate
  const end = document.getElementById('searchEnd').valueAsDate

  if (start) { filters.value.startDate = start }
  if (end) { filters.value.endDate = end }

  const cast = []
  const cf = document.getElementById('castFilter')

  for (let i = 0; i < cf.children.length; i++) {
    const node = cf.children[i].children[0]
    if (node.checked) { cast.push(node.id) }
  }

  filters.value.members = cast

  infinite()
}

async function infinite() {
  try {
    const feed = await (await fetch('/api/v1/episodes', {
      method: 'POST',
      body: JSON.stringify({
        filters: filters.value,
        offset,
        limit: 20
      })
    })).json()

    feed.data.episodes.filter(({ id }) => !fdm.value.has(id))
    fd.value = fd.value.concat(feed.data.episodes)
    episodeCount.value = feed.data.count
    offset += 20
  } catch (e) {
    // console.error(e)
  }
}

infinite()
</script>

<template>
  <template v-if="fd.size < 20">
    <div :class="style.container">
      <div :class="style.filterbox" />
      <div :class="style.videobox">
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
        <VideoContainer :ghost="true" />
      </div>
    </div>
  </template>
  <template v-else>
    <div :class="style.container">
      <div id="filterbox" :class="style.filterbox">
        <div :class="style.input">
          <button type="submit" @click="filter()">
            Load Results
          </button>
        </div>
        <div :class="style.input">
          <label for="orderBy">Order By:</label>
          <select id="orderBy" name="orderBy">
            <option value="release">
              Stream Date (Ascending)
            </option>
            <option value="release-desc" selected>
              Stream Date (Descending)
            </option>
            <option value="duration">
              Duration (Ascending)
            </option>
            <option value="duration-desc">
              Duration (Descending)
            </option>
            <option value="title">
              Title (Ascending)
            </option>
            <option value="title-desc">
              Title (Descending)
            </option>
            <option value="topics">
              Topic Count (Ascending)
            </option>
            <option value="topics-desc">
              Topic Count (Descending)
            </option>
          </select>
        </div>
        <div :class="style.inputDuplicate">
          <div :class="style.input">
            <label for="searchStart">Start Cutoff:</label>
            <input id="searchStart" type="date" name="searchStart" :valueAsDate="filters.startDate">
          </div>
          <div :class="style.input">
            <label for="searchEnd">End Cutoff:</label>
            <input id="searchEnd" type="date" name="searchEnd" :valueAsDate="filters.endDate">
          </div>
        </div>
        <div :class="style.input">
          <p>Show only episodes featuring:</p>
          <ul id="castFilter">
            <template v-if="data">
              <template v-for="(member, index) in data.cdata" :key="index">
                <li :class="style.inlineCheck">
                  <input :id="member.id" type="checkbox" :checked="filters.members.includes(member.id)">
                  <p>{{ member.name }} ({{ member.outlet }})</p>
                </li>
              </template>
            </template>
            <template v-else>
              <li>Loading Cast</li>
            </template>
          </ul>
        </div>
        <p>
          Showing episodes 1 to {{ fd.length.toLocaleString() }} of {{ (episodeCount).toLocaleString() }}
        </p>
        <h4 style="margin: 0 auto -0.5rem 0.5rem">Statistics</h4>
        <p v-if="data">
          Archive currently contains:
          <br>
          - Total Duration Archived: {{ toTimestamp(data.seconds) }}
          <br>
          - {{ data.episodes.toLocaleString() }} Episodes
          <br>
          - {{ data.topics.toLocaleString() }} Topics
          <br>
          - {{ data.cast.toLocaleString() }} Guests / Hosts
          <br>
          - Contributions from {{ data.contributors.toLocaleString() }} people
          <br>
        </p>
        <p v-else>
          Loading Statistics
        </p>
        <!-- </input> -->
      </div>
      <div :class="style.videobox">
        <template v-for="(video, index) in fd" :key="index">
          <VideoContainer :id="video.id" />
        </template>
        <InfiniteLoading v-if="fd.length > 19" @infinite="infinite" />
      </div>
    </div>
  </template>
</template>
