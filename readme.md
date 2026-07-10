# Portfolio

Personal portfolio website — [alex-degt.com](https://alex-degt.com)

## Tech Stack

- [Astro](https://astro.build) + TypeScript
- Tailwind CSS + Sass
- Swiper, Fancybox

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command           | Action                              |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start local dev server              |
| `npm run build`   | Build production site to `./dist/`  |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run Astro type checks               |
| `npm test`        | Run unit tests (Vitest)             |

## Project Structure

```text
.
├── public/          # Static assets (fonts, images, favicon)
├── src/
│   ├── components/  # UI components
│   ├── content/     # Content collections (projects, stack, socials, site)
│   ├── layouts/     # Page layouts
│   ├── lib/         # Shared helpers (content accessors, assets, swiper)
│   ├── pages/       # Routes
│   ├── scripts/     # Client-side scripts
│   └── styles/      # Global styles & partials
└── astro.config.mjs
```
