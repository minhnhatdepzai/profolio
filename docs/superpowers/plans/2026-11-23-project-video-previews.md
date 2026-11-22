# Project Video Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all 14 featured portfolio projects a real poster and short product-video preview that activates on hover/focus or centered mobile scroll without loading or playing every clip at once.

**Architecture:** A typed preview record travels with each `FeaturedProject`. A controlled `ProjectPreview` component receives the single active slug from `Projects`, while a small policy module decides whether autoplay is allowed and which touch card is nearest the viewport center. Normalized MP4/WebP files live under the public base path and are verified before every build.

**Tech Stack:** React 19, TypeScript, IntersectionObserver, HTMLVideoElement, Vite public assets, Node test runner, yt-dlp, FFmpeg/ffprobe, Chrome DevTools browser QA.

**Spec:** `docs/superpowers/specs/2026-11-23-project-video-previews-design.md`

## Global Constraints

- Exactly 14 poster WebP files and 14 silent H.264 MP4 previews under `public/projects/previews/`.
- Clips are 6–10 seconds, normally 960×540, yuv420p, faststart, no audio and normally below 1.5 MB.
- HOSTORA, JAPANO and Math Lab use the three supplied YouTube videos as source footage.
- Captures use public/demo data only; Vocalab never exposes source voice/person media.
- Desktop activates via pointer/focus; touch activates the most-centered eligible card; at most one preview plays.
- Reduced motion and Save-Data default to poster-only; autoplay failure remains a normal poster state.
- Preview paths resolve through `import.meta.env.BASE_URL` for both `/profolio/` and `/` deployments.
- Existing case-study actions, keyboard focus, visual style and project copy remain intact.

## Review Focus

- A stale `canplay` or resolved `play()` promise must never restart a card that is no longer active; Task 3 tests activation tokens and Task 4 browser QA switches rapidly between cards.
- iOS/Low Power autoplay rejection must leave a usable poster and pause/replay control; Task 3 tests rejected playback state and Task 4 inspects the fallback.
- Mobile observer ties or fast scroll must still select one card only; Task 2 tests center selection and Task 4 counts playing videos during scroll.
- GitHub Pages base path must not 404 preview assets; Task 2 validates path resolution and Task 5 checks live network responses.
- Large/invalid media must stop the build instead of silently deploying; Task 1 verifies headers, file count, size, duration and audio absence.

---

### Task 1: Create and validate the media set

**Files:**
- Create: `scripts/project-preview-sources.json`
- Create: `scripts/build-project-previews.sh`
- Create: `public/projects/previews/<slug>.mp4` (14 files)
- Create: `public/projects/previews/<slug>.webp` (14 files)
- Modify: `scripts/verify-public-assets.mjs`
- Test: `tests/project-preview-assets.test.mjs`

**Interfaces:**
- Consumes: the 14 slugs from `FeaturedProject['slug']` and the source map in the approved spec.
- Produces: `public/projects/previews/<slug>.{mp4,webp}` and a build gate that rejects missing, malformed or oversized preview media.

- [ ] **Step 1: Write the failing asset test**

