/**
 * 4x4 matrix
 *
 * @example
 * ```ts
 * import Mat4, * as mat4 from "@fishley/wwwgraphics/math/mat4";
 *
 * const m = new Mat4();
 * mat4.rotateY(m, Math.PI / 2);
 * ```
 *
 * @module
 */

import type { IVec3 } from "../vectors/Vec3";

/**
 * A 4x4 matrix, stored column-major as `[m00, m01, m02, m03, m10, ..., m33]`.
 */
class Mat4 extends Float32Array {
  constructor(
    m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 1, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 1, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 1,
  ) {
    super(16);
    this[0] = m00;
    this[1] = m01;
    this[2] = m02;
    this[3] = m03;
    this[4] = m10;
    this[5] = m11;
    this[6] = m12;
    this[7] = m13;
    this[8] = m20;
    this[9] = m21;
    this[10] = m22;
    this[11] = m23;
    this[12] = m30;
    this[13] = m31;
    this[14] = m32;
    this[15] = m33;
  }
}

/**
 * Copy the values of o into s
 */
export function copy(s: Mat4, o: Mat4): Mat4 {
  s[0] = o[0];
  s[1] = o[1];
  s[2] = o[2];
  s[3] = o[3];
  s[4] = o[4];
  s[5] = o[5];
  s[6] = o[6];
  s[7] = o[7];
  s[8] = o[8];
  s[9] = o[9];
  s[10] = o[10];
  s[11] = o[11];
  s[12] = o[12];
  s[13] = o[13];
  s[14] = o[14];
  s[15] = o[15];
  return s;
}

/**
 * Set the components of a mat4 to the given values
 */
export function set(
  s: Mat4,
  m00: number, m01: number, m02: number, m03: number,
  m10: number, m11: number, m12: number, m13: number,
  m20: number, m21: number, m22: number, m23: number,
  m30: number, m31: number, m32: number, m33: number,
): Mat4 {
  s[0] = m00;
  s[1] = m01;
  s[2] = m02;
  s[3] = m03;
  s[4] = m10;
  s[5] = m11;
  s[6] = m12;
  s[7] = m13;
  s[8] = m20;
  s[9] = m21;
  s[10] = m22;
  s[11] = m23;
  s[12] = m30;
  s[13] = m31;
  s[14] = m32;
  s[15] = m33;
  return s;
}

/**
 * Set a mat4 to the identity matrix
 */
export function identity(s: Mat4): Mat4 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 0;
  s[5] = 1;
  s[6] = 0;
  s[7] = 0;
  s[8] = 0;
  s[9] = 0;
  s[10] = 1;
  s[11] = 0;
  s[12] = 0;
  s[13] = 0;
  s[14] = 0;
  s[15] = 1;
  return s;
}

/**
 * Transpose the values of a mat4
 */
export function transpose(s: Mat4): Mat4 {
  let s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s23 = s[11],
    s30 = s[12],
    s31 = s[13],
    s32 = s[14];

  s[1] = s10;
  s[2] = s20;
  s[3] = s30;
  s[4] = s01;
  s[6] = s21;
  s[7] = s31;
  s[8] = s02;
  s[9] = s12;
  s[11] = s32;
  s[12] = s03;
  s[13] = s13;
  s[14] = s23;
  return s;
}

/**
 * Inverts a mat4
 */
export function invert(s: Mat4): Mat4 | null {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    s30 = s[12],
    s31 = s[13],
    s32 = s[14],
    s33 = s[15];

  let b00 = s00 * s11 - s01 * s10,
    b01 = s00 * s12 - s02 * s10,
    b02 = s00 * s13 - s03 * s10,
    b03 = s01 * s12 - s02 * s11,
    b04 = s01 * s13 - s03 * s11,
    b05 = s02 * s13 - s03 * s12,
    b06 = s20 * s31 - s21 * s30,
    b07 = s20 * s32 - s22 * s30,
    b08 = s20 * s33 - s23 * s30,
    b09 = s21 * s32 - s22 * s31,
    b10 = s21 * s33 - s23 * s31,
    b11 = s22 * s33 - s23 * s32;

  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1.0 / det;

  s[0] = (s11 * b11 - s12 * b10 + s13 * b09) * det;
  s[1] = (s02 * b10 - s01 * b11 - s03 * b09) * det;
  s[2] = (s31 * b05 - s32 * b04 + s33 * b03) * det;
  s[3] = (s22 * b04 - s21 * b05 - s23 * b03) * det;
  s[4] = (s12 * b08 - s10 * b11 - s13 * b07) * det;
  s[5] = (s00 * b11 - s02 * b08 + s03 * b07) * det;
  s[6] = (s32 * b02 - s30 * b05 - s33 * b01) * det;
  s[7] = (s20 * b05 - s22 * b02 + s23 * b01) * det;
  s[8] = (s10 * b10 - s11 * b08 + s13 * b06) * det;
  s[9] = (s01 * b08 - s00 * b10 - s03 * b06) * det;
  s[10] = (s30 * b04 - s31 * b02 + s33 * b00) * det;
  s[11] = (s21 * b02 - s20 * b04 - s23 * b00) * det;
  s[12] = (s11 * b07 - s10 * b09 - s12 * b06) * det;
  s[13] = (s00 * b09 - s01 * b07 + s02 * b06) * det;
  s[14] = (s31 * b01 - s30 * b03 - s32 * b00) * det;
  s[15] = (s20 * b03 - s21 * b01 + s22 * b00) * det;
  return s;
}

