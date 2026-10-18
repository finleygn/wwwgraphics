export interface ITimingSettings {
  delay: number
  duration: number
}

export interface ITimingState {
  paused: boolean
  /**
   * Time since start, including delay
   */
  time: number
  /**
   * 0-1 completion, excluding delay
   */
  progress: number
}

export interface ITiming extends ITimingSettings, ITimingState {}

export const DEFAULT_TIMING = {
  delay: 0,
  duration: 1000,
  paused: false,
  progress: 0,
  time: 0,
}

export function timingTick(timing: ITiming, dt: number) {
  if (timing.duration <= 0) {
    timing.progress = 1
    timing.time = timing.delay + timing.duration
    return
  }

  timingSetTime(timing, timing.time + dt)
}

/**
 * Set the progress in percentage
 * Update the time to fit
 */
export function timingSetProgress(timing: ITiming, progress: number) {
  timing.time = timing.delay + progress * timing.duration
  timing.progress = progress
}

/**
 * Set the time in ms
 * Update the progress to fit
 */
export function timingSetTime(timing: ITiming, time: number) {
  timing.time = Math.min(time, timing.delay + timing.duration)
  timing.progress = Math.max(0, timing.time - timing.delay) / timing.duration
}
