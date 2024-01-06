const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform float onlyBri;
uniform float delicate;
uniform float broken;
uniform int refrac;
uniform float sharkX;
uniform int sharkY;
uniform int colorRev;
uniform bool useAlpha;

vec3 cout;

float rand(vec3 pos)
{
  vec3 p = pos + vec3(2.);
  vec3 fp = fract(p*p.yzx*222.)+vec3(2.);
  p.y *= p.z * fp.x;
  p.x *= p.y * fp.y;
  return
    fract
    (
		p.x*p.x
    );
}
float skewF(float n)
{
    return (sqrt(n + 1.0) - 1.0)/n;
}
float unskewG(float n)
{
    return (1.0/sqrt(n + 1.0) - 1.0)/n;
}
vec2 smplxNoise2DDeriv(vec2 x, float m, vec2 g)
{
    vec2 dmdxy = min(dot(x, x) - vec2(0.5), 0.0);
	dmdxy = broken*x*dmdxy*dmdxy*dmdxy;
	return dmdxy*dot(x, g) + m*g;
}
float smplxNoise2D(vec2 p, out vec2 deriv, float randKey, float roffset)
{
    //i is a skewed coordinate of a bottom vertex of a simplex where p is in.
    vec2 i0 = floor(p + vec2( (p.x + p.y)*skewF(2.0) ));
    //x0, x1, x2 are unskewed displacement vectors.
    float unskew = unskewG(2.0);
    vec2 x0 = p - (i0 + vec2((i0.x + i0.y)*unskew));

    vec2 ii1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 ii2 = vec2(1.0);
    vec2 x1 = x0 - ii1 - vec2(unskew);
    vec2 x2 = x0 - ii2 - vec2(2.0*unskew);

    vec3 m = max(vec3(0.5) - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
    m = m*m;
    m = m*m;

    float r0 = 3.1416*2.0*rand(vec3(mod(i0, 16.0)/16.0, randKey));
    float r1 = 3.1416*2.0*rand(vec3(mod(i0 + ii1, 16.0)/16.0, randKey));
    float r2 = 3.1416*2.0*rand(vec3(mod(i0 + ii2, 16.0)/16.0, randKey));

    float randKey2 = randKey + 0.01;
    float spmin = 0.5;
    float sps = 1.0;
    float sp0 = spmin + sps*rand(vec3(mod(i0, 16.0)/16.0, randKey2));
    float sp1 = spmin + sps*rand(vec3(mod(i0 + ii1, 16.0)/16.0, randKey2));
    float sp2 = spmin + sps*rand(vec3(mod(i0 + ii2, 16.0)/16.0, randKey2));

    r0 += iTime*sp0 + roffset;
    r1 += iTime*sp1 + roffset;
    r2 += iTime*sp2 + roffset;
    //Gradients;
    vec2 g0 = vec2(cos(r0), sin(r0));
    vec2 g1 = vec2(cos(r1), sin(r1));
    vec2 g2 = vec2(cos(r2), sin(r2));

    deriv = smplxNoise2DDeriv(x0, m.x, g0) + smplxNoise2DDeriv(x1, m.y, g1) + smplxNoise2DDeriv(x2, m.z, g2);
    return dot(m*vec3(dot(x0, g0), dot(x1, g1), dot(x2, g2)), vec3(1.0));
}
vec3 norm(vec2 deriv)
{
    deriv *= 2000.0 * onlyBri;
	vec3 tx = vec3(1.0, 0.0, deriv.x);
	vec3 ty = vec3(0.0, 1.0, deriv.y);
	return normalize(cross(tx, ty));
}

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	vec3 color = vec3(0.0);
    float s = sharkX; // 游丝大小调整 (0.3-10)
    int numLayers = refrac; // 多层细节
    int wormLength = sharkY; // 游丝黑白比例
    for(int i=0; i<numLayers; ++i)
    {
        float sn = 0.0;
        float y = 0.0;
        
        vec2 deriv;
        float nx = smplxNoise2D(mainUv*s*4.0, deriv, 0.1+1./s, 0.0);
        float ny = smplxNoise2D(mainUv*s*4.0, deriv, 0.11+1./s, 0.0);
        for(int j=0; j<wormLength; ++j)
        {
        	vec2 deriv;

			sn += smplxNoise2D(mainUv*s+vec2(1./s, 0.)+vec2(nx,ny)*4., deriv, 0.2+1./s, y);
        	color += vec3(norm(deriv).z)/s;
            y += 0.1;
        }
        s *= delicate;
    }
    color /= 4.;

    vec2 deriv;
    float delay = smplxNoise2D(mainUv*s*1.0, deriv, 0.111, 0.0);

    if(colorRev == 0)
    {
        color = vec3(1.0) - color;
    }

    color = max(vec3(0.0), min(vec3(1.0), color + brightness));

    gl_FragColor = vec4(color, 1.);
    if(useAlpha){gl_FragColor.a = color.g;}
}`

export default FragShader