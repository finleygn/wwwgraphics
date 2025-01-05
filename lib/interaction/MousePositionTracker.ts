type Subscriber = (x: number, y: number) => void;

export interface EventEmitter {
  addEventListener(type: "mousemove", listener: (event: MouseEvent) => void): void;
  addEventListener(type: "touchmove", listener: (event: TouchEvent) => void): void;
  addEventListener(type: "touchstart", listener: (event: TouchEvent) => void): void;
  removeEventListener(type: "mousemove", listener: Function): void;
  removeEventListener(type: "touchmove", listener: Function): void;
  removeEventListener(type: "touchstart", listener: Function): void;
  getBoundingClientRect(): DOMRect;
}

function createWindowAdapter(): EventEmitter {
  return {
    addEventListener: window.addEventListener,
    removeEventListener: window.removeEventListener,
    getBoundingClientRect: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
      bottom: 0,
      right: 0,
      top: 0,
      left: 0,
      x: 0,
      y: 0,
      toJSON() {
        throw new Error("Unsupported")
      }
    })
  }
}

/**
 * Keep track of the position of the users mouse within an element.
 */
class MousePositionTracker {
  public x: number;
  public y: number;
  public element: EventEmitter;
  public subscribers: Set<Subscriber>;

  constructor(element: EventEmitter = createWindowAdapter(), x: number = 0.5, y: number = 0.5) {
    this.x = x;
    this.y = y;
    this.element = element;
    this.subscribers = new Set();

    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('touchmove', this.handleTouch);
    this.element.addEventListener('touchstart', this.handleTouch);
  }

  public destroy(): void {
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('touchmove', this.handleTouch);
    this.element.removeEventListener('touchstart', this.handleTouch);
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
    const { left, top, width, height } = this.element.getBoundingClientRect();

    this.x = (event.clientX - left) / width;
    this.y = (event.clientY - top) / height;

    this.notifySubscribers();
  }

  private handleTouch = (event: TouchEvent): void =>  {
    const touch = event.touches[0] || event.changedTouches[0];
    const { left, top, width, height } = this.element.getBoundingClientRect();

    this.x = (touch.clientX - left) / width;
    this.y = (touch.clientY - top) / height;

    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    for(const subscriber of this.subscribers) {
      subscriber(this.x, this.y);
    }
  }
}

export default MousePositionTracker