import { clamp } from "../../math";

export type EaseFn = (progress: number) => number;

export enum EaseType {
  LINEAR,
  EASE_IN,
  EASE_OUT,
  EASE_BOTH
}

/**
 * Factories
 * ---
 */
const ease = {
  in: (p: number, s: number) => Math.pow(p, s),
  out: (p: number, s: number) => 1 - Math.pow(1 - p, s)
}

export const easeInFactory = (strength: number): EaseFn => {
  return (progress: number) => {
    return ease.in(progress, strength)
  }
}

export const easeOutFactory = (strength: number): EaseFn => {
  return (progress: number) => {
    return ease.out(progress, strength)
  }
}

export const easeBothFactory = (strength: number): EaseFn => {
  return (progress: number) => {
    if(progress < 0.5) {
      return ease.in(progress * 2, strength) / 2;
    } else { 
      return 1 - ease.in(progress * -2 + 2, strength) / 2;
    }
  }
}


// Ngl this is stolen from animejs
export const easeElasticFactory = (amplitude: number = 1, period: number = .3): EaseFn => {
  const a = clamp(amplitude, 1, 10);
  const p = clamp(period, Number.MAX_VALUE, 2);
  const s = (p / Math.PI * 2) * Math.asin(1 / a);
  const e = Math.PI * 2 / p;

  return (progress: number) => {
    return progress === 0 || progress === 1 ? progress : -a * Math.pow(2, -10 * (1 - progress)) * Math.sin(((1 - progress) - s) * e);
  }
}

const REASONABLE_EASE_DEFAULT = 2.5;

/**
 * Fixed functions
 * ---
 */
export const easeLinear: EaseFn = (progress: number) => {
  return progress;
}
export const easeIn: EaseFn = easeInFactory(REASONABLE_EASE_DEFAULT);
export const easeOut: EaseFn = easeOutFactory(REASONABLE_EASE_DEFAULT);
export const easeBoth: EaseFn = easeBothFactory(REASONABLE_EASE_DEFAULT);

export const easeTypeToFn: Record<EaseType, EaseFn> = {
  [EaseType.LINEAR]: easeLinear,
  [EaseType.EASE_IN]: easeIn,
  [EaseType.EASE_OUT]: easeOut,
  [EaseType.EASE_BOTH]: easeBoth,
}


