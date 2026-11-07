export type LevelMode = 'push' | 'drive' | 'room' | 'minigame';
export type Surface = 'footpath' | 'cracked' | 'kerb';

export interface LevelSegment {
  from: number;
  to: number;
  surface: Surface;
  shade?: Array<{ x: 'left' | 'right'; from: number; to: number }>;
}

export interface LevelHazard {
  type: 'pothole' | 'kerb' | 'sunPatch' | 'magpie' | 'sprinkler' | 'bin';
  y?: number;
  x?: number;
  from?: number;
  to?: number;
  triggerDistance?: number;
}

export interface LevelPickup {
  type: 'hood';
  y: number;
  x: number;
}

export interface LevelData {
  id: string;
  title: string;
  chapter: number;
  luluAge: string;
  mode: LevelMode;
  bonus: boolean;
  feedClockSeconds: number;
  feedClockRevealAt: number;
  lengthPx: number;
  modifiers: { sleepDrainMultiplier: number };
  segments: LevelSegment[];
  hazards: LevelHazard[];
  pickups: LevelPickup[];
  tipId: string;
  unlocks: string[];
  rewards: { coffee: number };
  intro: string;
  outro: string;
}

export interface Tip {
  id: string;
  title: string;
  text: string;
  source: string;
  sourceUrl: string;
  levelId: string;
  card: number;
  verified: false;
}

export interface SoundSlot {
  id: string;
  files: string[];
  loop: boolean;
  placeholder: { recipe: 'tone' | 'noise' | 'silence' };
}

export interface SoundCatalog {
  sounds: SoundSlot[];
}

export const isLevelData = (value: unknown): value is LevelData => {
  if (typeof value !== 'object' || value === null) return false;
  const level = value as Partial<LevelData>;
  return (
    typeof level.id === 'string' &&
    level.mode === 'push' &&
    typeof level.feedClockSeconds === 'number' &&
    typeof level.lengthPx === 'number' &&
    Array.isArray(level.segments) &&
    Array.isArray(level.hazards) &&
    Array.isArray(level.pickups) &&
    typeof level.tipId === 'string'
  );
};
