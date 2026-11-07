import { drawFirstWalkHazard, drawFirstWalkPath, drawShadePatch, FIRST_WALK_ART_STYLE } from '../art/firstWalkArt';
import { PALETTE } from '../art/palette';
import { TUNING } from '../config/tuning';
import firstWalkLevel from '../data/levels/c1-first-walk.json';
import tips from '../data/tips.json';
import type { LevelData, LevelHazard, Tip } from '../data/types';
import { Bill, DEFAULT_BILL_STYLE } from '../entities/Bill';
import { Lulu, DEFAULT_LULU_STYLE } from '../entities/Lulu';
import { Pram, DEFAULT_PRAM_STYLE } from '../entities/Pram';
import { Controls } from '../input/Controls';
import {
  advanceFirstWalkRun,
  collideFirstWalkRun,
  createFirstWalkRun,
  shushFirstWalkRun,
  type FirstWalkRun
} from '../systems/firstWalkRun';
import { applySleep, wakeState } from '../systems/sleepMeter';
import { playFeedback } from '../ui/feedback';
import { DEFAULT_UI_STYLE } from '../ui/components';
import { ResultsOverlay } from '../ui/ResultsOverlay';
import { RunHud } from '../ui/RunHud';

const level = firstWalkLevel as LevelData;
const levelTip = (tips as Tip[]).find((tip) => tip.id === level.tipId);

type RenderedHazard = { data: LevelHazard; view: Phaser.GameObjects.Container; collided: boolean };
type RenderedPickup = { data: LevelData['pickups'][number]; view: Phaser.GameObjects.Container; collected: boolean };

/** The sole M1 playable route: data-driven First Walk around the block. */
export class FirstWalkScene extends Phaser.Scene {
  private run: FirstWalkRun = createFirstWalkRun();
  private controls?: Controls;
  private pram?: Pram;
  private lulu?: Lulu;
  private bill?: Bill;
  private hud?: RunHud;
  private results?: ResultsOverlay;
  private hazards: RenderedHazard[] = [];
  private pickups: RenderedPickup[] = [];
  private domRoot?: HTMLDivElement;
  private hudCopy?: HTMLDivElement;
  private shushButton?: HTMLButtonElement;
  private paused = false;
  private previousShush = false;
  private hoodRemaining = 0;
  private peekRemaining = 0;

  public constructor() {
    super('first-walk');
  }

  public create(): void {
    this.run = createFirstWalkRun();
    this.paused = false;
    this.previousShush = false;
    this.hoodRemaining = 0;
    this.peekRemaining = 0;
    this.hazards = [];
    this.pickups = [];
    this.cameras.main.setBackgroundColor(PALETTE.grass);
    this.drawRoute();
    this.createActors();
    this.createHud();
    this.createAccessibleControls();
    this.controls = new Controls(window, {
      splitX: this.scale.width / 2,
      peekTarget: this.game.canvas
    }).subscribe();
    window.addEventListener('keydown', this.onPauseKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.dispose, this);
  }

  public update(_: number, deltaMs: number): void {
    if (this.paused || this.run.status !== 'running' || !this.controls || !this.pram) return;
    const deltaSeconds = Math.min(deltaMs, TUNING.firstWalk.frame.maxDeltaMs) / 1000;
    const control = this.controls.state;
    const speed = control.smooth ? TUNING.slowSpeed : TUNING.pushSpeed;
    const nextX = Phaser.Math.Clamp(
      this.pram.view.x + control.steer * TUNING.steerSpeed * deltaSeconds,
      TUNING.firstWalk.pram.minX,
      TUNING.firstWalk.pram.maxX
    );
    this.pram.setPosition(nextX, TUNING.firstWalk.screen.pramY);
    this.run = advanceFirstWalkRun(this.run, {
      elapsedSeconds: deltaSeconds,
      progressPx: speed * deltaSeconds
    });
    this.hoodRemaining = Math.max(0, this.hoodRemaining - deltaSeconds);
    this.peekRemaining = control.peek ? TUNING.peek.seconds : Math.max(0, this.peekRemaining - deltaSeconds);
    this.applyRouteSleep(control.smooth, deltaSeconds);
    if (control.shush && !this.previousShush) this.requestShush();
    this.previousShush = control.shush;
    this.updateWorld();
    this.updatePresentation();
    if (this.run.status !== 'running') this.showResult();
  }

