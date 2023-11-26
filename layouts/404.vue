<template>
  <div>
    <Header/>
    <div class="grid">
      <div class="grid__item" style="grid-column: 9 / span 4; grid-row: 4 / span 3;flex-direction: column;">
        <p style="font-size: 56px;">404</p>
        <p style="font-size: 24px;">Page Not Found</p>
      </div>
      <div class="grid__item" style="grid-column: 10 / span 2; grid-row: 8 / span 1;">
        <button class="button" style="margin: 0.5rem auto;" @click="goBack">Go Back</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Header from "~/comonents/Header.vue";

const goBack = () => {
  useRouter().push('/')
}
</script>
<style scoped>


</style>