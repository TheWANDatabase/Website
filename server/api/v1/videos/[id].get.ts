import { serverSupabaseClient } from '#supabase/server'
import { videoCache } from '~/utils/cache'

/**
 * Method | GET
 * PATH   | /api/v1/videos/:id
 * Purpose| Fetch video, cast, and topic details for a specific video
 * Usages | Used to keep the UI requests to a minimum, caches cast, topic,
 *        | transcript, and video information for use by the frontend to minimise
 *        | strain on supabase server (and minimise bandwidth costs)
 */

// TODO: Bring this endpoint into compliance with StandardResponse interface
export default defineEventHandler(async (event) => {
  const sb = await serverSupabaseClient(event)
  const id = getRouterParam(event, 'id')
  if (id) {
    if (videoCache.has(id)) {
      return videoCache.get(id)
    } else {
      const episode: any = (
        await sb.from('episodes')
          .select('*')
          .eq('id', id).single()
      ).data

      if (episode) {
        const cast = (
          await sb.from('cast')
            .select('id')
            .in('id', episode.cast)
        ).data

        const topics = (
          await sb.from('topics')
            .select('id')
            .eq('episode', episode.id)
            .eq('accepted', true)
        ).data

        episode.thumbnail = 'https://cdn.thewandb.com/thumbs/' + episode.id + '.jpeg'
        episode.title = episode.title.split('- WAN Show')[0]
        videoCache.set(id, {
          episode,
          cast,
          topics
        })

        return {
          episode,
          cast,
          topics
        }
      } else {
        return {
          error: 'Unable to locate episode matching id: ' + id
        }
      }
    }
  }

  return {
    error: 'undefined'
  }
})
