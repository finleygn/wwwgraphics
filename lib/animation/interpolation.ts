/**
 * Don't use this for lerp smoothing, where a updates every frame.
 * That would be rate dependant, use expDecay for better results.
 */
export function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

export function expDecay(a: number, b: number, decaySpeed: number, dt: number) {
  // 25 is a magic number here, just nicer to have reasonable speeds between 0-1 as an input
  return b + (a - b) * Math.exp(-lerp(0, 25, decaySpeed) * dt);
}