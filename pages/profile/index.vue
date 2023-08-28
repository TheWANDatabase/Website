<script setup>
import * as d3 from 'd3'
import style from './profile.module.css'
const user = useSupabaseUser()
const profile = useState('uprofile')
const sb = useSupabaseClient()

const hasTriggered = ref(false)
const settingValues = {
  username: ref(profile.username || ''),
  name: ref(profile.name || '')
}

const { data } = useAsyncData(async () => {
  const videos = await sb.from('episodes').select('id', { count: 'exact', head: true })
  const stats = await sb.from('user_statistics').select('*')
  const history = await sb.from('episode_progression').select('viewed_seconds, last_watched, episode (*)').order('last_watched', { ascending: false })
  for (let i = 0; i < history.data.length; i++) {
    history.data[i].episode.thumbnailURI = sb.storage.from('thumbs').getPublicUrl(history.data[i].episode.id + '.jpeg').data.publicUrl
  }
  return {
    history,
    stats,
    videos
  }
})

function calcStarted (history) {
  return history.filter(f => f.viewed_seconds > 0).length
}

function calcFinished (history) {
  return history.filter(f => Math.floor(f.viewed_seconds) === f.episode.duration).length
}

function calcWatchTime (history) {
  return (history.map(f => f.viewed_seconds).reduce((partialSum, a) => partialSum + a, 0)) / history.length
}

function calcCompletion (history) {
  return parseFloat((history.map(f => (Math.floor(f.viewed_seconds) / f.episode.duration) * 100).reduce((partialSum, a) => partialSum + a, 0) / history.length).toFixed(2))
}

useAsyncData(async () => {
  if (hasTriggered.value) {
    const edits = {}
    if (settingValues.username.value) { edits.username = settingValues.username.value }
    if (settingValues.name.value) { edits.full_name = settingValues.name.value }

    const x = await sb.from('profiles').update(edits).eq('id', user.value.id).select()
    // Update the current value in the profile variable so that it actually modifies in real time
    profile.value = x.data[0]
  }
  if (!hasTriggered.value) { hasTriggered.value = true }
}, {
  watch: [
    settingValues.username,
    settingValues.name
  ]
})

onMounted(drawGraphs)

function drawGraphs () {
  useAsyncData(() => {
    window.setTimeout(() => {
      drawEpisodesStarted()
      drawEpisodesFinished()
      drawTotalWatchTime()
      drawavgWatchTime()
      drawavgCompletion()
    }, 500)
  }, {
    watch: [data, profile, user]
  })
}

function drawEpisodesStarted () {
  const arc = d3
    .arc()
    .innerRadius(50 * 0.8)
    .outerRadius(50)

  const pie = d3.pie()
    .padAngle(1 / 50)
    .sort(null)
    .value(d => d.value)

  const svg = d3.create('svg')
    .attr('width', 100)
    .attr('height', 100)
    .attr('viewBox', [-100 / 2, -100 / 2, 100, 100])
    .attr('style', 'max-width: 100%; height: auto;')

  const started = calcStarted(data.value.history.data)

  const dta = [
    {
      name: 'started',
      value: started
    },
    {
      name: 'total',
      value: data.value.videos.count - started
    }
  ]

  svg.append('g')
    .selectAll()
    .data(pie(dta))
    .join('path')
    .attr('fill', d => d.data.name === 'started' ? '#ffa500' : '#444')
    .attr('d', arc)
    .append('title')
    .text(d => `${d.name}: ${d.value.toLocaleString()}`)
  svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll()
    .data(pie(data))
    .join('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .call(text => text.append('tspan')
      .attr('y', '-0.4em')
      .attr('font-weight', 'bold')
      .text(d => d.data.name))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
      .attr('x', 0)
      .attr('y', '0.7em')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.value.toLocaleString('en-US')))

  document.getElementById('episodesStartedChartBox').innerHTML = ''
  document.getElementById('episodesStartedChartBox').appendChild(svg.node())
  document.getElementById('episodesStartedChartValue').innerHTML = `<span style="color:#ffa500;">${dta[0].value.toLocaleString()}</span> / <span style="color:#444;">${dta[1].value.toLocaleString()}</span>`
}

function drawEpisodesFinished () {
  const arc = d3
    .arc()
    .innerRadius(50 * 0.8)
    .outerRadius(50)

  const pie = d3.pie()
    .padAngle(1 / 50)
    .sort(null)
    .value(d => d.value)

  const svg = d3.create('svg')
    .attr('width', 100)
    .attr('height', 100)
    .attr('viewBox', [-100 / 2, -100 / 2, 100, 100])
    .attr('style', 'max-width: 100%; height: auto;')

  const fin = calcFinished(data.value.history.data)

  const dta = [
    {
      name: 'started',
      value: fin
    },
    {
      name: 'total',
      value: data.value.videos.count - fin
    }
  ]

  svg.append('g')
    .selectAll()
    .data(pie(dta))
    .join('path')
    .attr('fill', d => d.data.name === 'started' ? '#ffa500' : '#444')
    .attr('d', arc)
    .append('title')
    .text(d => `${d.name}: ${d.value.toLocaleString()}`)
  svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll()
    .data(pie(data))
    .join('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .call(text => text.append('tspan')
      .attr('y', '-0.4em')
      .attr('font-weight', 'bold')
      .text(d => d.data.name))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
      .attr('x', 0)
      .attr('y', '0.7em')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.value.toLocaleString('en-US')))

  document.getElementById('episodesFinishedChartBox').innerHTML = ''
  document.getElementById('episodesFinishedChartBox').appendChild(svg.node())
  document.getElementById('episodesFinishedChartValue').innerHTML = `<span style="color:#ffa500;">${dta[0].value.toLocaleString()}</span> / <span style="color:#444;">${dta[1].value.toLocaleString()}</span>`
}

function drawTotalWatchTime () {
  document.getElementById('totalWatchTimeChartBox').innerHTML = `<h1>${toTimestamp(data.value.stats.data[0].total_watch_time)}</h1>`
}

function drawavgWatchTime () {
  document.getElementById('avgWatchTimeChartBox').innerHTML = `<h1>${toTimestamp(calcWatchTime(data.value.history.data))}</h1>`
}

function drawavgCompletion () {
  const arc = d3
    .arc()
    .innerRadius(50 * 0.8)
    .outerRadius(50)

  const pie = d3.pie()
    .padAngle(1 / 50)
    .sort(null)
    .value(d => d.value)

  const svg = d3.create('svg')
    .attr('width', 100)
    .attr('height', 100)
    .attr('viewBox', [-100 / 2, -100 / 2, 100, 100])
    .attr('style', 'max-width: 100%; height: auto;')
  const comp = calcCompletion(data.value.history.data)
  const dta = [
    {
      name: 'started',
      value: comp
    },
    {
      name: 'total',
      value: 100 - comp
    }
  ]

  svg.append('g')
    .selectAll()
    .data(pie(dta))
    .join('path')
    .attr('fill', d => d.data.name === 'started' ? '#ffa500' : '#444')
    .attr('d', arc)
    .append('title')
    .text(d => `${d.name}: ${d.value.toLocaleString()}`)
  svg.append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll()
    .data(pie(data))
    .join('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .call(text => text.append('tspan')
      .attr('y', '-0.4em')
      .attr('font-weight', 'bold')
      .text(d => d.data.name))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
      .attr('x', 0)
      .attr('y', '0.7em')
      .attr('fill-opacity', 0.7)
      .text(d => d.data.value.toLocaleString('en-US')))

  document.getElementById('avgCompletionChartBox').innerHTML = ''
  document.getElementById('avgCompletionChartBox').appendChild(svg.node())
  document.getElementById('avgCompletionChartValue').innerHTML = `<span style="color:#ffa500;">${dta[0].value.toLocaleString()}%</span>`
  // document.getElementById('avgCompletionChartBox').innerHTML = `<h1>${calcCompletion(data.value.history.data)}%</h1>`;
}

function relocate (id) {
  window.location.href = `/videos/${id}`
}

