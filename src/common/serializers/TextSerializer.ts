import Text from '../definitions/Text'
import {
  RgbColorSerializer,
  type IRgbColorPlainObject
} from './ColorSerializer'

export interface ITextPlainObject {
  textValue: string
  fontSize: number
  strokeColor: IRgbColorPlainObject
  fillColor: IRgbColorPlainObject
}

export default class TextSerializer {
  public static toPlainObject(text: Text): ITextPlainObject {
    return {
      textValue: text.textValue,
      fontSize: text.fontSize,
      strokeColor: RgbColorSerializer.toPlainObject(text.strokeColor),
      fillColor: RgbColorSerializer.toPlainObject(text.fillColor)
    }
  }

  public static fromPlainObject(text: ITextPlainObject) {
    return new Text(
      text.textValue,
      text.fontSize,
      RgbColorSerializer.fromPlainObject(text.strokeColor),
      RgbColorSerializer.fromPlainObject(text.fillColor)
    )
  }
}
