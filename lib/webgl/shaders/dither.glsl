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

// TODO: