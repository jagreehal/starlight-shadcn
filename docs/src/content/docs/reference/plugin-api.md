---
title: Plugin API
description: Configuration options for the starlight-shadcn plugin.
---

## Installation

```bash
pnpm add starlight-shadcn @astrojs/starlight @astrojs/react
pnpm dlx shadcn@latest init --preset bIkfnvM --base aria --template astro
pnpm add -D @tailwindcss/vite tailwindcss sharp
```

## Basic usage

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import starlightShadcn from 'starlight-shadcn';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    starlight({
      title: 'My Docs',
      customCss: ['./src/styles/global.css'],
      plugins: [starlightShadcn()],
    }),
  ],
});
```

## Minimum config

```js
starlight({
  customCss: ['./src/styles/global.css'],
  plugins: [starlightShadcn()],
});
```

## Recommended config

```js
starlight({
  title: 'My Docs',
  customCss: ['./src/styles/global.css'],
  lastUpdated: true,
  plugins: [starlightShadcn()],
});
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `warnOverrides` | `boolean` | `true` | Warn if Starlight already defines a component override |
| `overrides` | `ComponentName[]` | all 28 | Subset of components to override |
| `collapsibleSidebar` | `boolean` | `true` | Desktop (≥50rem) collapsible sidebar with hover peek |
| `clerkToc` | `boolean` | `true` | Clerk-style SVG track on the desktop table of contents |
| `pageActions` | `boolean \| { markdownUrl?: string }` | `true` | Copy Markdown + Open in ChatGPT/Claude/Cursor beside the page title |
| `fonts` | `boolean` | `true` | Inject Geist Sans + Geist Mono as `--font-geist` / `--font-geist-mono` fallbacks |
| `palettes` | `{ value, label }[]` | `[]` | Extra palettes offered beside the light/dark toggle |
| `navLinks` | `{ label, href, activeMatch?, translations? }[]` | `[]` | Top-level links beside the site title |

### Nav links

Shown beside the site title, and at the top of the mobile menu below `50rem`.

```js
starlightShadcn({
  navLinks: [
    { label: 'Guides', href: '/guides/introduction/', activeMatch: '/guides/' },
    { label: 'Changelog', href: 'https://github.com/you/repo/releases' },
  ],
});
```

- **`href`** — root-relative hrefs get the site `base` prepended for you, so `/guides/` works on a project page without hardcoding the repo name. Absolute URLs are left alone.
- **`activeMatch`** — path prefix that marks the link active. A nav link usually points at a landing page *inside* the section it stands for, so without this nothing is highlighted while the reader browses the rest of that section. Defaults to `href`.
- **`translations`** — per-locale label overrides, keyed by locale like Starlight's sidebar: `translations: { fr: 'Guides' }`. `href` is not localised; use an absolute path per locale if you need that.

### Palettes

The light/dark toggle always renders. `palettes` adds a picker next to it that writes `data-palette` to `<html>`; you supply the matching CSS. With the default empty list there is no picker.

```js
starlightShadcn({
  palettes: [{ value: 'sunset', label: 'Sunset' }],
});
```

```css
:root[data-palette='sunset'] { --primary: oklch(0.7 0.19 45); /* … */ }
.dark[data-palette='sunset'] { --primary: oklch(0.75 0.17 45); /* … */ }
```

The selection persists in `localStorage`; a stored value you later remove from `palettes` falls back to the default.

### Fonts

By default the plugin injects **Geist Sans** and **Geist Mono** (via Fontsource CSS) as `--font-geist` / `--font-geist-mono`. They are **fallbacks only** — a pasted `--font-sans` or `--font-mono` from [shadcn/create](https://ui.shadcn.com/create) or [tweakcn](https://tweakcn.com/) always wins.

```js
starlightShadcn(); // Geist Sans + Geist Mono
starlightShadcn({ fonts: false }); // you ship the faces
```

If a generator names a non-Geist family (e.g. Open Sans), install it yourself (for example `@fontsource/open-sans`) and set `--font-sans` in your CSS.

### Page actions

When `pageActions` is enabled, the title row gains **Copy Markdown** and Open-in links. Copy works out of the box from the page body (with a small YAML header). Pass a URL template to enable **View as Markdown** and to fetch the exact source file instead:

```js
starlightShadcn({
  pageActions: {
    // `{base}` = site base path (no trailing slash), `{path}` = page path without base
    markdownUrl: '{base}/raw{path}.md',
  },
});
```

Serve that URL yourself (this docs site uses `src/pages/raw/[...slug].ts`). Without `markdownUrl`, Copy still works from the content collection body; View as Markdown is omitted.

### Layout chrome

Sticky sidebar/TOC offsets use `--sl-docs-row-1` / `--sl-docs-row-2` (banner + header). Collapsed sidebars set `--sl-sidebar-col` to `0px`. Consumers can raise `--sl-banner-height` if they add chrome above the nav.

## Schema extension

```ts
import { ExtendDocsSchema } from 'starlight-shadcn/schema';

docsSchema({ extend: ExtendDocsSchema });
```

Adds shadcn button `variant` values to hero actions: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, plus Starlight aliases `primary` and `minimal`.

## Translating the theme's own UI

Every string the theme adds beyond Starlight's own is prefixed `starlightShadcn.` and translated the same way as [Starlight's built-in UI strings](https://starlight.astro.build/guides/i18n/#translate-starlights-ui) — add the keys to `src/content/i18n/<lang>.json`. Only English ships, so any locale you don't translate falls back to it.

`starlightShadcn.headerNav`, `.collapseSidebar`, `.expandSidebar`, `.paletteSelect`, `.paletteDefault`, `.copyMarkdown`, `.copyMarkdownSuccess`, `.copyMarkdownFailed`, `.copyMarkdownFailedStatus`, `.open`, `.openInGitHub`, `.viewAsMarkdown`, `.openInChatGPT`, `.openInClaude`, `.openInCursor`.

## Verification checklist

- Header/Sidebar render with shadcn token styling.
- Theme toggle updates both light and dark tokens.
- `showcase/components` demos render and are interactive.

## CSS layers

The plugin injects four stylesheets:

1. `styles/layers` — layer ordering
2. `styles/theme` — shadcn → Starlight token bridge
3. `styles/base` — layout and prose tweaks
4. `styles/components` — per-component polish

Your site must include shadcn `global.css` via Starlight `customCss`. That file is the only theming API: the plugin's own values live in `@layer starlight-shadcn`, and your unlayered `:root` block overrides them, so any generator exporting standard shadcn CSS variables works without configuration. See [Theming](/starlight-shadcn/guides/theming/).

## Author

Maintained by [jagreehal](https://github.com/jagreehal).
