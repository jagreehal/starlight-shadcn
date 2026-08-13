# starlight-shadcn

A complete [Starlight](https://starlight.astro.build) theme by **[jagreehal](https://github.com/jagreehal)** — shadcn/ui **aria-vega** tokens + [React Aria](https://react-spectrum.adobe.com/react-aria/) on **Astro 7**.

Overrides **all 28** overridable Starlight components.

## Quick start

```bash
pnpm dlx shadcn@latest init --preset bIkfnvM --base aria --template astro -n my-docs
pnpm add @astrojs/starlight starlight-shadcn @astrojs/react
```

```js
import starlightShadcn from 'starlight-shadcn';

starlight({
  customCss: ['./src/styles/global.css'],
  plugins: [starlightShadcn()],
});
```

## Monorepo

```
starlight-shadcn/
├── packages/starlight-shadcn/   # Theme plugin (28 overrides)
└── docs/                        # Demo site
```

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

## Component overrides

Head · ThemeProvider · SkipLink · PageFrame · MobileMenuToggle · TwoColumnContent · Header · SiteTitle · Search · SocialIcons · ThemeSelect · LanguageSelect · Sidebar · MobileMenuFooter · PageSidebar · TableOfContents · MobileTableOfContents · Banner · ContentPanel · PageTitle · FallbackContentNotice · DraftContentNotice · Hero · MarkdownContent · Footer · LastUpdated · Pagination · EditLink

See [showcase/overrides](docs/src/content/docs/showcase/overrides.mdx) in the demo site.

## License

MIT © [jagreehal](https://github.com/jagreehal)
