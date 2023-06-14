import type { RgbColor } from '@/common/definitions/Color'

export function rgbColorToString(color: RgbColor | null) {
  if (!color) return 'none'
  return `rgb(${color.red}, ${color.green}, ${color.blue})`
}
