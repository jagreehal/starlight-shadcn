#!/usr/bin/env node
/**
 * Guards against the specific regressions this theme has actually shipped.
 * Every check below exists because the bug happened, not because it might.
 *
 *   node scripts/prerelease-check.mjs
 *
 * Checks marked "needs build" are skipped when `docs/dist` is absent, so this
 * is useful both before and after `pnpm build`.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PKG = 'packages/starlight-shadcn';
const OVERRIDES = `${PKG}/components/overrides`;
const DIST = 'docs/dist';

const failures = [];
const skipped = [];
let passed = 0;

function check(name, fn) {
	const problems = fn();
	if (problems === null) {
		skipped.push(name);
	} else if (problems.length > 0) {
		failures.push({ name, problems });
	} else {
		passed++;
	}
}

const read = (p) => readFileSync(p, 'utf8');
const styleFiles = readdirSync(`${PKG}/styles`).map((f) => join(PKG, 'styles', f));
const overrideFiles = readdirSync(OVERRIDES)
	.filter((f) => f.endsWith('.astro'))
	.map((f) => join(OVERRIDES, f));
const themeSources = [...styleFiles, ...overrideFiles];

/*
 * `color-mix(in oklch, …)` interpolates the hue arc. Mixing any colour toward
 * `oklch(1 0 0)` or `transparent` — both nominally hue 0 — drags it through
 * pink. Every aside tint in the theme was rose until this was caught.
 */
check('no color-mix in oklch (hue-arc drift)', () =>
	themeSources
		.filter((f) => read(f).includes('color-mix(in oklch'))
		.map((f) => `${f} — use \`in oklab\`, which has no hue channel`)
);

/*
 * Astro scoped styles are unlayered by default, which makes them outrank
 * everything including a consumer's own CSS. Layering keeps the theme
 * overridable from userland.
 */
check('override styles are layered', () =>
	overrideFiles
		.filter((f) => {
			const m = /<style>([\s\S]*?)<\/style>/.exec(read(f));
			return m && !m[1].includes('@layer starlight-shadcn');
		})
		.map((f) => `${f} — wrap its <style> body in \`@layer starlight-shadcn { … }\``)
);

/*
 * Rounding a box whose accent is a 4px `border-inline-start` bends that stripe
 * into a fingernail at both ends. Starlight's asides are square for a reason.
 */
