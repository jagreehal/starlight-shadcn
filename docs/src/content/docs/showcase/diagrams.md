---
title: Diagrams
description: Mermaid diagrams themed from your shadcn design tokens.
---

Fence a code block with `mermaid` and the theme renders it as a diagram, using your shadcn tokens for every colour. Toggle light/dark and the diagram re-renders to match.

## Flowchart

```mermaid
graph LR
  A[Request] --> B{Cached?}
  B -->|yes| C[Return cached]
  B -->|no| D[Fetch origin]
  D --> E[Write cache]
  E --> C
```

## Sequence

```mermaid
sequenceDiagram
  participant U as User
  participant S as Starlight
  participant T as starlight-shadcn
  U->>S: Request page
  S->>T: Resolve component overrides
  T-->>S: 28 shadcn components
  S-->>U: Themed HTML
```

## How it works

A remark plugin rewrites the fence into a `<mermaid-diagram>` element before Expressive Code claims it, so the block never becomes a code frame. A custom element then renders it with `mermaid.initialize({ theme: 'base', themeVariables })`, reading `--primary`, `--muted`, `--border` and `--foreground` off the document.

`mermaid` is an **optional** peer dependency. Without it installed, the diagram source stays visible as a plain code block rather than breaking the page. Opt out entirely with:

```js
starlightShadcn({ mermaid: false });
```
