import { castCache, profileCache, videoCache, searchCache, episodeCache, historyCache, bannerCache } from '~/utils/cache'

/**
 * Method | GET
 * PATH   | /api/v1/stats
 * Purpose| Fetch the currently active banner notices
 * Usages | Fetches a list of all active banner notices for rendering
 *        | on the client machine
 */

export default defineEventHandler((_event) => {
  return {
    cast: castCache.getStats(),
    profile: profileCache.getStats(),
    video: videoCache.getStats(),
    search: searchCache.getStats(),
    episode: episodeCache.getStats(),
    history: historyCache.getStats(),
    banner: bannerCache.getStats()
  }
})
