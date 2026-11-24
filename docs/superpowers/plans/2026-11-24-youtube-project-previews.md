# YouTube Project Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Play the three owner-supplied videos directly from YouTube inside their project cards while retaining local MP4 previews for the other eleven projects.

**Architecture:** Model preview media as a discriminated union. The existing preview coordinator continues choosing one active card; `ProjectPreview` renders either a lazy YouTube iframe or the existing local video element.

**Tech Stack:** React 19, TypeScript, Vite, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-11-24-youtube-project-previews-design.md`

## Global Constraints

- Use `youtube-nocookie.com` for direct embeds.
- Autoplay must be muted and only the active YouTube card may mount an iframe.
- Retain poster fallback, manual pause/play, reduced-motion, Save-Data and slow-network behavior.
- Do not add dependencies or redesign project cards.

## Review Focus

- Verify exactly the three supplied IDs use YouTube and all other projects use local MP4.
- Verify deactivation removes the iframe and stops playback.
- Verify manual play remains available when automatic motion is disabled.
- Verify mobile centered-scroll activation and desktop hover/focus behavior.
- Verify GitHub Pages base paths remain valid for local assets.

---

### Task 1: Media model and YouTube URL contract

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/components/projectPreviewPolicy.ts`
- Create: `tests/project-preview-data.test.mjs`
- Modify: `tests/project-preview-policy.test.mjs`

**Interfaces:**
- Produces: discriminated `ProjectPreviewMedia` and `youtubeEmbedUrl(youtubeId: string): string`.
- Consumes: the three supplied YouTube IDs from the spec.

- [ ] Write failing tests for the three YouTube mappings, eleven local previews and privacy-enhanced embed URL.
- [ ] Run those tests and confirm they fail because the model and URL helper do not exist.
- [ ] Implement the union, mappings and URL helper.
- [ ] Run the focused tests and full suite.

### Task 2: Direct YouTube player in project cards

**Files:**
- Modify: `src/components/ProjectPreview.tsx`
- Modify: `src/components/project-preview.css`
- Modify: `tests/project-preview-component.test.mjs`

**Interfaces:**
- Consumes: `ProjectPreviewMedia` and `youtubeEmbedUrl` from Task 1.
- Produces: active-only YouTube iframe playback with the existing project preview controls.

- [ ] Write a failing component contract test for a privacy-enhanced iframe, autoplay permission and active-only mounting.
- [ ] Run the focused test and confirm it fails.
- [ ] Implement YouTube and local playback branches with shared poster/status/control UI.
- [ ] Run focused tests, TypeScript and the full suite.
- [ ] Visually inspect representative desktop and mobile viewports.

### Task 3: Production release

**Files:**
- Modify: `public/version.json` through the existing build/deploy workflow if applicable.

**Interfaces:**
- Consumes: the verified implementation from Tasks 1–2.
- Produces: matching GitHub Pages and Cloudflare deployments.

- [ ] Run tests, TypeScript, both production builds and `git diff --check`.
- [ ] Commit and push the verified change.
- [ ] Verify GitHub Pages and Cloudflare serve the new commit and inspect the live desktop/mobile interaction.
