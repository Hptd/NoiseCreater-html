const noiseList = [{src: "../images/sampleNoise.png", title: "Sample Noise", href: "../html/sampleNoise.html"},
                   {src: "../images/cloudNoise.png", title: "Cloud Noise", href: "../html/cloudNoise.html"}
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