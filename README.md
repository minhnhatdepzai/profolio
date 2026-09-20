# Lê Minh Nhật — AI Engineer & Creative Developer

A bilingual, performance-aware portfolio for selected Web, Mobile, AI and interactive work.

The original LN monogram appears in the navigation, footer and favicon. Its vector
master is available at `public/brand/ln-monogram.svg`. A 2-second cinematic intro
reveals the name, draws the logo and opens a split shutter into the site. Escape
or Skip dismisses it immediately; deep links and reduced-motion visits bypass the
automatic intro. The footer's Replay intro button plays it again, with a static
2-second identity card when reduced motion is enabled.

The header Sound button explicitly enables low-volume, locally synthesized audio:
an intro chord, restrained hover/click cues and playful gecko pickup/drop effects.
Audio is off on load, never bypasses browser autoplay rules and uses no remote
tracks. Enable sound, then Replay intro for the complete audio-visual sequence.
Muting or hiding the tab stops audio; returning requires another explicit enable.
The intro temporarily makes the underlying page inert and suspends the garden.

The editorial interface pairs an obsidian/ivory/lime visual system with a living
digital garden: a lazy-loaded procedural 3D chameleon on a floating moss island,
a smaller gecko roaming/climbing around the viewport, a butterfly flying across
the page, squirrels along the lower edge, occasional swallows and blooming flowers.
WebGL pauses offscreen and in hidden tabs; mobile and unavailable-WebGL sessions
retain an animated SVG/CSS habitat. Reduced motion uses a static version.
The bilingual garden control has immediate Play/Pause and Auto modes. Auto wakes
the garden after 10 seconds without pointer, keyboard, touch or scroll activity,
and rests it when the visitor returns. Explicit Pause is never overridden by idle.
Reduced-motion settings are respected by default; selecting Play or Auto is a
session-only opt-in for garden motion, without enabling unrelated page effects.
Hidden tabs and open navigation/project dialogs suspend the garden. Only the small
roaming gecko receives pointer events: drag Moss with a mouse or touch to startle
him, then release to watch him fall, land, scurry away and camouflage briefly.
He reappears after a few seconds. Keyboard users can pick up/drop with Enter or
Space, move with arrows, and release with Escape. This explicit interaction works
while Auto is waiting; Pause, hidden tabs and dialogs still suspend it. All other
animals are click-through. Flowers unfurl in sequence, and birds cross occasionally
rather than filling the sky continuously.
The Lab features a textured Earth with 4K day/night imagery, a separate cloud
shell, terrain shading, ocean reflections and a thin atmosphere. All images are
self-hosted under `public/earth`; attribution is linked beneath the scene.
Cloud cover is a static composite, not a live weather feed. The existing solar
calculation drives day/night lighting. The Moon shares that reference frame and
uses a surface texture; its displayed distance is compressed to keep it in view.
The initial camera faces a sunlit landmass. Auto rotate can be toggled independently,
dragging changes the view, and buttons or wheel/pinch zoom between 75% and 180%.
Reset view restores camera direction and 100% zoom. Reduced motion retains a still
interactive globe; animation also pauses in hidden tabs and when suspended.

The solar and lunar maths lives in `src/components/solarPosition.ts` and is covered
by `tests/solar-position.test.mjs`, which pins the subsolar point to the Greenwich
meridian at noon UTC, checks it sweeps west at fifteen degrees an hour, holds
declination inside the tropics across a year, and counts the moon through its
synodic cycle.

Two mascots track the cursor, and a swatch row shows the palette the page is
currently wearing.

Colour follows the reader's own clock: six palettes, four hours each, so a full day
is covered and the colour on screen agrees with the time of day. `BAND_HOURS` in
`src/data/timePalettes.ts` is the only knob — set it to 2 for a literal two-hourly
rotation, at the cost of the cycle repeating twice a day. The active palette is
published as CSS custom properties on `:root` and also tints the screen-edge glow
and the planet. The timer re-arms against the next boundary rather than ticking on
an interval, and a visibility change re-checks, so a tab left open overnight still
turns over.

