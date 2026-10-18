import { inverseLerp } from "./interpolation";

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

/**
 * Return a value between 0 and 1 based on values position between the start and end.
 * 
 * Good for subsecting animation timelines!
 */
export function linearStep(value: number, start: number, end: number): number {
  return clamp(inverseLerp(start, end, value), 0, 1)
}