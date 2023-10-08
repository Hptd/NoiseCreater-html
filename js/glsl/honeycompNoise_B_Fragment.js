const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform float delicate;
uniform float broken;
uniform int colorRev;

float hash(float x)
{
    return fract(fract(x*0.31830988618379067153776752674503)*fract(x*0.15915494309189533576888376337251)*(265871.1723+iTime));
}
float hash2(vec2 x) 
{
    return hash(dot(mod(x,100.0),vec2(127.1,311.7))); 
}
float noiseHoneycombStar(vec2 i) {
    vec2 c3;
    i.x*=1.1547005383792515290182975610039;
    c3.x=floor(i.x)+1.0f;
    vec2 b=vec2(i.y+i.x*0.5,i.y-i.x*0.5);
    c3.y=floor(b.x)+floor(b.y);
    vec3 o=fract(vec3(i.x,b.xy));
    
    vec4 s;
    vec3 m1=vec3(hash2(c3+vec2(1.0,0.0)),hash2(c3+vec2(-1.0,-1.0)),hash2(c3+vec2(-1.0,1.0)));
    vec3 m2=vec3(hash2(c3),hash2(c3+vec2(0.0,1.0)),hash2(c3+vec2(0.0,-1.0)));
    vec3 m3=vec3(hash2(c3+vec2(-1.0,0.0)),hash2(c3+vec2(1.0,1.0)),hash2(c3+vec2(1.0,-1.0)));
    vec3 m4=vec3(m2.x,m2.z,m2.y);
    
    vec3 w1=vec3(o.x,(1.0-o.y),o.z);
    vec3 w2=vec3((1.0-o.x),o.y,(1.0-o.z));
    w1=w1*w1*(delicate-broken*w1);
    w2=w2*w2*(delicate-broken*w2);

    vec2 d=fract(c3*0.5)*2.0;
    
    s=fract(vec4(dot(m1,w1),dot(m2,w2),dot(m3,w2),dot(m4,w1)));

    return fract(mix(mix(s.z,s.w,d.x),mix(s.x,s.y,d.x),d.y));
}
void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	float honeycompNoise = noiseHoneycombStar(mainUv);
    honeycompNoise = max(0., min(1., honeycompNoise + brightness));
    if(colorRev == 1){
        honeycompNoise = 1.0 - honeycompNoise;
    }

    gl_FragColor = vec4(vec3(honeycompNoise), 1.);
}`

export default FragShader