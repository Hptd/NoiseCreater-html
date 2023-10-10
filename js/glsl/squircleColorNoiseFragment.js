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
uniform float saturate;
uniform float hue;
uniform bool colorRev;
uniform bool colorRem;

#define UI0 1597334673U
#define UI1 3812015801U
#define UI2 uvec2(UI0, UI1)
#define UI3 uvec3(UI0, UI1, 2798796415U)
#define UIF (1.0 / float(0xffffffffU))

#define SCALE 12.
#define PURPLE (vec3(92., 25., 226.)/255.)

const vec3[3] colors = vec3[](
						vec3(92., 197., 187.)/255., // cyan
    					vec3(240., 221., 55.)/255., // yellow
    					vec3(253., 87., 59.)/255.); // red
    
float hash12(vec2 p)
{
	uvec2 q = uvec2(ivec2(p)) * UI2;
	uint n = (q.x ^ q.y) * UI0;
	return float(n) * UIF;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}
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

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
    vec2 _mainUv = fract(mainUv);
    vec2 bMainUv = mainUv - vec2(0.5);
    vec2 _bMainUv = fract(bMainUv);
    float t = iTime;

	vec3 col = vec3(0.);
    float ah = hash12(floor(mainUv + 647.));
    float abox = smoothstep(.1, .05, sdBox(_mainUv - .5, vec2(.305)) - .12)
		* (.75 + .25 * sin(t + 588. * ah)) * 1. + 0.; // 0. 亮度 (0-1)
    vec3 aboxCol = colors[int(3. * hash12(floor(mainUv) + 378. + t * .4))];
    float bh = hash12(floor(bMainUv + 879.));
    float bbox = smoothstep(.1, .05, sdBox(_bMainUv - .5, vec2(.305)) - .12)
        * (.75 + .25 * sin(t + 261. * bh)) * 1. + 0.; // 0. 亮度 (0-1)
    vec3 bboxCol = colors[int(3. * hash12(floor(bMainUv) + 117. - t * .8))];
    
    col = mix(col, vec3(abox) * aboxCol, abox);
    col = mix(col, vec3(bbox) * bboxCol, .5 * bbox);
    col = mix(col * 1.25, PURPLE, 1. - (abox + bbox) * 0.5); // 0.5 色相  (0.1 - 1.)

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