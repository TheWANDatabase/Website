import { serverSupabaseClient } from '#supabase/server'
import { searchCache } from '~/utils/cache'

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const q = await readBody(event)
    if (searchCache.has(q.phrase)) {
      return {
        data: searchCache.get(q.phrase),
        time: new Date() - t
      }
    } else {
      const s = (await sb.rpc('search', q)).data
      searchCache.set(q.phrase, s)
      return {
        data: s,
        time: new Date() - t
      }
    }
  } catch (e) {
    return {
      error: e,
      time: new Date() - t
    }
  }
})
