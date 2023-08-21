import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { profileCache } from '~/utils/cache';


export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let q = await readBody(event);
        if (profileCache.has(q.id)) {
            return {
                data: profileCache.get(q.id),
                time: new Date() - t
            }
        } else {
            let { data } = await sb.from('profiles').select('*').eq('id', q.id).single();

            profileCache.set(q.id, data);
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

