import { serverSupabaseClient } from '#supabase/server'
import { castCache, profileCache, videoCache, searchCache, episodeCache, historyCache, bannerCache } from '~/utils/cache'

/**
 * Method | GET
 * PATH   | /api/v1/stats
 * Purpose| Fetch the currently active banner notices
 * Usages | Fetches a list of all active banner notices for rendering
 *        | on the client machine
 */

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  if (bannerCache.has('2')) {
    return {
      data: bannerCache.get('2'),
      time: new Date().getTime() - t.getTime()
    }
  } else {
    const d = {
      episodes: (await sb.from('episodes').select('*', { count: 'exact', head: true })).count,
      cast: (await sb.from('cast').select('*', { count: 'exact', head: true })).count,
      topics: (await sb.from('topics').select('*', { count: 'exact', head: true })).count,
      contributors: (await sb.from('contributors').select('*', { count: 'exact', head: true })).count,
      seconds: (await sb.rpc('get_total_duration')).data,
    }

    bannerCache.set('2', d)

    return {
      data: d,
      time: new Date().getTime() - t.getTime()
    }
  }

  // return {
  //   cast: castCache.getStats(),
  //   profile: profileCache.getStats(),
  //   video: videoCache.getStats(),
  //   search: searchCache.getStats(),
  //   episode: episodeCache.getStats(),
  //   history: historyCache.getStats(),
  //   banner: bannerCache.getStats()
  // }
})
