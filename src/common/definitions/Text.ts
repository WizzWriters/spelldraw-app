import { RgbColor } from './Color'

export default class Text {
  constructor(
    public textValue: string,
    public fontSize: number,
    public strokeColor: RgbColor = new RgbColor(0, 0, 0),
    public fillColor: RgbColor = new RgbColor(0, 0, 0)
  ) {}
}
