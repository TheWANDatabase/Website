import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { historyCache } from '~/utils/cache';

export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let q = await readBody(event);
        if (historyCache.has(q.id)) {
            return {
                data: historyCache.get(q.id),
                time: new Date() - t
            }
        } else {
            let { data } = await sb.from('episode_progression').select('*').eq('viewer', q.id);

            historyCache.set(q.id, data);
            return {
                data: data,
                time: new Date() - t
            }
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

