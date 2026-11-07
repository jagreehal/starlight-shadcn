/**
 * Foreground preview server for Playwright.
 *
 * The `astro preview` CLI daemonises, so Playwright cannot own its lifetime.
 * Astro's programmatic `preview()` returns a server that stays in this process,
 * so Playwright owns its lifetime and kills it on teardown. It is the same
 * server the CLI wraps, so base paths and trailing slashes behave exactly as
 * they do in `pnpm preview`.
 */
import { preview } from 'astro';

const server = await preview({ root: import.meta.dirname + '/..', logLevel: 'error' });

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		server.stop().finally(() => process.exit(0));
	});
}
