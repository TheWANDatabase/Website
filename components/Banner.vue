<script setup>
import style from "./Banner.module.css";

const show = ref(true);

const props = defineProps([
    'bg',
    'fg'
])

function close() {
    show.value = false;
}

</script>



<template>
    <div :class="style.banner"
        :style="{ display: show ? 'flex' : 'none', backgroundColor: props.bg || '#2a2a2a', color: props.fg || 'orange' }">
        <slot />
        <Icon name="mdi:close-thick" @click="close()" />
    </div>
</template>