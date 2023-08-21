import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { castCache } from '~/utils/cache';

export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let { filters, limit, offset } = await readBody(event);
        let batch = `${JSON.stringify(filters)}-${limit}-${offset}`;



        if (videoCache.has(batch)) {
            return {
                data: videoCache.get(batch),
                time: new Date() - t
            }
        } else {
            sb.from('cast').select('id, name, outlet').order('id')
            castCache.set('cast', feed);
            return {
                data: feed,
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