<script async setup>
import style from "./Video.module.css";
let props = defineProps([
    'id', 'ghost'
])


let data;

if (props) {
    if (!props.ghost) {
        data = await (await fetch('/api/v1/videos/' + props.id)).json();
        console.log(data.watchProgress)
    }
}

</script>

<template>
    <template v-if="!props">
        <div :class="style.ghostVideo">
            <img :class="style.ghostVideoThumbnail" />
            <h3 :class="style.ghostVideoTitle" />
            <span :class="style.ghostVideoAirDate" />
            <span :class="style.ghostVideoStats">
                <span :class="style.ghostVideoStat" />
                <span :class="style.ghostVideoStat" />
            </span>
        </div>
    </template>
    <template v-else-if="props.ghost">
        <div :class="style.ghostVideo">
            <img :class="style.ghostVideoThumbnail" />
            <h3 :class="style.ghostVideoTitle" />
            <span :class="style.ghostVideoAirDate" />
            <span :class="style.ghostVideoStats">
                <span :class="style.ghostVideoStat" />
                <span :class="style.ghostVideoStat" />
            </span>
        </div>
    </template>
    <template v-else-if="!data.episode">
        <div :class="style.ghostVideo">
            <img :class="style.ghostVideoThumbnail" />
            <h3 :class="style.ghostVideoTitle" />
            <span :class="style.ghostVideoAirDate" />
            <span :class="style.ghostVideoStats">
                <span :class="style.ghostVideoStat" />
                <span :class="style.ghostVideoStat" />
            </span>
        </div>
    </template>
    <template v-else>
        <NuxtLink :class="style.video" :href="`/videos/${data.episode.id}`">
            <div :class="style.videoThumbnail">
                <img :src="data.episode.thumbnail" />
                <div :class="style.videoTopBar">
                    <div :class="style.videoDuration">
                        <Icon name="material-symbols:timer" /> {{ data.episode.duration_text }}
                    </div>
                    <div v-if="data.watchProgress" :class="style.videoDurationWatched">
                        <Icon name="carbon:view-filled" /> {{ toTimestamp(data.watchProgress.viewed_seconds) }}
                    </div>
                </div>
                <div v-if="data.watchProgress" :class="style.videoDurationBarContainer">
                    <div v-if="data.watchProgress" :style="{
                        width: ((data.watchProgress.viewed_seconds / data.episode.duration) * 350) + 'px'
                    }" :class="style.videoDurationBar" />
                </div>
            </div>
            <h3 :class="style.videoTitle">
                <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color='#1DA1F2' /> {{
                    data.episode.title }}
                <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color='#1DA1F2' />
            </h3>
            <div :class="style.videoAirDate">
                <Icon name="mdi:calendar" /> {{ new Date(data.episode.aired).toLocaleDateString() }}
            </div>

            <span :class="style.videoStats">
                <span :class="style.tooltip">
                    <Icon name="material-symbols:topic" color="white" /> {{ data.topics.length.toLocaleString() }}
                    <span :class="style.tooltiptext">This VOD has {{ data.topics.length.toLocaleString() }}
                        topics
                        <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color='#1DA1F2' />
                    </span>
                </span>
                <span :class="style.tooltip">
                    <Icon name="material-symbols:person" color="white" /> {{ data.cast.length.toLocaleString() }}
                    <span :class="style.tooltiptext">This VOD has {{ data.cast.length.toLocaleString() }} cast
                        involved
                        <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill" color='#1DA1F2' />
                    </span>
                </span>
            </span>
        </NuxtLink>
    </template>
</template>