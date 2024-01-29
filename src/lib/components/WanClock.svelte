<script lang="ts">
	import { getNextShow } from '$lib/api';
	import { liveState, nextShow, showTime } from '$lib/stores';
	import { getTimeRemaining } from '$lib/time';
	import posthog from 'posthog-js';
	import { onMount, onDestroy } from 'svelte';

	let canShow = posthog.getFeatureFlag('experiments-wan-countdown-clock') === true;
	let ticker: NodeJS.Timeout;

	onMount(() => {
		if (typeof window !== 'undefined') {
			if (!$nextShow) {
				getNextShow().then((d: string) => {
					$nextShow = new Date(d);
				});
			}

			ticker = setInterval(() => {
				if ($nextShow === null) return;
				$showTime = getTimeRemaining($nextShow);
			}, 500);
		}
	});

	onDestroy(() => {
		if (ticker !== undefined) clearInterval(ticker);
	});
</script>

<div class="container">
	{#if canShow}
		<div class="clock">
			{#if $liveState !== null && $showTime !== null}
				{#if $liveState.imminence !== 4}
					<span class="textCell">
						The WAN Show is
						{#if $liveState === null || $liveState.imminence !== 4}
							next expected
						{/if}
					</span>
					<div class="numberCells">
						<span>
							{$showTime.days}
							<span class="numberUnit"> D </span>
						</span>
						<span>
							{$showTime.hours}
							<span class="numberUnit"> H </span>
						</span>
						<span>
							{$showTime.minutes}
							<span class="numberUnit"> M </span>
						</span>
						<span>
							{$showTime.seconds}
							<span class="numberUnit"> S </span>
						</span>
					</div>
					<span class="textCell rightAlign">
						{#if $showTime.total < 0}
							Ago
						{:else}
							From Now
						{/if}
					</span>
				{:else}
					<span class="textCell"> The WAN Show is currently </span>
					<div class="spanCells">
						<span> LIVE </span>
					</div>
					<span class="textCell"> &nbsp; </span>
				{/if}
			{:else}
				<span class="textCell"> &nbsp; </span>
				<div class="spanCells">
					<span> LOADING </span>
				</div>
				<span class="textCell"> &nbsp; </span>
			{/if}

			<span class="textCell" style="color:grey;">
				Provided by
				<a href="https://whenplane.com/" target="_blank"> Whenplane </a>
			</span>
		</div>
	{/if}
</div>

<style>
	.container {
		position: sticky;
		z-index: 100;
		top: calc(100vh, -90px);
		padding: 5px;
		left: 5px;
		bottom: 0px;
	}

	.clock {
		color: white;
		width: fit-content;
		max-width: 250px;
		background-color: black;
		border-radius: 5px;
		height: 100px;
		display: flex;
		flex-direction: column;
		padding: 5px;
	}

	.spanCells {
		display: flex;
		align-items: center;
		width: inherit;
	}

	.spanCells span {
		color: red;
		text-align: center;
		width: inherit;
		font-size: x-large;
	}

	.numberCells {
		display: grid;
		grid-template-columns: auto auto auto auto;
	}

	.numberCells span {
		color: gold;
		text-align: center;
		font-size: x-large;
	}

	.textCell {
		font-size: small;
	}

	.rightAlign {
		text-align: right;
	}

	.textCell a {
		/* text-decoration: none; */
		color: inherit;
	}
</style>
