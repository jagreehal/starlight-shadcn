// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import starlightShadcn from 'starlight-shadcn';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
	// GitHub Pages project site. `base` is prepended to every internal link and
	// asset URL, so it must match the repo name.
	site: 'https://jagreehal.github.io',
	base: '/starlight-shadcn',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		react(),
		starlight({
			title: 'starlight-shadcn',
			description: 'A shadcn + React Aria Starlight theme by jagreehal.',
			customCss: ['./src/styles/global.css'],
			editLink: {
				baseUrl: 'https://github.com/jagreehal/starlight-shadcn/edit/main/docs',
			},
			lastUpdated: true,
			credits: true,
			// Expressive Code plugins (twoslash) live in `ec.config.mjs` — inline EC
			// options must be JSON-serializable for the `<Code>` component to work.
			// Fails the build on broken internal links — the base path makes these
			// easy to get wrong and impossible to spot by eye.
			// `starlight-llms-txt` is deliberately absent: its `llms-full.txt` route
			// renders MDX without a component renderer, so any page importing a
			// React island fails the build. Its `exclude` option only applies to
			// `llms-small.txt`, so it can't be worked around here.
			plugins: [
				starlightShadcn({
					pageActions: {
						markdownUrl: '{base}/raw{path}.md',
					},
					// `base` is prepended for us, so these stay portable.
					navLinks: [
						{ label: 'Guides', href: '/guides/introduction/', activeMatch: '/guides/' },
						{ label: 'Showcase', href: '/showcase/overrides/', activeMatch: '/showcase/' },
						{ label: 'Reference', href: '/reference/plugin-api/', activeMatch: '/reference/' },
					],
					// Demoed here to show the theme swapping palettes at runtime; the
					// matching `:root[data-palette='…']` blocks live in global.css.
					palettes: [
						{ value: 'azure', label: 'Azure' },
						{ value: 'astro-default', label: 'Astro Default' },
						{ value: 'sunset', label: 'Sunset' },
						{ value: 'forest', label: 'Forest' },
					],
				}),
				starlightLinksValidator(),
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/jagreehal',
				},
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Introduction', slug: 'guides/introduction' },
						{ label: 'Getting Started', slug: 'guides/getting-started' },
						{ label: 'Theming', slug: 'guides/theming' },
					],
				},
				{
					label: 'Showcase',
					items: [
						{ label: 'All Overrides', slug: 'showcase/overrides' },
						{ label: 'Kitchen Sink', slug: 'showcase/kitchen-sink' },
						{ label: 'Typography', slug: 'showcase/typography' },
						{ label: 'Banner', slug: 'showcase/banner' },
						{ label: 'Footer & Pagination', slug: 'showcase/footer' },
						{ label: 'Splash Page', slug: 'showcase/splash' },
						{ label: 'shadcn Components', slug: 'showcase/components' },
						{ label: 'Diagrams', slug: 'showcase/diagrams' },
						// Draft pages are dropped from production builds, so linking the
						// slug unconditionally breaks `astro build`.
						...(import.meta.env.DEV
							? [{ label: 'Draft Page', slug: 'showcase/draft' }]
							: []),
					],
				},
				{
					label: 'Reference',
					items: [{ label: 'Plugin API', slug: 'reference/plugin-api' }],
				},
			],
		}),
	],
});
