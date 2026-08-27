# Asset provenance

## PEDAL FORGE design atlases

- public/pedal-forge-motif-grid-keyed.webp
  - Representation: generated/authored 2D atlas used directly as a 5 x 5 texture sheet.
  - Source supplied by the project owner: ChatGPT Image 2026年8月27日 10_47_06.png.
  - Processing: resized to 1024 x 1024, edge-connected cream background made transparent, WebP quality 84 / alpha quality 92.
  - Runtime conversion: split into 25 independently addressable WebP cells (pedal-forge-motif-00.webp through pedal-forge-motif-24.webp).
  - Runtime use: one cell as a single top-face motif at the center or a deterministic motif position.

- public/pedal-forge-illustration-grid.webp
  - Representation: generated/authored 2D atlas used directly as a 3 x 3 texture sheet.
  - Source supplied by the project owner: ChatGPT Image 2026年8月27日 11_01_34.png.
  - Processing: resized to 1024 x 1024, WebP quality 84.
  - Runtime conversion: split into 9 independently addressable WebP cells (pedal-forge-illustration-00.webp through pedal-forge-illustration-08.webp).
  - Runtime use: one category-compatible cell on a rounded top-face geometry, scaled with cover-style framing.

## Procedural pattern source

- Representation: original procedural CanvasTexture mapped once onto rounded top-face geometry.
- Runtime patterns: stripe, checker, dot, herringbone, and seigaiha.
- The linked FASHIONSNAP pattern dictionary and NEXTPAGE pattern-name article were used only as vocabulary/reference; no third-party image assets were copied.

## Background music

- public/bgm-pedal-forge.mp3
  - Source: project-owner supplied file BGM_PEDAL-FORGE.mp3 on 2026-08-28.
  - SHA-256: 86C6D8148F9C69DC3059FE12F36B3E4CA868B88D53A7314C786FFB335F300DD9.
  - Runtime use: low-volume looped site BGM, started after the first user interaction with a persistent ON/OFF control.
