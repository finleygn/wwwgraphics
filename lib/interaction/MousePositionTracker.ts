import { clamp } from "../math/util";

type Subscriber = (x: number, y: number) => void;

interface Container {
  subscribeTouch(subscriber: (event: TouchEvent) => void): void;
  subscribeMouse(subscriber: (event: MouseEvent) => void): void;
  unsubscribeTouch(subscriber: (event: TouchEvent) => void): void;
  unsubscribeMouse(subscriber: (event: MouseEvent) => void): void;
  getBoundingBox(): { top: number, left: number, width: number, height: number };
}

interface EventListenerTarget {
  addEventListener(type: 'mousemove', listener: (event: MouseEvent) => void): void;
  addEventListener(type: 'touchstart' | 'touchmove', listener: (event: TouchEvent) => void): void;
  removeEventListener(type: 'mousemove', listener: (event: MouseEvent) => void): void;
  removeEventListener(type: 'touchstart' | 'touchmove', listener: (event: TouchEvent) => void): void;
}

function createEventTarget(target: EventListenerTarget) {
  return {
    subscribeMouse(subscriber: (event: MouseEvent) => void) {
      target.addEventListener('mousemove', subscriber);
    },
    unsubscribeMouse(subscriber: (event: MouseEvent) => void) {
      target.removeEventListener('mousemove', subscriber);
    },
    subscribeTouch(subscriber: (event: TouchEvent) => void) {
      target.addEventListener('touchstart', subscriber);
      target.addEventListener('touchmove', subscriber);
    },
    unsubscribeTouch(subscriber: (event: TouchEvent) => void) {
      target.removeEventListener('touchstart', subscriber);
      target.removeEventListener('touchmove', subscriber);
    },
  }
}

function createElementContainer(element: HTMLElement): Container {
  return {
    ...createEventTarget(element),
    getBoundingBox() {
      return element.getBoundingClientRect()
    },
  }
}

function createWindowContainer(): Container {
  return {
    ...createEventTarget(window),
    getBoundingBox() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        top: 0,
        left: 0,
      }
    },
  }
}

/**
 * Keep track of the position of the users mouse within an element.
 * Ideally you should only have one instance of this class.
 * 
 * Subscribe to the position: 
 * ```ts
 * const tracker = new MousePositionTracker(0.5, 0.5, element);
 * 
 * tracker.subscribe((x, y) => {
 *   console.log(x, y);
 * });
 * ```
 * 
 * Get the position in a render loop:
 * ```ts
 * const tracker = new MousePositionTracker(0.5, 0.5, element);
 * 
 * renderLoop(() => {
 *   console.log(tracker.x, tracker.y);
 * });
 * ```
 */
class MousePositionTracker {
  public x: number;
  public y: number;
  private container: Container;
  private subscribers: Set<Subscriber>;

  constructor(x: number = 0.5, y: number = 0.5, element?: HTMLElement) {
    this.x = x;
    this.y = y;
    this.container = element ? createElementContainer(element) : createWindowContainer();
    this.subscribers = new Set();

    this.container.subscribeMouse(this.handleMouseMove);
    this.container.subscribeTouch(this.handleTouch);
  }

  public destroy(): void {
    this.container.unsubscribeMouse(this.handleMouseMove);
    this.container.unsubscribeTouch(this.handleTouch);
    this.subscribers.clear();
  }


  /**
   * Recieve events when the mouse position has changed.
   * Worth just using the .x and .y properties in a render loop if possible.
   * 
   * Call the returned function to stop receiving updates.
   */
  public subscribe(subscriber: Subscriber): Function {
    this.subscribers.add(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  public unsubscribe(subscriber: Subscriber): void {
    this.subscribers.delete(subscriber);
  }

  private handleMouseMove = (event: MouseEvent): void => {
    const { left, top, width, height } = this.container.getBoundingBox();

    this.x = clamp((event.clientX - left) / width, 0, 1);
    this.y = clamp((event.clientY - top) / height, 0, 1);

    this.notifySubscribers();
  }

  private handleTouch = (event: TouchEvent): void =>  {
    const touch = event.touches[0] || event.changedTouches[0];
    const { left, top, width, height } = this.container.getBoundingBox();

    this.x = clamp((touch.clientX - left) / width, 0, 1);
    this.y = clamp((touch.clientY - top) / height, 0, 1);

    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    for(const subscriber of this.subscribers) {
      subscriber(this.x, this.y);
    }
  }
}

export default MousePositionTracker