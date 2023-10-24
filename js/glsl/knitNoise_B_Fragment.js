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
uniform vec3 color3;
uniform float saturate;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

void main(){
	vec2 uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale);
           
    uv *= 10.;
    vec2 id = floor(uv);
    uv = fract(uv) - 0.5;
            
    vec2 mxy = smoothstep(0.15, 0.14, abs(uv));    
    float m = clamp(mxy.x + mxy.y, 0., 1.);        
    vec3 col = mix(color1, color2, m); // color1
        
    vec2 v = smoothstep(sharkX, sharkY, abs(uv)) - smoothstep(hue, hue-0.01, abs(uv));
              
    vec2 p = step(0.15, abs(uv));
    vec2 mid = floor(mod(id, saturate)); //2 -> 样式
    
    vec3 P = vec3(p,1.);
	v *= mix(P.zx, P.yz, step(mid.x, 1.-mid.y) * step(1.-mid.x, mid.y));
        
    col *=  mix(col, color3, v.x);
    col *=  mix(col, color3, v.y);

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