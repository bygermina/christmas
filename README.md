# Merry Christmas

Animated holiday landing page built with React, TypeScript, Vite, Sass, and Framer Motion.

The screen combines a glowing circuit-style Christmas tree, typed hero text, animated light paths, a code-themed background, and responsive layout tuning for desktop and mobile views.

## Features

- Responsive one-screen holiday hero.
- Typewriter animation for the main greeting.
- SVG path-based light effects around the tree.
- Animated code snippet under the hero text.
- Subtle cursor-following light effect.
- Adaptive footer with social links.
- Sass design tokens for colors, spacing, breakpoints, and typography.

## Tech Stack

- React 19
- TypeScript
- Vite
- Sass
- Framer Motion
- ESLint

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Project Structure

```text
src/
  shared/
    lib/              shared utilities, hooks, providers, SVG helpers
    styles/           global styles and design-system tokens
    ui/               reusable UI and animation primitives
  widgets/
    main/             main hero scene and animation orchestration
    footer/           footer with social links
```

## Notes

Breakpoint Sass files are generated before `dev`, `build`, and `lint` through:

```bash
npm run generate:breakpoints
```

The main visual logic lives in `src/widgets/main`, while reusable animation and typography pieces live in `src/shared/ui`.
