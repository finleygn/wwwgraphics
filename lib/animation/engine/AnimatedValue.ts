import type { IEngineTrackedAnimation, IEvents } from "./AnimationEngine";
import { EaseType, easeTypeToFn, type EaseFn } from "./ease";
import { DEFAULT_TIMING, type ITiming } from "./timing";

export type AnimatedValueUpdate = (progress: number, av: AnimatedValue) => void;
export type AnimatedValueSettings = (
  & Partial<ITiming> 
  & Omit<IEvents, 'tick'>
  & { ease: EaseType | EaseFn, autodispose?: boolean }
);

class AnimatedValue {
  public ani: IEngineTrackedAnimation;
  private easeFn: EaseFn;
  private updateCallback: AnimatedValueUpdate;

  constructor(updateCallback: AnimatedValueUpdate, settings: AnimatedValueSettings) {
    const { finish, start, ease, autodispose = true, ...timing } = settings;
    
    this.updateCallback = updateCallback;
    this.easeFn = typeof settings.ease === 'function' 
      ? settings.ease 
      : easeTypeToFn[settings.ease];

    this.ani = {
      autodispose,
      events: {
        finish,
        start,
        tick: this.handleTick
      },
      timing: {
        ...DEFAULT_TIMING,
        ...timing,
      }
    }
  }

  private handleTick = (progress: number) => {
    this.updateCallback(this.easeFn(progress), this);
  }
}

export default AnimatedValue;