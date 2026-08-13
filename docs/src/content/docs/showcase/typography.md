---
title: Typography
description: MarkdownContent, PageTitle, and TableOfContents styling.
---

This page exercises `MarkdownContent`, `PageTitle`, `TableOfContents`, and `PageSidebar`.

## Headings

### Heading three

#### Heading four

##### Heading five

###### Heading six

## Text styles

Regular paragraph with **bold**, _italic_, and `inline code`. A [link to getting started](/starlight-shadcn/guides/getting-started/) uses shadcn primary color.

> Blockquotes use muted foreground and a left border from the theme tokens.

## Twoslash

Add `twoslash` to a TypeScript fence and hover any identifier for its inferred type:

```ts twoslash
const overrides = ['Header', 'Hero'] as const;
type Override = (typeof overrides)[number];
//   ^?
```

## Lists

- First item
- Second item with nested list:
  - Nested alpha
  - Nested beta
- Third item

1. Ordered one
2. Ordered two
3. Ordered three

## Code block

```ts
import starlightShadcn from 'starlight-shadcn';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightShadcn()],
    }),
  ],
});
```

## Table

| Token | Maps to |
| --- | --- |
| `--sl-color-bg` | `--background` |
| `--sl-color-text` | `--foreground` |
| `--sl-color-text-accent` | `--primary` |

## Details

<details>
<summary>Click to expand</summary>

Hidden content styled by Starlight markdown styles plus shadcn tokens.

</details>

Scroll the right sidebar (desktop) or open the mobile TOC to see `TableOfContents` and `MobileTableOfContents` in action.
