import { describe, expect, it } from 'vitest';
import firstWalkLevel from '../../src/data/levels/c1-first-walk.json';
import sounds from '../../src/data/sounds.json';
import tips from '../../src/data/tips.json';
import { isLevelData, type LevelData, type SoundCatalog, type Tip } from '../../src/data/types';

const medicalInfoFooter =
  'General info, not medical advice. Check with your GP or maternal and child health nurse.';

describe('First Walk scene data contract', () => {
  it('provides a valid finite, safe first-walk route for a generic scene', () => {
    const level = firstWalkLevel as unknown as LevelData;

    expect(isLevelData(level)).toBe(true);
    expect(level).toMatchObject({
      id: 'c1-first-walk',
      mode: 'push',
      feedClockSeconds: 110,
      lengthPx: 9000,
      tipId: 'tip-sun-safety'
    });
    expect(level.hazards.map((hazard) => hazard.type)).toEqual(
      expect.arrayContaining(['pothole', 'kerb', 'sunPatch', 'magpie', 'sprinkler', 'bin'])
    );
    expect(level.pickups).toEqual([{ type: 'hood', y: 2900, x: 0.5 }]);
  });

  it('ships only verified source data and the required medical-information footer', () => {
    const shippedTips = tips as unknown as Tip[];

    expect(shippedTips).toHaveLength(1);
    expect(shippedTips).toEqual([
      expect.objectContaining({
        id: 'tip-sun-safety',
        text: 'Keep babies under 12 months out of direct sun. Never drape a blanket or wrap over the pram; it traps heat. Use the hood and pick shady routes.',
        levelId: 'c1-first-walk',
        source: 'Cancer Council, Red Nose',
        verified: true,
        footer: medicalInfoFooter
      })
    ]);
  });

  it('provides every M1 wake-state and music sound slot with a placeholder', () => {
    const catalog = sounds as unknown as SoundCatalog;
    const slots = catalog.sounds.map((sound) => sound.id);

    expect(slots).toEqual(
      expect.arrayContaining([
        'lulu_sleep_snore',
        'lulu_stir_sigh',
        'lulu_grunt',
        'lulu_whimper',
        'lulu_cry_wail',
        'music_lullaby',
        'music_lullaby_detuned'
      ])
    );
    expect(catalog.sounds.every((sound) => sound.placeholder !== undefined)).toBe(true);
  });
});
