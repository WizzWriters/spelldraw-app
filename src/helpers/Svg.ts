import type { HslColor, RgbColor } from '@/common/definitions/Color'

export function rgbColorToString(color: RgbColor | null) {
  if (!color) return 'none'
  return `rgb(${color.red}, ${color.green}, ${color.blue})`
}

export function hslColorToString(color: HslColor | null) {
  if (!color) return 'none'
  return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
}
