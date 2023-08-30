import { schedule } from 'node-cron'
import { createClient } from '@supabase/supabase-js'

/**
 * This module is designed to allow the service to collect and monitor usage
 * analytics, allowing us to improve architecture and strategies in a
 * way which is actually meaningful
 */

const cli = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const def = {
  requests: {
    total: 0,
    get: 0,
    post: 0,
    patch: 0
  },
  caches: {
    cast: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    profile: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    video: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    search: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    episode: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    history: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    },
    banner: {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0
    }
  },
  users: {
    active: 0,
    total: 0
  }
}

let counts = def

schedule('*/5', async () => {
  counts.caches.cast = castCache.getStats()
  counts.caches.profile = profileCache.getStats()
  counts.caches.video = videoCache.getStats()
  counts.caches.search = searchCache.getStats()
  counts.caches.episode = episodeCache.getStats()
  counts.caches.history = historyCache.getStats()
  counts.caches.banner = bannerCache.getStats()
  // let users = (await cli.rpc('audit_users')).data
  await cli.from('analytics').insert({
    data: counts
  })

  counts = def
})
