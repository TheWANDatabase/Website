import { serverSupabaseClient } from '#supabase/server'
import { episodeCache } from '~/utils/cache'

/**
 * Method | POST
 * PATH   | /api/v1/episodes
 * Purpose| Fetch a minimal amount of information for every episode
 * Usages | Fetches a minimal amount of information for all videos fitting filter criteria
 *        | and providing cached, paginated responses according to the database's response
 *
 * Iface  | EpisodeRequest
 */

export interface EpisodeRequest {
  filters: any,
  limit: number,
  offset: number
}

export default defineEventHandler(async (event) => {
  const t = new Date()
  const sb = await serverSupabaseClient(event)

  try {
    const { filters, limit, offset } = await readBody(event)
    const batch = `${JSON.stringify(filters)}-${limit}-${offset}`

    if (episodeCache.has(batch)) {
      return {
        data: episodeCache.get(batch),
        time: new Date().getTime() - t.getTime()
      }
    } else {
      const q2 = sb.from('episodes')
        .select('id', { head: true, count: 'exact' })
        .not('aired', 'is', 'null')

      const query = sb.from('episodes')
        .select('*')
        .not('aired', 'is', 'null')

      if (process.env.DOMAIN === 'localhost:3000') {
        q2.eq('cast', '{}')
        query.eq('cast', '{}')
      }

      if (filters.startDate) {
        query.gte('aired', filters.startDate)
        q2.gte('aired', filters.startDate)
      }
      if (filters.endDate) {
        query.lte('aired', filters.endDate)
        q2.lte('aired', filters.endDate)
      }

      switch (filters.order) {
        case 'release':
          query.order('aired', { ascending: true })
          q2.order('aired', { ascending: true })
          break
        case 'release-desc':
          query.order('aired', { ascending: false })
          q2.order('aired', { ascending: false })
          break
        case 'title':
          query.order('title', { ascending: true })
          q2.order('title', { ascending: true })
          break
        case 'title-desc':
          query.order('title', { ascending: false })
          q2.order('title', { ascending: false })
          break
        case 'topics':
          query.order('topic_count', { ascending: true })
          q2.order('topic_count', { ascending: true })
          break
        case 'topics-desc':
          query.order('topic_count', { ascending: false })
          q2.order('topic_count', { ascending: false })
          break
        case 'duration':
          query.order('duration', { ascending: true })
          q2.order('duration', { ascending: true })
          break
        case 'duration-desc':
          query.order('duration', { ascending: false })
          q2.order('duration', { ascending: false })
          break
      }

      if (filters.members.length > 0) {
        query.filter('cast', 'ov', `{"${filters.members.join('","')}"}`)
        q2.filter('cast', 'ov', `{"${filters.members.join('","')}"}`)
      }
      query.range(offset, offset + (limit - 1))

      const feed = {
        episodes: (await query).data,
        count: (await q2).count
      }
      episodeCache.set(batch, feed)
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