Nine project cards offer direct demos and deep-linked case-study dialogs. Recruiter
actions include an explicit CV download, professional experience and contact links.
The downloadable CV is the current English PDF at `public/cv/Le-Minh-Nhat-CV-EN.pdf`;
its path and file name live in `src/data/cvFile.ts` so the header and hero stay in sync.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm test
npm run build
```

The default production target is Cloudflare Workers Static Assets at the domain root. A separate
`npm run build:github` command keeps the legacy `/profolio/` GitHub Pages build
available when needed.

## Deploy to Cloudflare Workers

The repository includes `wrangler.jsonc` and Cloudflare `_headers`, following the
same static-assets deployment pattern as PICKO247. The Worker configuration uses
`dist` as its asset directory and falls back to `index.html` for SPA routes.

For a first manual deployment, authenticate Wrangler and run:

```bash
npx wrangler login
VITE_SITE_URL=https://leminhnhat-portfolio.lnhat1938.workers.dev npm run deploy:cloudflare
```

For Git-connected Workers Builds, use these settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Non-production branch deploy command: `npx wrangler versions upload`
- Root directory: `/`

Set the public URL as a build environment variable so canonical, Open Graph,
robots.txt and sitemap.xml use the final Worker or custom domain:

```text
VITE_SITE_URL=https://your-final-domain.example
```

The current production Worker is `leminhnhat-portfolio`, available at
`https://leminhnhat-portfolio.lnhat1938.workers.dev/`.

To test the Cloudflare build locally without deploying:

```bash
npm run cloudflare:dev
```

Do not commit Cloudflare API tokens or `.env` files. Only `.env.example` is
intended for source control.

## Featured work

- JAPANO — AI fashion commerce ecosystem
- SAIGON // 77 — browser-based 3D open-world vertical slice
- Math Vision Lab — explainable grade 1–9 math visualization
- EduVision Smart Classroom — interactive 3D product presentation
- K’ho Digital Heritage — interactive culture and tourism experience
- PICKO247 — tournament, fan play and browser game system
- HappyToPlay — inclusive social Game Jam experiment
- Vehicle Counting — YOLOv8/ByteTrack implementation guide

## JAPANO media

The gallery uses original artwork from the [JAPANO showcase](https://japano-golden-ticket-showcase.lnhat1938.workers.dev/),
stored locally as `public/projects/japano-showcase.webp`. It is showcase artwork, not
a mobile screenshot. The project includes both the showcase and the supplied
[video demo](https://youtu.be/D8jqwvPUfFc?si=MZTFf8joSed97OcD).

Keep preview images under roughly 180 KB where visual quality allows. Do not include credentials, private customer data or unverified body measurements.

## Media provenance

- `mathlab-video.jpg` is the original 1280×720 thumbnail from the supplied Math Vision Lab YouTube demo.
- `kho-live.jpg` is a direct browser capture of the public K’ho deployment.
- `picko247-live.jpg` is a direct browser capture of the public PICKO247 deployment.
- `japano-showcase.webp` comes from the JAPANO showcase's `/assets/brand/japano-splash-bg.webp` artwork.
- HappyToPlay uses clearly labeled concept artwork; procedural diagrams are not presented as product screenshots.
- `og-cover.png` is rendered from the repository-native `og-cover.svg` sharing card.
- The chameleon, butterfly, moss island, foliage and their motion are original
  code-native visuals in `src/components`; no remote model or texture files are required.
- The Lab globe uses Solar System Scope day/night images and three.js example
  maps for clouds, surface normals, ocean reflections and the Moon. Original
  sources and licenses are recorded in `public/earth/ATTRIBUTION.txt`.
- The two Lab mascots, `gearbot` and
  `scout` are sprite sheets from the MIT-licensed [page-mascot](https://koboyo.com/page-mascot),
  downloaded into `public/mascots` as that project intends. They are third-party
  artwork and are not presented as original work.

## Third-party runtime libraries

- [`edge-aura`](https://edge-aura.js.org) (MIT) — the screen-edge glow. Framework-agnostic
  Canvas 2D engine; its own `prefers-reduced-motion` path freezes it to a static frame.
- [`page-mascot`](https://koboyo.com/page-mascot) (MIT) — the cursor-tracking mascots.
  Tracking switches off without a fine pointer.
- [`world-atlas`](https://github.com/topojson/world-atlas) (ISC) and
  [`topojson-client`](https://github.com/topojson/topojson-client) (ISC) — Natural
  Earth coastlines used by the earlier vector globe; retained dependencies, no
  longer loaded by the textured Earth scene. Natural Earth data is public domain.

Palette direction for the six time bands was informed by
[Aura](https://auragradients.vercel.app/); the hex values in `src/data/timePalettes.ts`
are written for this site's obsidian/ivory/lime system rather than copied.
