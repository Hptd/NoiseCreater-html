const noiseList = [{src: "../images/sampleNoise.png", title: "Sample Noise", href: "../html/sampleNoise.html"},
                   {src: "../images/sampleColorNoise.png", title: "Sample color Noise", href: "../html/sampleColorNoise.html"},
                   {src: "../images/cloudNoise.png", title: "Cloud Noise", href: "../html/cloudNoise.html"},
                   {src: "../images/sampleNoise_A.png", title: "sample Noise_A", href: "../html/sampleNoise_A.html"},
                   {src: "../images/sampleNoise_B.png", title: "sample Noise_B", href: "../html/sampleNoise_B.html"},
                   {src: "../images/voronoiWaterNoise.png", title: "voronoi Water Noise", href: "../html/voronoiWaterNoise.html"},
                   {src: "../images/tileableWaterNoise.png", title: "tileable Water Noise", href: "../html/tileableWaterNoise.html"},
                   {src: "../images/causticsWaterNoise.png", title: "caustics Water Noise", href: "../html/causticsWaterNoise.html"},
                   {src: "../images/glareWaterNoise.png", title: "glare Water Noise", href: "../html/glareWaterNoise.html"},
                   {src: "../images/forkedWaterNoise.png", title: "forked Water Noise", href: "../html/forkedWaterNoise.html"},
                   {src: "../images/rainWaterNoise.png", title: "rain Water Noise", href: "../html/rainWaterNoise.html"},
                   {src: "../images/smokeNoise.png", title: "smoke Noise", href: "../html/smokeNoise.html"},
                   {src: "../images/honeycompNoise_A.png", title: "honeycomp Noise_A", href: "../html/honeycompNoise_A.html"},
                   {src: "../images/honeycompNoise_B.png", title: "honeycomp Noise_B", href: "../html/honeycompNoise_B.html"},
                   {src: "../images/silkNoise.png", title: "silk Noise", href: "../html/silkNoise.html"},
                   {src: "../images/gridNoise.png", title: "grid Noise", href: "../html/gridNoise.html"},
                   {src: "../images/voroNoise.png", title: "voro Noise", href: "../html/voroNoise.html"},
                   {src: "../images/cellNoise_A.png", title: "cell Noise_A", href: "../html/cellNoise_A.html"},
                   {src: "../images/cellNoise_B.png", title: "cell Noise_B", href: "../html/cellNoise_B.html"},
                   {src: "../images/cellNoise_C.png", title: "cell Noise_C", href: "../html/cellNoise_C.html"},
                   {src: "../images/squircleColorNoise.png", title: "squircle color Noise", href: "../html/squircleColorNoise.html"},
                   {src: "../images/circleNoise_A.png", title: "circle Noise_A", href: "../html/circleNoise_A.html"},
                   {src: "../images/circleNoise_B.png", title: "circle Noise_B", href: "../html/circleNoise_B.html"},
                   {src: "../images/circleNoise_C.png", title: "circle Noise_C", href: "../html/circleNoise_C.html"},
                   {src: "../images/knitNoise_A.png", title: "knit Noise_A", href: "../html/knitNoise_A.html"},
                   {src: "../images/knitNoise_B.png", title: "knit Noise_B", href: "../html/knitNoise_B.html"},
                   {src: "../images/knitNoise_C.png", title: "knit Noise_C", href: "../html/knitNoise_C.html"},
                   {src: "../images/knitNoise_D.png", title: "knit Noise_D", href: "../html/knitNoise_D.html"},
                   {src: "../images/knitNoise_E.png", title: "knit Noise_E", href: "../html/knitNoise_E.html"},
                   {src: "../images/knitNoise_F.png", title: "knit Noise_F", href: "../html/knitNoise_F.html"},
                   {src: "../images/brushNoise_A.png", title: "brush Noise_A", href: "../html/brushNoise_A.html"},
                   {src: "../images/brushNoise_B.png", title: "brush Noise_B", href: "../html/brushNoise_B.html"},
                ]

// 根据noiseList创建列表对象
const ul = document.querySelector(".page .noise-list ul")
for(i=0; i<noiseList.length; i++){
    const li = document.createElement("li")
    li.innerHTML = `
        <img src=${noiseList[i].src}>
        <a href=${noiseList[i].href} target="_blank">${noiseList[i].title}</a>`
    ul.appendChild(li)
}

// 模拟点击链接效果
ul.addEventListener('click', e => {
    if(e.target.nodeName === "LI")
    {
        const a = e.target.childNodes[3]
        a.click()
    }
    else if(e.target.nodeName === "IMG")
    {
        const a = e.target.nextElementSibling
        a.click()
    }
})