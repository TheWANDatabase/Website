<script async setup>
import style from './Footer.module.css'

const sb = useSupabaseClient()
const { data, error } = await useAsyncData(async () => {
  const e = (await sb.from('episodes').select('*', { count: 'exact', head: true })).count
  const c = (await sb.from('cast').select('*', { count: 'exact', head: true })).count
  const t = (await sb.from('topics').select('*', { count: 'exact', head: true })).count
  const co = (await sb.from('contributors').select('*', { count: 'exact', head: true })).count

  return {
    episodes: e,
    cast: c,
    topics: t,
    contributors: co
  }
})
</script>
<template>
  <div :class="style.footer">
    <p v-if="data">
      This database contains {{ data.topics.toLocaleString() }} topics, covered over
      {{ data.episodes.toLocaleString() }} episodes of The WAN Show featuring
      {{ data.cast.toLocaleString() }} people.

      It was compiled thanks to the tireless work of {{ data.contributors.toLocaleString() }} people.
      Thank you to the following legends who helped make this possible (knowingly or not)
      <ul>
        <li>Noki1119 - "The Timestamp Guy" - For creating timestamp comments across over 100 episodes of the show, in real time</li>
        <li>kuyans3889 - Provided helpful timestamps for early WAN Show VODs, including some before it was called The WAN Show</li>
      </ul>
    </p>
    <p v-else-if="error">
      {{ error }}
    </p>
    <p v-else>
      Loading facts
    </p>
    <span class="style.copyright">
      The WAN DB is not affiliated with Linus Media Group or any of its employees, partners, or otherwise.
      It is solely owned and operated as a community project meant to help provide a handy index of everything discussed.
      The copyright of the content featured on this website belongs solely to its original creators.
    </span>
  </div>
</template>
