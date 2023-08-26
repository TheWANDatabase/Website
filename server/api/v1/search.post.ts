import { serverSupabaseClient } from '#supabase/server'
import { searchCache } from '~/utils/cache'

/**
 * Method | POST
 * PATH   | /api/v1/search
 * Purpose| Fetch topics and episodes related to a provided search query
 * Usages | Fetches a list of all topics (and their related episodes) that might match a
 *        | possible search query (and caches the result for faster responses)
 */

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const q = await readBody(event)
    if (searchCache.has(q.phrase)) {
      return {
        data: searchCache.get(q.phrase),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const s = (await sb.rpc('search', q)).data
      const se = (await sb.rpc('search_episodes', q)).data
      searchCache.set(q.phrase, {
        topics: s,
        episodes: se
      })
      return {
        data: {
          topics: s,
          episodes: se
        },
        time: new Date().getTime() - t.getTime()
      }
    }
  } catch (e) {
    return {
      error: e,
      time: new Date().getTime() - t.getTime()
    }
  }
})
