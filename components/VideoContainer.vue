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
    <USlideover
      v-model="popoverOpen"
      :ui="{
        background: 'bg-slate-900',
        overlay: {
          background: 'bg-gray-800/75'
        }
      }"
    >
      <UCard class="flex flex-col flex-1 bg-slate-900 text-white" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-extrabold">
            Cast Viewer
          </h1>
        </template>
        <template v-if="pending">
          Please wait, loading cast members
        </template>
        <template v-else>
          <div>
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
                    <a
                      v-if="p.ltt_forum"
                      :href="'https://linustechtips.com/profile/' + p.ltt_forum"
                      target="_blank"
                    >
                      <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo.svg">
                    </a>
                    <a v-else>
                      <img class="w-5 inline mx-1" src="/2018_Linus_Tech_Tips_logo_grey.svg">
                    </a>

                    <a v-if="p.imdb" :href="'https://www.imdb.com/name/' + p.imdb" target="_blank">
                      <Icon class="w-7 h-7 mx-1" name="bxl:imdb" color="#f3ce13" />
                    </a>
                    <a v-else>
                      <Icon class="w-7 h-7 mx-1 fill-slate-400" name="bxl:imdb" />
                    </a>

                    <a
                      v-if="p.wikipedia"
                      :href="'https://en.wikipedia.org/wiki/' + p.wikipedia"
                      target="_blank"
                    >
                      <Icon class="w-7 h-7 mx-1" name="mdi:wikipedia" />
                    </a>
                    <a v-else>
                      <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:wikipedia" />
                    </a>

                    <a
                      v-if="p.instagram"
                      :href="'https://www.instagram.com/' + p.instagram"
                      target="_blank"
                    >
                      <Icon class="w-7 h-7 mx-1" name="mdi:instagram" color="#C13584" />
                    </a>
                    <a v-else>
                      <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:instagram" />
                    </a>

                    <a v-if="p.twitter" :href="'https://twitter.com/' + p.twitter" target="_blank">
                      <Icon class="w-7 h-7 mx-1" name="logos:twitter" />
                    </a>
                    <a v-else>
                      <Icon class="w-7 h-7 mx-1 fill-slate-400" name="mdi:twitter" />
                    </a>

                    <a
                      v-if="p.linkedin"
                      :href="'https://www.linkedin.com/in/' + p.linkedin"
                      target="_blank"
                    >
                      <Icon class="w-7 h-7 mx-1" name="devicon:linkedin" />
                    </a>
                    <a v-else>
                      <Icon class="w-7 h-7 mx-1" name="devicon-plain:linkedin" />
                    </a>
                  </div>
                  <!-- <pre><code class="block whitespace-pre overflow-x-scroll">{{ p }}</code></pre> -->
                </div>
              </div>
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
