# HANDOFF

Updated: 2026-08-24 (Asia/Tokyo)

## Objective and status
- Objective: Finish the pedal directly on the real Three.js model, place the finish card/editor at the right of the forge stage, and rebuild the four-page editorial around a unified opening spread, one square photo, and a realistic package set.
- Status: Implementation and production build complete. Sites source/version publication is the remaining action in this task.

## Completed durable work
- Added direct mark hit surfaces to the real Three.js pedal for front, back, left, and right surfaces.
- While final finishing is active, clicking or dragging the real 3D enclosure updates the mark UV position and selected surface.
- Disabled OrbitControls during direct mark dragging to prevent the camera and mark from moving together.
- Replaced the inaccurate 2D pedal preview with compact text, surface, font, style, color, size, and rotation controls.
- Removed the verbose drag/handle instructions and detailed surface-description cards.
- Added the 03 / FINISH card to the right side of the forge stage; the same rail becomes the editor after entering finishing.
- Rebuilt desktop pages 1-2 as one unified spread with a large centered pedal background and four square information cards layered over it.
- Kept mobile pages 1 and 2 individually readable.
- Rebuilt page 3 as one square product photograph.
- Rebuilt page 4 as a full-page package still life containing a three-dimensional box, pedal, booklet, and serial/warranty card.
- Added Sites hosting configuration, Vite Sites plugin integration, and a Cloudflare Worker SPA fallback entry.

## Changed files/components
- src/App.tsx: DirectMarkSurface, PedalModel/Stage mark-edit props, right finish rail, simplified SignatureEditor, unified opening spread, square page 3, package page 4.
- src/design-overrides.css: right-side finish/editor rail, responsive direct editor, opening spread, square photo, and package still-life styles.
- vite.config.ts: Sites Vite plugin.
- package.json / package-lock.json: Vite 8, @openai/sites-vite-plugin, and dual client/Worker production build.
- worker/index.js: Cloudflare Worker asset serving with HTML SPA fallback.
- .openai/hosting.json: Sites project binding.
- HANDOFF.md: current continuation state.

## Verification (2026-08-24)
- npm run build: pass with Vite 8.2.2; client built in 2.53s and Worker server entry built in 993ms.
- Output: main bundle 1,688.72 kB / 499.49 kB gzip.
- Existing chunk-size warning remains; it did not fail the build.
- No tests, typecheck, generation audit, or browser QA were run for this change, per the user's request.

## Active decisions and constraints
- Attached text and screenshots are references; the current user request controls scope.
- Final editing is direct placement on the actual 3D enclosure, with numerical size/rotation controls kept in the compact rail.
- Desktop pages 1-2 are a single visual composition; mobile remains single-page.
- Page 4 uses deterministic composited physical objects rather than unconstrained image generation.
- The production publish is private/owner-only unless access is explicitly changed later.

## Known issues
- Browser visual/pointer verification was not run by request; the browser runtime had also failed initialization twice in earlier work.
- The main production chunk is large and remains a future performance optimization candidate.

## Rollback
- Current-task backup: C:\Users\lushl\AppData\Local\Temp\pedal-gacha-before-direct-3d-editorial-deploy-20260824
- Previous-task backup: C:\Users\lushl\AppData\Local\Temp\pedal-gacha-before-dropdown-stage-editorial-20260824

## Next actions
1. First action: push the exact current source to the Sites source repository.
2. Package the successful production build and save a Sites version tied to that source commit.
3. Deploy that saved version privately to production and record the resulting URL/status.
