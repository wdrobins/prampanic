# Pram Panic — Build plan

Work through the milestones in order. Tick each box when done and commit. Each milestone ends
with a deployable `main`. Items marked **[Bill]** need Bill (recordings, accounts, choices);
build around them with placeholders and keep going.

## M0 — Scaffold and pipeline

- [x] Vite + TypeScript (strict) + Phaser 3 project; folder layout per `docs/TECH.md`
- [x] ESLint, Prettier, Vitest, Playwright configured; `npm` scripts per `CLAUDE.md`
- [x] `src/config/tuning.ts` with the starting values from `docs/TECH.md`
- [x] Portrait 9:16 scaling (FIT, centred), works from 360×640 up to desktop
- [x] PWA manifest + service worker; placeholder icon
- [x] GitHub Actions: lint → test → build → deploy to GitHub Pages
- [x] README with how to run locally and open on a phone over LAN

**Done when:** a "Pram Panic" title screen is live on GitHub Pages and installable on a phone.

## M1 — Grey-box prototype: Level 3, First Walk

Goal: answer one question: is the speed-versus-smoothness trade-off fun? Rectangles only.

- [ ] `Controls`: A/D steer, S slow, Space shush, W peek; two-thumb touch (left drag/hold,
      right tap); tap pram to peek
- [ ] Pram (rectangle) with Bill (rectangle) behind; camera follows; vertical scroll ~90 s
- [ ] `sleepMeter` + `wakeState` systems with unit tests; five states; hysteresis
- [ ] Surfaces: footpath, cracked paving; hazards: pothole, kerb, sun patch, magpie,
      sprinkler, bin; shade zones; hood pickup
- [ ] `feedClock` (90 s); zero = lose
- [ ] Shush with 6 s cooldown and visible cooldown ring
- [ ] Settle minigame overlay at Crying (10 s rhythm taps, once per level)
- [ ] HUD: face icon + state label, feed clock, shush button, pause
- [ ] `AudioDirector` with all five wake-state slots + lullaby + detuned lullaby, generated
      placeholders for missing files
- [ ] Haptics on supported devices (tap / double / pulse / long)
- [ ] Win and lose screens, one-tap retry, sun-safety tip card from `tips.json`
- [ ] `showExactMeter` debug toggle; tuning panel in dev builds (`?debug=1`) with live sliders
- [ ] Playwright smoke test on Level 3
- [ ] **[Bill] Playtest gate (recommended):** 3 people play on phones. Success = each asks for
      one more go unprompted, and at least one says the waking sounds made them panic. Record
      findings at the bottom of this file and retune before M3

**Done when:** the prototype is live and the success test can be run.

## M2 — Core systems generalised

- [ ] Level JSON loader + hazard/pickup registry; Level 3 moved fully to data
- [ ] Modes in `LevelScene`: `push`, `drive` (same controls, faster camera, car body), `room`
      (free top-down movement, slow = tiptoe)
- [ ] Peek mechanic (hide exact meter by default)
- [ ] Tired-signs cue system (used from Level 10 but built now)
- [ ] Modifiers: sniffles, teething drain, tiredness blur/drift
- [ ] Escort follower (Em) and simple actor AI (dog, gawkers, grandparents, crawl path)
- [ ] `save.ts` with versioned schema; progress persists
- [ ] Intro card scene and chapter map (level select, locks, bottle stars)
- [ ] Settings scene (music, sfx, haptics, show exact meter, reduce motion)

## M3 — Chapter 1 (levels 1–6), placeholder art

- [ ] L1 Coming Home: push → CarSeat minigame (≤15 s) → drive; feed clock revealed at drive
- [ ] L2 The Sneak: room mode, creaky boards, dog, courier event, saucepan cupboard, tea
- [ ] L3 First Walk: final layout from data
- [ ] L4 Germ Dodge: germ clouds, sniffles, cuddle-seeker + sanitiser
- [ ] L5 The Feed Stop: escort Em, fetch water + snack, block gawkers (Em never a prop)
- [ ] L6 Safe Sleep: drag-and-drop cot minigame; cannot finish with anything left in the cot
- [ ] Each level: intro line, funny moment, ending, tip card exactly per `docs/LEVELS.md`

**Done when:** Chapter 1 is playable start to finish on a phone.

## M4 — Meta: rewards, garage, collection, adaptive

- [ ] `economy`: bottles (full/half), coffee rewards, bottle-as-fuel mid-level (resets feed clock)
- [ ] Results scene shows bottles, coffee, tip card, retry/next
- [ ] `garage` + GarageScene: slots unlock per `docs/GDD.md`; parts from `parts.json`; stat
      modifiers applied in LevelScene; fairness check: every part earnable within ~a week