/**
 * Calculates the determinant of a mat4
 */
export function determinant(s: Mat4): number {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    s30 = s[12],
    s31 = s[13],
    s32 = s[14],
    s33 = s[15];

  let b00 = s00 * s11 - s01 * s10,
    b01 = s00 * s12 - s02 * s10,
    b02 = s00 * s13 - s03 * s10,
    b03 = s01 * s12 - s02 * s11,
    b04 = s01 * s13 - s03 * s11,
    b05 = s02 * s13 - s03 * s12,
    b06 = s20 * s31 - s21 * s30,
    b07 = s20 * s32 - s22 * s30,
    b08 = s20 * s33 - s23 * s30,
    b09 = s21 * s32 - s22 * s31,
    b10 = s21 * s33 - s23 * s31,
    b11 = s22 * s33 - s23 * s32;

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiply s by o
 */
export function multiply(s: Mat4, o: Mat4): Mat4 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    s30 = s[12],
    s31 = s[13],
    s32 = s[14],
    s33 = s[15];

  let o00 = o[0],
    o01 = o[1],
    o02 = o[2],
    o03 = o[3],
    o10 = o[4],
    o11 = o[5],
    o12 = o[6],
    o13 = o[7],
    o20 = o[8],
    o21 = o[9],
    o22 = o[10],
    o23 = o[11],
    o30 = o[12],
    o31 = o[13],
    o32 = o[14],
    o33 = o[15];

  s[0] = o00 * s00 + o01 * s10 + o02 * s20 + o03 * s30;
  s[1] = o00 * s01 + o01 * s11 + o02 * s21 + o03 * s31;
  s[2] = o00 * s02 + o01 * s12 + o02 * s22 + o03 * s32;
  s[3] = o00 * s03 + o01 * s13 + o02 * s23 + o03 * s33;
  s[4] = o10 * s00 + o11 * s10 + o12 * s20 + o13 * s30;
  s[5] = o10 * s01 + o11 * s11 + o12 * s21 + o13 * s31;
  s[6] = o10 * s02 + o11 * s12 + o12 * s22 + o13 * s32;
  s[7] = o10 * s03 + o11 * s13 + o12 * s23 + o13 * s33;
  s[8] = o20 * s00 + o21 * s10 + o22 * s20 + o23 * s30;
  s[9] = o20 * s01 + o21 * s11 + o22 * s21 + o23 * s31;
  s[10] = o20 * s02 + o21 * s12 + o22 * s22 + o23 * s32;
  s[11] = o20 * s03 + o21 * s13 + o22 * s23 + o23 * s33;
  s[12] = o30 * s00 + o31 * s10 + o32 * s20 + o33 * s30;
  s[13] = o30 * s01 + o31 * s11 + o32 * s21 + o33 * s31;
  s[14] = o30 * s02 + o31 * s12 + o32 * s22 + o33 * s32;
  s[15] = o30 * s03 + o31 * s13 + o32 * s23 + o33 * s33;
  return s;
}

/**
 * Translate a mat4 by the given vector
 */
export function translate(s: Mat4, v: IVec3): Mat4 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    s30 = s[12],
    s31 = s[13],
    s32 = s[14],
    s33 = s[15],
    x = v.x,
    y = v.y,
    z = v.z;

  s[12] = s00 * x + s10 * y + s20 * z + s30;
  s[13] = s01 * x + s11 * y + s21 * z + s31;
  s[14] = s02 * x + s12 * y + s22 * z + s32;
  s[15] = s03 * x + s13 * y + s23 * z + s33;
  return s;
}

/**
 * Rotates a mat4 by the given angle (in radians) around the given axis.
 * Returns null if the axis has no length.
 */
