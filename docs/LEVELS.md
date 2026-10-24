# Pram Panic — Levels

17 levels across four chapters of Lulu's first year. Each level introduces one new mechanic so
the game teaches itself. Bonus levels are short, optional for progression, but award coffee and
a Dad Fact.

Each level has a build spec (id, mode, length, hazards, pickups, tip) and a storyboard (setup,
funny moment, ending, braintrust check). Stress-test fixes are already applied.

## Overview

| # | id | Title | Lulu's age | Mode | New mechanic | Unlocks |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `c1-coming-home` | Coming Home | Day 1 | push → minigame → drive | Steering, sleep meter; feed clock revealed halfway | — |
| 2 | `c1-the-sneak` | The Sneak (bonus) | Week 1 | room | Slow = tiptoe; creaky boards | — |
| 3 | `c1-first-walk` | First Walk | Week 2 | push | Sun, shade, hood pickup, shush | Garage: Suspension |
| 4 | `c1-germ-dodge` | Germ Dodge | Week 4 | push | Germ clouds + sniffles; sanitiser pickup | — |
| 5 | `c1-feed-stop` | The Feed Stop | Week 5 | push (escort) | Escort Em; fetch items; block gawkers | — |
| 6 | `c1-safe-sleep` | Safe Sleep (bonus) | Week 6 | minigame | Drag-and-drop cot clearing | Garage: Hood |
| 7 | `c2-first-car-trip` | First Car Trip | Month 2 | drive → push | Driving; bottles as fuel | — |
| 8 | `c2-3am-drive` | The 3am Drive | Month 3 | drive | Bill's tiredness (coffee) | — |
| 9 | `c2-bath-time` | Bath Time (bonus) | Month 3 | minigame | Prep checklist | — |
| 10 | `c2-park-life` | Park Life | Month 4 | push | Tired signs (cue-timed shush) | Garage: Wheels |
| 11 | `c3-nappy-dash` | Nappy Dash (bonus) | Month 5 | minigame | Rhythm taps, one hand on baby | — |
| 12 | `c3-shopping-centre` | Shopping Centre | Month 6 | push | Shopping-list pickups, basket space | Garage: Basket |
| 13 | `c3-teething` | Teething Trouble | Month 7 | push | Catch and swap grabbed items | — |
| 13b | `c3-nana-pop` | Nana and Pop Visit | Month 8 | room | Redirect well-meaning grandparents | — |
| 14 | `c4-baby-proof` | Baby-Proof Blitz | Month 9 | room | Lulu moves on her own | Garage: Handle |
| 15 | `c4-daycare` | Daycare Drop-off | Month 12 | minigame → push | Bag sort; two clocks | — |
| 16 | `c4-first-birthday` | First Birthday (finale) | 12 months | room | None: victory lap | Night Shift, share prompt |

---

## Chapter 1 — The Fourth Trimester (weeks 0–6)

The basics: steering, the sleep meter, shade, germs, and that Bill's job is supporting Em.

### Level 1: Coming Home (day 1) — `c1-coming-home`

- **Mode / length:** push (hospital to car, ~30 s) → car seat minigame (≤15 s) → drive (~40 s).
- **Setup:** Bill steps out of the hospital doors carrying Lulu to the car.
- **Hazards:** sliding doors (timing), car park ticket machine queue, speed hump.
- **Pickups:** none.
- **New mechanic:** steering and the sleep meter. **The feed clock is hidden until the drive
  home starts**, then appears: "First feed at home in 40 minutes."
- **Car seat minigame:** tap to click the base in, drag the harness snug (too loose = retry),
  rear-facing only. Must be completable in under 15 s.
- **Funny moment:** Bill drives home at 20 km/h with a honking convoy behind him.
- **Tip:** `tip-car-seat` — rear-facing approved restraint until at least 6 months; harness
  snug and untwisted; get it professionally fitted if unsure.
- **Ending:** still asleep at the front door. Silent victory dance.
- **Braintrust check:** the car seat minigame must stay under 15 s or it becomes a chore on replay.

