<script setup>
import style from "./Header.module.css";
</script>
<template>
    <div :class="style.header">
        <h1 :class="style.brand">
            THE
            <span :class="style.grey1">W</span>
            <span :class="style.orange">A</span>
            <span :class="style.grey2">N</span>
            DB
        </h1>
        <ul :class="style.navcontainer">
            <a :class="style.navlink" href="/">Video Index</a>
            <!-- <a :class="style.navlink" href="/contributors">Contributors</a>
            <a :class="style.navlink" href="/cast">Cast & Crew</a> -->
        </ul>
    </div>
</template>