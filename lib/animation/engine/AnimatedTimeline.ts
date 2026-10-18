import { linearStep } from '../../math'
import type { IEngineTickable, IEvents } from './AnimationEngine'
import type { EaseFn } from './ease'
import { DEFAULT_TIMING, type ITiming, timingSetTime } from './timing'

/**
 * A named subsect of time within a {@link AnimationTimeline}.
 */
export interface AnimationPhase {
  /**
   * Time in ms, relative to the timeline starting, the phase begins
   */
  start: number
  /**
   * Time in ms, relative to the timeline starting, the phase ends
   */
  end: number
  /**
   * Applied to the phase's linear 0-1 progress in {@link AnimationTimeline.progress}
   */
  easeFn: EaseFn
}

/**
 * A single clock split into named, possibly overlapping, phases.
 *
 * @example
 * const timeline = new AnimationTimeline<'fadeIn' | 'slide'>()
 *   .addPhase('fadeIn', { start: 0, end: 300, easeFn: easeFn_linear })
 *   .addPhase('slide', { start: 200, end: 800, easeFn: easeFn_easeOut })
 *
 * engine.add(timeline)
 *
 * // In a render loop
 * el.style.opacity = timeline.progress('fadeIn')
 */
class AnimationTimeline<K = string> implements IEngineTickable {
  public timing: ITiming = { ...DEFAULT_TIMING, duration: 0 }
  public autodispose: boolean = true
  public events: IEvents = {}

  /**
   * Elapsed time in ms the timeline will hold at, or `undefined` to run freely.
   * Can be set using named phase with {@link setGatePhase}.
   */
  public gate: number | undefined
  private phases: Map<K, AnimationPhase> = new Map()

  /**
   * Time in ms since the timeline started, excluding delay
   */
  public get elapsed() {
    return Math.max(0, this.timing.time - this.timing.delay)
  }

  /**
   * Called by the engine when time has advanced, it'll reset the timing if it has passed a gate.
   */
  public enforceGate() {
    if (this.gate === undefined) return

    // Hold at the gate once reached. Not paused, so clearing/moving the gate resumes.
    if (this.elapsed >= this.gate) {
      timingSetTime(this.timing, this.timing.delay + this.gate)
    }
  }

  /**
   * Whether the current elapsed time is within the phase.
   */
  public isInPhase(name: K) {
    const now = this.elapsed
    const track = this.phases.get(name)

    if (track) {
      return now >= track.start && now <= track.end
    }

    return false
  }

  /**
   * Hold the timeline at the start of a phase.
   */
  public setGatePhase(phase: K | undefined) {
    if (phase !== undefined) {
      const track = this.phases.get(phase)
      if (track) {
        this.gate = track.start
      }
    } else {
      this.gate = undefined
    }
  }

  /**
   * Add a phase.
   * Extends the timeline's duration to the phase's end.
   */
  public addPhase(name: K, track: AnimationPhase): AnimationTimeline<K> {
    this.phases.set(name, track)

    this.timing.duration = Math.max(this.timing.duration, track.end)

    return this
  }

  public getPhase(name: K): AnimationPhase | undefined {
    return this.phases.get(name)
  }

  /**
   * Eased 0-1 progress through the phase.
   */
  public progress(name: K) {
    const track = this.phases.get(name)
    if (!track) return 0

    const p =
      track.end === track.start
        ? this.elapsed >= track.start
          ? 1
          : 0
        : linearStep(this.elapsed, track.start, track.end)

    return track.easeFn(p)
  }
}

export default AnimationTimeline
