<script async setup>
import { v4 } from 'uuid';
import style from './videos.module.css';
import Youtube from 'vue3-youtube';

const player = ref(null);
const profile = useState('uprofile', () => undefined);
const showEditor = ref(false);
const playerStatus = ref(0);
definePageMeta({
    layout: "viewer"
});

useAsyncData(async () => {
    if (profile.value) {
        showEditor.value = ((profile.value.permissions && 1) == 1 || (profile.value.permissions && 2) == 1)
    }
}, {
    watch: [profile]
})

const sb = useSupabaseClient();

let { id } = useRoute().params;

function hash(str) {
    let h = 0,
        i, chr;
    if (str.length === 0) return h;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        h = ((h << 5) - h) + chr;
        h |= 0; // Convert to 32bit integer
    }
    return h;
}
let time = ref(0);
let vpw = ref(700);
let watch = ref();
let time_human = ref('00:00:00')
let time_percentage = ref('0.00')
let itv = {
    player: null,
    viewport: null
};

useAsyncData(async () => {
    try {
        if (Math.round(time.value) === Math.round(data.value.episode.duration)) {
            if (profile.value && watch.value) {
                console.log(await sb.from('episode_progression').update({
                    viewed_seconds: Math.floor(data.value.episode.duration)
                }).eq('id', watch.value.id));
            }
        } else if (Math.floor(time.value) % 5 !== 0 || playerStatus.value === 0) {
            return;
        } else {
            if (profile.value && watch.value) {
                console.log(await sb.from('episode_progression').update({
                    viewed_seconds: Math.floor(time.value)
                }).eq('id', watch.value.id));
            } else if (profile.value) {
                console.log('Selecting')
                let x = await sb.from('episode_progression').select('*')
                    .eq('viewer', profile.value.id)
                    .eq('episode', id).maybeSingle();
                if (x.data) {
                    watch.value = x.data;
                    player.value.seekTo(watch.value.viewed_seconds)
                } else {
                    let a = await sb.from('episode_progression').insert({
                        viewer: profile.value.id,
                        episode: id,
                        viewed_seconds: Math.floor(time.value)
                    }).select();
                    watch.value = a.data[0];
                }
            } else {
                console.log("User is logged in as a guest, playback analytics are disabled.");
            }
        }
    } catch (e) {
        console.error(e);
    }
}, {
    server: false,
    watch: [time, playerStatus]
})

function onPlayerReady() {
    playerStatus.value = 1
}

onMounted(() => {
    itv.player = setInterval(() => {
        if (playerStatus.value === 1) {
            try {
                time.value = player.value.getCurrentTime()
                time_human.value = toTimestamp(player.value.getCurrentTime());
                time_percentage.value = ((time.value / data.value.episode.duration) * 100).toFixed(2);
            } catch (e) {
                console.warn('Failed to fetch playback timestamp', e)
            }
        }
    }, 333)

    // itv.viewport = setInterval(() => {
    //     let e = document.getElementById('videoplayerviewportsector');
    //     vpw.value = e.offsetWidth;
    // }, 10)
})

onUnmounted(() => {
    if (itv.player) clearInterval(itv.player);
    if (itv.viewport) clearInterval(itv.viewport);
})


