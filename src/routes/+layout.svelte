<script lang="ts">
	import { io } from 'socket.io-client';
	import Header from '$lib/components/Header.svelte';
	import posthog from 'posthog-js';
	import { browser, dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { socket, liveState, pageTitle, pageImage } from '$lib/stores';
	import { getTheme } from '$lib/api';
	import WanClock from '$lib/components/WanClock.svelte';
	import { writable } from 'svelte/store';
	import type { PartialTheme } from '$lib/types/themes';
	import type { StateMessage } from '$lib/types/socket/State';
	import { getCookie, setCookie } from '$lib/cookies';

	$pageTitle = "The WAN Database - The Unofficial Archive Project";
	$pageImage = "https://cdn.thewandb.com/assets/WANDB_whiteBackgroundSocial.png"

	export let data: any;

	export const load = async () => {
		if (browser) {
			console.log('Starting PostHog');
			if (env.PUBLIC_POSTHOG_KEY) {
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
			} else {
				console.warn('[PostHog] - Failed to initialise public key');
			}
		}
		return;
	};


	let currentPath = '';

	export const themeDetails = writable<PartialTheme>({
		id: data.theme.id,
		...JSON.parse(data.theme.body)
	});

	let ival: any;

	onMount(() => {
		try {
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

					$socket.on('live', (data: string) => {
						$liveState = JSON.parse(data) satisfies StateMessage;
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
						setCookie('tdb.theme', v.id, 365);
					}
				});

				loadTheme();

				ival = setInterval(() => {
					loadTheme();
				}, 5000);
			}
		} catch (e) {
			console.error(e);
		}
	});

	onDestroy(() => {
		try {
			if (ival) clearInterval(ival);
		} catch (e) {
			console.error(e);
		}
	});

	async function loadTheme() {
		let theme = getCookie('tdb.theme');
		if (theme !== null) {
			if (theme === $themeDetails.id) return;
			let th = (await getTheme(theme)) as any;
			if (th.error !== undefined) {
				console.warn('Cannot find theme - Resetting to default (1)');
				$themeDetails = {
					id: '1',
					...((await getTheme('1')) as any)
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
				...((await getTheme('1')) as any)
			};
		}
	}
</script>
<svelte:head>
	<link rel="canonical" href={$page.url.href}>

	<!-- Primary Meta Tags -->
	<title>{$pageTitle}</title>
	<meta name="title" content={$pageTitle} />
	<meta name="description" content="The WAN Database is an unofficial community archive project for semi-popular internet tech podcast 'The WAN Show'" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:title" content={$pageTitle} />
	<meta property="og:description" content="The WAN Database is an unofficial community archive project for semi-popular internet tech podcast 'The WAN Show'" />
	<meta property="og:image" content={$pageImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={$page.url.href} />
	<meta property="twitter:title" content={$pageTitle} />
	<meta property="twitter:description" content="The WAN Database is an unofficial community archive project for semi-popular internet tech podcast 'The WAN Show'" />
	<meta property="twitter:image" content={$pageImage} />
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
		<!-- <div class="snackbar" bind:this={snackbar}></div> -->
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
	/* .snackbar {
		
	} */
</style>
