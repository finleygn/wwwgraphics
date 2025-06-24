/**
 * Animation library for connected animations or something
 * 
 * @module
 */

export {
  default as AnimatedValue,
  type AnimatedValueSettings,
  type AnimatedValueUpdate
} from './AnimatedValue'

export {
  default as AnimationEngine,
  type IEngineTrackedAnimation,
  type IEvents
} from './AnimationEngine'

export {
  type EaseFn,
  EaseType,
  easeFn_linear,
  easeFn_easeIn,
  easeFn_easeOut,
  easeFn_easeBoth,
  easeFnFactory_elastic
} from './ease';