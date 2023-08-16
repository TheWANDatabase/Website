<script setup>
const p = defineProps([
    'current',
    'placeholder',
    'editor',
    'vname'
]);
const editing = ref(false);
const val = ref(p.editor.value || p.current);
const v = ref(val.value);
const emit = defineEmits([
    'modified',
    'saved'
])

useAsyncData(() => {
    if (v.value !== val.value) {
        emit('modified', val.value, v.value)
        v.value = val.value;
    }
}, {
    watch: [val]
})

function tstate() {
    editing.value = !editing.value;
}

function save() {
    tstate();
    emit('saved', val.value)
}

function processKey(e) {
    if (e.code === 'Enter') {
        var tmp = document.createElement("input");
        e.target.parentElement.appendChild(tmp);
        tmp.focus();
        e.target.parentElement.removeChild(tmp);
        save();
    }
}
</script>
<style scoped>
.textEditSetting {
    margin: auto 0.5rem 0 -0.25rem;
}

.textEditSetting,
.textEditBox {
    width: auto;
    height: 3rem;
    display: flex;
    flex-direction: row;
}

.textEditBox h4 {
    width: 90px;
    margin: auto 0.5rem;
}

.textEditBox span svg {
    width: 20px;
    height: 20px;
    margin: auto;
    animation: 200ms fadeIn;
}

.textEditBox span {
    width: 20px;
    height: 20px;
    margin: auto 0rem auto 0.25rem;
    animation: 200ms fadeIn;
}

.active span {
    width: 50px;
    height: 20px;
    margin: auto -0.5rem auto 0.25rem;
    animation: 200ms expandedFade;
    overflow: hidden;
}

.active span svg {
    width: 20px;
    height: 20px;
    margin: auto auto auto auto;
    animation: 200ms fadeIn;
}

.textEditBox p,
.textEditBox input {
    padding: 5px 10px;
    color: white;
    border: 1px #1f1f1f solid;
    background-color: #1a1a1a;
    border-radius: 5px;
    margin: auto 0.5rem;
    animation: 200ms fadeIn;
}

.setting {
    display: flex;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes expandedFade {
    0% {
        opacity: 0;
        width: 20px;
    }

    100% {
        opacity: 1;
        width: 50px;
    }
}
</style>
<template>
    <div class="textEditSetting">
        <div v-if="!editing" class="textEditBox">
            <h4>{{ p.vname }}</h4>
            <span>
                <Icon @click="tstate()" name="tabler:edit" />
            </span>
            <p>{{ p.current ? p.current : p.placeholder }}</p>
        </div>
        <div v-else class="textEditBox active">
            <h4>{{ p.vname }}</h4>
            <span>
                <Icon @click="tstate()" name="mdi:cancel" />
                <Icon @click="save()" name="material-symbols:save" />
            </span>
            <input v-model="val" @keyup="processKey" :placeholder="p.placeholder" />
        </div>
    </div>
</template>