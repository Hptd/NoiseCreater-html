import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/sampleNoise_B_Fragment.js"

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
const inputNoiseChooses = document.querySelectorAll(".noise-choose")
let noiseChooseValue = 1

const params = document.querySelector(".params")
const btnReScale = document.querySelector("#btnReScale")
const btnReMoveX = document.querySelector("#btnReMoveX")
const btnReMoveY = document.querySelector("#btnReMoveY")
const btnReScaleX = document.querySelector("#btnReScaleX")
const btnReScaleY = document.querySelector("#btnReScaleY")
const btnReBrightness = document.querySelector("#btnReBrightness")
// 传参列表
const materialPlane = new THREE.ShaderMaterial({
    vertexShader: VertShader,
    fragmentShader: FragShader,
    uniforms: {
        uvScale:   {value:   +inputScele.value    },
        uvMoveX:   {value:   +inputMoveX.value    },
        uvMoveY:   {value:   +inputMoveY.value    },
        uvScaleX:  {value:   +inputScaleX.value   },
        uvScaleY:  {value:   +inputScaleY.value   },
        brightness:{value:   +inputBrightness.value},
        noiseChooseValue:{value: noiseChooseValue}
    }
})
// 监听传参数
params.addEventListener('input', (e) => {
    if(e.target.nodeName === "INPUT"){
        // 直接重新传递所有材质球的input参数
        materialPlane.uniforms.uvScale.value    =    +inputScele.value,
        materialPlane.uniforms.uvMoveX.value    =    +inputMoveX.value,
        materialPlane.uniforms.uvMoveY.value    =    +inputMoveY.value,
        materialPlane.uniforms.uvScaleX.value   =    +inputScaleX.value,
        materialPlane.uniforms.uvScaleY.value   =    +inputScaleY.value,
        materialPlane.uniforms.brightness.value = +inputBrightness.value
    }
})
// Noise 类型选择
for(let i=0; i<inputNoiseChooses.length; i++){
    inputNoiseChooses[i].addEventListener('change', () => {
        if(inputNoiseChooses[i].checked === true){
            noiseChooseValue = inputNoiseChooses[i].value
            materialPlane.uniforms.noiseChooseValue.value = +noiseChooseValue
        }
    })
}

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

const plane = new THREE.Mesh(planeGeo, materialPlane)
scene.add(plane)

camera.position.z = 6.5

setInterval(() => {
    renderer.render(scene, camera)
}, 100);
