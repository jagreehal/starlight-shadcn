import { z } from 'astro/zod';
import { ALL_COMPONENT_OVERRIDES, type ShadcnComponentOverride } from './overrides';

// zod v3's `z.enum` wants a mutable tuple, but casting to `[string, ...string[]]`
// would widen the parsed type to `string` and silently accept typo'd component
// names. Cast to the literal union instead so `overrides` stays type-safe.
const overrideEnum = z.enum(
	ALL_COMPONENT_OVERRIDES as unknown as [ShadcnComponentOverride, ...ShadcnComponentOverride[]],
);

const PageActionsObjectSchema = z.object({
	markdownUrl: z
		.string()
		.optional()
		.describe(
			'URL template for raw markdown. Supports `{base}` (site base path) and `{path}` (page pathname without trailing slash). Enables View as Markdown and fetches the exact file for Copy Markdown.',
		),
});

export const StarlightShadcnConfigSchema = z.object({
	warnOverrides: z
		.boolean()
		.default(true)
		.describe('Warn when a Starlight component override is already defined.'),
	overrides: z
		.array(overrideEnum)
		.optional()
		.describe('Subset of Starlight components to override. Defaults to all 28.'),
	collapsibleSidebar: z
		.boolean()
		.default(true)
		.describe('Desktop (≥50rem) collapsible sidebar with hover peek.'),
	clerkToc: z
		.boolean()
		.default(true)
		.describe('Clerk-style SVG track on the desktop table of contents.'),
	navLinks: z
		.array(
			z.object({
				label: z.string(),
				href: z
					.string()
					.describe(
						'Root-relative (`/guides/`) or absolute (`https://…`). Root-relative hrefs get the site `base` prepended automatically.',
					),
				activeMatch: z
					.string()
					.optional()
					.describe(
						'Path prefix that marks this link active, for when `href` points at a page inside the section it represents (e.g. `/guides/` for `/guides/introduction/`). Defaults to `href`.',
					),
				translations: z
					.record(z.string(), z.string())
					.optional()
					.describe('Per-locale label overrides, keyed by locale as in Starlight’s sidebar.'),
			}),
		)
		.default([])
		.describe('Top-level links beside the site title. Shown in the mobile menu below 50rem.'),
	palettes: z
		.array(z.object({ value: z.string(), label: z.string() }))
		.default([])
		.describe(
			'Extra palettes offered beside the light/dark toggle. Each `value` is written to `data-palette` on `<html>`; define the matching `:root[data-palette="…"]` block yourself. Empty (the default) renders no picker.',
		),
	pageActions: z
		.union([z.boolean(), PageActionsObjectSchema])
		.default(true)
		.transform((value) => {
			if (value === false) return { enabled: false as const, markdownUrl: undefined };
			if (value === true) return { enabled: true as const, markdownUrl: undefined };
			return { enabled: true as const, markdownUrl: value.markdownUrl };
		})
		.describe(
			'Copy Markdown + Open in ChatGPT/Claude/Cursor beside the page title. Copy works from the page body with no extra config; pass `{ markdownUrl }` for View as Markdown and to fetch the exact source file.',
		),
	fonts: z
		.boolean()
		.default(true)
		.describe(
			'Inject Geist Sans + Geist Mono as `--font-geist` / `--font-geist-mono` fallbacks via Fontsource CSS. A pasted `--font-sans` from shadcn/create or tweakcn always wins. Set `false` if you ship faces yourself.',
		),
});

export type StarlightShadcnUserConfig = z.input<typeof StarlightShadcnConfigSchema>;
export type StarlightShadcnConfig = z.output<typeof StarlightShadcnConfigSchema>;
