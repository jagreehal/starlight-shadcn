/**
 * Visual baselines. Deliberately viewport-sized rather than `fullPage`: a
 * full-page capture paints position-fixed chrome once at the top and leaves the
 * rest of the page on the default canvas, which makes the baselines misleading
 * to review.
 *
 * Refresh with `pnpm test:update` after an intentional visual change, and read
 * the diff before committing.
 */
import { expect, test, type Page } from '@playwright/test';

/** Rendered from git history, so it changes whenever the page is edited. */
const volatile = (page: Page) => [page.locator('time')];

async function settle(page: Page) {
	// Webfonts land after first paint and reflow the text they cover.
	await page.evaluate(() => document.fonts.ready);
	await page.waitForLoadState('networkidle');
}

const PAGES = [
	{ name: 'introduction', path: 'guides/introduction/' },
	{ name: 'kitchen-sink', path: 'showcase/kitchen-sink/' },
	{ name: 'components', path: 'showcase/components/' },
	{ name: 'plugin-api', path: 'reference/plugin-api/' },
];

for (const { name, path } of PAGES) {
	test(`screenshot ${name}`, async ({ page }) => {
		await page.goto(path);
		await settle(page);
		await expect(page).toHaveScreenshot(`${name}.png`, { mask: volatile(page) });
	});
}

/*
 * The bottom of a page is where the table of contents, pagination and footer all
 * meet — and where the scrollspy dead zone showed up.
 */
test('screenshot page bottom', async ({ page }) => {
	await page.goto('showcase/diagrams/');
	await settle(page);
	await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
	// The clerk track animates its thumb into place.
	await page.waitForTimeout(400);
	await expect(page).toHaveScreenshot('page-bottom.png', { mask: volatile(page) });
});

test('screenshot mobile menu', async ({ page }, testInfo) => {
	test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile viewports only');
	await page.goto('showcase/kitchen-sink/');
	await settle(page);
	await page.locator('starlight-menu-button button').click();
	await page.waitForTimeout(300);
	await expect(page).toHaveScreenshot('mobile-menu.png', { mask: volatile(page) });
});
