// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			v: 1,
			env: {
				// Wrangler env variables
				DB: D1Database;
				WAN_CACHE: KVNamespace;
				// EDITOR: DurableObject,

				// CF Pages env variables
				CF_PAGES: number;
				CF_PAGES_URL: string;
				CF_PAGES_BRANCH: string;
				CF_PAGES_COMMIT_SHA: string;
			};
		}
	}
}

export {};
