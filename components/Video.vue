<script async setup>
import style from "./Video.module.css";
let props = defineProps([
    'id', 'ghost'
])
let sb = useSupabaseClient();

let episode
let cast
let topics

if (props.id) {
    episode = (await sb.from('episodes').select('id, cast, aired, youtube, floatplane').eq('id', props.id).single()).data;
    cast = (await sb.from('cast').select('id').in('id', episode.cast)).data;
    topics = (await sb.from('topics').select('id').eq('episode', episode.id)).data;
    episode.thumbnail = (await sb.storage.from('thumbs').getPublicUrl(episode.id + '.jpeg')).data.publicUrl
}

</script>

<template>
    <template v-if="props.ghost">
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
        <template v-if="!topics">
            <div :class="style.ghostVideo"></div>
        </template>
        <template v-else>
            <NuxtLink :class="style.video" :href="`/videos/${episode.id}`">
                <img :class="style.videoThumbnail" :src="episode.thumbnail" />
                <h3 :class="style.videoTitle">{{ episode.title }}</h3>
                <span :class="style.videoAirDate">{{ new Date(episode.aired).toLocaleDateString() }}</span>
                <!-- <span :class="style.videoDuration">Duration: {{ episode.aired }}</span> -->

                <span :class="style.videoStats">
                    <span :class="style.tooltip">
                        <Icon name="material-symbols:topic" color="black" /> {{ topics.length.toLocaleString() }}
                        <span :class="style.tooltiptext">This VOD has {{ topics.length.toLocaleString() }}
                            topics</span>
                    </span>
                    <span :class="style.tooltip">
                        <Icon name="material-symbols:person" color="black" /> {{ cast.length.toLocaleString() }}
                        <span :class="style.tooltiptext">This VOD has {{ cast.length.toLocaleString() }} cast
                            involved</span>
                    </span>
                </span>
            </NuxtLink>
        </template>
    </template>
</template>