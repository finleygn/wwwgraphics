# wwwgraphics

A utility library for to help with visuals for web projects.

[Docs](https://jsr.io/@fishley/wwwgraphics/doc/)

---

Key areas:

- [Animation](https://jsr.io/@fishley/wwwgraphics/doc/animation)
  - Shaping functions
  - Dynamic smooth values
  - A time based [engine](https://jsr.io/@fishley/wwwgraphics/doc/animation/engine) supporting single values or timelines.
- [WebGL](https://jsr.io/@fishley/wwwgraphics/doc/webgl)
  - Shader build helpers
  - Shader snippets
  - MSDF text rendering
- [Interaction](https://jsr.io/@fishley/wwwgraphics/doc/interaction)
  - Mouse trackers
- [App](https://jsr.io/@fishley/wwwgraphics/doc/app)
  - Render loop helper
- [Math](https://jsr.io/@fishley/wwwgraphics/doc/math)
  - Vectors
  - General utils

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

### Dynamic animation

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

### Time based animation

```ts
import { renderLoop } from '@fishley/wwwgraphics/app';
import {
    AnimationEngine,
    AnimatedValue,
    AnimatedTimeline,
    EaseType,
    easeFn_linear,
    easeFn_easeOut,
} from '@fishley/wwwgraphics/animation/engine';

const engine = new AnimationEngine();
const box = document.getElementById('box');

const fade = new AnimatedValue({
    duration: 500,
    delay: 200,
    ease: EaseType.EASE_OUT,
    // This gets called on every engine tick.
    callback: (progress) => {
        box.style.opacity = `${progress}`;
    },
    finish: () => console.log('Faded in!'),
});

const intro = new AnimatedTimeline()
    .addPhase('grow', { start: 0, end: 300, easeFn: easeFn_linear })
    .addPhase('slide', { start: 200, end: 800, easeFn: easeFn_easeOut });

engine.add(fade);
engine.add(intro);

renderLoop(
    (time) => {
        engine.tick(time.dt * 1000);

        const scale = 0.5 + intro.progress('grow') * 0.5;
        const x = intro.progress('slide') * 200;
        box.style.transform = `translateX(${x}px) scale(${scale})`;
    },
    { longestFrame: 0.1 }
);
```
