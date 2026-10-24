# Pram Panic — project instructions for Claude Code

Pram Panic is a silly, top-down, race-against-the-clock phone and web game. Super Dad Bill
pushes baby Lulu through her first year without waking her. It is fun first, with a real
baby-care tip sneaking into every level. Web first (Phaser), app stores later (Capacitor).

## Read before working

| Doc | What it holds |
| --- | --- |
| `docs/GDD.md` | Game design: core loop, controls, wake states, currencies, garage, retention, monetisation |
| `docs/LEVELS.md` | Every level's storyboard and build spec (17 levels, 4 chapters) |
| `docs/TECH.md` | Stack, architecture, folder layout, data formats, testing, deploy |
| `docs/BUILD_PLAN.md` | Milestones M0–M8 with acceptance criteria. Work through them in order |
| `docs/ART.md` | Art direction, palette, characters, placeholder-art rules |
| `docs/AUDIO.md` | Every sound slot, file names, layering rules, Bill's recording guide |
| `docs/TIPS.md` | All Dad Tips, their sources, and verification status |

`docs/BUILD_PLAN.md` is the source of truth for what to build next. Tick its checkboxes as you go.

## Commands

```bash
npm install          # first time
npm run dev          # local dev server (open on phone via the LAN URL)
npm run build        # production build to dist/
npm run preview      # serve the production build
npm test             # Vitest unit tests
npm run test:e2e     # Playwright smoke tests
npm run lint         # ESLint + Prettier check
```

## Hard rules

1. **Tuning lives in one place.** Every speed, drain rate, cooldown, price and timer goes in
   `src/config/tuning.ts`. No magic numbers in scenes or entities.
2. **Game logic is pure and tested.** Sleep meter, wake states, feed clock, economy, streaks,
   adaptive difficulty and the daily-route seed are plain TypeScript with no Phaser imports,
   each with Vitest tests.
3. **Levels are data.** A level is a JSON file in `src/data/levels/`. One generic `LevelScene`
   plays any push/drive/room level. Minigames are their own scenes.
4. **Tips are data.** All tip text lives in `src/data/tips.json` with a `source` and
   `verified` flag. Never hard-code tip text in a scene.
5. **Every sound slot exists from day one.** Missing recordings fall back to a generated
   placeholder so the game never crashes on a missing file. See `docs/AUDIO.md`.
6. **Every audio cue has a visual cue** (players often have sound off) and a haptic where
   supported.
7. **Phone first.** Portrait 9:16, two-thumb controls, touch targets at least 44px, 60 fps on a
   mid-range Android phone. Test at 390×844.
8. **Commit after each milestone task** with a clear message. Keep `main` deployable.

## Safety and content rules (non-negotiable)

- Never show unsafe baby care as correct play. No blanket or wrap over the pram, ever, even as
  a joke or pickup. No pillows, toys or loose bedding in a cot as a "good" outcome. No leaving
  Lulu alone in the car, bath or on a change table as a valid move.
- Bill never drinks before driving. Tiredness mechanics must point to "too tired to drive,
  don't drive", never glamorise pushing through.
- Humour is aimed at Bill, gawkers and situations, never at mum (Em), breastfeeding, sick
  people or grandparents.
- Safety tips are always free. Never lock a tip behind payment, ads or progress gates beyond
  simply playing the level.
- No data about the player's real baby is collected. Analytics use in-game play data only.
  Ads are opt-in rewarded ads, contextual, never personalised, never mid-level.
- Tip text is marked `verified: false` until Bill checks it against the listed source. Do not
  rewrite health advice from your own knowledge; flag doubts in `docs/TIPS.md` instead.

## Characters (names are fixed)

- **Bill** — Super Dad. All confidence, a jumper draped over his shoulders like a cape, huge
  eyes that go bloodshot as his coffee runs low. Secretly terrified. Learns calm beats heroic.
- **Lulu** — the baby and the real star. Angelic asleep, villain's timing.
- **Em** — mum. Computer-controlled teammate when she appears. Never a prop, never the joke.
- **Nana and Pop** — lovable grandparents with old-school advice.

## When unsure

Prefer the simplest thing that makes the current milestone's acceptance criteria pass. If a
design question is genuinely open, add it to the "Questions for Bill" list at the bottom of
`docs/BUILD_PLAN.md` and carry on with a sensible default.
