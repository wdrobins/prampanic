You're building Pram Panic, a silly top-down phone and web game where Super Dad Bill pushes baby Lulu through her first year without waking her. The full design is already written: read CLAUDE.md first, then everything in docs/ (GDD, LEVELS, TECH, BUILD_PLAN, ART, AUDIO, TIPS) before writing any code.

Setup:
1. If this folder isn't a git repo yet, run `git init`, commit the docs as the first commit, and create a private GitHub repo called `prampanic` with `gh repo create prampanic --private --source=. --push`. If gh isn't logged in, tell me and carry on locally.
2. Enable GitHub Pages (GitHub Actions source) for the repo once the deploy workflow exists.

Then build the whole game by working through docs/BUILD_PLAN.md milestone by milestone, M0 to M7, in order:
- Make a task list from the milestone's checkboxes, do them, tick them in BUILD_PLAN.md, and commit after each task with a clear message.
- At the end of each milestone: run lint, unit tests, the Playwright smoke test and a production build. Fix anything red before moving on, then push so it deploys.
- After M1 is deployed, send me the live link so I can playtest the prototype on my phone, then keep going with M2 unless I tell you to stop.
- Items marked [Bill] need me (recordings, the final Bill design, accounts, providers). Don't wait on them: use the placeholders and defaults the docs describe, list what you need in "Questions for Bill" at the bottom of BUILD_PLAN.md, and keep building.
- Stop before M8 (release): it needs my accounts and the tip verification. Give me a short checklist of what I need to do for it.

Rules that matter most:
- All tunable numbers live in src/config/tuning.ts; levels, tips, parts and sounds are JSON data.
- Pure game logic in src/systems/ has no Phaser imports and has unit tests.
- Follow the safety and content rules in CLAUDE.md exactly. Never show unsafe baby care as correct play, never lock a tip behind payment, and never rewrite health advice yourself: tip text comes from docs/TIPS.md only.
- Phone first: portrait, two thumbs, 60 fps, test at 390×844.
- All art is original. Don't draw any existing cartoon character or brand.

When you finish a milestone, give me a two-line update: what's playable now and the link.