export function rotate(s: Mat4, rad: number, axis: IVec3): Mat4 | null {
  let x = axis.x,
    y = axis.y,
    z = axis.z,
    len = Math.sqrt(x * x + y * y + z * z);

  if (!len) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  let sin = Math.sin(rad),
    cos = Math.cos(rad),
    t = 1 - cos;

  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11];

  let b00 = x * x * t + cos,
    b01 = y * x * t + z * sin,
    b02 = z * x * t - y * sin,
    b10 = x * y * t - z * sin,
    b11 = y * y * t + cos,
    b12 = z * y * t + x * sin,
    b20 = x * z * t + y * sin,
    b21 = y * z * t - x * sin,
    b22 = z * z * t + cos;

  s[0] = s00 * b00 + s10 * b01 + s20 * b02;
  s[1] = s01 * b00 + s11 * b01 + s21 * b02;
  s[2] = s02 * b00 + s12 * b01 + s22 * b02;
  s[3] = s03 * b00 + s13 * b01 + s23 * b02;
  s[4] = s00 * b10 + s10 * b11 + s20 * b12;
  s[5] = s01 * b10 + s11 * b11 + s21 * b12;
  s[6] = s02 * b10 + s12 * b11 + s22 * b12;
  s[7] = s03 * b10 + s13 * b11 + s23 * b12;
  s[8] = s00 * b20 + s10 * b21 + s20 * b22;
  s[9] = s01 * b20 + s11 * b21 + s21 * b22;
  s[10] = s02 * b20 + s12 * b21 + s22 * b22;
  s[11] = s03 * b20 + s13 * b21 + s23 * b22;
  return s;
}

/**
 * Rotates a mat4 by the given angle (in radians) around the X axis
 */
export function rotateX(s: Mat4, rad: number): Mat4 {
  let s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    sin = Math.sin(rad),
    cos = Math.cos(rad);

  s[4] = s10 * cos + s20 * sin;
  s[5] = s11 * cos + s21 * sin;
  s[6] = s12 * cos + s22 * sin;
  s[7] = s13 * cos + s23 * sin;
  s[8] = s20 * cos - s10 * sin;
  s[9] = s21 * cos - s11 * sin;
  s[10] = s22 * cos - s12 * sin;
  s[11] = s23 * cos - s13 * sin;
  return s;
}

/**
 * Rotates a mat4 by the given angle (in radians) around the Y axis
 */
export function rotateY(s: Mat4, rad: number): Mat4 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s20 = s[8],
    s21 = s[9],
    s22 = s[10],
    s23 = s[11],
    sin = Math.sin(rad),
    cos = Math.cos(rad);

  s[0] = s00 * cos - s20 * sin;
  s[1] = s01 * cos - s21 * sin;
  s[2] = s02 * cos - s22 * sin;
  s[3] = s03 * cos - s23 * sin;
  s[8] = s00 * sin + s20 * cos;
  s[9] = s01 * sin + s21 * cos;
  s[10] = s02 * sin + s22 * cos;
  s[11] = s03 * sin + s23 * cos;
  return s;
}

/**
 * Rotates a mat4 by the given angle (in radians) around the Z axis
 */
export function rotateZ(s: Mat4, rad: number): Mat4 {
  let s00 = s[0],
    s01 = s[1],
    s02 = s[2],
    s03 = s[3],
    s10 = s[4],
    s11 = s[5],
    s12 = s[6],
    s13 = s[7],
    sin = Math.sin(rad),
    cos = Math.cos(rad);

  s[0] = s00 * cos + s10 * sin;
  s[1] = s01 * cos + s11 * sin;
  s[2] = s02 * cos + s12 * sin;
  s[3] = s03 * cos + s13 * sin;
  s[4] = s10 * cos - s00 * sin;
  s[5] = s11 * cos - s01 * sin;
  s[6] = s12 * cos - s02 * sin;
  s[7] = s13 * cos - s03 * sin;
  return s;
}

/**
 * Scales the mat4 by the dimensions in the given vec3
 */
export function scale(s: Mat4, v: IVec3): Mat4 {
  let x = v.x,
    y = v.y,
    z = v.z;

  s[0] *= x;
  s[1] *= x;
  s[2] *= x;
  s[3] *= x;
  s[4] *= y;
  s[5] *= y;
  s[6] *= y;
  s[7] *= y;
  s[8] *= z;
  s[9] *= z;
  s[10] *= z;
  s[11] *= z;
  return s;
}

/**
 * Create a orthographic projection matrix
 */
export function orthographic(
  s: Mat4,
  width: number,
  height: number,
  viewSize: number = 2,
  near: number = -1,
  far: number = 1,
): Mat4 {
  const aspect = width / height;

  const zoomX = 2 / (viewSize * aspect);
  const zoomY = 2 / viewSize;
  const nf = 1 / (near - far);

  s[0] = zoomX;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 0;
  s[5] = zoomY;
  s[6] = 0;
  s[7] = 0;
  s[8] = 0;
  s[9] = 0;
  s[10] = 2 * nf;
  s[11] = 0;
  s[12] = 0;
  s[13] = 0;
  s[14] = (far + near) * nf;
  s[15] = 1;

  return s;
}

