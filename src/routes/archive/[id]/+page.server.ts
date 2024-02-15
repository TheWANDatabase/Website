import { getVideo } from '$lib/api';
import { expireIn } from '$lib/cache';
import type { CachedEntity, Episode } from '$lib/types/api';
import type { ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const id_matcher = /[A-Z0-9_-]{10,12}/i

export const load = (async ({ params, platform }) => {
	const queryTime = Date.now();
	if (!params.id) {
		throw error(404, 'Cannot find video');
	}

	let cachedEntity: CachedEntity<Episode> | null = null;

	if(!id_matcher.test(params.id)) {
		console.log("Request is illegal")
		// throw
	} else {
		console.log("Request is OK")
		const episode =  (await platform?.env.DB.prepare(`SELECT * FROM episodes WHERE id = '${params.id}'`).first());
		const raw_topics =  (await platform?.env.DB.prepare(`SELECT * FROM topics WHERE episode = '${params.id}' ORDER BY start ASC`).all())?.results;
		const products = []; //TODO: Implement products in D1
		const cast = []; //TODO: Implement cast credits in D1

		console.log(episode, raw_topics, products, cast)

		const topics = [];

		// for(const topic of raw_topics ?? []) {
		// 	if(topic.depth === 0) {
		// 		topics.push(topic);
		// 	} else {
		// 		if(!topics[topics.length-1].children) topics[topics.length-1].children = [];
		// 		topics[topics.length-1].children.push(topic);
		// 	}
		// }
	}


	// if (platform?.env.WAN_CACHE) {
	// 	const cacheResponse: Episode | null = await platform?.env.WAN_CACHE.get(
	// 		`episode+${params.id}`,
	// 		'json'
	// 	);
	// 	if (cacheResponse != null) {
	// 		cachedEntity = {
	// 			cached: true,
	// 			data: cacheResponse,
	// 			queryTime: Date.now() - queryTime
	// 		};
	// 	}
	// }

	if (!cachedEntity) {
		const response = await getVideo(params.id);

		if ('message' in response) {
			throw error(response.status, response.message);
		}

		const data: Episode = response;

		if (platform?.env.WAN_CACHE)
			await platform.env.WAN_CACHE.put(`episode+${params.id}`, JSON.stringify(data), {expirationTtl: expireIn("01:00:00")});

		cachedEntity = {
			cached: false,
			data,
			queryTime: Date.now() - queryTime
		};
	}

	return cachedEntity;
}) satisfies ServerLoad;
