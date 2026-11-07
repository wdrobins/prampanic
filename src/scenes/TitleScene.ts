import { PALETTE } from '../art/palette';

/** Navigation-only title screen. The playable route starts in FirstWalkScene. */
export class TitleScene extends Phaser.Scene {
  private domRoot?: HTMLDivElement;

  public constructor() {
    super('title');
  }

  public create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(PALETTE.cream);
    this.add.rectangle(width / 2, height / 2, width, height, PALETTE.cream);
    this.add.rectangle(width / 2, height * 0.84, width, height * 0.32, PALETTE.grass);
    this.add
      .text(width / 2, height * 0.25, 'PRAM\nPANIC', {
        align: 'center',
        color: '#1B1B1F',
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        lineSpacing: -12,
        stroke: '#FFF8E7',
        strokeThickness: 8
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height * 0.46, 'Super Dad Bill vs. nap time', {
        color: '#1B1B1F',
        fontSize: '18px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height * 0.62, 'First Walk · Week 2', {
        color: '#1B1B1F',
        fontSize: '16px'
      })
      .setOrigin(0.5);
    this.createAccessibleTitleControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroyAccessibleTitleControls, this);
  }

  public startFirstWalk(): void {
    this.scene.start('first-walk');
  }

  private createAccessibleTitleControls(): void {
    const root = document.createElement('div');
    root.dataset.testid = 'title-screen';
    root.className = 'game-dom-overlay title-dom-overlay';
    const start = document.createElement('button');
    start.type = 'button';
    start.dataset.testid = 'title-start';
    start.className = 'game-dom-button title-start';
    start.textContent = 'Start First Walk';
    start.setAttribute('aria-label', 'Start First Walk');
    start.addEventListener('click', () => this.startFirstWalk());
    root.append(start);
    this.getDomHost().append(root);
    this.domRoot = root;
  }

  private destroyAccessibleTitleControls(): void {
    this.domRoot?.remove();
    this.domRoot = undefined;
  }

  private getDomHost(): HTMLElement {
    const host = document.getElementById('game');
    if (!host) throw new Error('Pram Panic game host is missing.');
    return host;
  }
}
