import type { PickRequired } from "../../../types/util";
import type { ITextGeometry, ITextGeometryBuilder } from "../types";

import { isMSDFGenMetaVariantUnicodeIndexed, isMultiVariantMSDFGenMeta, MSDFGenImageType, MSDFGenYDirection, type MSDFGenMeta, type MSDFGenMetaGlyph, type MSDFGenMetaGlyphIdUnicode, type MSDFGenSingleVariantMeta } from "./types";


type MSDFGenGlyphLookupTable = Record<number, MSDFGenMetaGlyph>

const enum TextAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right'
}

interface MSDFGenUserSettings {
  /**
   * The text to render. May contain new lines.
   */
  text: string;

  /**
   * Text alignment relative to relative origin.
   */
  alignment?: TextAlign;

  /**
   * Max width the text can be before wrapping.
   */
  maxWidth?: number;

  /**
   * em relative spacing between words.
   * TODO: implement
   */
  wordSpacing?: number;

  /**
   * em relative spacing between letters
   * TODO: implement
   */
  letterSpacing?: number;
}

type MSDFGenSettings = PickRequired<MSDFGenUserSettings, 'alignment' | 'text'>

/**
 * Create Geometry & UVs for text from msdf-atlas-gen JSON layout metadata.
 * 
 * @see https://github.com/Chlumsky/msdf-atlas-gen
 * @see https://github.com/Chlumsky/msdfgen
 */
class MSDFGenTextGeometryBuilder implements ITextGeometryBuilder {
  public settings: MSDFGenSettings;
  public glpyhs: MSDFGenGlyphLookupTable;
  public meta: MSDFGenSingleVariantMeta;
  public geometry: ITextGeometry;

  constructor(
    settings: MSDFGenUserSettings,
    meta: MSDFGenMeta
  ) {
    // TODO: Allow for multi variant config, when chosen variant is selected.
    if(isMultiVariantMSDFGenMeta(meta)) {
      throw new Error("Only single variant MSDF fonts are currently supported.");
    }

    // TODO: Allow for glyph indexed.
    if(!isMSDFGenMetaVariantUnicodeIndexed(meta)) {
      throw new Error("Only unicode indexed MSDF fonts are supported..");
    }

    // TODO: Potentially we should allow for the other atlas types, as that is a shader only detail.
    if(meta.atlas.type !== MSDFGenImageType.MSDF) {
      throw new Error("Only MSDF fonts are currently supported.");
    }

    this.meta = meta;
    this.settings = this.applyDefaultSettings(settings);
    this.glpyhs = this.createGlyphLookupTable(meta.glyphs);
    this.geometry = this.createBuffers();
    this.computeGeometry();
  }

  public recompute() {
    this.computeGeometry();
  }

  private applyDefaultSettings(settings: MSDFGenUserSettings): MSDFGenSettings {
    return {
      ...settings,
      alignment: TextAlign.LEFT,
    }
  }

  private computeGeometry(): void {
    const y = 0;
    let x = 0;

    let cursor = 0;
    
    const widthScale = 1 / this.meta.atlas.width;
    const heightScale = 1 / this.meta.atlas.height;

    for(const char of this.settings.text) {
      const code = char.charCodeAt(0);
      let glyph = this.glpyhs[code];
    
      if(!glyph) {
        console.error(`Tried to draw glyph with code ${code}, but no glyph was present in the atlas.`)
        glyph = this.glpyhs['?'.charCodeAt(0)];
        if(!glyph) {
          console.error("Failed to even draw failure character 😐");
          continue;
        }
      }

      if(!glyph.atlasBounds || !glyph.planeBounds) {
        if(this.settings.wordSpacing) {
          x += this.meta.metrics.emSize * this.settings.wordSpacing;
        } else {
          x += glyph.advance;
        }
        continue;
      }

      const u = glyph.atlasBounds.left * widthScale;
      const u2 = glyph.atlasBounds.right * widthScale;

      const isTopOrigin = this.meta.atlas.yOrigin === MSDFGenYDirection.TOP;
      
      const v = isTopOrigin 
        ? (this.meta.atlas.height - glyph.atlasBounds.top) * heightScale 
        : glyph.atlasBounds.bottom * heightScale;

      const v2 = isTopOrigin 
        ? (this.meta.atlas.height - glyph.atlasBounds.bottom) * heightScale 
        : glyph.atlasBounds.top * heightScale;


      this.geometry.uv.set(
        [
          // tl bl
          u, v2, u, v,
          // tr br
          u2, v2, u2, v
        ],
        cursor * 4 * 2
      );

      this.geometry.position.set(
        [
          // tl
          x + glyph.planeBounds.left,
          y + glyph.planeBounds.top,
          0,
          // bl
          x + glyph.planeBounds.left,
          y + glyph.planeBounds.bottom,
          0, 
          // tr
          x + glyph.planeBounds.right, 
          y + glyph.planeBounds.top, 
          0, 
          // br
          x + glyph.planeBounds.right, 
          y + glyph.planeBounds.bottom, 
          0
        ],
        cursor * 4 * 3
      );

      x += glyph.advance;

      cursor++;
    }
  }
  
  private createBuffers(): this['geometry'] {
    let chars = this.settings.text.replace(/[ \n]/g, '');
    let numChars = chars.length;

    const geometry = {
      position: new Float32Array(numChars * 4 * 3),
      uv: new Float32Array(numChars * 4 * 2),
      index: new Uint16Array(numChars * 6),
    };

    for (let i = 0; i < numChars; i++) {
      geometry.index.set([
        i * 4,
        i * 4 + 2, 
        i * 4 + 1, 
        i * 4 + 1, 
        i * 4 + 2, 
        i * 4 + 3
      ], i * 6);
    }

    return geometry
  }

  private createGlyphLookupTable(glpyhs: MSDFGenMetaGlyphIdUnicode[]): this['glpyhs'] {
    const lookup: this['glpyhs'] = {};
    for(const glpyh of glpyhs) {
      lookup[glpyh.unicode] = glpyh;
    }
    return lookup;
  }
}

export default MSDFGenTextGeometryBuilder;