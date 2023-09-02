<script async setup>
import style from './Video.module.css'
const csm = useState('csm')

const props = defineProps({
  id: {
    type: String,
    default: () => ''
  },
  ghost: Boolean
})

const popoverOpen = ref(false)

const config = useRuntimeConfig()

const history = useState('history')

let data

if (props) {
  if (!props.ghost) {
    try {
      data = await (await fetch(config.public.api_base + '/videos/minimal/' + props.id)).json()
      if (history.value) {
        data.watchProgress = history.value.get(props.id)
      }
      data.cast.sort()
      data.cast = data.cast.map((id) => {
        return csm.value.get(id)
      })
    } catch (e) {
      console.error(e)
    }
  }
}

</script>

~<template>
  <template v-if="data">
    <USlideover v-model="popoverOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1>Cast Viewer</h1>
          <h2>Episode: {{ data.title }}</h2>
        </template>
        <!-- Content -->
        <template #footer>
          <!-- Content -->
        </template>
      </UCard>
    </USlideover>
    <NuxtLink class="w-fit overflow-hidden min-h-16 m-1" :href="`/videos/${data.id}`">
      <UCard>
        <template #header>
          <img class="w-max mx-auto rounded-md my-0" style="width: 300px; height: auto; object-fit: cover;" :src="data.thumbnail">
        </template>
        <h1 class="text-xl">
          {{ data.title }}
        </h1>
        <template #footer>
          <div class="flex justify-between">
            <UTooltip text="The date this episode first streamed">
              <UBadge variant="subtle" :label="new Date(data.aired).toLocaleDateString()" />
            </UTooltip>

            <UButton label="Open" @click.prevent="popoverOpen = true">
              <UAvatarGroup class="mr-auto ml-0" size="md" :max="3">
                <template v-for="(cast, index) in data.cast" :key="index">
                  <UAvatar class="object-cover" :src="cast.mug" :alt="cast.label" />
                </template>
              </UAvatarGroup>
            </UButton>
          </div>
        </template>
      </UCard>
      <!-- <div class="style.videoThumbnail">
        <img :src="data.thumbnail">
        <div :class="style.videoTopBar">
          <div :class="style.videoDuration">
            <Icon name="material-symbols:timer" /> {{ data.duration_text }}
          </div>
          <div v-if="data.watchProgress" :class="style.videoDurationWatched">
            <Icon name="carbon:view-filled" /> {{ toTimestamp(data.watchProgress.viewed_seconds) }}
          </div>
        </div>
        <div v-if="data.watchProgress" :class="style.videoDurationBarContainer">
          <div
            v-if="data.watchProgress"
            :style="{
              width: ((data.watchProgress.viewed_seconds / data.duration) * 350) + 'px'
            }"
            :class="style.videoDurationBar"
          />
        </div>
      </div>
      <h3 :class="style.videoTitle">
        <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" /> {{
          data.title }}
        <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
      </h3>
      <div :class="style.videoAirDate">
        <Icon name="mdi:calendar" /> {{ new Date(data.aired).toLocaleDateString() }}
      </div>

      <span :class="style.videoStats">
        <span :class="style.tooltip">
          <Icon name="material-symbols:topic" color="white" /> {{ data.topic_count.toLocaleString() }}
          <span :class="style.tooltiptext">This VOD has {{ data.topic_count.toLocaleString() }}
            topics
            <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
          </span>
        </span>
        <span :class="style.tooltip">
          <Icon name="material-symbols:person" color="white" /> {{ data.cast.length.toLocaleString() }}
          <span :class="style.tooltiptext">This VOD has {{ data.cast.length.toLocaleString() }} cast
            involved
            <Icon v-if="data.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color="#1DA1F2" />
          </span>
        </span>
      </span> -->
    </NuxtLink>
  </template>
</template>
