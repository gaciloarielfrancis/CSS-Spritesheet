import Dropzone from "dropzone";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import JSZip from "jszip";

Dropzone.autoDiscover = false;

const dropZone = new Dropzone("#drop-area", {
    autoProcessQueue: false,
    dictDefaultMessage: "Drop files here<br>or click to browse to upload.",
    previewsContainer: "#previews",
    addRemoveLinks: true,
    dictRemoveFile: '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>',
    acceptedMimeTypes: "image/*",
});

dropZone.on("addedfiles", analyzeFiles);
dropZone.on("removedfile", analyzeFiles);

function analyzeFiles(file) {
    setTimeout(() => {
        document.querySelector("#convert-button").style.display = dropZone.files.length > 0 ? "block" : "none";
    }, 1000)
}

let isLanding = true, spriteData = [];

document.querySelector("#convert-button").onclick = switchPage;
document.querySelector("#back").onclick = switchPage;
document.querySelector("#export").onclick = exportImage;
document.querySelector("#padding").onchange = render;
document.querySelector("#max-width").onchange = render;

function switchPage() {
    isLanding = isLanding ? false : true;
    document.querySelector("#landing").setAttribute("class", isLanding ? "show" : "hide");
    document.querySelector("#editor").setAttribute("class", isLanding ? "hide" : "show");
    if(!isLanding) render();
}

function render() {
    const files = dropZone.files.sort((a, b) => b.height - a.height);
    const padding = parseInt(document.querySelector("#padding").value);
    const maxWidth = parseInt(document.querySelector("#max-width").value);
    let contentWidth = 0, contentHeight = 0;
    spriteData = [];

    const stg = document.querySelector("#stage");
    const parentWidth = document.querySelector("#stage-background").offsetWidth;
    stg.innerHTML = "";

    files.forEach(file => {
        const image = document.createElement("img");
        image.setAttribute("src", file.dataURL);
        const pos = analyzePosition(file, spriteData, padding, maxWidth);
        
        Object.assign(image.style, {
            left: pos.x + "px",
            top: pos.y + "px"
        });

        spriteData.push({
            x: pos.x, 
            y: pos.y,
            width: file.width,
            height: file.height,
            name: file.name.replace("." + file.type.split("/")[1], "")
        });

        if((pos.x + file.width) > contentWidth) contentWidth = pos.x + file.width;
        if((pos.y + file.height) > contentHeight) contentHeight = pos.y + file.height;

        document.querySelector("#stage").appendChild(image);
    });

    Object.assign(stg.style, {
        width: contentWidth + "px",
        height: contentHeight + "px",
        transform: contentWidth > parentWidth ? "scale(" + (parentWidth / contentWidth) + ")" : "scale(1)"
    });
}

function analyzePosition(file, images, padding, maxWidth) {
    let x = 0, y = 0, resY = 0;
    let map = [];

    for(let i = 0; i < images.length; i++) {
        map.push()
    }

    // for(let i = 0; i < images.length; i++) {
    //     const startPoint = images[i].x + images[i].width + padding;
    //     const endPoint = images[i].y + images[i].height + padding;
    //     const fileStartPoint = startPoint + file.width + padding;
    //     let spaceY = 0;

    //     for(let j = 0; j < images.length; j++) {
    //         if(startPoint >= images[j].x) {
    //             if((images[j].y + images[j].height + padding) <= images[i].y) {
    //                 spaceY = images[j].y + images[j].height + padding;
    //             }
    //         }
    //     }

    //     if(fileStartPoint < maxWidth) {
    //         x = startPoint;
    //         y = spaceY > 0 ? spaceY : images[i].y;
    //     }else{
    //         x = 0;
    //         y = resY;
    //     }

    //     if(endPoint > resY) {
    //         resY = endPoint;
    //     }
    // }

    return { x: x, y: y };
}

window.addEventListener("resize", render);

function exportImage() {
    const stage = document.querySelector("#stage");
    const currTransform = stage.style.transform;
    Object.assign(stage.style, {
        transform: "scale(1)"
    });
    html2canvas(stage, { backgroundColor: null, scale: 1 }).then(canvas => {
        Object.assign(stage.style, {
            transform: currTransform
        });
        downloadZip(canvas, stage.offsetWidth, stage.offsetHeight);
    });
}

function downloadZip(canvas, width, height) {
    const filename = document.querySelector("#filename").value !== "" ? document.querySelector("#filename").value : "spritesheet";
    const imageFormat = document.querySelector("#image-format").value;
    const prefix = document.querySelector("#prefix").value !== "" ? document.querySelector("#prefix").value : "sprite";
    const quality = parseFloat(document.querySelector("#image-quality").value) / 100;
    const imageData = canvas.toDataURL("image/" + imageFormat, quality).replace("data:image/" + imageFormat + ";base64,", "");

    let css =   '/*\n\n' +
                '@author: Ariel Francis Gacilo | gaciloarielfrancis@gmail.com\n\n' +
                'Inline:     <i class="' + prefix + '-imagename"></i>\n' +
                'Responsive: <div class="' + prefix + '-imagename"></div>\n\n' +
                '*/\n\n';
    
    spriteData.forEach(data => {
        css +=  '.' + prefix + '-' + data.name + ' {max-width:' + data.width + 'px; max-height:' + data.height + 'px; }\n' +
                '.' + prefix + '-' + data.name + '::after {' +
                    'content: "\\00a0";' +
                    'display: inline-block;' + 
                    'width:' + data.width + 'px;' +
                    'height:' + data.height + 'px;' +
                    'background-position: ' + ((data.x / (width - data.width)) * 100) + '% ' + ((data.y / (height - data.height)) * 100) + '%;' +
                    'background-size: ' + ((width / data.width) * 100) + '% ' + ((height / data.height) * 100) + '%;' +
                    'background-image: url(' + filename + '.' + imageFormat + ');' +
                    'padding: 0; }\n' +
                'div.' + prefix + '-' + data.name + '::after {max-width:' + data.width + 'px; width:100%;height:0;padding: 0 0 ' + ((data.height / data.width) * 100) + '% 0;}\n';
    });

    const zip = new JSZip();
    zip.file(filename + ".css", css);
    zip.file(filename + "." + imageFormat, imageData, { base64: true });
    zip.generateAsync({ type:"blob" }).then(function(content) {
        saveAs(content, filename + ".zip");
    });
}