import type { WakeState } from '../systems/sleepMeter';
import { cooldownProgress } from './feedback';
import { createStickerButton, type StickerButton, type UiStyle } from './components';

export interface RunHudLayout {
  width: number;
  padding: number;
  top: number;
  shushX: number;
  shushY: number;
  shushDiameter: number;
  pauseX: number;
  pauseY: number;
  controlWidth: number;
  controlHeight: number;
}

export interface RunHudCopy {
  feedPrefix: string;
  shushLabel: string;
  pauseLabel: string;
}
export interface RunHudState {
  wakeState: WakeState;
  feedLabel: string;
  readyAtMs: number;
  nowMs: number;
  cooldownMs: number;
}
export interface RunHudOptions {
  layout: RunHudLayout;
  style: UiStyle;
  copy: RunHudCopy;
  onShush: () => void;
  onPause: () => void;
}

/** Compact phone-first run HUD with a caller-configured, 72–80px shush target. */
export class RunHud {
  private readonly stateLabel: Phaser.GameObjects.Text;
  private readonly feedLabel: Phaser.GameObjects.Text;
  private readonly ring: Phaser.GameObjects.Graphics;
  private readonly shush: StickerButton;
  private readonly pause: StickerButton;
  private readonly shushLabel: string;
  private readonly layout: RunHudLayout;

  public constructor(scene: Phaser.Scene, options: RunHudOptions) {
    this.layout = options.layout;
    this.shushLabel = options.copy.shushLabel;
    const { style, layout } = options;
    this.stateLabel = scene.add.text(layout.padding, layout.top, '', {
      color: '#1B1B1F',
      fontSize: `${style.labelSize}px`,
      fontStyle: 'bold'
    });
    this.feedLabel = scene.add.text(layout.padding, layout.top + style.labelSize * 1.5, '', {
      color: '#1B1B1F',
      fontSize: `${style.labelSize}px`
    });
    this.ring = scene.add.graphics();
    this.shush = createStickerButton(scene, {
      x: layout.shushX,
      y: layout.shushY,
      width: layout.shushDiameter,
      height: layout.shushDiameter,
      label: options.copy.shushLabel,
      style,
      onPress: options.onShush
    });
    this.pause = createStickerButton(scene, {
      x: layout.pauseX,
      y: layout.pauseY,
      width: layout.controlWidth,
      height: layout.controlHeight,
      label: options.copy.pauseLabel,
      style,
      onPress: options.onPause
    });
  }

  public update(state: RunHudState): void {
    this.stateLabel.setText(`LULU: ${state.wakeState.toUpperCase()}`);
    this.feedLabel.setText(state.feedLabel);
    const progress = cooldownProgress({
      nowMs: state.nowMs,
      readyAtMs: state.readyAtMs,
      durationMs: state.cooldownMs
    });
    this.shush.setEnabled(progress === 0);
    this.shush.setLabel(
      progress === 0 ? this.shushLabel : `${Math.ceil((progress * state.cooldownMs) / 1000)}s`
    );
    this.ring.clear();
    if (progress > 0) {
      this.ring.lineStyle(this.layout.shushDiameter * 0.06, 0x1b1b1f, 0.7);
      this.ring.beginPath();
      this.ring.arc(
        this.layout.shushX,
        this.layout.shushY,
        this.layout.shushDiameter / 2,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * progress
      );
      this.ring.strokePath();
    }
  }

  public destroy(): void {
    this.stateLabel.destroy();
    this.feedLabel.destroy();
    this.ring.destroy();
    this.shush.destroy();
    this.pause.destroy();
  }
}
