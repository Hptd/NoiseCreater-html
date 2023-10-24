const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool colorRev;
uniform bool colorRem;

float scale = 3.;
float pi = 3.14159;

vec3 simplexGrid(vec2 st){
 	vec2 r = vec2(0.0);
    vec3 xyz = vec3(0.0);
    
    // Skew
    r.x = 1.1547 * st.x;
    r.y = st.y + .5 * r.x;
    
    // Simplex
    vec2 p = fract(r);
    if (p.x > p.y){
        xyz.xy = 1. - vec2(p.x, p.y-p.x);
        xyz.z = p.y;
    } else {
        xyz.yz = 1. - vec2(p.x-p.y, p.y);
        xyz.x = p.x;
    }
       
    return fract(xyz);
}

vec2 hex_tile(vec2 uv, float rep, out vec2 id)
{  
    
    uv *= rep;
    
    vec2 d = vec2(1.0, sqrt(3.0));
    vec2 h = 0.5*d;
    vec2 a = mod(uv, d) - h;
    vec2 b = mod(uv + h, d) - h;
    vec2 p = dot(a, a) < dot(b, b)? a: b;
    
    id = p - uv;

    return p;
}

float hexagon(vec2 uv, float s)
{
    vec2 p = abs(uv);
    
    float shape = smoothstep(p.x, p.x+0.01, s);
    float hd = dot(p, normalize(vec2(1.0, 1.73)));
    shape *= smoothstep(hd, hd+.01, s);
    
    return clamp(shape, 0., 1.);
}

vec3 tiledPattern(vec2 p){
    
    // UV's for Y Cut Out
    vec2 hv2 = p;
    hv2.x -= .57735, hv2.y += .3334;
    vec2 hv3 = p;
    hv3.x += .57735, hv3.y += .3334;
    vec2 hv4 = p;
    hv4.y -= .6667;
    
    // Y Cut out
    float y1 = hexagon(hv2, .4);
    float y2 = hexagon(hv3, .4);
    float y3 = hexagon(hv4, .4);
    float yco = y1 + y2 + y3;
        
    
    // Hexagons
    float h1 = hexagon(p, .502);
    float h2 = hexagon(p, sharkX); // 0.4-0.5
   	float hex1 = h1 - h2;
    vec3 hex1C = hex1 * color3;
    
    float h3 = hexagon(p, .415);
    float h4 = hexagon(p, sharkY); // 0.3 - 0.5
    float hex2 = h3 - h4;
    vec3 hex2C = hex2 * color2;
    
    // Simplex Grid
    vec2 sg = p/3.;
    sg *= 3.*1.73;
    vec3 sg1 = simplexGrid(sg);
    
    // Grid Lines
    float g = step(sg1.x, hue);	// 0.0225 0.0 - 0.4
    float h = step(sg1.y, hue); 
    float i = step(sg1.z, hue); 
    float gl = (g+h+i);
    
    // Final Shape
    float h5 = (hex1 + hex2) * yco - gl;
    
    // Mix Colors with Shape
    vec3 ret = mix(color1, hex1C + hex2C, h5);
    
    return ret;
}
void main(){
	vec2 uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale);
    
    // Hex Grid 1
    vec2 hv = uv;
    vec2 id;
    vec2 hex = hex_tile(hv, scale, id);
    
    // Hex Grid 2
    vec2 hv2 = uv;
    hv2.x -= .1111*scale;
    hv2.y -= .064*scale;
    vec2 id2;
    vec2 hex2 = hex_tile(hv2, scale, id2);
    
    // Hex Grid 3
    vec2 hv3 = uv;
    hv3.y -= .128 * scale;
    vec2 id3;
    vec2 hex3 = hex_tile(hv3, scale, id3);
    
	// Pattern
    vec3 pat5 = tiledPattern(hex);
    vec3 pat6 = tiledPattern(hex2);
    vec3 pat7 = tiledPattern(hex3);

    vec3 col = pat5 * pat6 * pat7;

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col,1.);
}`

export default FragShader