# Pram Panic — Dad Tips

Every tip ships in `src/data/tips.json` with `id`, `title`, `text`, `source`, `sourceUrl`,
`levelId`, `card` (collection order) and `verified`. All start as `verified: false`.

**Release rule:** the game cannot ship publicly while any tip is unverified. Bill checks each
against its source and flips the flag. Claude Code must not rewrite health advice from its own
knowledge; if something looks wrong, add a note in the "Flags" column.

| Card | id | Level | Tip text (draft) | Source to check | Verified | Flags |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `tip-safe-sleep` | L6 | Sleep baby on her back, face and head uncovered, in a safe cot with nothing else in it, smoke-free, in your room for the first 6–12 months. | Red Nose | ☐ | |
| 2 | `tip-car-seat` | L1 | Babies travel rear-facing in an approved restraint until at least 6 months, harness snug and untwisted. Get it professionally fitted if unsure. | State road rules, Kidsafe | ☐ | |
| 3 | `tip-newborn-sleep` | L2 | Newborns sleep a lot, but in short stretches of 2–4 hours. Normal household noise is fine; you don't need a silent house. | Raising Children Network | ☐ | |
| 4 | `tip-sun-safety` | L3 | Keep babies under 12 months out of direct sun. Never drape a blanket or wrap over the pram; it traps heat. Use the hood and pick shady routes. | Cancer Council, Red Nose | ☐ | |
| 5 | `tip-whooping-cough` | L4 | Newborns are especially vulnerable to whooping cough. Visitors should be vaccinated and wash hands before holding baby. Her first big round of vaccinations is at 6 weeks. | Australian Immunisation Handbook | ☐ | |
| 6 | `tip-breastfeeding-public` | L5 | Breastfeeding in public is legal and protected in Australia. Dad's job: water, snacks, a comfy spot, and backing mum. | Australian Human Rights Commission | ☐ | |
| 7 | `tip-car-seat-sleep` | L7 | Car seats are for travel, not sleep. Take breaks on longer drives and move her to a safe sleep space when you arrive. | Red Nose | ☐ | |
| 8 | `tip-hot-car` | L8 | Never leave a baby alone in a car, even for a minute; cars heat up fast. And if you're too tired to drive safely, don't drive. | Kidsafe | ☐ | |
| 9 | `tip-bath` | L9 | Never leave a baby alone in the bath, even for a second. Check the water with your wrist or elbow, or a bath thermometer at about 37–38°C. | Kidsafe, Raising Children Network | ☐ | |
| 10 | `tip-tired-signs` | L10 | Watch for tired signs like yawning, grizzling, jerky movements and staring. Settling is much easier before she's overtired. | Raising Children Network | ☐ | |
| 11 | `tip-change-table` | L11 | Always keep one hand on baby on a change table. Have everything ready before you start. | Raising Children Network | ☐ | |
| 12 | `tip-solids` | L12 | Start solids at around 6 months, not before 4 months. Watch for readiness: good head control, sitting with support, interest in your food. Introduce common allergy foods like egg and peanut in the first year. | ASCIA | ☐ | Re-check every release |
| 13 | `tip-teething` | L13 | A cold (not frozen) teething ring helps. Avoid amber teething necklaces; they're a choking and strangulation risk. | ACCC Product Safety | ☐ | |
| 14 | `tip-advice-changed` | L13b | Baby advice has changed since their day; for example, babies now sleep on their backs. Share today's guidance kindly. | Red Nose | ☐ | |
| 15 | `tip-button-batteries` | L14 | Button batteries can be deadly if swallowed. Keep them locked away, and go to hospital immediately if you suspect one has been swallowed. Anchor furniture to walls so it can't tip. | ACCC Product Safety | ☐ | Consider adding Poisons Info 13 11 26 |
| 16 | `tip-separation` | L15 | Separation anxiety is normal around this age. A short, consistent goodbye routine works better than sneaking out. | Raising Children Network | ☐ | |
| 17 | `tip-dad-wellbeing` | L16 | You made it. Look after yourself too: dads can experience perinatal anxiety and depression, and PANDA supports dads as well as mums. | PANDA | ☐ | Add PANDA helpline number after checking it |

In-level banners (one line, shown at the moment of the hazard) reuse the first sentence of the
level's tip.

Every tip card carries a small footer: "General info, not medical advice. Check with your
GP or maternal and child health nurse."
