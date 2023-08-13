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

function removeTopicFromGroup(id, group) {
    let answer = confirm('Are you sure you wish to delete this topic?');
    for (let i = 0; i < data.value.topics.length; i++) {
        if (data.value.topics[i].hash === group) {
            data.value.topics[i].children = data.value.topics[i].children.filter((t) => t.id !== id);
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
                <div :class="style.groups">
                    <ClientOnly>
                        <button v-if="user" style="position:sticky;top:0rem;" @click="addGroup()">Add Group</button>
                        <template v-if="data.topics.length > 0" v-for="group in data.topics">
                            <div :id="group.hash" :class="[style.group]" @click="(e) => toggleState(group.hash, e.target)">
                                <h3 v-if="!user" :id="group.hash">{{ group.title }}
                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                        color='#1DA1F2' />
                                </h3>
                                <input v-else id="group-title-box" :class="style.topicTitle" :value=group.title />
                                <span v-if="user" :class="style.topicButtons">
                                    <button :class="style.topicButton" @click="save(group.id, true)">Save
                                        Changes</button>
                                    <button :class="style.topicButton" @click="addTopicToGroup(topic.id)">Add Topic</button>
                                    <button :class="style.topicButton" @click="removeGroup(group.hash)">Delete
                                        Group</button>
                                </span>
                                <div :class="style.topics">
                                    <template v-for="topic in group.children">
                                        <div :class=style.topic :id="topic.id">
                                            <p v-if="!user" :class="style.topicTitle">{{ topic.title }} </p>
                                            <input v-else id="title-box" :class="style.topicTitle" :value=topic.title />
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
                                                    <button :class="style.topicButton" @click="save(topic.id)">Save
                                                        Changes</button>
                                                    <button :class="style.topicButton"
                                                        @click="removeTopicFromGroup(topic.id, group.hash)">Delete
                                                        Topic</button>
                                                </span>

                                                <p v-if="!user" :class="style.topicTimestamp">{{ topic.timestamp }}</p>
                                                <span v-else :class="style.timestampEditor">
                                                    <input id="timestamp-hh" type="number" :class="style.topicTitle"
                                                        :value="topic.timestamp.split(':')[0]" />
                                                    :
                                                    <input id="timestamp-mm" type="number" :class="style.topicTitle"
                                                        :value="topic.timestamp.split(':')[1]" />
                                                    :
                                                    <input id="timestamp-ss" type="number" :class="style.topicTitle"
                                                        :value="topic.timestamp.split(':')[2]" />
                                                </span>
                                            </span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <h3>Topics currently unavailable</h3>
                        </template>
                    </ClientOnly>
                </div>
                <div :class="style.cast">
                    <ClientOnly>
                        <template v-for="person in data.cast">
                            <div :class="style.castMember">
                                <img :src="person.mug" :alt="`Mugshot image for ${person.name}`" />
                                <h3>
                                    {{ person.alias ? person.name.split(' ').join(' "' + person.alias + '" ') : person.name
                                    }}
                                </h3>
                                <h4>
                                    <a v-if="person.outlet_uri" :href="person.outlet_uri">
                                        {{ person.outlet ? person.outlet : '' }}
                                        <Icon name="ph:link" />
                                    </a>
                                    <template v-else>{{ person.outlet ? person.outlet : '' }}</template>
                                </h4>


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