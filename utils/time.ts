export function toTimestamp (ts: number = 0) {
  const days = ~~(ts / (3600 * 24))
  const hours = ~~(ts % (3600 * 24) / 3600)
  const minutes = ~~(ts % 3600 / 60)
  const seconds = ~~(ts % 60)

  if (days > 0) {
    return `${paddy(days, 2)}:${paddy(hours, 2)}:${paddy(minutes, 2)}:${paddy(seconds, 2)}`
  } else if (hours > 0) {
    return `${paddy(hours, 2)}:${paddy(minutes, 2)}:${paddy(seconds, 2)}`
  } else {
    return `${paddy(minutes, 2)}:${paddy(seconds, 2)}`
  }
}

export function paddy (num: number, padlen: number = 0, padchar: string = '0') {
  const padChar = typeof padchar !== 'undefined' ? padchar : '0'
  const pad = new Array(1 + padlen).join(padChar)
  return (pad + num).slice(-pad.length)
}
