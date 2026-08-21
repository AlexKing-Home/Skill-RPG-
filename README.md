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
- `src/styles/` — consolidated domain styles for theme, foundation, compatibility, navigation, world, character, and dedicated location scenes.
- `src/game-interface.css` and `src/battle.css` — focused styles loaded with the game screen and battle view.
- `scripts/` — repository, CSS architecture, and asset preparation utilities.
- `tests/` — Node-based regression tests for game rules, navigation, locations, interface behavior, and progression.

See `docs/css-architecture.md` before moving or adding styles.

## Artwork preparation

Some artwork is stored in source chunks and materialized into `public/ui` before development, tests, and production builds.

```bash
npm run assets:prepare
```

The preparation step is implemented by `scripts/materialize-art.mjs` and currently generates the first-floor map, swamp artwork, and ruins artwork.

The start-city view uses `src/data/startCityApprovedWebp/` as its single active embedded artwork source. Obsolete duplicate start-city chunk sets are not kept in the repository.

## Repository hygiene

Tracked empty files are not allowed. `npm run lint` runs ESLint and repository hygiene checks so accidental zero-byte files are caught in CI.

CSS is consolidated into a fixed set of domain stylesheets. `scripts/check-css-architecture.mjs` rejects new ad-hoc legacy override files, unexpected CSS files, missing required domain files, and exact duplicate stylesheets. New styling should be made in the domain that owns the affected interface rather than by adding another numbered or `*-fixes.css` layer.
