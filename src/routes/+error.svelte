<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';


	interface ButtonHandler {
		text: string;
		// color,
		handler: Function;
	}

	let details = writable({
		...$page,
		state: {
			messageToShow: 'An error occurred',
			descriptorMessage: 'This is usually caused by an issue on our side. Please try again later.',
			buttons: [{
                text: "Go Back",
            }]
		}
	});

	// console.log($details);

	function genericHandlerGoBack(e: HTMLElementEventMap) {
		if (typeof 'window' !== 'undefined') {
			window.history.back();
		}
	}

	function genericHandlerGoHome(e: HTMLElementEventMap) {
		if (typeof 'window' !== 'undefined') {
			window.location.href = '/';
		}
	}
</script>

<div class="error-container">
	<h1>Whoops!</h1>
	<h2>{$details.state.messageToShow}</h2>
	<p>{$details.state.descriptorMessage}</p>

</div>

<style scoped>
	.error-container {
		background-color: var(--background);
		max-width: 1200px;
		min-height: 100vh;
		margin-inline: auto;
		padding-top: 100px;
	}
</style>
