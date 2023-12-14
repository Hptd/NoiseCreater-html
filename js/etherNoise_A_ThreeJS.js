import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/etherNoise_A_Fragment.js"

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
const inputBrightness = document.querySelector("#brightness")
const inputColorChoose1 = document.querySelector("#color-choose-1")
const inputOnlyBri = document.querySelector("#onlyBrightness")
const inputHue = document.querySelector("#hue")
const inputSaturate = document.querySelector("#saturate")
const inputSpeed = document.querySelector("#speed")
const inputSharkX = document.querySelector("#sharkX")
const inputSharkY = document.querySelector("#sharkY")

const inputCheckBox = document.querySelector("#voronoi-noise-check")
const inputColorReserve = document.querySelector("#color-reverse")
const inputColorRemove = document.querySelector("#color-remove")
let iTime = 0;
let colorRev = false;
let colorRem = false;

const params = document.querySelector(".params")
const btnReScale = document.querySelector("#btnReScale")
const btnReBrightness = document.querySelector("#btnReBrightness")
const btnReColor1 = document.querySelector("#btnReColorChoose1")
const btnReOnlyBri = document.querySelector("#btnReOnlyBrightness")
const btnReHue = document.querySelector("#btnReHue")
const btnReSaturate = document.querySelector("#btnReSaturate")
const btnReSpeed = document.querySelector("#btnReSpeed")
const btnReSharkX = document.querySelector("#btnReSharkX")
const btnReSharkY = document.querySelector("#btnReSharkY")

// 传参列表
const materialPlane = new THREE.ShaderMaterial({
    vertexShader: VertShader,
    fragmentShader: FragShader,
    uniforms: {
        uvScale:   {value:   +inputScele.value     },
        brightness:{value:   +inputBrightness.value},
        iTime:     {value:   +iTime},
        onlyBri:   {value:   +inputOnlyBri.value},
        color1:    {value:   hexToRgb(inputColorChoose1.value)},
        sharkX:    {value:   +inputSharkX.value},
        sharkY:    {value:   +inputSharkY.value},
        hue:  {value:   +inputHue.value},
        saturate:  {value:   +inputSaturate.value},
        speed_:  {value:   +inputSpeed.value},
        colorRev:  {value:   colorRev},
        colorRem:  {value:   colorRem}
    }
})
// 监听传参数
params.addEventListener('input', (e) => {
    if(e.target.nodeName === "INPUT"){
        // 直接重新传递所有材质球的input参数
        materialPlane.uniforms.uvScale.value    = +inputScele.value,
        materialPlane.uniforms.brightness.value = +inputBrightness.value,
        materialPlane.uniforms.onlyBri.value    = +inputOnlyBri.value,
        materialPlane.uniforms.color1.value     = hexToRgb(inputColorChoose1.value),
        materialPlane.uniforms.sharkX.value     = +inputSharkX.value,
        materialPlane.uniforms.sharkY.value     = +inputSharkY.value,
        materialPlane.uniforms.hue.value   = +inputHue.value,
        materialPlane.uniforms.saturate.value   = +inputSaturate.value,
        materialPlane.uniforms.speed_.value   = +inputSpeed.value
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
// 去色按钮
inputColorRemove.addEventListener('change', () => {
    if(inputColorRemove.checked)
    {
        materialPlane.uniforms.colorRem.value = true
    }
    else{
        materialPlane.uniforms.colorRem.value = false
    }
})

// 按钮重置参数
btnReScale.addEventListener('click', () =>{
    materialPlane.uniforms.uvScale.value = 5
    inputScele.value = 5
})
btnReBrightness.addEventListener('click', () => {
    materialPlane.uniforms.brightness.value = 0
    inputBrightness.value = 0
})
btnReColor1.addEventListener('click', () => {
    materialPlane.uniforms.color1.value = hexToRgb("#1A4D66")
    inputColorChoose1.value = "#1A4D66"
})
btnReOnlyBri.addEventListener('click', () => {
    materialPlane.uniforms.onlyBri.value = 2
    inputOnlyBri.value = 2
})
btnReHue.addEventListener('click', () => {
    materialPlane.uniforms.hue.value = 0.4
    inputHue.value = 0.4
})
btnReSaturate.addEventListener('click', () => {
    materialPlane.uniforms.saturate.value = 0.3
    inputSaturate.value = 0.3
})
btnReSpeed.addEventListener('click', () => {
    materialPlane.uniforms.speed_.value = 1
    inputSpeed.value = 1
})
btnReSharkX.addEventListener('click', () => {
    materialPlane.uniforms.sharkX.value = 2
    inputSharkX.value = 2
})
btnReSharkY.addEventListener('click', () => {
    materialPlane.uniforms.sharkY.value = 0.5
    inputSharkY.value = 0.5
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
    saveAs(videoBlob, 'Ether Noise A.mp4')
    timeFlag.style.display = "none"
    timeFlag.innerHTML = "正在录制..."
})

setInterval(() => {
    renderer.render(scene, camera)
}, 40);

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);   
    result =  result ? {       
        r: parseInt(result[1], 16),              
        g: parseInt(result[2], 16),       
        b: parseInt(result[3], 16)   
    } : null;
    return new THREE.Vector3(result.r/256, result.g/256, result.b/256)
}