  private drawRoute(): void {
    const screen = TUNING.firstWalk.screen;
    drawFirstWalkPath(this, {
      x: screen.width / 2,
      y: screen.height / 2,
      width: screen.width,
      height: screen.height
    }, FIRST_WALK_ART_STYLE);
    for (const segment of level.segments) {
      for (const shade of segment.shade ?? []) {
        const x = shade.x === 'left' ? screen.width * 0.25 : screen.width * 0.75;
        const view = drawShadePatch(this, { x, y: -200, width: 110, height: 76 }, FIRST_WALK_ART_STYLE);
        view.setData('from', shade.from).setData('to', shade.to);
      }
    }
    for (const hazard of level.hazards) {
      const routeY = hazard.y ?? hazard.from ?? 0;
      const x = hazard.x === undefined ? screen.width / 2 : TUNING.firstWalk.pram.minX + (TUNING.firstWalk.pram.maxX - TUNING.firstWalk.pram.minX) * hazard.x;
      const kind = hazard.type === 'sunPatch' || hazard.type === 'magpie' ? 'sun' : hazard.type;
      const view = drawFirstWalkHazard(this, kind, { x, y: -200, width: TUNING.firstWalk.hazard.width, height: TUNING.firstWalk.hazard.height }, FIRST_WALK_ART_STYLE);
      view.setData('routeY', routeY);
      this.hazards.push({ data: hazard, view, collided: false });
    }
    for (const pickup of level.pickups) {
      const x = TUNING.firstWalk.pram.minX + (TUNING.firstWalk.pram.maxX - TUNING.firstWalk.pram.minX) * pickup.x;
      const view = this.add.container(x, -200, [
        this.add.rectangle(0, 0, TUNING.firstWalk.pickup.width, TUNING.firstWalk.pickup.height, PALETTE.hoodYellow).setStrokeStyle(3, PALETTE.ink),
        this.add.text(0, 0, 'HOOD', { color: '#1B1B1F', fontSize: '10px', fontStyle: 'bold' }).setOrigin(0.5)
      ]);
      this.pickups.push({ data: pickup, view, collected: false });
    }
  }

  private createActors(): void {
    const pram = TUNING.firstWalk.pram;
    this.pram = new Pram(this, this.scale.width / 2, TUNING.firstWalk.screen.pramY, {
      width: pram.width,
      height: pram.height,
      hoodRadius: pram.hoodRadius,
      wheelRadius: pram.wheelRadius,
      style: DEFAULT_PRAM_STYLE
    });
    const lulu = TUNING.firstWalk.lulu;
    this.lulu = new Lulu(this, this.pram.view.x, this.pram.view.y + lulu.yOffset, {
      headRadius: lulu.headRadius,
      bodyWidth: lulu.bodyWidth,
      bodyHeight: lulu.bodyHeight,
      eyeRadius: lulu.eyeRadius,
      style: DEFAULT_LULU_STYLE
    });
    const bill = TUNING.firstWalk.bill;
    this.bill = new Bill(this, this.pram.view.x, this.pram.view.y + bill.yOffset, {
      torsoWidth: bill.torsoWidth,
      torsoHeight: bill.torsoHeight,
      headRadius: bill.headRadius,
      eyeRadius: bill.eyeRadius,
      style: DEFAULT_BILL_STYLE
    });
  }

