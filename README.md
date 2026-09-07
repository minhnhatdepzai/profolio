# Lê Minh Nhật — AI Engineer & Creative Developer

A bilingual, performance-aware portfolio for selected Web, Mobile, AI and interactive work.

The editorial interface pairs an obsidian/ivory/lime visual system with a lazy-loaded,
pointer-responsive chrome sculpture. WebGL pauses offscreen and in hidden tabs;
mobile, reduced-motion and unavailable-WebGL sessions retain a CSS visual fallback.
Eight project cards offer direct demos and deep-linked case-study dialogs. Recruiter
actions include an explicit CV download, professional experience and contact links.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
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
