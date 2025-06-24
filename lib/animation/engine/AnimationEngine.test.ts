import { expect, mock, test } from "bun:test";
import AnimationEngine, { type IEngineTrackedAnimation, type IEvents } from "./AnimationEngine";
import type { ITiming } from "./timing";

function createTiming(
  params: Partial<ITiming>
): ITiming {
  return {
    delay: 0,
    duration: 100,
    paused: false,
    progress: 0,
    time: 0,
    ...params,
  }
}

function createAnimation(timing: Partial<ITiming>, events: IEvents = {}): IEngineTrackedAnimation {
  return {
    autodispose: true,
    timing: createTiming(timing),
    events: events
  }
}

test("doesn't tick paused tracked animations", () => {
  const engine = new AnimationEngine();

  const basicPausedAnim = createAnimation({ paused: true, time: 0 });
  engine.add(basicPausedAnim);

  engine.tick(100);

  expect(basicPausedAnim.timing.time).toBe(0)
});

test("ticks dt when unpaused (default)", () => {
  const engine = new AnimationEngine();

  const basicPausedAnim = createAnimation({ time: 0 });
  engine.add(basicPausedAnim);

  engine.tick(100);

  expect(basicPausedAnim.timing.time).toBe(100)
});

test("fires start event once", () => {
  const engine = new AnimationEngine();

  const startEvent = mock(() => {});  
  const basicPausedAnim = createAnimation({}, { start: startEvent });
  engine.add(basicPausedAnim);

  expect(basicPausedAnim.events.start).toHaveBeenCalledTimes(0);

  engine.tick(100);
  expect(basicPausedAnim.events.start).toHaveBeenCalledTimes(1);

  engine.tick(100);
  expect(basicPausedAnim.events.start).toHaveBeenCalledTimes(1);
});

test("fires finish event once", () => {
  const engine = new AnimationEngine();

  const finishEvent = mock(() => {});  
  const basicPausedAnim = createAnimation({ duration: 100 }, { finish: finishEvent });
  engine.add(basicPausedAnim);

  expect(basicPausedAnim.events.finish).toHaveBeenCalledTimes(0);

  engine.tick(50);
  expect(basicPausedAnim.events.finish).toHaveBeenCalledTimes(0);

  engine.tick(50);
  expect(basicPausedAnim.events.finish).toHaveBeenCalledTimes(1);

  engine.tick(50);
  expect(basicPausedAnim.events.finish).toHaveBeenCalledTimes(1);
});

test("delay hinders progress value", () => {
  const engine = new AnimationEngine();

  const tickEvent = mock(() => {});
  const startEvent = mock(() => {});
  const finishEvent = mock(() => {});
  const basicPausedAnim = createAnimation({ duration: 300, delay: 100 }, { tick: tickEvent, start: startEvent, finish: finishEvent });
  engine.add(basicPausedAnim);

  
  engine.tick(50);
  expect(basicPausedAnim.events.start).toHaveBeenCalled();
  expect(basicPausedAnim.events.finish).not.toHaveBeenCalled();
  expect(basicPausedAnim.events.tick).lastCalledWith(0);

  engine.tick(50);
  expect(basicPausedAnim.events.tick).lastCalledWith(0);

  engine.tick(100);
  expect(basicPausedAnim.events.tick).lastCalledWith(0.5);
  
  expect(basicPausedAnim.events.finish).not.toHaveBeenCalled();

  engine.tick(100);
  expect(basicPausedAnim.events.tick).lastCalledWith(1.0);
  expect(basicPausedAnim.events.finish).toHaveBeenCalled();
});
