const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform int colorRev;

float noise(vec2 pos)
{
	return fract( sin( dot(pos*0.001 ,vec2(24.12357, 36.789) ) ) *(12345.123 + iTime));	
}
float smooth_noise(vec2 pos)
{
	return   ( noise(pos + vec2(1,1)) + noise(pos + vec2(1,1)) + noise(pos + vec2(1,1)) + noise(pos + vec2(1,1)) ) / 16.0 		
		   + ( noise(pos + vec2(1,0)) + noise(pos + vec2(-1,0)) + noise(pos + vec2(0,1)) + noise(pos + vec2(0,-1)) ) / 8.0 		
    	   + noise(pos) / 4.0;
}
float interpolate_noise(vec2 pos)
{
	float	a, b, c, d;
	
	a = smooth_noise(floor(pos));	
	b = smooth_noise(vec2(floor(pos.x+1.0), floor(pos.y)));
	c = smooth_noise(vec2(floor(pos.x), floor(pos.y+1.0)));
	d = smooth_noise(vec2(floor(pos.x+1.0), floor(pos.y+1.0)));
		
	a = mix(a, b, fract(pos.x));
	b = mix(c, d, fract(pos.x));
	a = mix(a, b, fract(pos.y));
	
	return a;				   	
}
float perlin_noise(vec2 pos)
{
	float	n;
	
	n = interpolate_noise(pos*0.0625)*0.5;
	n += interpolate_noise(pos*0.125)*0.25;
	n += interpolate_noise(pos*0.025)*0.225;
	n += interpolate_noise(pos*0.05)*0.0625;
	n += interpolate_noise(pos)*0.03125;
	return n;
}

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY);
    float perlinNoise = perlin_noise(mainUv*(uvScale+0.000001));
	perlinNoise = max(0., min(1., perlinNoise + brightness));
	if(colorRev == 1){
		perlinNoise = 1.0 - perlinNoise;
	}
    gl_FragColor = vec4(vec3(perlinNoise), 1.);
}`

export default FragShader