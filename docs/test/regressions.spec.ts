/**
 * One test per regression this theme has actually shipped. These assert
 * behaviour rather than pixels, so they run on any platform and never need a
 * baseline refreshed — the screenshot suite covers appearance separately.
 */
import { expect, test, type Page } from '@playwright/test';

const isMobile = (projectName: string) => projectName.startsWith('mobile');

/**
 * Paths are relative to `baseURL` so the site `base` is preserved. A leading
 * slash silently drops it, and the 404 page then satisfies most assertions —
 * the overflow checks below all "passed" against 404s before this existed, so
 * every navigation asserts it actually landed.
 */
async function visit(page: Page, path: string) {
	const response = await page.goto(path);
	expect(response?.status(), `navigation to ${path} failed`).toBeLessThan(400);
}

test.describe('header', () => {
	/*
	 * `Header` rendered a second `MobileMenuToggle` on top of `PageFrame`'s. Both
	 * stack at the same fixed position and track their own `aria-expanded`, so
	 * opening with one and tapping the other left the menu stuck open — and
	 * announced two "Menu" buttons.
	 */
	test('renders exactly one mobile menu toggle', async ({ page }) => {
		await visit(page, 'showcase/kitchen-sink/');
		await expect(page.locator('starlight-menu-button')).toHaveCount(1);
	});

	/*
	 * The site title was hidden below 768px, leaving mobile with no branding and
	 * no tap-to-home. Upstream always shows it.
	 */
	test('site title is visible at every width', async ({ page }) => {
		await visit(page, 'showcase/kitchen-sink/');
		await expect(page.locator('a.site-title')).toBeVisible();
	});

	test('nav links mark the active section', async ({ page }, testInfo) => {
		test.skip(isMobile(testInfo.project.name), 'nav links move into the mobile menu below 50rem');
		await visit(page, 'showcase/kitchen-sink/');
		const current = page.locator('.header-nav-links a[aria-current]');
		await expect(current).toHaveCount(1);
		await expect(current).toHaveText('Showcase');
	});
});

test.describe('sidebar', () => {
	/*
	 * The scroll fade was declared on in the base state and removed by a
	 * scroll-driven animation. A scroll timeline is inactive on a non-scrollable
	 * element, so a short sidebar kept its first and last entries permanently
	 * washed out — as does any browser without `animation-timeline`.
	 */
	test('does not fade its edges when it cannot scroll', async ({ page }, testInfo) => {
		test.skip(isMobile(testInfo.project.name), 'sidebar is the mobile menu below 50rem');
		await visit(page, 'guides/introduction/');
		const state = await page.locator('.sidebar-content').evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				scrollable: el.scrollHeight > el.clientHeight,
				top: s.getPropertyValue('--scroll-fade-t').trim(),
				bottom: s.getPropertyValue('--scroll-fade-b').trim(),
			};
		});
		if (!state.scrollable) {
			expect(state.top).toBe('0px');
			expect(state.bottom).toBe('0px');
		}
	});
});

test.describe('table of contents', () => {
	/*
	 * A `padding` shorthand on the TOC links reset upstream's
	 * `padding-inline: calc(1rem * var(--depth) …)`, flattening every nested
	 * heading onto the top-level rail. The clerk track then stepped against text
	 * that never moved and read as a broken line.
	 */
	test('indents nested headings', async ({ page }, testInfo) => {
		test.skip(isMobile(testInfo.project.name), 'desktop table of contents only');
		await visit(page, 'showcase/components/');
		const indents = await page
			.locator('starlight-toc nav a[href^="#"]')
			.evaluateAll((links) =>
				links.map((a) => ({
					depth: (() => {
						let d = 1;
						let n: Element | null = a.parentElement;
						while (n && !n.matches('starlight-toc')) {
							if (n.matches('ul')) d += 1;
							n = n.parentElement;
						}
						return d + 1;
					})(),
					pad: parseFloat(getComputedStyle(a).paddingInlineStart),
				}))
			);

		const top = indents.filter((i) => i.depth === 3).map((i) => i.pad);
		const nested = indents.filter((i) => i.depth === 4).map((i) => i.pad);
		expect(top.length, 'page should have top-level headings').toBeGreaterThan(0);
		expect(nested.length, 'page should have nested headings').toBeGreaterThan(0);
		expect(Math.min(...nested)).toBeGreaterThan(Math.max(...top));
	});

	/*
	 * Starlight activates a heading only as it crosses a 53px band near the top of
	 * the viewport. A last section shorter than the remaining scroll never reaches
	 * it, so the reader sat at the bottom of the page with the previous heading
	 * still highlighted.
	 */
	test('highlights the last heading at the bottom of the page', async ({ page }, testInfo) => {
		test.skip(isMobile(testInfo.project.name), 'desktop table of contents only');
		await visit(page, 'showcase/diagrams/');
		await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

		const links = page.locator('starlight-toc nav a[href^="#"]');
		const last = links.last();
		// Exactly one — writing `aria-current` directly instead of driving the
		// element's own setter used to leave two links marked.
		await expect(page.locator('starlight-toc nav a[aria-current="true"]')).toHaveCount(1);
		await expect(last).toHaveAttribute('aria-current', 'true');
	});
});

/*
 * Every page, both widths: a stray fixed-width child silently produces a
 * horizontally scrolling document that is easy to miss while authoring.
 */
const PAGES = [
	'guides/introduction/',
	'guides/getting-started/',
	'guides/theming/',
	'showcase/overrides/',
	'showcase/kitchen-sink/',
	'showcase/typography/',
	'showcase/banner/',
	'showcase/footer/',
	'showcase/splash/',
	'showcase/components/',
	'showcase/diagrams/',
	'reference/plugin-api/',
];

for (const path of PAGES) {
	test(`no horizontal overflow: ${path}`, async ({ page }) => {
		await visit(page, path);
		const overflows = await page.evaluate(
			() => document.body.scrollWidth > window.innerWidth + 1
		);
		expect(overflows).toBe(false);
	});
}
