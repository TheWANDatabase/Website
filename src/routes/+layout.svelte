<script lang="ts">
	import { io } from 'socket.io-client';
	import Header from '$lib/components/Header.svelte';
	import { nanoid } from 'nanoid';
	import posthog from 'posthog-js';
	import { browser, dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { socket, liveState } from '$lib/stores';
	import { getTheme } from '$lib/api';
	import WanClock from '$lib/components/WanClock.svelte';
	import { writable } from 'svelte/store';
	import type { PartialTheme } from '$lib/types/themes';
	import type { StateMessage } from '$lib/types/socket/State';

	export const load = async () => {
		if (browser) {
			console.log('Starting PostHog');
			posthog.init(env.PUBLIC_POSTHOG_KEY, {
				api_host: 'https://eu.posthog.com',
				autocapture: !dev
			});

			let id = window.localStorage.getItem('tdb.sid');

			if (id !== null) {
				posthog.identify(id, {
					usingEncryption: true
				});
			} else {
				id = posthog.get_distinct_id();
				window.localStorage.setItem('tdb.sid', id);
			}
		}
		return;
	};

	let snackbar: HTMLDivElement;
	// const notificationStore = writable([]);

	// notificationStore.subscribe((value) => {
	// 	if (value.length > 0) {

	// 	}
	// });

	function toast(message: string, icon?: string) {
		if (!snackbar) return;
		let id = nanoid();
		let div = document.createElement('div');
		div.id = id;
		div.classList.add('toast');
		if (icon !== undefined) {
			div.innerHTML = `
			<img src="${icon}" />	
			<p>${message}</p>
			`;
		} else {
			div.innerHTML = `
			<p>${message}</p>
			`;
		}

		snackbar.prepend(div);

		setTimeout(() => {
			if (typeof 'window' === 'undefined') return;
		}, 5000);
	}

	let currentPath = '';

	export const themeDetails = writable<PartialTheme>({
		id: '0',
		loadingOpacity: 0,
		loadedOpacity: 1,
		bgPrimary: '60,60,65',
		loaderDisplay: '40vh'
	});

	let ival: any;

	onMount(() => {
		if (typeof window !== 'undefined') {
			load();
			if (!$socket) {
				$socket = io('wss://mq.thewandb.com', {
					transports: ['websocket']
				});

				$socket.on('connect', () => {
					console.log('connected');

					$socket.emit('message', JSON.stringify({ type: 2, payload: 'bingo' }));
					$socket.emit('message', JSON.stringify({ type: 2, payload: 'live' }));

					return () => {
						$socket.close();
					};
				});

				$socket.on('state', (data: string) => {
					$liveState = JSON.parse(data) satisfies StateMessage;
					toast($liveState.title);
					// $liveState.update(value => {
					//   value.push(data);
					//   return value;
					// });
				});
			}

			page.subscribe(($page) => {
				if (currentPath && currentPath !== $page.url.pathname) {
					posthog.capture('$pageleave');
				}

				posthog.capture('$pageview', {
					url: $page.url.pathname
				});
			});

			const handleBeforeUnload = () => {
				posthog.capture('$pageleave', {
					url: $page.url.pathname
				});
			};

			window.addEventListener('beforeunload', handleBeforeUnload);

			themeDetails.subscribe((v) => {
				if (v.id !== '0') {
					window.localStorage.setItem('tdb.theme', v.id);
				}
			});

			loadTheme();

			ival = setInterval(() => {
				loadTheme();
			}, 5000);
		}
	});

	onDestroy(() => {
		if (ival) clearInterval(ival);
	});

	async function loadTheme() {
		let theme = window.localStorage.getItem('tdb.theme');
		if (theme !== null) {
			if (theme === $themeDetails.id) return;
			let th = await getTheme(theme);
			if (th.error !== undefined) {
				console.warn('Cannot find theme - Resetting to default (1)');
				$themeDetails = {
					id: '1',
					...(await getTheme('1'))
				};
			} else {
				$themeDetails = {
					id: theme,
					...th
				};
			}
		} else {
			$themeDetails = {
				id: '1',
				...(await getTheme('1'))
			};
		}
	}
</script>

<svelte:head>
	<link
		rel="icon"
		type="image/png"
		href="https://cdn.thewandb.com/assets/WANDB_logo_withOutline.png"
	/>
</svelte:head>

<div
	class="container"
	style={Object.entries($themeDetails)
		.map(([k, v]) => `--${k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${v}`)
		.join(';')}
>
	<div class="flashBlock">
		<Header />
		<slot />
		<WanClock />
		<div class="snackbar" bind:this={snackbar}></div>
	</div>
	<div class="loader">
		<span>Loading...</span>
		<span>Please Wait</span>
	</div>
</div>

<!--<div class="snackbar">-->
<!--  {#each $notificationStore as notification, index}-->
<!--    <div class="toast">-->
<!--      <h1>{notification.type}</h1>-->
<!--      <p>{notification.payload}</p>-->
<!--    </div>-->
<!--  {/each}-->
<!--</div>-->
<style>
	.container {
		background-color: rgb(var(--bg-primary));
		color: rgb(var(--text-primary));
		min-width: 100vw;
		min-height: 100vh;
		transition: all 200ms ease-in-out;
	}

	.flashBlock {
		opacity: var(--loading-opacity);
		transition: all 200ms ease-in-out;
	}

	.loader {
		opacity: var(--loaded-opacity);
		transition: all 200ms ease-in-out;
		color: white;
		font-weight: bold;
		position: absolute;
		top: var(--loader-display);
		bottom: auto;
		left: auto;
		right: auto;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		text-align: center;
	}

	.loader span {
		width: 100vw;
		margin: auto;
		font-size: xx-large;
	}
	.snackbar {
		
	}
</style>
