import { describe, expect, it } from 'vitest';
import { applySleep, wakeState } from '../../src/systems/sleepMeter';

describe('sleep meter', () => {
  it('drains from hazards and recovers while moving smoothly', () => {
    expect(applySleep(80, -18)).toBe(62);
    expect(applySleep(62, 4)).toBe(66);
  });

  it('clamps at the sleep meter bounds', () => {
    expect(applySleep(3, -12)).toBe(0);
    expect(applySleep(99, 8)).toBe(100);
  });

  it('maps every wake state to its documented threshold', () => {
    expect(wakeState(85)).toBe('Sleeping');
    expect(wakeState(60)).toBe('Stirring');
    expect(wakeState(30)).toBe('Grunting');
    expect(wakeState(10)).toBe('Awake');
    expect(wakeState(0)).toBe('Crying');
  });
});
