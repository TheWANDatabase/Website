export function toTimestamp (ts: number = 0) {
  return `${paddy(~~(ts / 3600), 2)}:${paddy(~~(ts % 3600 / 60), 2)}:${paddy(~~(ts % 60), 2)}`
}

export function paddy (num: number, padlen: number = 0, padchar: string = '0') {
  const padChar = typeof padchar !== 'undefined' ? padchar : '0'
  const pad = new Array(1 + padlen).join(padChar)
  return (pad + num).slice(-pad.length)
}