  private createHud(): void {
    const layout = TUNING.firstWalk.hud;
    this.hud = new RunHud(this, {
      layout: { ...layout, width: this.scale.width },
      style: DEFAULT_UI_STYLE,
      copy: { feedPrefix: 'Next feed', shushLabel: 'SHHH', pauseLabel: 'Ⅱ' },
      onShush: () => this.requestShush(),
      onPause: () => this.togglePause()
    });
    this.results = new ResultsOverlay(this, {
      layout: TUNING.firstWalk.results,
      style: DEFAULT_UI_STYLE,
      copy: { title: 'Walk result', retry: 'Retry', next: 'Title', tipHeading: 'Dad Fact' },
      onRetry: () => this.scene.restart(),
      onNext: () => this.scene.start('title')
    });
  }

  private applyRouteSleep(smooth: boolean, deltaSeconds: number): void {
    const segment = level.segments.find((candidate) => this.run.progressPx >= candidate.from && this.run.progressPx < candidate.to);
    const inShade = this.isInShade(segment);
    const inSun = level.hazards.some(
      (hazard) =>
        hazard.type === 'sunPatch' &&
        this.run.progressPx >= (hazard.from ?? 0) &&
        this.run.progressPx <= (hazard.to ?? 0) &&
        !inShade &&
        this.hoodRemaining === 0
    );
    const surfaceDrain = segment?.surface === 'cracked' && !smooth ? TUNING.meter.bumpBySurface.cracked * deltaSeconds : 0;
    const recovery = smooth ? TUNING.meter.recoverPerSecSmooth * deltaSeconds : 0;
    const shadeRecovery = inShade ? TUNING.meter.recoverPerSecShade * deltaSeconds : 0;
    const sunDrain = inSun ? TUNING.meter.sunDrainPerSec * TUNING.firstWalk.hazard.sunDrainMultiplier * deltaSeconds : 0;
    this.run = { ...this.run, sleep: applySleep(this.run.sleep, recovery + shadeRecovery - surfaceDrain - sunDrain) };
  }

  private isInShade(segment: LevelData['segments'][number] | undefined): boolean {
    if (!segment || !this.pram) return false;
    return (segment.shade ?? []).some((shade) => {
      const sideMatches = shade.x === 'left' ? this.pram!.view.x < this.scale.width / 2 : this.pram!.view.x >= this.scale.width / 2;
      return sideMatches && this.run.progressPx >= shade.from && this.run.progressPx <= shade.to;
    });
  }

  private updateWorld(): void {
    if (!this.pram) return;
    const routeTop = TUNING.firstWalk.screen.routeTop;
    const playerY = this.pram.view.y;
    for (const child of this.children.list) {
      const from = child.getData?.('from');
      const to = child.getData?.('to');
      if (typeof from === 'number' && typeof to === 'number') {
        const centre = (from + to) / 2;
        (child as Phaser.GameObjects.Container).setY(playerY - (centre - this.run.progressPx));
      }
    }
    for (const hazard of this.hazards) {
      const routeY = hazard.data.y ?? hazard.data.from ?? 0;
      hazard.view.y = playerY - (routeY - this.run.progressPx);
      hazard.view.setVisible(hazard.view.y > routeTop - TUNING.firstWalk.hazard.height && hazard.view.y < this.scale.height + TUNING.firstWalk.hazard.height);
      const collides = Math.abs(hazard.view.x - this.pram.view.x) < TUNING.firstWalk.hazard.collisionX && Math.abs(hazard.view.y - playerY) < TUNING.firstWalk.hazard.collisionY;
      if (collides && !hazard.collided && hazard.data.type !== 'sunPatch') {
        const drain = hazard.data.type === 'kerb' ? TUNING.meter.bumpByHazard.kerb : TUNING.meter.bumpByHazard.pothole;
        const collision = collideFirstWalkRun(this.run, drain);
        this.run = collision.run;
        hazard.collided = collision.applied;
        if (collision.applied) playFeedback(this, { kind: 'bump', reducedMotion: false, durationMs: TUNING.firstWalk.feedback.bumpDurationMs, strength: TUNING.firstWalk.feedback.bumpStrength });
      }
    }
    for (const pickup of this.pickups) {
      pickup.view.y = playerY - (pickup.data.y - this.run.progressPx);
      pickup.view.setVisible(!pickup.collected);
      if (!pickup.collected && Math.abs(pickup.view.x - this.pram.view.x) < TUNING.firstWalk.pickup.collisionX && Math.abs(pickup.view.y - playerY) < TUNING.firstWalk.pickup.collisionY) {
        pickup.collected = true;
        this.hoodRemaining = TUNING.hood.shadeSeconds;
      }
    }
  }

