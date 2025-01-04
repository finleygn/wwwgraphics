import { expect, test, describe } from "bun:test";
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
