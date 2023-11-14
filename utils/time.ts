export function toTimestamp(ts: number = 0) {
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

export function paddy(num: number, padlen: number = 0, padchar: string = '0') {
  const padChar = typeof padchar !== 'undefined' ? padchar : '0'
  const pad = new Array(1 + padlen).join(padChar)
  return (pad + num).slice(-pad.length)
}

const units: any = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

export function getRelativeTime (d1: Date, d2: Date = new Date()): string | undefined {
  const elapsed = d1.getTime() - d2.getTime()

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units) {
    if (Math.abs(elapsed) > units[u] || u === 'second') {
      return rtf.format(Math.round(elapsed / units[u]), u as any)
    }
  }
}
