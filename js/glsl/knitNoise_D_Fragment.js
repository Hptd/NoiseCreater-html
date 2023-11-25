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

float W( vec2 U ) {
    U = 2.* mod(U*5.,vec2(1,1.4)) - vec2(1,1.9);
    float l = length(U);
    l = U.y/l > -.7 ?  l : length( U - vec2 (sign(U.x),-1) );
    return smoothstep(.1,.0, abs(l-.7) -sharkX) * ( 0.1+sharkY*abs(U.y+.6) ); //.1 宽度 (0 - 0.15)  0.7 -> 透明度
}
void main(){
	vec2 U = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale);

    float O = W(U);
    float P = W(U+vec2(saturate, hue));
    float OP = max(O, P);
    OP *= max(0., min(1., OP + brightness));
    vec3 col = mix(color1*OP, color2, OP);
    
    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col, 1.);
}`

export default FragShader