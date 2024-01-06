const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float whiteIntensity;
uniform float iTime;
uniform int colorRev;
uniform bool useAlpha;

const float Pi = 3.141592653589793238462643383279502884197169399375105820974944592;

vec2 AngToVec(float ang)
{	
	return vec2(cos(ang), sin(ang));
}

float SqrLen(vec2  v) {return dot(v, v);}

float CheapHash(float v)
{
    return fract(sin(v) * (43758.5453 + iTime)) * 2.0 - 1.0;
}
float CheapHash(vec2 v)
{
	return CheapHash(v.y + v.x * 12.9898);
}
float F1_N3(vec2 p, vec2 cells){
	vec2 p_i = floor(p);
	
	float out_d = 64.0;
	
	for(float i = -1.0; i <= 1.0; ++i)
	for(float j = -1.0; j <= 1.0; ++j)
	{
		vec2 cv = vec2(i, j);		
		vec2 cvg = cv + p_i;
		vec2 cid = mod(cvg, cells);
		
		float h = CheapHash(cid);
		vec2 o = AngToVec(h * Pi);
		
		vec2 fp = cvg + 0.5;
		fp += o * 0.437;
		
		float d = SqrLen(p - fp);

		if(d < out_d)
		{
			out_d = d;
		}
	}
    return out_d * whiteIntensity; // 白色比例大小 (0.2 - 6.)
}

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	
    vec2 cells = vec2(0.0);
    float r0 = F1_N3(mainUv, cells);

    r0 = max(0., min(1., r0 + brightness));
    if(colorRev == 1){
        r0 = 1.0 - r0;
    }
    gl_FragColor = vec4(vec3(r0), 1.);
	if(useAlpha){gl_FragColor.a = r0;}
}`

export default FragShader