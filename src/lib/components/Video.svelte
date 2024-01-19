<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { toHumanTime } from '$lib/time';
	import { writable } from 'svelte/store';

	export let vod: any;
	let showTooltip = writable(false);

	function trimText(value: string, length = 30): string {
		if (value.length <= length) return value;

		let words = value.split(' ');
		let count = 0;
		let final = '';
		for (const word of words) {
			for (const letter of word) {
				if (count === length) break;
				final += letter;
				count += 1;
			}
			if (count === length) break;
			final += ' ';
			count += 1;
		}

		return final + '...';
	}
</script>

{#if vod !== null}
	<a class="video-container" href={`/archive/` + vod.id}>
		<Image id={vod.thumbnail} width="100%" height="230px" design="thumbnail" />
		<p on:mouseover={() => ($showTooltip = true)} on:mouseout={() => ($showTooltip = false)}>
			{trimText(vod.title)}
		</p>
		<span style={`opacity: ${$showTooltip ? 1 : 0}`}><p>{vod.title}</p></span>
		<div class="horizontal-container">
			<p>Aired: {new Date(vod.aired).toLocaleDateString()}</p>
			<p>{toHumanTime(vod.duration)}</p>
		</div>
	</a>
{/if}

<style>
	.video-container {
		display: grid;
		grid-template-rows: 230px 30px 40px;
		width: 100%;
		height: 300px;
		/* border: 1px solid black; */
		background-color: rgba(var(--bg-secondary), 0.5);
		border-radius: 5px;
		padding: -2px;
		color: inherit;
		text-decoration: none;
        position: relative;
		animation: 1000ms fadeIn ease-in-out;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0%;
		}
		100% {
			opacity: 100%;
		}
	}

	.horizontal-container {
		margin: 10px 5px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.video-container > p {
		text-align: center;
		width: auto;
		overflow: hidden;
		height: fit-content;
		margin: 0 10px;
		font-weight: 700;
		font-size: 18pt;
	}

    .video-container > span {
        position: absolute;
        width: 100%;
        top: 190px;
        z-index: 3;
        transition: 200ms;
    }

    .video-container > span > p {
        pointer-events: none;
        background: rgb(var(--bg-secondary));
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
        width: fit-content;
        margin: auto;
    }
</style>
