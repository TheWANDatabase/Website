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
	class={['topic', $currentTime > topic.start ? 'active' : ''].join(
		' '
	)}
>
	<p class="timestamp">
		{#if dev}
			{toHumanTime(topic.start)}<br />{topic.kind}
		{:else}
			{toHumanTime(topic.start)}
		{/if}
	</p>
	<p class="contents">{topic.title}</p>
	<div class="progressRunner" />
	<div
		class="progress"
		style={`height: ${$currentTime > topic.end ? '100%' : calcPercentage(topic.start, topic.end, $currentTime)};`}
	></div>
</div>

<style>
	.topic {
		margin: 0 0 0 -11px;
		/* margin: 0 0 0 -6px; */
		border-radius: 0 5px 5px 0;
		padding: 0 5px;
		transition: 200ms all ease-in-out;
		display: grid;
		grid-template-columns: 0px 10px auto auto;
		grid-template-areas: 'progress x timestamp text';
		width: 100%;
	}

	.topic .timestamp {
		grid-area: timestamp;
		width: max-content !important;
		padding-inline: 5px;
		margin-right: 10px;
		font-family: monospace, monospace;
	}

	.contents {
		grid-area: text;
		font-size: medium;
		text-align: left;
		width: 100%;
		margin: 5px 0;
		word-wrap: wrap;
		overflow: scroll;
	}

	.progress {
		opacity: 0;
		grid-area: progress;
		margin-left: -4px;
		border: none;
		border-radius: 0;/*5px;*/ /*0 4px 4px 0;*/
		height: 0px;
		transition: 200ms;
	}

	.progressRunner {
		opacity: 0;
		grid-area: progress;
		margin-left: -4px;
		border: none;
		border-radius: 0;/*5px;*/ /*0 4px 4px 0;*/
		height: 0%;
		transition: 200ms;
	}

	.active .progressRunner {
		opacity: 1;
		width: 5px;
		height: 100%;
		/* background: rgba(var(--secondary), 1); */
		background: green;
		transition: 200ms;
	}

	.active .progress {
		opacity: 1;
		width: 5px;
		min-height: 1%;
		background: pink;
		/* background: rgb(var(--secondary)); */
		transition: 200ms;
	}
</style>
