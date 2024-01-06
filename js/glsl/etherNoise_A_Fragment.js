const FragShader = /*glsl*/`
varying vec2 vUv;
uniform int uvScale;
uniform float brightness;
uniform float iTime;
uniform vec3 color1;
uniform float onlyBri;
uniform float saturate;
uniform float speed_;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;
uniform bool useAlpha;

#define t iTime * speed_
mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
    p.xz*= m(t*hue);
    p.xy*= m(t*saturate);
    vec3 q = p*sharkX+t;
    return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*sharkY - 1.;
}

void main(){
	vec2 p = (vUv-0.5)*onlyBri;

    vec3 col = vec3(0.);
    float d = 2.5;
    for(int i=0; i<=uvScale; i++)	{
		vec3 p = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
        float rz = map(p);
		float f =  clamp((rz - map(p+.1))*0.5, -.1, 1. );
        vec3 l = color1 + vec3(5., 2.5, 3.)*f;
        col = col*l + smoothstep(2.5, .0, rz)*.7*l;
		d += min(rz, 1.);
	}

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col, 1);
    if(useAlpha){gl_FragColor.a = col.b;}
}`

export default FragShader