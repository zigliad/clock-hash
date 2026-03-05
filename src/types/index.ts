export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

export interface HmsTime {
  hours: number
  minutes: number
  seconds: number
}

export interface ParsedTarget {
  hours: number
  minutes: number
}

export interface ColorInfo {
  hex: string
  rgb: string
  cssName: string
}

export interface CssColor {
  name: string
  r: number
  g: number
  b: number
}

export interface TimezoneEntry {
  zone: string
  label: string
}

export interface Favorite {
  id: string
  time: string
  hex: string
  timezone: string
}

export interface ColorHistoryEntry {
  id: number
  time: string
  hex: string
}

export interface BeautifulColorResult {
  type: 'named' | 'high-saturation'
  name: string
}

export interface BeautifulTime {
  secondsUntil: number
  hex: string
  label: string
}
