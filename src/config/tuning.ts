export const TUNING = {
  pushSpeed: 220,
  slowSpeed: 90,
  steerSpeed: 260,
  meter: {
    max: 100,
    thresholds: { stirring: 70, grunting: 45, awake: 20, crying: 0 },
    recoverPerSecSmooth: 2.0,
    recoverPerSecShade: 1.5,
    hysteresisRecoverFactor: 0.5,
    sunDrainPerSec: 3.0,
    bumpBySurface: { footpath: 0, cracked: 1.5, gravel: 2.5, grass: 2.0, cobbles: 3.0 },
    bumpByHazard: { pothole: 18, kerb: 25, speedHump: 12 },
    speedBumpMultiplierAtFull: 1.8,
    sniffles: { seconds: 5, drainPerSec: 2.0 }
  },
  shush: { cooldownSec: 6, recover: 12, cueBonusMultiplier: 2 },
  peek: { seconds: 1.0, attentionCostSec: 0.5 },
  settle: { seconds: 10, beatsRequired: 8, windowMs: 220 },
  hood: { shadeSeconds: 10 },
  feedClock: { defaultSeconds: 90 },
  economy: {
    bottleFull: 1,
    bottleHalf: 0.5,
    adsPerDayCap: 5,
    bottlesPerAd: 1,
    coffeePerLevel: 3,
    coffeePerBonus: 2,
    coffeePerDailyWalk: 4,
    streakFreezeCost: 15,
    shareCoffee: 10
  },
  adaptive: { failsBeforeEase: 3, easeStep: 0.15, maxEaseSteps: 2, perfectRunsBeforeRaise: 2 },
  showExactMeter: false
} as const;
