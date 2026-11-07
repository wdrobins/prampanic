export type MotionPreference = 'system' | 'reduce' | 'full';
export type FeedbackKind = 'bump' | 'shush' | 'wake-up' | 'success';

export interface FeedbackInput {
  kind: FeedbackKind;
  reducedMotion: boolean;
  durationMs: number;
  strength: number;
}

export interface FeedbackPlan {
  flash: boolean;
  pulse: boolean;
  shake?: { durationMs: number; strength: number };
}

export interface MotionSetting {
  preference: MotionPreference;
  platformPrefersReducedMotion: boolean;
}

export interface CooldownInput {
  nowMs: number;
  readyAtMs: number;
  durationMs: number;
}

export const cooldownProgress = ({ nowMs, readyAtMs, durationMs }: CooldownInput): number => {
  if (durationMs <= 0 || nowMs >= readyAtMs) return 0;
  return Math.max(0, Math.min(1, (readyAtMs - nowMs) / durationMs));
};

export const shouldReduceMotion = ({
  preference,
  platformPrefersReducedMotion
}: MotionSetting): boolean =>
  preference === 'reduce' || (preference === 'system' && platformPrefersReducedMotion);

export const feedbackPlan = ({
  kind,
  reducedMotion,
  durationMs,
  strength
}: FeedbackInput): FeedbackPlan => {
  const critical = kind === 'wake-up';
  if (reducedMotion) return { flash: critical, shake: undefined, pulse: critical };
  return {
    flash: kind === 'success',
    shake: kind === 'bump' || critical ? { durationMs, strength } : undefined,
    pulse: kind === 'shush' || critical
  };
};

/** Applies feedback described by caller-supplied semantic values. */
export const playFeedback = (scene: Phaser.Scene, input: FeedbackInput): FeedbackPlan => {
  const plan = feedbackPlan(input);
  if (plan.shake) scene.cameras.main.shake(plan.shake.durationMs, plan.shake.strength);
  if (plan.flash) scene.cameras.main.flash(input.durationMs);
  return plan;
};
