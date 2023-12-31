<script lang="ts">
	import { getVideos } from '$lib/api';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	// import Plyr from 'plyr';

	export let vod: any;

	let player;

	onMount(() => {
		if (typeof document !== 'undefined') {
			// player = new Plyr('#player');
		}
	});
</script>

<div class="container">
	{#if vod.floatplane !== null}
		<div class="plyr__video-embed" id="player">
			<iframe
				src={`https://www.youtube.com/embed/${vod.id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
				allow="autoplay fullscreen transparency"
				title="YouTube"
			/>
		</div>
	{:else}
		<iframe
			src={`https://www.youtube.com/embed/${vod.id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
			allow="autoplay fullscreen transparency"
			title="YouTube"
		/>
	{/if}
</div>

<style>
    .container {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
    }

	.container #player {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
	}

	.container #player iframe {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
	}
</style>
