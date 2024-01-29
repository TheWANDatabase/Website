// import { getVideo } from "$lib/api";
import { getCookie } from '$lib/cookies';
import type { ServerLoad } from '@sveltejs/kit';
// import {error} from "@sveltejs/kit";

const DEFAULT_THEME = {
	id: 1,
	author: '7dd95843-442d-41d1-8f1d-2e5b45f415fe',
	spec: '0.0.1',
	added: '2024-01-13T20:06:19.691Z',
	modified: '2024-01-13T20:06:19.691Z',
	body: '{ "name":"Night", "loadingOpacity":1, "loadedOpacity":0, "loaderDisplay":"-100vh", "brand":"184,43,32", "primary":"var(--brand)", "secondary":"62,83,153", "bgPrimary":"22,22,26", "bgSecondary":"36,36,50", "bgTertiary":"45,45,55", "bgAccent":"36,36,50", "bgSecondaryAccent":"40,40,55", "textPrimary":"200,200,200", "textAccent":"230,230,230", "messageBar":"var(--primary)", "messageBarUrgent":"153, 62, 62", "plyrColorMain":"rgb(var(--brand))" }',
	title: 'Night',
	official: true
};

export const load = (async ({ request, platform }) => {
	try {
		const cookie = request.headers.get('cookie');
		const themeCookie = getCookie('tdb.theme', cookie ?? '') ?? '1';

		let themeId = parseInt(themeCookie);
		if (!Number.isNaN(themeId) || !Number.isFinite(themeId) || !Number.isSafeInteger(themeId))
			themeId = 1;
		const theme = (await platform?.env.DB.prepare(
			`SELECT * FROM themes WHERE id = ${themeId}`
		).first()) ?? DEFAULT_THEME;

		return { theme };
	} catch (e) {
		console.error(e);
		return { theme: DEFAULT_THEME };
	}
}) satisfies ServerLoad;
