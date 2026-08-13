---
title: Banner
description: Site-wide announcement banner component override.
banner:
  content: |
    <strong>starlight-shadcn</strong> by <a href="https://github.com/jagreehal">jagreehal</a> — all 28 Starlight overrides are styled and ready to use.
---

This page demonstrates the `Banner` override. Configure banners in frontmatter:

```yaml
banner:
  content: |
    <strong>Announcement</strong> — <a href="/">learn more</a>
```

The banner uses shadcn `primary` / `primary-foreground` colors and renders at the top of the page content on every page that sets `banner` in frontmatter.
