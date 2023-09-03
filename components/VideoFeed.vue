<script setup>
import InfiniteLoading from 'v3-infinite-loading'
import style from './VideoFeed.module.css'

const allowInfinite = ref(true)
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

    const feed = await (await fetcher(config.public.api_base + '/episodes', {
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
          <UButton :loading="loading" icon="i-heroicons-magnifying-glass-20-solid" variant="soft" @click="filter" />
        </UTooltip>
        <div class="w-32 flex justify-between mt-1.5 mx-10">
          <UTooltip text="Enable Infinity Scroll">
            <UToggle v-model="allowInfinite" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" />
          </UTooltip>
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
        >
          <template #label>
            <template v-if="selected">
              <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
              <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" class="object-cover mx-2 my-2" :alt="p.name" size="lg" />
              {{ selected.label }}
            </template>
          </template>
        </USelectMenu>
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
    </div>
    <div class="flex align-middle mx-auto w-fit my-5">
      <InfiniteLoading v-if="fd.length > 19 && allowInfinite" @infinite="infinite" />
      <UButton :loading="loading" v-else-if="fd.length > 19 && !allowInfinite" label="Load More" @click="infinite" />
    </div>
  </div>
</template>
