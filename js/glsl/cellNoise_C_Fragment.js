const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float brightness;
uniform int delicate;
uniform float broken;
uniform float iTime;
uniform int colorRev;

#define TWO_PI 6.2831853072
#define PI 3.14159265359
#define HALF_PI 1.57079632679

const vec3 cGammaCorrection = vec3( 0.4545454545 );

vec3 gamma( in vec3 color )
{
  return pow( color, cGammaCorrection );
}

vec4 gamma( in vec4 color )
{
  return vec4( gamma( color.rgb ), color.a );
}
vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                    -0.577350269189626,  // -1.0 + 2.0 * C.x
                    0.024390243902439); // 1.0 / 41.0
// First corner
vec2 i  = floor(v + dot(v, C.yy) );
vec2 x0 = v -   i + dot(i, C.xx);

vec2 i1;
i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
vec4 x12 = x0.xyxy + C.xxzz;
x12.xy -= i1;

// Permutations
i = mod289(i);
vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
m = m*m ;
m = m*m ;

vec3 x = 2.0 * fract(p * C.www) - 1.0;
vec3 h = abs(x) - 0.5;
vec3 ox = floor(x + 0.5);
vec3 a0 = x - ox;

m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

vec3 g;
g.x  = a0.x  * x0.x  + h.x  * x0.y;
g.yz = a0.yz * x12.xz + h.yz * x12.yw;
return 130.0 * dot(m, g);
}


const vec3 light = vec3(0.0,0.0,1.0); //ui:-1.0,1.0,1.0
const float rad = 2.0;  //slider:0.0,2.0,1.0
const float shinyness = 6.0;  //slider:0.0,6.0,1.0
const float noiseScale = 0.10;  //slider:0.0,1.0,1.0

float blinnPhongSpecular( vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess ) {
vec3 H = normalize(viewDirection + lightDirection);
return pow(max(0.0, dot(surfaceNormal, H)), shininess);
}

vec3 sphere( in vec2 pos, in float radius, in vec2 fragCoord )
{
    vec2 sp = - 1.0 + 2.0 * fragCoord;
    float r = broken / radius; // 离散程度 (1 - 10) 默认 1
    vec2 p = - 1.0 * r + 2.0 * r * ( fragCoord - pos );

vec3 pt = vec3( sp, 1.0 - length( p ) );
vec3 diff = pt - light;
float clr = clamp( dot( pt, light ), 0.0, 1.0 );
clr = blinnPhongSpecular( light, vec3( 0.0, 0.0, 1.0 ), pt, shinyness );
vec3 col = vec3( clr );
return col;
}
void main(){
	vec2 mainUv = vUv;

    vec4 fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	for( int i = 0; i < delicate; i++) { // 40 单体尺寸大小 (2 - 50) 默认40
	    vec2 pos = vec2( snoise( noiseScale * vec2( float( i ) * 10.0, iTime ) ), snoise( noiseScale * vec2( -float(i) * 10.0, -iTime ) ) );
		vec3 sp = clamp( sphere( pos, rad * ( 1.0 + abs( snoise( noiseScale * vec2( float(i) + iTime ) ) ) ), mainUv ), 0.0, 1.0 );
    	fragColor.rgb = max( fragColor.rgb, sp );
    }

    fragColor = max(vec4(0.), min(vec4(1.), fragColor + brightness));
    if(colorRev == 1){
        fragColor = 1.0 - fragColor;
    }

    gl_FragColor = fragColor;
}`

export default FragShader