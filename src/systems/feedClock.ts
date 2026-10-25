export interface FeedClock {
  remaining: number;
  expired: boolean;
}

export const tickFeedClock = (clock: FeedClock, seconds: number): FeedClock => {
  const remaining = Math.max(0, clock.remaining - seconds);
  return { remaining, expired: remaining === 0 };
};

export const formatFeedClock = (seconds: number): string => {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};
