import { serverSupabaseClient } from '#supabase/server'
import NodeCache from "node-cache";
const videoCache = new NodeCache({
    stdTTL: 300
});

export default defineEventHandler(async (event) => {
    let sb = await serverSupabaseClient(event);
    let id = getRouterParam(event, 'id');
    if (id) {
        if (videoCache.has(id)) {
            return videoCache.get(id);
        } else {
            let episode = (await sb.from('episodes').select('*').eq('id', id).single()).data;
            let cast = (await sb.from('cast').select('id').in('id', episode.cast)).data;
            let topics = (await sb.from('topics').select('id').eq('episode', episode.id)).data;
            episode.thumbnail = (await sb.storage.from('thumbs').getPublicUrl(episode.id + '.jpeg')).data.publicUrl
            episode.title = episode.title.split('- WAN Show')[0];
            videoCache.set(id, {
                episode,
                cast,
                topics
            });
            
            return {
                episode,
                cast,
                topics
            }
        }
    }

    return {
        error: 'undefined'
    }
})