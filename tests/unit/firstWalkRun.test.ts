import { describe, expect, it } from 'vitest';
import {
  advanceFirstWalkRun,
  collideFirstWalkRun,
  createFirstWalkRun,
  shushFirstWalkRun,
  type FirstWalkRun
} from '../../src/systems/firstWalkRun';

describe('First Walk run state', () => {
  it('starts a finite run using the level feed time and length', () => {
    const run = createFirstWalkRun();

    expect(run).toMatchObject({
      status: 'running',
      elapsedSeconds: 0,
      progressPx: 0,
      sleep: 100,
      feedRemainingSeconds: 90,
      shushCooldownRemainingSeconds: 0,
      collisionGraceRemainingSeconds: 0,
      result: null
    });
  });

  it('advances elapsed time, forward progress, feed time, and timers together', () => {
    const state: FirstWalkRun = {
      ...createFirstWalkRun(),
      shushCooldownRemainingSeconds: 3,
      collisionGraceRemainingSeconds: 0.5
    };

    expect(advanceFirstWalkRun(state, { elapsedSeconds: 1, progressPx: 220 })).toMatchObject({
      elapsedSeconds: 1,
      progressPx: 220,
      feedRemainingSeconds: 89,
      shushCooldownRemainingSeconds: 2,
      collisionGraceRemainingSeconds: 0,
      status: 'running'
    });
  });

  it('accepts one shush then enforces its cooldown', () => {
    const first = shushFirstWalkRun({ ...createFirstWalkRun(), sleep: 70 });
    const second = shushFirstWalkRun(first.run);

    expect(first.applied).toBe(true);
    expect(first.run.sleep).toBe(82);
    expect(first.run.shushCooldownRemainingSeconds).toBe(6);
    expect(second.applied).toBe(false);
    expect(second.run).toEqual(first.run);
  });

  it('ignores repeated collisions during the configured grace interval', () => {
    const first = collideFirstWalkRun(createFirstWalkRun(), 18);
    const repeated = collideFirstWalkRun(first.run, 18);

    expect(first.applied).toBe(true);
    expect(first.run.sleep).toBe(82);
    expect(repeated.applied).toBe(false);
    expect(repeated.run.sleep).toBe(82);
  });

  it('wins when the route length is reached before a loss condition', () => {
    const run = advanceFirstWalkRun(createFirstWalkRun(), {
      elapsedSeconds: 10,
      progressPx: 9000
    });

    expect(run).toMatchObject({
      status: 'won',
      result: { outcome: 'win', reason: 'routeComplete' }
    });
  });

  it('loses with a precise reason when the feed clock expires', () => {
    const run = advanceFirstWalkRun(createFirstWalkRun(), {
      elapsedSeconds: 90,
      progressPx: 100
    });

    expect(run).toMatchObject({
      status: 'lost',
      feedRemainingSeconds: 0,
      result: { outcome: 'loss', reason: 'feedExpired' }
    });
  });

  it('loses with a precise reason when a collision depletes sleep', () => {
    const run = collideFirstWalkRun({ ...createFirstWalkRun(), sleep: 5 }, 18).run;

    expect(run).toMatchObject({
      status: 'lost',
      sleep: 0,
      result: { outcome: 'loss', reason: 'sleepDepleted' }
    });
  });
});
