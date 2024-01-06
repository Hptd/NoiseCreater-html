import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/太极_Fragment.js"

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
const inputOnlyBri = document.querySelector("#onlyBrightness")
const inputSpeed = document.querySelector("#speed")
const inputSharkX = document.querySelector("#sharkX")
const inputSharkY = document.querySelector("#sharkY")

const inputCheckBox = document.querySelector("#voronoi-noise-check")
const inputColorReserve = document.querySelector("#color-reverse")
const inputNoiseAlpha = document.querySelector("#use-alpha")
let iTime = 0;
let colorRev = false;

const params = document.querySelector(".params")
const btnReOnlyBri = document.querySelector("#btnReOnlyBrightness")
const btnReSpeed = document.querySelector("#btnReSpeed")
const btnReSharkX = document.querySelector("#btnReSharkX")
const btnReSharkY = document.querySelector("#btnReSharkY")

// 传参列表
const materialPlane = new THREE.ShaderMaterial({
    vertexShader: VertShader,
    fragmentShader: FragShader,
    uniforms: {
        iTime:     {value:   +iTime},
        onlyBri:   {value:   +inputOnlyBri.value},
        sharkX:    {value:   +inputSharkX.value},
        sharkY:    {value:   +inputSharkY.value},
        speed_:  {value:   +inputSpeed.value},
        colorRev:  {value:   colorRev},
        useAlpha:  {value:   inputNoiseAlpha.checked}
    }
})
// 监听传参数
params.addEventListener('input', (e) => {
    if(e.target.nodeName === "INPUT"){
        // 直接重新传递所有材质球的input参数
        materialPlane.uniforms.onlyBri.value    = +inputOnlyBri.value,
        materialPlane.uniforms.sharkX.value     = +inputSharkX.value,
        materialPlane.uniforms.sharkY.value     = +inputSharkY.value,
        materialPlane.uniforms.speed_.value   = +inputSpeed.value,
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
btnReOnlyBri.addEventListener('click', () => {
    materialPlane.uniforms.onlyBri.value = 1
    inputOnlyBri.value = 1
})
btnReSpeed.addEventListener('click', () => {
    materialPlane.uniforms.speed_.value = 1
    inputSpeed.value = 1
})
btnReSharkX.addEventListener('click', () => {
    materialPlane.uniforms.sharkX.value = 0.02
    inputSharkX.value = 0.02
})
btnReSharkY.addEventListener('click', () => {
    materialPlane.uniforms.sharkY.value = 0.12
    inputSharkY.value = 0.12
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
    saveAs(videoBlob, '太极.mp4')
    timeFlag.style.display = "none"
    timeFlag.innerHTML = "正在录制..."
})

setInterval(() => {
    renderer.render(scene, camera)
}, 40);