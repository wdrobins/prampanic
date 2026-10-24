# Pram Panic — Game Design Document

Pram Panic, starring Super Dad Bill, is a silly, top-down, race-against-the-clock game. Bill
gets through baby Lulu's first year one outing at a time without waking her. Fun first; one
real baby-care tip sneaks into every level.

- **Platforms:** web first (phone browser + desktop, installable as a PWA), then iOS and
  Android via Capacitor.
- **Orientation:** portrait 9:16. Reference size 390×844.
- **Session length:** 60–120 seconds per level. One-tap retry.
- **Audience:** expecting and new dads (primary), mums, grandparents, casual gamers.

## 1. Core loop

Push the pram up a vertically scrolling map. **Go fast to beat the feed clock, or go smooth to
keep her asleep.** Every hazard, pickup and mod is a twist on that trade-off.

### Controls

| Action | Desktop | Phone |
| --- | --- | --- |
| Steer | A / D (or ← / →) | Left thumb: drag left/right anywhere on the left half |
| Push | Automatic forward motion while not slowing | Automatic while left thumb is down |
| Slow down (smoother ride, clock keeps ticking) | S (hold) | Lift the left thumb |
| Shush / rock (cooldown) | Space | Right thumb tap on the right half |
| Peek at Lulu (costs ~0.5 s of attention) | W | Tap the pram |
| Pause | Esc / P | Pause button top-right |

The same four verbs are used in every mode (push, drive, room). Only camera speed and
movement model change. Players never learn new controls.

### Modes

| Mode | Used by | Movement |
| --- | --- | --- |
| `push` | Most outdoor levels | Vertical auto-scroll, steer left/right, slow to smooth |
| `drive` | Levels 7, 8 | Same as push, faster camera, car body instead of pram |
| `room` | Levels 2, 13b, 14 | Free top-down movement in a room; slow = tiptoe |
| `minigame` | Car seat, safe sleep, bath, nappy, bag pack, settle | Bespoke tap/drag scenes, under 15 s each |

## 2. Lulu's sleep: the wake states

Sleep meter 0–100. Sound is the primary warning so players keep half-listening, like real life.
She drops states fast and climbs back slowly (hysteresis), so settling takes longer than waking.

| State | Meter | Sound (Bill's voice) | Visual | Haptic |
| --- | --- | --- | --- | --- |
| Sleeping | 100–70 | Soft snores, clean lullaby | Big floating Zs | None |
| Stirring | 70–45 | Sighs, rustles | Zs shrink, a foot kicks | Gentle tap |
| Grunting | 45–20 | Grunts and squeaks; lullaby thins out | Pram jiggles, eye flickers | Double buzz |
| Awake | 20–1 | Building whimper | Eyes open, chin wobbles | Pulse |
| Crying | 0 | Full wail over the music; lullaby detunes | Screen shake, Bill panics | Long rumble |

- **Drains:** bumps (scaled by speed and suspension), loud noises, direct sun, germ clouds,
  hazard collisions.
- **Recovery:** smooth slow pushing, shade, shush (on cooldown), hood pickup, white-noise pickup.
- **Peek mechanic:** the HUD shows only the face icon and state label by default, not the exact
  number. Peeking shows Lulu's face large for ~1 s. (Tuning flag: `showExactMeter` for
  accessibility and the prototype.)
- **Settle rescue:** when the meter hits 0, a 10-second settle minigame (rock, shush, pat in
  rhythm) triggers once per level. Success puts her back to Grunting. Failure ends the level.

## 3. The feed clock

A countdown shown as "Next feed 1:24". Game time is compressed so a level lasts 60–120 s.
It quietly teaches that newborns feed roughly every 2–3 hours. Zero = she wakes hungry = level
lost. A bottle can be spent mid-level to reset it (see currencies).

## 4. Currencies and rewards

| Currency | Earned by | Spent on |
| --- | --- | --- |
| **Bottles** (fuel) | Full bottle: finish with no wake-up. Half bottle: she stirred but never cried. Opt-in ad: 1 bottle (max 5 ads/day) | Mid-level: reset the feed clock to go further |
| **Cups of coffee** (shop money) | Finishing levels, streak milestones, Daily Walk, sharing, Dad Facts sets. Real-money packs | Pram garage parts, cosmetics, streak freezes |

- **Streak:** consecutive days with a completed Daily Walk (Duolingo-style). A streak freeze
  costs coffee and saves one missed day.
