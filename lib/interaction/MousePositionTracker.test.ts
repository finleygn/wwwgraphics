import { describe, expect, test, beforeEach, afterEach, mock } from "bun:test";
import MousePositionTracker, { type EventEmitter } from "./MousePositionTracker";

describe("MousePositionTracker", () => {
  let mockElement: EventEmitter;
  let tracker: MousePositionTracker;
  let eventListeners: { [key: string]: Function[] };

  beforeEach(() => {
    // Reset event listeners for each test
    eventListeners = {
      mousemove: [],
      touchmove: [],
      touchstart: [],
    };

    // Create a mock element that tracks event listeners
    mockElement = {
      addEventListener: mock((type: string, listener: Function) => {
        eventListeners[type].push(listener);
      }),
      removeEventListener: mock((type: string, listener: Function) => {
        eventListeners[type] = eventListeners[type].filter(l => l !== listener);
      }),
      getBoundingClientRect: () => ({
        width: 1000,
        height: 800,
        left: 100,
        top: 100,
        right: 1100,
        bottom: 900,
        x: 100,
        y: 100,
        toJSON: () => ({})
      })
    };

    tracker = new MousePositionTracker(mockElement);
  });

  afterEach(() => {
    tracker.destroy();
  });

  test("should initialize with default position", () => {
    expect(tracker.x).toBe(0.5);
    expect(tracker.y).toBe(0.5);
  });

  test("should handle mouse movement", () => {
    const mouseMoveListener = eventListeners.mousemove[0];
    
    // Simulate mouse move to (600, 500) in client coordinates
    // Given element position at (100, 100), this should result in
    // relative position (500, 400) within the 1000x800 element
    mouseMoveListener({
      clientX: 600,
      clientY: 500,
    });

    // Expected normalized coordinates
    expect(tracker.x).toBeCloseTo(0.5); // (600 - 100) / 1000
    expect(tracker.y).toBeCloseTo(0.5); // (500 - 100) / 800
  });

  test("should handle touch events", () => {
    const touchMoveListener = eventListeners.touchmove[0];
    
    // Simulate touch event
    touchMoveListener({
      touches: [{
        clientX: 350,
        clientY: 300,
      }]
    });

    // Expected normalized coordinates
    expect(tracker.x).toBeCloseTo(0.25); // (350 - 100) / 1000
    expect(tracker.y).toBeCloseTo(0.25); // (300 - 100) / 800
  });

  test("should handle subscriptions correctly", () => {
    const subscriber1 = mock((x: number, y: number) => {});
    const subscriber2 = mock((x: number, y: number) => {});

    // Add subscribers
    const unsubscribe1 = tracker.subscribe(subscriber1);
    const unsubscribe2 = tracker.subscribe(subscriber2);

    // Trigger mouse move
    const mouseMoveListener = eventListeners.mousemove[0];
    mouseMoveListener({
      clientX: 600,
      clientY: 500,
    });

    // Both subscribers should have been called once
    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledTimes(1);

    // Unsubscribe first subscriber
    unsubscribe1();

    // Trigger another mouse move
    mouseMoveListener({
      clientX: 700,
      clientY: 600,
    });

    // First subscriber should still have been called once
    // Second subscriber should have been called twice
    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledTimes(2);
  });

  test("should clean up event listeners on destroy", () => {
    const removeEventListenerMock = mockElement.removeEventListener as unknown as ReturnType<typeof mock>;
    
    tracker.destroy();

    // Should remove all three event listeners
    expect(removeEventListenerMock).toHaveBeenCalledTimes(3);
    expect(removeEventListenerMock).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerMock).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(removeEventListenerMock).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  test("should handle multiple subscribers with correct coordinates", () => {
    const positions: Array<[number, number]> = [];
    const subscriber = mock((x: number, y: number) => {
      positions.push([x, y]);
    });

    tracker.subscribe(subscriber);

    const mouseMoveListener = eventListeners.mousemove[0];
    
    // Simulate multiple mouse moves
    const moves = [
      { clientX: 200, clientY: 200 }, // (100, 100) relative -> 0.1, 0.125 normalized
      { clientX: 600, clientY: 500 }, // (500, 400) relative -> 0.5, 0.5 normalized
      { clientX: 1000, clientY: 800 }, // (900, 700) relative -> 0.9, 0.875 normalized
    ];

    moves.forEach(pos => mouseMoveListener(pos));

    expect(positions.length).toBe(3);
    expect(positions[0][0]).toBeCloseTo(0.1);
    expect(positions[0][1]).toBeCloseTo(0.125);
    expect(positions[1][0]).toBeCloseTo(0.5);
    expect(positions[1][1]).toBeCloseTo(0.5);
    expect(positions[2][0]).toBeCloseTo(0.9);
    expect(positions[2][1]).toBeCloseTo(0.875);
  });
});
