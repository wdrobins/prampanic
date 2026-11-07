import { TUNING } from '../config/tuning';
import firstWalkLevel from '../data/levels/c1-first-walk.json';
import type { LevelData } from '../data/types';
import { applySleep } from './sleepMeter';

const level = firstWalkLevel as LevelData;

export const scaleFirstWalkSleepDrain = (drain: number): number =>
  drain * level.modifiers.sleepDrainMultiplier;

export type FirstWalkRunStatus = 'running' | 'won' | 'lost';
export type FirstWalkLossReason = 'feedExpired' | 'sleepDepleted';
export type FirstWalkResult =
  | { outcome: 'win'; reason: 'routeComplete' }
  | { outcome: 'loss'; reason: FirstWalkLossReason };

export interface FirstWalkRun {
  status: FirstWalkRunStatus;
  elapsedSeconds: number;
  progressPx: number;
  sleep: number;
  feedRemainingSeconds: number;
  shushCooldownRemainingSeconds: number;
  collisionGraceRemainingSeconds: number;
  result: FirstWalkResult | null;
}

export interface FirstWalkAdvance {
  elapsedSeconds: number;
  progressPx: number;
}

export interface FirstWalkShushResult {
  applied: boolean;
  run: FirstWalkRun;
}

export interface FirstWalkCollisionResult {
  applied: boolean;
  run: FirstWalkRun;
}

export const createFirstWalkRun = (): FirstWalkRun => ({
  status: 'running',
  elapsedSeconds: 0,
  progressPx: 0,
  sleep: TUNING.meter.max,
  feedRemainingSeconds: level.feedClockSeconds,
  shushCooldownRemainingSeconds: 0,
  collisionGraceRemainingSeconds: 0,
  result: null
});

const finish = (run: FirstWalkRun): FirstWalkRun => {
  if (run.sleep <= 0) {
    return { ...run, status: 'lost', result: { outcome: 'loss', reason: 'sleepDepleted' } };
  }
  if (run.feedRemainingSeconds <= 0) {
    return { ...run, status: 'lost', result: { outcome: 'loss', reason: 'feedExpired' } };
  }
  if (run.progressPx >= level.lengthPx) {
    return { ...run, status: 'won', result: { outcome: 'win', reason: 'routeComplete' } };
  }
  return run;
};

export const advanceFirstWalkRun = (run: FirstWalkRun, advance: FirstWalkAdvance): FirstWalkRun => {
  if (run.status !== 'running') return run;
  const elapsedSeconds = Math.max(0, advance.elapsedSeconds);
  const progressPx = Math.max(0, advance.progressPx);
  return finish({
    ...run,
    elapsedSeconds: run.elapsedSeconds + elapsedSeconds,
    progressPx: Math.min(level.lengthPx, run.progressPx + progressPx),
    feedRemainingSeconds: Math.max(0, run.feedRemainingSeconds - elapsedSeconds),
    shushCooldownRemainingSeconds: Math.max(0, run.shushCooldownRemainingSeconds - elapsedSeconds),
    collisionGraceRemainingSeconds: Math.max(0, run.collisionGraceRemainingSeconds - elapsedSeconds)
  });
};

export const shushFirstWalkRun = (run: FirstWalkRun): FirstWalkShushResult => {
  if (run.status !== 'running' || run.shushCooldownRemainingSeconds > 0) {
    return { applied: false, run };
  }
  return {
    applied: true,
    run: finish({
      ...run,
      sleep: applySleep(run.sleep, TUNING.shush.recover),
      shushCooldownRemainingSeconds: TUNING.shush.cooldownSec
    })
  };
};

export const collideFirstWalkRun = (
  run: FirstWalkRun,
  sleepDrain: number
): FirstWalkCollisionResult => {
  if (run.status !== 'running' || run.collisionGraceRemainingSeconds > 0) {
    return { applied: false, run };
  }
  return {
    applied: true,
    run: finish({
      ...run,
      sleep: applySleep(run.sleep, -Math.max(0, sleepDrain)),
      collisionGraceRemainingSeconds: TUNING.collision.graceSeconds
    })
  };
};
