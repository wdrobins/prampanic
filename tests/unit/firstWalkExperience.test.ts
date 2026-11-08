import { describe, expect, it } from 'vitest';
import { routeProgress } from '../../src/systems/routeProgress';
import { standInSoundPlan } from '../../src/audio/standInSounds';

describe('First Walk experience helpers', () => {
  it('maps route distance to a bounded percentage for the visible progress gauge', () => {
    expect(routeProgress(0, 9000)).toBe(0);
    expect(routeProgress(4500, 9000)).toBe(0.5);
    expect(routeProgress(12000, 9000)).toBe(1);
  });

  it('uses short, recognisable browser-safe stand-in cues for gameplay events', () => {
    expect(standInSoundPlan('shush')).toMatchObject({ waveform: 'sine', durationMs: 140 });
    expect(standInSoundPlan('bump')).toMatchObject({ waveform: 'triangle', durationMs: 180 });
    expect(standInSoundPlan('win')).toMatchObject({ waveform: 'sine', durationMs: 280 });
  });
});
