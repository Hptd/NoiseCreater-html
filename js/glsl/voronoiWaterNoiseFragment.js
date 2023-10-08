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
uniform float contrast;
uniform int subdivide;
uniform float cellScale;
uniform float whiteScale;
uniform int colorRev;

vec2 hash2(vec2 p ) {
	return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3))))*5232.85324);   
 }
 float hash(vec2 p) {
   return fract(sin(dot(p, vec2(43.232, 75.876)))*4526.3257);   
 }
 
 float voronoi(vec2 p, float iTime) {
	 vec2 n = floor(p);
	 vec2 f = fract(p);
	 float md = 5.0;
	 vec2 m = vec2(0.0);
	 for (int i = -1;i<=1;i++) {
		 for (int j = -1;j<=1;j++) {
			 vec2 g = vec2(i, j);
			 vec2 o = hash2(n+g);
			 o = 0.5+0.5*sin(iTime+5.038*o);
			 vec2 r = g + o - f;
			 float d = dot(r, r);
			 if (d<md) {
			   md = d;
			   m = n+g+o;
			 }
		 }
	 }
	 return md;
 }
 
 float ov(vec2 p, float iTime) {
	 float v = onlyBri; // 亮度
	 float a = contrast; // 对比度
	 for (int i = 0;i<subdivide;i++) { // 3 => 噪波细分
		 v+= voronoi(p, iTime)*a;
		 p*=cellScale; // cell 大小
		 a*=whiteScale; // 白色区域大小
	 }
	 return v;
 }

void main(){
	vec2 mainUv = vec2((vUv.x+uvMoveX)*uvScaleX, (vUv.y+uvMoveY)*uvScaleY) * (uvScale + 0.000001);
	vec4 a = vec4(0.0, 0.0, 0.0, 1.0);
	vec4 b = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 voronoiNoise = vec4(mix(a, b, smoothstep(0.0, 0.5, ov(mainUv*5.0, iTime))));
	voronoiNoise.x = max(0., min(1., voronoiNoise.x + brightness));
	voronoiNoise.y = max(0., min(1., voronoiNoise.y + brightness));
	voronoiNoise.z = max(0., min(1., voronoiNoise.z + brightness));
	if(colorRev == 1){
		voronoiNoise = 1.0 - voronoiNoise;
	}
    gl_FragColor = vec4(voronoiNoise.xyz, 1.);
}`

export default FragShader