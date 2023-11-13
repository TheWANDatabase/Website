<script async setup>
const cfg = useState('uconf')
const issueURI = ref('https://github.com/TheWANDatabase/Website/issues/new')
const props = defineProps(['data'])
const globalCSM = useState('globalCSM')
const popoverOpen = ref(false)

const data = ref(null)

function processRawData() {
  const raw = props.data
  console.log(raw);
  // raw.cast = raw.cast.map(m => globalCSM.value[m])
  data.value = raw
}

useAsyncData(() => {
  processRawData()
}, {
  watch: [globalCSM]
})

</script>

<template>
  <template v-if="data">
    <!--    <USlideover v-model="popoverOpen" :ui="{-->
    <!--      base: 'relative m-2 flex-1 flex flex-col w-full focus:outline-none',-->
    <!--      background: 'bg-transparent',-->
    <!--    }">-->
    <!--      <UCard class="h-screen flex flex-col flex-1 bg-zinc-900 text-white"-->
    <!--        :ui="{ body: { base: 'flex-1 bg-zinc-900' }, header: { base: 'bg-zinc-800' }, footer: { base: 'bg-zinc-800' }, ring: '', divide: 'divide-y divide-slate-800' }">-->
    <!--        <template #header>-->
    <!--          <h1 class="text-2xl font-extrabold">-->
    <!--            Cast Viewer-->
    <!--          </h1>-->
    <!--        </template>-->
    <!--        <div class="flex-col">-->
    <!--          <template v-if="data.cast.length > 0">-->
    <!--            <template v-for="(p, i) in data.cast" :key="i">-->
    <!--              <CastMember :person="p" />-->
    <!--            </template>-->
    <!--            <p class="mt-auto mb-0">-->
    <!--              Spotted a problem? <a class="py-2 px-4" :href="issueURI" target="_blank">Report an Issue</a>-->
    <!--            </p>-->
    <!--          </template>-->
    <!--          <template v-else>-->
    <!--            <h2 class="text-xl font-bold">-->
    <!--              This is embarrasing!-->
    <!--            </h2>-->
    <!--            <h3>We don't seem to have any cast data for this episode.</h3>-->
    <!--            <a class="py-2 px-4" :href="issueURI" target="_blank">Report an Issue</a>-->
    <!--          </template>-->
    <!--        </div>-->
    <!--        <template #footer>-->
    <!--          <div class="flex justify-between">-->
    <!--            <h2>-->
    <!--              Episode: <NuxtLink :href="`/episode/${data.id}`">-->
    <!--                {{ data.title }}-->
    <!--              </NuxtLink>-->
    <!--            </h2>-->

    <!--            <CoreUICustomBadge :label="new Date(data.aired).toLocaleDateString()" />-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </UCard>-->
    <!--    </USlideover>-->
    <NuxtLink
        :class="
      `shadow-sm shadow-black w-fit overflow-hidden min-h-16 m-1 font-semibold rounded-lg pt-2 shadow-md
       bg-${cfg.theme.greyscale}-300 shadow-${cfg.theme.greyscale}-400 text-${cfg.theme.greyscale}-800
       hover:bg-${cfg.theme.primary}-100 hover:shadow-${cfg.theme.greyscale}-600 hover:text-${cfg.theme.greyscale}-900 `"
        :href="`/episode/${data.id}`">
      <div class="w-80 m-2 h-80">
        <CoreUIImage v-if="data.thumbnail" :id="data.thumbnail" :height="180" :width="320"/>
        <h1 class="text-xl mx-2 h-24 mt-1 mb-0 overflow-hidden" style="height: 90px">
          {{ data.title }}
        </h1>
        <div class="flex justify-between mx-2">
          <UTooltip class="px-2 py-1" text="The date this episode first streamed">
            <CoreUICustomBadge class="my-auto mr-0 -ml-3" :label="new Date(data.aired).toLocaleDateString()" />
          </UTooltip>

          <!--          <UTooltip v-if="data.cast.length > 0" text="Click to open the preview panel">-->
          <!--            <UButton :color="cfg.theme.primary" label="Open" variant="ghost" @click.prevent="popoverOpen = true">-->
          <!--              <UAvatarGroup class="mr-auto ml-0" size="md" :max="data.cast.length > 3 ? 2 : 3">-->
          <!--                <template v-for="(c, i) in data.cast" :key="i">-->
          <!--                  <UAvatar class="object-cover" size="md"-->
          <!--                    :src="c.avatar ? `https://cdn.thewandb.com/mugs/${c.avatar}` : undefined"-->
          <!--                    :alt="c.forname + ' ' + c.surname" />-->
          <!--                </template>-->
          <!--              </UAvatarGroup>-->
          <!--            </UButton>-->
          <!--          </UTooltip>-->
          <!--          <UTooltip v-else class="px-2 py-1" text="Click to open the preview panel">-->
          <!--            <CoreUICustomBadge label="Cast Unknown" @click.prevent="popoverOpen = true" />-->
          <!--          </UTooltip>-->
        </div>
      </div>
    </NuxtLink>
  </template>
</template>
