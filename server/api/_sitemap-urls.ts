import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (evt) => {
  const sb = await serverSupabaseClient(evt)

  const episodes = (await sb.from('episodes').select('*')).data || []
  return episodes.map((s: any) => {
    return {
      loc: '/videos/' + s.id,
      lastmod: new Date(s.aired),
      changefreq: 'weekly',
      priority: 0.8
    }
  })
})
