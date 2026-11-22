# Project video previews — design

Date: 2026-11-23

## Intent

Make every featured project feel demonstrably real. Each card starts as a
project-specific poster image, then becomes a short, muted product video when
the visitor deliberately explores it: hover or keyboard focus on desktop, and
when the card settles in the central viewport zone while scrolling on touch
devices.

The preview should add evidence and energy without turning the portfolio into
fourteen competing autoplay players.

## Goals

- Give all 14 featured projects a real poster and a real product preview.
- Use the supplied videos for HOSTORA, JAPANO and Math Lab.
- Reuse suitable product footage already present in local source trees.
- Record the real live or local product for projects without usable footage.
- Load and play at most the preview the visitor is currently exploring.
- Keep hover, keyboard, touch, reduced-motion and low-bandwidth behavior clear.
- Preserve the existing editorial/digital-garden art direction and card layout.

## Non-goals

- Do not add audio autoplay.
- Do not embed fourteen YouTube iframes in the gallery.
- Do not use private training media, personal voice samples or identity footage
  as a product preview.
- Do not record real account details, credentials, private chats, customer data
  or identifiable people; all new captures use public/demo state only.
- Do not claim that an animated poster is real product footage.
- Do not redesign the rest of the portfolio.

## Source map

### Supplied videos

- HOSTORA AI: `https://youtu.be/-17sYrbp7pU` (`HOSTORA demo`).
- JAPANO: `https://youtu.be/D8jqwvPUfFc` (`JAPANO APP demo`).
- Math Vision Lab: `https://youtu.be/Ee5RhmHy5AE`.

The videos will be cut into short silent highlight clips rather than embedded
as full YouTube players. Their YouTube links remain available as normal project
actions where already present.

Downloading, cutting and self-hosting these three clips requires the owner's
explicit confirmation that the portfolio may create and publish those derived
preview files.

### Existing local footage

- HOSTORA: use the supplied YouTube clip as the canonical preview; local
  cinematic and source videos are fallback material only.
- JAPANO: use the supplied YouTube app demo as the canonical preview; local
  source video may supplement only if it shows the product clearly.
- Vocalab: record the studio UI. Do not reuse source voice/person videos.
- Other projects: inspect repository media first; accept it only when it is
  genuinely the project UI or gameplay.

### Capture targets without suitable footage

- Live URLs: SAIGON // 77, K-HO, Picko247, Task1 Coach, Vector Vũ Trụ and Run
  FPL can be recorded from their deployed products.
- Local/source targets: Fanpage AI Chatbot, EduVision AI, HappyToPlay, Vehicle
  Counting and Vocalab should be run from source or captured from a verified
  local product surface.
- If a source-only product cannot be run after reasonable setup, produce a
  short product walkthrough from verified UI screenshots and label it as a
  walkthrough, not live gameplay.

## Approaches considered

1. **YouTube embeds per card.** Lowest editing effort, but heavy, privacy-hostile,
   difficult to coordinate on mobile and visually inconsistent. Rejected.
2. **Animated posters only.** Lightweight, but does not meet the request for
   real product videos. Rejected as the default.
3. **Self-hosted optimized product clips.** Use supplied footage, existing
   source clips and new screen recordings; normalize them into one portfolio
   preview format. Selected because it is real, controllable and performant.

## Media format

- Each project gets a poster image and a 6–10 second silent loop.
- Target frame: 16:9 source composed inside the existing card artwork frame;
  crops must keep important UI readable at the current card aspect ratio.
- Primary delivery: H.264 MP4, `muted`, `playsInline`, `loop`, no audio track.
- Target resolution: 960×540 unless a mobile product needs a portrait crop.
- Target size: normally below 1.5 MB per clip; hard review above 2 MB.
- Posters: WebP, approximately 960 px wide, generated from a strong real frame.
- Store under `public/projects/previews/<slug>.mp4` and
  `public/projects/previews/<slug>.webp`.

MP4 is selected over YouTube embeds and WebM-only delivery for broad Safari,
Chrome and mobile support with one source file per project.

