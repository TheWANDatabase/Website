<script setup>
import style from "./VideoFeed.module.css";

let sb = useSupabaseClient();
let fd = useState('videofeed', () => new Map());


useAsyncData(async () => {
    
    let feed = (await sb.from('episodes').select('*').not('aired', 'is', 'null').order('aired', { ascending: false }).limit(20)).data;
    for (let i = 0; i < feed.length; i++) {
        fd.value.set(fd.value.size, feed[i])
    }
    return true
})

</script>

<template>
    <template v-if="fd.size === 0">
        <div :class="style.container">
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
            <Video :ghost="true" />
        </div>
    </template>
    <template v-else>
        <div :class="style.container">
            <template v-for="video in fd.values()">
                <Video :id="video.id" />
            </template>
        </div>
    </template>
</template>