import { parse } from 'node-webvtt'

import { serverSupabaseClient } from '#supabase/server'
import { videoCache } from '~/utils/cache'
import { VideoFlags } from '~/utils/bitDecoders'
import { getRelativeTime } from '~/utils/time'

/**
 * Method | GET
 * PATH   | /api/v1/videos/:id
 * Purpose| Fetch video, cast, and topic details for a specific video
 * Usages | Used to keep the UI requests to a minimum, caches cast, topic,
 *        | transcript, and video information for use by the frontend to minimise
 *        | strain on supabase server (and minimise bandwidth costs)
 */

function hash (str: string): any {
  let h = 0
  let i; let chr
  if (str.length === 0) { return h }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    h = ((h << 5) - h) + chr
    h |= 0 // Convert to 32bit integer
  }
  return h
}

// TODO: Bring this endpoint into compliance with StandardResponse interface
export default defineEventHandler(async (event) => {
  const sb = await serverSupabaseClient(event)
  const id = getRouterParam(event, 'id')
  if (id) {
    if (videoCache.has('d' + id)) {
      return videoCache.get('d' + id)
    } else {
      const episode: any = (
        await sb.from('episodes')
          .select('*')
          .eq('id', id).single()
      ).data

      if (episode) {
        episode.thumbnail = 'https://cdn.thewandb.com/thumbs/' + episode.id + '.jpeg'
        episode.title = episode.title.split('- WAN Show')[0]
        episode.flags = new VideoFlags(episode.flags).toJson()
        episode.age = getRelativeTime(new Date(episode.aired))

        const castMap = new Map()
        const tsMap = new Map()

        const cast = (
          await sb.from('cast')
            .select('*')
            .in('id', episode.cast)
            .order('id', { ascending: true })
        ).data?.map((m: any) => {
          m.mug = 'https://cdn.thewandb.com/mugs/' + m.mug
          castMap.set(m.id, m)
          return m
        })

        const topics:any[] = (
          await sb.from('topics')
            .select('*, profiles(*)')
            .eq('episode', episode.id)
            .eq('accepted', true)
            .order('timestamp_raw')
        ).data || []

        const transcript: any = (
          await sb.from('transcriptions')
            .select('*')
            .eq('id', episode.id)
            .single()
        ).data

        const tpcs = []

        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i]

          if (topic.title === 'Chapters' || topic.title === 'Intro') { continue }

          if (topic.section) {
            tpcs.push({
              ...topic,
              hash: hash(topic.title),
              children: []
            })
          } else if (tpcs[tpcs.length - 1]) {
            if (topic.title.startsWith('Sponsor') && tpcs[tpcs.length - 1].title !== 'Sponsor Spots') {
              tpcs.push({
                title: 'Sponsor Spots',
                hash: hash('Sponsor Spots'),
                timestamp: topic.timestamp,
                timestamp_raw: topic.timestamp_raw,
                url: null,
                children: [topic]
              })
            } else {
              tpcs[tpcs.length - 1].endpoint = topic.endpoint
              tpcs[tpcs.length - 1].children.push(topic)
            }
          } else {
            tpcs.push({
              ...topic,
              hash: hash(topic.title),
              endpoint: 0,
              children: []
            })
          }
        }

        if (transcript) {
          if (transcript.mappings) {
            for (let i = 0; i < transcript.mappings.length; i++) {
              const m = transcript.mappings[i]
              const cm = m.pop()
              for (let j = 0; j < m.length; j++) {
                tsMap.set(m[j], cm)
              }
            }
          }
          if (transcript.vtt) { transcript.vtt = parse(transcript.vtt) }
          if (transcript.vtt) {
            transcript.vtt.cues.map((cue: any) => {
              const speaker = cue.text.split(']: ')[0].split('[')[1]
              cue.va = castMap.get(tsMap.get(speaker))
              if (cue.va) {
                cue.text = cue.text.split(']: ')[1]
              }

              return cue
            })
          }
        }

        const result = {
          episode,
          cast,
          topics: tpcs,
          transcript
        }

        videoCache.set('d' + id, result)

        return result
      } else {
        return {
          error: 'Unable to locate episode matching id: ' + id
        }
      }
    }
  }

  return {
    error: 'undefined'
  }
})
