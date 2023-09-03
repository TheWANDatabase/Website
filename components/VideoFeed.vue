<script setup>
import InfiniteLoading from 'v3-infinite-loading'
import style from './VideoFeed.module.css'

const fd = ref([])
const fdm = ref(new Map())
const episodeCount = ref(0)
const cst = ref([])
const csm = useState('csm', () => new Map())
const config = useRuntimeConfig()
const loading = ref(false)
const orderOptions = ref([
  {
    id: 'release',
    label: 'Stream Date (Ascending)'
  },
  {
    id: 'release-desc',
    label: 'Stream Date (Descending)'
  },
  {
    id: 'duration',
    label: 'Duration (Ascending)'
  },
  {
    id: 'duration-desc',
    label: 'Duration (Descending)'
  },
  {
    id: 'title',
    label: 'Title (Ascending)'
  },
  {
    id: 'title-desc',
    label: 'Title (Descending)'
  },
  {
    id: 'topics',
    label: 'Topic Count (Ascending)'
  },
  {
    id: 'topics-desc',
    label: 'Topic Count (Descending)'
  }
])

const { data } = useAsyncData(async () => {
  try {
    const cast = await (await fetch(config.public.api_base + '/cast', {
      method: 'POST'
    })).json()
    const stats = (await (await fetch(config.public.api_base + '/stats')).json()).data

    cst.value = cast.data.map((m) => {
      csm.value.set(m.id, {
        id: m.id,
        label: `${m.name} ${m.outlet ? ' (' + m.outlet + ')' : ''}`,
        mug: `https://cdn.thewandb.com/mugs/${m.mug}`
      })

      return {
        id: m.id,
        label: `${m.name} ${m.outlet ? ' (' + m.outlet + ')' : ''}`,
        avatar: {
          src: `https://cdn.thewandb.com/mugs/${m.mug}`
        }
      }
    })

    return {
      ...stats,
      cdata: cast.data
    }
  } catch (e) {
    console.error(e)
  }
})
const filters = ref({
  order: {
    id: 'release-desc',
    label: 'Stream Date (Descending)'
  },
  hideCW: false,
  hideCorrupt: false,
  startDate: new Date('2012-08-28T00:00:00.000Z').toDateString(),
  endDate: new Date().toDateString(),
  members: []
})

let offset = 0

function filter () {
  offset = 0
  fd.value = []
  fdm.value = new Map()
  infinite()
}

async function infinite () {
  loading.value = true
  try {
    const f = filters.value
    f.members = f.members.map(m => m.id)

    const feed = await (await fetch(config.public.api_base + '/episodes', {
      method: 'POST',
      body: JSON.stringify({
        filters: f,
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
  loading.value = false
}

infinite()
</script>

<template>
  <div class="flex-col">
    <div class="z-10 flex-col mt-3 mx-auto mb-2 bg-slate-800 p-2 rounded justify-evenly max-w-fit sticky top-1" style="top: 0.25rem;">
      <div class="flex max-w-fit mt-3 mx-auto mb-2 p-2 justify-evenly">
        <UTooltip text="Apply Filters">
          <UButton :loading="loading" icon="i-heroicons-magnifying-glass-20-solid" color="orange" variant="soft" @click="filter" />
        </UTooltip>
        <div class="w-24 flex justify-between mt-1.5 mx-10">
          <UTooltip text="Hide videos with content warnings">
            <UToggle v-model="filters.hideCW" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" />
          </UTooltip>
          <UTooltip text="Hide corrupted videos">
            <UToggle v-model="filters.hideCorrupt" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" />
          </UTooltip>
        </div>
        <UTooltip text="Only show videos after this date">
          <UInput v-model="filters.startDate" type="date" />
        </UTooltip>
        <div class="mx-5" />
        <UTooltip text="Only show videos before this date">
          <UInput v-model="filters.endDate" type="date" />
        </UTooltip>
        <div class="mx-5" />
        <USelectMenu
          v-model="filters.order"
          :options="orderOptions"
          :ui="{width: 'w-96 min-w-fit'}"
        />
        <div class="mx-5" />
        <USelectMenu
          v-model="filters.members"
          multiple
          :options="cst"
          placeholder="Select Cast Members"
          searchable

          class="w-72"
        >
          <template #label>
            <template v-if="selected">
              <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
              <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" class="object-cover mx-2 my-2" :alt="p.name" size="lg" />
              {{ selected.label }}
            </template>
          </template>
        </USelectMenu>

      <!-- <div :class="style.input">
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
      <h4 style="margin: 0 auto -0.5rem 0.5rem">
        Statistics
      </h4>
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
        - The WAN Show first aired {{ getRelativeTime(new Date('2012-08-28')) }}
        <br>
      </p>
      <p v-else>
        Loading Statistics
      </p> -->
      <!-- </input> -->
      </div>
      <div class="flex mt-3 mx-auto mb-1 p-0 justify-evenly">
        <UBadge variant="subtle" :label="`Showing episodes ${ fd.length.toLocaleString() } / ${ episodeCount.toLocaleString() }`" />
        <UBadge variant="subtle" :label="`Total Air Time: ${ toTimestamp(data.seconds) }`" />
        <UBadge variant="subtle" :label="`Guest Count: ${ data.cast.toLocaleString() }`" />
        <UBadge variant="subtle" :label="`Topic Count: ${ data.topics.toLocaleString() }`" />
        <UBadge variant="subtle" :label="`First Show: ${ getRelativeTime(new Date('2012-08-28')) }`" />
      </div>
    </div>
    <div class="flex flex-wrap justify-center">
      <template v-for="(video, index) in fd" :key="index">
        <VideoContainer :id="video.id" />
      </template>
      <InfiniteLoading v-if="fd.length > 19" @infinite="infinite" />
    </div>
  </div>
</template>
