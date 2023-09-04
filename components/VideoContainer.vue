<script async setup>
import style from './Video.module.css'

const sb = useSupabaseClient()
const cfg = useState('uconf')
const csm = useState('csm')
const issueURI = ref('https://github.com/TheWANDatabase/Website/issues/new')
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
      issueURI.value = issueURI.value + `?title=${encodeURIComponent(`Issue with cast of episode (${data.id})`)}&body=${encodeURIComponent(`There appears to be an issue with the cast assigned to episode [${data.id}](https://thewandb.com/video/${data.id})`) + '%0A%0ACurrent Value:%0A' + encodeURIComponent('```json') + '%0A' + encodeURIComponent(`${JSON.stringify(cast.value, undefined, '  ')}`) + '%0A' + encodeURIComponent('```') + '%0A%0AI (Reporter) believe that this episode should feature the following person(s)%0A> [EDIT ME]'}`
      console.log(issueURI)
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
    <USlideover
      v-model="popoverOpen"
      :ui="{
        base: 'relative m-2 flex-1 flex flex-col w-full focus:outline-none',
        background: 'bg-transparent',
      }"
    >
      <UCard class="flex flex-col flex-1 bg-zinc-900 text-white" :ui="{ body: { base: 'flex-1 bg-zinc-900' }, header: { base: 'bg-zinc-800'}, footer: { base: 'bg-zinc-800'}, ring: '', divide: 'divide-y divide-slate-800' }">
        <template #header>
          <h1 class="text-2xl font-extrabold">
            Cast Viewer
          </h1>
        </template>
        <template v-if="pending">
          Please wait, loading cast members
        </template>
        <template v-else>
          <div class="h-max flex-col">
            <template v-if="cast.length > 0">
              <template v-for="(p,i) in cast" :key="i">
                <CastMember :person="p" />
              </template>
              <p class="mt-auto mb-0">
                Spotted a problem? <a class="py-2 px-4" :href="issueURI" target="_blank">Report an Issue</a>
              </p>
            </template>
            <template v-else>
              <h2 class="text-xl font-bold">
                This is embarrasing!
              </h2>
              <h3>We don't seem to have any cast data for this episode.</h3>
              <a class="py-2 px-4" :href="issueURI" target="_blank">Report an Issue</a>
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between">
            <h2>
              Episode: <NuxtLink :href="`/videos/${data.id}`">
                {{ data.title }}
              </NuxtLink>
            </h2>

            <CoreUICustomBadge :label="new Date(data.aired).toLocaleDateString()" />
          </div>
        </template>
      </UCard>
    </USlideover>
    <NuxtLink :class="`shadow-sm shadow-black w-fit overflow-hidden min-h-16 m-1 bg-${cfg.theme.greyscale}-800 text-${cfg.theme.primary}-400 rounded-lg pt-2 hover:bg-${cfg.theme.primary}-700 hover:text-${cfg.theme.primary}-100 transition-all font-semibold`" :href="`/videos/${data.id}`">
      <div class="w-80 m-2 h-80">
        <img class="w-max mx-auto rounded-md -mt-2 mb-1" style="object-fit: cover;" :src="data.thumbnail">
        <h1 class="text-xl mx-2 h-16 mt-1 mb-0">
          {{ data.title }}
        </h1>
        <div class="flex justify-between mx-2">
          <UTooltip class="px-2 py-1" text="The date this episode first streamed">
            <CoreUICustomBadge class="my-auto mr-0 -ml-3" :label="new Date(data.aired).toLocaleDateString()" />
          </UTooltip>

          <UTooltip v-if="data.cast.length > 0" text="Click to open the preview panel">
            <UButton :color="cfg.theme.primary" label="Open" variant="ghost" @click.prevent="popoverOpen = true">
              <UAvatarGroup class="mr-auto ml-0" size="md" :max="data.cast.length > 3 ? 2 : 3">
                <template v-for="(c, i) in data.cast" :key="i">
                  <UAvatar class="object-cover" :src="c.mug" :alt="c.label" />
                </template>
              </UAvatarGroup>
            </UButton>
          </UTooltip>
          <UTooltip v-else class="px-2 py-1" text="Click to open the preview panel">
            <CoreUICustomBadge label="Cast Unknown" @click.prevent="popoverOpen = true" />
          </UTooltip>
        </div>
      </div>
    </NuxtLink>
  </template>
</template>
