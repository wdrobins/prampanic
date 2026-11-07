import { PALETTE } from '../art/palette';

export interface PramStyle {
  ink: number;
  body: number;
  hood: number;
  wheel: number;
  outlineWidth: number;
}
export interface PramPresentation {
  width: number;
  height: number;
  hoodRadius: number;
  wheelRadius: number;
  style: PramStyle;
}

export const DEFAULT_PRAM_STYLE: PramStyle = {
  ink: PALETTE.ink,
  body: PALETTE.pramTeal,
  hood: PALETTE.hoodYellow,
  wheel: PALETTE.ink,
  outlineWidth: 4
};

/** Original vector pram, with dimensions supplied by the consuming scene. */
export class Pram {
  public readonly view: Phaser.GameObjects.Container;
  private readonly body: Phaser.GameObjects.Rectangle;
  private readonly hood: Phaser.GameObjects.Arc;

  public constructor(scene: Phaser.Scene, x: number, y: number, presentation: PramPresentation) {
    const { width, height, hoodRadius, wheelRadius, style } = presentation;
    this.body = scene.add
      .rectangle(0, 0, width, height, style.body)
      .setStrokeStyle(style.outlineWidth, style.ink);
    this.hood = scene.add
      .arc(-width / 4, -height / 2, hoodRadius, 180, 360, false, style.hood)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const leftWheel = scene.add
      .circle(-width / 3, height / 2, wheelRadius, style.wheel)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const rightWheel = scene.add
      .circle(width / 3, height / 2, wheelRadius, style.wheel)
      .setStrokeStyle(style.outlineWidth, style.ink);
    this.view = scene.add.container(x, y, [this.body, this.hood, leftWheel, rightWheel]);
  }

  public setHoodColour(colour: number): void {
    this.hood.setFillStyle(colour);
  }
  public setPosition(x: number, y: number): void {
    this.view.setPosition(x, y);
  }
  public setWobble(angle: number): void {
    this.view.setRotation(angle);
  }
  public destroy(): void {
    this.view.destroy();
  }
}
