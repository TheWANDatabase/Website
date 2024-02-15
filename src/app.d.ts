// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
          env: {
			DB: D1Database;
			WAN_CACHE: KVNamespace;
            EDITOR: DurableObjectNamespace;
          };
          context: {
            waitUntil(promise: Promise<never>): void;
          };
          caches: CacheStorage & { default: Cache }
        }
    }
}

export {};


// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// declare global {
// 	namespace App {
// 		interface Error {}
// 		interface Locals {}
// 		interface PageData {}
		
// 		interface Platform {
// 			env: {
// 				// Wrangler env variables
// 				DB: D1Database;
// 				WAN_CACHE: KVNamespace;
// 				ARCHIVE: Hyperdrive
// 				// EDITOR: DurableObject,

// 				// CF Pages env variables
// 				CF_PAGES: number;
// 				CF_PAGES_URL: string;
// 				CF_PAGES_BRANCH: string;
// 				CF_PAGES_COMMIT_SHA: string;
// 			},
// 			context: {
// 				waitUntil(promise:Promise<any>): void;
// 			},
// 			caches: CacheStorage & { default: Cache }
// 		}
// 	}
// }
// 
// export {};
