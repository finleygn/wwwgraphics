# wwwgraphics

A utility library for web projects with visuals that stray away from CSS.

## Installation

Currently this package is only published to [JSR](https://jsr.io/@fishley/wwwgraphics).

```bash
# Deno
deno add jsr:@fishley/wwwgraphics
# NPM
npx jsr add @fishley/wwwgraphics
# Bun
bunx jsr add @fishley/wwwgraphics
```

## Snippet

There isn't much documentation yet outside of https://jsr.io/@fishley/wwwgraphics/doc. But here is a snippet of some utils working together :)

```ts
import { renderLoop, type RenderLoopTimeData } from '@fishley/wwwgraphics/app';
import { MousePositionTracker } from '@fishley/wwwgraphics/interaction';
import { AutonomousSmoothValue } from '@fishley/wwwgraphics/animation';

const cursorTrail = document.getElementById('cursor-trail');

const initialPosition = { x: 0.5, y: 0.5 };

const cursorTrailPosition = {
    x: new AutonomousSmoothValue(initialPosition.x),
    y: new AutonomousSmoothValue(initialPosition.y),
}

const tracker = new MousePositionTracker(initialPosition.x, initialPosition.y, document.body);

renderLoop(
    (time: RenderLoopTimeData) => {
        cursorTrailPosition.x.target = tracker.x;
        cursorTrailPosition.y.target = tracker.y;

        // Slowly approach the mouse position
        cursorTrailPosition.x.tick(time.dt);
        cursorTrailPosition.y.tick(time.dt);

        cursorTrail.style.transform = `translate(${cursorTrailPosition.x.value * 100}%, ${cursorTrailPosition.y.value * 100}%)`;
    },
    { longestFrame: 60 }
);
```
