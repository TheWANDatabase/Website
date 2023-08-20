<script async setup>
import { v4 } from 'uuid';
import style from './videos.module.css';
import Youtube from 'vue3-youtube';

const profile = useState('uprofile', () => undefined);
const showEditor = ref(false);
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
        if (data) {
            if (Math.round(time.value) >= Math.round(data.value.episode.duration - 60)) {
                if (profile.value && watch.value) {
                    console.log(await sb.from('episode_progression').update({
                        viewed_seconds: Math.floor(data.value.episode.duration)
                    }).eq('id', watch.value.id));
                }
            } else if (Math.floor(time.value) % 5 !== 0 || !player) {
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
                        player.seekTo(watch.value.viewed_seconds)
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
        }
    } catch (e) {
        console.error(e);
    }
}, {
    server: false,
    watch: [time]
})



onMounted(() => {



    itv.player = setInterval(() => {
        if (player) {
            try {
                time.value = player.getCurrentTime()
                time_human.value = toTimestamp(player.getCurrentTime());
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

let topicEditorList = ref([]);
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
        topicEditorList.value = tpcs;
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

let showTopicEditor = ref(false);
let topicEditor = {
    time: {
        hh: ref(0),
        mm: ref(0),
        ss: ref(0)
    },
    end: {
        hh: ref(0),
        mm: ref(0),
        ss: ref(0)
    },
    type: ref('category'),
    title: ref(''),
    parent: ref(null)
}
function addGroup() {
    showTopicEditor.value = true;
    // data.value.topics.push({
    //     id: v4(),
    //     episode: data.value.episode.id,
    //     section: false,
    //     title: 'New Topic',
    //     description: '',
    //     url: '',
    //     timestamp: '00:00:00',
    //     timestamp_raw: 0,
    //     last_modified: new Date(),
    //     hash: hash(new Date().toISOString() + 'new_topic'),
    //     children: []
    // })
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
    console.log(player)
    try {
        if (player) {
            player.seekTo(timestamp);
        }
    } catch (e) {
        console.log(e);
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
    window.location.reload();
}

function closeEditor() {
    showPersonSearch.value = false;
    showTopicEditor.value = false;
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

function processTopicChanges() {
    let tpc = topicEditor;
    if (tpc.type.value === 'category') {
        console.log(tpc, data.value.topics[0]);
        let start = ((tpc.time.hh.value * 60 * 60) + (tpc.time.mm.value * 60) + tpc.time.ss.value);
        let end = ((tpc.end.hh.value * 60 * 60) + (tpc.end.mm.value * 60) + tpc.end.ss.value)

        topicEditorList.value.push({
            id: v4(),
            accepted: false,
            title: tpc.title.value,
            timestamp_raw: start,
            timestamp: toTimestamp(start),
            end: end,
            section: true,
            episode: id
        })
    }
}

useHead({
    script: [
        {
            src: 'https://www.youtube.com/iframe_api'
        },
        {
            src: '/scripts/player.js'
        }
    ]
})

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
                <div :class="style.video">
                    <iframe id="videoplayerviewportsector"
                        src="https://www.youtube.com/embed/JjHCiXQqirg?enablejsapi=1" title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen />
                </div>

                <!-- Topic Section -->
                <ul :class="style.groups">
                    <button v-if="showEditor" style="position:sticky;top:0rem;" @click="addGroup()">Add Group</button>
                    <div :class="[style.topicEditor, showTopicEditor ? undefined : style.hidden]">
                        <div :class="style.topicEditorInner">
                            <button :class="[style.editorClose, style.hoverEffects]" @click="closeEditor()">Close</button>
                            <div :class="style.editorHorizontal">
                                <h1>Topic Editor</h1>
                            </div>
                            <h3>Topic Type</h3>
                            <p>
                                <strong>Container</strong>
                                <br />
                                Collapsible topic container, used to show just a general topic.
                                <br />
                                (eg: Topic 1 - xQc's Reaction Called Out)
                                <br />
                                <br />
                                <strong>Topic</strong>
                                <br />
                                Used for more precise breakdowns of whats going on.
                                <br />(eg: specific Merch Message question)
                            </p>
                            <select v-model="topicEditor.type.value" placeholder="Topic Title Text">
                                <option value="category">Container</option>
                                <option value="topic">Topic</option>
                            </select>
                            <h3>Title</h3>
                            <input v-model="topicEditor.title.value" placeholder="Topic Title Text" />
                            <h3>Start Timestamp</h3>
                            <p>
                                At which point should the topic be highlighted in the player view?
                            </p>
                            <div :class="style.editorHorizontal">
                                <input type="number" v-model="topicEditor.time.hh.value" placeholder="00" />
                                <input type="number" v-model="topicEditor.time.mm.value" placeholder="00" />
                                <input type="number" v-model="topicEditor.time.ss.value" placeholder="00" />
                            </div>
                            <h3>End Timestamp</h3>
                            <p>
                                When should the highlight be disabled. This is usually about 1 second before the start time
                                of the next topic.
                            </p>
                            <div :class="style.editorHorizontal">
                                <input type="number" v-model="topicEditor.end.hh.value" placeholder="00" />
                                <input type="number" v-model="topicEditor.end.mm.value" placeholder="00" />
                                <input type="number" v-model="topicEditor.end.ss.value" placeholder="00" />
                            </div>
                            <template v-if="topicEditor.type.value === 'topic'">
                                <h3>Parent Container</h3>
                                <p>
                                    Which primary topic this subtopic should be stored within (only works on 'Topic'
                                    entries,
                                    and not 'Container' entries)
                                </p>
                                <select v-model="topicEditor.parent.value">
                                    <option v-for="topic in topicEditorList" :value="topic.id">{{ topic.title }}</option>
                                </select>
                            </template>
                            <h4>Preview</h4>
                            <Accordion v-if="topicEditor.type.value === 'category'" :show="false">
                                <template #header>
                                    <h3>{{ topicEditor.title.value }} </h3>
                                    <button>Jump To Topic</button>
                                </template>
                                <h4>No sub-topics available</h4>
                            </Accordion>
                            <div v-else :class="[style.topic]">
                                <p :class="style.topicTitle">{{ topicEditor.title.value.length > 0 ? topicEditor.title.value
                                    : 'Topic Title Text' }} </p>
                                <span :class="style.topicDetails">
                                    <p v-if="profile" :class="style.topicContributor">
                                        Contributor: {{
                                            profile.username }}
                                        <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                            color='#1DA1F2' />
                                    </p>
                                    <p :class="style.topicTimestamp">{{ topicEditor.time.hh }} :
                                        {{ topicEditor.time.mm }} : {{ topicEditor.time.ss }}</p>
                                </span>
                            </div>
                            <button @click="processTopicChanges()">Edit Topic</button>
                        </div>
                    </div>
                    <template v-if="data.topics.length > 0" v-for="group in data.topics">
                        <Accordion :show="(group.timestamp_raw <= time && group.endpoint - 1 >= time)">
                            <template #header>
                                <h3>{{ group.title }}
                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                        color='#1DA1F2' />
                                </h3>
                                <button @click="(e) => seek(group.timestamp_raw)">Jump To Topic</button>
                            </template>
                            <span v-if="showEditor" :class="style.topicButtons">
                                <button :class="[style.topicButton, style.hoverEffects]" @click="save(group.id, true)">Save
                                    Changes</button>
                                <button :class="[style.topicButton, style.hoverEffects]"
                                    @click="addTopicToGroup(group.hash)">Add Topic</button>
                                <button :class="[style.topicButton, style.hoverEffects]"
                                    @click="removeGroup(group.hash)">Delete
                                    Group</button>
                            </span>
                            <template v-for="topic in group.children">
                                <div @click="(e) => seek(topic.timestamp_raw)"
                                    :class="[style.topic, (topic.timestamp_raw <= time && topic.endpoint >= time) ? style.activeTopic : undefined]"
                                    :id="topic.id">
                                    <p :class="style.topicTitle">{{ topic.title }} </p>
                                    <span :class="style.topicDetails">
                                        <template>
                                            <p v-if="topic.contributors" :class="style.topicContributor">
                                                Contributor: {{
                                                    topic.contributors.name }}
                                                <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                                    color='#1DA1F2' />
                                            </p>
                                            <p v-else :class="style.topicContributor">Unknown Contributor
                                                <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                                    color='#1DA1F2' />
                                            </p>
                                        </template>
                                        <p :class="style.topicTimestamp">{{ topic.timestamp }}</p>
                                    </span>
                                </div>
                            </template>
                        </Accordion>
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
    <div :class="style.error">
        <h3>This device is too small for this page to display correctly.</h3>
        <p>Please try viewing on a bigger device.</p>
    </div>
</template>



