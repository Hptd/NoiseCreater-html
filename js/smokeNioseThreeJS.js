import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/smokeNoiseFragment.js"

const downloadSize = document.querySelector("#downloadSize")
const btnReSize = document.querySelector("#btnReSize")
let width = +downloadSize.value
let height = +downloadSize.value

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)

// 设置导出图片尺寸
downloadSize.addEventListener('input', (e) => {
    width = height = +e.target.value
    camera.aspect = width/height
    renderer.setSize(width, height)
})
// 按钮重置导出画布尺寸
btnReSize.addEventListener('click', () => {
    width = height = 512
    camera.aspect = width/height
    renderer.setSize(width, height)
    downloadSize.value = 512
})

document.body.appendChild(renderer.domElement)

const planeGeo = new THREE.PlaneGeometry(10, 10)

// 传参 && Gui
const inputScele = document.querySelector("#scale")
const inputMoveX = document.querySelector('#moveX')
const inputMoveY = document.querySelector('#moveY')
const inputScaleX = document.querySelector("#scaleX")
const inputScaleY = document.querySelector("#scaleY")
const inputBrightness = document.querySelector("#brightness")
const inputOnlyBri = document.querySelector("#onlyBrightness")
const inputDelicate = document.querySelector("#delicate")
const inputBroken = document.querySelector("#broken")
const inputRefrac = document.querySelector("#refrac")
const inputSharkX = document.querySelector("#sharkX")
const inputSharkY = document.querySelector("#sharkY")
const inputWarp = document.querySelector("#warp")
const inputColorGray2 = document.querySelector("#color-gray-2")
const inputColorGray3 = document.querySelector("#color-gray-3")
const inputColorGray4 = document.querySelector("#color-gray-4")

const inputCheckBox = document.querySelector("#voronoi-noise-check")
let iTime = 0;

const params = document.querySelector(".params")
const btnReScale = document.querySelector("#btnReScale")
const btnReMoveX = document.querySelector("#btnReMoveX")
const btnReMoveY = document.querySelector("#btnReMoveY")
const btnReScaleX = document.querySelector("#btnReScaleX")
const btnReScaleY = document.querySelector("#btnReScaleY")
const btnReBrightness = document.querySelector("#btnReBrightness")
const btnReOnlyBri = document.querySelector("#btnReOnlyBrightness")
const btnReDelicate = document.querySelector("#btnReDelicate")
const btnReBroken = document.querySelector("#btnReBroken")
const btnReRefrec = document.querySelector("#btnReRefrec")
const btnReSharkX = document.querySelector("#btnReSharkX")
const btnReSharkY = document.querySelector("#btnReSharkY")
const btnReWarp = document.querySelector("#btnReWarp")
const btnReColorGray2 = document.querySelector("#btnReColorGray2")
const btnReColorGray3 = document.querySelector("#btnReColorGray3")
const btnReColorGray4 = document.querySelector("#btnReColorGray4")

