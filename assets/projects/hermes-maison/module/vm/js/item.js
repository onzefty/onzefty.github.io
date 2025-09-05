import EmitterMixin from "../../../common/content/js/lib/emitter-mixin.js";
import { EVENTS, getUuidv4 } from "../../../common/content/js/lib/utils.js";

function getHeight(item,count){
    const height = item.dimensions.height + count;
    if(item.containedBy){
        return getHeight(item.containedBy,height);
    }
    return height;
}

function getCount(item,count){
    if(item.containedBy){
        count++;
        return getCount(item.containedBy,count);
    }
    return count;
}

export default class Item extends EmitterMixin {
    static get CLICKED(){
        return 'Item.clicked';
    }
    constructor(options = {}){
        super();
        this.reference = options.reference;
        this.datas = options.datas;
        this.dimensionsDefault = options.dimensionsDefault;
        this.dimensionsRotate = options.dimensionsRotate;
        this.srcBottom = options.srcBottom;
        this.srcRotate = options.srcRotate;
        this.widthRatio = options.widthRatio;
        this.heightRatio = options.heightRatio;
    }

    get borders(){
        const borders = {colMin:Infinity,colMax:0,rowMin:Infinity,rowMax:0};
        if(this.boxes){
            this.boxes.forEach((box) => {
                borders.colMin = Math.min(borders.colMin,box.col);
                borders.colMax = Math.max(borders.colMax,box.col);
                borders.rowMin = Math.min(borders.rowMin,box.row);
                borders.rowMax = Math.max(borders.rowMax,box.row);
            });
        }
        return borders;
    }

    get adjacents(){
        const borders = this.borders;
        return {
            colMin:borders.colMin-1,
            colMax:borders.colMax+1,
            rowMin:borders.rowMin-1,
            rowMax:borders.rowMax+1
        }
    }

    get height(){
        return getHeight(this,0);
    }

    get count(){
        return getCount(this,0);
    }

    get dimensions(){
        if(this.state === "layed"){
            return this.dimensionsDefault;
        } else {
            return this.dimensionsRotate;
        }
    }

    get status(){
        return this.element.getAttribute("status");
    }

    set status(status){
        if(typeof status === "string"){
            this.element.setAttribute("status",status);
        }
    }

    get state(){
        return this.element.getAttribute("state");
    }

    set state(state){
        if(typeof state === "string"){
            this.element.setAttribute("state",state);
        }
    }

    async create(){
        this.element = document.createElement("div");
        const itemImg = document.createElement("img");
        const itemImgRotate = document.createElement("img");
        this.id = getUuidv4();
        this.element.className = "grid-item absolute";
        this.element.id = this.id;
        itemImg.src = this.srcBottom;
        itemImg.setAttribute("draggable","false");
        await this.loaded(itemImg);
        itemImgRotate.src = this.srcRotate;
        itemImgRotate.setAttribute("draggable","false");
        await this.loaded(itemImgRotate);
        itemImgRotate.classList.add("rotated");
        if(this.heightRatio){
            this.element.style.height = (this.heightRatio)+"%";
            itemImg.style.height = "100%";
            itemImgRotate.style.height = "100%";
        } else {
            this.element.style.width = (this.widthRatio)+"%";
            itemImg.style.width = "100%";
            itemImgRotate.style.width = "100%";
        }
        this.element.append(itemImg,itemImgRotate);
        this.status = "created";
        this.state = "layed";
    }

    remove(){
        if(this.movable){
            this.movable.enable = false;
            this.movable.removeEvents();
        }
        this.reset();
        this.element.remove();
    }

    reset(){
        if(this.boxes){
            this.boxes.forEach((box) => {
                box.reset();
            });
        }
        if(this.boxesPrev){
            this.boxesPrev.forEach((box) => {
                box.reset();
            });
        }
    }

    async loaded(img){
        return new Promise(resolve => {
            img.addEventListener(EVENTS.LOAD,()=>{
                resolve();
            })
        })
    }

}