<script lang="ts">
	import { io } from 'socket.io-client';
	import Header from '$lib/components/Header.svelte';
	import posthog from 'posthog-js';
	import { browser, dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { socket, liveState, nextShow, showTime } from '$lib/stores';
	import { getNextShow } from '$lib/api';
	import { getTimeRemaining } from '$lib/time';
	import WanClock from '$lib/components/WanClock.svelte';
	import { writable } from 'svelte/store';
	import { themes, type Theme, type PartialTheme } from '$lib/types/themes';

	export const load = async () => {
		if (browser) {
			console.log('Starting PostHog');
			posthog.init(env.PUBLIC_POSTHOG_KEY, {
				api_host: 'https://eu.posthog.com',
				autocapture: !dev
			});

			let id = window.ls.get('tdb.sid');

			if(id!== null) {
				posthog.identify(id, {
					usingEncryption: true,
				})
			} else {
				id = posthog.get_distinct_id()
				window.ls.set('tdb.sid', id)
				window.ls.config.encrypt = true;
				window.ls.config.decrypt = true;
				window.ls.config.secret = id
			}
		}
		return;
	};

	// const notificationStore = writable([]);
	//
	// notificationStore.subscribe(value => {
	//   if (value.length > 0) {
	//     const toast = document.querySelector('.snackbar .toast');
	//     toast.style.transform = 'translate(0, 0)';
	//     setTimeout(() => {
	//       toast.style.transform = 'translate(-105%, 0)';
	//     }, 3000);
	//   }
	// });
	//

	let currentPath = '';

	export const themeDetails = writable<PartialTheme>({
		name: 'Loading',
		loadingOpacity: 0,
		loadedOpacity: 1,
		bgPrimary: '60,60,65',
		loaderDisplay: "40vh",
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

					// return () => {
					// 	$socketStore.close();
					// };
				});

				$socket.on('state', (data: string) => {
					let body = JSON.parse(data);
					liveState.set(body);
					// notificationStore.update(value => {
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
				if (v.name !== 'Loading') {
					window.ls.set('theme', v.name);
				}
			});

			loadTheme();

			ival = setInterval(() => {
				loadTheme();
			}, 1000);
		}
	});

	onDestroy(() => {
		if (ival) clearInterval(ival);
	});

	function loadTheme() {
		let theme = window.ls.get('theme');
		if (theme !== null) {
			if (themes[theme]) $themeDetails = themes[theme];
		} else {
			$themeDetails = themes['Night'];
		}
	}
</script>

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
		top:  var(--loader-display);;
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
	/* :root {
		--primary: #3e5399;
		--message-bar: var(--primary);
		--message-bar-urgent: #993e3e;
		--plyr-color-main: var(--primary);
	} */
</style>
