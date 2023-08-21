<script setup>
import style from "./VideoFeed.module.css";
import InfiniteLoading from 'v3-infinite-loading';

let sb = useSupabaseClient();
let fd = ref([])
let fdm = ref(new Map())


let { data } = useAsyncData(async () => {

    let cast = await (await fetch('/api/v1/cast', {
        method: 'POST'
    })).json();

    console.log(cast);

    return cast.data;
}, { watch: [fd] })
let filters = ref({
    order: 'release-desc',
    startDate: new Date('2012-10-19T00:00:00.000Z'),
    endDate: new Date(),
    members: []
})

let offset = 0;

async function filter() {
    offset = 0;
    fd.value = [];
    fdm.value = new Map();
    filters.value.order = document.getElementById('orderBy').value;
    let start = document.getElementById('searchStart').valueAsDate;
    let end = document.getElementById('searchEnd').valueAsDate;

    if (start) filters.value.startDate = start;
    if (end) filters.value.endDate = end;

    let cast = [];
    let cf = document.getElementById('castFilter');

    for (let i = 0; i < cf.children.length; i++) {
        let node = cf.children[i].children[0];
        if (node.checked) cast.push(node.id);
    }

    filters.value.members = cast;

    infinite();
}



async function infinite() {
    try {

        let feed = await (await fetch('/api/v1/episodes', {
            method: 'POST',
            body: JSON.stringify({
                filters: filters.value,
                offset,
                limit: 20
            })
        })).json();

        feed.data.filter(({ id }) => !fdm.value.has(id));
        fd.value = fd.value.concat(feed.data);
        offset += 20;
    } catch (e) {
        console.error(e);
    }
}

infinite();
</script>

<template>
    <template v-if="fd.size < 20">
        <div :class="style.container">
            <div :class="style.filterbox">
            </div>
            <div :class="style.videobox">
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
        </div>
    </template>
    <template v-else>
        <div :class="style.container">
            <div id="filterbox" :class="style.filterbox">
                <div :class="style.input">
                    <button type="submit" @click="filter()">Load Results</button>
                </div>
                <div :class="style.input">
                    <label for="orderBy">Order By:</label>
                    <select id="orderBy" name="orderBy">
                        <option value="release">Stream Date (Ascending)</option>
                        <option value="release-desc" selected>Stream Date (Descending)
                        </option>
                        <option value="duration">Duration (Ascending)</option>
                        <option value="duration-desc">Duration (Descending)</option>
                        <option value="title">Title (Ascending)</option>
                        <option value="title-desc">Title (Descending)</option>
                        <option value="topics">Topic Count (Ascending)</option>
                        <option value="topics-desc">Topic Count (Descending)
                        </option>
                    </select>
                </div>
                <div :class="style.inputDuplicate">
                    <div :class="style.input">
                        <label for="searchStart">Start Cutoff:</label>
                        <input type="date" id="searchStart" name="searchStart" :valueAsDate="filters.startDate">
                    </div>
                    <div :class="style.input">
                        <label for="searchEnd">End Cutoff:</label>
                        <input type="date" id="searchEnd" name="searchEnd" :valueAsDate="filters.endDate">
                    </div>
                </div>
                <div :class="style.input">
                    <p>Show only episodes featuring:</p>
                    <ul id="castFilter">
                        <template v-for="member in data">
                            <li :class="style.inlineCheck">
                                <input type="checkbox" :checked="filters.members.includes(member.id)" :id="member.id" />
                                <p>{{ member.name }} ({{ member.outlet }})</p>
                            </li>
                        </template>
                    </ul>
                </div>
                <!-- </input> -->
            </div>
            <div :class="style.videobox">
                <template v-for="video in fd">
                    <Video :id="video.id" />
                </template>
                <InfiniteLoading v-if="fd.length > 19" @infinite="infinite" />
            </div>
        </div>
    </template>
</template>