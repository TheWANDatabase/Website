import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { episodeCache } from '~/utils/cache';


export default defineEventHandler(async (event) => {
    let t = new Date();
    let sb = await serverSupabaseClient(event);

    try {
        let { filters, limit, offset } = await readBody(event);
        let batch = `${JSON.stringify(filters)}-${limit}-${offset}`;



        if (episodeCache.has(batch)) {
            return {
                data: episodeCache.get(batch),
                time: new Date() - t
            }
        } else {
            let query = sb.from('episodes')
                .select('*')
                .not('aired', 'is', 'null')
                .range(offset, offset + 19)

            if (filters.startDate) query.gte('aired', filters.startDate)
            if (filters.endDate) query.lte('aired', filters.endDate)

            switch (filters.order) {
                case 'release':
                    query.order('aired', { ascending: true });
                    break;
                case 'release-desc':
                    query.order('aired', { ascending: false });
                    break;
                case 'title':
                    query.order('title', { ascending: true });
                    break;
                case 'title-desc':
                    query.order('title', { ascending: false });
                    break;
                case 'topics':
                    query.order('topic_count', { ascending: true });
                    break;
                case 'topics-desc':
                    query.order('topic_count', { ascending: false });
                    break;
                case 'duration':
                    query.order('duration', { ascending: true });
                    break;
                case 'duration-desc':
                    query.order('duration', { ascending: false });
                    break;
            }

            if (filters.members.length > 0) {
                query.filter('cast', 'ov', `{"${filters.members.join('","')}"}`);
            }

            let feed = (await query).data;
            episodeCache.set(batch, feed);
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