/**
 * 3D vector
 *
 * @example
 * ```ts
 * import Vec3, * as vec3 from "@fishley/wwwgraphics/math/vec3";
 *
 * const v = vec3.add(vec3.zero(), new Vec3(1, 2, 3));
 * ```
 *
 * @module
 */

import type Mat3 from "../matricies/Mat3";
import type Mat4 from "../matricies/Mat4";

export interface IVec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * A 3D vector.
 */
class Vec3 implements IVec3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

/**
 * Create a 0 vector
 */
export function zero(): Vec3 {
  return new Vec3(0, 0, 0);
}

/**
 * Create a new vector from an existing vector.
 *
 * @param vector the vector to clone
 */
export function from(vector: IVec3): Vec3 {
  return new Vec3(vector.x, vector.y, vector.z);
}

/**
 * Create a new vector from an array.
 *
 * @param array the array to create a vector from
 */
export function fromArray(array: number[]): Vec3 {
  return new Vec3(array[0] ?? 0, array[1] ?? 0, array[2] ?? 0);
}

/**
 * Get the direction between two vectors, as a new vector.
 *
 * @param vector the vector to get the direction from
 * @param other the vector to get the direction towards
 */
export function direction(vector: IVec3, other: IVec3): Vec3 {
  return normalize(subtract(from(other), vector));
}

/**
 * Get the absolute distance between two vectors.
 *
 * @param vector the first vector
 * @param other the vector to get the distance to
 */
export function distance(vector: IVec3, other: IVec3): number {
  const dx = vector.x - other.x,
    dy = vector.y - other.y,
    dz = vector.z - other.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Add a vector to a vector, mutating it.
 *
 * @param vector the vector to add to
 * @param other the vector to add
 */
export function add<T extends IVec3>(vector: T, other: IVec3): T {
  vector.x += other.x;
  vector.y += other.y;
  vector.z += other.z;
  return vector;
}

/**
 * Subtract a vector from a vector, mutating it.
 *
 * @param vector the vector to subtract from
 * @param other the vector to subtract
 */
export function subtract<T extends IVec3>(vector: T, other: IVec3): T {
  vector.x -= other.x;
  vector.y -= other.y;
  vector.z -= other.z;
  return vector;
}

/**
 * Divide a vector by another vector, mutating it.
 *
 * @param vector the vector to divide
 * @param other the vector to divide by
 */
export function divide<T extends IVec3>(vector: T, other: IVec3): T {
  vector.x /= other.x;
  vector.y /= other.y;
  vector.z /= other.z;
  return vector;
}

/**
 * Divide a vector by a scalar, mutating it.
 *
 * @param vector the vector to divide
 * @param scalar the scalar to divide by
 */
export function divideScalar<T extends IVec3>(vector: T, scalar: number): T {
  vector.x /= scalar;
  vector.y /= scalar;
  vector.z /= scalar;
  return vector;
}

/**
 * Multiply a vector by another vector, mutating it.
 *
 * @param vector the vector to multiply
 * @param other the vector to multiply by
 */
export function multiply<T extends IVec3>(vector: T, other: IVec3): T {
  vector.x *= other.x;
  vector.y *= other.y;
  vector.z *= other.z;
  return vector;
}

/**
 * Multiply a vector by a scalar, mutating it.
 *
 * @param vector the vector to multiply
 * @param scalar the scalar to multiply by
 */
export function multiplyScalar<T extends IVec3>(vector: T, scalar: number): T {
  vector.x *= scalar;
  vector.y *= scalar;
  vector.z *= scalar;
  return vector;
}

/**
 * Normalize a vector, mutating it.
 *
 * @param vector the vector to normalize
 */
export function normalize<T extends IVec3>(vector: T): T {
  const x = vector.x,
    y = vector.y,
    z = vector.z,
    lenSq = x * x + y * y + z * z;

  if (lenSq > 0) {
    const inv = 1 / Math.sqrt(lenSq);
    vector.x = x * inv;
    vector.y = y * inv;
    vector.z = z * inv;
  } else {
    vector.x = 1;
    vector.y = 0;
    vector.z = 0;
  }
  return vector;
}

/**
 * Get the magnitude of a vector.
 *
 * @param vector the vector to get the magnitude of
 */
export function magnitude(vector: IVec3): number {
  const x = vector.x,
    y = vector.y,
    z = vector.z;

  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Get the dot product of two vectors.
 *
 * @param vector the first vector
 * @param other the vector to get the dot product with
 */
export function dot(vector: IVec3, other: IVec3): number {
  return vector.x * other.x + vector.y * other.y + vector.z * other.z;
}

/**
 * Set a vector to the cross product of itself and another vector, mutating it.
 *
 * @param vector the first vector
 * @param other the vector to get the cross product with
 */
export function cross<T extends IVec3>(vector: T, other: IVec3): T {
  const ax = vector.x,
    ay = vector.y,
    az = vector.z;

  vector.x = ay * other.z - az * other.y;
  vector.y = az * other.x - ax * other.z;
  vector.z = ax * other.y - ay * other.x;
  return vector;
}

/**
 * Transform a vector by a mat3, mutating it.
 *
 * @param vector the vector to transform
 * @param m the matrix to transform by
 */
export function transformMat3<T extends IVec3>(vector: T, m: Mat3): T {
  const x = vector.x,
    y = vector.y,
    z = vector.z;

  vector.x = m[0] * x + m[3] * y + m[6] * z;
  vector.y = m[1] * x + m[4] * y + m[7] * z;
  vector.z = m[2] * x + m[5] * y + m[8] * z;
  return vector;
}

/**
 * Transform a vector by a mat4 (treated as a point, w = 1), mutating it.
 * The result is divided by w, so projection matrices work as expected.
 *
 * @param vector the vector to transform
 * @param m the matrix to transform by
 */
export function transformMat4<T extends IVec3>(vector: T, m: Mat4): T {
  const x = vector.x,
    y = vector.y,
    z = vector.z;
  const invW = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15] || 1.0);

  vector.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * invW;
  vector.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * invW;
  vector.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * invW;
  return vector;
}

export default Vec3;
