import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

console.log(env);

const base: string = env.PUBLIC_API_BASE + '/v' + env.PUBLIC_API_VERSION;

const headers: Headers = new Headers();
headers.set('User-Agent', 'The WAN Database ( )');

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

export function getVideos() {
	return fetch(base + '/episodes', {
		method: 'POST',
		body: JSON.stringify({
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
		})
	});
}

export function getVideo(id: string) {
	return fetch(base + '/episodes/'+id);
}

export function getHosts() {
	return fetch(base + '/hosts');
}


export async function getNextShow() {
	const req = await fetch(base + '/live/next', {
		headers: {
			"User-Agent": "TheWanDatabase" + dev ? " (Development)" : "(Production)"
		}
	});
	
	return await req.json()
}