const FragShader = /*glsl*/`
varying vec2 vUv;

const float pi =acos(-1.)     ;//3.14; circle.circumference/circle.diameter
const float phi=sqrt(5.)*.5-.5;//0.61; phi-1=1/phi , smaller root.
const float Phi=sqrt(5.)*.5+.5;//1.61; Phi-1=1/Phi , larger  root.
const float fha=14142.1356237;

float h12goldM(vec2 coordinate,float seed){
    return fract(sin(dot(coordinate*seed,vec2(Phi,pi)))*fha);}
   //high precision "gold noise" , similar to from gold_noiseH()
   // but it has LESS apparent diagonal lines, as these get lost with lower precision.
float h12goldH(vec2 coordinate,float seed){
return fract(sin(dot(coordinate*seed, vec2(1.61803398875, 
                                            3.14159265359)))*fha);}
   //low precision "gold noise",(for short source code) is the "oddball" that still "works"
float h12goldS(vec2 coordinate,float seed){
return fract(sin(dot(coordinate*seed,vec2(1.61,3.14)))*14142.);}

void main(){
	vec2 u = vUv;

    // vec2 u =U.xy/iResolution.xy;
    float SeedTime=fha;
    vec4 O=vec4(h12goldM(u,SeedTime),h12goldH(u,SeedTime),h12goldS(u,SeedTime),1);

    gl_FragColor = O;
}`

export default FragShader