import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { searchCache } from '~/utils/cache';


export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let q = await readBody(event);
        if (searchCache.has(q.phrase)) {
            return {
                data: searchCache.get(q.phrase),
                time: new Date() - t
            }
        } else {
            let s = (await sb.rpc('search', q)).data;
            searchCache.set(q.phrase, s);
            return {
                data: s,
                time: new Date() - t
            }
        }
    } catch (e) {
        console.log(e);
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