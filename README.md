# CSS Spritesheet Generator

Combine multiple images into a single optimized spritesheet with production-ready CSS — **100% client-side**. No uploads, no backend.

![logo](./public/logo.webp)

## Features

- **Upload** PNG, JPG/JPEG, WEBP, SVG via drag & drop, click-to-browse, multi-select
- **Manage**: thumbnail list with size/dimensions, rename sprite names, enable/disable, drag-to-reorder, clear all, duplicate-name handling
- **Layouts**: Horizontal, Vertical, Grid (configurable columns), Packed (shelf-based rectangle packing)
- **Settings**: padding (0–64 + presets), gap, background (transparent/white/black/custom), pixel ratio 1x/2x/3x, trim transparent pixels, class prefix, output filename
- **Preview**: actual-size sheet with sprite boundaries, hover tooltips, click-to-select (syncs with list + shows per-sprite CSS), zoom (in/out/%/fit), grid toggle
- **Code**: CSS, SCSS, LESS, JSON tabs with copy-to-clipboard, per-sprite usage snippet (`<span class="sprite sprite-home">`), correct **negative** `background-position`
- **Export**: spritesheet as PNG/WEBP/JPEG (quality control, JPEG auto-flattened), CSS download, `.zip` package (`spritesheet.png + .css + .json`) via JSZip
- **UX**: dark/light/system theme (persisted), localStorage settings persistence, responsive (sidebar → stacked on mobile), empty state, friendly validation errors, ARIA labels + keyboard support

## How spritesheets work

```
home.png + order.png + shop.png  →  spritesheet.png (1 HTTP request)
```

Each sprite is displayed by shifting the shared background image:

```css
.sprite {
  background-image: url("./spritesheet.png");
  background-repeat: no-repeat;
  display: inline-block;
}

.sprite-home {
  width: 32px;
  height: 32px;
  background-position: 0 0;
}

.sprite-order {
  width: 32px;
  height: 32px;
  background-position: -40px 0; /* negative offsets — always */
}
```

- Position `(x=40, y=20)` → `background-position: -40px -20px`
- Retina: sheet is rendered at `pixelRatio ×` canvas pixels; CSS coordinates are divided back to logical px
- Trimming removes transparent borders from the sheet but CSS keeps the full logical size

## Supported formats

| Input | Export |
|-------|--------|
| PNG, JPG/JPEG, WEBP, SVG (≤10 MB, ≤4096 px per side) | PNG (default, transparency-safe), WEBP, JPEG (quality 1–100) |

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run build` runs `vue-tsc -b` (strict TypeScript, no `any`) then `vite build`. Output goes to `dist/`.

## Tests

```bash
npm test            # vitest run
npm run test:watch  # watch mode
```

Covers:
- Filename → class conversion (`home.png → icon-home`, sanitization, dedup)
- Layouts (horizontal/vertical/grid/packed: positions, sheet size, no-overlap)
- CSS coordinates (negative `background-position`, retina scaling, prefix/filename, JSON metadata)
- Transparent trimming (opaque, bordered, fully-transparent)

## Project architecture

```
src/
├── components/        # Presentational Vue components (no business logic)
│   ├── AppHeader.vue      # Logo, theme toggle, GitHub link
│   ├── UploadZone.vue     # Drag & drop + file input
│   ├── ImageList.vue / ImageListItem.vue
│   ├── SettingsPanel.vue  # Layout, spacing, bg, ratio, trim, naming, format
│   ├── SpritePreview.vue  # Canvas preview, hover/select, zoom
│   ├── CodePreview.vue    # CSS/SCSS/LESS/JSON tabs + copy
│   ├── DownloadButtons.vue
│   └── EmptyState.vue
├── composables/
│   ├── useSprites.ts          # Upload/decode/rename/reorder/enable state
│   ├── useSpriteGenerator.ts  # Debounced sheet regen, settings persistence, theme
│   ├── useFileUpload.ts       # Drag events
│   └── useClipboard.ts        # Clipboard API + fallback
├── services/
│   ├── spriteGenerator.ts     # Canvas rendering (ratio scaling, bg fill, trim blits)
│   ├── codeGenerator.ts       # CSS/SCSS/LESS/JSON builders
│   └── layout/                # horizontal | vertical | grid | packed
├── types/sprite.ts
├── utils/                 # filenameUtils | imageUtils | downloadUtils
├── App.vue / main.ts / style.css
```

Business logic lives in `services/` + `utils/`; components only render state and emit events.

## Privacy

Your images never leave your browser. Decoding (`createObjectURL` + `Image`), packing, `Canvas2D` rendering and ZIP creation all happen locally.

## License

MIT
