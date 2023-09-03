<script async setup>
import style from './Video.module.css'

const sb = useSupabaseClient()

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
        overlay: {
          background: 'bg-gray-800/75'
        }
      }"
    >
      <UCard class="flex flex-col flex-1 bg-slate-900 text-white" :ui="{ body: { base: 'flex-1 bg-slate-900' }, header: { base: 'bg-slate-800'}, footer: { base: 'bg-slate-800'}, ring: '', divide: 'divide-y divide-slate-800' }">
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

            <UBadge variant="subtle" :label="new Date(data.aired).toLocaleDateString()" />
          </div>
        </template>
      </UCard>
    </USlideover>
    <NuxtLink class="w-fit overflow-hidden min-h-16 m-1 bg-slate-700 rounded-lg pt-2 hover:bg-slate-500 transition-all text-white" :href="`/videos/${data.id}`">
      <div class="w-80 m-2 h-72">
        <img class="w-max mx-auto rounded-md my-0" style="width: 300px; height: auto; object-fit: cover;" :src="data.thumbnail">
        <h1 class="text-xl mx-2 h-16 my-0">
          {{ data.title }}
        </h1>
        <div class="flex justify-between mx-2">
          <UTooltip class="px-2 py-1" text="The date this episode first streamed">
            <UBadge class="px-2 py-1" variant="subtle" :label="new Date(data.aired).toLocaleDateString()" />
          </UTooltip>

          <UTooltip v-if="data.cast.length > 0" text="Click to open the preview panel">
            <UButton label="Open" variant="ghost" @click.prevent="popoverOpen = true">
              <UAvatarGroup class="mr-auto ml-0" size="md" :max="data.cast.length > 3 ? 2 : 3">
                <template v-for="(c, i) in data.cast" :key="i">
                  <UAvatar class="object-cover" :src="c.mug" :alt="c.label" />
                </template>
              </UAvatarGroup>
            </UButton>
          </UTooltip>
          <UTooltip v-else class="px-2 py-1" text="Click to open the preview panel">
            <UButton variant="soft" label="Cast Unknown" @click.prevent="popoverOpen = true" />
          </UTooltip>
        </div>
      </div>
    </NuxtLink>
  </template>
</template>
