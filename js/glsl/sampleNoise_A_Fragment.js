const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float noiseChooseValue;

float hash21(vec2 p)
{
	float h = dot(p,vec2(127.1,311.7));
	
    return -1.0 + 2.0 * fract(sin(h)*43758.5453123);
}
vec2 hash22(vec2 p)
{
    p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)));
    
    //return normalize(-1.0 + 2.0 * fract(sin(p)*43758.5453123));
    return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}
float perlin_noise(vec2 p)
{
    vec2 pi = floor(p);
    vec2 pf = p - pi;
    
    vec2 w = pf * pf * (3.0 - 2.0 * pf);
    
    return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)), 
                   dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x), 
               mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)), 
                   dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),
               w.y);
}
float value_noise(vec2 p)
{
    vec2 pi = floor(p);
    vec2 pf = p - pi;
    
    vec2 w = pf * pf * (3.0 - 2.0 * pf);
    
    return mix(mix(hash21(pi + vec2(0.0, 0.0)), hash21(pi + vec2(1.0, 0.0)), w.x),
               mix(hash21(pi + vec2(0.0, 1.0)), hash21(pi + vec2(1.0, 1.0)), w.x),
               w.y);
}
float simplex_noise(vec2 p)
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    
    vec2 i = floor(p + (p.x + p.y) * K1);
    
    vec2 a = p - (i - (i.x + i.y) * K2);
    vec2 o = (a.x < a.y) ? vec2(0.0, 1.0) : vec2(1.0, 0.0);
    vec2 b = a - (o - K2);
    vec2 c = a - (1.0 - 2.0 * K2);
    
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
    
    return dot(vec3(70.0, 70.0, 70.0), n);
}
float noise(vec2 p) {
    if(noiseChooseValue == 1.) {return perlin_noise(p);}
    else if(noiseChooseValue == 2.) {return value_noise(p);}
    else if(noiseChooseValue == 3.) {return simplex_noise(p);}
}
float noise_itself(vec2 p)
{
    return noise(p * 8.0);
}

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale+0.000001);
    float sampleNoise_A = noise_itself(mainUv);
    sampleNoise_A = max(0., min(1., sampleNoise_A + brightness));
    gl_FragColor = vec4(vec3(sampleNoise_A), 1.);
}`

export default FragShader