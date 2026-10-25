/**
 * 3x3 matrix
 *
 * @example
 * ```ts
 * import Mat3, * as mat3 from "@fishley/wwwgraphics/math/mat3";
 *
 * const m = new Mat3();
 * mat3.rotate(m, Math.PI / 2);
 * ```
 *
 * @module
 */

import type { IVec2 } from "../vectors/Vec2";

/**
 * A 3x3 matrix, stored column-major as `[m00, m01, m02, m10, m11, m12, m20, m21, m22]`.
 */
class Mat3 extends Float32Array {
  constructor(
    m00 = 1, m01 = 0, m02 = 0,
    m10 = 0, m11 = 1, m12 = 0,
    m20 = 0, m21 = 0, m22 = 1,
  ) {
    super(9);
    this[0] = m00;
    this[1] = m01;
    this[2] = m02;
    this[3] = m10;
    this[4] = m11;
    this[5] = m12;
    this[6] = m20;
    this[7] = m21;
    this[8] = m22;
  }
}

/**
 * Copy the values of o into s
 */
export function copy(s: Mat3, o: Mat3): Mat3 {
  s[0] = o[0];
  s[1] = o[1];
  s[2] = o[2];
  s[3] = o[3];
  s[4] = o[4];
  s[5] = o[5];
  s[6] = o[6];
  s[7] = o[7];
  s[8] = o[8];
  return s;
}

/**
 * Set the components of a mat3 to the given values
 */
export function set(
  s: Mat3,
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number,
): Mat3 {
  s[0] = m00;
  s[1] = m01;
  s[2] = m02;
  s[3] = m10;
  s[4] = m11;
  s[5] = m12;
  s[6] = m20;
  s[7] = m21;
  s[8] = m22;
  return s;
}

/**
 * Set a mat3 to the identity matrix
 */
export function identity(s: Mat3): Mat3 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 1;
  s[5] = 0;
  s[6] = 0;
  s[7] = 0;
  s[8] = 1;
  return s;
}

/**
 * Transpose the values of a mat3
 */
export function transpose(s: Mat3): Mat3 {
  let s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s12 = s[5],
    s20 = s[6],
    s21 = s[7];

  s[1] = s10;
  s[2] = s20;
  s[3] = s01;
  s[5] = s21;
  s[6] = s02;
  s[7] = s12;
  return s;
}

/**
 * Inverts a mat3
 */
export function invert(s: Mat3): Mat3 | null {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s11 = s[4],
    s12 = s[5],
    s20 = s[6],
    s21 = s[7],
    s22 = s[8];

  let b01 = s22 * s11 - s12 * s21,
    b11 = -s22 * s10 + s12 * s20,
    b21 = s21 * s10 - s11 * s20;

  let det = s00 * b01 + s01 * b11 + s02 * b21;
  if (!det) {
    return null;
  }
  det = 1.0 / det;

  s[0] = b01 * det;
  s[1] = (-s22 * s01 + s02 * s21) * det;
  s[2] = (s12 * s01 - s02 * s11) * det;
  s[3] = b11 * det;
  s[4] = (s22 * s00 - s02 * s20) * det;
  s[5] = (-s12 * s00 + s02 * s10) * det;
  s[6] = b21 * det;
  s[7] = (-s21 * s00 + s01 * s20) * det;
  s[8] = (s11 * s00 - s01 * s10) * det;
  return s;
}

/**
 * Calculates the determinant of a mat3
 */
export function determinant(s: Mat3): number {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s11 = s[4],
    s12 = s[5],
    s20 = s[6],
    s21 = s[7],
    s22 = s[8];

  return (
    s00 * (s22 * s11 - s12 * s21) +
    s01 * (-s22 * s10 + s12 * s20) +
    s02 * (s21 * s10 - s11 * s20)
  );
}

/**
 * Multiply s by o
 */
export function multiply(s: Mat3, o: Mat3): Mat3 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s11 = s[4],
    s12 = s[5],
    s20 = s[6],
    s21 = s[7],
    s22 = s[8];

  let o00 = o[0],
    o01 = o[1],
    o02 = o[2],
    o10 = o[3],
    o11 = o[4],
    o12 = o[5],
    o20 = o[6],
    o21 = o[7],
    o22 = o[8];

  s[0] = o00 * s00 + o01 * s10 + o02 * s20;
  s[1] = o00 * s01 + o01 * s11 + o02 * s21;
  s[2] = o00 * s02 + o01 * s12 + o02 * s22;
  s[3] = o10 * s00 + o11 * s10 + o12 * s20;
  s[4] = o10 * s01 + o11 * s11 + o12 * s21;
  s[5] = o10 * s02 + o11 * s12 + o12 * s22;
  s[6] = o20 * s00 + o21 * s10 + o22 * s20;
  s[7] = o20 * s01 + o21 * s11 + o22 * s21;
  s[8] = o20 * s02 + o21 * s12 + o22 * s22;
  return s;
}

