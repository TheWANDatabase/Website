<script lang="ts">
	import { io } from 'socket.io-client';
	import Header from '$lib/components/Header.svelte';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { socket, liveState, nextShow } from '$lib/stores';
	import { getNextShow } from '$lib/api';
	// export const //flags = writable({});

	export const load = async () => {
		if (browser) {
			posthog.init(env.PUBLIC_POSTHOG_KEY, {
				api_host: 'https://eu.posthog.com',
				autocapture: true
			});
		}
		return;
	};

	load();

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

	

	onMount(() => {
		if (typeof window !== 'undefined') {
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

			const unsubscribePage = page.subscribe(($page) => {
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

			return () => {
				unsubscribePage();
				window.removeEventListener('beforeunload', handleBeforeUnload);
			};
		}
	});
</script>

<div class="container">
	<Header />
	<slot />
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
	:root {
		--message-bar: #3e5399;
		--message-bar-urgent: #993e3e;
	}
</style>
