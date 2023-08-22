<script setup lang="ts">
const user = useSupabaseUser()

watch(user, async() => {
    if (user.value) {
        let profile = await (await fetch('/api/v1/profile', {
            method: 'POST',
            body: JSON.stringify({id: user.value.id})
        })).json;
        console.log(profile);
    }
}, { immediate: true })
</script>
<template>
    <div>Waiting for login...</div>
</template>