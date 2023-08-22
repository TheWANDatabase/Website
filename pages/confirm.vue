<script setup lang="ts">
const user = useSupabaseUser()

const failCondition = ref(false)

watch(user, () => {
  if (user.value) {
    return navigateTo('/', { external: true })
  }
}, { immediate: true })
</script>
<template>
  <div v-if="!failCondition">
    Waiting for login...
  </div>
  <div v-else>
    An error has occured and all expected redirects are unavailable at this time. Please check your internet
    connection.
  </div>
</template>
