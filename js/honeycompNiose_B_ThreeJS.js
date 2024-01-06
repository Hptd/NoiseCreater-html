import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/honeycompNoise_B_Fragment.js"

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
const inputDelicate = document.querySelector("#delicate")
const inputBroken = document.querySelector("#broken")

const inputCheckBox = document.querySelector("#voronoi-noise-check")
const inputColorReserve = document.querySelector("#color-reverse")
const inputNoiseAlpha = document.querySelector("#use-alpha")
let iTime = 0;
let colorRev = 0;

const params = document.querySelector(".params")
const btnReScale = document.querySelector("#btnReScale")
const btnReMoveX = document.querySelector("#btnReMoveX")
const btnReMoveY = document.querySelector("#btnReMoveY")
const btnReScaleX = document.querySelector("#btnReScaleX")
const btnReScaleY = document.querySelector("#btnReScaleY")
const btnReBrightness = document.querySelector("#btnReBrightness")
const btnReDelicate = document.querySelector("#btnReDelicate")
const btnReBroken = document.querySelector("#btnReBroken")

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
        delicate:  {value:   +inputDelicate.value},
        broken:    {value:   +inputBroken.value},
        colorRev:  {value:   colorRev},
        useAlpha:  {value:   inputNoiseAlpha.checked}
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
        materialPlane.uniforms.delicate.value   = +inputDelicate.value,
        materialPlane.uniforms.broken.value     = +inputBroken.value,
        materialPlane.uniforms.useAlpha.value   = inputNoiseAlpha.checked
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
    materialPlane.uniforms.uvScale.value = 30
    inputScele.value = 30
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
btnReDelicate.addEventListener('click', () => {
    materialPlane.uniforms.delicate.value = 3
    inputDelicate.value = 3
})
btnReBroken.addEventListener('click', () => {
    materialPlane.uniforms.broken.value = 2
    inputBroken.value = 2
})

const plane = new THREE.Mesh(planeGeo, materialPlane)
scene.add(plane)

camera.position.z = 6.5

// 视频录制模块
const btnVideoStart = document.querySelector("#videoStart")
const btnVideoStop = document.querySelector("#videoStop")

const canvas = document.querySelector("canvas")
const timeFlag = document.querySelector("#timeFlag")

let chunks = new Set()
const mediaStream = canvas.captureStream(25) // 设置帧频率(FPS)
const mediaRecord = new MediaRecorder(mediaStream, {
    videoBitsPerSecond: 8500000
})
mediaRecord.ondataavailable = (e) => { // 接收数据
    chunks.add(e.data)
}
let timerClock = 10
btnVideoStart.addEventListener('click', () => {
    // 每次开始之前清空上次结果
    chunks.clear()
    mediaRecord.start(40)
    timeFlag.style.display = "inline"
    const startTime = Date.now()
    timerClock = setInterval(() => {
        timeFlag.innerHTML = `已录制: ${parseInt((Date.now()-startTime)/1000)} 秒`
    }, 1000);
    
})
btnVideoStop.addEventListener('click', () => {
    mediaRecord.stop()
    const videoBlob = new Blob(chunks, { 'type': 'video/mp4' })
    clearInterval(timerClock)
    saveAs(videoBlob, 'Honeycomp Noise B.mp4')
    timeFlag.style.display = "none"
    timeFlag.innerHTML = "正在录制..."
})

setInterval(() => {
    renderer.render(scene, camera)
}, 40);
