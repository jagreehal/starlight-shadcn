/**
 * Captures the home-page hero screenshots (`src/assets/hero-{dark,light}.png`)
 * from the built Kitchen Sink page. Run after a visual change:
 *
 *   pnpm hero:capture
 *
 * The script builds, captures, then builds again so `dist/` includes the new
 * images. It serves on its own port so a dev server on 4321 is never captured.
 */
import { fileURLToPath } from 'node:url';
import { preview } from 'astro';
import { chromium } from '@playwright/test';

const PORT = 4329;
const PAGE = `http://localhost:${PORT}/starlight-shadcn/showcase/kitchen-sink/`;
const assets = new URL('../src/assets/', import.meta.url);

const server = await preview({
	root: fileURLToPath(new URL('..', import.meta.url)),
	logLevel: 'error',
	server: { port: PORT },
});
const browser = await chromium.launch();

try {
	for (const theme of ['dark', 'light']) {
		const context = await browser.newContext({
			viewport: { width: 1200, height: 760 },
			deviceScaleFactor: 2,
			colorScheme: theme,
		});
		const page = await context.newPage();
		// Starlight reads the stored theme before first paint.
		await page.addInitScript((t) => localStorage.setItem('starlight-theme', t), theme);
		await page.goto(PAGE, { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		const path = fileURLToPath(new URL(`hero-${theme}.png`, assets));
		await page.screenshot({ path });
		console.log(`wrote ${path}`);
		await context.close();
	}
} finally {
	await browser.close();
	await server.stop();
}
