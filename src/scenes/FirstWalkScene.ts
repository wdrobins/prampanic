import { PALETTE } from '../art/palette';
import { TUNING } from '../config/tuning';
import { formatFeedClock, tickFeedClock } from '../systems/feedClock';
import { applySleep, wakeState } from '../systems/sleepMeter';

export class FirstWalkScene extends Phaser.Scene {
  private pram!: Phaser.GameObjects.Container;
  private hazards: Phaser.GameObjects.Rectangle[] = [];
  private sleep = 100;
  private feed: number = TUNING.feedClock.defaultSeconds;
  private slow = false;
  private shushAt = 0;
  private hud!: Phaser.GameObjects.Text;
  private stateText!: Phaser.GameObjects.Text;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;

  public constructor() { super('first-walk'); }

  public create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.grass);
    this.add.rectangle(195, 422, 310, 1800, PALETTE.footpath).setOrigin(0.5);
    for (let y = 80; y < 1600; y += 160) this.add.rectangle(195, y, 300, 3, 0xcfc6ae);
    this.add.text(195, 35, 'FIRST WALK · WEEK 2', { fontSize: '18px', color: '#1B1B1F', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
    this.stateText = this.add.text(18, 64, '', { fontSize: '18px', color: '#1B1B1F', fontStyle: 'bold' }).setScrollFactor(0);
    this.hud = this.add.text(18, 90, '', { fontSize: '16px', color: '#1B1B1F' }).setScrollFactor(0);
    const shush = this.add.text(300, 744, 'SHHH', { fontSize: '20px', color: '#FFF8E7', backgroundColor: '#2F6FDB', padding: { x: 18, y: 14 } }).setScrollFactor(0).setInteractive();
    shush.on('pointerdown', () => this.shush());
    this.add.text(18, 790, 'Drag left half to steer · lift to go smooth · tap right to shush', { fontSize: '11px', color: '#1B1B1F', wordWrap: { width: 350 } }).setScrollFactor(0);
    this.pram = this.add.container(195, 620, [
      this.add.rectangle(0, 0, 80, 45, PALETTE.pramTeal).setStrokeStyle(4, PALETTE.ink),
      this.add.circle(-22, -23, 28, PALETTE.hoodYellow).setStrokeStyle(4, PALETTE.ink),
      this.add.rectangle(38, -42, 12, 56, PALETTE.dadBlue).setStrokeStyle(3, PALETTE.ink)
    ]).setSize(100, 90);
    [
      [110, 430, 'POTHOLE'], [270, 285, 'SUN'], [155, 130, 'BIN'], [255, -30, 'KERB'], [95, -190, 'MAGPIE']
    ].forEach(([x, y, label]) => this.addHazard(x as number, y as number, label as string));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (p.isDown && p.x < 195) this.pram.x = Phaser.Math.Clamp(p.x * 2, 55, 335); });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => { if (p.x >= 195) this.shush(); });
    this.keys = this.input.keyboard?.addKeys('A,D,S') as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.input.keyboard?.on('keydown-A', () => (this.pram.x -= 35));
    this.input.keyboard?.on('keydown-D', () => (this.pram.x += 35));
    this.input.keyboard?.on('keydown-SPACE', () => this.shush());
    this.input.keyboard?.on('keydown-S', () => (this.slow = true));
    this.input.keyboard?.on('keyup-S', () => (this.slow = false));
  }

  public update(_: number, deltaMs: number): void {
    const dt = deltaMs / 1000;
    const keys = this.keys;
    if (keys?.A.isDown) this.pram.x -= TUNING.steerSpeed * dt;
    if (keys?.D.isDown) this.pram.x += TUNING.steerSpeed * dt;
    this.pram.x = Phaser.Math.Clamp(this.pram.x, 55, 335);
    this.slow = Boolean(keys?.S.isDown) || Boolean(this.input.activePointer.isDown && this.input.activePointer.x > 195);
    const speed = this.slow ? TUNING.slowSpeed : TUNING.pushSpeed;
    this.hazards.forEach((hazard) => { hazard.y += speed * dt; if (hazard.y > 900) hazard.y = -300; });
    this.feed = tickFeedClock({ remaining: this.feed, expired: false }, dt).remaining;
    this.sleep = applySleep(this.sleep, this.slow ? TUNING.meter.recoverPerSecSmooth * dt : -0.35 * dt);
    for (const hazard of this.hazards) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.pram.getBounds(), hazard.getBounds())) {
        this.sleep = applySleep(this.sleep, -TUNING.meter.bumpByHazard.pothole);
        hazard.y = -350;
        this.cameras.main.shake(100, 0.008);
      }
    }
    if (this.feed <= 0 || this.sleep <= 0) this.finish(false);
    if (this.feed < 45) this.finish(true);
    const state = wakeState(this.sleep);
    this.stateText.setText(`LULU: ${state} ${'Z'.repeat(state === 'Sleeping' ? 3 : 1)}`);
    this.hud.setText(`Next feed ${formatFeedClock(this.feed)}   ·   Sleep ${Math.round(this.sleep)}%`);
  }

  private addHazard(x: number, y: number, label: string): void {
    const colour = label === 'SUN' ? 0xffc93c : label === 'MAGPIE' ? 0x1b1b1f : 0xe63946;
    const box = this.add.rectangle(x, y, 58, 48, colour).setStrokeStyle(3, PALETTE.ink);
    this.add.text(x, y, label, { fontSize: '10px', color: '#FFF8E7' }).setOrigin(0.5);
    this.hazards.push(box);
  }

  private shush(): void {
    if (this.time.now < this.shushAt) return;
    this.sleep = applySleep(this.sleep, TUNING.shush.recover);
    this.shushAt = this.time.now + TUNING.shush.cooldownSec * 1000;
    navigator.vibrate?.(20);
  }

  private finish(win: boolean): void {
    this.scene.start('title', { result: win ? 'Home before the feed! Tip: Keep babies under 12 months out of direct sun. Never drape a blanket or wrap over the pram; it traps heat. Use the hood and pick shady routes.' : 'Lulu woke up. Tap to retry.' });
  }
}
