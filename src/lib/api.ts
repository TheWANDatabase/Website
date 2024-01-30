import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';
import type { ApiError, Episode, EpisodeSearchFilters } from './types/api';
const base: string = env.PUBLIC_API_BASE + '/v' + env.PUBLIC_API_VERSION;

const headers: Headers = new Headers();
headers.set('User-Agent', 'The WAN Database ( )');

const baseRequestInit: RequestInit<RequestInitCfProperties> = {
	headers
};


async function query<T>(url: string, config: RequestInit<RequestInitCfProperties> = {}): Promise<T | ApiError> {
	config = Object.apply(config, baseRequestInit as [value: unknown]);

	const response = await fetch(url, config);


	if(response.ok) {
		return await response.json() satisfies T;
	} else {
		return {
			...await response.json(),
			status: response.status,
			statusText: response.statusText,
		} satisfies ApiError
	}
}


export function signIn(email: string, password: string) {
	return fetch(base + '/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers
	});
}

export function signUp(username: string, email: string, password: string) {
	return fetch(base + '/auth/register', {
		method: 'POST',
		body: JSON.stringify({ username, email, password }),
		headers
	});
}

export function signOut() {
	return fetch(base + '/auth/logout');
}

export function getVideos(filter: EpisodeSearchFilters) {
	return fetch(base + '/episodes', {
		method: 'POST',
		body: JSON.stringify(filter)
	});
}

export async function getVideo(id: string): Promise<Episode | ApiError> {
	return query<Episode>(base + '/episodes/' + id);
}

export function getHosts() {
	return fetch(base + '/hosts');
}

export async function getNextShow() {
	const req = await fetch(base + '/live/next', {
		headers: {
			'User-Agent': 'TheWanDatabase' + dev ? ' (Development)' : '(Production)'
		}
	});

	return await req.json();
}

export async function getTheme(id: string): Promise<never> {
	const req = await fetch(base + '/themes/' + id + '/json', {
		headers: {
			'User-Agent': 'TheWanDatabase' + dev ? ' (Development)' : '(Production)'
		}
	});

	return await req.json();
}