/**
 * Create a perspective projection matrix.
 * Pass `Infinity` as `far` for an infinite projection.
 *
 * @param fovy vertical field of view (in radians)
 */
export function perspective(
  s: Mat4,
  width: number,
  height: number,
  fovy: number,
  near: number = 0.1,
  far: number = Infinity,
): Mat4 {
  const aspect = width / height;
  const f = 1 / Math.tan(fovy / 2);

  s[0] = f / aspect;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 0;
  s[5] = f;
  s[6] = 0;
  s[7] = 0;
  s[8] = 0;
  s[9] = 0;
  s[11] = -1;
  s[12] = 0;
  s[13] = 0;
  s[15] = 0;

  if (far !== Infinity) {
    const nf = 1 / (near - far);
    s[10] = (far + near) * nf;
    s[14] = 2 * far * near * nf;
  } else {
    s[10] = -1;
    s[14] = -2 * near;
  }

  return s;
}

/**
 * Add o to s
 */
export function add(s: Mat4, o: Mat4): Mat4 {
  s[0] += o[0];
  s[1] += o[1];
  s[2] += o[2];
  s[3] += o[3];
  s[4] += o[4];
  s[5] += o[5];
  s[6] += o[6];
  s[7] += o[7];
  s[8] += o[8];
  s[9] += o[9];
  s[10] += o[10];
  s[11] += o[11];
  s[12] += o[12];
  s[13] += o[13];
  s[14] += o[14];
  s[15] += o[15];
  return s;
}

/**
 * Subtract o from s
 */
export function subtract(s: Mat4, o: Mat4): Mat4 {
  s[0] -= o[0];
  s[1] -= o[1];
  s[2] -= o[2];
  s[3] -= o[3];
  s[4] -= o[4];
  s[5] -= o[5];
  s[6] -= o[6];
  s[7] -= o[7];
  s[8] -= o[8];
  s[9] -= o[9];
  s[10] -= o[10];
  s[11] -= o[11];
  s[12] -= o[12];
  s[13] -= o[13];
  s[14] -= o[14];
  s[15] -= o[15];
  return s;
}

/**
 * Multiply each element of the matrix by a scalar.
 */
export function multiplyScalar(s: Mat4, scalar: number): Mat4 {
  s[0] *= scalar;
  s[1] *= scalar;
  s[2] *= scalar;
  s[3] *= scalar;
  s[4] *= scalar;
  s[5] *= scalar;
  s[6] *= scalar;
  s[7] *= scalar;
  s[8] *= scalar;
  s[9] *= scalar;
  s[10] *= scalar;
  s[11] *= scalar;
  s[12] *= scalar;
  s[13] *= scalar;
  s[14] *= scalar;
  s[15] *= scalar;
  return s;
}

/**
 * Create a translation mat4 from a vector
 */
export function fromTranslation(s: Mat4, v: IVec3): Mat4 {
  s[0] = 1;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 0;
  s[5] = 1;
  s[6] = 0;
  s[7] = 0;
  s[8] = 0;
  s[9] = 0;
  s[10] = 1;
  s[11] = 0;
  s[12] = v.x;
  s[13] = v.y;
  s[14] = v.z;
  s[15] = 1;
  return s;
}

/**
 * Create a scaling mat4 from a vector
 */
export function fromScaling(s: Mat4, v: IVec3): Mat4 {
  s[0] = v.x;
  s[1] = 0;
  s[2] = 0;
  s[3] = 0;
  s[4] = 0;
  s[5] = v.y;
  s[6] = 0;
  s[7] = 0;
  s[8] = 0;
  s[9] = 0;
  s[10] = v.z;
  s[11] = 0;
  s[12] = 0;
  s[13] = 0;
  s[14] = 0;
  s[15] = 1;
  return s;
}

/**
 * Set s to the translation component of o
 */
export function getTranslation<T extends IVec3>(s: T, o: Mat4): T {
  s.x = o[12];
  s.y = o[13];
  s.z = o[14];
  return s;
}

/**
 * Set s to the scaling component of o
 */
export function getScaling<T extends IVec3>(s: T, o: Mat4): T {
  let o00 = o[0],
    o01 = o[1],
    o02 = o[2],
    o10 = o[4],
    o11 = o[5],
    o12 = o[6],
    o20 = o[8],
    o21 = o[9],
    o22 = o[10];

  s.x = Math.sqrt(o00 * o00 + o01 * o01 + o02 * o02);
  s.y = Math.sqrt(o10 * o10 + o11 * o11 + o12 * o12);
  s.z = Math.sqrt(o20 * o20 + o21 * o21 + o22 * o22);
  return s;
}

export default Mat4;
