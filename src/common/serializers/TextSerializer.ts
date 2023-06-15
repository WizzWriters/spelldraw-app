import Text from '../definitions/Text'
import { RgbColorSerializer, type IRgbColorJson } from './ColorSerializer'

export interface ITextJson {
  textValue: string
  fontSize: number
  strokeColor: IRgbColorJson
  fillColor: IRgbColorJson
}

export default class TextSerializer {
  public static toJson(text: Text): ITextJson {
    return {
      textValue: text.textValue,
      fontSize: text.fontSize,
      strokeColor: RgbColorSerializer.toJson(text.strokeColor),
      fillColor: RgbColorSerializer.toJson(text.fillColor)
    }
  }

  public static fromJson(text: ITextJson) {
    return new Text(
      text.textValue,
      text.fontSize,
      RgbColorSerializer.fromJson(text.strokeColor),
      RgbColorSerializer.fromJson(text.fillColor)
    )
  }
}
