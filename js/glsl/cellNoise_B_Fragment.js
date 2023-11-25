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
float CellTex(vec2 p, float seed, vec2 cells)
{
	float d1;
	vec2 p1;
	vec2 cv1;
	
	vec2 p_i = floor(p);
	
	d1 = 64.0;
	
	for(float i = -1.0; i <= 1.0; ++i)
	for(float j = -1.0; j <= 1.0; ++j)
	{
		vec2 cv = vec2(i, j);		
		vec2 cvg = cv + p_i;
		vec2 cid = mod(cvg, cells);
		
        #if 1
		float h = CheapHash(cid * 1.36541 + 0.82477 + seed);
		vec2 o = AngToVec(h * Pi);
        #else
		vec2 o = vec2(CheapHash(cid * 1.36541 + 0.82477 + seed), 
		              CheapHash(cid * 1.70117 + 0.67484 + seed)) * 0.99;
		#endif
		
		vec2 fp = cvg + 0.5;
		fp += o * 0.437;
		
		float d = SqrLen(p - fp);

		if(d < d1)
		{
			d1 = d;
			p1 = fp;
			cv1 = cv;
		}
	}
	
	float dd = 64.0;
	
	for(float i = -1.0; i <= 1.0; ++i)
	for(float j = -1.0; j <= 1.0; ++j)
	if(i != cv1.x || j != cv1.y)
	{
		vec2 cv = vec2(i, j);		
		vec2 cvg = cv + p_i;
		vec2 cid = mod(cvg, cells);
		
        #if 1
		float h = CheapHash(cid * 1.36541 + 0.82477 + seed);
		vec2 o = AngToVec(h * Pi);
        #else
		vec2 o = vec2(CheapHash(cid * 1.36541 + 0.82477 + seed), 
		              CheapHash(cid * 1.70117 + 0.67484 + seed)) * 0.99;
		#endif
        
		vec2 fp = cvg + 0.5;
		fp += o * 0.437;
		
	    float d = dot(p - (p1 + fp) * 0.5, normalize(p1 - fp));
	    // d = dot(p - (p1 + fp) * 0.5, (p1 - fp)) * 2.0 / 1.48 * 0.55;// same as middle texture

		dd = min(dd, d);
	}
	
	return dd * whiteIntensity;// 白色区域的亮度 (0.3 - ) 数值越高线条越细
}


void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	
    vec2 cells = vec2(0.0);
    float r0 = CellTex(mainUv, 0.0, cells);

    r0 = max(0., min(1., r0 + brightness));
    if(colorRev == 1){
        r0 = 1.0 - r0;
    }
    gl_FragColor = vec4(vec3(r0), 1.);
}`

export default FragShader