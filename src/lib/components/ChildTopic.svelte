<script lang="ts">
	import type { Topic } from '$lib/api';
	import { toHumanTime } from '$lib/time';
	import IconStopwatchPlayBold from '~icons/solar/stopwatch-play-bold';
	import IconStopwatchPauseBold from '~icons/solar/stopwatch-pause-bold';
	import { currentTime } from '$lib/stores';

	export let topic: Topic;
</script>

<div
	class={['topic', $currentTime < topic.end && $currentTime > topic.start ? 'active' : ''].join(
		' '
	)}
>
	<h4>{topic.title}</h4>
	<span><IconStopwatchPlayBold />{toHumanTime(topic.start)}</span> |
	<span><IconStopwatchPauseBold />{toHumanTime(topic.end - topic.start)}</span>
</div>

<style>
	.topic {
		margin: 5px;
		border-radius: 5px;
		padding: 5px;
		transition: 200ms all ease-in-out;
	}

	.topic h4 {
		font-size: medium;
	}

	.topic .children {
		display: flex;
		flex-direction: column;
	}

	.active {
		color: white;
		background-color: green;
		transition: 200ms all ease-in-out;
	}
</style>
