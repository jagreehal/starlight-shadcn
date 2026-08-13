import { execFileSync } from 'node:child_process';

export default async function globalTeardown() {
	try {
		execFileSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });
	} catch {
		// Already gone, or never started because setup failed.
	}
}
