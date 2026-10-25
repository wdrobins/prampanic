import { describe, expect, it } from 'vitest';
import { TUNING } from '../../src/config/tuning';

describe('M0 tuning', () => {
  it('keeps the documented starting values in one immutable configuration object', () => {
    expect(TUNING.pushSpeed).toBe(220);
    expect(TUNING.meter.max).toBe(100);
    expect(TUNING.meter.thresholds).toEqual({
      stirring: 70,
      grunting: 45,
      awake: 20,
      crying: 0
    });
    expect(TUNING.settle).toEqual({ seconds: 10, beatsRequired: 8, windowMs: 220 });
  });
});
