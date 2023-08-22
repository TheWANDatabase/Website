import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { historyCache } from '~/utils/cache'

/**
 * Method | POST
 * PATH   | /api/v1/history
 * Purpose| Fetch every entry of episode progression for a given user, providing it in a cached form
 * Usages | See above
 *
 * Iface  | HistoryRequest
 * Returns| StandardResponse<HistoryDetails>
 */

async function handler (event: H3Event): Promise<HistoryResponse> {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const q = await readBody(event)
    if (historyCache.has(q.id)) {
      return {
        data: historyCache.get(q.id),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const { data } = await sb.from('episode_progression').select('*').eq('viewer', q.id)

      historyCache.set(q.id, data)
      return {
        data,
        time: new Date().getTime() - t.getTime()
      }
    }
  } catch (e) {
    return {
      error: e,
      time: new Date().getTime() - t.getTime()
    }
  }
}

export default defineEventHandler(handler)
