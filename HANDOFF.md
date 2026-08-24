# HANDOFF

Updated: 2026-08-25 00:10 (Asia/Tokyo)

## Objective and status
- Objective: Preserve full OrbitControls rotation on touch devices and clearly mark the 3D area as non-scrollable.
- Status: Completed and published through GitHub Pages at https://lushlifelikenightflight-hue.github.io/pedal-gacha/. The GitHub repository is public at https://github.com/lushlifelikenightflight-hue/pedal-gacha.

## Completed durable work
- Separated VIEW CONTROL / DRAG / AUTO from the BACKGROUND, PHOTO, and POWER option groups.
- Added a persistent 360° VIEW / DRAG TO ROTATE header, thin inspection boundary, corner markers, and scroll-direction cue around the 3D canvas.
- Added a temporary Japanese drag overlay on first result reveal and whenever the touch view or VIEW CONTROL is activated.
- Preserved desktop OrbitControls mouse rotation and wheel zoom.
- Restored the original one-finger OrbitControls rotation on touch devices, including horizontal and vertical orbit movement.
- Restored `touch-action: none` on the 3D canvas so gestures remain dedicated to camera control.
- Replaced the scroll cue with a persistent Japanese warning that the page cannot be scrolled inside the 3D area.
- Increased the inspection boundary contrast with a stronger accent border, tinted overlay, and high-contrast warning band.
- Broke the hero declaration after まだ存在しない、.
- Changed the finish headline to デコってこ。 and the shipping headline to パッケージングしていこう。.
- Rebuilt the editorial as three pages: product cover, small-type quick guide, and English warranty certificate.
- The warranty changes only pedal name, serial, issue date, and manufacturer.
- Removed the fourth editorial page from navigation, page count, and rendering.
- Reduced FINAL STEP to editorial-page-1 preview plus one X share action.
- Replaced selectable share compositions with a deterministic portrait share image matching editorial page 1.
- Removed the pre-forge CUSTOM GRAPHIC editor and replaced it with a post-forge Sticker tool beside Signature.
- Added direct sticker placement on the top, left, right, and back surfaces of the real Three.js pedal.
- Added sticker image selection/replacement/removal, surface, size up to 100%, and rotation controls to the finish rail.
- Expanded signature size from 50% to 100% of the selected pedal face.
- Removed signature collision rejection and expanded both signature and sticker hit surfaces to the full physical face.
- Kept stickers below knobs, switches, LEDs, and other hardware in the Three.js render stack so overlapping placement is allowed and hardware remains visually above them.
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
- Removed two unreferenced legacy pedal-art atlas PNGs from the shipped public assets; originals are recoverable from the current-task backup.
- Converted the two active pedal texture atlases from 5.49 MB of PNGs to 443 KB of high-quality WebP assets and updated Three.js texture URLs; originals remain recoverable from the backup.
- Added a dedicated <=600px layout pass so the selection form, forge viewer, finish editor, and editorial pages fit the device width.
- Removed the 1100/1120px mobile stage minimum heights; the real 3D canvas now stays compact above the finish/editor controls.
- Added portrait-camera distance fitting so tall phone viewports frame the pedal instead of cropping it.

## Changed files/components
- src/App.tsx: original OrbitControls touch rotation, 360-degree hint copy, and non-scroll warning copy.
- src/design-overrides.css: high-contrast non-scrollable inspection region, warning band, and `touch-action: none`.
- vite.config.ts: uses `/pedal-gacha/` as the base path during GitHub Actions builds.
- .github/workflows/deploy-pages.yml: typechecks, builds, uploads `dist/client`, and deploys GitHub Pages on `main`.
- README.md: links to the GitHub Pages release.
- vite.config.ts: Sites Vite plugin.
- package.json / package-lock.json: Vite 8, @openai/sites-vite-plugin, sharp build tooling, and dual dist/client + dist/server production build.
- worker/index.js: Cloudflare Worker asset serving with HTML SPA fallback.
- .openai/hosting.json: Sites project binding.
- HANDOFF.md: current continuation state.

## Verification (2026-08-25)
- Full-rotation restoration: `npm run typecheck` passed.
- Full-rotation restoration: `GITHUB_ACTIONS=true npm run build` passed with Vite 8.2.2.
- The existing main-chunk size warning remains non-fatal.

## Previous verification (2026-08-24)
- Current local 3D interaction revision: `npm run typecheck` passed.
- Current local 3D interaction revision: `npm run build` passed with Vite 8.2.2; dist/client and dist/server were regenerated.
- Current local build retains the existing main-chunk size warning; it did not fail the build.
- Browser visual/touch QA was not run because it was not explicitly requested.
- GitHub commit `8790d7d9585faec4018b02b3897232558141718f` pushed to `main`.
- GitHub Actions run `32737775986` passed after enabling Pages with `build_type=workflow`.
- Public URL returned HTTP 200 on 2026-08-24.
- Sites version 6 deployment succeeded at https://pedal-forge-lab.lushlife-like-nightf.chatgpt.site.
- Source commit deployed: f0805762597c1f3223eca35976680a084f0e8a8c.
- TypeScript typecheck passed.

## Active decisions and constraints
- Attached text and screenshots are references; the current user request controls scope.
- Final editing is direct placement on the actual 3D enclosure, with numerical size/rotation controls kept in the compact rail.
- Desktop shows editorial pages 1-2 as a real two-page spread; mobile remains single-page.
- Editorial page 3 is an English warranty certificate; there is no page 4.
- FINAL STEP exposes only X sharing, and its image is editorial page 1.
- GitHub Pages is the requested publication path. Do not deploy later changes to Sites unless the user explicitly asks for Sites again.
- The GitHub repository and Pages site are public; retain that access level unless the user explicitly requests a change.

## Known issues
- Browser visual/touch verification has not been run.
- The main production chunk is large and remains a future performance optimization candidate.

## Rollback
- GitHub commit `8790d7d` is the immediate rollback point before the full-rotation restoration.
- Sites version 5 is the immediate production rollback target.
- Sites version 4 is the immediate production rollback target.
- Current-task backup: C:\Users\lushl\AppData\Local\Temp\pedal-gacha-before-direct-3d-editorial-deploy-20260824
- Previous-task backup: C:\Users\lushl\AppData\Local\Temp\pedal-gacha-before-dropdown-stage-editorial-20260824
- Mobile-fix backup: C:\Users\lushl\AppData\Local\Temp\pedal-gacha-before-mobile-fit-20260824190757

## Next actions
1. First action: if QA is requested, verify full horizontal/vertical orbit rotation and the non-scroll warning at a touch-width viewport.
2. For future releases, push `main` and monitor the Deploy GitHub Pages workflow.
3. Treat main-bundle code splitting as a separate future performance task.
