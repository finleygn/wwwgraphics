import { timingTick, type ITiming } from './timing'

function hasStarted(timing: ITiming) {
  return timing.time > timing.delay || timing.progress === 1
}

export interface IEvents {
  start?(): void
  finish?(): void
  tick?(progress: number): void
}

export interface IEngineTickable {
  timing: ITiming
  autodispose: boolean
  events: IEvents
  enforceGate?: (dt: number) => void
}

class AnimationEngine {
  private timing: Set<IEngineTickable> = new Set()

  public add(animation: IEngineTickable) {
    this.timing.add(animation)
  }

  public remove(animation: IEngineTickable) {
    this.timing.delete(animation)
  }

  public tick(dt: number) {
    for (const animation of this.timing) {
      if (animation.timing.paused) continue

      const hadStarted = hasStarted(animation.timing)
      const hadPreviouslyFinished = animation.timing.progress === 1

      timingTick(animation.timing, dt)
      animation.enforceGate?.(dt)

      if (!hadStarted && hasStarted(animation.timing)) {
        animation.events.start?.()
      }

      // Trigger finish
      if (animation.timing.progress === 1 && !hadPreviouslyFinished) {
        animation.events.finish?.()
        if (animation.autodispose) {
          this.timing.delete(animation)
        }
      }

      // Notify elsewhere
      animation.events.tick?.(animation.timing.progress)
    }
  }
}

export default AnimationEngine
