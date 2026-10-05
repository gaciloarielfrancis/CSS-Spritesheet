# Build a CSS Spritesheet Generator Web App

Build a modern, production-ready web application called **CSS Spritesheet**.

The application allows developers and designers to upload multiple images/icons, automatically combine them into an optimized spritesheet, and generate the CSS/SCSS code required to use each sprite.

The application should be fast, lightweight, responsive, and work primarily on the client side.

---

## 1. Product Name

**CSS Spritesheet**

### Purpose

Convert multiple individual images into a single CSS spritesheet and automatically generate the CSS required to display each image using `background-position`.

Example:

```text
home.png
order.png
topup.png
shop.png
```

becomes:

```text
spritesheet.png
```

with generated:

```css
.icon-home {
  width: 32px;
  height: 32px;
  background-image: url("./spritesheet.png");
  background-position: 0 0;
}

.icon-order {
  width: 32px;
  height: 32px;
  background-image: url("./spritesheet.png");
  background-position: -32px 0;
}
```

---

# 2. Technology Stack

Use:

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* VueUse where useful
* Lucide Icons
* HTML5 Canvas for spritesheet generation
* Web APIs for file processing
* No backend required for the core functionality

The application should work entirely in the browser.

Do not upload user images to a server.

---

# 3. Design Direction

Create a polished developer-tool interface inspired by modern tools such as:

* Vercel
* Linear
* Raycast
* GitHub
* shadcn/ui

Use a clean dark/light UI with a strong blue accent.

The application logo should represent:

* A spritesheet/grid
* CSS
* Multiple images combined into one sheet

Use the provided CSS Spritesheet logo as the visual branding reference.

The interface should feel like a professional developer utility rather than a generic image uploader.

---

# 4. Main Application Layout

Create the following structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo / CSS Spritesheet                    Theme  GitHub      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CSS Spritesheet Generator                                   │
│  Combine images into one optimized spritesheet               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │              Drag & Drop Images                       │  │
│  │                                                        │  │
│  │        Drop PNG, JPG, WEBP, SVG files here            │  │
│  │                                                        │  │
│  │                 [ Browse Files ]                       │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Uploaded Images                                               │
│                                                              │
│ [icon] home.png     32x32     [preview] [delete]             │
│ [icon] order.png    32x32     [preview] [delete]             │
│ [icon] shop.png     64x64     [preview] [delete]             │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Sprite Preview                                                │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │                    SPRITESHEET                           │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Generated Code                                                │
│                                                              │
│ CSS | SCSS | JSON                                             │
│                                                              │
│ [ Copy ] [ Download ]                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. Image Upload

Support:

* PNG
* JPG/JPEG
* WEBP
* SVG

Allow:

* Click to upload
* Drag and drop
* Multiple file selection

Display uploaded images in a list/grid.

Each image should show:

* Thumbnail
* Filename
* Width
* Height
* File size
* Remove button

Example:

```text
┌───────────────────────────────────────────────┐
│ [IMAGE]  home.png                             │
│          32 × 32 • 1.4 KB              [×]   │
└───────────────────────────────────────────────┘
```

Prevent unsupported files from being added.

Show useful validation messages.

---

# 6. Image Management

Allow users to:

* Remove individual images
* Remove all images
* Reorder images using drag and drop
* Rename sprite class names
* Enable/disable individual images

The sprite class name should automatically be generated from the filename.

Example:

```text
home.png       → icon-home
shopping-cart.png → icon-shopping-cart
user_profile.png  → icon-user-profile
```

Sanitize filenames into valid CSS identifiers.

---

# 7. Spritesheet Layout Algorithms

Implement multiple layout options.

## Option A — Horizontal

```text
┌──────┬──────┬──────┬──────┐
│ home │order │shop  │user  │
└──────┴──────┴──────┴──────┘
```

## Option B — Vertical

```text
┌────────────┐
│    home    │
├────────────┤
│    order   │
├────────────┤
│    shop    │
├────────────┤
│    user    │
└────────────┘
```

## Option C — Grid

Automatically arrange images into rows and columns.

## Option D — Packed

Implement a basic rectangle-packing algorithm to minimize unused space.

