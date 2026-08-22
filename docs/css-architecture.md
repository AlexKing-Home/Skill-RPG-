# CSS architecture

The interface styles are consolidated into domain stylesheets. The goal is to keep ownership clear and avoid the previous chain of numbered, `*-fixes.css`, and `*-final.css` override files.

## Domain stylesheets

- `src/styles/app-theme.css` — application theme and the reference styling used by the welcome/creation/game shell.
- `src/styles/foundation.css` — global base styles and welcome-screen foundation.
- `src/styles/compatibility.css` — the remaining legacy parity declarations consolidated into one ordered compatibility layer.
- `src/styles/navigation.css` — shared top/bottom navigation geometry, states, and approved navigation artwork.
- `src/styles/world.css` — movement, floor-map, swamp, and shared map/image rendering rules.
- `src/styles/character.css` — character navigation artwork, statistics, stamina, and skills.
- `src/styles/location-scenes.css` — dedicated start-city, meadow, forest, dungeon, ruins, and settlement scene/hotspot styling.

Two focused stylesheets remain outside `src/styles/` because they are loaded with their owning UI modules:

- `src/game-interface.css` — `CharacterScreen` game-shell layout.
- `src/battle.css` — `BattleView` combat interface.

## Cascade order

`src/main.jsx` loads the shared domains in this order:

1. `foundation.css`
2. `compatibility.css`
3. `navigation.css`
4. `world.css`
5. `character.css`

`src/App.jsx` loads `app-theme.css`. Dedicated location components load `location-scenes.css`. The order of source sections inside the consolidated files preserves the order of the previous stylesheets so the visual cascade remains compatible with the current interface.

## Rules for future changes

1. Do not add new root CSS files unless the stylesheet is genuinely owned by one isolated component or screen.
2. Do not create `*-fixes.css`, `*-final.css`, `*-vN.css`, or other incremental override files.
3. Change the domain stylesheet that owns the affected UI instead of adding a new layer.
4. Keep shared navigation rules in `styles/navigation.css` rather than copying selectors into screen-specific files.
5. Keep world/map rules in `styles/world.css` and dedicated location scene rules in `styles/location-scenes.css`.
6. Keep character statistics, stamina, skills, and character navigation in `styles/character.css`.
7. Treat `styles/compatibility.css` as transitional debt: when a compatibility declaration is replaced by a semantic domain rule, remove the obsolete declaration from the compatibility layer.
8. Preserve rule order when moving declarations whose precedence affects the rendered interface.
9. Run `npm run check` after CSS changes.

`scripts/check-css-architecture.mjs` enforces the approved stylesheet set, rejects legacy-style filenames, and detects exact duplicate CSS files.
