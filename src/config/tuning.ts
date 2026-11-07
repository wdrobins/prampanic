export const TUNING = {
  pushSpeed: 220,
  slowSpeed: 90,
  steerSpeed: 260,
  meter: {
    max: 100,
    thresholds: { stirring: 70, grunting: 45, awake: 20, crying: 0 },
    hysteresisRecoveryThresholds: { sleeping: 85, stirring: 65, grunting: 40, awake: 15 },
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
  collision: { graceSeconds: 0.25 },
  peek: { seconds: 1.0, attentionCostSec: 0.5 },
  settle: { seconds: 10, beatsRequired: 8, windowMs: 220 },
  hood: { shadeSeconds: 10 },
  feedClock: { defaultSeconds: 90 },
  firstWalk: {
    screen: { width: 390, height: 844, pathWidth: 310, pramY: 646, routeTop: 112 },
    frame: { maxDeltaMs: 50, routeRenderDistance: 920 },
    pram: { minX: 54, maxX: 336, width: 88, height: 44, hoodRadius: 28, wheelRadius: 10 },
    bill: { torsoWidth: 42, torsoHeight: 48, headRadius: 18, eyeRadius: 5, yOffset: 62 },
    lulu: { headRadius: 16, bodyWidth: 26, bodyHeight: 24, eyeRadius: 4, yOffset: -12 },
    hazard: { width: 58, height: 42, collisionX: 52, collisionY: 48, sunDrainMultiplier: 1 },
    pickup: { width: 54, height: 30, collisionX: 50, collisionY: 44 },
    hud: {
      padding: 16,
      top: 18,
      shushX: 336,
      shushY: 744,
      shushDiameter: 76,
      pauseX: 343,
      pauseY: 42,
      controlWidth: 62,
      controlHeight: 38
    },
    results: {
      x: 195,
      y: 422,
      width: 342,
      height: 484,
      actionWidth: 128,
      actionHeight: 52,
      actionGap: 74
    },
    feedback: {
      bumpDurationMs: 80,
      bumpStrength: 0.006,
      shushDurationMs: 120,
      successDurationMs: 180
    },
    animation: { wobbleFrequency: 8, collisionWobbleRadians: 0.08, cruiseWobbleRadians: 0.015 },
    dom: { controlSizePx: 64, controlGapPx: 12 }
  },
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
