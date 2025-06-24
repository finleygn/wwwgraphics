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
  easeLinear as easeFn_linear,
  easeIn as easeFn_easeIn,
  easeOut as easeFn_easeOut,
  easeBoth as easeFn_easeBoth,
  easeElasticFactory as easeFnFactory_elastic,
  easeInFactory as easeFnFactory_in,
  easeOutFactory as easeFnFactory_out,
  easeBothFactory as easeFnFactory_both
} from './ease';