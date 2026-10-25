/**
 * 2D vector
 *
 * @example
 * ```ts
 * import Vec2, * as vec2 from "@fishley/wwwgraphics/math/vec2";
 *
 * const v = vec2.add(vec2.zero(), new Vec2(1, 2));
 * ```
 *
 * @module
 */

import type Mat2 from "../matricies/Mat2";
import type Mat3 from "../matricies/Mat3";
import type Mat4 from "../matricies/Mat4";

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
}

/**
 * Create a 0 vector
 */
export function zero(): Vec2 {
  return new Vec2(0, 0);
}


/**
 * Create a new vector from an existing vector.
 *
 * @param vector the vector to clone
 */
export function from(vector: IVec2): Vec2 {
  return new Vec2(vector.x, vector.y);
}

/**
 * Create a new vector from an array.
 *
 * @param array the array to create a vector from
 */
export function fromArray(array: number[]): Vec2 {
  return new Vec2(array[0] ?? 0, array[1] ?? 0);
}

/**
 * Get the direction between two vectors, as a new vector.
 *
 * @param vector the vector to get the direction from
 * @param other the vector to get the direction towards
 */
export function direction(vector: IVec2, other: IVec2): Vec2 {
  return normalize(subtract(from(other), vector));
}

/**
 * Get the absolute distance between two vectors.
 *
 * @param vector the first vector
 * @param other the vector to get the distance to
 */
export function distance(vector: IVec2, other: IVec2): number {
  const dx = vector.x - other.x,
    dy = vector.y - other.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Add a vector to a vector, mutating it.
 *
 * @param vector the vector to add to
 * @param other the vector to add
 */
export function add<T extends IVec2>(vector: T, other: IVec2): T {
  vector.x += other.x;
  vector.y += other.y;
  return vector;
}

/**
 * Subtract a vector from a vector, mutating it.
 *
 * @param vector the vector to subtract from
 * @param other the vector to subtract
 */
export function subtract<T extends IVec2>(vector: T, other: IVec2): T {
  vector.x -= other.x;
  vector.y -= other.y;
  return vector;
}

/**
 * Divide a vector by another vector, mutating it.
 *
 * @param vector the vector to divide
 * @param other the vector to divide by
 */
export function divide<T extends IVec2>(vector: T, other: IVec2): T {
  vector.x /= other.x;
  vector.y /= other.y;
  return vector;
}

/**
 * Divide a vector by a scalar, mutating it.
 *
 * @param vector the vector to divide
 * @param scalar the scalar to divide by
 */
export function divideScalar<T extends IVec2>(vector: T, scalar: number): T {
  vector.x /= scalar;
  vector.y /= scalar;
  return vector;
}

/**
 * Multiply a vector by another vector, mutating it.
 *
 * @param vector the vector to multiply
 * @param other the vector to multiply by
 */
export function multiply<T extends IVec2>(vector: T, other: IVec2): T {
  vector.x *= other.x;
  vector.y *= other.y;
  return vector;
}

/**
 * Multiply a vector by a scalar, mutating it.
 *
 * @param vector the vector to multiply
 * @param scalar the scalar to multiply by
 */
export function multiplyScalar<T extends IVec2>(vector: T, scalar: number): T {
  vector.x *= scalar;
  vector.y *= scalar;
  return vector;
}

/**
 * Normalize a vector, mutating it.
 *
 * @param vector the vector to normalize
 */
export function normalize<T extends IVec2>(vector: T): T {
  const x = vector.x,
    y = vector.y,
    lenSq = x * x + y * y;

  if (lenSq > 0) {
    const inv = 1 / Math.sqrt(lenSq);
    vector.x = x * inv;
    vector.y = y * inv;
  } else {
    vector.x = 1;
    vector.y = 0;
  }
  return vector;
}

/**
 * Get the magnitude of a vector.
 *
 * @param vector the vector to get the magnitude of
 */
export function magnitude(vector: IVec2): number {
  const x = vector.x,
    y = vector.y;

  return Math.sqrt(x * x + y * y);
}

/**
 * Get the dot product of two vectors.
 *
 * @param vector the first vector
 * @param other the vector to get the dot product with
 */
export function dot(vector: IVec2, other: IVec2): number {
  return vector.x * other.x + vector.y * other.y;
}

/**
 * Get the cross product of two vectors.
 *
 * @param vector the first vector
 * @param other the vector to get the cross product with
 */
export function cross(vector: IVec2, other: IVec2): number {
  return vector.x * other.y - vector.y * other.x;
}

/**
 * Rotate a vector by a given angle, mutating it.
 *
 * @param vector the vector to rotate
 * @param angle the angle to rotate by, in radians
 */
export function rotate<T extends IVec2>(vector: T, angle: number): T {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const newX = vector.x * cos - vector.y * sin;
  const newY = vector.x * sin + vector.y * cos;

  vector.x = newX;
  vector.y = newY;

  return vector;
}

/**
 * Transform a vector by a mat2 (2D affine matrix), mutating it.
 *
 * @param vector the vector to transform
 * @param m the matrix to transform by
 */
export function transformMat2<T extends IVec2>(vector: T, m: Mat2): T {
  const x = vector.x,
    y = vector.y;

  vector.x = m[0] * x + m[2] * y + m[4];
  vector.y = m[1] * x + m[3] * y + m[5];
  return vector;
}

/**
 * Transform a vector by a mat3 (treated as a point, z = 1), mutating it.
 *
 * @param vector the vector to transform
 * @param m the matrix to transform by
 */
export function transformMat3<T extends IVec2>(vector: T, m: Mat3): T {
  const x = vector.x,
    y = vector.y;

  vector.x = m[0] * x + m[3] * y + m[6];
  vector.y = m[1] * x + m[4] * y + m[7];
  return vector;
}

/**
 * Transform a vector by a mat4 (treated as a point, z = 0, w = 1), mutating it.
 *
 * @param vector the vector to transform
 * @param m the matrix to transform by
 */
export function transformMat4<T extends IVec2>(vector: T, m: Mat4): T {
  const x = vector.x,
    y = vector.y;

  vector.x = m[0] * x + m[4] * y + m[12];
  vector.y = m[1] * x + m[5] * y + m[13];
  return vector;
}

export default Vec2;
