// REQUIRES #version 300 es
// DEPENDS ON ./quantize.glsl
// DEPENDS ON ./luma.glsl

// Ordered 2x2
// -----------

const mat2 DITHER_BAYER_MAT_2x2 = mat2(
    0, 2,
    3, 1
) / 4.0;

float dither_2x2(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float bias
) {
    // Get threshold required for this pixel to be active
    int x_thresh = int(position.x * resolution.x) % 2;
    int y_thresh = int(position.y * resolution.y) % 2;
    float thresh = DITHER_BAYER_MAT_2x2[x_thresh][y_thresh];

    // Re-scale to allow for pure black
    thresh = mix((1.0/5.0), 1.0, thresh);

    // Take the threshold agains the brightness of the colour
    return step(thresh + bias, basic_luma(colour));
}

vec3 dither_2x2_colour(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float colour_count
) {
    float step_size = 1.0 / (colour_count - 1.0);

    // Get threshold required for this pixel to be active
    int x_thresh = int(position.x * resolution.x) % 2;
    int y_thresh = int(position.y * resolution.y) % 2;
    float thresh = (DITHER_BAYER_MAT_2x2[x_thresh][y_thresh] - 0.5) * step_size;
    
    // Apply dither and quantize
    colour.rgb += thresh;
    colour = quantize_colour(colour, colour_count);

    return colour;
}

// Ordered 4x4
// -----------

const mat4 DITHER_BAYER_MAT_4x4 = mat4(
    0.0,  8.0,  2.0, 10.0,
    12.0, 4.0,  14.0, 6.0,
    3.0,  11.0, 1.0, 9.0,
    15.0, 7.0,  13.0, 5.0
) / 16.0;

float dither_4x4(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float bias
) {
    // Get threshold required for this pixel to be active
    int x_thresh = int(position.x * resolution.x) % 4;
    int y_thresh = int(position.y * resolution.y) % 4;
    float thresh = DITHER_BAYER_MAT_4x4[x_thresh][y_thresh];

    // Re-scale to allow for pure black
    thresh = mix((1.0/17.0), 1.0, thresh);

    // Take the threshold agains the brightness of the colour
    return step(thresh + bias, basic_luma(colour));
}

vec3 dither_4x4_colour(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float colour_count
) {
    float step_size = 1.0 / (colour_count - 1.0);

    // Get threshold required for this pixel to be active
    int x_thresh = int(position.x * resolution.x) % 4;
    int y_thresh = int(position.y * resolution.y) % 4;
    float thresh = (DITHER_BAYER_MAT_4x4[x_thresh][y_thresh] - 0.5) * step_size;
    
    // Apply dither and quantize
    colour.rgb += thresh;
    colour = quantize_colour(colour, colour_count);

    return colour;
}

// Ordered 8x8
// -----------

const float DITHER_BAYER_MAT_8x8[64] = float[64](
     0.0, 32.0,  8.0, 40.0,  2.0, 34.0, 10.0, 42.0,
    48.0, 16.0, 56.0, 24.0, 50.0, 18.0, 58.0, 26.0,
    12.0, 44.0,  4.0, 36.0, 14.0, 46.0,  6.0, 38.0,
    60.0, 28.0, 52.0, 20.0, 62.0, 30.0, 54.0, 22.0,
     3.0, 35.0, 11.0, 43.0,  1.0, 33.0,  9.0, 41.0,
    51.0, 19.0, 59.0, 27.0, 49.0, 17.0, 57.0, 25.0,
    15.0, 47.0,  7.0, 39.0, 13.0, 45.0,  5.0, 37.0,
    63.0, 31.0, 55.0, 23.0, 61.0, 29.0, 53.0, 21.0
);

float get_bayer_8x8(int x, int y) {
    x = (x % 8 + 8) % 8;
    y = (y % 8 + 8) % 8;
    return DITHER_BAYER_MAT_8x8[y * 8 + x] / 64.0;
}

float dither_8x8(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float bias
) {
    ivec2 pixel_coord = ivec2(floor(position * resolution));
    float thresh = get_bayer_8x8(pixel_coord.x, pixel_coord.y);
    
    // Luma calculation
    float luma = basic_luma(colour);
    
    // Pattern-preserving scaling
    thresh = mix(1.0/65.0, 1.0, thresh);
    return step(thresh + bias, luma);
}

vec3 dither_8x8_colour(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float colour_count
) {
    float step_size = 1.0 / (colour_count - 1.0);
    ivec2 pixel_coord = ivec2(floor(position * resolution));
    
    // Get scaled threshold
    float thresh = (get_bayer_8x8(pixel_coord.x, pixel_coord.y) - 0.5) * step_size;
    
    // Apply dither and quantize
    colour += thresh;
    return quantize_colour(colour, colour_count);
}
