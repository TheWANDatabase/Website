<template>
  <div :class="['w-fit', 'h-fit', 'p-1', 'rounded-md', 'border-2', 'border-' + base + '-700', 'shadow-inner', 'shadow-' + base + '-800', 'bg-' + base + '-900'].concat(i.split(' '))">
    <p :class="['text-sm', 'overflow-hidden', 'text-' + textBase + '-300'].concat(o.split(' '))">
      {{ props.label }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps(['id', 'class', 'innerclass', 'label', 'color', 'text'])
const base = ref(props.color ? props.color : 'poppy')
const textBase = ref(props.text ? props.text : 'poppy')

const i = props.class ? props.class : ''
const o = props.innerclass ? props.innerclass : ''
</script>