// 传参列表
const materialPlane = new THREE.ShaderMaterial({
    vertexShader: VertShader,
    fragmentShader: FragShader,
    uniforms: {
        uvScale:   {value:   +inputScele.value     },
        uvMoveX:   {value:   +inputMoveX.value     },
        uvMoveY:   {value:   +inputMoveY.value     },
        uvScaleX:  {value:   +inputScaleX.value    },
        uvScaleY:  {value:   +inputScaleY.value    },
        brightness:{value:   +inputBrightness.value},
        iTime:     {value:   +iTime},
        onlyBri:   {value:   +inputOnlyBri.value},
        delicate:  {value:   +inputDelicate.value},
        broken:    {value:   +inputBroken.value},
        refrac:    {value:   +inputRefrac.value},
        sharkX:    {value:   +inputSharkX.value},
        sharkY:    {value:   +inputSharkY.value},
        warp:      {value:   +inputWarp.value},
        colorGray2:{value:   +inputColorGray2.value},
        colorGray3:{value:   +inputColorGray3.value},
        colorGray4:{value:   +inputColorGray4.value}
    }
})
// 监听传参数
params.addEventListener('input', (e) => {
    if(e.target.nodeName === "INPUT"){
        // 直接重新传递所有材质球的input参数
        materialPlane.uniforms.uvScale.value    = +inputScele.value,
        materialPlane.uniforms.uvMoveX.value    = +inputMoveX.value,
        materialPlane.uniforms.uvMoveY.value    = +inputMoveY.value,
        materialPlane.uniforms.uvScaleX.value   = +inputScaleX.value,
        materialPlane.uniforms.uvScaleY.value   = +inputScaleY.value,
        materialPlane.uniforms.brightness.value = +inputBrightness.value,
        materialPlane.uniforms.onlyBri.value    = +inputOnlyBri.value,
        materialPlane.uniforms.delicate.value   = +inputDelicate.value,
        materialPlane.uniforms.broken.value     = +inputBroken.value,
        materialPlane.uniforms.refrac.value     = +inputRefrac.value,
        materialPlane.uniforms.sharkX.value     = +inputSharkX.value,
        materialPlane.uniforms.sharkY.value     = +inputSharkY.value,
        materialPlane.uniforms.warp.value       = +inputWarp.value,
        materialPlane.uniforms.colorGray2.value = +inputColorGray2.value,
        materialPlane.uniforms.colorGray3.value = +inputColorGray3.value,
        materialPlane.uniforms.colorGray4.value = +inputColorGray4.value
    }
})
// 开关Noise动画模式
let timeClockId = setInterval(() => {
    iTime += 0.01
    materialPlane.uniforms.iTime.value = iTime
}, 10);
inputCheckBox.addEventListener('change', (e) =>{
    if(inputCheckBox.checked === false){
        clearInterval(timeClockId)
    }
    else{
        clearInterval(timeClockId)
        timeClockId = setInterval(() => {
            iTime += 0.01
            materialPlane.uniforms.iTime.value = iTime
        }, 10);
    }
})

// 按钮重置参数
btnReScale.addEventListener('click', () =>{
    materialPlane.uniforms.uvScale.value = 1
    inputScele.value = 1
})
btnReMoveX.addEventListener('click', () => {
    materialPlane.uniforms.uvMoveX.value = 0
    inputMoveX.value = 0
})
btnReMoveY.addEventListener('click', () => {
    materialPlane.uniforms.uvMoveY.value = 0
    inputMoveY.value = 0
})
btnReScaleX.addEventListener('click', () => {
    materialPlane.uniforms.uvScaleX.value = 1
    inputScaleX.value = 1
})
btnReScaleY.addEventListener('click', () => {
    materialPlane.uniforms.uvScaleY.value = 1
    inputScaleY.value = 1
})
btnReBrightness.addEventListener('click', () => {
    materialPlane.uniforms.brightness.value = 0
    inputBrightness.value = 0
})
btnReOnlyBri.addEventListener('click', () => {
    materialPlane.uniforms.onlyBri.value = 0.5
    inputOnlyBri.value = 0.5
})
btnReDelicate.addEventListener('click', () => {
    materialPlane.uniforms.delicate.value = 4
    inputDelicate.value = 4
})
btnReBroken.addEventListener('click', () => {
    materialPlane.uniforms.broken.value = 2
    inputBroken.value = 2
})
btnReRefrec.addEventListener('click', () => {
    materialPlane.uniforms.refrac.value = 0.5
    inputRefrac.value = 0.5
})
btnReSharkX.addEventListener('click', () => {
    materialPlane.uniforms.sharkX.value = 0.15
    inputSharkX.value = 0.15
})
btnReSharkY.addEventListener('click', () => {
    materialPlane.uniforms.sharkY.value = 0.126
    inputSharkY.value = 0.126
})
btnReWarp.addEventListener('click', () => {
    materialPlane.uniforms.warp.value = 1
    inputWarp.value = 1
})
btnReColorGray2.addEventListener('click', () => {
    materialPlane.uniforms.colorGray2.value = 0
    inputColorGray2.value = 0
})
btnReColorGray3.addEventListener('click', () => {
    materialPlane.uniforms.colorGray3.value = 0.3
    inputColorGray3.value = 0.3
})
btnReColorGray4.addEventListener('click', () => {
    materialPlane.uniforms.colorGray4.value = 0.6
    inputColorGray4.value = 0.6
})

const plane = new THREE.Mesh(planeGeo, materialPlane)
scene.add(plane)

camera.position.z = 6.5

setInterval(() => {
    renderer.render(scene, camera)
}, 100);
