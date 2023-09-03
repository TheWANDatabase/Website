<script async setup>
import style from './Video.module.css'

const sb = useSupabaseClient()

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
      data = await (await fetcher(config.public.api_base + '/videos/minimal/' + props.id)).json()
      if (history.value) {
        data.watchProgress = history.value.get(props.id)
      }
      data.cast.sort()
      data.c1 = data.cast
      data.cast = data.cast.map((id) => {
        return csm.value.get(id)
      })
    } catch (e) {
      console.error(e)
    }
  }
}

const cast = ref([])

const { pending } = useAsyncData(async () => {
  if (!popoverOpen.value) { return }
  try {
    if (cast.value.length === 0) {
      const x = (await sb.from('cast').select('*').in('id', data.c1).order('id')).data
      cast.value = x
    }
  } catch (e) {
    console.error(e)
  }
}, {
  watch: [popoverOpen]
})

</script>

<template>
  <template v-if="data">
    <USlideover v-model="popoverOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1>Cast Viewer</h1>
          <h2>Episode: {{ data.title }}</h2>
        </template>
        <template v-if="pending">
          Please wait, loading cast members
        </template>
        <template v-else>
          <div>
            <template v-for="(p,i) in cast" :key="i">
              <div class="flex-col w-32 mx-auto my-2">
                <div class="flex mx-auto my-2 align-middle">
                  <UAvatar class="object-cover" size="xl" :alt="p.name" :src="'https://cdn.thewandb.com/mugs/'+p.mug" />
                </div>
                <div class="flex-col w-52">
                  <h1>{{ p.name }}</h1>
                  <h2>{{ p.role }}</h2>
                  <a v-if="p.outlet_uri" :href="p.outlet_uri">{{ p.outlet }}</a>
                  <a v-else>{{ p.outlet }}</a>
                  <pre><code class="block whitespace-pre overflow-x-scroll">{{ p }}</code></pre>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template #footer>
          <!-- Content -->
        </template>
      </UCard>
    </USlideover>
    <NuxtLink class="w-fit overflow-hidden min-h-16 m-1" :href="`/videos/${data.id}`">
      <div class="w-80 m-2 h-72">
        <img class="w-max mx-auto rounded-md my-0" style="width: 300px; height: auto; object-fit: cover;" :src="data.thumbnail">
        <h1 class="text-xl mx-2 h-16 my-0">
          {{ data.title }}
        </h1>
        <div class="flex justify-between mx-2">
          <UTooltip text="The date this episode first streamed">
            <UBadge variant="subtle" :label="new Date(data.aired).toLocaleDateString()" />
          </UTooltip>

          <UTooltip text="Click to open the preview panel">
            <UButton label="Open" @click.prevent="popoverOpen = true">
              <UAvatarGroup class="mr-auto ml-0" size="md" :max="2">
                <template v-for="(c, i) in data.cast" :key="i">
                  <UAvatar class="object-cover" :src="c.mug" :alt="c.label" />
                </template>
              </UAvatarGroup>
            </UButton>
          </UTooltip>
        </div>
      </div>
    </NuxtLink>
  </template>
</template>