Allow the user to select:

```text
Layout:
○ Horizontal
○ Vertical
○ Grid
● Packed
```

---

# 8. Spritesheet Configuration

Create a settings panel containing:

### Padding

```text
Padding: 0px
```

Allow:

```text
0
1
2
4
8
16
32
```

or custom values.

### Spacing / Gap

```text
Gap: 0px
```

### Background

Options:

```text
Transparent
White
Black
Custom
```

Default:

```text
Transparent
```

### Pixel Ratio

Support:

```text
1x
2x
3x
```

For example:

```text
1x → normal
2x → retina
3x → high density
```

When using 2x, correctly scale the generated CSS dimensions.

---

# 9. Sprite Preview

Create an interactive preview area.

Display the generated spritesheet at its actual dimensions.

Show:

* Grid boundaries
* Image boundaries
* Image names
* Coordinates
* Width
* Height

When the user hovers over a sprite, highlight it.

Example tooltip:

```text
home
x: 0
y: 0
width: 32
height: 32
```

Allow:

```text
Zoom In
Zoom Out
Fit
100%
```

---

# 10. Generated CSS

Automatically generate CSS for every sprite.

Example:

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
  background-position: -40px 0;
}

.sprite-shop {
  width: 64px;
  height: 64px;
  background-position: 0 -40px;
}
```

Make sure the generated coordinates correctly account for:

* Padding
* Gap
* Sprite position
* Retina scaling
* Image dimensions

---

# 11. CSS Options

Provide several code generation formats.

Tabs:

```text
CSS
SCSS
LESS
JSON
```

CSS should be the default.

SCSS example:

```scss
$spritesheet: "./spritesheet.png";

.sprite {
  background-image: url($spritesheet);
  background-repeat: no-repeat;
}

