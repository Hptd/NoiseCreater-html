const FragShader = /*glsl*/`
varying vec2 vUv;
uniform int uvScale;
uniform float brightness;
uniform float iTime;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float onlyBri;
uniform float saturate;
uniform float speed_;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i < uvScale; i++) { // 4 细节程度 int(1 - 10)
        total += noise(n) * amplitude;
        n += n;
        amplitude *= sharkX; // 扭曲程度 (0 - 1)
    }
    return total;
}

void main(){
	vec2 fragCoord = vUv;

	vec3 c1 = color1;
    vec3 c2 = color2;
    vec3 c3 = color3;
    vec3 c4 = color4;
    const vec3 c5 = vec3(0.1);
    vec3 c6 = vec3(1.-sharkY); // 明亮度
    
    vec2 speed = vec2(hue, saturate); // 速度 (0 - 2.)
    float shift = onlyBri; // 位移偏转 (0 - 1.6)

    vec2 p = fragCoord.xy * 10.;
    float q = fbm(p - iTime * speed_); // 0.1 速度 (0 - 2)
    vec2 r = vec2(fbm(p + q + iTime * speed.x - p.x - p.y), fbm(p + q - iTime * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);

    vec3 col = c * cos(shift * fragCoord.y);

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col, 1);
}`

export default FragShader