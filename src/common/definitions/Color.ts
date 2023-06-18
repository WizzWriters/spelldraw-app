export class RgbColor {
  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public opacity: number = 1
  ) {}
}

export class HslColor {
  constructor(
    public hue: number,
    public saturation: number,
    public lightness: number
  ) {}
}