.sprite-home {
  width: 32px;
  height: 32px;
  background-position: 0 0;
}
```

JSON should contain sprite metadata:

```json
{
  "image": "spritesheet.png",
  "width": 128,
  "height": 64,
  "sprites": {
    "home": {
      "x": 0,
      "y": 0,
      "width": 32,
      "height": 32
    }
  }
}
```

---

# 12. Download

Provide:

### Download Spritesheet

Download:

```text
spritesheet.png
```

### Download CSS

Download:

```text
spritesheet.css
```

### Download Package

Provide:

```text
css-spritesheet.zip
```

containing:

```text
css-spritesheet/
├── spritesheet.png
├── spritesheet.css
└── sprites.json
```

Use browser APIs to generate the ZIP if possible.

Do not require a backend.

---

# 13. Copy Code

Every generated code section should have a:

```text
Copy
```

button.

After clicking:

```text
Copied!
```

Use the Clipboard API.

---

# 14. Export Formats

Allow spritesheet export as:

```text
PNG
WEBP
```

Optionally support:

```text
JPEG
```

but PNG should be the default because transparency is important for sprites.

Allow quality configuration for WEBP/JPEG.

---

# 15. Image Optimization

Implement basic client-side optimization.

Features:

* Remove unnecessary transparent space around sprites
* Trim transparent pixels
* Optional image scaling
* Avoid unnecessary canvas dimensions
* Use efficient Canvas operations

Add an option:

```text
☑ Trim transparent pixels
```

When enabled, automatically calculate the smallest bounding box containing non-transparent pixels.

---

# 16. CSS Background Position

Be extremely careful with CSS coordinates.

If the sprite is located at:

```text
x = 40
y = 20
```

and its size is:

```text
width = 32
height = 32
```

generate:

```css
background-position: -40px -20px;
```

Do not use positive values.

Ensure the generated CSS correctly displays only the intended sprite.

---

# 17. Responsive UI

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop:

```text
Sidebar/settings | Preview
```

Mobile:

```text
Settings
↓
Upload
↓
Images
↓
Preview
↓
Generated Code
```

Do not allow horizontal overflow.

---

# 18. State Management

Create a clean TypeScript data model.

Example:

```ts
interface SpriteItem {
  id: string
  name: string
  className: string
  fileName: string
  file: File
  image: HTMLImageElement
  width: number
  height: number
  x: number
  y: number
  enabled: boolean
}
```

Configuration:

```ts
interface SpriteSettings {
  layout: "horizontal" | "vertical" | "grid" | "packed"
  padding: number
  gap: number
  columns?: number
  pixelRatio: 1 | 2 | 3
  background: "transparent" | "white" | "black" | "custom"
  backgroundColor?: string
  trimTransparent: boolean
  outputFormat: "png" | "webp"
  quality: number
}
```

---

# 19. Architecture

Use a clean component architecture.

Suggested structure:

```text
src/
├── components/
│   ├── AppHeader.vue
│   ├── UploadZone.vue
│   ├── ImageList.vue
│   ├── ImageListItem.vue
│   ├── SpritePreview.vue
│   ├── SettingsPanel.vue
│   ├── CodePreview.vue
│   ├── CodeTabs.vue
│   ├── DownloadButtons.vue
│   └── EmptyState.vue
│
├── composables/
│   ├── useSprites.ts
│   ├── useSpriteGenerator.ts
│   ├── useFileUpload.ts
│   └── useClipboard.ts
│
├── services/
│   ├── spriteGenerator.ts
│   ├── layout/
│   │   ├── horizontal.ts
│   │   ├── vertical.ts
│   │   ├── grid.ts
│   │   └── packed.ts
│   └── codeGenerator.ts
│
├── types/
│   └── sprite.ts
│
├── utils/
│   ├── imageUtils.ts
│   ├── filenameUtils.ts
│   └── downloadUtils.ts
│
├── App.vue
└── main.ts
```

Keep business logic out of Vue components whenever possible.

---

# 20. Performance

The application should handle at least:

```text
100+ images
```

without becoming noticeably slow.

Avoid unnecessary:

* Canvas recreation
* Image decoding
* Vue re-renders
* DOM updates

Use:

* `URL.createObjectURL()`
* Canvas
* Computed state
* Debounced sprite generation where appropriate

Revoke object URLs when images are removed.

---

# 21. Persistence

Use `localStorage` for application settings.

Persist:

* Theme
* Layout
* Padding
* Gap
* Background
* Pixel ratio
* Output format
* Other user preferences

Do not persist the actual uploaded image files unless explicitly implemented using IndexedDB.

---

# 22. Theme

Support:

```text
Light
Dark
System
```

Default to:

```text
System
```

Add a theme toggle in the header.

---

# 23. Empty State

When no images have been uploaded, display a polished empty state:

```text
CSS Spritesheet

Combine your images into a single optimized spritesheet.

Drag and drop your images here

or

[ Browse Files ]

PNG • JPG • WEBP • SVG
```

---

# 24. Error Handling

Handle:

* Unsupported file types
* Corrupted images
* Extremely large images
* Duplicate filenames
* Empty files
* Canvas limitations
* Failed image decoding

Display friendly error messages.

Example:

```text
Unable to load "icon.png".