useHead({
  title: 'Home | The WAN DB',
  link: [
    {
      hid: 'canonical',
      property: 'canonical',
      content: 'https://thewandb.com/'
    }
  ],
  meta: [
    {
      hid: 'theme-color',
      name: 'theme-color',
      content: '#bb2701'
    },
    {
      hid: 'robots',
      property: 'robots',
      content: 'index, archive'
    },
    {
      hid: 'og-title',
      property: 'og:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'twitter-title',
      property: 'twitter:title',
      content: 'Home | The WAN DB'
    },
    {
      hid: 'description',
      property: 'description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-description',
      property: 'og:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'twitter-description',
      property: 'twitter:description',
      content: 'The WAN DB is a near comprehensive archive of every episode of the popular technology news podcast, The WAN Show. Spanning back as far as 2012, with more than 500 episodes, and covering over 10,000 different topics, this database is as close to comprehensive as you can getm without being perfect.'
    },
    {
      hid: 'og-image',
      property: 'og:image',
      content: 'https://tnhnbqvtxzrrcfpsjsfq.supabase.co/storage/v1/object/public/mugs/6i7htvrnka731.png'
    },
    {
      hid: 'twitter-image',
      property: 'twitter:image',
      content: 'https://tnhnbqvtxzrrcfpsjsfq.supabase.co/storage/v1/object/public/mugs/6i7htvrnka731.png'
    },
    {
      hid: 'twitter-card',
      property: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      hid: 'og-type',
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>
<template>
  <div :class="style.container">
    <Sidenav />
    <div v-if="profile" :class="style.profile">
      <div :class="style.profileImg">
        <img :src="profile.avatar_url">
      </div>
      <div :class="style.profileSettings">
        <div :class="style.setting">
          <span :class="style.tooltip">
            <Icon :class="tootlip" name="medical-icon:i-information-us" />
            <span :class="style.tooltiptext">This name is what other users will see when you interact with them.
            </span>
          </span>
          <TextEditorSetting
            :current="profile.username"
            :editor="settingValues.username"
            placeholder="No Username Set"
            vname="Username"
            @saved="(e) => { console.log(e); settingValues.username.value = e; }"
          />
        </div>
        <div :class="style.setting">
          <span :class="style.tooltip">
            <Icon :class="tootlip" name="medical-icon:i-information-us" />
            <span :class="style.tooltiptext">This information is provided to us when you create your account, by
              the
              service you signed in with for the first time.
            </span>
          </span>
          <TextEditorSetting
            :current="profile.full_name"
            :editor="settingValues.name"
            placeholder="No Name Set"
            vname="Login Name"
            @saved="(e) => { settingValues.name.value = e }"
          />
        </div>
      </div>
      <div v-if="data.stats.data[0]" :class="style.profileStatistics">
        <h2>Watch Statistics</h2>

        <div :class="style.charts">
          <div :class="style.chart">
            <h4>Total Watch Time</h4>
            <div id="totalWatchTimeChartBox">
              <p>Loading Data...</p>
            </div>
            <div id="totalWatchTimeChartValue" :class="style.chartValue" />
          </div>
          <div :class="style.chart">
            <h4>Episodes Started</h4>
            <div id="episodesStartedChartBox">
              <p>Loading Data...</p>
            </div>
            <div id="episodesStartedChartValue" :class="style.chartValue" />
          </div>
          <div :class="style.chart">
            <h4>Episodes Finished</h4>
            <div id="episodesFinishedChartBox">
              <p>Loading Data...</p>
            </div>
            <div id="episodesFinishedChartValue" :class="style.chartValue" />
          </div>
          <div :class="style.chart">
            <h4>Average Watch Time</h4>
            <div id="avgWatchTimeChartBox">
              <p>Loading Data...</p>
            </div>
            <div id="avgWatchTimeChartValue" :class="style.chartValue" />
          </div>
          <div :class="style.chart">
            <h4>Average Completion</h4>
            <div id="avgCompletionChartBox">
              <p>Loading Data...</p>
            </div>
            <div id="avgCompletionChartValue" :class="style.chartValue" />
          </div>
        </div>
      </div>
    </div>
    <div :class="style.watchHistory">
      <h2>Watch History</h2>
      <p>
        This section will include all the episodes of The WAN Show you have watched through our viewer whilst logged
        in.
      </p>
      <i>No, we cannot see your YouTube watch history, we also do not show this data to anybody except you.</i>
      <template v-if="data.history.data">
        <template v-if="data.history.data.length > 0">
          <template v-for="(video, index) in data.history.data" :key="index">
            <div :class="style.watchHistoryVideo" @click="relocate(video.episode.id)">
              <img :src="video.episode.thumbnailURI">
              <div>
                <h3>{{ video.episode.title }}</h3>
                <span>
                  <strong>Duration</strong>: {{ toTimestamp(video.episode.duration) }} |
                  <strong>Watched</strong>: {{ toTimestamp(video.viewed_seconds) }}
                  ({{ ((video.viewed_seconds / video.episode.duration) * 100).toFixed(2) }}%)
                </span><br>
                <span>
                  <strong>Originally Aired</strong>: {{ new Date(video.episode.aired).toLocaleDateString() }}
                  |
                  <strong>Last Viewed</strong>: {{ new Date(video.last_watched).toLocaleString() }}
                </span>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <h3>Nothing to see here</h3>
          <p>You should see what happens when you try watching a VOD.</p>
        </template>
      </template>
      <h3 v-else>
        Nothing to see here
      </h3>
    </div>
  </div>
</template>
