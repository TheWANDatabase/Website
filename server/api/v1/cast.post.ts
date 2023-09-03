import { serverSupabaseClient } from '#supabase/server'
import { castCache } from '~/utils/cache'

/**
 * Method | POST
 * PATH   | /api/v1/cast
 * Purpose| Fetch every entry in the cast table for display by the filter module on the ui
 * Usages | See above
 *
 * Iface  | CastRequest
 */

export interface CastRequest {

}

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)
  const rt = getRequestURL(event)

  try {
    if (rt.searchParams.get('detailed') === 'true') {
      if (castCache.has('cast-d')) {
        return {
          data: castCache.get('cast-d'),
          time: new Date().getTime() - t.getTime()
        }
      } else {
        const feed = (await sb.from('cast').select('*').order('id')).data
        castCache.set('cast-d', feed)
        return {
          data: feed,
          time: new Date().getTime() - t.getTime()
        }
      }
    }

    if (castCache.has('cast')) {
      return {
        data: castCache.get('cast'),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const feed = (await sb.from('cast').select('id, name, outlet, mug').order('id')).data
      castCache.set('cast', feed)
      return {
        data: feed,
        time: new Date().getTime() - t.getTime()
      }
    }
  } catch (e) {
    return {
      error: e,
      time: new Date().getTime() - t.getTime()
    }
  }

  return {
    error: 'undefined',
    time: new Date().getTime() - t.getTime()
  }
})
