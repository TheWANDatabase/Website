<script setup>
const props = defineProps({
  show: Boolean
})
const showAccordion = ref(false)

function toggle () {
  showAccordion.value = !showAccordion.value
}

useAsyncData(() => {
  showAccordion.value = props.show
}, {
  watch: [props]
})

function beforeEnter (el) {
  el.style.height = '0'
}

function enter (el) {
  el.style.height = el.scrollHeight + 'px'
}

function beforeLeave (el) {
  el.style.height = el.scrollHeight + 'px'
}

function leave (el) {
  el.style.height = '0'
};
</script>
<template>
  <div class="accordion">
    <div class="header" @click="toggle">
      <slot name="header">
        HINT
      </slot>
      <i class="fa fa-2x fa-angle-down header-icon" :class="{ rotate: showAccordion }" />
    </div>
    <transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-show="showAccordion" class="body">
        <div class="body-inner">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>
<style>
.accordion {
    margin: 0 0 20px;
    background-color: #3b3b3b;
    border-radius: 5px;
}

.accordion .header {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    position: relative;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}

.accordion .header h3 {
    margin: 0;
    width: auto;
}

.accordion .header button {
    margin: 0.5rem;
    color: white;
    padding: 2px 5px;
    min-width: 105px;
    /* margin-bottom: -0.5rem; */
    border: 1px #1f1f1f solid;
    background-color: #1a1a1a;
    border-radius: 5px;
    transition: 200ms;
}

.accordion .header button:hover,
.accordion .header button:active,
.accordion .header button:focus {
    color: #ffa500;
    border: 1px #ffa500 solid;
    transition: 200ms;
}

.accordion .header-icon {
    position: absolute;
    top: 5px;
    right: 8px;
    transform: rotate(0deg);
    transition-duration: 0.3s;
}

.accordion .body {
    /*   display: none; */
    overflow: hidden;
    background-color: #2b2b2b;
    border: 10px solid #3b3b3b;
    border-top: 0;
    border-radius: 5px;
    transition: 500ms ease-out;
}

.accordion .body-inner {
    width: auto;
    padding: 8px;
    overflow-wrap: break-word;
    border-radius: 5px;
    /*   white-space: pre-wrap; */
}

.accordion .header-icon.rotate {
    transform: rotate(180deg);
    transition-duration: 0.3s;
}
</style>
