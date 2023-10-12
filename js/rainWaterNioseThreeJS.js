import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/rainWaterNoiseFragment.js"

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
const inputColorChoose2 = document.querySelector("#color-choose-2")
const inputNoiseEleSize = document.querySelector("#noise-element-size")
const inputNoiseDetail = document.querySelector("#noise-detail")
const inputNoiseAlpha = document.querySelector("#noise-alpha")
const inputNoiseDensity = document.querySelector("#noise-density")

const inputCheckBox = document.querySelector("#voronoi-noise-check")
const inputColorReserve = document.querySelector("#color-reverse")
let iTime = 0;
let colorRev = false;

const params = document.querySelector(".params")
const btnReScale = document.querySelector("#btnReScale")
const btnReMoveX = document.querySelector("#btnReMoveX")
const btnReMoveY = document.querySelector("#btnReMoveY")
const btnReScaleX = document.querySelector("#btnReScaleX")
const btnReScaleY = document.querySelector("#btnReScaleY")
const btnReBrightness = document.querySelector("#btnReBrightness")
const btnReOnlyBri = document.querySelector("#btnReOnlyBrightness")
const btnReNoiseElementSize = document.querySelector("#btnReNoiseElementSize")
const btnReNoiseDetail = document.querySelector("#btnReNoiseDetail")
const btnReNoiseAlpha = document.querySelector("#btnReNoiseAlpha")
const btnReNoiseDensity = document.querySelector("#btnReNoiseDensity")

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
        eleSize:   {value:   +inputNoiseEleSize.value},
        detail:   {value:   +inputNoiseDetail.value},
        alpha:   {value:   +inputNoiseAlpha.value},
        density:   {value:   +inputNoiseDensity.value},
        colorRev:  {value:   colorRev}
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
        materialPlane.uniforms.eleSize.value    = +inputNoiseEleSize.value,
        materialPlane.uniforms.detail.value    = +inputNoiseDetail.value,
        materialPlane.uniforms.alpha.value    = +inputNoiseAlpha.value,
        materialPlane.uniforms.density.value    = +inputNoiseDensity.value
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
// 颜色取反按钮
inputColorReserve.addEventListener('change', () => {
    if(inputColorReserve.checked){
        materialPlane.uniforms.colorRev.value = 1
    }
    else{
        materialPlane.uniforms.colorRev.value = 0
    }
})

// 按钮重置参数
btnReScale.addEventListener('click', () =>{
    materialPlane.uniforms.uvScale.value = 4
    inputScele.value = 4
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
    materialPlane.uniforms.onlyBri.value = 6.5
    inputOnlyBri.value = 6.5
})
btnReNoiseElementSize.addEventListener('click', () => {
    materialPlane.uniforms.eleSize.value = 4
    inputNoiseEleSize.value = 4
})
btnReNoiseDetail.addEventListener('click', () => {
    materialPlane.uniforms.detail.value = 3
    inputNoiseDetail.value = 3
})
btnReNoiseAlpha.addEventListener('click', () => {
    materialPlane.uniforms.alpha.value = 3.5
    inputNoiseAlpha.value = 3.5
})
btnReNoiseDensity.addEventListener('click', () => {
    materialPlane.uniforms.density.value = 3
    inputNoiseDensity.value = 3
})

const plane = new THREE.Mesh(planeGeo, materialPlane)
scene.add(plane)

camera.position.z = 6.5

setInterval(() => {
    renderer.render(scene, camera)
}, 100);