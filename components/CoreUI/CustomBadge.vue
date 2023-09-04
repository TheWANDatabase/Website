<template>
  <div :class="['w-fit', 'h-fit', 'p-1', 'rounded-md', 'border-2', 'border-' + base + '-700', 'shadow-inner', 'shadow-' + base + '-800', 'bg-' + base + '-900'].concat(i.split(' '))">
    <p :class="['text-sm', 'overflow-hidden', 'text-' + textBase + '-200'].concat(o.split(' '))">
      {{ props.label }}
    </p>
  </div>
</template>

<script setup>
const cfg = useState('uconf')
const props = defineProps(['id', 'class', 'innerclass', 'label', 'color', 'text'])
const base = ref(props.color ? props.color : (cfg.value ? cfg.value.theme.primary : 'poppy'))
const textBase = ref(props.text ? props.text : (cfg.value ? cfg.value.theme.primary : 'poppy'))

useAsyncData(() => {
  base.value = props.color ? props.color : (cfg.value ? cfg.value.theme.primary : 'poppy')
  textBase.value = props.text ? props.text : (cfg.value ? cfg.value.theme.primary : 'poppy')
}, {
  watch: [cfg, props]
})

const i = props.class ? props.class : ''
const o = props.innerclass ? props.innerclass : ''
</script>
