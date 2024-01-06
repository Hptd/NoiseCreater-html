const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform float onlyBri;
uniform int delicate;
uniform float broken;
uniform float refrac;
uniform float sharkX;
uniform float sharkY;
uniform float warp;
uniform float colorGray2;
uniform float colorGray3;
uniform float colorGray4;
uniform int colorRev;
uniform bool useAlpha;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
float fbm ( in vec2 _st) {
    float v = 0.0; 
    float a = onlyBri; // 亮度 (0.3-0.9)
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                   -sin(0.5), cos(0.5));
    for (int i = 0; i < delicate; ++i) { // 5 (4 - 20) => 细腻程度
        v += a * noise(_st);
        _st = rot * _st * broken + shift; // 2.0 (1 - 15) => 破碎程度
        a *= refrac; // 0.5 (0-1) => 空气折射强度
    }
    return v;
}
void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	vec3 color = vec3(0.0);

    vec2 q = vec2(0);
    q.x = fbm( mainUv);
    q.y = fbm( mainUv + vec2(1.0));

    vec2 r = vec2(0.0);
    r.x = fbm( mainUv + warp*q + vec2(1.7,9.2)+ sharkX*iTime ); // 0.15 => x 方向 noise 扰动   1.0 => 扭曲强度
    r.y = fbm( mainUv + warp*q + vec2(8.3,2.8)+ sharkY*iTime); // 0.126 => y 方向 noise 扰动  1.0 => 扭曲强度

    float f = fbm(mainUv+r);

    color = mix(vec3(1., 1., 1.),vec3(colorGray2),clamp((f*f)*4.0,0.0,1.0)); // color1 111 | color2 000
    color = mix(color,vec3(colorGray3),clamp(length(q),0.0,1.0)); // color3 0.3
    color = mix(color,vec3(colorGray4),clamp(length(r.x),0.0,1.0)); // color4 0.6

    color *= (f*f*f+.6*f*f+.5*f);
    color = max(vec3(0.), min(vec3(1.), color + brightness));

    if(colorRev == 1){
        color = 1.0 - color;
    }

    gl_FragColor = vec4(color,1.);
    if(useAlpha){gl_FragColor.a = color.g;}
}`

export default FragShader