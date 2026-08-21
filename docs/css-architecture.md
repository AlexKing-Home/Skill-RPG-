# CSS architecture

The current interface contains several global CSS layers created while matching earlier reference layouts. Their cascade order is therefore part of the visible behavior of the game.

## Rules for new changes

1. Do not add new files named like `*-fixes.css`, `*-final.css`, or `*-vN.css`.
2. Change the semantic stylesheet that owns the affected interface area instead of adding another override layer.
3. Keep location-specific rules in the corresponding location stylesheet.
4. Keep shared navigation rules in the shared navigation layer rather than duplicating selectors between screens.
5. Keep character statistics, stamina, and skills in their existing semantic stylesheets.
6. Do not reorder the global CSS imports without regression and visual verification.
7. When a legacy reference/parity rule is replaced by a semantic rule, remove the obsolete declaration instead of leaving both versions active.

## Current legacy layers

Files such as `parity-fixes.css`, `reference-parity-final.css`, `reference-ui-v8.css`, `navigation-reference-v2.css`, and `navigation-reference-v9.css` are legacy compatibility layers. They should gradually shrink as rules are moved to stable semantic stylesheets.

This cleanup should be incremental: migrate one interface area at a time, run the regression suite, build the project, and visually compare the affected screens before removing the old declarations.
