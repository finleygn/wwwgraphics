/**
 * Linear interpolation
 * Move from `start` to `end` by percentage `progress`, where `progress` is a float from 0 to 1.
 * 
 * Don't use this for smoothing, use {@link expDecay} instead.
 * 
 * @param start the value when t = 0
 * @param end the value when t = 1
 * @param progress progress between {@link start} and {@link end}
 */
export function lerp(start: number, end: number, progress: number): number {
  return start * (1 - progress) + end * progress;
}

/**
 * Decay from `start` to `end` over time. This is framerate independent which is helpful for autonomous smoothing 
 * 
 * @see {@link AutonomousSmoothValue}
 * @see {@link https://www.youtube.com/watch?v=LSNQuFEDOyQ Why to use this over lerp?}
 * 
 * @param start Where the interpolation should begin
 * @param end Where the interpoliation should end
 * @param decaySpeed How much should {@link dt} affect the decay
 * @param dt Delta time
 */
export function expDecay(start: number, end: number, decaySpeed: number, dt: number): number {
  // 30 is a magic number here, just nicer to have reasonable speeds between 0 - 1 as an input
  return end + (start - end) * Math.exp(-lerp(0, 30, decaySpeed) * dt);
}