Assert that all 14 expected MP4/WebP pairs exist, WebP files have RIFF/WEBP magic bytes, MP4 files contain an `ftyp` box, every file is non-empty, and each MP4 is no larger than 2 MB.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/project-preview-assets.test.mjs`
Expected: FAIL because `public/projects/previews/` is incomplete.

- [ ] **Step 3: Add the source manifest and reproducible normalization script**

`project-preview-sources.json` maps each slug to `youtube`, `local-video`, `live-capture` or `product-walkthrough` source metadata. `build-project-previews.sh` trims/scales/crops with FFmpeg, removes audio, emits H.264 yuv420p faststart MP4 and extracts a real-frame WebP poster; it never reads Vocalab person/voice source videos.

- [ ] **Step 4: Build the 14 real previews**

Use yt-dlp for the three approved YouTube sources, suitable source footage where present, Chrome screen recordings for live products, and verified product-screen walkthroughs only when a runnable product is unavailable. Inspect every result with ffprobe and a contact sheet before accepting it.

- [ ] **Step 5: Extend the prebuild asset verifier**

Add the 28 preview assets to `scripts/verify-public-assets.mjs`; validate file signatures and the 2 MB hard limit while preserving the existing eight image checks.

- [ ] **Step 6: Run media and build-gate verification**

Run: `node --test tests/project-preview-assets.test.mjs && npm run build`
Expected: PASS; verifier reports 14 preview pairs and eight existing visual assets.

- [ ] **Step 7: Commit the media set**

```bash
git add scripts/project-preview-sources.json scripts/build-project-previews.sh scripts/verify-public-assets.mjs tests/project-preview-assets.test.mjs public/projects/previews
git commit -m "feat: add real project preview media"
```

### Task 2: Add preview data and playback policy

**Files:**
- Modify: `src/data/projects.ts`
- Create: `src/components/projectPreviewPolicy.ts`
- Test: `tests/project-preview-policy.test.mjs`

**Interfaces:**
- Consumes: the normalized `<slug>.mp4` and `<slug>.webp` convention from Task 1.
- Produces: `ProjectPreviewMedia`, `resolvePreviewUrl(path, baseUrl)`, `autoplayMode(environment)` and `pickCenteredPreview(candidates, viewportHeight)` for Task 3.

- [ ] **Step 1: Write failing policy tests**

Cover base paths `/` and `/profolio/`, reduced motion, Save-Data, effective 2G, fine-pointer hover mode, touch scroll mode, empty candidates and deterministic nearest-center selection.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/project-preview-policy.test.mjs`
Expected: FAIL because the policy module does not exist.

- [ ] **Step 3: Add `ProjectPreviewMedia` and all 14 preview records**

Add `preview: { poster, video, alt, sourceLabel, sourceUrl? }` to `FeaturedProject`; each path uses `projects/previews/<slug>.<ext>` and each bilingual alt describes the real product frame rather than the motion.

- [ ] **Step 4: Implement the pure policy helpers**

Implement the signatures named in Interfaces without DOM globals in module scope so Node tests can import them after TypeScript transpilation.

- [ ] **Step 5: Run policy tests and type-check**

Run: `node --test tests/project-preview-policy.test.mjs && npm run lint`
Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit data and policy**

```bash
git add src/data/projects.ts src/components/projectPreviewPolicy.ts tests/project-preview-policy.test.mjs
git commit -m "feat: define project preview playback policy"
```

### Task 3: Build the controlled preview component

**Files:**
- Create: `src/components/ProjectPreview.tsx`
- Create: `src/components/project-preview.css`
- Modify: `src/sections/Projects.tsx`
- Test: `tests/project-preview-component.test.mjs`

**Interfaces:**
- Consumes: `ProjectPreviewMedia`, URL and autoplay helpers from Task 2.
- Produces: `<ProjectPreview project active onActivate onDeactivate />` and one `activePreviewSlug` coordinator in `Projects`.

- [ ] **Step 1: Write the failing structural/behavior test**

