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
uniform float warp;
uniform int colorRev;
uniform int rotate;

// float widthRange = delicate; // 方块最大尺寸 (0.002 - 0.05)
float scale = 20.0;
float alpha = 1.0;

float square(vec2 r, vec2 center, float width, float a){
    r = abs( mat2(cos(a),-sin(a),sin(a),cos(a)) *(r - center) );    
    return alpha*smoothstep(0.05, -0.05, max(r.x, r.y)-width/2.);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float grid(vec2 r, float scale)
{
    vec2 rr;
    
    float angle = warp; // 旋转角度
    float mask = 0.0; // 灰度 (0 - 1)
    float widthFreq;
    float widthPhase;
    float squareWidth;
    
    //iterate the 3x3 grid surrounding r
    //see if im in any of the boxes
    for(int i = -1; i < 2; ++i)
    {
        for(float j = -1.0; j < 2.0; ++j)
        {
            rr = round(r*scale + vec2(i,j));
            
            //开启旋转
            if(rotate == 1){angle = 3.0*(rand(vec2(rr + 0.1)) - 1.0)*iTime/2.0;}

            widthPhase = rand(vec2(rr + 0.2));
            widthFreq = 5.0*rand(vec2(rr + 0.3));
            squareWidth = rand(vec2(rr))*scale*(delicate + delicate*sin(iTime*widthFreq + widthPhase));
            
            mask += square(r*scale, rr, squareWidth, angle);
        }
    }
    return mask;
}
void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	
    float gridNoise = grid(mainUv, scale);

    if(colorRev == 1){
        gridNoise = 1.0 - gridNoise;
    }
    gridNoise = max(0., min(1., gridNoise + brightness));
    gl_FragColor = vec4(vec3(gridNoise),1.);
}`

export default FragShader