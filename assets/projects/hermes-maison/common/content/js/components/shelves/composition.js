import EmitterMixin from "../../lib/emitter-mixin.js";
import { compositionGridSize } from "../../../../../module/vm/js/view.js";
import { COLORSDATAS } from "../../../../../module/vm/js/rules.js";
import Movable from "../movable.js";

export default class Composition extends EmitterMixin {
    static get ITEM_ADD(){
        return 'Composition.itemAdd';
    }
    static get ITEM_DELETE(){
        return 'Composition.itemDelete';
    }
    static get IS_FULL(){
        return 'Composition.isFull';
    }
    static get IS_CLICKED(){
        return 'Composition.isClicked';
    }
    static get DOWN(){
        return 'Composition.down';
    }
    static get UP(){
        return 'Composition.up';
    }
    static get MOVE(){
        return 'Composition.move';
    }
    static get NOMOVE(){
        return 'Composition.noMove';
    }
    static get DROPPED(){
        return 'Composition.dropped';
    }
    constructor(props = {}){
        super()
        this.options = {
            element:null,
            ...props
        }

        this.items = [];
        this.addEvents();
    }

    get name(){
        return this.options.element.getAttribute("name");
    }

    get id(){
        return this.options.element.id;
    }

    get level(){
        return parseInt(this.options.element.getAttribute("level"));
    }

    get axis(){
        return this.options.element.getAttribute("axis");
    }

    get hasItem(){
        return this.items.length > 0;
    }

    get source(){
        const {element} = this.options;
        const img = element.querySelector("img:not(.up)");
        if(img){
            return img.src;
        }
    }

    get sourceUp(){
        const {element} = this.options;
        const img =  element.querySelector("img.up");
        if(img){
            return img.src;
        }
    }

    get moving(){
        return this.movable.moving;
    }

    get height(){
        let height = 0;
        this.items.forEach((item)=>{
            height = Math.max(item.height,height);
        });
        return height;
    }

    get type(){
        // console.log("----------------------------------");
        // console.log(this.name);
        const {yMin, yMax, xMin, xMax} = this.surface;
        const gapY = yMax - yMin;
        const gapX = xMax - xMin;
        let yAxis = 0;
        let pyramidalFlag = false;
        let containedByCount = 0;
        this.items.forEach((item)=>{
            const {height, containedBy, borders, datas, state, dimensions, count} = item;
            const {tags} = datas;
            const value = (containedBy) ? (borders.rowMax - borders.rowMin) + height  :  gapY + height;
            yAxis = Math.max(yAxis,value);
            if((state === "face" && datas.rotable === "y" && dimensions.height > dimensions.width) || tags.includes("pyramidal") || (count > 1 || count > 0 && tags.includes("plaid"))){
                pyramidalFlag = true;
            }
            if(count > 2){
                console.log(item);
            }
            if(containedBy){
                containedByCount++;
            }
        });
        const isPyramidal = pyramidalFlag === true || (yAxis >= 7 && yAxis > gapX && this.items.length > 1);
        // console.log(yAxis,gapX);
        // console.log("pyramidalFlag",pyramidalFlag); 
        // console.log("isPyramidal",isPyramidal);
        // console.log("----------------------------------");
        return isPyramidal === true ? "pyramidal" : "horizontal";
    }

    get colors(){
        const array = [];
        this.items.forEach((item)=>{
            const {datas} = item;
            const {colors} = datas;
            //if(!array.includes(...colors)){
                array.push(...colors)
            //}
        });
        return array;
    }

    get rooms(){
        const array = [];
        this.items.forEach((item)=>{
            const {datas} = item;
            const {rooms = []} = datas;
            if(!array.includes(...rooms)){
                array.push(...rooms)
            }
        });
        return array;
    }

    get hasExceptionnal(){
        return this.items.filter((item)=>{
            const {datas} = item;
            const {tags} = datas;
            return tags.includes("exceptionnel","solo")
        }).length > 0
    }

    get isTemplate(){
        return this.items.filter((item)=>item.template).length > 0
    }

    get surface(){
        const rect = {xMin:Infinity,xMax:0,yMin:Infinity,yMax:0};
        this.items.forEach((item)=>{
            const {borders, containedBy, height} = item;
            if(!containedBy){
                rect.yMin = Math.min(rect.yMin,borders.rowMin);
                rect.yMax = Math.max(rect.yMax,borders.rowMax);
                // const valueH = Math.abs(borders.rowMax - compositionGridSize.rows) + height;
                // rect.yMax = Math.max(rect.yMax,valueH);
                // rect.yMin = Math.min(rect.yMin,Math.abs(borders.rowMax - compositionGridSize.rows));

            } else {
                // const {grid} = containedBy;
                // const {rows} = grid.options;
                // const valueH = Math.abs(borders.rowMin - rows) + height;
                // rect.yMax = Math.max(rect.yMax,valueH);
                // rect.yMin = Math.min(rect.yMin,Math.abs(borders.rowMax - rows));
            }
            rect.xMin = Math.min(rect.xMin,borders.colMin);
            rect.xMax = Math.max(rect.xMax,borders.colMax);
        });
        return rect;
    }

    get boxesRatio(){
        const boxesFulls = [];
        const total = compositionGridSize.rows * compositionGridSize.cols(this.level);
        this.items.forEach((item)=>{
            const {boxes,containedBy} = item;
            if(!containedBy){
                boxes.forEach((box)=>{
                    if(!boxesFulls.includes(box)){
                        boxesFulls.push(box);
                    }
                });
            }
        });
        return boxesFulls.length/total*100;
    }

    addSrc(src,className){ 
        const {element} = this.options;
        let img = typeof className === "string" ? element.querySelector("."+className) : element.querySelector("img:not(.up)");
        if(!img && !src){
            return;
        }
        else if (img && !src){
            element.innerHTML = "";
            return;
        }
        if(!img){
            img = document.createElement("img");
            if(typeof className === "string"){
                img.className = className;
            }
            element.append(img);
        }
        img.src = src;
    }

    removeSrc(){
        const {element} = this.options;
        const img = element.querySelector("img");
        if(img){
            img.src = "";
        }
    }

    clear(){
        this.items = [];
        this.removeSrc();
    }

    addEvents(){
        const {element} = this.options;
        this.movable = new Movable({
            element:element,
            positionsReceiver:element.parentNode.parentNode,
            boundaries:{
                x:{min:element.parentNode.parentNode,max:element.parentNode.parentNode},
                y:{min:element.parentNode.parentNode.querySelector("#slot-1"),max:element.parentNode.parentNode}
            }
            //boundaries:element.parentNode.parentNode
        });
        //console.log(this.movable.options.boundaries);
        this.movable.on(this.movable.events.DOWN,()=>{
            if(!this.hasItem || this.isTemplate){
                this.movable.disabled = true;
            }
            this.emit(Composition.DOWN);
        });
        this.movable.on(this.movable.events.MOVE,()=>{
            element.style["z-index"] = 5;
            this.emit(Composition.MOVE);
        });
        this.movable.on(this.movable.events.UP_NOMOVE,()=>{
            element.style["z-index"] = "";
            this.emit(Composition.NOMOVE);
        });
        this.movable.on(this.movable.events.UP,()=>{
            element.style["z-index"] = "";
            this.emit(Composition.DROPPED);
        });
    }

    removeEvents(){
        const {element} = this.options;
    }
}