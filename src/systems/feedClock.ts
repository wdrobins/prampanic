import { TUNING } from '../config/tuning';

export interface FeedClock {
  remaining: number;
  expired: boolean;
}

export const createFeedClock = (seconds: number = TUNING.feedClock.defaultSeconds): FeedClock => ({
  remaining: Math.max(0, seconds),
  expired: seconds <= 0
});

export const resetFeedClock = (seconds: number = TUNING.feedClock.defaultSeconds): FeedClock =>
  createFeedClock(seconds);

export const tickFeedClock = (clock: FeedClock, seconds: number): FeedClock => {
  if (clock.expired) return clock;
  const remaining = Math.max(0, clock.remaining - Math.max(0, seconds));
  return { remaining, expired: remaining === 0 };
};

export const formatFeedClock = (seconds: number): string => {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};
