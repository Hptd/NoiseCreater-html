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
uniform float sharkX;
uniform bool colorRev;
uniform bool colorRem;

float gyroid (vec3 p)
{
    return dot(sin(p),cos(p.yzx));
}

// noise
float fbm (vec2 p)
{
    vec3 q = vec3(p, 0);
    float result = 0., a = .5;
    for (float i = 0.; i < 4.; ++i, a /= 2.)
    {
        q += (result-.5);
        result += gyroid(q/a)*a;
    }
    return result;
}

void main(){
	vec2 p = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001) * 2.;

    float e = sharkX; // e 变形程度 (0.01 - 2)
    float diff = abs(fbm(p+vec2(0,e))-fbm(p-vec2(0,e)))/e;
    float circle = length(fract(p*.5)-.5);
    float thin = smoothstep(.5,0.0,circle) * 2.;
    float shape = smoothstep(0.,0.,diff-thin+0.1);

    shape = max(0., min(1., shape + brightness));

    vec3 col = mix(color1, color2, shape);

    gl_FragColor = vec4(col,1.);
}`

export default FragShader