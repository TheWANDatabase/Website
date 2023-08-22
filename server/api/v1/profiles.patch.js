import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { profileCache } from '~/utils/cache';


/**
 * Method | PATCH
 * PATH   | /api/v1/profiles
 * Purpose| Reload all cached information regarding a profile
 * Usages | Fetched when a user changes their profile settings, to prevent
 *        | stale data being served by the cache (just in case this is important)
 */

export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let q = await readBody(event);

        let { data } = await sb.from('profiles').select('*').eq('id', q.id).single();

        profileCache.set(q.id, data);
        return {
            data: data,
            time: new Date() - t
        }
    } catch (e) {
        return {
            error: e,
            time: new Date() - t
        }
    }

    return {
        error: 'undefined',
        time: new Date() - t
    }
})

