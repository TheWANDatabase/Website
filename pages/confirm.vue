<script setup lang="ts">
const user = useSupabaseUser()

const failCondition = ref(false);

watch(user, async () => {
    if (user.value) {
        let profile = await (await fetch('/api/v1/profiles', {
            method: 'POST',
            body: JSON.stringify({ id: user.value.id })
        })).json();
        profile.data.flags = 1;
        let l = { status: 100 };
        let b = { status: 100 };
        let p = { status: 100 };

        try {
            l = await fetch('http://localhost:3000/confirm');
        } catch (e) {
            console.log("failed to locate dev build")
        }
        try {
            b = await fetch('http://beta.thewandb.com/confirm');
        } catch (e) {
            console.log("failed to locate beta build")
        }
        try {
            p = await fetch('http://thewandb.com/confirm');
        } catch (e) {
            console.log("failed to locate production build")
        }


        // If profile has developer flag enabled try redirecting to the local build
        if ((profile.data.flags & 1) == 1 && l.status === 200) {
            return navigateTo('http://localhost:3000/confirm', { external: true })
        } else if ((profile.data.flags & 2) == 1 && b.status === 200) {
            return navigateTo('https://beta.thewandb.com/confirm', { external: true })
        } else if (p.status === 200) {
            return navigateTo('https://thewandb.com/', { external: true })
        }

    }
}, { immediate: true })
</script>
<template>
    <div v-if="!failCondition">Waiting for login...</div>
    <div v-else>
        An error has occured and all expected redirects are unavailable at this time. Please check your internet
        connection.
    </div>
</template>