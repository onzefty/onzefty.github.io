import { EVENTS } from "../../../common/content/js/lib/utils.js";
import { getIntersection } from "../../../common/content/js/lib/dom.js";
import DragDropManager from "../../../common/content/js/components/drag-drop-manager.js";
import Component from "../../../common/content/js/components/component.js";
import ShelfManager from "../../../common/content/js/components/shelves/shelf-manager.js";
import Item from "./item.js";

//DOMS Elements
const analyzing = document.querySelector("#analyzing");
const vmContainer = document.querySelector("#vm-container");
const slots = vmContainer.querySelectorAll("#slots .slot");
const vmView = vmContainer.querySelector("#vm-view");

//Components
const analyzingComponent = new Component({element:analyzing})
const shelfMan = new ShelfManager({
    elements:slots,
    view:vmView
})
analyzingComponent.hide()

const items = ["plate-1","bowl-1","ball-1","mirror-1","pillow-1"]
const itemsAvailable = new Map()
const dropZones = document.querySelectorAll(".shelf");


export const sizes = (iPad) => {
    return {
        bgSize:{
            width:1125,
            height:iPad?1619:2436
        },
        dropSize:{
            width:918,
            height:iPad?96:141
        },
        dropPositions: [
            iPad?360:546,
            iPad?661:997,
            iPad?955:1439,
            iPad?1244:1875,
        ]
    }
}

export const calculateCoverSize = (originalWidth, originalHeight) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const windowRatio = windowWidth / windowHeight;
    const imageRatio = originalWidth / originalHeight;

    let newWidth, newHeight;

    if (imageRatio > windowRatio) {
        // Image is wider than the window
        newHeight = windowHeight;
        newWidth = originalWidth * (windowHeight / originalHeight);
    } else {
        // Image is taller than the window
        newWidth = windowWidth;
        newHeight = originalHeight * (windowWidth / originalWidth);
    }

    return { width: newWidth, height: newHeight };
}


export const handleResize = () => {
    console.log("@handleResize")
    console.log("width: ",window.innerWidth," // height: ",window.innerHeight)
    //const iPad = ()
    // const iPad = /iPad/i.test(navigator.userAgent)
    // const iPad = window.innerWidth >= 768
    // console.log("iPad => ",iPad)
    // const datas = sizes(iPad)
    // const {dropPositions, bgSize, dropSize} = datas
    // const dropWidthRatio = dropSize.width / bgSize.width;
    // const dropHeightRatio = dropSize.height / bgSize.height;
    // const currentBgSize = calculateCoverSize(bgSize.width, bgSize.height);
   
    // const newSize = {
    //     width: currentBgSize.width * dropWidthRatio,
    //     height: currentBgSize.height * dropHeightRatio,
    // };
    // //Calcul des tailles des zones de drops
    // dropZones.forEach((dropZone, i) => {
    //     const y =(dropPositions[i] * (currentBgSize.height / bgSize.height));
    //     dropZone.style.top = `${y}px`;

    //     dropZone.style.width = `${newSize.width}px`;
    //     dropZone.style.height = `${newSize.height}px`;
    // });
    //Calcul des tailles des objets (et leurs positions)
    for(const [key,datas] of itemsAvailable){
        const {px, element, size} = datas
        const {w} = size
        const {left,top} = px
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        element.style.width = `${dropZones[0].offsetWidth*w}px`
    }

}

export function checkSlots(drag,drop){
    const item = itemsAvailable.get(drag)
    const {size} = item
    const {d} = size
    const box = drag.getBoundingClientRect();
    const slots = drop.querySelectorAll(".slot")
    const target = {width:0,height:0}

    //Vérifiez si on superpose sur un objet
    for(const [element,datas] of itemsAvailable){
        if(datas.state === "posed" && element!=drag){
            const intersection = getIntersection(drag,element);
            if(intersection && datas.size.d==2){
                //Sauf un élément pouvant être mis devant
                drag.style.left = ""
                drag.style.top = ""
                return
            }
        }
    }

    item.setState("posed")
    item.drop = drop

    //Positionnement selon les données

    // Array.from(slots).forEach((slot) => {
    //     const intersection = getIntersection(drag,slot);
    //     if(intersection){
    //         const {width, height} = intersection
    //         const sum1 = width+height
    //         const sum2 = target.width+target.height
    //         if(sum1>=sum2){
    //             target.width = width
    //             target.height = height
    //             if(d === 2 && slot.getAttribute("row") === "1"){
    //                 const col = slot.getAttribute("col")
    //                 target.element = drop.querySelector(`[col='${col}'][row='2']`)
    //             } else {
    //                 target.element = slot
    //             }
                
    //         }
    //     }
    // });
    // if(target.element){
    //     const boxSlot = target.element.getBoundingClientRect();
    //     const row = target.element.getAttribute("row")
    //     const col = target.element.getAttribute("col")

    //     const left = boxSlot.left - (Math.max(box.width,boxSlot.width) - Math.min(box.width,boxSlot.width))
    //     const top = d===2 ? boxSlot.bottom - box.height - (boxSlot.height/2)  :  boxSlot.bottom - box.height

    //     drag.style.top = `${top}px`;
    //     drag.style.left = `${left}px`;
    //     target.element.setAttribute("full","true")
    // }
}

export function initDragDrop(){
    const dragDropManager = new DragDropManager({
        onUp:checkSlots,
        onDown:(drag) => {
            const item = itemsAvailable.get(drag)
            item.setState("unposed")
        }
    });
    document.querySelectorAll(".item").forEach(dragDropManager.addDrag);
    dropZones.forEach(dragDropManager.addDrop);
}

/* SLOTS */

function init(){
    shelfMan.init()
    console.log(shelfMan)
    // items.forEach((id) => {
    //     const item = new Item(id)
    //     const {src,size,element} = item
    //     const {w} = size
    //     element.style.width = `${dropZones[0].offsetWidth*w}px`
    //     element.src = "imgs/vm/"+src
    //     vmContainer.append(element)
    //     itemsAvailable.set(element,item)
    // })
    // initDragDrop()
}

//window.addEventListener(EVENTS.RESIZE, handleResize);
//handleResize();
init();