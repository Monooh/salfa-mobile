# Salfa mobile

Expo (React Native) app for salfa.app. Same backend, same catalog, same prices as the web. This repo starts with the album flow, the part that needs the most UX work.

## Run

```bash
npm install
npx expo start
```

Scan the QR with Expo Go (iOS or Android). `npm test` runs the layout engine tests, `npm run typecheck` runs TypeScript.

## What is here

- `src/app` routes (Expo Router). `album/` is the full flow: occasion, pages, photos, book preview, cover, review, done.
- `src/lib/album-layout.ts` the layout engine. Pure functions: splits N photos over 20 or 40 pages, 1 to 4 per page, never crops, never leaves a page empty. Tested in `album-layout.test.ts`.
- `src/components/album-page.tsx` draws a page: each photo whole, the gap behind it filled with a blur of the same photo, so no white holes.
- `src/lib/checkout.ts` the one place to wire Tap and the order API. Resolves locally for now so the flow runs end to end on a device.
- `src/theme/tokens.ts` colours and radii from the web.

## Rules agreed on 12 Nov

- Both markets (KW, SA), English and Arabic, from day one.
- Login by phone. Payment through Tap inside the app.
- Never crop a photo. Fill gaps with a soft blur, not white.
- Albums: 20 pages up to 80 photos, 40 pages up to 160. Artwork: one drawing per page.
- Bundles in v1. Push notifications for paid, printing, shipped, delivered.
