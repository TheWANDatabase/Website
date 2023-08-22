import NodeCache from 'node-cache'

export const castCache = new NodeCache({
  stdTTL: 600
})

export const profileCache = new NodeCache({
  stdTTL: 60
})

export const videoCache = new NodeCache({
  stdTTL: 600
})

export const searchCache = new NodeCache({
  stdTTL: 60
})

export const episodeCache = new NodeCache({
  stdTTL: 600
})

export const historyCache = new NodeCache({
  stdTTL: 60
})
