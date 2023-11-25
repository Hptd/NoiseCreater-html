const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform float delicate;
uniform float broken;
uniform float refrac;
uniform float sharkX;
uniform float sharkY;
uniform float onlyBri;
uniform float saturate;
uniform float hue;
uniform bool colorRev;
uniform bool colorRem;

vec3 rgb2hsv( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),vec4(c.gb, K.xy),step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),vec4(c.r, p.yzx),step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),d / (q.x + e),q.x);
}
vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z * mix( vec3(1.0), rgb, c.y);
}
float rand(vec2 co) { 
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
} 

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
    vec2 uv = mainUv * 10.;

	uv.x += floor(mod(uv.y, sharkY)) * iTime * 2.0 - iTime; // 错位运动参数
    vec2 id = floor(uv*broken);
    vec2 gv = fract(uv * sharkX) - 0.5; // 1. 矩阵变形
    
    float size = delicate;
    float colMask = smoothstep(size, size - refrac, length(gv));
        
    vec3 circleColor = vec3(
        rand(id),
        rand(id + 1.0),
        rand(id + 2.0)
    );
    
    vec3 col = mix(vec3(1.0), circleColor, colMask);
    
    col = rgb2hsv(col);
    col.x += hue;
    col.y *= saturate;
    col.z += onlyBri;
    col = hsv2rgb(col);

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