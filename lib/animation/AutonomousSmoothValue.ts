import { expDecay } from "./interpolation";

/**
 * Approach a value upon every tick. Good for creating smooth motion quickly.
 * We don't need to care when the animation started, we only need to know the current value and a target.
 */
class AutonomousSmoothValue {
  /** Where the value should end up after enough time has passed */
  public target: number;

  /** The current value */
  public value: number;

  /** How quickly should value approach target */
  public strength: number;

  constructor(value: number, strength: number = 0.1) {
    this.target = value;
    this.value = value;
    this.strength = strength;
  }

  /**
   * Set the target value to approach every frame without animating.
   * Good for cancelling an animation.
   */
  public setAbsolute(value: number): void {
    this.value = value;
    this.target = value;
  }

  /**
   * Speed to approach the target value.
   * Related to time taken, but value is not measured in ms, s etc.
   */
  public setStrength(value: number): void {
    this.strength = value;
  }

  /**
   * Should be called once per frame to update the value.
   */
  public tick(dt: number): void {
    this.value = expDecay(this.value, this.target, this.strength, dt);
  }

  /**
   * Check whether value has reached target.
   * @param threshold How close to the target should value be to "close enough"
   */
  public isFinished(threshold = 0.0001): boolean {
    return Math.abs(this.value - this.target) < threshold;
  }
}

export default AutonomousSmoothValue;