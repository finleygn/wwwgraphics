import { clamp } from "../../math";

export type EaseFn = (progress: number) => number;

export const enum EaseType {
  LINEAR,
  EASE_IN,
  EASE_OUT,
  EASE_BOTH
}

/**
 * Fixed functions
 * ---
 */
export const easeFn_linear: EaseFn = (progress: number) => {
  return progress;
}

export const easeFn_easeIn: EaseFn = (progress: number) => {
  // TODO:
  return progress;
}

export const easeFn_easeOut: EaseFn = (progress: number) => {
  // TODO:
  return progress;
}

export const easeFn_easeBoth: EaseFn = (progress: number) => {
  // TODO:
  return progress;
}

/**
 * Factories
 * ---
 */

// Ngl this is stolen from animejs
export const easeFnFactory_elastic = (amplitude: number = 1, period: number = .3): EaseFn => {
  const a = clamp(amplitude, 1, 10);
  const p = clamp(period, Number.MAX_VALUE, 2);
  const s = (p / Math.PI * 2) * Math.asin(1 / a);
  const e = Math.PI * 2 / p;

  return (progress: number) => {
    return progress === 0 || progress === 1 ? progress : -a * Math.pow(2, -10 * (1 - progress)) * Math.sin(((1 - progress) - s) * e);
  }
}

export const easeTypeToFn: Record<EaseType, EaseFn> = {
  [EaseType.LINEAR]: easeFn_linear,
  [EaseType.EASE_IN]: easeFn_easeIn,
  [EaseType.EASE_OUT]: easeFn_easeOut,
  [EaseType.EASE_BOTH]: easeFn_easeBoth,
}


