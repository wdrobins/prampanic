import { PALETTE } from '../art/palette';

export type BillMood = 'fresh' | 'tired' | 'bloodshot';
export interface BillStyle {
  ink: number;
  skin: number;
  shirt: number;
  cape: number;
  eye: number;
  outlineWidth: number;
}
export interface BillPresentation {
  torsoWidth: number;
  torsoHeight: number;
  headRadius: number;
  eyeRadius: number;
  style: BillStyle;
}
export const DEFAULT_BILL_STYLE: BillStyle = {
  ink: PALETTE.ink,
  skin: 0xf2c29b,
  shirt: PALETTE.dadBlue,
  cape: PALETTE.capeRed,
  eye: 0xffffff,
  outlineWidth: 4
};

/** Original big-head, cape-jumper Super Dad presentation. */
export class Bill {
  public readonly view: Phaser.GameObjects.Container;
  private readonly eyeMarks: Phaser.GameObjects.Graphics;
  private readonly presentation: BillPresentation;

  public constructor(scene: Phaser.Scene, x: number, y: number, presentation: BillPresentation) {
    this.presentation = presentation;
    const { torsoWidth, torsoHeight, headRadius, eyeRadius, style } = presentation;
    const cape = scene.add
      .triangle(-torsoWidth / 2, 0, 0, 0, torsoWidth, torsoHeight / 2, 0, torsoHeight, style.cape)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const torso = scene.add
      .rectangle(0, 0, torsoWidth, torsoHeight, style.shirt)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const head = scene.add
      .circle(0, -torsoHeight / 2, headRadius, style.skin)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const leftEye = scene.add
      .circle(-headRadius / 3, -torsoHeight / 2, eyeRadius, style.eye)
      .setStrokeStyle(style.outlineWidth, style.ink);
    const rightEye = scene.add
      .circle(headRadius / 3, -torsoHeight / 2, eyeRadius, style.eye)
      .setStrokeStyle(style.outlineWidth, style.ink);
    this.eyeMarks = scene.add.graphics();
    this.view = scene.add.container(x, y, [cape, torso, head, leftEye, rightEye, this.eyeMarks]);
    this.setMood('fresh');
  }

  public setMood(mood: BillMood): void {
    const { torsoHeight, headRadius, eyeRadius, style } = this.presentation;
    this.eyeMarks.clear();
    if (mood === 'tired')
      this.eyeMarks
        .fillStyle(style.ink)
        .fillEllipse(-headRadius / 3, -torsoHeight / 2 + eyeRadius, eyeRadius, eyeRadius / 2)
        .fillEllipse(headRadius / 3, -torsoHeight / 2 + eyeRadius, eyeRadius, eyeRadius / 2);
    if (mood === 'bloodshot')
      this.eyeMarks
        .lineStyle(style.outlineWidth, style.cape)
        .lineBetween(-headRadius / 2, -torsoHeight / 2, -headRadius / 5, -torsoHeight / 2)
        .lineBetween(headRadius / 2, -torsoHeight / 2, headRadius / 5, -torsoHeight / 2);
  }

  public setPosition(x: number, y: number): void {
    this.view.setPosition(x, y);
  }
  public destroy(): void {
    this.view.destroy();
  }
}
