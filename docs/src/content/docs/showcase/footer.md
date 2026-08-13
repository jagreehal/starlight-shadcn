---
title: Footer & Pagination
description: Footer, EditLink, LastUpdated, and Pagination overrides.
---

Scroll to the bottom of this page to see the themed footer components:

- **EditLink** — pencil icon link to edit this page on GitHub
- **LastUpdated** — formatted last updated timestamp
- **Pagination** — previous/next navigation styled as shadcn buttons

These are composed in the custom `Footer` override, which also shows a credits line when `credits: true` is set in Starlight config.

```js
starlight({
  editLink: { baseUrl: 'https://github.com/jagreehal/starlight-shadcn/edit/main/docs' },
  lastUpdated: true,
  credits: true,
});
```

Use the pagination links below to navigate between showcase pages.
