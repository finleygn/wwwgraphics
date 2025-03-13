import type { PickRequired } from "../../types/util";

const enum ArteryFontYDirection {
  BOTTOM = "bottom",
  TOP = "top"
}

const enum ArteryFontImageType {
  HARD_MASK = "hardmask",
  SOFT_MASK = "softmask",
  SDF = "sdf",
  PSDF = "psdf",
  MSDF = "msdf",
  MTSDF = "mtsdf",
};

interface ArteryFontMetaAtlas {
  type: ArteryFontImageType;
  distanceRange: number;
  distanceRangeMiddle: number;
  size: number;
  width: number;
  height: number;
  yOrigin: ArteryFontYDirection;
}

interface ArteryFontMetaMetrics {
  emSize: number;
  lineHeight: number;
  ascender: number;
  descender: number;
  underlineY: number;
  underlineThickness: number;
  grid: unknown; // TODO
}

interface ArteryFontBounds {
  left: number;
  bottom: number;
  right: number;
  top: number;
}

interface ArteryFontMetaGlyph {
  unicode: number,
  advance: number,
  planeBounds?: ArteryFontBounds;
  atlasBounds?: ArteryFontBounds;
}

interface ArteryFontMeta {
  atlas: ArteryFontMetaAtlas;
  metrics: ArteryFontMetaMetrics;
  glyphs: ArteryFontMetaGlyph[];
  kerning: unknown[];  // TODO
}

type ArteryFontGlphyLookupTable = Record<number, ArteryFontMetaGlyph>

const enum TextAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right'
}

interface ArteryFontUserSettings {
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

type ArteryFontSettings = PickRequired<ArteryFontUserSettings, 'alignment' | 'text'>

class MSDFArteryText {
  public settings: ArteryFontSettings;
  public glpyhs: ArteryFontGlphyLookupTable;
  public meta: ArteryFontMeta;
  public buffers: {
    position: Float32Array,
    uv: Float32Array,
    id: Float32Array,
    index: Uint16Array
  };

  constructor(
    settings: ArteryFontUserSettings,
    meta: ArteryFontMeta
  ) {
    if(meta.atlas.type !== ArteryFontImageType.MSDF) {
      throw new Error("Only MSDF fonts are currently supported.");
    }

    this.meta = meta;
    this.settings = this.applyDefaultSettings(settings);
    this.glpyhs = this.createGlyphLookupTable(meta.glyphs);
    this.buffers = this.createBuffers();
    this.computeGeometry();
  }

  private applyDefaultSettings(settings: ArteryFontUserSettings): ArteryFontSettings {
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
      const v = glyph.atlasBounds.bottom * heightScale;
      const v2 = glyph.atlasBounds.top * heightScale;

      this.buffers.uv.set(
        [
          // tl bl
          u, v2, u, v,
          // tr br
          u2, v2, u2, v
        ],
        cursor * 4 * 2
      );

      this.buffers.position.set(
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
  
  private createBuffers(): this['buffers'] {
    let chars = this.settings.text.replace(/[ \n]/g, '');
    let numChars = chars.length;

    const buffers = {
      position: new Float32Array(numChars * 4 * 3),
      uv: new Float32Array(numChars * 4 * 2),
      id: new Float32Array(numChars * 4),
      index: new Uint16Array(numChars * 6),
    };

    for (let i = 0; i < numChars; i++) {
      buffers.id.set([i, i, i, i], i * 4);
      buffers.index.set([
        i * 4,
        i * 4 + 2, 
        i * 4 + 1, 
        i * 4 + 1, 
        i * 4 + 2, 
        i * 4 + 3
      ], i * 6);
    }

    return buffers
  }

  private createGlyphLookupTable(glpyhs: ArteryFontMetaGlyph[]): this['glpyhs'] {
    const lookup: this['glpyhs'] = {};
    for(const glpyh of glpyhs) {
      lookup[glpyh.unicode] = glpyh;
    }
    return lookup;
  }
}

export default MSDFArteryText;