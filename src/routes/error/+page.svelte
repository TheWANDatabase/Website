<script lang="ts">
	import { page } from '$app/stores';
	import { images } from '$lib/error';
	import { writable } from 'svelte/store';

	let details = writable({
		...$page,
		state: {
			messageToShow: 'An error occurred',
			descriptorMessage: 'This is usually caused by an issue on our side. Please try again later.',
			buttons: [
				{
					text: 'Go Back',
					click: genericHandlerGoBack
				},
				{
					text: 'Go Home',
					click: genericHandlerGoHome
				}
			]
		}
	});

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
</script>

<div class="error-container">
	<h1>Whoops!</h1>
	<h2>{$details.state.messageToShow}</h2>
	<p>{$details.state.descriptorMessage}</p>

	<h3>Secret Tunnel!</h3>
	<p class="descriptor">
		Congratulations, you've found a secret page. Below is a list of all the possible images that can
		be displayed on our error page. Run into a problem? We've got you covered with a meme in these
		trying times.
	</p>
	<div class="funnies-list">
		{#each images as image}
			<a
				class="laugh-box"
				href={`/archive/${image.uri.split('https://i.ytimg.com/vi/')[1].split('/')[0]}`}
			>
				<img src={image.uri} alt={`Thumbnail from the video ${image.credit}`} />
				<sup>Thumbnail from the episode "{image.credit}"</sup>
			</a>
		{/each}
	</div>

	{#each $details.state.buttons as button}
		<button on:click={(e) => button.click(e)}>{button.text}</button>
	{/each}
</div>

<style scoped>
	.error-container {
		background-color: rgb(var(--bg-primary));
		color: rgb(var(--text-primary));
		max-width: 1100px;
		min-height: 100vh;
		margin-inline: auto;
		padding-top: 100px;
	}

	/* .error-container h1,
	.error-container h2, */
	.error-container h3 {
		margin-top: 20px;
		max-width: 700px;
		margin-inline: auto;
	}

	.error-container .descriptor {
		margin-bottom: 20px;
		max-width: 700px;
		margin-inline: auto;
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

	.funnies-list {
		display: flex;
		flex-wrap: wrap;
	}

	.laugh-box {
		width: 500px;
		overflow: hidden;
		margin: 0.5rem auto;
		display: flex;
		flex-direction: column;
		color: rgb(var(--text-primary));
		background-color: rgb(var(--bg-primary));
		text-decoration: none;
	}

	.laugh-box img {
		width: inherit;
		height: auto;
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
