/**
 * Everything to do with animation within the JS environment.
 *
 * @module
 */

export {
  default as AutonomousSmoothValue,
  AnimatedValueEvent,
  type AnimatedValueSubscriber,
} from "./AutonomousSmoothValue";
export { lerp, expDecay } from "./interpolation";
export { cubicPulse } from "./shaping";
