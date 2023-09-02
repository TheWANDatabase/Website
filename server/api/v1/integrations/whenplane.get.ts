import { integrationCache } from '~/utils/cache'

/**
 * Method | GET
 * PATH   | /api/v1/integrations/whenplane
 * Purpose| Fetch the most recently cached WhenPlane entry (ironically from wanshow bingo, but not the point)
 * Usages | Fetches a list of all active banner notices for rendering
 *        | on the client machine
 */

export default defineEventHandler(async () => {
  const t = new Date()

  try {
    if (integrationCache.has('whenPlane')) {
      return {
        data: integrationCache.get('whenPlane'),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const s = await (await fetch('https://socket.wanshow.bingo/whenplane')).json()
      integrationCache.set('whenPlane', s)
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