- **Perfect-run streak:** separate counter of no-wake level finishes in a row (bragging stat).
- **Coffee and Bill's eyes:** the lower the coffee balance, the more bloodshot Bill's eyes.
  Purely cosmetic in most levels; in Level 8 low coffee also blurs screen edges and adds steering
  drift.
- **Fairness rule:** every gameplay part in the garage is earnable with free coffee in under a
  week of normal play (about 3 levels or Daily Walks a day). Real money only speeds it up.

## 5. Pram garage (mods)

Mods are optional advantages, never gates. Every level is beatable with the basic pram. Slots
unlock slowly; trade-offs only appear from Chapter 3.

| Unlocks after | Slot | Parts (tier 1 → 3) | Effect / trade-off |
| --- | --- | --- | --- |
| Level 3 | Suspension | Basic springs → Coil-overs → Air ride | Reduces bump drain |
| Level 6 | Hood | Standard → Extended → UV Max | Longer shade, slower sun drain |
| Level 10 | Wheels | City / All-terrain / Racing | All-terrain: smooth on gravel, slower. Racing: fast, bumpy |
| Level 12 | Basket | Small → Large | Carries more pickups (shopping lists) |
| Level 14 | Handle | Standard / Sport / Comfort | Sport: sharper steering, more jolt. Comfort: steadier, slower turns |

A small speaker accessory (white noise) is a stretch goal for the Handle slot era.

Cosmetics (real money or coffee): Bill's jumper colours and styles, pram paint jobs, Lulu's
onesies. Waitlist perk: gold jumper-cape.

## 6. Dad Facts collection

Every tip unlocks a collectible card when its level is completed. Each card shows the tip, a
silly illustration and its source tag. Completing a chapter's set unlocks a cosmetic. The safe
sleep card (Level 6) is card #1. Tips are never paywalled.

## 7. Retention

| Lever | How it works |
| --- | --- |
| Daily Walk | One short run a day on a seeded random route (same seed for everyone that day). Counts for the streak |
| Streak + freeze | Days in a row; freeze bought with coffee |
| Night Shift (endless) | Unlocked after Level 16: endless 3am walk, faster and busier, high score |
| One-thumb flow | Bright, readable, no menus mid-run, one-tap retry |
| Adaptive difficulty | After 3 fails on a level, ease hazard density 15% (max 2 steps). If cruising (2 perfect runs), add density. Never below the level's minimum |
| Seasonal events | Data-driven event levels: Christmas lights walk, Father's Day, footy finals, summer heatwave |
| Sharing | After the finale: "Send to a mate who's expecting." Shared link gives both players coffee |
| Dad Facts | Collection completion |

**Tailoring rules:** tailor difficulty, level order and which tips appear using in-game play
data only. Ads are contextual and opt-in, never personalised. Collect no data about the
player's real baby.

**Metrics:** day 1 / 7 / 30 retention, streak length, level fail points (where Lulu wakes),
share rate, ad views per day.

## 8. Monetisation

- Free to play.
- Launch with: coffee packs (real money), cosmetics, opt-in rewarded ads (bottle each, cap 5 a
  day, never mid-level).
- Later, once retention shows a daily habit: **Super Dad Plus** subscription (ad-free, unlimited
  streak freezes, cosmetic of the month).
- Paid expansions after launch: **Jet Lag** first (overseas trip, Em as computer-controlled
  teammate), then the **Toddler year**.
- Separate future spinoff: **Super Mum**.

## 9. Story and tone

Four chapters across the first year (see `docs/LEVELS.md`). Bill starts all bravado and
overdoes everything; by the first birthday he's learned calm beats heroic. The finale ends on
warmth: "you're a good dad," plus a look-after-yourself tip.

Tone checks for every level: Is it silly? Is the tip correct and sourced? Is the joke on Bill
or the situation, never on Em, Lulu, sick people or grandparents?

## 10. Screens

1. Title (Pram Panic logo, Play, Daily Walk, Garage, Dad Facts, Settings)
2. Chapter map (level select; locked levels greyed; stars = bottles earned)
3. Level intro card (age of Lulu, setup line, feed clock)
4. Level (HUD: face + state, feed clock, bottles, coffee, shush button, pause)
5. Settle minigame overlay
6. Results (bottles, coffee, tip card, retry, next)
7. Garage (slots, parts, preview of pram)
8. Dad Facts collection
9. Settings (sound, music, haptics, show exact meter, reduce motion, credits)
