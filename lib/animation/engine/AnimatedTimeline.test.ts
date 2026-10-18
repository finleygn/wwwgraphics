import { describe, expect, mock, test } from "bun:test";
import AnimationEngine from "./AnimationEngine";
import AnimationTimeline from "./AnimatedTimeline";
import { easeLinear } from "./ease";

function createTimeline() {
  return new AnimationTimeline<"a" | "b" | "instant">()
    .addPhase("a", { start: 0, end: 100, easeFn: easeLinear })
    .addPhase("b", { start: 50, end: 200, easeFn: easeLinear });
}

describe("phases", () => {
  test("duration fits the latest ending phase", () => {
    const timeline = createTimeline();
    expect(timeline.timing.duration).toBe(200);

    // Adding an earlier ending phase doesn't shrink the duration
    timeline.addPhase("instant", { start: 10, end: 10, easeFn: easeLinear });
    expect(timeline.timing.duration).toBe(200);
  });

  test("addPhase replaces an existing phase with the same name", () => {
    const timeline = createTimeline();
    const replacement = { start: 20, end: 40, easeFn: easeLinear };

    timeline.addPhase("a", replacement);
    expect(timeline.getPhase("a")).toBe(replacement);
  });

  test("getPhase returns undefined for unknown phases", () => {
    expect(createTimeline().getPhase("instant")).toBeUndefined();
  });
});

describe("progress", () => {
  test("tracks each phase independently", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    engine.add(timeline);

    engine.tick(50);
    expect(timeline.progress("a")).toBe(0.5);
    expect(timeline.progress("b")).toBe(0);

    engine.tick(75);
    expect(timeline.progress("a")).toBe(1);
    expect(timeline.progress("b")).toBe(0.5);
  });

  test("applies the phase's ease function", () => {
    const engine = new AnimationEngine();
    const timeline = new AnimationTimeline().addPhase("a", {
      start: 0,
      end: 100,
      easeFn: (p) => p * p,
    });
    engine.add(timeline);

    engine.tick(50);
    expect(timeline.progress("a")).toBe(0.25);
  });

  test("zero length phases jump from 0 to 1 at their start", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline().addPhase("instant", {
      start: 100,
      end: 100,
      easeFn: easeLinear,
    });
    engine.add(timeline);

    engine.tick(99);
    expect(timeline.progress("instant")).toBe(0);

    engine.tick(1);
    expect(timeline.progress("instant")).toBe(1);
  });

  test("returns 0 for unknown phases", () => {
    expect(createTimeline().progress("instant")).toBe(0);
  });

  test("delay is excluded from elapsed time", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    timeline.timing.delay = 100;
    engine.add(timeline);

    engine.tick(100);
    expect(timeline.elapsed).toBe(0);
    expect(timeline.progress("a")).toBe(0);

    engine.tick(50);
    expect(timeline.elapsed).toBe(50);
    expect(timeline.progress("a")).toBe(0.5);
  });
});

describe("isInPhase", () => {
  test("is inclusive of the start and end", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    engine.add(timeline);

    expect(timeline.isInPhase("a")).toBe(true);
    expect(timeline.isInPhase("b")).toBe(false);

    engine.tick(50);
    expect(timeline.isInPhase("a")).toBe(true);
    expect(timeline.isInPhase("b")).toBe(true);

    engine.tick(50);
    expect(timeline.isInPhase("a")).toBe(true);

    engine.tick(1);
    expect(timeline.isInPhase("a")).toBe(false);
    expect(timeline.isInPhase("b")).toBe(true);
  });

  test("is false for unknown phases", () => {
    expect(createTimeline().isInPhase("instant")).toBe(false);
  });
});

describe("gate", () => {
  test("holds at the gated phase's start", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    timeline.setGatePhase("b");
    engine.add(timeline);

    engine.tick(40);
    expect(timeline.elapsed).toBe(40);

    engine.tick(40);
    expect(timeline.elapsed).toBe(50);

    engine.tick(1000);
    expect(timeline.elapsed).toBe(50);
    expect(timeline.progress("a")).toBe(0.5);
    expect(timeline.progress("b")).toBe(0);
  });

  test("clearing the gate resumes from where it held", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    timeline.setGatePhase("b");
    engine.add(timeline);

    engine.tick(1000);
    timeline.setGatePhase(undefined);
    expect(timeline.gate).toBeUndefined();

    engine.tick(25);
    expect(timeline.elapsed).toBe(75);
  });

  test("respects delay", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    timeline.timing.delay = 100;
    timeline.setGatePhase("b");
    engine.add(timeline);

    engine.tick(1000);
    expect(timeline.timing.time).toBe(150);
    expect(timeline.elapsed).toBe(50);
  });

  test("moving the gate behind the current time jumps back to it", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    engine.add(timeline);

    engine.tick(150);
    timeline.setGatePhase("b");

    engine.tick(10);
    expect(timeline.elapsed).toBe(50);
  });

  test("unknown phases leave the existing gate in place", () => {
    const timeline = createTimeline();
    timeline.setGatePhase("b");
    timeline.setGatePhase("instant");

    expect(timeline.gate).toBe(50);
  });

  test("does not finish while held, even if a tick overshoots the end", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    const finish = mock(() => {});
    timeline.events.finish = finish;
    timeline.setGatePhase("b");
    engine.add(timeline);

    engine.tick(10_000);
    expect(timeline.timing.progress).toBe(0.25);
    expect(finish).not.toHaveBeenCalled();
  });
});

describe("engine integration", () => {
  test("fires finish and autodisposes once all phases complete", () => {
    const engine = new AnimationEngine();
    const timeline = createTimeline();
    const finish = mock(() => {});
    timeline.events.finish = finish;
    engine.add(timeline);

    engine.tick(199);
    expect(finish).not.toHaveBeenCalled();

    engine.tick(1);
    expect(finish).toHaveBeenCalledTimes(1);

    // Removed, so further ticks don't advance it
    timeline.timing.time = 0;
    engine.tick(50);
    expect(timeline.elapsed).toBe(0);
  });

  test("an empty timeline finishes immediately", () => {
    const engine = new AnimationEngine();
    const timeline = new AnimationTimeline();
    const finish = mock(() => {});
    timeline.events.finish = finish;
    engine.add(timeline);

    engine.tick(1);
    expect(finish).toHaveBeenCalledTimes(1);
  });
});
