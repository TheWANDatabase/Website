<template>
  <NuxtLayout name="404">
    <div>
      <div class="text-4xl">You've Arrived Here on Error, boss</div>
      <button class="font-bold button" @click="goBack">Back</button>
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.button {
  padding: 4px 6px;
  margin: 10px 0px;
  background: black;
  color: white;
}
</style>
