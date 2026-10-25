# Imports and Tree Shaking

There are some choices in this codebase which seem strange but are actually for the benefit of tree shaking.

1. Barrel file exports often fail to tree shake. So you will have to import from each module individually -> "@fishley/wwwgraphics/math/vec2" instead of just "@fishley/wwwgraphics"
2. Class methods (including static ones) are not tree shaken. Methods from classes with many methods like Vec2 are therefore split out into their own standalone functions.