## Data model

Add a `preview` object to each featured project:

```ts
preview: {
  poster: string;
  video: string;
  alt: LangStr;
  sourceLabel: LangStr;
  sourceUrl?: string;
}
```

Existing `media` remains valid for case-study artwork during migration, but the
gallery card should use `preview.poster` as its visual evidence layer.

## Component behavior

Create a focused `ProjectPreview` component instead of putting playback state
inside every artwork branch.

### Desktop and keyboard

- Poster is visible initially.
- Pointer enter on the visual starts the preview after the media can play.
- Pointer leave pauses, resets to the beginning and restores the poster.
- Focus entering the visual or its project button starts the same preview.
- Focus leaving the visual restores the poster.
- A small `VIDEO PREVIEW` / `XEM VIDEO` label communicates the state.

### Touch and scroll

- An `IntersectionObserver` activates only the card most centered in the
  viewport once it crosses the chosen threshold.
- Only one preview may play at a time.
- Leaving the active zone pauses and resets the clip.
- Video does not intercept taps; the existing project action remains the
  primary interactive target.
- A compact labelled pause/replay control remains available on touch and for
  keyboard users; it uses the existing icon language and does not become full
  video-player chrome.

### Loading and failure

- Videos use `preload="none"` initially.
- Set the source only when the card is near the viewport or deliberately
  activated.
- Use `import.meta.env.BASE_URL` for every preview URL so GitHub Pages works
  under `/profolio/` while Cloudflare continues to work at `/`.
- Keep the poster until the first video frame is ready; cross-fade without
  changing layout dimensions.
- On autoplay rejection, decode failure or network failure, keep the poster and
  retain all project actions.
- Pause every preview when the document becomes hidden or a case-study dialog
  opens.
- Guard asynchronous `canplay`/`play()` completion with the current activation
  token so a stale card cannot restart after the visitor has moved on.

### Accessibility and motion

- Videos are decorative evidence and silent; poster alt text names the actual
  project screen shown.
- Respect `prefers-reduced-motion: reduce`: never autoplay on hover or scroll;
  keep the poster visible.
- Respect `Save-Data` and effective 2G connections: stay poster-only unless the
  visitor explicitly requests playback.
- Preserve visible focus and native case-study controls.
- Do not add flashing transitions or rapid cuts.

## Visual direction

Keep the existing editorial grid and project-specific palette. The poster/video
is an evidence layer inside the existing artifact, not a new rounded media card.
Use a short monochrome status label, a restrained cross-fade and the existing
accent color for the active state. No glass overlay, large play icon or generic
video-player chrome.

## Performance constraints

- At most one video playing.
- At most the active and adjacent previews may have a loaded source.
- No audio tracks in output clips.
- Preserve fixed aspect ratio to avoid layout shift.
- Verify total preview payload and individual file sizes before deployment.
- Extend the public-asset verifier so all 14 posters and 14 clips are present;
  run `ffprobe` locally to validate duration, dimensions, yuv420p output and the
  absence of audio.

## Verification

- Unit/test coverage for preview source paths and one-active-preview logic where
  practical.
- TypeScript, existing tests and production build pass.
- Desktop check at 1440×1000: hover, pointer leave, focus, dialog interaction.
- Mobile check at 390×844: scroll activation, single active video, no horizontal
  overflow.
- Reduced-motion check: zero autoplaying videos.
- Hidden-tab and off-screen checks: all previews paused.
- Touch and keyboard checks: the labelled pause/replay control works and keeps
  focus visible.
- Public GitHub Pages and Cloudflare DOM/media requests verified after deploy.
- Public hosting checks include MP4 MIME type, cache headers, range requests and
  real playback rather than HTTP 200 alone.

## Rollout

1. Inventory and create the 14 normalized clips and posters.
2. Add the preview data model and component.
3. Validate representative desktop/mobile interactions and media performance.
4. Commit and push source plus optimized assets.
5. Redeploy GitHub Pages and Cloudflare, then verify live playback on both.
