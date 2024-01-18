<script lang="ts">
	import type { Topic } from '$lib/api';
	import { toHumanTime } from '$lib/time';
	import ChildTopic from './ChildTopic.svelte';
	import IconStopwatchPlayBold from '~icons/solar/stopwatch-play-bold';
	import IconStopwatchPauseBold from '~icons/solar/stopwatch-pause-bold';
	import { currentTime } from '$lib/stores';

	export let topic: Topic;
	export let dev: boolean = false;

	console.log(topic.start, topic.end, $currentTime < topic.end && $currentTime > topic.start);
</script>

<div
	class={['topic', $currentTime < topic.end && $currentTime > topic.start ? 'active' : ''].join(
		' '
	)}
>
	<p class="timestamp">
		{#if dev}
			{toHumanTime(topic.start)} <sup>({toHumanTime(topic.end - topic.start)})</sup> - {topic.kind}
		{:else}
			{toHumanTime(topic.start)} <sup>({toHumanTime(topic.end - topic.start)})</sup>
		{/if}
	</p>
	<p>{topic.title}</p>
	{#if topic.children !== undefined}
		<div class="children">
			{#each topic.children as child}
				<ChildTopic topic={child} bind:dev={dev} />
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

	.active {
		box-shadow: -5px 0px 0px rgba(var(--primary), 0.5);
		transition: 200ms all ease-in-out;
	}

	.topic .timestamp {
		font-weight: bold;
	}

	.topic p {
		font-size: large;
	}

	.topic .children {
		margin-top: 5px;
		display: flex;
		flex-direction: column;
	}
</style>
