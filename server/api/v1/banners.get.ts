import { serverSupabaseClient } from '#supabase/server'
import { bannerCache } from '~/utils/cache'

/**
 * Method | GET
 * PATH   | /api/v1/banners
 * Purpose| Fetch the currently active banner notices
 * Usages | Fetches a list of all active banner notices for rendering
 *        | on the client machine
 */

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    if (bannerCache.has('1')) {
      return {
        data: bannerCache.get('1'),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const s = (await sb.from('alerts').select('*').eq('expired', false)).data
      bannerCache.set('1', s)
      return {
        data: s,
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
