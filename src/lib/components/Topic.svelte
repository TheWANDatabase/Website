<script lang="ts">
	import type { Topic } from '$lib/api';
	import { toHumanTime } from '$lib/time';
	import ChildTopic from './ChildTopic.svelte';
	import IconStopwatchPlayBold from '~icons/solar/stopwatch-play-bold';
	import IconStopwatchPauseBold from '~icons/solar/stopwatch-pause-bold';
	import { currentTime } from '$lib/stores';

	export let topic: Topic;

	console.log(topic.start, topic.end, $currentTime < topic.end && $currentTime > topic.start);
</script>

<div
	class={['topic', $currentTime < topic.end && $currentTime > topic.start ? 'active' : ''].join(
		' '
	)}
>
	<h4>{topic.title}</h4>
	<div>
		<span><IconStopwatchPlayBold />{toHumanTime(topic.start)}</span> |
		<span><IconStopwatchPauseBold />{toHumanTime(topic.end - topic.start)}</span>
	</div>
	{#if topic.children !== undefined}
		<div class="children">
			{#each topic.children as child}
				<ChildTopic topic={child} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.topic {
		margin: 5px;
		border-radius: 5px;
		padding: 5px;
	}

	.topic h4 {
		font-size: large;
	}

	.topic .children {
		display: flex;
		flex-direction: column;
	}

	.active {
		color: black;
		background-color: pink;
		transition: 200ms all ease-in-out;
	}
</style>
