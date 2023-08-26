import { serverSupabaseClient } from '#supabase/server'
import { profileCache } from '~/utils/cache'

/**
 * Method | PATCH
 * PATH   | /api/v1/profiles
 * Purpose| Reload all cached information regarding a profile
 * Usages | Fetched when a user changes their profile settings, to prevent
 *        | stale data being served by the cache (just in case this is important)
 */

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const q = await readBody(event)

    const { data } = await sb.from('profiles').select('*').eq('id', q.id).single()

    profileCache.set(q.id, data)
    return {
      data,
      time: new Date().getTime() - t.getTime()
    }
  } catch (e) {
    return {
      error: e,
      time: new Date().getTime() - t.getTime()
    }
  }
})