  private updatePresentation(): void {
    if (!this.pram || !this.lulu || !this.bill || !this.hud) return;
    const state = wakeState(this.run.sleep);
    this.lulu.setPosition(this.pram.view.x, this.pram.view.y + TUNING.firstWalk.lulu.yOffset);
    this.lulu.setWakeState(state);
    this.bill.setPosition(this.pram.view.x, this.pram.view.y + TUNING.firstWalk.bill.yOffset);
    this.pram.setWobble(
      Math.sin(this.run.elapsedSeconds * TUNING.firstWalk.animation.wobbleFrequency) *
        (this.run.collisionGraceRemainingSeconds > 0
          ? TUNING.firstWalk.animation.collisionWobbleRadians
          : TUNING.firstWalk.animation.cruiseWobbleRadians)
    );
    this.hud.update({
      wakeState: state,
      feedLabel: `Next feed ${Math.ceil(this.run.feedRemainingSeconds / 60)}:${String(Math.ceil(this.run.feedRemainingSeconds % 60)).padStart(2, '0')}`,
      readyAtMs: TUNING.shush.cooldownSec * 1000,
      nowMs: (TUNING.shush.cooldownSec - this.run.shushCooldownRemainingSeconds) * 1000,
      cooldownMs: TUNING.shush.cooldownSec * 1000
    });
    if (this.hudCopy) this.hudCopy.textContent = `LULU: ${state} · Next feed ${Math.ceil(this.run.feedRemainingSeconds / 60)}:${String(Math.ceil(this.run.feedRemainingSeconds % 60)).padStart(2, '0')}`;
    if (this.shushButton) {
      const ready = this.run.shushCooldownRemainingSeconds === 0;
      this.shushButton.dataset.shushReady = String(ready);
      this.shushButton.setAttribute('aria-disabled', String(!ready));
      this.shushButton.disabled = !ready;
      this.shushButton.textContent = ready ? 'SHHH' : `${Math.ceil(this.run.shushCooldownRemainingSeconds)}s`;
    }
  }

