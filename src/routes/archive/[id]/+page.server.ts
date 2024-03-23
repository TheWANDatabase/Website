import { getVideo } from '$lib/api';
import { expireIn } from '$lib/cache';
import type { CachedEntity, Episode } from '$lib/types/api';
import type { ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const id_matcher = /^[A-Z0-9_-]{10,12}$/i;

// Helper method to fetch an episode from the cache or database and then cache the response
// if the cache is available
//
export const load = (async ({ params, platform }) => {
	const queryTime = Date.now();
	console.log(JSON.stringify(platform, null, 2));
	if (!params.id) throw error(404, 'Cannot find video');

	// If the platform variable is not set, we cannot continue without caling
	// we are unable to continue with the request
	if (!platform) throw error(500, 'Missing Platform Data');

	// Check if the video ID is valid for the request
	if (!id_matcher.test(params.id)) throw error(400, 'Invalid video ID');
	console.log(params.id, id_matcher.test(params.id));
	console.log('Request ID is OK');
	const cache = platform.env.WAN_CACHE;

	// Check if the WAN_CACHE environment variable is set
	// If it is, we can cehck the cache for the episode data
	if (!cache) throw error(500, 'Cache is not available');

	const cacheResponse: Episode | null = await platform?.env.WAN_CACHE.get(
		`episode+${params.id}`,
		'json'
	);

	// If the cache response is not null, we can return the cached data
	if (cacheResponse != null) {
		return {
			cached: true,
			data: cacheResponse,
			queryTime: Date.now() - queryTime
		};
	}

	console.log(
		`${platform.env.PUBLIC_API_BASE}/v${platform.env.PUBLIC_API_VERSION}/episodes/${params.id}`
	);

	// The cache is not available, so we will fetch the episode data from the database
	// and then cache the response
	const response = await fetch(
		`${platform.env.PUBLIC_API_BASE}/v${platform.env.PUBLIC_API_VERSION}/episodes/${params.id}`
	);

	const data = (await response.json()) as any;

	await cache.put(`episode+${params.id}`, JSON.stringify(data), {
		expirationTtl: expireIn('01:00:00')
	});
	return {
		cached: false,
		data,
		queryTime: Date.now() - queryTime
	};
}) satisfies ServerLoad;
