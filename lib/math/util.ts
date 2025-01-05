/**
 * Clamp a value between a minimum and maximum.
 * 
 * @param v the value to clamp
 * @param min the minimum value
 * @param max the maximum value
 */ 
export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}