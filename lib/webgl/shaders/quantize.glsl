vec3 quantize(vec3 colour, float n) {
    return floor(colour * (n - 1.0) + 0.5) / (n - 1.0);
}

vec2 downsample_uv(vec2 uv, vec2 resolution) {
    return floor(uv * resolution) / resolution;
}