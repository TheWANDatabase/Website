export default defineEventHandler(async (evt) => {
  // const sb = await serverSupabaseClient(evt)

  // const episodes = (await sb.from('episodes').select('*')).data || []
  // return episodes.map((s: any) => {
  //   return {
  //     loc: '/episode/' + s.id,
  //     lastmod: new Date(s.aired),
  //     changefreq: 'weekly',
  //     priority: 0.8
  //   }
  // })

  return []
})
