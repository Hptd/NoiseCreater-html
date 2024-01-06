import * as THREE from "three" 
import VertShader from "./glsl/noiseVertex.js"
import FragShader from "./glsl/sampleNoiseFragment.js"

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

const inputNoiseAlpha = document.querySelector("#use-alpha")

// 传参列表
const materialPlane = new THREE.ShaderMaterial({
    vertexShader: VertShader,
    fragmentShader: FragShader,
    uniforms:{
        useAlpha: {value: inputNoiseAlpha.checked}
    }
})
// 监听传参数
const params = document.querySelector(".params")
params.addEventListener('input', (e) => {
    if(e.target.nodeName === "INPUT"){
        materialPlane.uniforms.useAlpha.value = inputNoiseAlpha.checked
    }
})

const plane = new THREE.Mesh(planeGeo, materialPlane)
scene.add(plane)

camera.position.z = 6.5

setInterval(() => {
    renderer.render(scene, camera)
}, 100);
