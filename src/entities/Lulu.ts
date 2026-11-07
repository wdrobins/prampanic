import { PALETTE } from '../art/palette';
import type { WakeState } from '../systems/sleepMeter';

export type LuluFace = WakeState;
export interface LuluStyle {
  ink: number;
  skin: number;
  onesie: number;
  blush: number;
  tear: number;
  outlineWidth: number;
}
export interface LuluPresentation {
  headRadius: number;
  bodyWidth: number;
  bodyHeight: number;
  eyeRadius: number;
  style: LuluStyle;
}
export const DEFAULT_LULU_STYLE: LuluStyle = {
  ink: PALETTE.ink,
  skin: 0xf7d1b0,
  onesie: PALETTE.hoodYellow,
  blush: PALETTE.capeRed,
  tear: PALETTE.dadBlue,
  outlineWidth: 3
};

/** Five original, readable wake-state faces. */
export class Lulu {
  public readonly view: Phaser.GameObjects.Container;
  private readonly face: Phaser.GameObjects.Container;
  private readonly presentation: LuluPresentation;
  private current: LuluFace = 'Sleeping';

  public constructor(scene: Phaser.Scene, x: number, y: number, presentation: LuluPresentation) {
    this.presentation = presentation;
    const body = scene.add
      .rectangle(
        0,
        presentation.headRadius,
        presentation.bodyWidth,
        presentation.bodyHeight,
        presentation.style.onesie
      )
      .setStrokeStyle(presentation.style.outlineWidth, presentation.style.ink);
    this.face = scene.add.container(0, 0);
    this.view = scene.add.container(x, y, [body, this.face]);
    this.setWakeState('Sleeping');
  }

  public setWakeState(state: LuluFace): void {
    this.current = state;
    this.face.removeAll(true);
    const { headRadius, eyeRadius, style } = this.presentation;
    const head = this.face.scene.add
      .circle(0, 0, headRadius, style.skin)
      .setStrokeStyle(style.outlineWidth, style.ink);
    this.face.add(head);
    const eyeY = -eyeRadius;
    if (state === 'Sleeping') {
      this.face.add(
        this.face.scene.add
          .arc(-headRadius / 3, eyeY, eyeRadius, 0, 180, false, style.ink)
          .setStrokeStyle(style.outlineWidth, style.ink)
      );
      this.face.add(
        this.face.scene.add
          .arc(headRadius / 3, eyeY, eyeRadius, 0, 180, false, style.ink)
          .setStrokeStyle(style.outlineWidth, style.ink)
      );
      this.face.add(
        this.face.scene.add.text(headRadius, -headRadius, 'Z', {
          color: '#1B1B1F',
          fontSize: `${headRadius}px`,
          fontStyle: 'bold'
        })
      );
    } else {
      const open = state === 'Awake' || state === 'Crying';
      const eyeScale = open ? eyeRadius : eyeRadius / 2;
      this.face.add(
        this.face.scene.add.ellipse(-headRadius / 3, eyeY, eyeRadius, eyeScale, style.ink)
      );
      this.face.add(
        this.face.scene.add.ellipse(headRadius / 3, eyeY, eyeRadius, eyeScale, style.ink)
      );
    }
    if (state === 'Grunting') {
      this.face.add(
        this.face.scene.add.circle(-headRadius / 2, headRadius / 4, eyeRadius, style.blush)
      );
      this.face.add(
        this.face.scene.add.circle(headRadius / 2, headRadius / 4, eyeRadius, style.blush)
      );
    }
    if (state === 'Awake')
      this.face.add(
        this.face.scene.add
          .arc(0, headRadius / 3, eyeRadius, 0, 180, false, style.ink)
          .setStrokeStyle(style.outlineWidth, style.ink)
      );
    if (state === 'Crying') {
      this.face.add(
        this.face.scene.add.ellipse(0, headRadius / 3, eyeRadius * 2, eyeRadius, style.ink)
      );
      this.face.add(
        this.face.scene.add.circle(-headRadius / 2, headRadius / 2, eyeRadius / 2, style.tear)
      );
      this.face.add(
        this.face.scene.add.circle(headRadius / 2, headRadius / 2, eyeRadius / 2, style.tear)
      );
    }
  }

  public getWakeState(): LuluFace {
    return this.current;
  }
  public setPosition(x: number, y: number): void {
    this.view.setPosition(x, y);
  }
  public destroy(): void {
    this.view.destroy();
  }
}
