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

  constructor(int: number) {
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

  encode(): number {
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

  toJson() {
    return {
      ...this
    }
  }
}

export enum VideoMarkerMasks {
  TAI_WAN = 1,
  LTX2023 = 2,
  LTX2019 = 4,
  LTX2018 = 8,
  LTX2017 = 16,
  WFH = 32,

}

export class VideoMarkers {
  _raw: number
  taiWAN: boolean
  LTX2023: boolean
  LTX2019: boolean
  LTX2018: boolean
  LTX2017: boolean
  WFH: boolean

  constructor(int: number) {
    this._raw = int
    this.taiWAN = (int & VideoMarkerMasks.TAI_WAN) === VideoMarkerMasks.TAI_WAN
    this.LTX2023 = (int & VideoMarkerMasks.LTX2023) === VideoMarkerMasks.LTX2023
    this.LTX2019 = (int & VideoMarkerMasks.LTX2019) === VideoMarkerMasks.LTX2019
    this.LTX2018 = (int & VideoMarkerMasks.LTX2018) === VideoMarkerMasks.LTX2018
    this.LTX2017 = (int & VideoMarkerMasks.LTX2017) === VideoMarkerMasks.LTX2017
    this.WFH = (int & VideoMarkerMasks.WFH) === VideoMarkerMasks.WFH
  }

  encode(): number {
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

  toJson() {
    return {
      ...this
    }
  }
}
