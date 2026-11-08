import type { WakeState } from '../systems/sleepMeter';
import { cooldownProgress } from './feedback';
import { createStickerButton, type StickerButton, type UiStyle } from './components';

export interface RunHudLayout {
  width: number;
  padding: number;
  top: number;
  progressTop: number;
  progressWidth: number;
  progressHeight: number;
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
  routeProgress: number;
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
  /** DOM controls are the sole visible/touchable buttons in First Walk. */
  showCanvasControls?: boolean;
}

/** Compact phone-first run HUD with a clear homeward route gauge. */
export class RunHud {
  private readonly stateLabel: Phaser.GameObjects.Text;
  private readonly feedLabel: Phaser.GameObjects.Text;
  private readonly routeLabel: Phaser.GameObjects.Text;
  private readonly ring: Phaser.GameObjects.Graphics;
  private readonly routeGauge: Phaser.GameObjects.Graphics;
  private readonly shush?: StickerButton;
  private readonly pause?: StickerButton;
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
    this.routeLabel = scene.add.text(layout.padding, layout.progressTop - 17, 'HOME', {
      color: '#1B1B1F',
      fontSize: `${Math.max(10, style.labelSize - 3)}px`,
      fontStyle: 'bold'
    });
    this.routeGauge = scene.add.graphics();
    this.ring = scene.add.graphics();
    if (options.showCanvasControls) {
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
  }

  public update(state: RunHudState): void {
    this.stateLabel.setText(`LULU: ${state.wakeState.toUpperCase()}`);
    this.feedLabel.setText(state.feedLabel);
    this.drawRouteGauge(state.routeProgress);
    const progress = cooldownProgress({
      nowMs: state.nowMs,
      readyAtMs: state.readyAtMs,
      durationMs: state.cooldownMs
    });
    this.shush?.setEnabled(progress === 0);
    this.shush?.setLabel(
      progress === 0 ? this.shushLabel : `${Math.ceil((progress * state.cooldownMs) / 1000)}s`
    );
    this.ring.clear();
    if (progress > 0 && this.shush) {
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

  private drawRouteGauge(progress: number): void {
    const { padding, progressTop, progressWidth, progressHeight } = this.layout;
    const bounded = Phaser.Math.Clamp(progress, 0, 1);
    this.routeGauge.clear();
    this.routeGauge
      .fillStyle(0xfff8e7, 0.88)
      .fillRoundedRect(padding, progressTop, progressWidth, progressHeight, progressHeight / 2);
    this.routeGauge
      .lineStyle(2, 0x1b1b1f, 0.8)
      .strokeRoundedRect(padding, progressTop, progressWidth, progressHeight, progressHeight / 2);
    if (bounded > 0)
      this.routeGauge
        .fillStyle(0x3ec1b0, 1)
        .fillRoundedRect(
          padding + 2,
          progressTop + 2,
          (progressWidth - 4) * bounded,
          progressHeight - 4,
          (progressHeight - 4) / 2
        );
    this.routeLabel.setText(`${Math.round(bounded * 100)}% HOME`);
  }

  public destroy(): void {
    this.stateLabel.destroy();
    this.feedLabel.destroy();
    this.routeLabel.destroy();
    this.ring.destroy();
    this.routeGauge.destroy();
    this.shush?.destroy();
    this.pause?.destroy();
  }
}
