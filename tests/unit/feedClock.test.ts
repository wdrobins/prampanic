import { describe, expect, it } from 'vitest';
import {
  createFeedClock,
  formatFeedClock,
  resetFeedClock,
  tickFeedClock
} from '../../src/systems/feedClock';

describe('feed clock', () => {
  it('creates and resets a non-expired countdown', () => {
    expect(createFeedClock(90)).toEqual({ remaining: 90, expired: false });
    expect(resetFeedClock(45)).toEqual({ remaining: 45, expired: false });
  });

  it('does not revive an expired clock when advanced', () => {
    expect(tickFeedClock({ remaining: 0, expired: true }, 1)).toEqual({
      remaining: 0,
      expired: true
    });
  });

  it('formats rounded remaining seconds for the HUD', () => {
    expect(formatFeedClock(89.1)).toBe('1:30');
    expect(formatFeedClock(0)).toBe('0:00');
  });
});
