import { getVideo } from '$lib/api';
import { expireIn } from '$lib/cache';
import type { CachedEntity, Episode } from '$lib/types/api';
import type { ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, platform }) => {
	const queryTime = Date.now();
	if (!params.id) {
		throw error(404, 'Cannot find video');
	}

	let cachedEntity: CachedEntity<Episode> | null = null;

	if (platform?.env?.WAN_CACHE) {
		const cacheResponse: Episode | null = await platform.env.WAN_CACHE.get(
			`episode+${params.id}`,
			'json'
		);
		if (cacheResponse != null) {
			cachedEntity = {
				cached: true,
				data: cacheResponse,
				queryTime: Date.now() - queryTime
			};
		}
	}

	if (!cachedEntity) {
		const response = await getVideo(params.id);

		if ('message' in response) {
			throw error(response.status, response.message);
		}

		const data: Episode = response;

		if (platform?.env?.WAN_CACHE)
			await platform.env.WAN_CACHE.put(`episode+${params.id}`, JSON.stringify(data), {expirationTtl: expireIn("01:00:00")});

		cachedEntity = {
			cached: false,
			data,
			queryTime: Date.now() - queryTime
		};
	}

	return cachedEntity;
}) satisfies ServerLoad;
