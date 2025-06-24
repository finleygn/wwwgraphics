export interface IVec2 {
  x: number;
  y: number;
}

/**
 * A 2D vector.
 */
class Vec2 implements IVec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Create a new vector from an existing vector.
   * 
   * @param vector the vector to clone
   */ 
  static from(vector: IVec2): Vec2 {
    return new Vec2(vector.x, vector.y);
  }

  /**
   * Create a new vector from an array.
   * 
   * @param array the array to create a vector from
   */ 
  static fromArray([x, y]: number[]): Vec2 {
    return new Vec2(x ?? 0, y ?? 0);
  }

  /**
   * Clone this vector.
   */ 
  public clone(): Vec2 {
    return Vec2.from(this);
  }

  /**
   * Get the direction to another vector.
   * 
   * @param other the vector to get the direction towards
   */
  public direction(other: Vec2): Vec2 {
    return this.clone().subtract(other).normalize();
  }

  /**
   * Get the absolute distance between two vectors.
   * 
   * @param other the vector to get the distance to
   */
  public distance(other: Vec2): number {
    return Math.abs(this.clone().subtract(other).magnitude());
  }

  /**
   * Add a vector to this vector.
   * 
   * @param other the vector to add
   */
  public add(other: Vec2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtract a vector from this vector.
   * 
   * @param other the vector to subtract
   */
  public subtract(other: Vec2): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Divide this vector by another vector.
   * 
   * @param other the vector to divide by
   */
  public divide(other: Vec2): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  /**
   * Divide this vector by a scalar.
   * 
   * @param scalar the scalar to divide by
   */
  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * 
   * @param other the vector to multiply by
   */
  public multiply(other: Vec2): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  /**
   * Multiply this vector by a scalar.
   * 
   * @param scalar the scalar to multiply by
   */
    public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Normalize this vector.
   */
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

  /**
   * Get the magnitude of this vector.
   */
  public magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Get the dot product of this vector and another vector.
   * 
   * @param other the vector to get the dot product with
   */
  public dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Get the cross product of this vector and another vector.
   * 
   * @param other the vector to get the cross product with
   */
  public cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * Rotate this vector by a given angle.
   * 
   * @param rad the angle to rotate by
   */
  public rotate(rad: number): this {
    this.x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    this.y =  this.x * Math.sin(rad) + this.y * Math.cos(rad);

    return this;
  }
}

export default Vec2;