/**
 * 2x2 matrix
 *
 * @example
 * ```ts
 * import Mat2, * as mat2 from "@fishley/wwwgraphics/math/mat2";
 *
 * const m = new Mat2();
 * mat2.rotate(m, Math.PI / 2);
 * ```
 *
 * @module
 */

import type { IVec2 } from "../vectors/Vec2";

/**
 * A 2D matrix, stored as `[m00, m01, m10, m11, m20, m21]`.
 */
class Mat2 extends Float32Array {
  constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1, m20 = 0, m21 = 0) {
    super(6);
    this[0] = m00;
    this[1] = m01;
    this[2] = m10;
    this[3] = m11;
    this[4] = m20;
    this[5] = m21;
  }
}

/**
 * Copy the values of o into s
 */
export function copy(s: Mat2, o: Mat2): Mat2 {
  s[0] = o[0];
  s[1] = o[1];
  s[2] = o[2];
  s[3] = o[3];
  s[4] = o[4];
  s[5] = o[5];
  return s;
}

/**
 * Set the components of a mat2d to the given values
 */
export function set(s: Mat2, m00: number, m01: number, m10: number, m11: number, m20: number, m21: number): Mat2 {
  s[0] = m00;
  s[1] = m01;
  s[2] = m10;
  s[3] = m11;
  s[4] = m20;
  s[5] = m21;
  return s;
}

/**
 * Set a mat2d to the identity matrix
 */
export function identity(s: Mat2): Mat2 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 1;
  s[4] = 0;
  s[5] = 0;
  return s;
}

/**
 * Inverts a mat2d
 */
export function invert(s: Mat2): Mat2 | null {
  let sa = s[0],
    sb = s[1],
    sc = s[2],
    sd = s[3],
    stx = s[4],
    sty = s[5];

  let det = sa * sd - sb * sc;
  if (!det) {
    return null;
  }
  det = 1.0 / det;

  s[0] = sd * det;
  s[1] = -sb * det;
  s[2] = -sc * det;
  s[3] = sa * det;
  s[4] = (sc * sty - sd * stx) * det;
  s[5] = (sb * stx - sa * sty) * det;
  return s;
}

/**
 * Calculates the determinant of a mat2d
 */
export function determinant(s: Mat2): number {
  return s[0] * s[3] - s[1] * s[2];
}

/**
 * Multiply s by o
 */
export function multiply(s: Mat2, o: Mat2): Mat2 {
  let s00 = s[0],
    s01 = s[1],
    s10 = s[2],
    s11 = s[3],
    s20 = s[4],
    s21 = s[5];

  let o00 = o[0],
    o01 = o[1],
    o10 = o[2],
    o11 = o[3],
    o20 = o[4],
    o21 = o[5];

  s[0] = s00 * o00 + s10 * o01;
  s[1] = s01 * o00 + s11 * o01;
  s[2] = s00 * o10 + s10 * o11;
  s[3] = s01 * o10 + s11 * o11;
  s[4] = s00 * o20 + s10 * o21 + s20;
  s[5] = s01 * o20 + s11 * o21 + s21;
  return s;
}

/**
 * Translate a mat2d by the given vector
 */
export function translate(s: Mat2, v: IVec2): Mat2 {
  let s00 = s[0],
    s01 = s[1],
    s10 = s[2],
    s11 = s[3],
    s20 = s[4],
    s21 = s[5],
    x = v.x,
    y = v.y;

  s[4] = s00 * x + s10 * y + s20;
  s[5] = s01 * x + s11 * y + s21;
  return s;
}

/**
 * Rotates a mat2d by the given angle (in radians)
 */
export function rotate(s: Mat2, rad: number): Mat2 {
  let s00 = s[0],
    s01 = s[1],
    s10 = s[2],
    s11 = s[3],
    sin = Math.sin(rad),
    cos = Math.cos(rad);

  s[0] = s00 * cos + s10 * sin;
  s[1] = s01 * cos + s11 * sin;
  s[2] = s00 * -sin + s10 * cos;
  s[3] = s01 * -sin + s11 * cos;
  return s;
}

/**
 * Scales the mat2d by the dimensions in the given vec2
 */
export function scale(s: Mat2, v: IVec2): Mat2 {
  let s00 = s[0],
    s01 = s[1],
    s10 = s[2],
    s11 = s[3],
    x = v.x,
    y = v.y;

  s[0] = s00 * x;
  s[1] = s01 * x;
  s[2] = s10 * y;
  s[3] = s11 * y;
  return s;
}

/**
 * Create a orthographic projection matrix
 */
export function orthographic(s: Mat2, width: number, height: number, viewSize: number = 2): Mat2 {
  const aspect = width / height;

  const zoomX = 2 / (viewSize * aspect);
  const zoomY = 2 / viewSize;

  s[0] = zoomX;
  s[1] = 0;
  s[2] = 0;
  s[3] = zoomY;

  s[4] = 0;
  s[5] = 0;

  return s;
}

/**
 * Add o to s
 */
export function add(s: Mat2, o: Mat2): Mat2 {
  s[0] += o[0];
  s[1] += o[1];
  s[2] += o[2];
  s[3] += o[3];
  s[4] += o[4];
  s[5] += o[5];
  return s;
}

/**
 * Subtract o from s
 */
export function subtract(s: Mat2, o: Mat2): Mat2 {
  s[0] -= o[0];
  s[1] -= o[1];
  s[2] -= o[2];
  s[3] -= o[3];
  s[4] -= o[4];
  s[5] -= o[5];
  return s;
}

/**
 * Multiply each element of the matrix by a scalar.
 */
export function multiplyScalar(s: Mat2, scalar: number): Mat2 {
  s[0] *= scalar;
  s[1] *= scalar;
  s[2] *= scalar;
  s[3] *= scalar;
  s[4] *= scalar;
  s[5] *= scalar;
  return s;
}

/**
 * Create a translation mat2d from a vector
 */
export function fromTranslation(s: Mat2, v: IVec2): Mat2 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 1;
  s[4] = v.x;
  s[5] = v.y;
  return s;
}

/**
 * Create a scaling mat2d from a vector
 */
export function fromScaling(s: Mat2, v: IVec2): Mat2 {
  s[0] = v.x;
  s[1] = 0;
  s[2] = 0;
  s[3] = v.y;
  s[4] = 0;
  s[5] = 0;
  return s;
}

/**
 * Set s to the translation component of o
 */
export function getTranslation<T extends IVec2>(s: T, o: Mat2): T {
  s.x = o[4];
  s.y = o[5];
  return s;
}

/**
 * Set s to the scaling component of o
 */
export function getScaling<T extends IVec2>(s: T, o: Mat2): T {
  let o00 = o[0],
    o01 = o[1],
    o10 = o[2],
    o11 = o[3];

  s.x = Math.sqrt(o00 * o00 + o01 * o01);
  s.y = Math.sqrt(o10 * o10 + o11 * o11);
  return s;
}

export default Mat2;
