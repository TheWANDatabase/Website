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
                <div class="flex w-82 mx-auto mt-2 mb-5 bg-slate-800 rounded-lg p-2">
                  <div class="flex ml-2 mr-4 my-auto align-middle">
                    <UAvatar class="object-cover" size="3xl" :alt="p.name" :src="'https://cdn.thewandb.com/mugs/'+p.mug" />
                  </div>
                  <div class="flex-col w-52">
                    <h1 class="text-xl font-bold -mb-1">
                      {{ p.name }}
                    </h1>
                    <h2 class="font-bold">
                      {{ p.role }}
                    </h2>
                    <a v-if="p.outlet_uri" class="text-lg my-5 h-5" :href="p.outlet_uri">{{ p.outlet }}</a>
                    <a v-else class="text-lg my-5 h-5">{{ p.outlet }}</a>
                    <div>
                      <UTooltip v-if="p.ltt_forum" text="Click to open the LinusTechTips Forum">
                        <a

                          :href="'https://linustechtips.com/profile/' + p.ltt_forum"
                          target="_blank"
                        >
                          <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo.svg">
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known LinusTechTips Forum account">
                        <a>
                          <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo_grey.svg">
                        </a>
                      </UTooltip>

                      <UTooltip v-if="p.linkedin" text="Click to open on LinkedIn">
                        <a
                          :href="'https://www.linkedin.com/in/' + p.linkedin"
                          target="_blank"
                        >
                          <Icon class="w-7 h-7 mx-1" name="devicon:linkedin" />
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known IMDB profile">
                        <a><Icon class="w-7 h-7 mx-1" name="devicon-plain:linkedin" /></a>
                      </UTooltip>

                      <UTooltip v-if="p.wikipedia" text="Click to open on Wikipedia">
                        <a
                          :href="'https://en.wikipedia.org/wiki/' + p.wikipedia"
                          target="_blank"
                        >
                          <Icon class="w-7 h-7 mx-1" name="mdi:wikipedia" />
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known Wikipedia page">
                        <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:wikipedia" /></a>
                      </UTooltip>

                      <UTooltip v-if="p.instagram" text="Click to open on profile on Instagram">
                        <a
                          :href="'https://www.instagram.com/' + p.instagram"
                          target="_blank"
                        >
                          <Icon class="w-7 h-7 mx-1" name="mdi:instagram" color="#C13584" />
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known Instagram profile">
                        <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:instagram" /></a>
                      </UTooltip>

                      <UTooltip v-if="p.twitter" text="Click to open on on Twitter">
                        <a :href="'https://twitter.com/' + p.twitter" target="_blank">
                          <Icon class="w-7 h-7 mx-1" name="logos:twitter" />
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known Twitter profile">
                        <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:twitter" /></a>
                      </UTooltip>

                      <UTooltip v-if="p.imdb" text="Click to open on the IMDB website">
                        <a :href="'https://www.imdb.com/name/' + p.imdb" target="_blank">
                          <Icon class="w-7 h-7 mx-1" name="bxl:imdb" color="#f3ce13" />
                        </a>
                      </UTooltip>
                      <UTooltip v-else text="This person does not have a known IMDB profile">
                        <a><Icon class="w-7 h-7 mx-1 fill-slate-400" name="bxl:imdb" /></a>
                      </UTooltip>
                    </div>
                  </div>
                </div>
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
          <UTooltip text="The date this episode first streamed">
            <UBadge variant="subtle" :label="new Date(data.aired).toLocaleDateString()" />
          </UTooltip>

          <UTooltip v-if="data.cast.length > 0" text="Click to open the preview panel">
            <UButton label="Open" variant="ghost" @click.prevent="popoverOpen = true">
              <UAvatarGroup class="mr-auto ml-0" size="md" :max="2">
                <template v-for="(c, i) in data.cast" :key="i">
                  <UAvatar class="object-cover" :src="c.mug" :alt="c.label" />
                </template>
              </UAvatarGroup>
            </UButton>
          </UTooltip>
          <UTooltip v-else text="Click to open the preview panel">
            <UButton variant="soft" label="Cast Unknown" @click.prevent="popoverOpen = true" />
          </UTooltip>
        </div>
      </div>
    </NuxtLink>
  </template>
</template>
