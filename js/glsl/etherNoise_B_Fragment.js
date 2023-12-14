const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float iTime;
uniform vec3 color1;
uniform vec3 color2;
uniform float speed_;
uniform float brightness;
uniform bool colorRev;
uniform bool colorRem;

void main(){
	vec2 st = (vUv-0.17)*1.5;
	float iTime_ = iTime*speed_;
    
    /////////////////////////////////////
    /* MASK */
    vec2 center = vec2(.5, .5);
    float dist = distance(center, st);
    float size =  sin(iTime_*2.)/8.+0.5;

    float offset = (sin(iTime_+10.*atan(st.x, st.y))) / (size * 40.);
	dist += offset;

    // Soft edge
    float radius = sin(iTime_)/10.+0.;
    float softness = 0.315 + smoothstep(radius+.1, radius+.02, dist);
    dist = smoothstep(radius,radius+softness, dist);
    
    
    
    /////////////////////////////////////
    /* COLOR */
    // vec3 colA = vec3(0.915,0.045,0.037);
    vec3 colA = color1;
    vec3 colB = color2;
	vec3 colC = vec3(sin(iTime_)/8.+.8,0.233,0.975);
    
    vec3 gradient = 2.0 * mix(colA, colB, smoothstep(0., 1., sin(iTime_*3.) * st.y + .1));
    gradient =  1.2 * mix(gradient, colC, smoothstep(0.,1., st.x));
    
	vec3 col = vec3(gradient);
    col *= (1.-dist);

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., col_wb + brightness));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col, 1);
}`

export default FragShader