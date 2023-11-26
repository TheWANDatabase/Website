<script lang="ts" setup>


import {useInterval} from "~/composables/interval";
import {useAsyncData} from "#app";
import {getRelativeTimeString} from "~/utils/time";

let {data, pending, refresh, error} = useAsyncData(async () => {
  try {
    let nextWanReq = await fetch('https://whenplane.com/api/nextWan', {
      mode: 'no-cors',
      headers: {
        'Cache-Control': 'max-age=3600',
        'Accept': 'application/json'
      }
    });
    let wanStatusReq = await fetch('https://edge.thewandb.com/v2/live/floatplane', {
      headers: {
        'Cache-Control': 'max-age=3600',
        'Accept': 'application/json'
      }
    });
    let archiveStats = await fetch('https://edge.thewandb.com/v2/stats', {
      headers: {
        'Cache-Control': 'max-age=3600',
        'Accept': 'application/json'
      }
    });

    let latestWanReq = await fetch('https://edge.thewandb.com/v2/episodes', {
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


    let payload = {
      nextWan: await nextWanReq.text() || '2023-11-25T00:30:00.000Z',
      latestWan: (await latestWanReq.json())[0],
      wanStatus: await wanStatusReq.json(),
      stats: await archiveStats.json()
    };
    console.log(payload)
    return payload;
  } catch (e) {
    console.error(e)
  }
}, {
  server: true
});

let relativeNextWan = ref('Loading...');

function updateRelativeTime() {
  try {
    if (data.value) {
      let nextWan = new Date(data.value.nextWan);
      let relative = getRelativeTimeString(nextWan);
      relativeNextWan.value = relative.substring(0, 1).toUpperCase() + relative.substring(1);
    }
  } catch (e: any) {
    if (e.message === "date value is not finite in RelativeTimeFormat.format()") {
      relativeNextWan.value = 'Undetermined...';
      return;
    }
    console.warn('Cannot calculate relative time:', e)

  }
}

useInterval(updateRelativeTime, 500)
useInterval(refresh, 60_000 * 5)


</script>
<template>
  <div class="grid">
    <div class="grid__item"
         style="grid-column: 1 / span 20; grid-row: 1 / span 3; display: flex;flex-direction: column; align-content: center; justify-content: center; text-align: center">
      <h1 style="letter-spacing: -2px; font-size: 48px; text-decoration: underline; text-decoration-thickness: 5px">THE
        WAN DATABASE</h1>
      <p style="margin-top:-0.5rem;font-size: 22px">A public archive project for The WAN Show</p>
    </div>
    <div class="grid__item" style="grid-column: 1 / span 11; grid-row: 4 / span 9; display: flex;flex-direction: row">
      <div class="episode__container">
        <template v-if="pending === true && data !== null">
          <img :src="`https://cdn.thewandb.com/media/${data.latestWan.thumbnail}.webp`"
               alt="Latest WAN Show Thumbnail" style="width: 500px; height: auto; object-fit: cover; border-radius: 20px;">
          <p style="font-size: 22px; margin-top: 0.5rem;font-weight:bold">{{ data.latestWan.title }}</p>
          <p style="font-size: 18px; margin-top: 0.5rem;">Aired on
            {{ new Date(data.latestWan.aired).toLocaleDateString() }}</p>
        </template>
      </div>
      <div style="display: flex; flex-direction: column; margin: 0.5rem 1rem 0.5rem 0;">
        <h2 style="letter-spacing: 0px; font-size: 36px; text-decoration: underline; text-decoration-thickness: 5px">
          LATEST EPISODE</h2>
        <p style="max-width: 500px; word-wrap: normal; text-align: justify; margin-bottom: auto;">
          With weekly episodes, The WAN Show is one of the longest running podcasts
          in tech, with the first episode going live on {{ new Date('2012-08-28').toLocaleDateString() }}.

          Hosted weekly by Linus Sebastian and later joined by Luke Lafreniere, the show covers the latest
          tech news and trends, with a focus on PC hardware. The show is also known for the antics of Linus,
          who has been known to break things on camera, and for the occasional appearance of guests from the
          tech industry. For more information on the show, visit the official website of <a
            href="https://linusmediagroup.com" target="_blank">Linus Media Group</a>.
        </p>
      </div>
    </div>
    <div class="grid__item"
         style="grid-column: 12 / span 3; grid-row: 4 / span 3; display: flex;flex-direction: column; align-content: center; justify-content: center; text-align: center">
      <h3>Episodes To Date</h3>
      <p style="font-size: 56px;">
        {{ pending ? 'Loading...' : data ? data.stats.episodeCount.toLocaleString() : 'Loading...' }}</p>
    </div>
    <div class="grid__item"
         style="grid-column: 15 / span 3; grid-row: 4 / span 3; display: flex;flex-direction: column; align-content: center; justify-content: center; text-align: center">
      <h3>Guests To Date</h3>
      <p style="font-size: 56px;">
        {{ pending ? 'Loading...' : data ? data.stats.castCount.toLocaleString() : 'Loading...' }}</p>
    </div>
    <div class="grid__item"
         style="grid-column: 18 / span 3; grid-row: 4 / span 3; display: flex;flex-direction: column; align-content: center; justify-content: center; text-align: center">
      <h3>Topics Covered</h3>
      <p style="font-size: 56px;">
        {{ pending ? 'Loading...' : data ? data.stats.topicCount.toLocaleString() : 'Loading...' }}</p>
    </div>
    <div class="grid__item"
         style="grid-column: 12 / span 9; grid-row: 7 / span 6; display: flex;flex-direction: column; align-content: center; justify-content: center; text-align: center">
      <h3 style="margin-bottom: -0.5rem;">Next Episode</h3>
      <!--   Show relative time to next episode   -->
      <p v-if="pending === true || !data" style="font-size: 56px;">Loading...</p>
      <div v-else>
        <template v-if="data.wanStatus.live && data.wanStatus.wan">
          <p style="color:red; font-size:56px;font-weight: bold;">Live Now!</p>
          <p style="font-size: 22px;font-weight: bold">Title: {{ data.wanStatus.title }}</p>
          <a href="https://floatplane.com/channel/linustechtips/live" target="_blank">Watch on Floatplane!</a>
        </template>
        <template v-else-if="!data.wanStatus.live && data.wanStatus.imminence >= 2">
          <template v-if="data.wanStatus.imminence === 2">
            <p style="font-size: 24px;">Imminence: Soon</p>
            <p style="font-size: 24px;">Expected Start:{{ relativeNextWan }} </p>
          </template>
          <template v-if="data.wanStatus.imminence === 3">
            <p style="font-size: 24px;">Imminence: Any Minute Now</p>
            <p style="font-size: 24px;">Expected Start:{{ relativeNextWan }} </p>
          </template>
        </template>
        <template v-else-if="!data.wanStatus.live && !data.wanStatus.wan">
          <p style="font-size: 56px;">{{ relativeNextWan }}</p>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped>

.episode__container {
  width: 500px;
  height: 400px;
  margin: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>