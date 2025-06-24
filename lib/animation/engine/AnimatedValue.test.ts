import { expect, mock, test } from "bun:test";
import AnimationEngine from "./AnimationEngine";
import AnimatedValue, { type AnimatedValueUpdate } from "./AnimatedValue";
import { EaseType } from "./ease";
import { timingSetProgress } from "./timing";

test("animated value progress gets updated", () => {
  const engine = new AnimationEngine();
  const fn = mock(() => {}) as AnimatedValueUpdate;

  const animatedValue = new AnimatedValue(
    fn,
    {
      ease: EaseType.LINEAR,
      duration: 100
    }
  )

  engine.add(animatedValue.ani);

  engine.tick(100);

  expect(fn).toHaveBeenLastCalledWith(1, animatedValue)
});

test("animated value progress gets updated using custom easing function", () => {
  const engine = new AnimationEngine();
  const fn = mock(() => {}) as AnimatedValueUpdate;

  const animatedValue = new AnimatedValue(
    fn,
    {
      ease: (progress: number) => {
        if(progress <= 0.5) {
          return 0;
        } else {
          return 1;
        }
      },
      duration: 100
    }
  )

  engine.add(animatedValue.ani);

  engine.tick(10);
  expect(fn).toHaveBeenLastCalledWith(0, animatedValue);

  engine.tick(50);
  expect(fn).toHaveBeenLastCalledWith(1, animatedValue);
});


test("automatically removed from engine upon completion", () => {
  const engine = new AnimationEngine();
  const fn = mock(() => {}) as AnimatedValueUpdate;

  const animatedValue = new AnimatedValue(
    fn,
    { duration: 100, ease: EaseType.LINEAR }
  )

  engine.add(animatedValue.ani);

  engine.tick(100);
  expect(fn).toHaveBeenCalledTimes(1);


  // Not called again even when ani progress is reset.
  timingSetProgress(animatedValue.ani.timing, 0);
  
  engine.tick(100);
  expect(fn).toHaveBeenCalledTimes(1);
});


test("delay hinders progress value", () => {
  const engine = new AnimationEngine();
  const fn = mock(() => {}) as AnimatedValueUpdate;

  const animatedValue = new AnimatedValue(
    fn,
    { duration: 100, delay: 200, ease: EaseType.LINEAR }
  )

  engine.add(animatedValue.ani);

  engine.tick(100);
  expect(fn).lastCalledWith(0, animatedValue);

  engine.tick(100);
  expect(fn).lastCalledWith(0, animatedValue);

  engine.tick(50);
  expect(fn).lastCalledWith(0.5, animatedValue);

  engine.tick(50);
  expect(fn).lastCalledWith(1.0, animatedValue);
});