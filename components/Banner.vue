<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import style from './Banner.module.css'

export interface Props {
  pid?: string,
  bg?: string,
  fg?: string,
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false
})

const show = ref(false)

function close () {
  show.value = false
  try {
    if (props.pid) { window.localStorage.setItem('BNR-' + props.pid, 'n') }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  if (props.pid) {
    const st = window.localStorage.getItem('BNR-' + props.pid)
    if (st === 'y') {
      show.value = true
    } else if (!st) {
      show.value = true
      window.localStorage.setItem('BNR-' + props.pid, 'y')
    } else {
      show.value = false
    }
  }
})

</script>

<template>
  <div
    :class="[style.banner, show ? undefined : style.hide]"
    :style="{ backgroundColor: props.bg || '#2a2a2a', color: props.fg || 'orange' }"
  >
    <slot />
    <Icon v-if="!props.fixed" name="mdi:close-thick" @click="close()" />
  </div>
</template>
