const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform vec3 color1;
uniform vec3 color2;
uniform float saturate;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

#define PI 3.141592653589
#define SHADOW vec3(0.)
void main(){
	vec2 uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale);
    
    float ca = cos(PI * sharkY);
    float sa = sin(PI * sharkY);
    mat2 rot = mat2(ca, -sa, sa, ca);
    uv *= rot;
        
    uv *= 10.;
    vec2 id = floor(uv);
    uv = fract(uv) - 0.5;          

    float d1 = step(abs(uv.x), sharkX);
    float d1s = smoothstep(saturate, hue, abs(uv.x));
    float d2 = step(abs(uv.y), sharkX);
    float d2s = smoothstep(saturate, hue, abs(uv.y));
    
    vec3 col = vec3(0.);
    
    if(mod(id.x + id.y, 2.) == 0.){        
        col = mix(col, color1, d1);        
        col = mix(col, SHADOW, d2s);
        col = mix(col, color2, d2);
    } else {
        col = mix(col, color2, d2);
        col = mix(col, SHADOW, d1s);
        col = mix(col, color1, d1);    
    }
    
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