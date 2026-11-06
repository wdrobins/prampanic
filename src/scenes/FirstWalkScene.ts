import { PALETTE } from '../art/palette';
import { TUNING } from '../config/tuning';
import { formatFeedClock, tickFeedClock } from '../systems/feedClock';
import { applySleep, wakeState } from '../systems/sleepMeter';

type Hazard = { box: Phaser.GameObjects.Rectangle; label: Phaser.GameObjects.Text };

/** A deliberately small, phone-first Level 3 vertical slice. */
export class FirstWalkScene extends Phaser.Scene {
  private pram!: Phaser.GameObjects.Container;
  private hazards: Hazard[] = [];
  private sleep = TUNING.meter.max;
  private feed = TUNING.feedClock.defaultSeconds;
  private smooth = false;
  private shushAt = 0;
  private hud!: Phaser.GameObjects.Text;
  private stateText!: Phaser.GameObjects.Text;
  private frameCount = 0;
  private complete = false;

  public constructor() {
    super('first-walk');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.grass);
    this.add.rectangle(195, 422, 310, 844, PALETTE.footpath);
    this.add
      .text(195, 28, 'FIRST WALK · WEEK 2', {
        color: '#1B1B1F',
        fontSize: '18px',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);
    this.stateText = this.add.text(18, 58, '', {
      color: '#1B1B1F',
      fontSize: '17px',
      fontStyle: 'bold'
    });
    this.hud = this.add.text(18, 82, '', { color: '#1B1B1F', fontSize: '15px' });

    this.pram = this.add.container(195, 650, [
      this.add.rectangle(0, 0, 88, 44, PALETTE.pramTeal).setStrokeStyle(4, PALETTE.ink),
      this.add.circle(-23, -24, 28, PALETTE.hoodYellow).setStrokeStyle(4, PALETTE.ink),
      this.add.circle(-28, 29, 10, PALETTE.ink),
      this.add.circle(30, 29, 10, PALETTE.ink)
    ]);

    this.addHazard(90, 310, 'POTHOLE', 0xe63946);
    this.addHazard(295, 130, 'SUN', 0xffc93c);
    this.addHazard(185, -90, 'BIN', 0x5a5a5a);

    const shush = this.add
      .text(300, 748, 'SHHH', {
        backgroundColor: '#2F6FDB',
        color: '#FFF8E7',
        fontSize: '20px',
        fontStyle: 'bold',
        padding: { x: 18, y: 14 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    shush.on('pointerdown', () => this.shush());

    this.add
      .text(195, 805, 'Drag LEFT to steer · hold RIGHT to slow · tap SHHH to settle Lulu', {
        align: 'center',
        color: '#1B1B1F',
        fontSize: '11px',
        wordWrap: { width: 360 }
      })
      .setOrigin(0.5);

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && pointer.x < 195) this.pram.x = Phaser.Math.Clamp(pointer.x, 55, 335);
    });
    this.registry.set('firstWalkReady', true);
    this.registry.set('firstWalkFrameCount', 0);
  }

  public update(_: number, deltaMs: number): void {
    if (this.complete) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    this.frameCount += 1;
    this.registry.set('firstWalkFrameCount', this.frameCount);

    const pointer = this.input.activePointer;
    this.smooth = pointer.isDown && pointer.x >= 195 && pointer.y < 710;
    const speed = this.smooth ? TUNING.slowSpeed : TUNING.pushSpeed;
    this.pram.x = Phaser.Math.Clamp(this.pram.x, 55, 335);
    this.feed = tickFeedClock({ remaining: this.feed, expired: false }, dt).remaining;
    this.sleep = applySleep(
      this.sleep,
      this.smooth ? TUNING.meter.recoverPerSecSmooth * dt : -0.45 * dt
    );

    for (const hazard of this.hazards) {
      hazard.box.y += speed * dt;
      hazard.label.y = hazard.box.y;
      if (hazard.box.y > 900) {
        hazard.box.y = -70;
        hazard.label.y = -70;
        hazard.box.x = Phaser.Math.Between(70, 320);
        hazard.label.x = hazard.box.x;
      }
      if (Math.abs(hazard.box.x - this.pram.x) < 55 && Math.abs(hazard.box.y - this.pram.y) < 55) {
        this.sleep = applySleep(this.sleep, -TUNING.meter.bumpByHazard.pothole);
        hazard.box.y = -120;
        hazard.label.y = -120;
        this.cameras.main.shake(80, 0.006);
      }
    }

    this.stateText.setText(`LULU: ${wakeState(this.sleep)}`);
    this.hud.setText(`Next feed ${formatFeedClock(this.feed)}  ·  Sleep ${Math.round(this.sleep)}%`);
    if (this.feed <= 0 || this.sleep <= 0) this.finish(false);
  }

  private addHazard(x: number, y: number, label: string, colour: number): void {
    const box = this.add.rectangle(x, y, 60, 46, colour).setStrokeStyle(3, PALETTE.ink);
    const text = this.add
      .text(x, y, label, { color: '#FFF8E7', fontSize: '10px', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.hazards.push({ box, label: text });
  }

  private shush(): void {
    if (this.time.now < this.shushAt) return;
    this.sleep = applySleep(this.sleep, TUNING.shush.recover);
    this.shushAt = this.time.now + TUNING.shush.cooldownSec * 1000;
    navigator.vibrate?.(20);
  }

  private finish(win: boolean): void {
    this.complete = true;
    this.scene.start('title', {
      result: win ? 'Home before the feed.' : 'Lulu woke up. Tap to retry.'
    });
  }
}
