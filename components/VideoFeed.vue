<script setup>
import style from "./VideoFeed.module.css";
import InfiniteLoading from 'v3-infinite-loading';

let sb = useSupabaseClient();
let fd = useState('videofeed', () => []);


let offset = 0;


async function infinite() {
    try {
        console.log('fetching videos');
        let feed = (await sb.from('episodes').select('*').not('aired', 'is', 'null').order('aired', { ascending: true }).range(offset, offset + 20)).data;
        for (let i = 0; i < feed.length; i++) {
            fd.value.push(feed[i])
        }
        offset += 20;
        console.log('fetching videos');
    } catch (e) {
        console.error(e);
    }
}

</script>

<template>
    <template v-if="fd.size < 20">
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
            <template v-for="video in fd">
                <Video :id="video.id" />
            </template>
            <InfiniteLoading @infinite="infinite" />
        </div>
    </template>
</template>