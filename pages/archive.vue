<script lang="ts" setup>
let selectedEpisode = ref(null);
let sideCard = ref();

let {data, pending} = useAsyncData(async () => {
  let episodes = await fetch('https://edge.thewandb.com/v2/episodes', {
    headers: {
      'Cache-Control': 'max-age=3600',
      'Accept': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      "filters": {
        "order": {"id": "release-desc", "label": "Stream Date (Descending)"},
        "hideCW": false,
        "hideCorrupt": false,
        "startDate": "2012-08-27T23:00:00.000Z",
        "endDate": "2023-11-25T00:00:00.000Z",
        "members": []
      }, "offset": 0, "limit": 1, "flags": {"include": ["cast_ids", "topic_count"]}
    })
  })

  return await episodes.json();
})


const selectEpisode = (episode: any) => {
  selectedEpisode.value = episode;
  let state = sideCard.value.attributes.getNamedItem('opened');

  if (state.value === 'false') {
    state.value = 'true';
    sideCard.value.style.opacity = '1';
    sideCard.value.style.visibility = 'visible';
    sideCard.value.style.marginRight = '5px';
    sideCard.value.style.width = '800px';
    sideCard.value.style.pointerEvents = 'all';
  } else {
    state.value = 'false';
    sideCard.value.style.opacity = '0';
    sideCard.value.style.visibility = 'hidden';
    sideCard.value.style.marginRight = '0';
    sideCard.value.style.width = '0';
    sideCard.value.style.pointerEvents = 'none'
  }
  sideCard.value.attributes.setNamedItem(state);


}

</script>
<template>
  <div class="container">
    <div ref="sideCard" class="side_card" opened="false">
      <template v-if="selectedEpisode !== null">
        <p style="font-size: 24px; font-weight: bold;">{{ selectedEpisode.title }}</p>
        <p style="font-size: 18px; font-weight: bold;">Aired
          {{ new Date(selectedEpisode.aired).toLocaleDateString() }}</p>
        <p style="font-size: 18px; text-align: justify"
           v-html="selectedEpisode.description.split('\n').join('<br />')"></p>

      </template>
      <template v-else>

      </template>
    </div>
    <div class="list">
      <template v-for="(episode, i) in data" :key="i">
        <div class="episode__container" @click="() => selectEpisode(episode)">
          {{ episode }}
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.container {
  position: relative;
}

.side_card {
  color: white;
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  min-height: 90vh;
  border-radius: 20px 5px 5px 20px;
  margin-top: 5px;
  background: #1a1a1a;
  padding: 5px 10px 5px 15px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}


</style>