let { data, error } = useAsyncData(async () => {
    let { data, error } = await sb.from('episodes').select('*').eq('id', id).single();
    if (data) {
        let episode = data;
        let cast = (await sb.from('cast').select('*').in('id', episode.cast)).data;
        for (let i = 0; i < cast.length; i++) {
            cast[i].mug = (await sb.storage.from('mugs').getPublicUrl(cast[i].mug)).data.publicUrl
        }
        let topics = (await sb.from('topics').select('*, contributors(*)').eq('episode', episode.id).order('timestamp_raw')).data;
        let tpcs = [];

        for (let i = 0; i < topics.length; i++) {
            let topic = topics[i];

            if (topic.title === 'Chapters' || topic.title === 'Intro') continue;

            if (topic.section) {
                tpcs.push({
                    ...topic,
                    hash: hash(topic.title),
                    children: []
                })
            } else {
                if (tpcs[tpcs.length - 1]) {
                    if (topic.title.startsWith('Sponsor') && tpcs[tpcs.length - 1].title !== 'Sponsor Spots') {
                        tpcs.push({
                            title: 'Sponsor Spots',
                            hash: hash('Sponsor Spots'),
                            timestamp: topic.timestamp,
                            timestamp_raw: topic.timestamp_raw,
                            url: null,
                            children: [topic]
                        })
                    } else {
                        tpcs[tpcs.length - 1].endpoint = topic.endpoint;
                        tpcs[tpcs.length - 1].children.push(topic)
                        console.log(tpcs[tpcs.length - 1])
                    }
                } else {
                    tpcs.push({
                        ...topic,
                        hash: hash(topic.title),
                        endpoint: 0,
                        children: []
                    })
                }
            }
        }
        episode.thumbnail = (await sb.storage.from('thumbs').getPublicUrl(episode.id + '.jpeg')).data.publicUrl
        return {
            episode, cast, topics: tpcs
        }
    } else {
        throw error
    }
})

async function save(id) {
    console.log(id);
    let e = document.getElementById(id);
    console.log(e);
}

function addGroup() {
    data.value.topics.push({
        id: v4(),
        episode: data.value.episode.id,
        section: false,
        title: 'New Topic',
        description: '',
        url: '',
        timestamp: '00:00:00',
        timestamp_raw: 0,
        last_modified: new Date(),
        hash: hash(new Date().toISOString() + 'new_topic'),
        children: []
    })
}

function addTopicToGroup(id) {
    for (let i = 0; i < data.value.topics.length; i++) {
        if (data.value.topics[i].hash === id) {
            data.value.topics[i].children.push({
                id: v4(),
                episode: data.value.episode.id,
                section: false,
                title: 'New Topic',
                description: '',
                url: '',
                timestamp: '00:00:00',
                timestamp_raw: 0,
                last_modified: new Date()
            })
        }
    }
}

let showPersonSearch = ref(false);
let castSearchValue = ref('');

let castSearchResults = useAsyncData(async () => {
    if (castSearchValue.value.length === 0) {
        return [];
    } else {
        let d = await sb.rpc('search_cast', {
            search_term: castSearchValue.value
        });
        for (let i = 0; i < d.data.length; i++) {
            d.data[i].avatar = (await sb.storage.from('mugs').getPublicUrl(d.data[i].mug)).data.publicUrl;
        }
        return d.data;
    }
}, {
    watch: [castSearchValue]
})

function seek(timestamp) {
    if (player.value) {
        player.value.seekTo(timestamp);
    }
}

function addPerson() {
    showPersonSearch.value = true;
}

function toggleCastMember(id) {
    if (data.value.episode.cast.includes(id)) {
        data.value.episode.cast = data.value.episode.cast.filter(i => i !== id);
    } else data.value.episode.cast.push(id);
}

async function saveCastMembers() {
    let res = await sb.from('episodes').update({
        cast: data.value.episode.cast.filter(function (elem, pos) {
            return data.value.episode.cast.indexOf(elem) == pos;
        })
    }).eq('id', data.value.episode.id);
    console.log(res);
    window.location.reload();
}

function closeEditor() {
    showPersonSearch.value = false;
}

function removeTopicFromGroup(id, group) {
    let answer = confirm('Are you sure you wish to delete this topic?');
    if (answer) {
        for (let i = 0; i < data.value.topics.length; i++) {
            if (data.value.topics[i].hash === group) {
                data.value.topics[i].children = data.value.topics[i].children.filter((t) => t.id !== id);
            }
        }
    }
}

let expanded = ref({})

