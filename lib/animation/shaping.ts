/**
 * Thanks https://iquilezles.org/articles/functions
 */

export function cubicPulse(c: number, w: number, x: number): number {
  x = Math.abs(x - c);
  if (x > w) return 0;
  x /= w;
  return 1 - x * x * (3 - 2 * x);
}