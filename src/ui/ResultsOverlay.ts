import { createPaperPanel, createStickerButton, type UiStyle } from './components';

export interface ResultsCopy {
  title: string;
  retry: string;
  next: string;
  tipHeading: string;
}
export interface ResultsLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  actionWidth: number;
  actionHeight: number;
  actionGap: number;
}
export interface ResultsData {
  headline: string;
  cause?: string;
  reward?: string;
  tipText?: string;
  tipSource?: string;
}
export interface ResultsOverlayOptions {
  layout: ResultsLayout;
  style: UiStyle;
  copy: ResultsCopy;
  onRetry: () => void;
  onNext?: () => void;
}

/** Reusable result card. The scene provides every result, cause and health-tip string. */
export class ResultsOverlay {
  private readonly root: Phaser.GameObjects.Container;
  private readonly actions: ReturnType<typeof createStickerButton>[];

  public constructor(scene: Phaser.Scene, options: ResultsOverlayOptions) {
    const { layout, style, copy } = options;
    this.root = scene.add.container(0, 0).setDepth(1000).setVisible(false);
    const shade = scene.add
      .rectangle(layout.x, layout.y, layout.width * 2, layout.height * 2, 0x1b1b1f, 0.62)
      .setInteractive();
    const panel = createPaperPanel(scene, layout.x, layout.y, layout.width, layout.height, style);
    const title = scene.add
      .text(layout.x, layout.y - layout.height * 0.4, copy.title, {
        color: '#1B1B1F',
        fontSize: `${style.labelSize * 1.6}px`,
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    const body = scene.add
      .text(layout.x, layout.y - layout.height * 0.12, '', {
        color: '#1B1B1F',
        fontSize: `${style.labelSize}px`,
        align: 'center',
        wordWrap: { width: layout.width * 0.82 }
      })
      .setOrigin(0.5);
    const tip = scene.add
      .text(layout.x, layout.y + layout.height * 0.13, '', {
        color: '#1B1B1F',
        fontSize: `${style.labelSize * 0.9}px`,
        align: 'center',
        wordWrap: { width: layout.width * 0.82 }
      })
      .setOrigin(0.5);
    const retry = createStickerButton(scene, {
      x: layout.x - layout.actionGap,
      y: layout.y + layout.height * 0.37,
      width: layout.actionWidth,
      height: layout.actionHeight,
      label: copy.retry,
      style,
      onPress: options.onRetry
    });
    const next = options.onNext
      ? createStickerButton(scene, {
          x: layout.x + layout.actionGap,
          y: layout.y + layout.height * 0.37,
          width: layout.actionWidth,
          height: layout.actionHeight,
          label: copy.next,
          style,
          onPress: options.onNext
        })
      : undefined;
    this.actions = [retry, ...(next ? [next] : [])];
    this.actions.forEach((action) => action.setVisible(false));
    this.root.add([
      shade,
      panel,
      title,
      body,
      tip,
      retry.container,
      ...(next ? [next.container] : [])
    ]);
    this.show = (data: ResultsData): void => {
      title.setText(data.headline);
      body.setText([data.cause, data.reward].filter(Boolean).join('\n'));
      tip.setText(
        data.tipText
          ? `${copy.tipHeading}\n${data.tipText}${data.tipSource ? `\n${data.tipSource}` : ''}`
          : ''
      );
      this.root.setVisible(true);
      this.actions.forEach((action) => action.setVisible(true));
    };
  }

  public show: (data: ResultsData) => void = () => undefined;
  public hide(): void {
    this.root.setVisible(false);
    this.actions.forEach((action) => action.setVisible(false));
  }
  public destroy(): void {
    this.actions.forEach((action) => action.destroy());
    this.root.destroy(true);
  }
}
