---
'starlight-shadcn': minor
---

Match the shadcn docs look.

- Type: shadcn heading scale (h1 1.875rem, h2 1.25rem), `font-medium` headings, 15px prose and a 42rem content column.
- Sidebar: the current page uses `--sidebar-accent`; group labels are small and muted.
- Asides and badges follow shadcn `Alert` and outline `Badge`.
- Hero: optional `hero.announcement` pill via `ExtendDocsSchema`, centred layout without an image, text before the image, responsive `srcset`, and action icons from built-in names or raw SVG.
- Page title: on mobile, description and compact page actions sit below the title.
- Table of contents rows meet the 24px target size.
- Geist Sans ships weights 400 to 600.
- New `viewTransitions` option (default `false`): page navigation animates with the browser's cross-document view transitions while the header and desktop sidebar hold still. Reduced motion turns it off.
