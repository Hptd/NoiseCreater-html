const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float iTime;
uniform float onlyBri;
uniform float speed_;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;

#define BIG_CIRCLE_RADIUS 0.35
#define SMALL_CIRCLE_RADIUS sharkY
#define STROKE_WIDTH sharkX
#define SMOOTH_PIXEL 1.5
#define SMOOTH(t, x) smoothstep(t - EPSILON*0.5, t + EPSILON*0.5, x)
#define SMOOTHR(t, x) smoothstep(t + EPSILON*0.5, t - EPSILON*0.5, x)
#define WHITE_CIRCLE(r, o) SMOOTHR((r)*0.5, length(uv - o))
#define BLACK_CIRCLE(r, o) SMOOTH((r)*0.5, length(uv - o))

mat2 rotateMat(float angle) {
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

void main(){
	vec2 uv = (vUv-0.5)*onlyBri;

     float EPSILON = SMOOTH_PIXEL/315.0;
    uv *= rotateMat(-iTime*speed_);
    float v = 0.0;
    vec2 center = vec2(0.0);
    vec2 centerTop = center + vec2(0.0, BIG_CIRCLE_RADIUS/2.0);
    vec2 centerBottom = center + vec2(0.0, -BIG_CIRCLE_RADIUS/2.0);
    
    v += WHITE_CIRCLE(BIG_CIRCLE_RADIUS*2.0, center) * SMOOTH(0.0, uv.x);
    v += WHITE_CIRCLE(BIG_CIRCLE_RADIUS, centerTop);
    v *= BLACK_CIRCLE(BIG_CIRCLE_RADIUS, centerBottom);
    v += WHITE_CIRCLE(SMALL_CIRCLE_RADIUS, centerBottom);
    v *= BLACK_CIRCLE(SMALL_CIRCLE_RADIUS, centerTop);
    v += BLACK_CIRCLE(BIG_CIRCLE_RADIUS*2.0 + STROKE_WIDTH, center);

    vec3 col = vec3(v);

    if(colorRev){
        col = 1.0 - col;
    }
    gl_FragColor = vec4(col, 1.0);
}`

export default FragShader