function toggleState(id, target) {
    if (target.id === '' + id || target.id === id + '-INNER') {
        let e = document.getElementById('' + id)
        let c = e.classList.contains(style.groupOpen);
        if (c) e.classList.remove(style.groupOpen);
        else e.classList.add(style.groupOpen);
        expanded.value[target.id] = !c;
    }
}
</script>
<script>
export default {
    components: {
        Youtube
    }
}
</script>
<template>
    <template v-if="!data && !error">
        <div :class="style.container">
            <h1 style="margin: 10rem auto 0; width: fit-content;">Loading</h1>
            <h2 style="margin: 0.5rem auto 0; width: fit-content;">Please Stand By...</h2>
        </div>
    </template>
    <template v-else-if="data">
        <div :class="style.container">
            <div :class="style.viewport">
                <!-- Title Bar Section -->
                <div :class="style.videoTitleBar">
                    <div>
                        <h2>{{ data.episode.title }}</h2>
                        <h4>Originally Aired: {{ new Date(data.episode.aired).toLocaleDateString() }}</h4>
                        <h4>
                            Runtime: {{ data.episode.duration_text }}
                            (You've watched {{ time_human }} | That's {{ time_percentage }}%)
                        </h4>
                    </div>
                </div>

                <!-- Player Section -->
                <div id="videoplayerviewportsector" :class="style.video">
                    <Youtube @ready="onPlayerReady()" width="100%" height="700"
                        :src="`https://www.youtube.com/embed/${data.episode.id}`" ref="player" />
                </div>

                <!-- Topic Section -->
                <ul :class="style.groups">
                    <button v-if="showEditor" style="position:sticky;top:0rem;" @click="addGroup()">Add Group</button>
                    <template v-if="data.topics.length > 0" v-for="group in data.topics">
                        <li :id="group.hash"
                            :style="{ /*maxHeight: group.children.length > 0 ? (group.children.length * 115) + ((group.children.length - 1) * 20) + 82 + 'px' : '150px'*/ }"
                            :class="[
                                style.group,
                                (
                                    expanded[group.id] ||
                                    (group.timestamp_raw <= time && group.endpoint >= time)
                                ) ? style.groupOpen : undefined,
                                (group.timestamp_raw <= time && group.endpoint >= time) ? style.activeGroup : undefined
                            ]" @click="(e) => toggleState(group.hash, e.target)">
                            <span style="display: grid; grid-template-columns: 20px auto;">
                                <Icon style="height: 30px; width: 30px; margin: auto;" :id="group.hash + '-INNER'"
                                    :name="expanded[group.hash] ? 'material-symbols:unfold-less' : 'material-symbols:unfold-more'"
                                    color='#1DA1F2' />
                                <h3 v-if="!showEditor" @click="(e) => seek(group.timestamp_raw)">{{ group.title }}
                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                        color='#1DA1F2' />
                                </h3>
                                <input v-else id="group-title-box" :class="style.topicTitle" :value=group.title />
                            </span>
                            <span v-if="showEditor" :class="style.topicButtons">
                                <button :class="[style.topicButton, style.hoverEffects]" @click="save(group.id, true)">Save
                                    Changes</button>
                                <button :class="[style.topicButton, style.hoverEffects]"
                                    @click="addTopicToGroup(group.hash)">Add Topic</button>
                                <button :class="[style.topicButton, style.hoverEffects]"
                                    @click="removeGroup(group.hash)">Delete
                                    Group</button>
                            </span>
                            <div :class="style.topics"
                                :style="{ /* maxHeight: (group.children.length * 110) + ((group.children.length - 1) * 20) + 'px' */ }">
                                <template v-for="topic in group.children">
                                    <div @click="(e) => seek(topic.timestamp_raw)"
                                        :class="[style.topic, (topic.timestamp_raw <= time && topic.endpoint >= time) ? style.activeTopic : undefined]"
                                        :id="topic.id">
                                        <p v-if="!showEditor" :class="style.topicTitle">{{ topic.title }} </p>
                                        <input v-else id="title-box" :class="[style.topicTitle, style.hoverEffects]"
                                            :value=topic.title />
                                        <span :class="style.topicDetails">
                                            <template v-if="!showEditor">
                                                <p v-if="topic.contributors" :class="style.topicContributor">
                                                    Contributor: {{
                                                        topic.contributors.name }}
                                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'"
                                                        name="ri:verified-badge-fill" color='#1DA1F2' />
                                                </p>
                                                <p v-else :class="style.topicContributor">Unknown Contributor
                                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'"
                                                        name="ri:verified-badge-fill" color='#1DA1F2' />
                                                </p>
                                            </template>
                                            <span :class="style.topicButtons" v-else>
                                                <button :class="[style.topicButton, style.hoverEffects]"
                                                    @click="save(topic.id)">Save
                                                    Changes</button>
                                                <button :class="[style.topicButton, style.hoverEffects]"
                                                    @click="removeTopicFromGroup(topic.id, group.hash)">Delete
                                                    Topic</button>
                                            </span>

                                            <p v-if="!showEditor" :class="style.topicTimestamp">{{ topic.timestamp }}</p>
                                            <span v-else :class="style.timestampEditor">
                                                <input id="timestamp-hh" type="number"
                                                    :class="[style.topicTitle, style.hoverEffects]"
                                                    :value="topic.timestamp.split(':')[0]" />
                                                :
                                                <input id="timestamp-mm" type="number"
                                                    :class="[style.topicTitle, style.hoverEffects]"
                                                    :value="topic.timestamp.split(':')[1]" />
                                                :
                                                <input id="timestamp-ss" type="number"
                                                    :class="[style.topicTitle, style.hoverEffects]"
                                                    :value="topic.timestamp.split(':')[2]" />
                                            </span>
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <h3>Topics currently unavailable</h3>
                    </template>
                </ul>

                <!-- Cast Section -->
                <div :class="style.cast">
                    <button v-if="showEditor" style="position:sticky;top:0rem;" @click="addPerson()">Add Person</button>
                    <div :class="[style.personEditorSearch, showPersonSearch ? undefined : style.hidden]">
                        <div :class="style.personEditorInner">
                            <button :class="[style.editorClose, style.hoverEffects]" @click="closeEditor()">Close</button>
                            <div :class="style.editorHorizontal">
                                <h1>Cast Editor</h1>
                            </div>
                            <div :class="style.editorHorizontal">
                                <input :class="[style.searchBar, style.hoverEffects]" type="text" v-model="castSearchValue"
                                    placeholder="Search..." />
                                <button :class="[style.editorSave, style.hoverEffects]"
                                    @click="saveCastMembers()">Save</button>
                            </div>
                            <div :class="style.editorSearchContainer">
                                <template v-if="castSearchResults.data.value.length > 0"
                                    v-for="person in castSearchResults.data.value">

                                    <div @click="toggleCastMember(person.id)"
                                        :class="[style.castSearchResult, data.episode.cast.includes(person.id) ? style.inclusive : undefined]">
                                        <img :src="person.avatar" />
                                        <div>
                                            <h3>
                                                {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '" ')
                                                    : person.name }}
                                            </h3>
                                            <h4>
                                                <a v-if="person.outlet_uri" :href="person.outlet_uri" target="_blank">
                                                    {{ person.outlet ? person.outlet : 'No Affiliation' }}
                                                    <Icon name="ph:link" />
                                                </a>
                                                <template v-else>{{ person.outlet ? person.outlet : 'No Affiliation'
                                                }}</template>
                                            </h4>
                                        </div>
                                    </div>
                                </template>
                                <div v-else>
                                    No Results
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-for=" person  in  data.cast ">
                        <div :class="style.castMember">
                            <img :src="person.mug" />
                            <div>
                                <h3>
                                    {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '" ')
                                        : person.name }}
                                </h3>
                                <h4>
                                    <a v-if="person.outlet_uri" :href="person.outlet_uri" target="_blank">
                                        {{ person.outlet ? person.outlet : 'No Affiliation' }}
                                        <Icon name="ph:link" />
                                    </a>
                                    <template v-else>{{ person.outlet ? person.outlet : 'No Affiliation'
                                    }}</template>
                                </h4>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        Error {{ error }}
    </template>
</template>



