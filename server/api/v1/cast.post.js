import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { castCache } from '~/utils/cache';

export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {

        if (castCache.has('cast')) {
            return {
                data: castCache.get('cast'),
                time: new Date() - t
            }
        } else {
            let feed = (await sb.from('cast').select('id, name, outlet').order('id')).data
            castCache.set('cast', feed);
            return {
                data: feed,
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