# Pram Panic

A portrait, web-first Phaser game about Super Dad Bill racing to keep Lulu asleep. This repository currently contains the M0 title-screen scaffold and delivery pipeline.

## Requirements

- Node.js 22+ and npm
- A modern desktop browser (or a phone on the same Wi-Fi network)

## Run locally

```bash
npm install
npm run dev
```

Vite prints a local URL and, because the development server listens on all interfaces, a LAN URL. On your phone, join the same Wi-Fi network and open the displayed `http://<computer-LAN-IP>:5173/prampanic/` address. If your network blocks device-to-device traffic, use the local browser URL instead.

The game is designed at 390×844 and scales with a centred 9:16 canvas from 360×640 phones through desktop windows.

## Commands

```bash
npm run dev          # development server available on LAN
npm run build        # strict TypeScript check and production build to dist/
npm run preview      # preview production build on LAN
npm test             # Vitest unit tests
npm run test:e2e     # Playwright title-screen smoke test
npm run lint         # ESLint and Prettier check
npm run format       # apply Prettier
```

## Deployment

Pushing `main` runs lint, unit tests, the Playwright smoke test, and a production build before deploying `dist/` to GitHub Pages. The site is served at <https://wdrobins.github.io/prampanic/>.

## PWA

The production build includes a web app manifest, service worker, portrait orientation, and placeholder 192px/512px icons. In a supported mobile browser, open the deployed page and choose **Install app** or **Add to Home Screen**.

## Project notes

- The M0 title screen is deliberately the only gameplay surface; do not treat it as Level 1.
- Tuning values live in `src/config/tuning.ts`.
- Palette tokens live in `src/art/palette.ts`.
- Design and milestone requirements are in `docs/`.
