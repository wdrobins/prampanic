import { PALETTE } from '../art/palette';

export class TitleScene extends Phaser.Scene {
  public constructor() {
    super('title');
  }

  public create(): void {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.cream).fillRect(0, 0, width, height);
    graphics.fillStyle(PALETTE.grass).fillRect(0, height * 0.74, width, height * 0.26);

    this.add
      .text(width / 2, 190, 'PRAM\nPANIC', {
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
      .text(width / 2, 325, 'Super Dad Bill vs. nap time', {
        color: '#1B1B1F',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.drawPram(width / 2, 490);

    const start = this.add
      .text(width / 2, 650, 'TAP TO START', {
        backgroundColor: '#2F6FDB',
        color: '#FFF8E7',
        fixedWidth: 230,
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        padding: { x: 12, y: 16 },
        align: 'center'
      })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    start.on('pointerdown', () => {
      start.setText('COMING SOON!');
    });

    this.add
      .text(width / 2, 755, 'Keep Lulu asleep. Keep your cool.', {
        color: '#1B1B1F',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
      })
      .setOrigin(0.5);
  }

  private drawPram(x: number, y: number): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(8, PALETTE.ink).fillStyle(PALETTE.pramTeal);
    graphics
      .fillRoundedRect(x - 105, y - 25, 160, 95, 26)
      .strokeRoundedRect(x - 105, y - 25, 160, 95, 26);
    graphics.fillStyle(PALETTE.hoodYellow).fillCircle(x - 48, y - 24, 56);
    graphics.lineStyle(8, PALETTE.ink).strokeCircle(x - 48, y - 24, 56);
    graphics
      .fillStyle(PALETTE.ink)
      .fillCircle(x - 68, y + 83, 15)
      .fillCircle(x + 38, y + 83, 15);
    graphics.lineStyle(8, PALETTE.ink).lineBetween(x + 48, y - 4, x + 105, y - 83);
  }
}
