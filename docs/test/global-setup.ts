/**
 * `astro preview` daemonises, so it cannot be a Playwright `webServer` command —
 * the process exits immediately and Playwright reports "exited early". Driving
 * the daemon here instead keeps the tests on the exact server `pnpm preview`
 * uses, rather than a hand-rolled static server that might differ on base paths
 * or trailing slashes.
 */
import { execFileSync } from 'node:child_process';

const READY_URL = 'http://localhost:4321/starlight-shadcn/';

function astro(...args: string[]) {
	execFileSync('pnpm', ['exec', 'astro', ...args], { stdio: 'ignore' });
}

export default async function globalSetup() {
	// Always restart: a daemon left over from a previous build serves stale HTML
	// and would silently test the wrong output.
	try {
		astro('preview', 'stop');
	} catch {
		/* nothing was running */
	}
	astro('preview');

	for (let attempt = 0; attempt < 60; attempt++) {
		try {
			const response = await fetch(READY_URL);
			if (response.ok) return;
		} catch {
			/* not up yet */
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	throw new Error(`Preview server never became ready at ${READY_URL}`);
}
