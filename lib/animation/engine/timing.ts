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
  // Update absolute time
  timing.time = Math.min(
    timing.time + dt,
    timing.delay + timing.duration
  );

  // Update 0-1 progress
  timing.progress = Math.max(timing.time - timing.delay, 0) / (timing.duration - timing.delay);
}

export function timingSetProgress(timing: ITiming, progress: number) {
  timing.time = timing.delay + progress * timing.duration;
  timing.progress = progress
}

export function timingSetTime(timing: ITiming, time: number) {
  timing.time = time;
  timing.progress = Math.max(timing.time - timing.delay, 0) / (timing.duration - timing.delay);
}

