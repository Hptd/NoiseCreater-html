const FragShader = /*glsl*/`
varying vec2 vUv;
uniform float uvScale;
uniform float uvMoveX;
uniform float uvMoveY;
uniform float uvScaleX;
uniform float uvScaleY;
uniform float brightness;
uniform float iTime;
uniform float onlyBri;
uniform float eleSize;
uniform float alpha;
uniform float detail;
uniform float density;
uniform bool colorRev;

vec2 randVec(float inVal){
    
    return vec2(fract(sin(dot(vec2(inVal*1.1,2352.75053) ,vec2(12.9898,78.233))) * 43758.5453)-0.5,
                fract(sin(dot(vec2(715.23515, inVal) ,vec2(27.2311,31.651))) * 65161.6513)-0.5);
                
}

float randFloat(vec2 inVal){
    return fract(sin(dot(vec2(inVal.x, inVal.y) ,vec2(89.4516,35.516))) * 13554.3651);
                
}

void main(){
    float zoom = 1.5;
    float sharpness = alpha*zoom; // 3.5 模糊程度 (0.1 - 20)
    float expansionSpeed = eleSize; // 4 单圆圈尺寸 (0-10)
    float rainSpeed = 0.3;
    float numRings = detail; // 3 圆圈层数 (1 - 10)
    float numIterations = density; // 3. 稀疏程度 (0 - 10)
    float strength = 0.3;
    
    // other numbers:
    float pi = 3.141592;
    float newTime = iTime*rainSpeed;
    
    vec2 uv;
    vec2 uvStep;
    float fragColor = 0.0;
    for(float iterations = 0.; iterations < numIterations; iterations++){
        for(float xpos = -1.;xpos<=1.;xpos++){
            for(float ypos = -1.;ypos<=1.;ypos++){
                uv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * uvScale;
                // uv = vUv;
                uv /= zoom;
                uv += iterations*vec2(3.21,2.561);
                uv += vec2(xpos*0.3333,ypos*0.3333);
                uvStep = (ceil((uv*1.0-vec2(.5,.5)))/1.);
                uvStep += vec2(xpos,ypos)*100.;
                uv = vec2(fract(uv.x+0.5)-.5,fract(uv.y+0.5)-.5);

                // Variables:
                float timeRand = randFloat(uvStep);
                float timeLoop = fract(newTime+timeRand);
                float timeIter = floor(newTime+timeRand);


                /// Creating ringMap:
                float ringMap = sharpness*9.*distance(uv, randVec(timeIter+uvStep.x+uvStep.y)*0.5);
                float clampMinimum = -(1.+((numRings-1.)*2.0));
                ringMap = clamp((ringMap-expansionSpeed*sharpness*(timeLoop))+1., clampMinimum, 1.);

                // Rings and result
                float rings = (cos((ringMap+newTime)*pi)+1.0)/(8.5 - onlyBri); // 2. 清晰度 (0.5 - 8)
                rings *= pow(1.-timeLoop,2.);
                float bigRing = sin((ringMap-clampMinimum)/(1.-clampMinimum)*pi);
                float result = rings * bigRing;
                fragColor += result*strength;
            }
        }
    }

    if(colorRev){
        fragColor = 1.0 - fragColor;
    }

	fragColor = max(0., min(1., fragColor + brightness));

    gl_FragColor = vec4(vec3(fragColor), 1.);
}`

export default FragShader