The image appears to be corrupted or unsupported.
```

Never crash the entire application because of one invalid file.

---

# 25. Accessibility

Follow good accessibility practices.

Use:

* Semantic HTML
* Keyboard navigation
* Focus states
* ARIA labels where necessary
* Accessible buttons
* Sufficient color contrast
* Keyboard-accessible drag/drop alternatives

Every icon-only button must have an accessible label.

---

# 26. SEO / Landing Page

Add a simple landing section explaining:

### What is CSS Spritesheet?

CSS Spritesheet combines multiple images into a single image and uses CSS `background-position` to display individual images.

Benefits:

* Fewer image requests
* Smaller asset management overhead
* Useful for icons
* Useful for game UI
* Useful for legacy websites
* Easy CSS integration

Include examples.

---

# 27. Privacy

Display:

```text
Your images never leave your browser.
All spritesheet generation happens locally.
```

Do not implement image uploading to an external server.

---

# 28. Developer Experience

Use strict TypeScript.

Avoid:

```ts
any
```

unless absolutely necessary.

Use reusable functions.

Add comments only where the algorithm is not obvious.

Use clean naming conventions.

Prefer:

```ts
const
```

over:

```ts
let
```

where possible.

---

# 29. Testing

Create unit tests for:

### Filename conversion

```text
home.png → icon-home
shopping-cart.png → icon-shopping-cart
user_profile.png → icon-user-profile
```

### Layout

Test:

* Horizontal
* Vertical
* Grid
* Packed

### Coordinates

Verify that:

```text
sprite.x
sprite.y
sprite.width
sprite.height
```

are correct.

### CSS generation

Verify that:

```css
background-position
```

uses negative coordinates.

### Transparent trimming

Test images with:

* Fully opaque pixels
* Transparent borders
* Fully transparent images

---

# 30. Important UX Requirement

The spritesheet should regenerate automatically whenever the user changes:

* Uploaded images
* Image order
* Layout
* Padding
* Gap
* Pixel ratio
* Background
* Transparent trimming

Do not require the user to click a "Generate" button for normal changes.

However, for very large sprite collections, debounce regeneration to prevent excessive processing.

---

# 31. Advanced Feature — Sprite Selection

Allow users to click a sprite in the preview.

When selected:

```text
Sprite: home
Position: 0, 0
Size: 32 × 32
Class: sprite-home
```

Display its generated CSS.

Also highlight the corresponding item in the image list.

---

# 32. Advanced Feature — CSS Usage Preview

For each sprite, show:

```html
<span class="sprite sprite-home"></span>
```

and:

```css
.sprite-home {
  ...
}
```

Optionally display a live preview of the generated CSS.

---

# 33. Advanced Feature — Naming Prefix

Add:

```text
Class Prefix
```

Default:

```text
sprite
```

Example:

```text
sprite-home
sprite-order
sprite-shop
```

If user changes it to:

```text
icon
```

generate:

```text
icon-home
icon-order
icon-shop
```

---

# 34. Advanced Feature — Output Filename

Allow:

```text
Spritesheet Name:
[ spritesheet ]
```

Generate:

```text
spritesheet.png
spritesheet.css
spritesheet.json
```

If the user enters:

```text
game-icons
```

generate:

```text
game-icons.png
game-icons.css
game-icons.json
```

---

# 35. Final UI

The final application should feel polished and production-ready.

Prioritize:

1. Simplicity
2. Speed
3. Clear visual hierarchy
4. Excellent drag-and-drop experience
5. Accurate sprite positioning
6. High-quality generated CSS
7. Developer-friendly export
8. Responsive design

Avoid unnecessary animations and excessive UI elements.

Use subtle animations for:

* Drag-over state
* Upload
* Removing images
* Copy success
* Theme switching

---

# 36. Deliverables

Produce a complete working project.

Include:

```text
package.json
vite.config.ts
tsconfig.json
src/
public/
README.md
```

The README must explain:

* Installation
* Development
* Production build
* How spritesheets work
* Supported image formats
* Generated CSS format
* Project architecture

The project must run with:

```bash
npm install
npm run dev
```

and build with:

```bash
npm run build
```

---

# 37. Implementation Rules

Do not create fake functionality.

All buttons must work.

Do not use placeholder sprite generation.

Implement the actual:

* Image decoding
* Canvas rendering
* Layout algorithms
* CSS generation
* JSON generation
* File downloads
* ZIP generation
* Drag and drop
* Reordering
* Preview
* Configuration

Keep the application entirely client-side.

Before finishing, verify that:

```bash
npm run build
```

completes successfully with no TypeScript errors.

Also test the generated spritesheet by rendering the generated CSS against the generated image and verify that each sprite displays correctly.

---

# 38. Development Approach

Build the project incrementally:

### Phase 1

Create the Vite + Vue + TypeScript application and base UI.

### Phase 2

Implement image upload and preview.

### Phase 3

Implement sprite layout algorithms.

### Phase 4

Implement Canvas spritesheet generation.

### Phase 5

Implement CSS/SCSS/JSON generation.

### Phase 6

Implement preview and sprite selection.

### Phase 7

Implement downloads and ZIP export.

### Phase 8

Implement settings, themes, persistence, and responsive UI.

### Phase 9

Add tests and fix edge cases.

### Phase 10

Perform final production build and cleanup.

Do not stop after creating the UI. The final result must be a fully functional CSS spritesheet generator.
