const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform vec3 color1;
uniform vec3 color2;
uniform float onlyBri;
uniform float saturate;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

#define SIZE 20.
// #define BLACK_COL vec3(32,43,51)/255.
// #define WHITE_COL vec3(235,241,245)/255.
#define BLACK_COL color1
#define WHITE_COL color2

// Get random value
float rand(vec2 co) { 
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
} 

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);

	vec2 ruv = mainUv*SIZE;    
    vec2 id = ceil(ruv);
    float smf = 0.1;   
        
    ruv.y -= iTime*2. * (rand(vec2(id.x))*0.5+.5); // move up
    ruv.y += ceil(mod(id.x, sharkY))*0.3 * iTime; // 2. 错位运动参数
    vec2 guv = fract(ruv * sharkX) - 0.5; // 1. 矩阵变形 
    
    ruv = ceil(ruv);    
    float g = length(guv);
    
    float v = rand(ruv)*hue; // 泡泡尺寸 (0.1 - 0.5)
    v *= step(saturate, v); // 泡泡稀疏程度 (0 - 0.5)
    float m = smoothstep(v,v-smf, g);
    v*=(0.9 - onlyBri); // 泡泡厚度 (0 - 0.9) 0.9 - ()
    m -= smoothstep(v,v-smf, g);
    
    vec3 col = mix(BLACK_COL, WHITE_COL, m);

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col,1.);
}`

export default FragShader