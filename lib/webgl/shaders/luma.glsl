float basic_luma(vec3 c) {
    return max(c.r, max(c.g, c.b));
}