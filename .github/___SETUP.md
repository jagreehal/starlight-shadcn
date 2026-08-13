# GitHub Actions & npm publishing setup

Automated CI/CD for this repo: **OIDC** for npm (no `NPM_TOKEN` secret) and **OIDC** for **GitHub Pages** docs deploy. Modeled on the [awaitly](https://github.com/jagreehal/awaitly) `.github` layout, matching [effect-analyzer](https://github.com/jagreehal/effect-analyzer).

## Workflows

| Workflow | Purpose |
| -------- | ------- |
| `ci.yml` | Type-check, lint, build docs, theme regression gate, behaviour tests, tarball install gate — plus a `visual` job for screenshot baselines |
| `auto-merge.yml` | Auto-merge Dependabot patch/minor PRs |
| `release.yml` | Changesets: version PR + publish `starlight-shadcn` to npm via **OIDC** + provenance |
| `changeset.yml` | PRs to `main` must include a changeset when required |
| `docs.yml` | Build Starlight docs and deploy to **GitHub Pages** using **OIDC** (`id-token` + `pages: write`) |

`render-md-mermaid.yml` is deliberately absent. This theme renders Mermaid client-side from the shadcn tokens — committing pre-rendered SVG/PNG beside the showcase pages would fight the feature being demonstrated.

## First release is manual

npm trusted publishing binds a package name to this repo, so the package has to exist first.

```bash
pnpm prerelease                                    # must be 14/14
cd packages/starlight-shadcn && npm publish --access public
```

`0.1.0` is that first release and contains everything in the repo today, so there are deliberately **no changesets pending**. A changeset sitting here before the first publish would make the first `release.yml` run open a version PR bumping to `0.2.0` with a changelog describing work already inside `0.1.0`.

Add changesets from the next change onward; `changeset.yml` enforces it on PRs.

Then wire up OIDC below; every release after this one goes through `release.yml`.

## OIDC: npm (release)

1. In npm: [Trusted publishers](https://docs.npmjs.com/trusted-publishers) — connect this GitHub repo and allow publishing for package **`starlight-shadcn`**, workflow `release.yml`.
2. Workflow already sets:
   - `permissions: id-token: write`
   - `NPM_CONFIG_PROVENANCE: true`
   - `npx npm@11 install -g npm@11` (needed for OIDC trusted publishing)
3. No `NPM_TOKEN` secret in repo settings.
4. Create a `release` environment (Settings → Environments) — `release.yml` targets it.

## OIDC: GitHub Pages (docs)

1. Repo **Settings → Pages**: Source = **GitHub Actions** (not "Deploy from branch").
2. Workflow `docs.yml` uses:
   - `permissions: contents: read`, `pages: write`, `id-token: write`
   - `actions/configure-pages@v4`, `upload-pages-artifact@v3`, `deploy-pages@v4`
3. `docs/astro.config.mjs` hardcodes `site` + `base` for a project site. If the repo is ever renamed, `base` must follow it or every internal link 404s.

## CODEOWNERS

`@jaggitadmin` owns the release-critical paths. The rule is silently ignored until that account is a collaborator with write access **and** the `main` ruleset has "Require review from Code Owners" on.

## One-time checklist

- [ ] `starlight-shadcn@0.1.0` published manually
- [ ] npm trusted publisher configured for this repo + `starlight-shadcn`
- [ ] `release` environment exists
- [ ] GitHub Pages uses "GitHub Actions" as source
- [ ] `@jaggitadmin` added as a collaborator; Code Owner review required on `main`
- [ ] Default branch is `main`

## Local scripts (root `package.json`)

- `pnpm changeset` — add a changeset
- `pnpm version-packages` — bump versions / changelogs (or merge the bot's release PR)
- `pnpm release` — `prerelease` gate + `changeset publish` (used by Actions)
- `pnpm check` — static theme regression checks (`scripts/prerelease-check.mjs`)
- `pnpm test:install` — one-off, downloads Playwright's Chromium
- `pnpm test` — behaviour regressions (no baselines, runs anywhere)
- `pnpm test:visual` — screenshot comparison against the committed baselines
- `pnpm test:update` — rewrite the baselines after an **intentional** visual change; read the diff before committing

`pnpm prerelease` deliberately excludes the browser tests so publishing does not depend on a Chromium download — CI owns those.

## Screenshot baselines

Baselines live in `docs/test/screenshots.spec.ts-snapshots/{platform}/{project}/` and only **macOS** ones are committed, which is why the `visual` job runs on `macos-latest`. A Linux runner would find no snapshot for its platform and silently write one instead of comparing.

To add Linux: run `pnpm test:update` on Linux, commit the new `linux/` directory, then point the job at `ubuntu-latest`. The `{platform}` segment keeps both sets side by side.

## Troubleshooting

- **Publish fails with OIDC**: Confirm the npm trusted publisher matches org/repo/workflow and the name in `packages/starlight-shadcn/package.json`.
- **Pages not updating**: Confirm `docs.yml` path filters cover your changed files (`docs/**`, `packages/**`).
- **`changeset status` fails on a docs-only PR**: `starlight-shadcn-docs` is private and in `ignore`, so docs-only changes need no changeset. If it still complains, the PR touched `packages/`.
- **Tarball install gate fails but local build passes**: something the package needs is outside the `files` allowlist in `packages/starlight-shadcn/package.json`.
