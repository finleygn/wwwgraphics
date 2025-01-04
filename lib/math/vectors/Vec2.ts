interface IVec2 {
  x: number;
  y: number;
}

class Vec2 implements IVec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creation
   * --
   */

  static from(vector: Vec2): Vec2 {
    return new Vec2(vector.x, vector.y);
  }

  static fromArray([x, y]: number[]): Vec2 {
    return new Vec2(x ?? 0, y ?? 0);
  }

  public clone(vector: Vec2): Vec2 {
    return Vec2.from(vector);
  }


  /**
   * Operations
   * --
   */


  public direction(other: Vec2): this {
    return this.subtract(other).normalize();
  }

  public distance(other: Vec2): number {
    return Math.abs(this.subtract(other).magnitude());
  }

  public add(other: Vec2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public subtract(other: Vec2): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public divide(other: Vec2): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public multiply(other: Vec2): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public normalize(): this {
    const mag = this.magnitude();
    if(!mag) {
      this.x = 1;
      this.y = 0;
    } else {
      this.divideScalar(mag);
    }
    return this;
  }

  public magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  public dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  public cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x;
  }

  public rotate(rad: number): this {
    this.x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    this.y =  this.x * Math.sin(rad) + this.y * Math.cos(rad);

    return this;
  }
}

export default Vec2;