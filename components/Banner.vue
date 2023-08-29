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
const hasOpened = ref(false)

function close () {
  show.value = false
  const date = new Date()
  try {
    if (props.pid) {
      window.localStorage.setItem('BNR-' + props.pid, JSON.stringify({
        value: 'n',
        expiry: date.setDate(date.getDate() + 1)
      }))
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  try {
    if (props.pid) {
      const raw = window.localStorage.getItem('BNR-' + props.pid)
      if (raw) {
        const st = JSON.parse(raw)
        if (st.expiry > Date.now()) {
          if (st.value === 'y') {
            show.value = true
            hasOpened.value = true
          } else if (!st.value) {
            show.value = true
            hasOpened.value = true
            const date = new Date()
            window.localStorage.setItem('BNR-' + props.pid, JSON.stringify({
              value: 'y',
              expiry: date.setDate(date.getDate() + 1)
            }))
          } else {
            show.value = false
          }
        } else {
          show.value = true
          hasOpened.value = true
          const date = new Date()
          window.localStorage.setItem('BNR-' + props.pid, JSON.stringify({
            value: 'y',
            expiry: date.setDate(date.getDate() + 1)
          }))
        }
      } else {
        show.value = true
        hasOpened.value = true
        const date = new Date()
        window.localStorage.setItem('BNR-' + props.pid, JSON.stringify({
          value: 'y',
          expiry: date.setDate(date.getDate() + 1)
        }))
      }
    }
  } catch (e) {
    console.error(e)
  }
})

</script>

<template>
  <div
    :class="show ? [style.banner] : hasOpened ? [style.banner, style.hide] : [style.hidden]"
    :style="{ backgroundColor: props.bg || '#2a2a2a', color: props.fg || 'orange' }"
  >
    <slot />
    <Icon v-if="!props.fixed" name="mdi:close-thick" @click="close()" />
  </div>
</template>
