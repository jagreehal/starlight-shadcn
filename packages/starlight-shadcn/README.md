# starlight-shadcn

A complete [Starlight](https://starlight.astro.build) theme by **[jagreehal](https://github.com/jagreehal)** — [shadcn/ui](https://ui.shadcn.com) design tokens + [React Aria](https://react-spectrum.adobe.com/react-aria/) on **Astro 7**.

Overrides **all 28** overridable Starlight components.

## Install

```bash
pnpm add starlight-shadcn
```

```js
// astro.config.mjs
import starlight from '@astrojs/starlight';
import starlightShadcn from 'starlight-shadcn';

export default defineConfig({
  integrations: [
    starlight({
      customCss: ['./src/styles/global.css'],
      plugins: [starlightShadcn()],
    }),
  ],
});
```

## Bring your own palette

The theme defines **no** colour tokens. It maps whatever you define onto Starlight's `--sl-*` variables, so the palette is entirely yours — paste any theme from [ui.shadcn.com/create](https://ui.shadcn.com/create) into your `global.css` exactly as generated:

```css
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  /* ...light tokens */
}

.dark {
  --background: oklch(0.145 0 0);
  /* ...dark tokens */
}
```

Starlight tracks the theme with `data-theme` on `<html>` while shadcn uses a `.dark` class. The `ThemeProvider` override sets that class in a render-blocking inline script, so the right palette is applied on the first frame with no flash.

## Prose rhythm doesn't break your layouts

Starlight spaces prose with a *descendant* selector:

```css
.sl-markdown-content :not(a, strong, …) + :not(a, strong, …) { margin-top: 1rem; }
```

Because it matches at any depth, every child after the first inside a container
you wrote picks up a top margin — which silently breaks flex and grid rows and
leads to hand-written `.my-row > * { margin-top: 0 }` patches.

This theme clears it for flex and grid containers, which space themselves with
`gap`, so rows stay aligned with no extra classes:

```mdx
<div class="flex flex-wrap gap-2">
  <Button client:load>Default</Button>
  <Button client:load variant="outline">Outline</Button>
</div>
```

Normal prose spacing is untouched — a plain `<div>` still gets the rhythm. For a
container styled without Tailwind's display utilities, Starlight's own
`class="not-content"` escape hatch still works.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `overrides` | `ComponentName[]` | all 28 | Subset of Starlight components to override. |
| `warnOverrides` | `boolean` | `true` | Warn when an override is already set in your config. |
| `collapsibleSidebar` | `boolean` | `true` | Desktop (≥50rem) collapsible sidebar with hover peek. |
| `clerkToc` | `boolean` | `true` | Clerk-style SVG track on the desktop table of contents. |
| `pageActions` | `boolean \| { markdownUrl?: string }` | `true` | Copy Markdown + Open in ChatGPT/Claude/Cursor beside the page title. Copy works from the page body; `{ markdownUrl }` adds View as Markdown. |
| `fonts` | `boolean` | `true` | Inject Geist Sans + Geist Mono as `--font-geist` / `--font-geist-mono` fallbacks. Pasted `--font-sans` always wins. |
| `palettes` | `{ value, label }[]` | `[]` | Extra palettes offered beside the light/dark toggle. |
| `navLinks` | `{ label, href, activeMatch?, translations? }[]` | `[]` | Top-level links beside the site title. |

```js
starlightShadcn({
  overrides: ['Header', 'ThemeSelect', 'Hero'], // only these
});
```

See the [Plugin API reference](https://jagreehal.github.io/starlight-shadcn/reference/plugin-api/) for the rest.

## Translations

Strings the theme adds beyond Starlight's own are prefixed `starlightShadcn.` and translate like any [Starlight UI string](https://starlight.astro.build/guides/i18n/#translate-starlights-ui). Only English ships; untranslated locales fall back to it.

## Hero button variants

Extend the docs schema to use shadcn button variants in splash-page hero actions:

```ts
// src/content.config.ts
import { docsSchema } from '@astrojs/starlight/schema';
import { ExtendDocsSchema } from 'starlight-shadcn/schema';

export const collections = {
  docs: defineCollection({ schema: docsSchema({ extend: ExtendDocsSchema }) }),
};
```

```yaml
hero:
  actions:
    - text: Get Started
      link: /guides/getting-started/
      variant: default # default | secondary | outline | ghost | destructive | link
```

## Requirements

- Astro `^7`
- `@astrojs/starlight` `>=0.41.4`

## License

MIT © [jagreehal](https://github.com/jagreehal)
