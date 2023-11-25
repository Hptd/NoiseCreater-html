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
uniform float contrast;
uniform int subdivide;
uniform float cellScale;
uniform float whiteScale;
uniform vec3 color1;
uniform bool colorRev;
uniform bool colorRem;

#define TAU 6.28318530718
#define MAX_ITER subdivide // 疏密程度 (0 - 10)

void main(){
	vec2 uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	
	float time = iTime * .5+23.0;
    vec2 p = mod(uv*TAU, TAU)-250.0;

	vec2 i = vec2(p);
	float c = 2. - onlyBri;// 亮度 (0 - 2) 反向
	float inten = contrast; // 光晕程度 (0.002 - 0.03)

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (2.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.2); 
	vec3 colour = vec3(pow(abs(c), 8.0));
    colour = clamp(colour + color1, 0.0, 1.0); // bg color

	colour = max(vec3(0.), min(vec3(1.), colour + brightness));
	if(colorRem){
        float col_wb = dot(colour, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        colour = vec3(col_wb);
    }

    gl_FragColor = vec4(colour, 1.);
}`

export default FragShader