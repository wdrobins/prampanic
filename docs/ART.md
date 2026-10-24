# Pram Panic — Art direction

**Working style:** a late-90s rubbery cartoon look (original designs inspired by that era, not
copying any existing show or character), with retro touches.

- **World and characters:** thick black ink outlines, bright flat colours, big heads, chunky
  shapes. Readable at small phone size from top-down.
- **Retro layer:** pixel-style menus and UI font, chiptune music.
- **Camera:** top-down. Characters are drawn from above with a slight 3/4 tilt on heads so
  faces read.

## Palette (Sunday Cartoon)

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#1B1B1F` | Outlines, text |
| `capeRed` | `#E63946` | Bill's jumper-cape (default), danger accents |
| `dadBlue` | `#2F6FDB` | Bill's shirt, UI accents |
| `pramTeal` | `#2EC4B6` | Pram body |
| `hoodYellow` | `#FFC93C` | Pram hood, buttons, highlights |
| `grass` | `#7BC950` | Ground |
| `cream` | `#FFF8E7` | Menu background |
| `footpath` | `#EDE6D3` | Paths |
| `skin` | `#F2C29B` / `#F7D1B0` | Bill / Lulu |
| Night variant | `#1E1B2E` base, `#F5C542` accents | Level 8, Night Shift |

Put these in `src/art/palette.ts`. Text on fills must hit 4.5:1 contrast.

## Typography

- Logo and big headings: a chunky display face (e.g. Lilita One, Google Fonts).
- UI labels and menus: a pixel face (e.g. Press Start 2P) for the retro layer, at sizes that
  stay readable (≥12px). Body text in tip cards: a rounded sans (e.g. Nunito) for readability.

## Characters

### Bill (Super Dad)
- Giant chest, tiny legs, big jaw, huge expressive eyes.
- **Signature:** a jumper draped over his shoulders with the sleeves tied loosely at the chest,
  so it reads as a superhero cape. It billows when he moves fast.
- Three sketch options to choose from (final pick pending **[Bill]**):
  1. Cable-knit Classic: preppy cream cable-knit that billows dramatically.
  2. Footy Jumper: his old team jumper, faded and stretched, flapping behind him.
  3. Dad Fleece: oversized zip fleece that keeps sliding off one shoulder.
- **Eyes as a gauge:** fresh → tired (bags) → bloodshot (red veins, twitch), tied to coffee
  balance.
- Poses: push, slow/tiptoe, shush, peek, dive, freeze, panic, victory dance, crying at daycare.

### Lulu
- Big round head, tiny body, swaddle/onesie.
- Five readable wake faces: Sleeping (closed arcs + Zs), Stirring (one eye half-open, wobbly
  mouth), Grunting (squeezed eyes, red cheeks), Awake (open eyes, wobbling chin), Crying (wide
  mouth, tears).
- Tired-sign cues: yawn, eye-rub, stare.
- Crawling sprite for Chapter 4.

### Em
- Calm, capable, warm. Never sexualised. Feeding shown as a cosy pose with a muslin.

### Nana and Pop
- Lovable. Pop: big, bouncy energy, footy jumper. Nana: cardigan, handbag of lollies.

## Placeholder art rules

- **M1:** rectangles and circles only, colour-coded by palette token.
- **M5:** original SVG art authored in code or as files in `public/art/`, kept simple enough to
  animate with Phaser tweens (squash-and-stretch, wobble) rather than many frames.
- Never draw any existing cartoon character, mascot or brand.

## Juice checklist

Pram wobble on bumps, screen shake (off with reduce motion), floating Zs, Bill's jumper-cape
flutter at speed, sweat drops when Lulu is Grunting, dust puffs on kerbs, confetti on win.