  private requestShush(): void {
    const outcome = shushFirstWalkRun(this.run);
    this.run = outcome.run;
    if (outcome.applied) {
      navigator.vibrate?.(20);
      playFeedback(this, { kind: 'shush', reducedMotion: false, durationMs: TUNING.firstWalk.feedback.shushDurationMs, strength: 0 });
      this.updatePresentation();
    }
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.hudCopy) this.hudCopy.textContent = this.paused ? 'PAUSED · Press P or Esc to continue' : this.hudCopy.textContent;
  }

  private readonly onPauseKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' || event.key.toLowerCase() === 'p') this.togglePause();
  };

  private showResult(): void {
    if (!this.results || !this.run.result) return;
    const won = this.run.result.outcome === 'win';
    if (won) playFeedback(this, { kind: 'success', reducedMotion: false, durationMs: TUNING.firstWalk.feedback.successDurationMs, strength: 0 });
    this.results.show({
      headline: won ? 'Home before the feed!' : 'Lulu woke up',
      cause: won ? level.outro : this.run.result.reason === 'feedExpired' ? 'The feed clock ran out.' : 'The bumps were too much.',
      reward: won ? `+${level.rewards.coffee} coffee · Suspension unlocked` : undefined,
      tipText: levelTip?.text,
      tipSource: levelTip ? `Source: ${levelTip.source}` : undefined
    });
    this.showAccessibleResult(won);
  }

  private createAccessibleControls(): void {
    const root = document.createElement('div');
    root.dataset.testid = 'first-walk-screen';
    root.className = 'game-dom-overlay first-walk-a11y';
    const hud = document.createElement('div');
    hud.dataset.testid = 'first-walk-hud';
    hud.className = 'first-walk-hud-copy';
    root.append(hud);
    this.hudCopy = hud;
    root.append(this.createKeyButton('control-steer-left', '◀', 'a', 'left'));
    root.append(this.createKeyButton('control-steer-right', '▶', 'd', 'right'));
    const shush = document.createElement('button');
    shush.type = 'button';
    shush.dataset.testid = 'shush-button';
    shush.className = 'game-dom-button shush-accessible';
    shush.setAttribute('aria-label', 'Shush Lulu');
    shush.addEventListener('click', () => this.requestShush());
    root.append(shush);
    const pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'game-dom-button pause-accessible';
    pause.textContent = 'Ⅱ';
    pause.setAttribute('aria-label', 'Pause walk');
    pause.addEventListener('click', () => this.togglePause());
    root.append(pause);
    if (new URLSearchParams(window.location.search).has('e2e')) {
      root.append(this.createE2eButton('e2e-finish-win', 'Finish win', () => this.finishForE2e('win')));
      root.append(this.createE2eButton('e2e-finish-loss', 'Finish loss', () => this.finishForE2e('loss')));
    }
    this.getDomHost().append(root);
    this.domRoot = root;
    this.shushButton = shush;
    this.updatePresentation();
  }

  private createKeyButton(
    testId: string,
    label: string,
    key: 'a' | 'd',
    side: 'left' | 'right'
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.testid = testId;
    button.className = `game-dom-button touch-control ${side}`;
    button.textContent = label;
    button.setAttribute('aria-label', key === 'a' ? 'Steer left' : 'Steer right');
    button.addEventListener('pointerdown', () => window.dispatchEvent(new KeyboardEvent('keydown', { key })));
    button.addEventListener('pointerup', () => window.dispatchEvent(new KeyboardEvent('keyup', { key })));
    button.addEventListener('pointercancel', () => window.dispatchEvent(new KeyboardEvent('keyup', { key })));
    return button;
  }

  private createE2eButton(testId: string, label: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.testid = testId;
    button.textContent = label;
    button.className = 'game-dom-button e2e-finish';
    button.addEventListener('click', action);
    return button;
  }

  private finishForE2e(outcome: 'win' | 'loss'): void {
    this.run = outcome === 'win'
      ? { ...this.run, status: 'won', result: { outcome: 'win', reason: 'routeComplete' } }
      : { ...this.run, status: 'lost', result: { outcome: 'loss', reason: 'sleepDepleted' } };
    this.showResult();
  }

  private showAccessibleResult(won: boolean): void {
    const card = document.createElement('section');
    card.dataset.testid = 'result-screen';
    card.className = 'result-dom-card';
    const heading = document.createElement('h2');
    heading.textContent = won ? 'Home before the feed!' : 'Lulu woke up';
    card.append(heading);
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.dataset.testid = 'result-retry';
    retry.className = 'game-dom-button';
    retry.textContent = 'Retry';
    retry.addEventListener('click', () => this.scene.restart());
    const next = document.createElement('button');
    next.type = 'button';
    next.dataset.testid = 'result-next';
    next.className = 'game-dom-button';
    next.textContent = 'Title';
    next.addEventListener('click', () => this.scene.start('title'));
    const actions = document.createElement('div');
    actions.className = 'result-dom-actions';
    actions.append(retry, next);
    card.append(actions);
    this.domRoot?.append(card);
  }

  private dispose(): void {
    this.controls?.dispose();
    this.controls = undefined;
    window.removeEventListener('keydown', this.onPauseKey);
    this.hud?.destroy();
    this.results?.destroy();
    this.domRoot?.remove();
    this.domRoot = undefined;
    this.shushButton = undefined;
  }

  private getDomHost(): HTMLElement {
    const host = document.getElementById('game');
    if (!host) throw new Error('Pram Panic game host is missing.');
    return host;
  }
}
