# Skill RPG

Skill RPG is a React + Vite prototype. The game interface and game logic live in React modules; `index.html` is only the Vite mount shell.

## Requirements

- Node.js 22.13 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run format:check
npm run lint
npm test
npm run build
```

Run the complete local verification pipeline with:

```bash
npm run check
```

## Project structure

- `src/App.jsx` — top-level application flow between welcome, character creation, and the game screen.
- `src/screens/` — full application screens.
- `src/components/` — reusable game and interface views.
- `src/data/` — game configuration, progression data, navigation data, skill data, and embedded artwork sources.
- `src/utils/` — persistence and other shared utilities.
- `src/*.css` — current global style layers. See `docs/css-architecture.md` before changing their order.
- `scripts/` — repository and asset preparation utilities.
- `tests/` — Node-based regression tests for game rules, navigation, locations, interface behavior, and progression.

## Artwork preparation

Some artwork is stored in source chunks and materialized into `public/ui` before development, tests, and production builds.

```bash
npm run assets:prepare
```

The preparation step is implemented by `scripts/materialize-art.mjs` and currently generates the first-floor map, swamp artwork, and ruins artwork.

## Repository hygiene

Tracked empty files are not allowed. `npm run lint` runs ESLint and then `scripts/check-empty-files.mjs` so accidental zero-byte files are caught in CI.

Global CSS is intentionally not reordered as part of routine cleanup because several files are legacy parity layers and cascade order can affect the visible interface. New styling work should follow the rules in `docs/css-architecture.md` instead of adding another numbered or `*-fixes.css` layer.
