<script setup>
import InfiniteLoading from 'v3-infinite-loading'

const allowInfinite = ref(true)
const fd = ref([])
const fdm = ref(new Map())
const episodeCount = ref(0)
const cst = useState('cst', () => [])
const csm = useState('csm', () => { return {} })
const globalCSM = useState('globalCSM', () => { return {} })
const cfg = useState('uconf')
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
  }//,
  // {
  //   id: 'topics',
  //   label: 'Topic Count (Ascending)'
  // },
  // {
  //   id: 'topics-desc',
  //   label: 'Topic Count (Descending)'
  // }
])
const filters = useState('filter', () => {
  return {
    order: orderOptions.value[1],
    hideCW: false,
    hideCorrupt: false,
    startDate: new Date('2012-08-28T00:00:00.000Z').toDateString(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toDateString(),
    members: []
  }
})

useAsyncData(async () => {
  try {
    // const stats = (await (await fetch(config.public.api_base + '/stats')).json()).data
    if (cst.value.length === 0) {
      const orq = await (await fetcher('outlets')).json()
      const outlets = {}
      for (let i = 0; i < orq.results.length; i++) {
        const ot = orq.results[i]
        outlets[ot.id] = ot
      }
      const cast = (await (await fetcher('cast')).json()).results.map((m) => {
        m.outlet = outlets[m.outlet]
        return m
      })
      if (filters.value.members.length === 0) {
        cst.value = cast.map((m) => {
          csm.value[m.id] = {
            id: m.id,
            label: `${m.forename} ${m.surname} ${m.outlet ? ' (' + m.outlet.name + ')' : ''}`,
            mug: `https://cdn.thewandb.com/mugs/${m.avatar}`
          }
          globalCSM.value[m.id] = m

          return {
            id: m.id,
            label: `${m.forename} ${m.surname} ${m.outlet ? ' (' + m.outlet.name + ')' : ''}`,
            avatar: {
              src: `https://cdn.thewandb.com/mugs/${m.avatar}`
            }
          }
        })
      }
    }

    infinite()
  } catch (e) {
    console.error(e)
  }
})

let offset = 0

onMounted(() => {
  try {
    const raw = window.sessionStorage.getItem('FLTR')
    if (raw) {
      const fltr = JSON.parse(raw)
      fltr.members = []
      filters.value = fltr
    } else {
      window.sessionStorage.setItem('FLTR', JSON.stringify(filters.value))
    }
  } catch (e) {
    console.error(e)
  }
})

function filter() {
  offset = 0
  fd.value = []
  fdm.value = new Map()
  try {
    window.sessionStorage.setItem('FLTR', JSON.stringify(filters.value))
  } catch (e) {
    console.error(e)
  }
  infinite()
}

async function infinite() {
  loading.value = true
  try {
    const f = JSON.parse(JSON.stringify(filters.value))
    f.members = f.members.map(m => m.id)

    const feed = await (await fetcher('episodes', {
      method: 'POST',
      body: JSON.stringify({
        filters: f,
        offset,
        limit: 20
      })
    })).json()
    feed.episodes = feed.episodes.filter(({ id }) => !fdm.value.has(id))
    fd.value = fd.value.concat(feed.episodes)
    episodeCount.value = feed.stats
    offset += 20
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
</script>

<template>
  <div class="flex-col min-h-screen">
    <div
      :class="`shadow-sm shadow-black z-10 flex-col mt-3 mx-auto mb-2 bg-${cfg.theme.greyscale}-800 rounded justify-evenly max-w-fit sticky top-1`"
      style="top: 0.25rem;">
      <div class="flex p-2">
        <div class="w-42 flex-col my-auto mr-4 justify-evenly">
          <span class="flex w-56 justify-between my-1">
            <p :class="`text-${cfg.theme.greyscale}-400 h-5 inline align-middle`">Enable infinity scrolling</p>
            <UTooltip text="Enable Infinity Scroll">
              <UToggle v-model="allowInfinite" :color="cfg.theme.primary" on-icon="i-heroicons-check-20-solid"
                off-icon="i-heroicons-x-mark-20-solid"
                :ui="{ inactive: `bg-${cfg.theme.greyscale}-200 dark:bg-${cfg.theme.greyscale}-700` }" />
            </UTooltip>
          </span>
          <span class="flex w-56 justify-between my-1">
            <p :class="`text-${cfg.theme.greyscale}-400 h-5 inline align-middle`">Hide Content Warnings</p>
            <UTooltip text="Hide videos with content warnings">
              <UToggle v-model="filters.hideCW" :color="cfg.theme.primary" on-icon="i-heroicons-check-20-solid"
                off-icon="i-heroicons-x-mark-20-solid"
                :ui="{ inactive: `bg-${cfg.theme.greyscale}-200 dark:bg-${cfg.theme.greyscale}-700` }" />
            </UTooltip>
          </span>
          <span class="flex w-56 justify-between my-1">
            <p :class="`text-${cfg.theme.greyscale}-400 h-5 inline align-middle`">Hide Corrupted Content</p>
            <UTooltip text="Hide corrupted videos">
              <UToggle v-model="filters.hideCorrupt" :color="cfg.theme.primary" on-icon="i-heroicons-check-20-solid"
                off-icon="i-heroicons-x-mark-20-solid"
                :ui="{ inactive: `bg-${cfg.theme.greyscale}-200 dark:bg-${cfg.theme.greyscale}-700` }" />
            </UTooltip>
          </span>
        </div>
        <div class="flex-col mb-auto mt-0">
          <div class="flex max-w-fit mt-3 mx-auto mb-2 p-2 justify-evenly">
            <UTooltip text="Only show videos after this date">
              <UInput v-model="filters.startDate" :color="cfg.theme.primary" type="date" />
            </UTooltip>
            <div class="mx-5" />
            <UTooltip text="Only show videos before this date">
              <UInput v-model="filters.endDate" :color="cfg.theme.primary" type="date" />
            </UTooltip>
            <div class="mx-5" />
            <USelectMenu v-model="filters.order" :color="cfg.theme.primary" :options="orderOptions">
              <template #label>
                <template v-if="selected">
                  <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
                  <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" class="object-cover mx-2 my-2"
                    :alt="p.name" size="lg" />
                  {{ selected.label }}
                </template>
              </template>
            </USelectMenu>
            <div class="mx-5" />
            <USelectMenu v-model="filters.members" multiple :options="cst" placeholder="Select Cast Members" searchable
              class="w-72 min-w-fit" :color="cfg.theme.primary" :ui="{
                width: 'w-72'
              }" :ui-menu="{
  width: 'w-72'
}">
              <template #label>
                <template v-if="selected">
                  <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
                  <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" class="object-cover mx-2 my-2"
                    :alt="p.name" size="lg" />
                  {{ selected.label }}
                </template>
              </template>
            </USelectMenu>
            <UButton class="ml-10" label="Apply Filters" :loading="loading" icon="i-heroicons-magnifying-glass-20-solid"
              variant="soft" :color="cfg.theme.primary" @click="filter" />
          </div>
          <div v-if="episodeCount" class="flex mt-3 mx-auto mb-1 p-0">
            <CoreUICustomBadge class="ml-2 mr-5"
              :label="`Showing episodes ${fd.length.toLocaleString()} / ${episodeCount.toLocaleString()}`" />
            <!-- <CoreUICustomBadge class="mx-5" :label="`Total Air Time: ${ toTimestamp(data.seconds) }`" /> -->
            <!-- <CoreUICustomBadge class="mx-5" :label="`Guest Count: ${ data.cast.toLocaleString() }`" /> -->
            <!-- <CoreUICustomBadge class="mx-5" :label="`Topic Count: ${ data.topics.toLocaleString() }`" /> -->
            <!-- <CoreUICustomBadge class="mx-5" :label="`First Show: ${ getRelativeTime(new Date('2012-08-28')) }`" /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap justify-center">
      <template v-for="(video, index) in fd" :key="index">
        <VideoContainer :data="video" />
      </template>
    </div>
    <div class="flex align-middle mx-auto w-fit my-5">
      <InfiniteLoading v-if="fd.length > 19 && allowInfinite" @infinite="infinite" />
      <UButton v-else-if="fd.length > 19 && !allowInfinite" :loading="loading" :color="cfg.theme.primary"
        label="Load More" @click="infinite" />
    </div>
  </div>
</template>
