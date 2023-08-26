import { serverSupabaseClient } from '#supabase/server'
import { profileCache } from '~/utils/cache'

/**
 * Method | POST
 * PATH   | /api/v1/profiles
 * Purpose| Fetch and return all information regarding a profile and it's related settings
 * Usages | Fetched by the header component to ensure page reloads always fetch the most
 *        | up to date information regarding configurations / preferences
 */

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const q = await readBody(event)

    if (profileCache.has(q.id)) {
      return {
        data: profileCache.get(q.id),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const { data } = await sb.from('profiles').select('*').eq('id', q.id).single()

      profileCache.set(q.id, data)
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
})
