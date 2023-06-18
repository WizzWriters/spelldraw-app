import { HslColor, RgbColor } from '../definitions/Color'

export interface IRgbColorJson {
  red: number
  green: number
  blue: number
  opacity: number
}

export class RgbColorSerializer {
  public static toJson(color: RgbColor): IRgbColorJson {
    return {
      red: color.red,
      green: color.green,
      blue: color.blue,
      opacity: color.opacity
    }
  }

  public static fromJson(color: IRgbColorJson) {
    return new RgbColor(color.red, color.green, color.blue, color.opacity)
  }
}

export interface IHslColor {
  hue: number
  saturation: number
  lightness: number
}

export class HslColorSerializer {
  public static toJson(color: HslColor): IHslColor {
    return {
      hue: color.hue,
      saturation: color.saturation,
      lightness: color.lightness
    }
  }

  public static fromJson(color: IHslColor) {
    return new HslColor(color.hue, color.saturation, color.lightness)
  }
}
