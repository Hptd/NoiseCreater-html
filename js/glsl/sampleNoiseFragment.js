const FragShader = /*glsl*/`
varying vec2 vUv;

float noise(vec2 pos)
{
	return fract( sin( dot(pos*0.001 ,vec2(24.12357, 36.789) ) ) * 12345.123);	
}

void main(){
	vec2 mainUv = vUv;
    float sampleNoise = noise(mainUv*(10000.));
    gl_FragColor = vec4(vec3(sampleNoise), 1.);
}`

export default FragShader