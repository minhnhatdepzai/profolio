# YouTube project previews design

## Intent

Use the three videos supplied by the portfolio owner as direct YouTube playback inside their project cards. Keep short local MP4 walkthroughs only for projects without an owner-supplied video.

## Chosen approach

- `JAPANO` uses YouTube ID `D8jqwvPUfFc`.
- `HOSTORA AI` uses YouTube ID `-17sYrbp7pU`.
- `MATH VISION LAB` uses YouTube ID `Ee5RhmHy5AE`.
- A YouTube iframe is mounted only for the active card, autoplays muted, loops, plays inline, and is removed when the card deactivates.
- The existing HTML video path remains unchanged for the other eleven projects.
- Existing poster fallback, one-active-preview coordination, pause/replay control, reduced-motion, Save-Data, and slow-network behavior remain intact.

## Constraints

- Preserve the existing editorial card composition and responsive layout.
- Do not load all YouTube players at page load.
- Do not add a new runtime dependency.
- YouTube playback must use the privacy-enhanced embed domain.

## Alternatives considered

- Keep downloaded YouTube excerpts as MP4: rejected because the owner explicitly asked for direct YouTube playback.
- Open YouTube in a new tab: rejected because the requested experience is video running inside the project card.
- Mount all three iframes eagerly: rejected because it wastes network and may create simultaneous playback.
