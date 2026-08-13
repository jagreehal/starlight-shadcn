# starlight-shadcn-docs

Demo site for the [`starlight-shadcn`](../packages/starlight-shadcn) theme. Every page here exercises a slice of the theme's 28 Starlight component overrides.

Run from the repo root:

```bash
pnpm dev        # dev server on http://localhost:4321
pnpm build      # production build
pnpm preview    # serve the production build
pnpm typecheck  # astro check
```

## Layout

- `src/content/docs/index.mdx` — splash landing page (`Hero`)
- `src/content/docs/guides/` — introduction and install instructions
- `src/content/docs/showcase/` — one page per override group: typography, banner, footer, splash, components
- `src/content/docs/reference/` — plugin API
- `src/styles/global.css` — shadcn design tokens the theme maps onto `--sl-*`
- `src/components/ui/` — shadcn components used as React islands in MDX

The theme is consumed as a workspace dependency (`starlight-shadcn: workspace:*`), so edits under `packages/starlight-shadcn` need a dev server restart to pick up.

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add button
```

Components land in `src/components/ui/` and can be used from `.mdx` with a [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives):

```mdx
import { Button } from '@/components/ui/button';

<Button client:load>Click me</Button>
```

## Draft pages

`showcase/draft.md` sets `draft: true`. Starlight renders it in dev with the `DraftContentNotice` override and drops it from production builds, so its sidebar entry in `astro.config.mjs` is guarded by `import.meta.env.DEV`.