### Level 2 (bonus): The Sneak (week 1) — `c1-the-sneak`

- **Mode / length:** room, ~60 s. Bedroom → kitchen → bedroom carrying a cup of tea.
- **Setup:** Lulu is finally asleep in the bassinet.
- **Hazards:** creaky floorboards (creak only above tiptoe speed), the dog with a squeaky toy
  (moving), a courier knocking (timed event: get to the door before the second knock), a
  saucepan cupboard that avalanches if bumped.
- **New mechanic:** slow-down as a skill: holding slow = tiptoe.
- **Funny moment:** a board creaks and Bill freezes like a statue, tea wobbling, for three
  agonising seconds.
- **Tip:** `tip-newborn-sleep` — newborns sleep a lot but in short stretches of 2–4 hours;
  normal household noise is fine.
- **Ending:** Bill sinks into the couch with the tea. It's gone cold.
- **Braintrust check:** the tip undercuts the premise on purpose; that contrast is the joke.

### Level 3: First Walk (week 2) — `c1-first-walk` ★ prototype level

- **Mode / length:** push, ~90 s, ends at the front door.
- **Setup:** first pram walk around the block. "Next feed in 1h 30m."
- **Hazards:** direct sun patches (steady drain), bin day (obstacles), swooping magpie (timed
  dive, noise drain), kerb with no ramp (big jolt unless slowed), sprinkler (noise + steer
  around), potholes, cracked paving.
- **Pickups:** pram hood (10 s shade).
- **Shade zones:** trees and awnings along the edges; hidden shady routes.
- **New mechanic:** sun indicator, shade, hood pickup, shush button.
- **Funny moment:** the magpie swoops Bill, who ends the level wearing an ice-cream container
  with eyes drawn on it.
- **Tip:** `tip-sun-safety` — keep babies under 12 months out of direct sun; never drape a
  blanket or wrap over the pram (it traps heat); use the hood and shady routes.
- **Ending:** home before the feed. Garage unlocks: Suspension.
- **Braintrust check:** no blanket-over-pram pickup anywhere in the game, even as a joke.

### Level 4: Germ Dodge (week 4) — `c1-germ-dodge`

- **Mode / length:** push, ~90 s, busy shopping strip.
- **Setup:** quick trip to grab nappies.
- **Hazards:** coughers and sneezers emit green germ clouds; an aunty who wants a cuddle
  (approaches the pram); a kid with a runny nose.
- **Germ rule (fixed):** no third meter. Germ clouds drain the sleep meter and give Lulu
  **sniffles** for 5 s (faster drain, little sniff sounds). Sanitiser pickup: tap a cuddle-seeker
  while holding sanitiser to clear them.
- **Funny moment:** a man winds up a huge sneeze in slow motion; Bill dives the pram out of the
  way, action-movie style.
- **Tip:** `tip-whooping-cough` — newborns are especially vulnerable to whooping cough;
  visitors should be vaccinated and wash hands before holding baby; first big round of
  vaccinations is at 6 weeks.
- **Ending:** nappies bought, no sniffles.
- **Braintrust check:** keep it light. The joke is Bill's overreaction, not sick people.

### Level 5: The Feed Stop (week 5) — `c1-feed-stop`

- **Mode / length:** push with escort, ~90 s, park.
- **Setup:** out at the park with Em. She needs to feed; Bill makes it easy.
- **Phases:** (1) clear a path to a comfy shady bench (Em follows Bill); (2) fetch water and a
  snack (two pickups); (3) block gawkers for 30 s by positioning Bill between them and Em.
- **Hazards:** gawkers, a tut-tutting stranger, glaring sun, no free bench, a pigeon after Em's
  snack.
- **Funny moment:** Bill opens a newspaper to block a gawker; it keeps unfolding until it's the
  size of a sail.
- **Tip:** `tip-breastfeeding-public` — breastfeeding in public is legal and protected in
  Australia; Dad's job: water, snacks, a comfy spot, backing Em.
