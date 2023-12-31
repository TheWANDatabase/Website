<script lang="ts">
	import { getVideos } from '$lib/api';
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import { writable } from 'svelte/store';
	
    export let data;

</script>

<div class="container">
    <title>{ data.title } | The WAN Database</title>
    <div class=""></div>
</div>
<style>
.container {
    width: 100%;
    padding: 10px;
    background-color: pink;
    min-height: 100%;
    margin: 10px auto auto;
}
</style>
