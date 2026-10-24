# Pram Panic — Audio

Bill records Lulu's sounds and his own dad lines himself, for comedy. Every slot below exists
in `src/data/sounds.json` from M1 with a generated placeholder, so recordings drop straight in.

## File naming

Put files in `public/audio/` as `<slot>.mp3` and `<slot>.ogg`. Variations use a numeric
suffix: `lulu_grunt_1.mp3`, `lulu_grunt_2.mp3` … The loader picks up all variations it finds.

## Lulu (Bill's voice)

| Slot | Sound | Length | Loop | Variations |
| --- | --- | --- | --- | --- |
| `lulu_sleep_snore` | Soft snores | 3–5 s | Yes | 1 |
| `lulu_stir_sigh` | Sighs and rustles | ~1 s | No | 3 |
| `lulu_grunt` | Grunts and squeaks | ~1 s | No | 4–5 |
| `lulu_whimper` | Building whimper | ~3 s | Yes | 1 |
| `lulu_cry_wail` | Full meltdown | ~5 s | Yes | 1 |
| `lulu_sniff` | Sniffles (Level 4) | ~0.5 s | No | 2 |
| `lulu_yawn` | Tired-sign yawn | ~1 s | No | 1 |
| `lulu_giggle` | Happy giggle (wins, birthday) | ~1 s | No | 2 |

## Bill (dad lines)

| Slot | Line |
| --- | --- |
| `bill_shhh` (3 variations) | "Shhh shh shh" (shush button) |
| `bill_nonono` | "No no no no…" (enters Grunting) |
| `bill_phew` | "Phew" (drops back to Sleeping) |
| `bill_sigh_defeat` | Defeated sigh (lose) |
| `bill_victory` | Whispered "yesss" (silent victory dance) |
| `bill_yawn` | Huge yawn (Level 8) |

## Sound effects (stock or generated)

`cough`, `sneeze`, `magpie_swoop`, `sprinkler`, `bin_bump`, `pothole_thud`, `kerb_jolt`,
`car_horn`, `dog_bark`, `squeaky_toy`, `floor_creak`, `door_knock`, `saucepan_avalanche`,
`pub_crowd`, `duck_quack`, `fountain`, `doorbell`, `balloon_pop`, `ui_tap`, `ui_coin`,
`ui_unlock`.

## Music

| Slot | Notes |
| --- | --- |
| `music_lullaby` | Looping chiptune lullaby, 30–60 s loop |
| `music_lullaby_detuned` | Same arrangement, detuned and wonky, for Crying |
| `music_menu` | Upbeat chiptune for menus |
| `music_night` | Slower night version (Level 8, Night Shift) |

## Layering rules (see `AudioDirector` in docs/TECH.md)

Music never stops during a level. Each wake state adds a layer on top; Crying plays over the
music and swaps in the detuned lullaby. Recovery fades layers back out.

## Recording guide for Bill

- **Gear:** phone voice memo app is fine.
- **Room:** record in a wardrobe or under a doona; soft surfaces kill echo.
- **Distance:** about 20 cm from the phone so loud wails don't distort.
- **Takes:** 3–4 of each; keep the funniest.
- **Silence:** one second before and after each take for clean trimming.
- **Hand-off:** drop raw files in `audio-raw/`; `npm run audio:normalise` (ffmpeg) trims,
  loudness-normalises and exports mp3 + ogg into `public/audio/` with the right names.