check('no border-radius on asides (fingernail)', () =>
	themeSources
		.filter((f) => /\.starlight-aside\b[^{]*\{[^}]*border-radius/.test(read(f)))
		.map((f) => `${f} — asides must keep square corners`)
);

/*
 * `--chart-*` are categorical series colours. Plenty of shadcn palettes ship
 * them greyscale, which flattens every aside and badge to the same colour.
 */
check('semantic ramps not sourced from --chart-*', () => {
	const css = read(`${PKG}/styles/theme.css`);
	return [...css.matchAll(/--sl-color-(orange|green|blue|purple|red)[a-z-]*:[^;]*--chart-/g)].map(
		(m) => `theme.css — \`${m[0].split(':')[0]}\` derives from a chart token`
	);
});

/*
 * `.sl-steps` draws its own numbered bullets and sets `list-style: none`.
 * Reviving the native marker for prose lists double-numbers every step.
 */
check('prose list-style revert excludes .sl-steps', () => {
	const css = read(`${PKG}/styles/base.css`);
	const rule = /\.sl-markdown-content[^{]*:is\(ul, ol\)[^{]*\{[^}]*list-style:\s*revert/.exec(css);
	if (!rule) return ['base.css — expected a `list-style: revert` rule for prose lists'];
	return rule[0].includes('.sl-steps') ? [] : ['base.css — rule must exclude `.sl-steps`'];
});

/*
 * shadcn renamed `--sidebar-background` to `--sidebar` in the v4 migration.
 * shadcn.studio still exports the old name; without the fallback such a theme
 * tints sidebar text and borders but leaves the surface the page colour.
 */
check('sidebar bridge accepts the pre-v4 token name', () =>
	themeSources.some((f) => read(f).includes('--sidebar-background'))
		? []
		: ['sidebar background must fall back to `--sidebar-background`']
);

/*
 * Doc drift: every shadcn token the package consumes should appear in the
 * theming guide's contract, or users cannot know what to ship.
 */
check('theming guide documents every consumed token', () => {
	const doc = 'docs/src/content/docs/guides/theming.mdx';
	if (!existsSync(doc)) return ['theming guide is missing'];
	const guide = read(doc);
	const consumed = new Set();
	for (const f of themeSources) {
		for (const m of read(f).matchAll(/var\(--([a-z0-9-]+)/g)) {
			const t = m[1];
			if (t.startsWith('sl-') || t.startsWith('shadcn-') || t.startsWith('radius-')) continue;
			if (t === 'font-sans' || t === 'font-mono' || t === 'font-geist' || t === 'font-geist-mono')
				continue;
			if (t === 'menu-select-width') continue;
			// Starlight's own TOC internals, not tokens a consumer supplies.
			if (t === 'depth' || t === 'pad-inline') continue;
			if (t === 'shadow' || t.startsWith('shadow-')) continue;
			if (t.startsWith('tracking-') || t === 'scroll-fade-t' || t === 'scroll-fade-b') continue;
			consumed.add(t);
		}
	}
	return [...consumed].filter((t) => !guide.includes(t)).map((t) => `\`--${t}\` is undocumented`);
});

/*
 * Upstream indents nested TOC headings with
 * `padding-inline: calc(1rem * var(--depth) + var(--pad-inline)) …`. A `padding`
 * shorthand on the same links resets that longhand, flattening every h3 onto
 * the h2 rail — which left the clerk track stepping against text that never
 * moved, and read as a broken line.
 */
check('TOC link padding does not reset the depth indent', () => {
	const css = read(`${PKG}/styles/components.css`);
	const rule = /starlight-toc a[^{]*\{([^}]*)\}/.exec(css);
	if (!rule) return ['components.css — expected a `starlight-toc a` rule'];
	return /(^|[\s;])padding\s*:/.test(rule[1])
		? ['components.css — use `padding-block`; the `padding` shorthand kills `--depth`']
		: [];
});

const componentFiles = readdirSync(`${PKG}/components`)
	.filter((f) => f.endsWith('.astro'))
	.map((f) => join(PKG, 'components', f))
	.concat(overrideFiles);

/*
 * A hardcoded `aria-label` is invisible in English and untranslatable
 * everywhere else. `Collapse sidebar` shipped that way.
 */
check('no hardcoded aria-label / title literals', () =>
	componentFiles.flatMap((f) =>
		[...read(f).matchAll(/\b(aria-label|title)="([^"{}]+)"/g)].map(
			([, attr, value]) => `${f} — \`${attr}="${value}"\` must come from \`Astro.locals.t()\``
		)
	)
);

/*
 * `t()` returns the key verbatim when it isn't defined, so a typo'd or invented
 * key ships as a visible `header.nav` in an aria-label rather than failing.
 */
check('every t() key exists', () => {
	const en = 'docs/node_modules/@astrojs/starlight/translations/en.json';
	if (!existsSync(en)) return null;
	const known = new Set([
		...Object.keys(JSON.parse(read(en))),
		...[...read(`${PKG}/core/translations.ts`).matchAll(/'(starlightShadcn\.[\w.]+)':/g)].map(
			(m) => m[1]
		),
	]);
	const used = new Set();
	for (const f of componentFiles) {
		for (const m of read(f).matchAll(/\bt\(\s*'([\w.]+)'\s*\)/g)) used.add(m[1]);
	}
	// Anything without a dot is a CSS selector or tag name caught by the same
	// pattern (`querySelector('nav')`), not a translation key.
	return [...used]
		.filter((k) => k.includes('.') && !known.has(k))
		.map((k) => `\`${k}\` is not a Starlight or starlight-shadcn translation key`);
});

/*
 * `files` is an allowlist, so an export can point at a path the tarball never
 * carries — the consumer only finds out at `astro build`. A stray
 * `.astro/preview.log` shipped before this was an allowlist at all.
 */
check('every exports target ships in the tarball', () => {
	const pkg = JSON.parse(read(`${PKG}/package.json`));
	// npm always includes these regardless of `files`.
	const always = new Set(['package.json', 'README.md', 'LICENSE']);
	const allowed = new Set([...(pkg.files ?? []), ...always]);
	if (!pkg.files) return ['package.json — add a `files` allowlist'];

	return Object.entries(pkg.exports).flatMap(([key, target]) => {
		const rel = target.replace(/^\.\//, '');
		const root = rel.split('/')[0];
		if (!allowed.has(root)) return [`exports["${key}"] → \`${root}\` is not in \`files\``];
		// Glob targets resolve at consume time; only the containing directory
		// can be verified here.
		const onDisk = rel.includes('*') ? rel.slice(0, rel.indexOf('*')) : rel;
		return existsSync(join(PKG, onDisk)) ? [] : [`exports["${key}"] → \`${onDisk}\` is missing`];
	});
});

/*
 * Upstream `Header` and `MobileMenuFooter` both wrap `SocialIcons` themselves.
 * A wrapper in the component too renders `.social-icons > .social-icons`.
 */
check('no duplicated .social-icons wrapper (needs build)', () => {
	const page = `${DIST}/showcase/kitchen-sink/index.html`;
	if (!existsSync(page)) return null;
	const html = read(page);
	const nested = html.match(/social-icons[^>]*>\s*<div class="[^"]*social-icons/g) ?? [];
	return nested.map(() => 'kitchen-sink renders nested `.social-icons`');
});

/*
 * Each `starlight-menu-button` tracks its own `aria-expanded`, and they all
 * stack at the same fixed position. `Header` rendering a second one on top of
 * `PageFrame`'s meant opening the menu with one and tapping the other left it
 * stuck open, with two "Menu" buttons in the accessibility tree.
 */
check('exactly one mobile menu toggle (needs build)', () => {
	const page = `${DIST}/showcase/kitchen-sink/index.html`;
	if (!existsSync(page)) return null;
	const count = (read(page).match(/<starlight-menu-button/g) ?? []).length;
	return count === 1 ? [] : [`kitchen-sink renders ${count} \`<starlight-menu-button>\`, expected 1`];
});

/*
 * Bare HSL triples (the Tailwind v3 convention) make every token resolve to a
 * non-colour, giving a transparent page with black text.
 */
check('docs tokens are complete colours (needs build)', () => {
	const css = 'docs/src/styles/global.css';
	if (!existsSync(css)) return null;
	return [...read(css).matchAll(/--(background|foreground|primary|border):\s*([^;]+);/g)]
		.filter(([, , v]) => /^[\d.]+\s+[\d.]+%\s+[\d.]+%$/.test(v.trim()))
		.map(([, name]) => `--${name} is a bare channel triple; wrap it in \`hsl(…)\``);
});

const total = passed + failures.length;
console.log(`\n  ${passed}/${total} checks passed` + (skipped.length ? `, ${skipped.length} skipped (run \`pnpm build\` first)` : ''));
for (const name of skipped) console.log(`  · skipped  ${name}`);
for (const { name, problems } of failures) {
	console.log(`\n  ✗ ${name}`);
	for (const p of problems) console.log(`      ${p}`);
}
if (failures.length > 0) {
	console.log('');
	process.exit(1);
}
console.log('');
