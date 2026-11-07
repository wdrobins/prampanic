import { PALETTE } from '../art/palette';

export interface UiStyle {
  ink: number;
  paper: number;
  accent: number;
  muted: number;
  cornerRadius: number;
  outlineWidth: number;
  labelSize: number;
}

export interface StickerButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  style: UiStyle;
  onPress: () => void;
  rotation?: number;
  enabled?: boolean;
}

export interface StickerButton {
  container: Phaser.GameObjects.Container;
  setEnabled: (enabled: boolean) => void;
  setLabel: (label: string) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
}

export interface ChipOptions {
  x: number;
  y: number;
  label: string;
  style: Pick<UiStyle, 'ink' | 'paper' | 'muted' | 'outlineWidth' | 'labelSize'>;
}

export const DEFAULT_UI_STYLE: UiStyle = {
  ink: PALETTE.ink,
  paper: PALETTE.cream,
  accent: PALETTE.hoodYellow,
  muted: PALETTE.footpath,
  cornerRadius: 14,
  outlineWidth: 3,
  labelSize: 14
};

export const createStickerButton = (
  scene: Phaser.Scene,
  options: StickerButtonOptions
): StickerButton => {
  const { x, y, width, height, label, style, onPress, rotation = 0, enabled = true } = options;
  const backing = scene.add
    .rectangle(0, 3, width, height, style.ink)
    .setOrigin(0.5)
    .setRounded?.(style.cornerRadius);
  const face = scene.add
    .rectangle(0, 0, width, height, style.accent)
    .setOrigin(0.5)
    .setStrokeStyle(style.outlineWidth, style.ink)
    .setRounded?.(style.cornerRadius);
  const text = scene.add
    .text(0, 0, label, { color: '#1B1B1F', fontSize: `${style.labelSize}px`, fontStyle: 'bold' })
    .setOrigin(0.5);
  const container = scene.add.container(x, y, [backing, face, text]).setRotation(rotation);
  const hit = scene.add
    .rectangle(x, y, width, height, 0xffffff, 0)
    .setInteractive({ useHandCursor: true });

  const setEnabled = (isEnabled: boolean): void => {
    hit.disableInteractive();
    if (isEnabled) hit.setInteractive({ useHandCursor: true });
    container.setAlpha(isEnabled ? 1 : 0.55);
  };
  setEnabled(enabled);
  hit.on('pointerdown', () => {
    if (!hit.input?.enabled) return;
    face.y = 3;
    text.y = 3;
  });
  hit.on('pointerup', () => {
    face.y = 0;
    text.y = 0;
    if (hit.input?.enabled) onPress();
  });
  hit.on('pointerout', () => {
    face.y = 0;
    text.y = 0;
  });

  return {
    container,
    setEnabled,
    setLabel: (next) => text.setText(next),
    setVisible: (visible) => {
      container.setVisible(visible);
      hit.setVisible(visible);
      if (visible) setEnabled(enabled);
      else hit.disableInteractive();
    },
    destroy: () => {
      hit.destroy();
      container.destroy();
    }
  };
};

export const createStickerChip = (
  scene: Phaser.Scene,
  options: ChipOptions
): Phaser.GameObjects.Container => {
  const text = scene.add
    .text(0, 0, options.label, {
      color: '#1B1B1F',
      fontSize: `${options.style.labelSize}px`,
      fontStyle: 'bold'
    })
    .setOrigin(0.5);
  const padding = options.style.labelSize;
  const plate = scene.add
    .rectangle(0, 0, text.width + padding * 2, text.height + padding, options.style.paper)
    .setStrokeStyle(options.style.outlineWidth, options.style.ink)
    .setOrigin(0.5);
  return scene.add.container(options.x, options.y, [plate, text]);
};

export const createPaperPanel = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  style: Pick<UiStyle, 'paper' | 'ink' | 'outlineWidth' | 'cornerRadius'>
): Phaser.GameObjects.Rectangle =>
  scene.add
    .rectangle(x, y, width, height, style.paper)
    .setStrokeStyle(style.outlineWidth, style.ink)
    .setOrigin(0.5);
