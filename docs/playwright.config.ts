import { defineConfig, devices } from '@playwright/test';

const BASE = '/starlight-shadcn';

export default defineConfig({
	testDir: './test',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],

	// Font antialiasing shifts by a pixel or two between macOS versions. Enough
	// tolerance to absorb that, far too little to hide a layout or colour change.
	expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },

	// `{platform}` keeps macOS and Linux baselines side by side, so adding a Linux
	// runner later does not invalidate the committed set.
	snapshotPathTemplate:
		'{snapshotDir}/{testFileName}-snapshots/{platform}/{projectName}/{arg}{ext}',

	use: {
		// Trailing slash is load-bearing: without it, resolving a relative path
		// against this URL drops the `/starlight-shadcn` segment.
		baseURL: `http://localhost:4321${BASE}/`,
		trace: 'on-first-retry',
	},

	/*
	 * The theme resolves `auto` (its default, with no `starlight-theme` in
	 * localStorage) from `prefers-color-scheme`, so `colorScheme` alone selects
	 * light or dark without touching storage.
	 */
	projects: [
		{ name: 'desktop-light', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
		{ name: 'desktop-dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
		{ name: 'mobile-light', use: { ...devices['Pixel 5'], colorScheme: 'light' } },
		{ name: 'mobile-dark', use: { ...devices['Pixel 5'], colorScheme: 'dark' } },
	],

	// Not `webServer`: `astro preview` daemonises, so Playwright sees the command
	// exit immediately and aborts the run. See `test/global-setup.ts`.
	globalSetup: './test/global-setup.ts',
	globalTeardown: './test/global-teardown.ts',
});