- **Ending:** feed done; feed clock resets. Em high-fives Bill.
- **Braintrust check:** Em is in charge, never a prop. Humour aims at gawkers and Bill only.
  Em is never shown in a sexualised or exposed way; feeding is implied by a cosy pose and a
  muslin, nothing more.

### Level 6 (bonus): Safe Sleep (week 6) — `c1-safe-sleep`

- **Mode / length:** minigame, 30 s.
- **Setup:** make the cot safe before Lulu goes down.
- **Items to clear (drag out):** pillows, cot bumper, quilt, 47 plush toys, dangling blind cord
  (tie up).
- **Final step:** place Lulu on her back, feet at the foot of the cot.
- **Funny moment:** the plush toys pile into a mountain behind Bill; one teddy keeps sneaking
  back in.
- **Tip:** `tip-safe-sleep` — back to sleep, face and head uncovered, safe cot with nothing
  else in it, smoke-free, in your room for the first 6–12 months. **Dad Facts card #1.**
- **Ending:** lights out; Bill tiptoes away. Garage unlocks: Hood.
- **Braintrust check:** the most important tip in the game. Any item left in the cot = cannot
  finish.

---

## Chapter 2 — Finding Our Feet (months 2–4)

More confidence, further trips: driving, night shifts, bath time, reading tired signs.

### Level 7: First Car Trip (month 2) — `c2-first-car-trip`

- **Mode / length:** drive (~70 s) → push (pub entrance, ~30 s). Longest level yet.
- **Setup:** Bill and Lulu drive to the pub to meet his mates.
- **Hazards:** roundabouts, speed bumps, a tradie's ute blasting music at the lights, mates
  bellowing hello at the door, the pub band.
- **New mechanic:** driving (same controls as push). **Bottles as fuel**: spend one mid-level
  to reset the feed clock (first-time tutorial prompt).
- **Funny moment:** Bill walks in and shushes the whole pub; the band switches to unplugged.
- **Tip:** `tip-car-seat-sleep` — car seats are for travel, not sleep; take breaks on long
  drives; move her to a safe sleep space when you arrive.
- **Ending:** Bill gets a first sip of a beer. She stirs. He puts it down.
- **Braintrust check:** Bill drinks nothing before driving; the sip only happens at the very
  end, once he isn't driving home (Em is shown arriving to drive).

### Level 8: The 3am Drive (month 3) — `c2-3am-drive`

- **Mode / length:** drive, ~90 s, night palette.
- **Setup:** Lulu won't settle. 3am. Bill in undies and a dressing gown does a lap of the suburb.
- **Hazards:** roadworks, red lights that last forever, garbage truck, a hoon doing burnouts,
  Bill's yawns (random input lag).
- **New mechanic:** tiredness: low coffee blurs screen edges and adds steering drift. A servo
  stop (optional checkpoint) restores coffee at the cost of time.
- **Funny moment:** the servo attendant takes one look at Bill and nods knowingly.
- **Tip:** `tip-hot-car` — never leave a baby alone in a car, even for a minute; cars heat up
  fast. And if you're too tired to drive safely, don't drive.
- **Ending:** asleep by the driveway. Bill sits in the dark car, too scared to turn off the engine.
- **Braintrust check:** the servo stop never involves leaving Lulu in the car: Bill carries
  her in (or pays at the pump). Tiredness points to the drowsy-driving tip.

### Level 9 (bonus): Bath Time (month 3) — `c2-bath-time`

- **Mode / length:** minigame, ~45 s.
- **Phases:** (1) prep checklist: gather towel, nappy, clothes, wash, within reach; (2) test the
  water (slider to the safe band); (3) wash, dry, dress (taps).
- **Hazards:** water too hot/cold, towel left in the other room, the phone ringing (ignore it),
  the "bath poo" emergency.
- **Rule:** walking away from the bath is an instant fail.
- **Funny moment:** the rubber duck watches, judging, its expression changing with each mistake.
- **Tip:** `tip-bath` — never leave a baby alone in the bath, even for a second; check the
  water with wrist or elbow, or a bath thermometer at about 37–38°C.
- **Ending:** wrapped up warm, smelling great. Bill soaked head to toe.
- **Braintrust check:** answering the phone is never rewarded.

