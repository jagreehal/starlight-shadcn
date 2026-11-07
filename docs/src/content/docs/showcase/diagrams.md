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

Expressive Code renders the fence as a code block. On the page, the theme reads each `mermaid` block, renders it with `mermaid.initialize({ theme: 'base', themeVariables })` using `--primary`, `--muted`, `--border` and `--foreground`, and swaps the diagram in. Toggling light or dark renders it again.

`mermaid` is an **optional** peer dependency. Leave it uninstalled and the source stays visible as a plain code block.
