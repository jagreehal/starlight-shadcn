# starlight-shadcn

## 0.2.0

### Minor Changes

- 420b6bd: Match the shadcn docs look.
  
  - Type: shadcn heading scale (h1 1.875rem, h2 1.25rem), `font-medium` headings, 15px prose and a 42rem content column.
  - Sidebar: the current page uses `--sidebar-accent`; group labels are small and muted.
  - Asides and badges follow shadcn `Alert` and outline `Badge`.
  - Hero: optional `hero.announcement` pill via `ExtendDocsSchema`, centred layout without an image, text before the image, responsive `srcset`, and action icons from built-in names or raw SVG.
  - Page title: on mobile, description and compact page actions sit below the title.
  - Table of contents rows meet the 24px target size.
  - Geist Sans ships weights 400 to 600.
  - New `viewTransitions` option (default `false`): page navigation animates with the browser's cross-document view transitions while the header and desktop sidebar hold still. Reduced motion turns it off.

### Patch Changes

- d77739e: Point `homepage`, `repository` and `bugs` at `jagreehal/starlight-shadcn`. `0.1.0` shipped with the pre-rename `starlight-shadcn-theme` URLs, so the links on npm resolved to a repository that no longer exists.
