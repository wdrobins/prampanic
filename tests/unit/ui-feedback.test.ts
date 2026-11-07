import { describe, expect, it } from 'vitest';
import {
  cooldownProgress,
  feedbackPlan,
  platformPrefersReducedMotion,
  shouldReduceMotion,
  type FeedbackInput
} from '../../src/ui/feedback';

describe('run feedback helpers', () => {
  it('reports shush cooldown progress with caller-provided duration', () => {
    expect(cooldownProgress({ nowMs: 2_000, readyAtMs: 8_000, durationMs: 6_000 })).toBe(1);
    expect(cooldownProgress({ nowMs: 5_000, readyAtMs: 8_000, durationMs: 6_000 })).toBe(0.5);
    expect(cooldownProgress({ nowMs: 9_000, readyAtMs: 8_000, durationMs: 6_000 })).toBe(0);
  });

  it('makes critical feedback readable without motion when reduced motion is enabled', () => {
    const input: FeedbackInput = {
      kind: 'wake-up',
      reducedMotion: true,
      durationMs: 240,
      strength: 0.02
    };

    expect(feedbackPlan(input)).toEqual({ flash: true, shake: undefined, pulse: true });
  });

  it('uses motion only when the caller has not opted out', () => {
    expect(
      feedbackPlan({ kind: 'bump', reducedMotion: false, durationMs: 180, strength: 0.01 })
    ).toEqual({ flash: false, shake: { durationMs: 180, strength: 0.01 }, pulse: false });
  });

  it('reads the platform reduced-motion media preference when available', () => {
    expect(
      platformPrefersReducedMotion((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)'
      }))
    ).toBe(true);
    expect(platformPrefersReducedMotion(() => ({ matches: false }))).toBe(false);
  });

  it('honours an explicit setting before the platform preference', () => {
    expect(shouldReduceMotion({ preference: 'reduce', platformPrefersReducedMotion: false })).toBe(
      true
    );
    expect(shouldReduceMotion({ preference: 'full', platformPrefersReducedMotion: true })).toBe(
      false
    );
  });
});