/**
 * Translate a mat3 by the given vector
 */
export function translate(s: Mat3, v: IVec2): Mat3 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s11 = s[4],
    s12 = s[5],
    s20 = s[6],
    s21 = s[7],
    s22 = s[8],
    x = v.x,
    y = v.y;

  s[6] = x * s00 + y * s10 + s20;
  s[7] = x * s01 + y * s11 + s21;
  s[8] = x * s02 + y * s12 + s22;
  return s;
}

/**
 * Rotates a mat3 by the given angle (in radians)
 */
export function rotate(s: Mat3, rad: number): Mat3 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s10 = s[3],
    s11 = s[4],
    s12 = s[5],
    sin = Math.sin(rad),
    cos = Math.cos(rad);

  s[0] = cos * s00 + sin * s10;
  s[1] = cos * s01 + sin * s11;
  s[2] = cos * s02 + sin * s12;
  s[3] = cos * s10 - sin * s00;
  s[4] = cos * s11 - sin * s01;
  s[5] = cos * s12 - sin * s02;
  return s;
}

/**
 * Scales the mat3 by the dimensions in the given vec2
 */
export function scale(s: Mat3, v: IVec2): Mat3 {
  let x = v.x,
    y = v.y;

  s[0] = x * s[0];
  s[1] = x * s[1];
  s[2] = x * s[2];
  s[3] = y * s[3];
  s[4] = y * s[4];
  s[5] = y * s[5];
  return s;
}

/**
 * Create a orthographic projection matrix
 */
export function orthographic(s: Mat3, width: number, height: number, viewSize: number = 2): Mat3 {
  const aspect = width / height;

  const zoomX = 2 / (viewSize * aspect);
  const zoomY = 2 / viewSize;

  s[0] = zoomX;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = zoomY;
  s[5] = 0;
  s[6] = 0;
  s[7] = 0;
  s[8] = 1;

  return s;
}

/**
 * Add o to s
 */
export function add(s: Mat3, o: Mat3): Mat3 {
  s[0] += o[0];
  s[1] += o[1];
  s[2] += o[2];
  s[3] += o[3];
  s[4] += o[4];
  s[5] += o[5];
  s[6] += o[6];
  s[7] += o[7];
  s[8] += o[8];
  return s;
}

/**
 * Subtract o from s
 */
export function subtract(s: Mat3, o: Mat3): Mat3 {
  s[0] -= o[0];
  s[1] -= o[1];
  s[2] -= o[2];
  s[3] -= o[3];
  s[4] -= o[4];
  s[5] -= o[5];
  s[6] -= o[6];
  s[7] -= o[7];
  s[8] -= o[8];
  return s;
}

/**
 * Multiply each element of the matrix by a scalar.
 */
export function multiplyScalar(s: Mat3, scalar: number): Mat3 {
  s[0] *= scalar;
  s[1] *= scalar;
  s[2] *= scalar;
  s[3] *= scalar;
  s[4] *= scalar;
  s[5] *= scalar;
  s[6] *= scalar;
  s[7] *= scalar;
  s[8] *= scalar;
  return s;
}

/**
 * Create a translation mat3 from a vector
 */
export function fromTranslation(s: Mat3, v: IVec2): Mat3 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 1;
  s[5] = 0;
  s[6] = v.x;
  s[7] = v.y;
  s[8] = 1;
  return s;
}

/**
 * Create a scaling mat3 from a vector
 */
export function fromScaling(s: Mat3, v: IVec2): Mat3 {
  s[0] = v.x;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = v.y;
  s[5] = 0;
  s[6] = 0;
  s[7] = 0;
  s[8] = 1;
  return s;
}

/**
 * Set s to the translation component of o
 */
export function getTranslation<T extends IVec2>(s: T, o: Mat3): T {
  s.x = o[6];
  s.y = o[7];
  return s;
}

/**
 * Set s to the scaling component of o
 */
export function getScaling<T extends IVec2>(s: T, o: Mat3): T {
  let o00 = o[0],
    o01 = o[1],
    o10 = o[3],
    o11 = o[4];

  s.x = Math.sqrt(o00 * o00 + o01 * o01);
  s.y = Math.sqrt(o10 * o10 + o11 * o11);
  return s;
}

export default Mat3;
