<script lang="ts">
	import type { Topic } from '$lib/api';
	import { toHumanTime } from '$lib/time';
	import IconStopwatchPlayBold from '~icons/solar/stopwatch-play-bold';
	import IconStopwatchPauseBold from '~icons/solar/stopwatch-pause-bold';
	import { currentTime } from '$lib/stores';

	export let topic: Topic;
	export let dev: boolean = false;

	function calcPercentage(start: number, end: number, position: number): string {
		let diff = end - start;
		let finalPosition = position - start;
		let percentage = (finalPosition / diff) * 100;

		return percentage.toFixed(1) + '%';
	}

</script>

<div
	class={['topic', $currentTime < topic.end && $currentTime > topic.start ? 'active' : ''].join(
		' '
	)}
>
	<p class="timestamp">
		{#if dev}
		{toHumanTime(topic.start)}<br>{topic.kind}
	{:else}
		{toHumanTime(topic.start)}
	{/if}
	</p>
	<p class="contents">{topic.title}</p>
	<div class="progress" style={`width: ${calcPercentage(topic.start, topic.end, $currentTime)};`}></div>
</div>

<style>
	.topic {
		margin: 0 0 0 -5px;
		border-radius: 0 5px 5px 0;
		padding: 5px;
		transition: 200ms all ease-in-out;
		display: grid;
		grid-template-columns: auto 100%;
		grid-template-areas: 
			"timestamp text"
			"unknown progress";
		width: 100%;
	}

	.active { 
		margin: 0 0 0 -5px;
		box-shadow: -5px 0px 0px rgb(var(--secondary));
		transition: 200ms all ease-in-out;
	}

	.topic .timestamp {
		width: max-content !important;
		padding-inline: 5px;
		margin-right: 10px;
		font-family: monospace, monospace;
	}

	.contents {
		font-size: medium;
		text-align: left;
		width: 100%;
	}

	.progress {
		grid-area: progress;
		margin-left: -4px;
		border: none;
		border-radius: 5px;
		height: 0px;
		transition: 200ms;
	}

	.active .progress {
		height: 5px;
		background: rgb(var(--secondary));
		transition: 200ms;
	}


</style>