Assert the component uses `muted`, `playsInline`, `loop`, `preload="none"`, an accessible pause/replay button, activation-token guard, poster fallback and cleanup paths for visibility, dialog-open, playback rejection and unmount.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/project-preview-component.test.mjs`
Expected: FAIL because `ProjectPreview.tsx` is absent.

- [ ] **Step 3: Implement `ProjectPreview`**

Render the current project artwork/poster as the stable base and an inert video layer above it. Load the source only near/active, cross-fade after the active token receives a usable first frame, and expose a labelled pause/replay control without allowing the video layer to intercept the existing case-study action.

- [ ] **Step 4: Add the single-active coordinator to `Projects`**

Use pointer/focus events for fine pointers and an observer plus `pickCenteredPreview` for touch. Pause/reset on deactivation, hidden document and open dialog; never activate under reduced-motion or Save-Data without explicit playback.

- [ ] **Step 5: Style the evidence layer and states**

Keep the existing card aspect ratio and palette, add a restrained bilingual `VIDEO PREVIEW` status, visible focus, stable pause target and reduced-motion fallback. Do not add player chrome or change card layout dimensions.

- [ ] **Step 6: Run component test, full tests and type-check**

Run: `npm test && npm run lint`
Expected: all tests pass and TypeScript reports no errors.

- [ ] **Step 7: Commit the component**

```bash
git add src/components/ProjectPreview.tsx src/components/project-preview.css src/sections/Projects.tsx tests/project-preview-component.test.mjs
git commit -m "feat: play project previews on hover and scroll"
```

### Task 4: Visual and interaction QA

**Files:**
- Modify if needed: `src/components/ProjectPreview.tsx`
- Modify if needed: `src/components/project-preview.css`
- Modify if needed: `src/sections/projects-gallery.css`

**Interfaces:**
- Consumes: the complete gallery and media set from Tasks 1–3.
- Produces: visually accepted desktop/mobile behavior with evidence from a real browser.

- [ ] **Step 1: Build and start the production preview**

Run: `npm run build && npm run preview -- --host 0.0.0.0`
Expected: build succeeds and preview responds locally.

- [ ] **Step 2: Inspect desktop at 1440×1000**

Verify all 14 posters, hover activation, pointer-leave reset, keyboard focus activation, pause/replay, rapid card switching, dialog pause, no layout shift and no console errors.

- [ ] **Step 3: Inspect mobile at 390×844**

Verify centered-scroll activation, only one `video:not([paused])`, stable touch actions, accessible pause/replay, no horizontal overflow and poster fallback after leaving the active zone.

- [ ] **Step 4: Inspect constrained preferences**

Emulate reduced motion and Save-Data/effective 2G separately; verify zero autoplay, poster visibility and explicit control behavior.

- [ ] **Step 5: Fix visible or behavioral defects and rerun checks**

Repeat Steps 1–4 after any source change; record accepted viewports and limitations for handoff.

- [ ] **Step 6: Commit QA fixes if any**

```bash
git add src/components/ProjectPreview.tsx src/components/project-preview.css src/sections/projects-gallery.css
git commit -m "fix: polish responsive project previews"
```

### Task 5: Final verification and deployment

**Files:**
- Modify only if required by verified hosting behavior: `public/_headers`, workflow/deployment config.

**Interfaces:**
- Consumes: verified production build and all commits from Tasks 1–4.
- Produces: matching GitHub Pages and Cloudflare deployments with live media playback evidence.

- [ ] **Step 1: Run the full local gate**

Run: `npm test && npm run lint && npm run build && git diff --check`
Expected: zero failures and successful production build.

- [ ] **Step 2: Push `main` and monitor GitHub Pages**

Push the completed commits, wait for the workflow for the exact commit SHA to finish successfully, then reload the public page with cache bypass.

- [ ] **Step 3: Deploy Cloudflare from the root-base build**

Run: `npm run deploy:cloudflare`
Expected: Wrangler prints a new version ID and the canonical Worker URL.

- [ ] **Step 4: Verify both public hosts end-to-end**

At desktop and mobile sizes, confirm 14 posters and 14 video sources, hover/scroll playback, one-active-video rule, pause/replay, no console errors and no overflow. Inspect a preview request on each host for `video/mp4`, cache behavior and range playback rather than relying on HTTP 200 alone.

- [ ] **Step 5: Confirm source/deploy parity**

Compare local HEAD, `origin/main`, GitHub Pages workflow SHA and both public `version.json` documents; report URLs, commit SHA, workflow run and Cloudflare version.
