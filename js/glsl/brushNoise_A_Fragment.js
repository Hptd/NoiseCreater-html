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

#define _PerlinPrecision 8.0
#define _PerlinOctaves 8.0
#define _PerlinSeed 0.0

float rnd(vec2 xy)
{
    return fract(sin(dot(xy, vec2(12.9898-_PerlinSeed, 78.233+_PerlinSeed)))* (43758.5453+_PerlinSeed));
}
float inter(float a, float b, float x)
{
    float f = (1.0 - cos(x * 3.1415927)) * 0.5;
    return a*(1.0-f) + b*f;
}
float perlin(vec2 uv)
{
    float a,b,c,d, coef1,coef2, t, p;

    t = _PerlinPrecision;
    p = 0.0;

    for(float i=0.0; i<_PerlinOctaves; i++)
    {
        a = rnd(vec2(floor(t*uv.x)/t, floor(t*uv.y)/t));
        b = rnd(vec2(ceil(t*uv.x)/t, floor(t*uv.y)/t));	
        c = rnd(vec2(floor(t*uv.x)/t, ceil(t*uv.y)/t));	
        d = rnd(vec2(ceil(t*uv.x)/t, ceil(t*uv.y)/t));

        if((ceil(t*uv.x)/t) == 1.0)
        {
            b = rnd(vec2(0.0, floor(t*uv.y)/t));
            d = rnd(vec2(0.0, ceil(t*uv.y)/t));
        }

        coef1 = fract(t*uv.x);
        coef2 = fract(t*uv.y);
        p += inter(inter(a,b,coef1), inter(c,d,coef1), coef2) * (1.0/pow(2.0,(i+0.6)));
        t *= 2.0;
    }
    return p;
}

void main(){
	vec2 p = vec2((vUv.x+uvMoveX-0.5)*uvScaleX, (vUv.y+uvMoveY-0.5)*uvScaleY) * (uvScale + 0.000001);

    float r = length(p);
    float seed = floor(sharkX*0.5);
    
    float noise_scale = 0.15+0.075*mod(seed, 3.);
    float num_layers = 3.+2.*mod(seed, 5.);
    seed *= num_layers;
    
    float v = 0.;
    
    for (float i = 0.; i < num_layers; i++) {
        float h = noise_scale*perlin(p+vec2(i+seed))+r;
        if (h < 0.4) { v += 1./num_layers; }
    }
    
    vec3 col = mix(color1, color2, v);
    col = max(vec3(0.), min(vec3(1.), col + brightness));

    gl_FragColor = vec4(col,1.);
}`

export default FragShader