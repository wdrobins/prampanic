import { TUNING } from '../config/tuning';

export type WakeState = 'Sleeping' | 'Stirring' | 'Grunting' | 'Awake' | 'Crying';

export interface SleepMeter {
  value: number;
  state: WakeState;
}

export const applySleep = (value: number, delta: number): number =>
  Math.max(0, Math.min(TUNING.meter.max, value + delta));

export const wakeState = (value: number): WakeState => {
  if (value <= TUNING.meter.thresholds.crying) return 'Crying';
  if (value < TUNING.meter.thresholds.awake) return 'Awake';
  if (value < TUNING.meter.thresholds.grunting) return 'Grunting';
  if (value < TUNING.meter.thresholds.stirring) return 'Stirring';
  return 'Sleeping';
};

export const createSleepMeter = (value: number = TUNING.meter.max): SleepMeter => ({
  value: applySleep(value, 0),
  state: wakeState(value)
});

const recoveringWakeState = (value: number): WakeState => {
  const thresholds = TUNING.meter.hysteresisRecoveryThresholds;
  if (value >= thresholds.sleeping) return 'Sleeping';
  if (value >= thresholds.stirring) return 'Stirring';
  if (value >= thresholds.grunting) return 'Grunting';
  if (value >= thresholds.awake) return 'Awake';
  return 'Crying';
};

export const transitionSleepMeter = (meter: SleepMeter, delta: number): SleepMeter => {
  const value = applySleep(meter.value, delta);
  return { value, state: delta > 0 ? recoveringWakeState(value) : wakeState(value) };
};
