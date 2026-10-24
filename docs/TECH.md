# Pram Panic — Tech spec

## Stack

| Piece | Choice | Notes |
| --- | --- | --- |
| Engine | Phaser 3 (latest 3.x stable) | Check npm for the current version at scaffold time; pin it |
| Language | TypeScript (strict) | Pure logic modules have zero Phaser imports |
| Bundler | Vite | Static output in `dist/` |
| Unit tests | Vitest | All of `src/systems/` |
| E2E smoke | Playwright | Boots the game, plays Level 3 for 5 s, asserts no console errors |
| Lint/format | ESLint + Prettier | |
| PWA | `vite-plugin-pwa` | Installable to home screen, offline play |
| Hosting | GitHub Pages via GitHub Actions (Netlify is fine as an alternative) | Deploy on push to `main` |
| App wrapper (M8) | Capacitor | iOS build on a Mac (or a cloud build service), Android anywhere |
| Ads (M8) | Google AdMob rewarded ads via a Capacitor plugin | Native builds only; web build hides ad buttons |
| IAP (M8) | RevenueCat via its Capacitor plugin | Coffee packs, cosmetics; native builds only |
| Haptics | `navigator.vibrate` on web (Android only); `@capacitor/haptics` in native builds | iOS Safari has no vibrate API, so the visual cue carries it on iPhone web |
| Analytics (M8) | Privacy-friendly, in-game events only | No personal data, no ad IDs, no baby data |

## Folder layout

```
prampanic/
├── CLAUDE.md
├── docs/                      # design docs (this folder)
├── public/
│   ├── audio/                 # Bill's recordings land here (see docs/AUDIO.md)
│   ├── art/                   # SVG/PNG art (placeholder until M5)
│   └── icons/                 # PWA icons
├── src/
│   ├── main.ts                # Phaser game config, scene list
│   ├── config/
│   │   └── tuning.ts          # EVERY tunable number lives here
│   ├── systems/               # pure TS, unit-tested, no Phaser
│   │   ├── sleepMeter.ts      # meter value, drains/recovery, hysteresis
│   │   ├── wakeState.ts       # meter → state, state-change events
│   │   ├── feedClock.ts
│   │   ├── settle.ts          # settle minigame scoring
│   │   ├── economy.ts         # bottles, coffee, prices, ad cap
│   │   ├── streaks.ts         # daily streak, freezes, perfect-run streak
│   │   ├── adaptive.ts        # difficulty easing/raising
│   │   ├── dailyRoute.ts      # seeded route generator (date → seed)
│   │   ├── garage.ts          # parts, slots, unlocks, stat modifiers
│   │   ├── collection.ts      # Dad Facts unlocks
│   │   └── save.ts            # versioned save schema + migrations
│   ├── platform/              # thin wrappers that differ web vs native
│   │   ├── storage.ts         # localStorage (web) / Capacitor Preferences (native)
│   │   ├── haptics.ts
│   │   ├── ads.ts             # no-op on web
│   │   ├── purchases.ts       # no-op on web
│   │   └── analytics.ts
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts    # loads audio with placeholder fallback
│   │   ├── TitleScene.ts
│   │   ├── MapScene.ts        # chapter map / level select
│   │   ├── IntroScene.ts      # level intro card
│   │   ├── LevelScene.ts      # generic push/drive/room player
│   │   ├── HudScene.ts        # runs in parallel with LevelScene
│   │   ├── SettleScene.ts     # overlay minigame
│   │   ├── ResultsScene.ts
│   │   ├── GarageScene.ts
│   │   ├── CollectionScene.ts
│   │   ├── SettingsScene.ts
│   │   └── minigames/         # CarSeat, SafeSleep, Bath, NappyDash, BagSort
│   ├── entities/              # Pram, Car, Bill, Lulu, Em, hazards/, pickups/
│   ├── audio/
│   │   ├── AudioDirector.ts   # layered music + wake-state layers + detune
│   │   └── placeholders.ts    # WebAudio-generated stand-in sounds
│   ├── input/
│   │   └── Controls.ts        # keyboard + two-thumb touch → 4 verbs
│   ├── art/
│   │   └── palette.ts         # colour tokens from docs/ART.md
│   └── data/
│       ├── levels/*.json
│       ├── tips.json
│       ├── parts.json
│       ├── cosmetics.json
│       ├── sounds.json        # slot → file(s) → placeholder recipe
│       └── events.json        # seasonal events
└── tests/
    ├── unit/
    └── e2e/
```

## Level data format

Push and drive levels are a vertical strip built from segments. Room levels are a grid with
placed objects. Keep it hand-editable JSON; Tiled is optional later.

```json
{
  "id": "c1-first-walk",
  "title": "First Walk",
  "chapter": 1,
  "luluAge": "Week 2",
  "mode": "push",
  "bonus": false,
  "feedClockSeconds": 90,
  "feedClockRevealAt": 0,
  "lengthPx": 9000,
  "modifiers": { "sleepDrainMultiplier": 1.0 },
  "segments": [
    { "from": 0,    "to": 1500, "surface": "footpath", "shade": [{ "x": "left", "from": 400, "to": 900 }] },
    { "from": 1500, "to": 2400, "surface": "cracked" },
    { "from": 2400, "to": 2500, "surface": "kerb" }
  ],
  "hazards": [
    { "type": "pothole",   "y": 1200, "x": 0.5 },
    { "type": "sunPatch",  "from": 3000, "to": 3800 },
    { "type": "magpie",    "y": 5200, "triggerDistance": 300 },
    { "type": "sprinkler", "y": 6400, "x": 0.7 },
    { "type": "bin",       "y": 7000, "x": 0.3 }
  ],
  "pickups": [ { "type": "hood", "y": 2900, "x": 0.5 } ],
  "tipId": "tip-sun-safety",
  "unlocks": ["slot:suspension"],
  "rewards": { "coffee": 3 },
  "intro": "First pram walk around the block.",
  "outro": "Home before the feed!"
}
```

