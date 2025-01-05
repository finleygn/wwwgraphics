/**
 * Create and compile a shader with a string source. Throwing errors upon failure.
 * 
 * ```ts
 * createShader(gl, gl.FRAGMENT_SHADER, "Some shader source");
 * ```
 */
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader.");

  gl.FRAGMENT_SHADER
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw new Error();
}

/**
 * Create and compile a program with a vertex & fragment shader. Throwing errors upon failure.
 * 
 * ```ts
 * createProgram(
 *  gl,
 *  createShader(gl, gl.VERTEX_SHADER, "Some shader source"),
 *  createShader(gl, gl.FRAGMENT_SHADER, "Some shader source")
 * );
 * ```
 */
export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program.");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  throw new Error();
}