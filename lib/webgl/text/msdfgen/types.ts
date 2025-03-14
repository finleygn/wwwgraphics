/**
 * Types that represent the msdf-atlas-gen JSON export.
 * @see https://github.com/Chlumsky/msdf-atlas-gen/blob/master/msdf-atlas-gen/json-export.cpp
 */

//

export enum MSDFGenYDirection {
  BOTTOM = "bottom",
  TOP = "top"
}

export enum MSDFGenImageType {
  HARD_MASK = "hardmask",
  SOFT_MASK = "softmask",
  SDF = "sdf",
  PSDF = "psdf",
  MSDF = "msdf",
  MTSDF = "mtsdf",
};

export interface MSDFGenMetaAtlasGrid {
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  originX?: number;
  originY?: number;
}

export interface MSDFGenMetaAtlas {
  type: MSDFGenImageType;
  distanceRange: number;
  distanceRangeMiddle: number;
  size: number;
  width: number;
  height: number;
  yOrigin: MSDFGenYDirection;
  grid?: MSDFGenMetaAtlasGrid;
}

export interface MSDFGenMetaMetrics {
  emSize: number;
  lineHeight: number;
  ascender: number;
  descender: number;
  underlineY: number;
  underlineThickness: number;
}

export interface MSDFGenBounds {
  left: number;
  bottom: number;
  right: number;
  top: number;
}

export interface MSDFGenMetaGlyphBase {
  advance: number,
  planeBounds?: MSDFGenBounds;
  atlasBounds?: MSDFGenBounds;
}

export interface MSDFGenMetaGlyph {
  advance: number,
  planeBounds?: MSDFGenBounds;
  atlasBounds?: MSDFGenBounds;
}

export interface MSDFGenMetaGlyphIdIndex extends MSDFGenMetaGlyph {
  index: number,
}

export interface MSDFGenMetaGlyphIdUnicode extends MSDFGenMetaGlyph {
  unicode: number,
}

export interface MSDFGenKerningIdIndex {
  index1: number;
  index2: number;
  advance: number;
}

export interface MSDFGenKerningIdUnicode {
  unicode1: number;
  unicode2: number;
  advance: number;
}

export interface MSDFGenVariantBase {
  name: string;
  metrics: MSDFGenMetaMetrics;
}

export interface MSDFGenVariantUnicode extends MSDFGenVariantBase{
  glyphs: MSDFGenMetaGlyphIdUnicode[];
  kerning: MSDFGenKerningIdUnicode[];
}

export interface MSDFGenVariantGlyph extends MSDFGenVariantBase {
  glyphs: MSDFGenMetaGlyphIdIndex[];
  kerning: MSDFGenKerningIdIndex[];
}

export type MSDFGenVariant = 
  | MSDFGenVariantUnicode
  | MSDFGenVariantGlyph;

export type MSDFGenSingleVariantMeta = MSDFGenVariant & {
  atlas: MSDFGenMetaAtlas;
}

export type MSDFGenMultiVariantMeta = {
  atlas: MSDFGenMetaAtlas;
  variants: MSDFGenVariant[];
}

export type MSDFGenMeta = 
  | MSDFGenSingleVariantMeta
  | MSDFGenMultiVariantMeta;

export function isMSDFGenMetaVariantUnicodeIndexed(x: MSDFGenVariant): x is MSDFGenVariantUnicode  {
  return 'unicode' in x.glyphs[0];
}
export function isMultiVariantMSDFGenMeta(x: MSDFGenMeta): x is MSDFGenMultiVariantMeta {
  return 'variants' in x;
}

export function isSingleVariantMSDFGenMeta(x: MSDFGenMeta): x is MSDFGenSingleVariantMeta {
  return !isMultiVariantMSDFGenMeta(x);
}