### Level 10: Park Life (month 4) — `c2-park-life`

- **Mode / length:** push, ~100 s, park and boardwalk.
- **Hazards:** wind gusts (push sideways), kick-to-kick footy, ducks, an off-lead dog, gravel
  paths (bumpy), a steep hill (slow climb, fast descent).
- **New mechanic:** tired signs. Lulu shows a cue (yawn, eye-rub, staring) ~2 s before dropping
  a state. Shushing during a cue is twice as effective.
- **Funny moment:** a line of ducks follows the pram home; a footy lands in the basket.
- **Tip:** `tip-tired-signs` — watch for yawning, grizzling, jerky movements and staring;
  settling is easier before she's overtired.
- **Ending:** asleep under a tree. Garage unlocks: Wheels (trade-offs begin).
- **Braintrust check:** cues must read on a small screen with sound off.

---

## Chapter 3 — Out and About (months 5–8)

Lulu is more alert and harder to keep asleep, so mods and trade-offs start to matter.

### Level 11 (bonus): Nappy Dash (month 5) — `c3-nappy-dash`

- **Mode / length:** minigame, ~30 s, public change table.
- **Mechanic:** rhythm taps for each step: unfasten, wipe, lift, slide, fasten. A "hand on
  baby" button must stay held the whole time (left thumb).
- **Hazards:** a rolling baby, the wipes packet that won't open, a nappy on backwards, the
  dreaded fountain.
- **Funny moment:** the fountain arcs across the room; Bill catches it in his hat.
- **Tip:** `tip-change-table` — always keep one hand on baby on a change table; have
  everything ready first.
- **Ending:** clean nappy, clean baby, damp dad.
- **Braintrust check:** releasing the hand ends the round instantly.

### Level 12: Shopping Centre (month 6) — `c3-shopping-centre`

- **Mode / length:** push, ~110 s, indoor mall.
- **Hazards:** escalators (blocked: find the lift), trolley trains, the free-sample lady, a
  crowded food court, automatic doors, the toy aisle (Lulu grabs).
- **New mechanic:** shopping-list pickups that need basket space; parents' room checkpoint
  (refills shush, brief feed-clock bonus).
- **Funny moment:** Bill accidentally joins the end of a trolley train and gets dragged a lap of
  the car park.
- **Tip:** `tip-solids` — start solids at around 6 months, not before 4 months; signs of
  readiness; introduce common allergy foods like egg and peanut in the first year.
- **Ending:** home with shopping and a jar of mashed pumpkin. Garage unlocks: Basket.
- **Braintrust check:** feeding advice changes; this card must be re-verified every release.

### Level 13: Teething Trouble (month 7) — `c3-teething`

- **Mode / length:** push, ~90 s. Sleep meter drains 25% faster (teething modifier).
- **Hazards:** Lulu grabs things from the pram: keys, phone, sunglasses, a receipt.
- **New mechanic:** catch each grabbed item (tap) and swap it for a cold teething ring pickup.
- **Funny moment:** swaps speed up until Bill is juggling five items one-handed.
- **Tip:** `tip-teething` — a cold (not frozen) teething ring helps; avoid amber teething
  necklaces (choking and strangulation risk).
- **Ending:** asleep gnawing the ring. Bill's keys covered in drool.
- **Braintrust check:** grabbed items are big and safe-looking; nothing suggests babies should
  chew small objects.

### Level 13b: Nana and Pop Visit (month 8) — `c3-nana-pop`

- **Mode / length:** room, ~90 s, living room. Lulu needs her nap.
- **Hazards:** Pop bouncing Lulu wildly (approaches the cot), Nana's bag of lollies, the
  doorbell, old-school advice popping up as speech bubbles (tap to answer kindly).
- **New mechanic:** keep the peace: redirect each grandparent (hand Pop the TV remote, give
  Nana a cuppa) before they reach Lulu. A "peace meter" isn't added; failing just drains sleep.
- **Funny moment:** Pop swings Lulu like a footy; Bill intercepts with a perfect dive and hands
  Pop the remote.
