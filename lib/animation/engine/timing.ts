export interface ITimingSettings {
  delay: number;
  duration: number;
}

export interface ITimingState {
  paused: boolean;
  time: number;
  progress: number;
}

export interface ITiming extends ITimingSettings, ITimingState {}

export const DEFAULT_TIMING = {
  delay: 0,
  duration: 1000,
  paused: false,
  progress: 0,
  time: 0,
};

export function timingTick(timing: ITiming, dt: number) {
  if (timing.duration <= 0) {
    timing.progress = 1;
    timing.time = timing.delay + timing.duration;
    return;
  }

  timing.time = Math.min(timing.time + dt, timing.delay + timing.duration);

  const activeTime = Math.max(0, timing.time - timing.delay);
  timing.progress = activeTime / timing.duration;
}

export function timingSetProgress(timing: ITiming, progress: number) {
  timing.time = timing.delay + progress * timing.duration;
  timing.progress = progress
}
