export interface ITextGeometry {
  position: Float32Array;
  uv: Float32Array;
  index: Uint16Array;
}
export interface ITextGeometryBuilder {
  /**
   * Buffers to use for text drawing!
   */
  geometry: ITextGeometry;

  /**
   * Creates the geometry of the text from scratch, recomputing layout.
   */
  recompute(): void;
}