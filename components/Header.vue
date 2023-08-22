<script setup>
import style from "./Header.module.css";

let sb = useSupabaseClient();
const user = useSupabaseUser();
const config = useRuntimeConfig()

const profile = useState('uprofile', () => undefined);
const history = useState('history', () => {
    new Map();
});


useAsyncData(async () => {
    if (user.value) {
        let { data } = await (await fetch('/api/v1/profiles', {
            method: 'POST',
            body: JSON.stringify({
                id: user.value.id
            })
        })).json()
        if (data === null) {

            sb.auth.signOut();
        } else {
            profile.value = data;
            console.log(data);
            if (!history.value) history.value = new Map();

            let h = await (await fetch('/api/v1/history', {
                method: 'POST',
                body: JSON.stringify({
                    id: user.value.id
                })
            })).json();

            if (h.data) {
                for (let i = 0; i < h.data.length; i++) {
                    history.value.set(h.data[i].episode, h.data[i]);
                }
            }
        }
    } else {
        profile.value = undefined;
    }
}, {
    server: false,
    watch: [user]
})

let results = ref([]);
let visible = ref(false);
let thumbs = ref({})
async function search(d) {
    let term = d.target.value;
    if (term.length > 1) {

        let res = await (await fetch('/api/v1/search', {
            method: 'POST',
            body: JSON.stringify({
                phrase: term,
                lmt: 5,
                ofst: 0
            })
        })).json()

        if (res.length === 0) {
            results.value = [{
                error: "No Results Found"
            }]
        } else {
            let promises = [];
            for (let i = 0; i < res.length; i++) {
                promises.push(
                    new Promise(async (r) => {
                        thumbs.value[res[i].id] = (await sb.storage.from('thumbs').getPublicUrl(res[i].id + '.jpeg')).data.publicUrl;
                        r();
                    })
                );
            }
            await Promise.all(promises);

            results.value = res;
        }

        visible.value = results.value.length > 0;
    } else {
        results.value = [];
        visible.value = results.value.length > 0;
        thumbs.value = {};
    }
}

function openVideo(id) {
    window.location.pathname = '/videos/' + id;
}


function login() {
    window.location.href = '/login';
}

function logout() {
    sb.auth.signOut();
    profile.value = undefined;
}
</script>
<template>
    <div :class="style.headerContainer">
        <Banner pid="eab">
            <p>
                This website is currently in early access. It is unfinished and many design elements
                may change in upcoming updates.
            </p>
        </Banner>
        <Banner pid="gab" :fixed="true" bg="#914f4f" fg="#fff" v-if="config.public.domain === 'localhost:3000'">
            <p>
                You are using a development build of The WAN DB - Proceed with caution.
            </p>
        </Banner>
        <Banner pid="gbb" :fixed="true" bg="#914f4f" fg="#fff" v-if="config.public.domain === 'beta.thewandb.com'">
            <p>
                You are using an early access build of The WAN DB - Proceed with caution.
            </p>
        </Banner>
        <div :class="style.header">
            <h1 :class="[style.brand, style.wordmark]">
                THE
                <span :class="style.grey1">W</span>
                <span :class="style.orange">A</span>
                <span :class="style.grey2">N</span>
                DB
            </h1>
            <h1 :class="[style.brand, style.miniLogo]">
                <span :class="style.grey1">W</span>
                <span :class="style.orange">A</span>
                <span :class="style.grey2">N</span>
            </h1>
            <ul :class="style.navcontainer">
                <a :class="style.navlink" href="/">Video Index</a>
                <!-- <a :class="style.navlink" href="/contributors">Contributors</a>
            <a :class="style.navlink" href="/cast">Cast & Crew</a> -->
            </ul>

            <button v-if="!user" @click="login" :class="style.login">Login</button>
            <template v-else>
                <a href="/profile" v-if="profile" :class=style.profilePill>
                    <img :src="profile.avatar_url">
                    {{ profile.username ? profile.username : profile.full_name }}
                </a>
                <button @click="logout" :class="style.logout">Logout</button>
            </template>
            <input type="text" @input="search" :class="style.search" placeholder="Search..." />
            <div :class="style.searchResults" :style="{
                'max-height': visible ? ((results.length * 110)) + 'px' : '0px',
                opacity: visible ? '0.95' : '0'
            }">
                <template v-for="result in results">
                    <div v-if="!result.error" @click="openVideo(result.id)" :class="style.searchResult">
                        {{ console.log(result) }}
                        <img :src="thumbs[result.id]" />
                        <span>
                            <h2>{{ result.title }}</h2>
                            <ul>
                                <li v-for="index in (result.matched_topics.length > 2 ? 2 : result.matched_topics.length)">
                                    {{ result.matched_topics[index - 1].title }}
                                </li>
                                <li v-if="result.matched_topics.length > 2">
                                    as well as {{ (result.matched_topics.length - 2).toLocaleString() }} other topics
                                </li>
                            </ul>
                        </span>

                    </div>
                    <div v-else :class="style.searchResultError">
                        <h2>No Results Found</h2>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>