const Color = function(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.mix = function(other, f) {
    return new Color(
        this.r * (1 - f) + f * other.r,
        this.g * (1 - f) + f * other.g,
        this.b * (1 - f) + f * other.b,
        this.a * (1 - f) + f * other.a);
};