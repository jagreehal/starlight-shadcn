import type { APIRoute, GetStaticPaths } from 'astro';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/** Resolved from the docs package cwd (`pnpm --filter docs build` / `astro build` in docs/). */
const docsRoot = path.join(process.cwd(), 'src/content/docs');

/** `draft: true` in the first frontmatter block. */
async function isDraft(file: string): Promise<boolean> {
	const source = await readFile(file, 'utf8');
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
	return frontmatter ? /^draft:\s*true\s*$/m.test(frontmatter[1] ?? '') : false;
}

async function walk(dir: string, prefix = ''): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const out: string[] = [];
	for (const entry of entries) {
		const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
		if (entry.isDirectory()) {
			out.push(...(await walk(path.join(dir, entry.name), rel)));
		} else if (/\.mdx?$/.test(entry.name)) {
			// Starlight keeps drafts out of the built site; serving their source
			// here would publish them anyway.
			if (await isDraft(path.join(dir, entry.name))) continue;
			out.push(rel.replace(/\.mdx?$/, ''));
		}
	}
	return out;
}

export const getStaticPaths = (async () => {
	const slugs = await walk(docsRoot);
	// Only the `.md` form is requested — `pageActions.markdownUrl` appends the
	// extension — so emitting the bare slug too would double the route count.
	return slugs.map((slug) => ({ params: { slug: `${slug}.md` } }));
}) satisfies GetStaticPaths;

async function readDocSource(slug: string): Promise<string | null> {
	const cleaned = slug.replace(/\.md$/, '');
	for (const ext of ['.mdx', '.md'] as const) {
		const file = path.resolve(docsRoot, `${cleaned}${ext}`);
		/*
		 * `getStaticPaths` bounds the slug under static output, but it is ignored
		 * on `output: 'server'` — there this handler receives whatever the client
		 * sends, and `../../` would walk straight out of the content directory.
		 * Copy this file into an SSR project and that becomes an arbitrary file
		 * read, so the containment check has to live here rather than upstream.
		 */
		if (file !== docsRoot && !file.startsWith(docsRoot + path.sep)) continue;
		try {
			return await readFile(file, 'utf8');
		} catch {
			/* try next */
		}
	}
	return null;
}

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug;
	if (!slug) return new Response('Not found', { status: 404 });

	const source = await readDocSource(slug);
	if (source == null) return new Response('Not found', { status: 404 });

	return new Response(source, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=0, must-revalidate',
		},
	});
};
