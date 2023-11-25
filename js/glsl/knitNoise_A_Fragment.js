const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float onlyBri;
uniform float iTime;
uniform float saturate;
uniform float hue;
uniform float sharkX;
uniform float sharkY;
uniform bool timeStart;

void main(){
	vec2 uv0 = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale);

	float t = iTime;
    vec2 m = vec2(1.);
    if (timeStart) {
        m = .5+.5*vec2(cos(t),sin(.6*t)); 
    }else if(!timeStart){
        m = vec2(sharkX, sharkY);
    }
    m.y*=m.x;

    vec2 uv = uv0*8., iuv=floor(uv);
    float d = mod(iuv.x+iuv.y,2.), s = mod(iuv.y,2.);
    uv = fract (uv); if (d==1.) uv.x = 1.-uv.x; // checkered tile coordinates
    uv = uv + vec2(-uv.y,uv.x); // rotate 45deg
 
    float q = sign(s-.5)*sign(d-.5),
      size0 = m.x+m.y*cos(hue*3.1415927*uv.y) *q,
          l = abs(uv.x)-size0,
          v = smoothstep(0.,.05,abs(l)),
         v0 = step(0.,l);
    
    float size = m.x+m.y*cos(hue*3.1415927*uv.x), 
           ofs = (1.-size)*q;
             l = (uv.y-1.)-ofs;
    float   v1 = step(0.,l),
            d0 =  mod(s+v1,2.),
            d1 =  mod(s+d+v1,2.);
    v0 = d1<1. ? v0 : 0.;
    v = (d1<1. ? v : 1.)*smoothstep(0.,.1,abs(l));

    float col = v0 *(cos(8.*31.4*uv0.x)*cos(8.*31.4*uv0.y))
          + (1.-v0)*( d1==1. ? cos(saturate*31.4*( q>0. ? 2.-uv.y : uv.y )*m.x/size)  
                             : cos(saturate*31.4*(uv.x*m.x/size0)) );

    v = max(0., min(1., v + brightness));
    col = max(0., min(1., col + onlyBri));

    gl_FragColor = vec4(vec3(col*v),1.);
}`

export default FragShader