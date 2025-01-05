import { expect, test } from "bun:test";
import AutonomousSmoothValue from "./AutonomousSmoothValue";

test("setting absolute value", () => {
  const value = new AutonomousSmoothValue(1);
  value.setAbsolute(2);
  expect(value.value).toBe(2);
  expect(value.target).toBe(2);
});

test("tick value increase is not framerate dependent", () => {
  const value1 = new AutonomousSmoothValue(1);
  const value2 = new AutonomousSmoothValue(1);

  value1.target = 2;
  value2.target = 2;

  value1.tick(0.1);

  value2.tick(0.03);
  value2.tick(0.07);

  expect(value1.value).toBe(value2.value);
});

test("value approaches target over time", () => {
  const value = new AutonomousSmoothValue(0);
  value.target = 1;
  
  value.tick(0.1);
  expect(value.value).toBeGreaterThan(0);
  expect(value.value).toBeLessThan(1);
  
  // After many ticks, should be very close to target
  for (let i = 0; i < 100; i++) {
    value.tick(0.1); 
  }
  expect(value.value).toBeCloseTo(1, 4);
});

test("isFinished returns true when value is close to target", () => {
  const value = new AutonomousSmoothValue(0);
  value.target = 1;
  
  expect(value.isFinished()).toBe(false);
  
  // Tick until very close to target
  for (let i = 0; i < 100; i++) {
    value.tick(0.1);
  }
  
  expect(value.isFinished()).toBe(true);
});

test("setStrength affects approach speed", () => {
  const fastValue = new AutonomousSmoothValue(0);
  const slowValue = new AutonomousSmoothValue(0);
  
  fastValue.target = 1;
  slowValue.target = 1;
  
  fastValue.setStrength(0.5);
  slowValue.setStrength(0.1);
  
  fastValue.tick(0.1);
  slowValue.tick(0.1);
  
  expect(fastValue.value).toBeGreaterThan(slowValue.value);
});
