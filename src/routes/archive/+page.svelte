<script lang="ts">
	import { writable } from 'svelte/store';
	import { getVideos } from '$lib/api';
	import Video from '$lib/components/Video.svelte';
	import type { EpisodeSearchFilters } from '$lib/types/api';
	import { onMount } from 'svelte';

	let vods = writable([]);

	let filters = writable<EpisodeSearchFilters>({
		filters: {
			order: { id: 'release-desc', label: 'Stream Date (Descending)' },
			hideCW: false,
			hideCorrupt: false,
			startDate: '2012-08-27T23:00:00.000Z',
			endDate: new Date().toISOString(),
			members: []
		},
		offset: 0,
		limit: 20,
		flags: { include: ['cast_ids', 'topic_count'] }
	});

	async function load() {
		let req = await getVideos($filters);

		if (req.ok) {
			let videos = await req.json();
			if (videos.error) return console.log('Failed to load episodes from API:', videos.error);
			vods.update((v) => {
				return v.concat(videos);
			});
		}
	}

	onMount(() => {
		if (typeof 'window' === 'undefined') return;
		if (window.localStorage) {
            let storedFilters = window.localStorage.getItem('tdb.sf');
            if(storedFilters) {
                $filters = JSON.parse(storedFilters) satisfies EpisodeSearchFilters;
            }
		}
        
        load();
		
        filters.subscribe((v) => {
			if (typeof 'window' === 'undefined') return;
			if (window.localStorage) {
				window.localStorage.setItem('tdb.sf', JSON.stringify(v));
			}
		});
	});
</script>

<div class="container">
	<h1>Welcome to The Archive</h1>
	<div class="vod-container">
		{#each $vods as vod}
			<Video bind:vod />
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 0;
		margin: 5px;
		padding-top: 75px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.vod-container {
		margin: 1rem 0 3rem;
		width: 100%;
		justify-content: center;
		display: grid;
		grid-template-columns: repeat(auto-fit, 462px);
		grid-gap: 20px;
	}
</style>
