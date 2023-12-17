const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float brightness;
uniform float iTime;
uniform float onlyBri;
uniform float speed_;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

float noise3( vec3 x , out vec2 g) {
    vec3 p = floor(x),f = fract(x),
        F = f*f*(3.-2.*f);

#define hash3(p)  fract(sin(1e3*dot(p,vec3(1,57,-13.7)))*4375.5453)
    
    float v000 = hash3(p+vec3(0,0,0)), v100 = hash3(p+vec3(1,0,0)),
          v010 = hash3(p+vec3(0,1,0)), v110 = hash3(p+vec3(1,1,0)),
          v001 = hash3(p+vec3(0,0,1)), v101 = hash3(p+vec3(1,0,1)),
          v011 = hash3(p+vec3(0,1,1)), v111 = hash3(p+vec3(1,1,1));
    
    g.x = 6.*f.x*(1.-f.x)
          * mix( mix( v100 - v000, v110 - v010, F.y),
                 mix( v101 - v001, v111 - v011, F.y), F.z);
    g.y = 6.*f.y*(1.-f.y)
          * mix( mix( v010 - v000, v110 - v100, F.x),
                 mix( v011 - v001, v111 - v101, F.x), F.z);
    
    return mix( mix(mix( v000, v100, F.x),
                    mix( v010, v110, F.x),F.y),
                mix(mix( v001, v101, F.x),       
                    mix( v011, v111, F.x),F.y), F.z);
}
float noise(vec3 x, out vec2 g) {
    vec2 g0,g1;
    float n = (noise3(x,g0)+noise3(x+11.5,g1)) / 2.;
    g = (g0+g1)/2.;
    return n;
}

void main(){
	vec2 U = vUv*onlyBri;
    vec2 g;
    float n = noise(vec3(U,speed_*iTime), g),
          v = sin(6.28*10.*n);
    g *= 6.28*10.*cos(6.28*10.*n) * 8./uvScale;
    v = tanh(min(2.*abs(v) / (abs(g.x)+abs(g.y)),10.));
    n = floor(n*sharkY)/sharkX;
	vec4 col = v * (.5+.5*cos(12.*n+vec4(0,2.1,-2.1,0)));

    if(colorRem){
        float col_wb = dot(col.xyz, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col.xyz = vec3(col_wb);
    }

    gl_FragColor = vec4(col.xyz, 1);
}`

export default FragShader