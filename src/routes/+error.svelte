<script lang="ts">
	import { page } from '$app/stores';
	import { images } from '$lib/error';
	import { pageTitle } from '$lib/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let details = writable<any>({ ...$page });
	let pge = $page;

	function genericHandlerGoBack(e: MouseEvent) {
		if (typeof 'window' !== 'undefined') {
			window.history.back();
		}
	}

	function genericHandlerGoHome(e: MouseEvent) {
		if (typeof 'window' !== 'undefined') {
			window.location.href = '/';
		}
	}

	onMount(() => {
		if (typeof window === 'undefined') return;
		$details = {
			...pge,
			state: {
				messageToShow: 'An error occurred',
				descriptorMessage:
					'This is usually caused by an issue on our side. Please try again later.',
				buttons: [
					{
						text: 'Go Back',
						click: genericHandlerGoBack
					},
					{
						text: 'Go Home',
						click: genericHandlerGoHome
					}
				],
				image: images[Math.floor(Math.random() * images.length)]
			}
    };
    //console.log($details); 
	});

  $pageTitle = `Whoops | The WAN Database`;
  let descriptorExpanded = writable(false);
  let descriptorBox: HTMLPreElement;

  onMount(() => {
    if (typeof window === 'undefined') return;
    if(descriptorBox){
      descriptorBox.addEventListener('click', () => {
        console.log('click');
        descriptorExpanded.update((v) => !v);
      });
      }
  });
</script>

{#if $details.state}
	<div class="error-container">
		<h1>Whoops!</h1>
		<h2>{$details.state.messageToShow}</h2>
		<p>{$details.state.descriptorMessage}</p>
    <pre bind:this={descriptorBox}><code>{JSON.stringify($details, null, 2)}</code></pre>
		<a
        class="laugh-box"
        target="_blank"
			href={`/archive/${
				$details.state.image.uri.split('https://i.ytimg.com/vi/')[1].split('/')[0]
			}`}
		>
			<img
				src={$details.state.image.uri}
				alt={`Thumbnail from the video ${$details.state.image.credit}`}
			/>
			<sup>Thumbnail from the episode "{$details.state.image.credit}" | Click to view episode.</sup>
		</a>

		{#each $details.state.buttons as button}
			<button on:click={(e) => button.click(e)}>{button.text}</button>
		{/each}
	</div>
{:else}
	<div class="error-container">
		<h1>Whoops!</h1>
		<h2>Someone let the hamsters out!</h2>
		<p>Please hold on whilst we figure out what happened</p>
	</div>
{/if}

<style scoped>
	.error-container {
		background-color: rgb(var(--bg-primary));
		color: rgb(var(--text-primary));
		max-width: 1000px;
		min-height: 100vh;
		margin-inline: auto;
		padding-top: 100px;
	}

	.error-container button {
		padding: 5px 10px;
		margin: 0.5rem;
		border: none;
		border-radius: 5px;
		color: rgb(var(--text-primary));
		background-color: rgb(var(--bg-secondary));
		transition: 200ms;
	}

	.error-container button:hover {
		background-color: rgb(var(--brand));
		transition: 200ms;
	}

	.laugh-box {
		width: 1000px;
		overflow: hidden;
		margin: 0.5rem auto;
		display: flex;
		flex-direction: column;
		color: rgb(var(--text-primary));
		background-color: rgb(var(--bg-primary));
		text-decoration: none;
	}

	.laugh-box img {
		width: 1000px;
		height: 560px;
		border-radius: 5px;
		overflow: hidden;
		/* transition: 200ms; */
	}

	/* .laugh-box img:hover {
		width: 1100px;
		margin-left: -50px;
		margin-top: -30px;
		height: 619px;
		transition: 200ms;
	} */

	.laugh-box sup {
		margin-left: 0.5rem;
	}
</style>
