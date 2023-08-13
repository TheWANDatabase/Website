<script async setup>
import style from './videos.module.css';

definePageMeta({
    layout: "viewer"
});

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

let { data, error } = useAsyncData(async () => {
    let { data, error } = await sb.from('episodes').select('*').eq('id', id).single();
    if (data) {
        let episode = data;
        let cast = (await sb.from('cast').select('*').in('id', episode.cast)).data;
        for (let i = 0; i < cast.length; i++) {
            cast[i].mug = (await sb.storage.from('mugs').getPublicUrl(cast[i].mug)).data.publicUrl
        }
        let topics = (await sb.from('topics').select('title, timestamp, section, url, contributors(*)').eq('episode', episode.id).order('timestamp')).data;
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

function toggleState(id) {
    let e = document.getElementById(id)
    e.classList.toggle(style.groupOpen)
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
                        <template v-if="data.topics.length > 0" v-for="group in data.topics">
                            <div :id="group.hash" :class="[style.group]" @click="toggleState(group.hash)">
                                <h3>{{ group.title }}
                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'" name="ri:verified-badge-fill"
                                        color='#1DA1F2' />
                                </h3>

                                <div :class="style.topics">
                                    <template v-for="topic in group.children">
                                        <div :class=style.topic>
                                            <p :class="style.topicTitle">{{ topic.title }} </p>
                                            <span :class="style.topicDetails">
                                                <p v-if="topic.contributors" :class="style.topicContributor">Contributor: {{
                                                    topic.contributors.name }}
                                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'"
                                                        name="ri:verified-badge-fill" color='#1DA1F2' />
                                                </p>
                                                <p v-else :class="style.topicContributor">Unknown Contributor
                                                    <Icon v-if="data.episode.id === 'hNXgJlPzkCQ'"
                                                        name="ri:verified-badge-fill" color='#1DA1F2' />
                                                </p>
                                                <p :class="style.topicTimestamp">{{ topic.timestamp }}</p>
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
</template></template>