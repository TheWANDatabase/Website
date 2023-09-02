export enum VideoFlagMasks {
  THUMB = 1,
  AOD = 2,
  VOD = 4,
  WEBVTT = 8,
  PRIVATE = 16,
  STREAM = 32,
  LIVE = 64,
  CORRUPT = 128,
  CW = 256,
  GUEST = 512,
  LTX = 1024,
  MM = 2048,
  PL = 4096
}

export class VideoFlags {
  _raw: number
  thumb: boolean
  aod: boolean
  vod: boolean
  webvtt: boolean
  private: boolean
  stream: boolean
  live: boolean
  corrupt: boolean
  cw: boolean
  guest: boolean
  ltx: boolean
  mm: boolean
  pl: boolean

  constructor (int: number) {
    this._raw = int
    this.thumb = (int & VideoFlagMasks.THUMB) === VideoFlagMasks.THUMB
    this.aod = (int & VideoFlagMasks.AOD) === VideoFlagMasks.AOD
    this.vod = (int & VideoFlagMasks.VOD) === VideoFlagMasks.VOD
    this.webvtt = (int & VideoFlagMasks.WEBVTT) === VideoFlagMasks.WEBVTT
    this.private = (int & VideoFlagMasks.PRIVATE) === VideoFlagMasks.PRIVATE
    this.stream = (int & VideoFlagMasks.STREAM) === VideoFlagMasks.STREAM
    this.live = (int & VideoFlagMasks.LIVE) === VideoFlagMasks.LIVE
    this.corrupt = (int & VideoFlagMasks.CORRUPT) === VideoFlagMasks.CORRUPT
    this.cw = (int & VideoFlagMasks.CW) === VideoFlagMasks.CW
    this.guest = (int & VideoFlagMasks.GUEST) === VideoFlagMasks.GUEST
    this.ltx = (int & VideoFlagMasks.LTX) === VideoFlagMasks.LTX
    this.mm = (int & VideoFlagMasks.MM) === VideoFlagMasks.MM
    this.pl = (int & VideoFlagMasks.PL) === VideoFlagMasks.PL
  }

  encode (): number {
    let x = 0

    if (this.thumb) { x = x | VideoFlagMasks.THUMB }
    if (this.aod) { x = x | VideoFlagMasks.AOD }
    if (this.vod) { x = x | VideoFlagMasks.VOD }
    if (this.webvtt) { x = x | VideoFlagMasks.WEBVTT }
    if (this.private) { x = x | VideoFlagMasks.PRIVATE }
    if (this.stream) { x = x | VideoFlagMasks.STREAM }
    if (this.live) { x = x | VideoFlagMasks.LIVE }
    if (this.corrupt) { x = x | VideoFlagMasks.CORRUPT }
    if (this.cw) { x = x | VideoFlagMasks.CW }
    if (this.guest) { x = x | VideoFlagMasks.GUEST }
    if (this.ltx) { x = x | VideoFlagMasks.LTX }
    if (this.mm) { x = x | VideoFlagMasks.MM }
    if (this.pl) { x = x | VideoFlagMasks.PL }
    return x
  }

  toJson () {
    return {
      ...this
    }
  }
}
