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

let show = ref(true)

if (props.pid) {
  show = useState(`show-banner-${props.pid}`, () => true)
}

function close () {
  show.value = false
}

</script>

<template>
  <div
    :class="[style.banner, !show ? style.hide : undefined]"
    :style="{ backgroundColor: props.bg || '#2a2a2a', color: props.fg || 'orange' }"
  >
    <slot />
    <Icon v-if="!props.fixed" name="mdi:close-thick" @click="close()" />
  </div>
</template>