- [ ] Bill's eyes reflect coffee balance (fresh → bloodshot) on HUD and garage
- [ ] Dad Facts collection scene; safe sleep is card #1; set completion cosmetic
- [ ] `adaptive` difficulty using `optional` hazards
- [ ] Perfect-run streak counter

## M5 — Art and audio pass

- [ ] Replace rectangles with Sunday Cartoon SVG art per `docs/ART.md` (Bill with
      jumper-cape, Lulu five faces, pram, hazards, tiles), drawn as original vector art
- [ ] **[Bill]** Pick final Bill design from 3 sketch options (build a `?art=sketches` page
      showing them side by side if not decided yet; default to option 1)
- [ ] Bill's eyes: 3-step fresh / tired / bloodshot sprites
- [ ] Juice: pram wobble, screen shake on bumps, Zs particles, squash-and-stretch, Bill freeze pose
- [ ] Pixel-style menus and chiptune lullaby (royalty-free or generated) per `docs/ART.md`
- [ ] **[Bill]** Drop recordings into `public/audio/` with the names in `docs/AUDIO.md`; run
      a loudness-normalise script (`npm run audio:normalise`, ffmpeg) over them
- [ ] Respect reduce-motion (no screen shake, fewer particles)

## M6 — Chapters 2–4 (levels 7–16 incl. 13b)

- [ ] L7 First Car Trip (drive → push; bottle-fuel tutorial; Em drives home at the end)
- [ ] L8 The 3am Drive (night palette; tiredness; servo checkpoint, Lulu never left in car)
- [ ] L9 Bath Time minigame (prep checklist, temperature slider, walking away = fail)
- [ ] L10 Park Life (wind, hill, gravel, tired-sign cues)
- [ ] L11 Nappy Dash minigame (hold hand-on-baby + rhythm taps)
- [ ] L12 Shopping Centre (list pickups, basket space, parents' room checkpoint, lift not escalator)
- [ ] L13 Teething Trouble (grab-and-swap)
- [ ] L13b Nana and Pop Visit (room; redirect grandparents; advice bubbles)
- [ ] L14 Baby-Proof Blitz (crawl AI; fix hazards ahead; dive-scoop fail, never shown hurt)
- [ ] L15 Daycare Drop-off (bag sort; two clocks; fixed-length goodbye)
- [ ] L16 First Birthday finale (all mechanics; credits montage; Night Shift unlock; share prompt)

## M7 — Retention

- [ ] Daily Walk: `dailyRoute` seeded by local date; one per day; counts for streak
- [ ] Streak + streak freeze (coffee); streak UI on title screen
- [ ] Night Shift endless mode with local high score
- [ ] Seasonal events framework from `events.json` (date ranges → special level/palette);
      ship Christmas lights walk as the first event
- [ ] Share: Web Share API with fallback copy link; referral code gives both players coffee
      (honour system on web; server-free)
- [ ] Waitlist/countdown landing page at `/landing` (static), with email capture via a form
      service **[Bill: pick provider]**

## M8 — Release

- [ ] Privacy-friendly analytics events: level start/fail point/complete, retry, daily walk,
      streak length, share, ad view (no personal data) **[Bill: pick provider]**
- [ ] Privacy policy and credits pages
- [ ] **[Bill]** Verify every tip in `docs/TIPS.md` against its source; flip `verified: true`.
      **Release is blocked while any tip is unverified**
- [ ] Web soft launch to playtesters (~8: 3–4 new/expecting dads, 2 experienced dads, 1–2
      non-parent gamers, 1 mum)
- [ ] Capacitor iOS + Android projects; platform wrappers for storage, haptics
- [ ] **[Bill]** Apple Developer + Google Play accounts; AdMob + RevenueCat accounts and keys
- [ ] Rewarded ads (bottle each, cap 5/day, never mid-level); coffee packs and cosmetics IAP
- [ ] Store listings, screenshots, age rating, data-safety forms; trademark/store name check
      for "Pram Panic" **[Bill]**

## Not in v1

Super Dad Plus subscription (add once day-7/day-30 retention show a daily habit), Jet Lag
expansion, Toddler year, Super Mum spinoff, accounts/cloud save, leaderboards.

---

## Questions for Bill

_(Claude Code: add open questions here and continue with a sensible default.)_

## Playtest log

_(Record playtest findings here.)_
