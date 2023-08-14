<script async setup>
import { v4 } from 'uuid';
import style from './videos.module.css';

definePageMeta({
    layout: "viewer"
});

const sb = useSupabaseClient();
const user = useSupabaseUser();

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



let { data, error } = useAsyncData(async () => {
    let { data, error } = await sb.from('episodes').select('*').eq('id', id).single();
    if (data) {
        let episode = data;
        let cast = (await sb.from('cast').select('*').in('id', episode.cast)).data;
        for (let i = 0; i < cast.length; i++) {
            cast[i].mug = (await sb.storage.from('mugs').getPublicUrl(cast[i].mug)).data.publicUrl
        }
        let topics = (await sb.from('topics').select('id,title, timestamp, section, url, contributors(*)').eq('episode', episode.id).order('timestamp')).data;
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
                            url: null,
                            children: [topic]
                        })
                    } else {
                        tpcs[tpcs.length - 1].children.push(topic)
                    }
                } else {
                    tpcs.push({
                        ...topic,
                        hash: hash(topic.title),
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

function toggleState(id, target) {
    if (target.id === '' + id) {
        let e = document.getElementById(id)
        e.classList.toggle(style.groupOpen)
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
                <div :class="style.videoTitleBar">
                    <div>
                        <h2>{{ data.episode.title }}</h2>
                        <h4>Originally Aired: {{ new Date(data.episode.aired).toLocaleDateString() }}</h4>
                        <h4>Runtime: {{ data.episode.duration_text }}</h4>
                    </div>
                </div>
                <div :class="style.video">
                    <ClientOnly>
                        <iframe width="100%" height="100%" :src="`https://www.youtube.com/embed/${data.episode.id}`"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen />
                    </ClientOnly>
                </div>
                <ul :class="style.groups">
                    <ClientOnly>
                        <button v-if="user" style="position:sticky;top:0rem;" @click="addGroup()">Add Group</button>
                        <template v-if="data.topics.length > 0" v-for="group in data.topics">
                            <li :id="group.hash" :class="[style.group]" @click="(e) => toggleState(group.hash, e.target)">
                                <h3 v-if="!user" :id="group.hash">{{ group.title }}
                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                        color='#1DA1F2' />
                                </h3>
                                <input v-else id="group-title-box" :class="style.topicTitle" :value=group.title />
                                <span v-if="user" :class="style.topicButtons">
                                    <button :class="[style.topicButton, style.hoverEffects]"
                                        @click="save(group.id, true)">Save
                                        Changes</button>
                                    <button :class="[style.topicButton, style.hoverEffects]"
                                        @click="addTopicToGroup(topic.id)">Add Topic</button>
                                    <button :class="[style.topicButton, style.hoverEffects]"
                                        @click="removeGroup(group.hash)">Delete
                                        Group</button>
                                </span>
                                <div :class="style.topics">
                                    <template v-for="topic in group.children">
                                        <div :class=style.topic :id="topic.id">
                                            <p v-if="!user" :class="style.topicTitle">{{ topic.title }} </p>
                                            <input v-else id="title-box" :class="[style.topicTitle, style.hoverEffects]"
                                                :value=topic.title />
                                            <span :class="style.topicDetails">
                                                <template v-if="!user">
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

                                                <p v-if="!user" :class="style.topicTimestamp">{{ topic.timestamp }}</p>
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
                    </ClientOnly>
                </ul>
                <div :class="style.cast">
                    <ClientOnly>
                        <button v-if="user" style="position:sticky;top:0rem;" @click="addPerson()">Add Person</button>
                        <div :class="[style.personEditorSearch, showPersonSearch ? undefined : style.hidden]">
                            <div :class="style.personEditorInner">
                                <button :class="[style.editorClose, style.hoverEffects]"
                                    @click="closeEditor()">Close</button>
                                <div :class="style.editorHorizontal">
                                    <h1>Cast Editor</h1>
                                </div>
                                <div :class="style.editorHorizontal">
                                    <input :class="[style.searchBar, style.hoverEffects]" type="text"
                                        v-model="castSearchValue" placeholder="Search..." />
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
                                                    {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '"')
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
                                        {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '"')
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
                    </ClientOnly>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        Error {{ error }}
    </template>
</template>



