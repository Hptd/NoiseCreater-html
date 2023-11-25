const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float brightness;
uniform float iTime;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
uniform float onlyBri;
uniform float saturate;
uniform float speed_;
uniform bool colorRev;
uniform bool colorRem;

#define S(v,r) smoothstep( r, r + 3., v ) 
vec2 hash(vec2 p){
    p = vec2( dot(p,vec2(137.1,373.7)), dot(p,vec2(269.5,183.7)) ); 
    return fract(sin(p)*43758.37); 
}

float worley(vec2 p){
    vec2 n = floor(p);
    vec2 f = fract(p);
    float r = 1.;
    for(int i=-2;i<=2;i++){
    for(int j=-2;j<=2;j++){
        vec2 o = hash(n+vec2(i,j));
        o = sin(iTime/2. + hash(n+vec2(i,j))*6.28)*0.5+0.5;//animate
        o += vec2(i,j);
        float D1 = distance(o,f);//Euclidean
        r = min(r,D1);
    }
    }
    return r;
}

float logo(vec2 uv){
    float n = 0.;
    n += S(.05,abs(length(uv-vec2(-1.23,0))-.12));
    n *= 1.-S(-1.25,uv.x);
    n += S(.17,abs(uv.y))*S(.05,abs(uv.x+1.29));
    n += S(.05,abs(length(uv-vec2(-1.5,0))-.12));
    n += S(.05,abs(length(uv-vec2(-0.9,0))-.12));
    n += (1.+S(-.6,uv.x)-S(.05,uv.y))*S(.05,abs(length(uv-vec2(-0.6,.03))-.09));
    n += (1.-S(-.6,uv.x)+S(-.05,uv.y))*S(.05,abs(length(uv-vec2(-0.6,-.04))-.09));
    return n;
    }

float logo(vec2 uv);

void main(){
	vec2 uv = (vUv-0.5) * 2.5;

	float c = worley(uv + vec2(0.,-iTime))*uvScale; // 0.5 扰动效果 (0 - 2)
    c += worley(uv*2.+vec2(sin(iTime*2.)*0.5,-iTime*speed_))*0.5; //6. speed_ (0 - 10)
    c += (-uv.y-onlyBri)*0.6;//y mask 0.3 (0 - 1)
    
    vec2 p = uv;
    p.x *=1.5+smoothstep(-0.3,1.,uv.y)*1.5;
    float m = smoothstep(1.,saturate,length(p));// 0.5 下部平整度 (0, 0.99)
    
    float c0 = smoothstep(.4,.6,m*c*3.);//out fire
    float c1 = smoothstep(.5,.52,m*c*2.);//mid fire
    float c2 = smoothstep(.5,.52,m*c*1.2*(-uv.y+0.3));//inner fire
    float c3 = pow(worley(uv*6.+vec2(sin(iTime*4.)*1.,-iTime*16.)),8.);
          c3 = smoothstep(.98,1.,c3)*m;//sparkle

    vec3 col = color1*c3;//sparkle
    col = mix(col,color2*(uv.y+.8),c0);//out
    col = mix(col,mix(color3,color5,-uv.y),c1);//mid
    col = mix(col,color4,c2);//inner

    col += logo(uv);

    if(colorRem){
        float col_wb = dot(col, vec3(0.22, 0.707, 0.071));
        col_wb = max(0., min(1., mix(col_wb + brightness, col_wb, (1.-c0)*(1.-c3))));
        if(colorRev){
            col_wb = 1.0 - col_wb;
        }
        col = vec3(col_wb);
    }

    gl_FragColor = vec4(col, 1);
}`

export default FragShader