export type StandInSound = 'shush' | 'bump' | 'hood' | 'win' | 'loss';

export interface StandInSoundPlan {
  waveform: OscillatorType;
  frequencyHz: number;
  endFrequencyHz: number;
  durationMs: number;
  volume: number;
}

const PLANS: Record<StandInSound, StandInSoundPlan> = {
  shush: { waveform: 'sine', frequencyHz: 740, endFrequencyHz: 620, durationMs: 140, volume: 0.04 },
  bump: {
    waveform: 'triangle',
    frequencyHz: 150,
    endFrequencyHz: 70,
    durationMs: 180,
    volume: 0.07
  },
  hood: { waveform: 'sine', frequencyHz: 440, endFrequencyHz: 660, durationMs: 150, volume: 0.045 },
  win: { waveform: 'sine', frequencyHz: 520, endFrequencyHz: 780, durationMs: 280, volume: 0.055 },
  loss: {
    waveform: 'triangle',
    frequencyHz: 220,
    endFrequencyHz: 110,
    durationMs: 320,
    volume: 0.05
  }
};

export const standInSoundPlan = (sound: StandInSound): StandInSoundPlan => PLANS[sound];

let context: AudioContext | undefined;

/** Browser-native placeholder audio until recorded game sounds are supplied. */
export const playStandInSound = (sound: StandInSound): void => {
  const AudioContextConstructor = globalThis.AudioContext;
  if (!AudioContextConstructor) return;
  context ??= new AudioContextConstructor();
  if (context.state === 'suspended') void context.resume();

  const plan = standInSoundPlan(sound);
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const end = now + plan.durationMs / 1000;
  oscillator.type = plan.waveform;
  oscillator.frequency.setValueAtTime(plan.frequencyHz, now);
  oscillator.frequency.exponentialRampToValueAtTime(plan.endFrequencyHz, end);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(plan.volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(end);
};
