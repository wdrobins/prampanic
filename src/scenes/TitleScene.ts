import { PALETTE } from '../art/palette';
import { TUNING } from '../config/tuning';
import { formatFeedClock, tickFeedClock } from '../systems/feedClock';
import { applySleep, wakeState } from '../systems/sleepMeter';

export class TitleScene extends Phaser.Scene {
  private walking = false;
  private pram?: Phaser.GameObjects.Container;
  private hazards: Phaser.GameObjects.Rectangle[] = [];
  private sleep = TUNING.meter.max;
  private feed = TUNING.feedClock.defaultSeconds;
  private frameCount = 0;
  private hud?: Phaser.GameObjects.Text;

  public constructor() {
    super('title');
  }

  public create(): void {
    this.showTitle();
  }

  public startWalk(): void {
    if (this.walking) return;
    this.walking = true;
    this.children.removeAll(true);
    this.hazards = [];
    this.sleep = TUNING.meter.max;
    this.feed = TUNING.feedClock.defaultSeconds;
    this.frameCount = 0;
    this.cameras.main.setBackgroundColor(PALETTE.grass);
    this.add.rectangle(195, 422, 310, 844, PALETTE.footpath);
    this.add
      .text(195, 28, 'FIRST WALK · WEEK 2', {
        color: '#1B1B1F',
        fontSize: '18px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.hud = this.add.text(18, 58, '', { color: '#1B1B1F', fontSize: '16px', fontStyle: 'bold' });
    this.pram = this.add.container(195, 650, [
      this.add.rectangle(0, 0, 88, 44, PALETTE.pramTeal).setStrokeStyle(4, PALETTE.ink),
      this.add.circle(-23, -24, 28, PALETTE.hoodYellow).setStrokeStyle(4, PALETTE.ink),
      this.add.circle(-28, 29, 10, PALETTE.ink),
      this.add.circle(30, 29, 10, PALETTE.ink)
    ]);
    this.addHazard(95, 310, 0xe63946);
    this.addHazard(295, 130, 0xffc93c);
    this.addHazard(185, -90, 0x5a5a5a);
    const shush = this.add
      .text(300, 748, 'SHHH', {
        backgroundColor: '#2F6FDB',
        color: '#FFF8E7',
        fontSize: '20px',
        fontStyle: 'bold',
        padding: { x: 18, y: 14 }
      })
      .setOrigin(0.5)
      .setInteractive();
    shush.on('pointerdown', () => {
      this.sleep = applySleep(this.sleep, TUNING.shush.recover);
      navigator.vibrate?.(20);
    });
    this.add
      .text(195, 805, 'Drag LEFT to steer · hold RIGHT to slow · tap SHHH to settle Lulu', {
        align: 'center',
        color: '#1B1B1F',
        fontSize: '11px',
        wordWrap: { width: 360 }
      })
      .setOrigin(0.5);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.walking && pointer.isDown && pointer.x < 195 && this.pram)
        this.pram.x = Phaser.Math.Clamp(pointer.x, 55, 335);
    });
    this.registry.set('firstWalkReady', true);
    this.registry.set('firstWalkFrameCount', 0);
  }

  public update(_: number, deltaMs: number): void {
    if (!this.walking || !this.pram || !this.hud) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    this.frameCount += 1;
    this.registry.set('firstWalkFrameCount', this.frameCount);
    const pointer = this.input.activePointer;
    const smooth = pointer.isDown && pointer.x >= 195 && pointer.y < 710;
    const speed = smooth ? TUNING.slowSpeed : TUNING.pushSpeed;
    this.feed = tickFeedClock({ remaining: this.feed, expired: false }, dt).remaining;
    this.sleep = applySleep(
      this.sleep,
      smooth ? TUNING.meter.recoverPerSecSmooth * dt : -0.45 * dt
    );
    for (const hazard of this.hazards) {
      hazard.y += speed * dt;
      if (hazard.y > 900) {
        hazard.y = -70;
        hazard.x = Phaser.Math.Between(70, 320);
      }
      if (Math.abs(hazard.x - this.pram.x) < 55 && Math.abs(hazard.y - this.pram.y) < 55) {
        this.sleep = applySleep(this.sleep, -TUNING.meter.bumpByHazard.pothole);
        hazard.y = -120;
        this.cameras.main.shake(80, 0.006);
      }
    }
    this.hud.setText(
      `LULU: ${wakeState(this.sleep)}\nNext feed ${formatFeedClock(this.feed)} · Sleep ${Math.round(this.sleep)}%`
    );
    if (this.feed <= 0 || this.sleep <= 0) this.resetWalk();
  }

  private showTitle(): void {
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
        fontSize: '18px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
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
    start.on('pointerdown', () => this.startWalk());
  }

  private addHazard(x: number, y: number, colour: number): void {
    this.hazards.push(this.add.rectangle(x, y, 60, 46, colour).setStrokeStyle(3, PALETTE.ink));
  }

  private resetWalk(): void {
    this.walking = false;
    this.children.removeAll(true);
    this.hazards = [];
    this.showTitle();
  }
}