- `x` is 0–1 across the path width (or `"left"`/`"right"` edges).
- Hazard and pickup `type`s map to classes in `src/entities/hazards|pickups` via a registry.
- Adaptive difficulty scales hazard density by removing/adding optional hazards flagged
  `"optional": true`.
- Room levels use `"mode": "room"`, a `"grid"` (tile size + walls), `"objects"` and `"actors"`
  (dog, Pop, Nana, Lulu crawl path).

## Core numbers (starting values in `tuning.ts`)

```ts
export const TUNING = {
  pushSpeed: 220,            // px/s at full push
  slowSpeed: 90,             // px/s while slowing
  steerSpeed: 260,
  meter: {
    max: 100,
    thresholds: { stirring: 70, grunting: 45, awake: 20, crying: 0 },
    recoverPerSecSmooth: 2.0, // when slow and on smooth surface
    recoverPerSecShade: 1.5,
    hysteresisRecoverFactor: 0.5, // climbing back is half speed
    sunDrainPerSec: 3.0,
    bumpBySurface: { footpath: 0, cracked: 1.5, gravel: 2.5, grass: 2.0, cobbles: 3.0 },
    bumpByHazard: { pothole: 18, kerb: 25, speedHump: 12 },
    speedBumpMultiplierAtFull: 1.8,
    sniffles: { seconds: 5, drainPerSec: 2.0 },
  },
  shush: { cooldownSec: 6, recover: 12, cueBonusMultiplier: 2 },
  peek: { seconds: 1.0, attentionCostSec: 0.5 },
  settle: { seconds: 10, beatsRequired: 8, windowMs: 220 },
  hood: { shadeSeconds: 10 },
  feedClock: { defaultSeconds: 90 },
  economy: {
    bottleFull: 1, bottleHalf: 0.5,
    adsPerDayCap: 5, bottlesPerAd: 1,
    coffeePerLevel: 3, coffeePerBonus: 2, coffeePerDailyWalk: 4,
    streakFreezeCost: 15, shareCoffee: 10,
  },
  adaptive: { failsBeforeEase: 3, easeStep: 0.15, maxEaseSteps: 2, perfectRunsBeforeRaise: 2 },
  showExactMeter: false,
};
```

## Save format

Versioned JSON in storage under `prampanic.save`:

```json
{
  "version": 1,
  "levels": { "c1-first-walk": { "completed": true, "bestBottles": 1, "fails": 2 } },
  "bottles": 3,
  "coffee": 12,
  "streak": { "days": 4, "lastDate": "2026-10-24", "freezes": 1 },
  "perfectRunStreak": 2,
  "garage": { "owned": ["susp-1"], "equipped": { "suspension": "susp-1" } },
  "cosmetics": { "owned": [], "equipped": {} },
  "dadFacts": ["tip-safe-sleep"],
  "adsToday": { "date": "2026-10-24", "count": 0 },
  "settings": { "music": 0.7, "sfx": 1, "haptics": true, "showExactMeter": false, "reduceMotion": false }
}
```

Every save change goes through `save.ts` with a migration function per version bump.

## Audio architecture

`AudioDirector` keeps the lullaby loop always playing and layers on top:

- Sleeping: lullaby at full, snore loop quiet.
- Stirring: random `stir_sigh` one-shots every 2–4 s.
- Grunting: lullaby low-pass filtered/thinned; random `grunt` one-shots.
- Awake: `whimper` loop fades in.
- Crying: `cry_wail` loop over the top; lullaby switches to the detuned version (or is
  pitch-shifted live). Ducks back on recovery.

Missing files: `sounds.json` gives each slot a placeholder recipe (WebAudio oscillator/noise
envelope) so the game runs before Bill records anything. Serve recordings as `.mp3` and `.ogg`.

## Testing

- **Unit:** every module in `src/systems/` has tests (meter thresholds, hysteresis, feed clock
  expiry, settle scoring, economy caps, streak day rollovers incl. timezone, daily seed
  determinism, adaptive steps, save migrations).
- **E2E smoke:** Playwright opens the built site at 390×844, starts Level 3, simulates input
  for 5 s, asserts no console errors and that the HUD shows a wake state.
- CI runs lint, unit and e2e on every push; deploy only if green.

## Deploy

- GitHub Actions workflow: on push to `main` → install → lint → test → build → deploy `dist/`
  to GitHub Pages. Set Vite `base` to `/prampanic/` for Pages (or `/` for a custom domain).
- PWA manifest: name "Pram Panic", portrait, theme colour from the palette, icons 192/512.

## Native (M8)

- `npx cap add ios` / `npx cap add android`. iOS archive and upload needs a Mac with Xcode
  (Bill can use his wife's Mac) or a cloud build service.
- Platform wrappers in `src/platform/` switch implementation on `Capacitor.isNativePlatform()`.
- Store requirements to prepare: privacy policy page, data-safety form (no tracking), age rating,
  screenshots at required sizes.
