const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float sharkX;
uniform float sharkY;


float KnitPattern (vec2 p)
{
  float f = sin((p.x + p.y) * 111.);
  p *= vec2(45.,30.);
  p.y += abs( fract((p.x-sharkX)/2.) * 2. - 1.);
  float d = brightness - length(fract(p) - sharkY);
  return mix(f, d, 1.);
}
void main(){
	vec2 uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale) * 0.4;
    vec3 col = vec3(KnitPattern(uv));

    gl_FragColor = vec4(col,1.);
}`

export default FragShader