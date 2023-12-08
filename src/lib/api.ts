import { env } from '$env/dynamic/public';

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
