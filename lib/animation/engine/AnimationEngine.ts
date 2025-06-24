import { timingTick, type ITiming } from "./timing";

export interface IEngineTrackedAnimation {
  timing: ITiming;
  events: IEvents;
  autodispose: boolean;
  // TODO: Add support for `forwards` `backwards` `loop` `alternate`
}

export interface IEvents {
  start?(): void;
  finish?(): void;
  tick?(progress: number): void;
}

/**
 * Keeps track of and updates IEngineTrackedAnimation's every frame.
 * 
 * Can be set up with a `renderLoop` or with:
 * ```ts
 * const e = new AnimationEngine();
 * function loop(dt: number) {
 *   e.tick(dt);
 *   requestAnimationFrame(loop);
 * }
 * requestAnimationFrame(loop)
 * ```
 */
class AnimationEngine {
  private timing: Set<IEngineTrackedAnimation> = new Set();

  public add(animation: IEngineTrackedAnimation) {
    this.timing.add(animation);
  }

  public remove(animation: IEngineTrackedAnimation) {
    this.timing.delete(animation);
  }

  public tick(dt: number) {
    for(const animation of this.timing) {
      if(animation.timing.paused) continue;
      let hadPreviouslyFinished = animation.timing.progress === 1;

      if(animation.timing.progress === 0) {
        animation.events.start?.();
      }

      timingTick(animation.timing, dt);

      if(animation.timing.progress === 1 && !hadPreviouslyFinished) {
        animation.events.finish?.();
        if(animation.autodispose) {
          this.remove(animation);
        }
      }

      animation.events.tick?.(animation.timing.progress);
    }
  }
}

const e = new AnimationEngine();
function loop(dt: number) {
  e.tick(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop)

export default AnimationEngine;