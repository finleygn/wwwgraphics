import type { IEngineTickable, IEvents } from './AnimationEngine'
import { EaseType, easeTypeToFn, type EaseFn } from './ease'
import { DEFAULT_TIMING, type ITiming } from './timing'

export type AnimatedValueUpdate = (progress: number, av: AnimatedValue) => void
export type AnimatedValueSettings = Partial<ITiming> &
  Omit<IEvents, 'tick'> & {
    ease: EaseType | EaseFn
    autodispose?: boolean
    callback?: AnimatedValueUpdate
  }

class AnimatedValue implements IEngineTickable {
  public timing: ITiming
  public events: IEvents
  public autodispose: boolean
  private easeFn: EaseFn
  private updateCallback?: AnimatedValueUpdate

  constructor(settings: AnimatedValueSettings) {
    const { finish, start, autodispose = true, callback, ...timing } = settings

    this.updateCallback = callback
    this.easeFn = typeof settings.ease === 'function' ? settings.ease : easeTypeToFn[settings.ease]

    this.autodispose = autodispose
    this.events = {
      finish,
      start,
      tick: this.handleTick,
    }
    this.timing = {
      ...DEFAULT_TIMING,
      ...timing,
    }
  }

  private handleTick = (progress: number) => {
    if (this.updateCallback) {
      this.updateCallback(this.easeFn(progress), this)
    }
  }
}

export default AnimatedValue
