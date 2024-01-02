<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Plyr from 'plyr';
	import {
		currentTime,
		preshowOffset,
		playing,
		playbackSource,
		adjustedTime,
		maxDuration,
		player
	} from '$lib/stores';
	import { dev } from '$app/environment';

	export let vod: any;
	let eventLoop: any;

	onMount(async () => {
		if (typeof document !== 'undefined') {
			// window.onkeyup = (event: KeyboardEvent) => {
			// 	switch(event.key) {
			// TODO: add keybindings to start/stop player
			// 	}
			// }

			$player = new Plyr('#vodplayer');
			$player.autoplay = true;
			$player.muted = !!dev
			// TODO: add support for floatplane playback

			$playbackSource = 'youtube';
			eventLoop = setInterval(() => {
				
				$currentTime = $player.currentTime;
				$maxDuration = $player.duration;
				$playing = $player.playing;
			}, 200);
		}
	});

	currentTime.subscribe((time: number) => {
		switch ($playbackSource) {
			case 'youtube':
				$adjustedTime = time;
				break;
			case 'floatplane':
				$adjustedTime = time + $preshowOffset;
				break;
		}
	});

	onDestroy(() => {
		if (eventLoop) clearInterval(eventLoop);
	});
</script>

<div class="container">
	<!-- {#if vod.floatplane !== null} -->
	<!-- TODO: Allow people to log in with Floatplane to view VODs with their floatplane offsets -->
	<!-- {:else} -->
	<div class="plyr__video-embed" id="vodplayer">
		<iframe
			src={`https://www.youtube.com/embed/${vod.id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
			allow="autoplay fullscreen transparency"
			title="YouTube"
		/>
	</div>
	<!-- <iframe id="vodplayer" title="YouTube Player" /> -->
	<!-- {/if} -->
</div>
<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />

<style>
	.container {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
	}

	#vodplayer {
		border-radius: 5px;
		/* border: 0; */
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
	}

	.container #vodplayer iframe {
		border-radius: 5px;
		/* border: 0; */
		overflow: hidden;
		width: inherit;
		height: inherit;
		aspect-ratio: 16/9;
	}
</style>