- **Tip:** `tip-advice-changed` — baby advice has changed since their day (e.g. babies now
  sleep on their backs); share today's guidance kindly.
- **Ending:** Lulu naps; Nana and Pop doze on the couch; the house is finally quiet.
- **Braintrust check:** grandparents stay lovable. The joke is the generation gap, never them.

---

## Chapter 4 — On the Move (months 9–12)

Lulu can crawl, so the game flips: Bill is racing ahead of her.

### Level 14: Baby-Proof Blitz (month 9) — `c4-baby-proof`

- **Mode / length:** room, ~90 s.
- **New mechanic:** Lulu moves on her own along a path (crawl AI with random turns). Bill
  races ahead fitting fixes to hazards before she reaches them.
- **Hazards → fix:** open power point → cover; unanchored bookshelf → anchor; stairs → gate;
  button battery on the floor → pick up and lock away; dangling kettle cord → tuck away.
- **Fail rule:** if Lulu reaches an unfixed hazard, Bill dives in and scoops her (comedy
  slow-mo); level restarts from checkpoint. She is never shown being hurt.
- **Funny moment:** Bill slow-motion dives to cover a power point; she's already gone the
  other way.
- **Tip:** `tip-button-batteries` — button batteries can be deadly if swallowed; lock them away
  and go to hospital immediately if you suspect one has been swallowed; anchor furniture.
- **Ending:** house safe, Lulu naps on the rug. Garage unlocks: Handle.
- **Braintrust check:** the battery tip is serious; the joke is Bill's dive, never the hazard.

### Level 15: Daycare Drop-off (month 12) — `c4-daycare`

- **Mode / length:** minigame (bag sort, ≤20 s) → push (~80 s, school-zone streets).
- **Bag sort:** drag spare clothes, name labels, bottle, hat into the bag; decoys get rejected.
- **Hazards:** school-zone traffic, a wet-nappy emergency at the gate.
- **New mechanic:** two clocks: feed clock and work clock (meeting at 9).
- **Goodbye:** a short, consistent goodbye routine (wave, kiss, go) is the only way to finish;
  sneaking out isn't an option.
- **Funny moment:** Lulu waves happily; Bill is the one crying.
- **Tip:** `tip-separation` — separation anxiety is normal at this age; a short, consistent
  goodbye routine works better than sneaking out.
- **Ending:** Bill makes the meeting with a sticker on his back.
- **Braintrust check:** the work clock never rewards rushing the goodbye; the goodbye takes a
  fixed time regardless.

### Level 16 (finale): First Birthday — `c4-first-birthday`

- **Mode / length:** room, ~120 s, backyard party.
- **Hazards:** every mechanic returns: sun, germy guests, a cousin who wants to hold her,
  balloons popping, a sugar-high toddler, Nana and Pop.
- **New mechanic:** none. A victory lap.
- **Funny moment:** Lulu ignores every present and plays with the box.
- **Tip:** `tip-dad-wellbeing` — you made it; look after yourself too; dads can experience
  perinatal anxiety and depression, and PANDA supports dads as well as mums.
- **Ending:** candle blown out (with help). Credits over a montage of Bill's year. Then: Night
  Shift unlocked, "Send to a mate who's expecting" share prompt, teaser for the Toddler year.
- **Braintrust check:** end on warmth: this is where the game tells the player "you're a good dad."

---

## After launch (not in v1 scope)

### Expansion: Pram Panic — Jet Lag (paid, first)

Em travels as a computer-controlled teammate. Mum assist (cooldown): she takes one task
(feeds at a checkpoint without spending a bottle, handles the security tray, distracts a chatty
passenger). Bill supports her back (water, snack, 5-minute nap) to recharge the assist faster.

Levels: Packing; The Airport; The Long-Haul Flight (tip: feeding or a dummy during take-off
and landing helps ear pressure); Jet Lag Night; Exploring Abroad; Home Again.

### Expansion: The Toddler Year (paid, second)

To be storyboarded.

### Spinoff: Super Mum

A separate game starring Em, without Bill.
