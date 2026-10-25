export type WakeState = 'Sleeping' | 'Stirring' | 'Grunting' | 'Awake' | 'Crying';

export const applySleep = (value: number, delta: number): number =>
  Math.max(0, Math.min(100, value + delta));

export const wakeState = (value: number): WakeState => {
  if (value <= 0) return 'Crying';
  if (value < 20) return 'Awake';
  if (value < 45) return 'Grunting';
  if (value < 70) return 'Stirring';
  return 'Sleeping';
};
