import EmitterMixin from "../../../common/content/js/lib/emitter-mixin.js";
import Component from "../../../common/content/js/components/component.js";
import Scrollable from "../../../common/content/js/components/scrollable.js";
import Movable from "../../../common/content/js/components/movable.js";
import { EVENTS, isObject, isDefined } from "../../../common/content/js/lib/utils.js";
import Grid from "../../../common/content/js/components/shelves/grid.js";
import { getIntersection, getRect } from "../../../common/content/js/lib/dom.js";
import Item from "./item.js";

export const CATEGORIES = ["textile","decoration","table"];
const categoryDefault = "decoration";
const gridHeight = (level) => level===1?10:8;
let viewEl = null;

const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const {target} = entry;
            const src = target.getAttribute("data-src");
            target.src = src;
            observer.unobserve(target);
        }
    });
};

export const compositionGridSize = {
    width: (level) => level===1?85:60,
    height: (level) => level===1?60:45,
    depth: 50,
    rows:6,
    cols:(level) => level===1?13:10,
}

function convertToGrid(obj = {}){
    const {size, cols, rows, level, tags} = obj;
    let width = Math.ceil((size.width/compositionGridSize.width(level)*100)/100*cols);
    let height = Math.ceil((size.height/compositionGridSize.height(level)*100)/100*gridHeight(level));
    let depth = Math.ceil((size.depth/compositionGridSize.depth*100)/100*rows);
    // let width = (size.width/compositionGridSize.width(level)*100)/100*cols;
    // let height = Math.ceil((size.height/compositionGridSize.height(level)*100)/100*gridHeight(level));
    // let depth = Math.ceil((size.depth/compositionGridSize.depth*100)/100*rows);
    // //TEMP 
    // console.log(width)
    // if(getDecimal(width) > 0.4){
    //     width = Math.ceil(width);
    // } else {
    //     width = Math.floor(width);
    // }
    
    if(tags && tags.includes("coussin")){
        width = Math.floor((size.width/compositionGridSize.width(level)*100)/100*cols);
    }
    if(width === 1){
        width = 2;
    }
    return {
        width,
        height,
        depth,
    }
}

function getDecimal(num){
    return num - Math.trunc(num);
}

export default class View extends EmitterMixin {
    static get ITEM_CLICKED(){
        return 'View.itemClicked';
    }
    static get ITEM_PLACED(){
        return 'View.itemPlaced';
    }
    static get ITEM_DELETED(){
        return 'View.itemDeleted';
    }
    static get SCREENSHOT(){
        return 'View.screenshot';
    }
    constructor(props = {}){
        super()
        this.options = {
            element:[],
            ...props
        }
        const {element} = this.options;
        this.component = new Component({element:element});
        this.topEl = element.querySelector("#vm-view-top");
        this.buttons = element.querySelector("#vm-view-buttons");
        this.buttonClose = this.buttons.querySelector("#vm-view-close");
        this.buttonDelete = this.buttons.querySelector("#vm-view-delete");
        this.buttonRotate = this.buttons.querySelector("#vm-view-rotate");
        this.composition = element.querySelector("#vm-view-shelf");
        this.gridMain = element.querySelector("#vm-view-grid");
        this.categoryButtons = element.querySelectorAll("[category]");
        this.itemsContent = element.querySelector("#vm-view-items .content");
        this.itemsScrollable = this.itemsContent.querySelector(".scrollable");
        this.observer = new IntersectionObserver(handleIntersection,{
            root: this.itemsContent,
            rootMargin: '0px'
        });
        this.grid = new Grid({
            element:this.gridMain,
            rows:compositionGridSize.rows,
            cols:compositionGridSize.cols(1)
        });
        this.category = categoryDefault;
        this.itemSelected = null;
        this.items = [];
        this.handleCategoryClick = this.categoryClick.bind(this);
        this.handleItemDisplayClick = this.itemDisplayClick.bind(this);
        this.handleItemClick = this.itemClick.bind(this);
        this.handleItemDelete = this.itemDelete.bind(this);
        this.handleItemRotate = this.itemRotate.bind(this);
        this.handleGridDown = this.gridDown.bind(this);
        this.handleGridMove = this.gridMove.bind(this);
        this.handleGridUp = this.gridUp.bind(this);
        this.handleClose = this.close.bind(this);

        viewEl = this.composition;

        this.init();
        this.addEvents();
    }

    categoryDisplay(){
        this.itemUnClick();
        const categoryButton = this.options.element.querySelector("[category='"+this.category+"'");
        categoryButton.setAttribute("state","selected");
        const items = this.getItems({category:this.category});
        const {names} = this.options;
        this.itemsScrollable.innerHTML = "";
        let count = 0;

        for(const reference in items){
            const itemDatas = items[reference];
            const {name,tags,rotable}= itemDatas;
            const img = reference.replace(/\s/g,"");
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";
            if(tags.includes("exceptionnel","solo")){
                itemDiv.setAttribute("exceptionnal",true);
            }
            itemDiv.setAttribute("data-reference",reference);
            const itemImg = document.createElement("img");
            itemImg.setAttribute("draggable",false);
            const src = rotable === "y" ? "imgs/items/"+img+"_face.webp" : rotable === "x" ? "imgs/items/"+img+"_profile.webp" : "imgs/items/"+img+".webp"
            itemImg.setAttribute("data-src",src);
            const itemP = document.createElement("p");
            // itemP.innerHTML = names.get(reference+"-name");
            itemP.innerHTML = name;
            itemP.setAttribute("json",reference+"-name");
            itemDiv.addEventListener(EVENTS.CLICK_TOUCH, this.handleItemDisplayClick,true);
            itemDiv.append(itemImg,itemP);
            this.itemsScrollable.appendChild(itemDiv);
            void itemDiv.offsetWidth;
            itemDiv.style.translate = "0% 0%";
            itemDiv.style.opacity = 1;
            itemDiv.style["transition-delay"] = (count*0.1)+"s";
            this.observer.observe(itemImg);
            count++;
        }

        this.itemRemove();

        if(!this.scrollable){
            this.scrollable = new Scrollable({
                element:this.itemsScrollable,
                cursor: true
            });
            this.scrollable.on(this.scrollable.events.MOVE,()=>{
                const children = this.itemsScrollable.children;
                for(let c=1; c<=children.length; c++){
                    const child = children[c-1];
                    child.setAttribute("disabled","true");
                }
            });
            this.scrollable.on(this.scrollable.events.UP,()=>{
                setTimeout(()=>{
                    const children = this.itemsScrollable.children;
                    for(let c=1; c<=children.length; c++){
                        const child = children[c-1];
                        child.setAttribute("disabled","false");
                    }
                },10)
            });
        } else {
            this.scrollable.reset();
        }
    }

    categoryClick(e){
        const {currentTarget} = e;
        const category = currentTarget.getAttribute("category");
        
        if(category===this.category){
            return;
        }
        this.category = category;

        const selectedButton = currentTarget.parentNode.querySelector("[state='selected']");
        if(selectedButton){
            selectedButton.removeAttribute("state");
        }

        this.categoryDisplay();
    }

    itemUnClick(){
        this.items.forEach((item) => {
            const condition = true;
            if(item.status === "clicked" && condition){
                item.status = "normal";
            }
        });
    }

    itemRemove(){
        if(!this.itemSelected){
            return;
        }
        this.itemSelected.remove();    
        this.itemSelected = null;
    }

    itemDelete(){
        if(this.itemSelected){
            this.itemRemove();
        } 
        this.items = this.items.filter((item) => {
            const {containedBy, status} = item;
            if(status === "clicked" || (containedBy && containedBy.status === "clicked")){
                item.remove();
            } else {
                return item;
            }
        });
        this.updateButtons();
        this.emit(View.ITEM_DELETED);
    }

    itemRotate(){
        if(!this.itemSelected){
            return;
        }
        const {datas,state,element,widthRatio} = this.itemSelected;
        const {rotable, size} = datas;

        if(rotable){
            let stateNew;
            if(state === "layed" && (isObject(rotable)||rotable==="y")){
                stateNew = "face";
            }
            else if(state === "layed" && rotable==="x"){
                stateNew = "profile";
            } else {
                stateNew = "layed";
            }
            this.itemSelected.state = stateNew;
            this.buttonRotate.setAttribute("state",stateNew);
        }
    }

    async itemCreate(reference){
        const {items} = this.options;
        const itemDatas = items[reference];
        const {size, rotable, tags} = itemDatas;
        const img = reference.replace(/\s/g,"");
        const srcBottom = "imgs/items/"+img+".webp";
        let srcRotate;

        const dimensionsDefault = convertToGrid({
            size:size,
            rows:this.grid.options.rows,
            cols:this.grid.options.cols,
            tags,
            level:this.level
        });

        let dimensionsRotate;
        let heightRatio;

        if(isDefined(rotable)){
            if(isObject(rotable)){
                dimensionsRotate = convertToGrid({
                    size:rotable,
                    rows:this.grid.options.rows,
                    cols:this.grid.options.cols,
                    level:this.level
                });
                srcRotate = "imgs/items/"+img+"_face.webp";
            } else {
                const dimensions = {...size};
                switch(rotable){
                    case "y":
                        dimensions.height = size.depth;
                        dimensions.depth = size.height;
                    break;

                    case "x":
                        dimensions.width = size.depth;
                        dimensions.depth = size.width;
                    break;
                }
                dimensionsRotate = convertToGrid({
                    size:dimensions,
                    rows:this.grid.options.rows,
                    cols:this.grid.options.cols,
                    tags,
                    level:this.level
                });
                srcRotate = rotable === "y" ? "imgs/items/"+img+"_face.webp" : "imgs/items/"+img+"_profile.webp";
                if(rotable === "x"){
                    heightRatio = dimensions.height/compositionGridSize.height(this.level)*100;
                }
            } 
        } else {
            srcRotate = srcBottom;
        }
        const width = size.width;
        const widthRatio = width/compositionGridSize.width(this.level)*100;
        const item = new Item({
            reference, datas:itemDatas,
            srcBottom, srcRotate, widthRatio, heightRatio, dimensionsDefault, dimensionsRotate
        });
        await item.create();
        this.composition.appendChild(item.element);
        //Placement au centre
        item.element.style.left = "calc(50% - "+(item.element.offsetWidth/2)+"px)";
        //Évémenent du déplacement de l'objet sur les grids
        const movable = new Movable({
            element:item.element,
            boundaries:this.topEl,
        });
        movable.on(movable.events.DOWN,this.handleGridDown);
        movable.on(movable.events.MOVE,this.handleGridMove);
        movable.on(movable.events.UP,this.handleGridUp);
        movable.on(movable.events.UP_NOMOVE,this.handleItemClick);
        item.movable = movable;
        item.place = this.itemPlace;
        return item;
    }

    itemPlace(){
        const {boxes,element,dimensions,containedBy,datas,state} = this;
        const {containable} = datas;
        //const elementReal = element;
        const {depth} = dimensions;
        const elems = boxes.map((box) => {return box.element});
        const rect = getRect(elems);
        // const boxBottom = elementReal.getBoundingClientRect();
        // const boxTop = elementReal.getBoundingClientRect();
        // const height = Math.max(boxBottom.height,boxTop.height);
        //const width = boxBottom.width;
        const box = element.getBoundingClientRect();
        const {width, height} = box;
        const parentBox = viewEl.getBoundingClientRect();
        const x = rect.left + ((rect.width - width)/2) - parentBox.left;
        //const y = depth===1 ? rect.bottom - height - parentBox.top : rect.bottom - height - (rect.height/(depth*2)) - parentBox.top;
        const y = rect.bottom - height - parentBox.top;
        const percentX = x/element.parentNode.offsetWidth*100;
        const percentY = y/element.parentNode.offsetHeight*100;
        element.style.left = percentX+"%";
        element.style.top = percentY+"%";
        element.setAttribute("row",boxes[0].row);
        if(containedBy){
            const zIndex = parseInt(window.getComputedStyle(containedBy.element).getPropertyValue("z-index"));
            element.style["z-index"] = boxes[0].row + zIndex;
        }

        if(containable && state !=="face"){
            const gridEl = document.createElement("div");
            gridEl.className = "absolute grid";
            gridEl.style.width = containable.width;
            gridEl.style.height = containable.height;
            gridEl.style.left = containable.left;
            gridEl.style.bottom = containable.bottom;
            element.appendChild(gridEl);
            this.grid = new Grid({
                element:gridEl,
                ...containable
            });
        }
    }

    async itemDisplayClick(e){
        console.log("@itemDisplayClick")
        e.preventDefault();
        e.stopPropagation();
        const {currentTarget} = e;
        const disabled = currentTarget.getAttribute("disabled");
        
        if(disabled === "true"){
            return;
        }
        this.itemUnClick();
        const reference = currentTarget.getAttribute("data-reference");
        if(this.itemSelected && this.itemSelected.status === "created"){
            this.itemSelected.remove();
        }
        this.itemSelected = await this.itemCreate(reference);
        // console.log(this.itemSelected)
        this.updateButtons();
        this.emit(View.ITEM_CLICKED);
    }

    getItems(options = {}){
        const {items} = this.options;
        const toReturn = {...items};

        for(const ref in toReturn){
            const item = toReturn[ref];
            for(const prop in options){
                const datas = options[prop];
                const itemDatas = item[prop];
                if(Array.isArray(itemDatas)){
                    const compare = !Array.isArray(datas) ? [datas] : datas;
                    const filtered = itemDatas.filter((d) => compare.indexOf(d)!==-1).length===0
                    if(filtered){
                        delete toReturn[ref];
                    }
                } else {
                    if(datas!=itemDatas){
                        delete toReturn[ref];
                    }
                }
            }
        }

        return toReturn;
    }

    gridDown(e){
        const currentId = e.target.options.element.id;
        const itemSelected = this.items.filter((item) => item.id === currentId)[0];
        const conditionSelected1 = this.itemSelected && this.itemSelected.template;
        const conditionSelected2 = itemSelected && itemSelected.template;
        if(conditionSelected1){
            this.itemSelected.movable.disabled = true;
            return;
        }
        if(conditionSelected2){
            itemSelected.movable.disabled = true;
            return;
        }
        //console.log("@gridDown");
        this.buttons.classList.add("unavailable");
        if(this.itemSelected){
            const {status} = this.itemSelected;
            if(this.itemSelected.id != currentId){
                if(status === "created"){
                    this.itemRemove();
                }
                this.itemSelected = this.items.filter((item) => item.id === currentId)[0];
            }
        } else {
            this.itemSelected = this.items.filter((item) => item.id === currentId)[0];
        }
        console.log(this.itemSelected)
        //Si l'item contient des objets, on ne peut plus le déplacer
        const hasItems = this.items.filter((item) => item.containedBy && item.containedBy.id === this.itemSelected.id)[0];
        if(hasItems){
            this.itemSelected.movable.disabled = true;
        }
    }

    //A MODIFIER EN CAS DE PLUSIEURS GRIDS PRESENTES (OBJET CONTENEUR)
    gridMove(){
        const {itemSelected} = this;
        const {element,dimensions, boxes, id, status} = itemSelected;
        const {width,height,depth} = dimensions;

        if(status === "clicked"){
            this.itemSelected.statusPrev = status;
            this.itemSelected.status = "normal";
        } 

        //Si déjà placé
        if(boxes){
            this.itemSelected.boxesPrev = [...boxes];
            boxes.forEach((box) => {
                box.reset();
            });
            delete this.itemSelected.boxes;
        }

        this.items.forEach((item) => {
            if(item.id !== id){
                item.element.style.opacity = 0.4;       
            }
        });

        //Si une des dimensions de l'objet est supérieure aux dimensions de l'étagère
        //MAKE IT HERE
        if(width > compositionGridSize.cols(this.level) || height > gridHeight(this.level)){
            this.grid.boxes.forEach((box)=>{
                box.state = "no";
            });
            return;
        }

        const array = [];

        this.items.forEach((item) => {
            if(item.grid && id !== item.id){
                array.push({
                    grid:item.grid,
                    item:item
                });
            }
        });

        array.push({grid:this.grid});

        for(const datas of array){
            const {grid, item} = datas;
            const {boxes} = grid;
            let rowFrom = false;
            let colFrom = false;
            if(width > grid.options.cols || depth > grid.options.rows){
                this.wrongGrid = datas;
                continue;
            }
            for(const box of boxes){
                const {row,col,state} = box;
                const intersection = getIntersection(element,box.element);
                if(intersection){
                    rowFrom = Math.max(rowFrom,row);
                    if(!colFrom && intersection.percentX>=50){
                        colFrom = col;
                    }
                    //Si la profondeur de l'objet est supérieure à la première ligne trouvée, l'objet n'est pas posable sur l'étagère
                    if(rowFrom<depth){
                        box.state = state === "item" ? "item": "null";
                        continue;
                    }

                    //Hauteur de l'élément (à vérifier lorsque l'objet est posé sur d'autres objets - on empile)
                    //gridHeight
                    if(item){
                        const heightCount = height + item.height;
                        if(heightCount > gridHeight(this.level)){
                            this.wrongGrid = datas;
                            continue;
                        }
                    }

                    let colTo = Math.max(1,colFrom - (width-1));
                    let rowTo = Math.max(1,rowFrom - (depth-1));
                    const rowCondition = row<=rowFrom&&row>=rowTo;
                    const colCondition = col<=colFrom&&col>=colTo;
                    if(rowCondition && colCondition){
                        box.state = state === "item" || state === "no" ? "no" : "yes";
                    } else {
                        box.state = "null";
                    }
                } else {
                    box.state = "null";
                }
            }
            const boxesYes = grid.getBoxesByState("yes");
            const boxesNo = grid.getBoxesByState("no");
            if(boxesYes.length > 0){
                //Check if total boxes is NOT equal to width*depth
                if((width*depth) !== boxesYes.length + boxesNo.length){
                    const colRef = colFrom === compositionGridSize.cols(this.level) ? colFrom - width : colFrom+1;
                    for(const box of boxes){
                        const {row,col,state} = box;
                        let rowTo = Math.max(1,rowFrom - (depth-1));
                        const rowCondition = row<=rowFrom&&row>=rowTo;
                        const colCondition = col === colRef;
                        if(rowCondition && colCondition){
                            box.state = state === "item" || state === "no" ? "no" : "yes";
                        }
                    }
                }
                if(datas.item){
                    datas.item.element.style.opacity = 1;
                }
                this.currentGrid = datas;
                break;
            }
        }
        
        if(this.currentGrid && this.currentGrid.item){
            this.grid.boxes.forEach((box)=>{
                if(box.state === "no" || box.state === "yes"){
                    box.state = "null";
                }
            });
        }

        if(this.wrongGrid){
            const {grid} = this.wrongGrid;
            const {boxes} = grid;
            for(const box of boxes){
                box.state = "no";
            }
        }
    }

    async gridUp(){
        //console.log("@gridUp");
        this.buttonClose.classList.remove("unavailable");
        const {movable, boxesPrev} = this.itemSelected;
        this.items.forEach((item) => {
            item.element.style.opacity = "";
        });

        movable.reset();

        if(this.wrongGrid){
            this.wrongGrid.grid.boxes.forEach((box)=>{
                if(box.state === "no"){
                    box.state = "null";
                }
            });
            this.wrongGrid = null;
        }

        //Peut être placé
        if(!this.currentGrid){
            this.grid.boxes.forEach((box)=>{
                if(box.state === "no" || box.state === "yes"){
                    box.state = "null";
                }
            });
            return;
        }
        const boxesYes = this.currentGrid.grid.getBoxesByState("yes");
        const boxesNo = this.currentGrid.grid.getBoxesByState("no");
        if(boxesYes.length > 0 && boxesNo.length === 0){
            this.itemSelected.boxes = boxesYes;
            this.itemSelected.containedBy = this.currentGrid.item;
            this.itemSelected.status = "normal";
            this.itemSelected.place();
            movable.update();
            boxesYes.forEach((box) => {
                box.state = "item";
            });
            const alreadyExists = this.items.some((item) => item.id === this.itemSelected.id);
            if(!alreadyExists){
                this.items.push(this.itemSelected);    
            }
            this.itemSelected = null;
            this.emit(View.ITEM_PLACED);
        } else {
            boxesYes.forEach((box) => {
                box.state = "";
            });
            if(boxesPrev){
                this.itemSelected.boxes = [...boxesPrev];
                delete this.itemSelected.boxesPrev;
            }
            
        }
        boxesNo.forEach((box) => {
            box.state = "";
        });
        this.updateButtons();
    }

    itemClick(e){
        if(this.itemSelected && this.itemSelected.template){
            this.itemSelected.movable.disabled = true;
            return;
        }
        //Clique sur l'élément venant d'être créé
        if(this.itemSelected){
            const id = e.target.options.element.id;
            this.items.forEach((item) => {
                item.element.style.opacity = "";
            });
            const {boxes, boxesPrev} = this.itemSelected;
            const isPlaced = Array.isArray(boxes || boxesPrev);
            this.itemSelected.reset();
            if(this.itemSelected.statusPrev && this.itemSelected.statusPrev != "clicked"){
                this.itemSelected.status = this.itemSelected.statusPrev;
                delete this.itemSelected.statusPrev;
            }
            if(this.itemSelected.status === "clicked"){
                this.itemSelected.status = "normal";
                this.itemSelected = null;
            }
            else if(id === this.itemSelected.id && !isPlaced){
                console.log("nothing to do here");
            }
            else if(id === this.itemSelected.id && isPlaced){
                this.itemUnClick();
                this.itemSelected.status = "clicked";
            }
            this.updateButtons();
        }
    }

    updateButtons(){
        this.buttons.classList.remove("unavailable");
        if(this.itemSelected){
            this.buttonDelete.classList.remove("hidden");
            const {datas,boxes, boxesPrev} = this.itemSelected;
            const {rotable} = datas;
            const isPlaced = boxes || boxesPrev;
            if(rotable && !isPlaced){
                this.buttonRotate.classList.remove("hidden");
                this.buttonClose.removeAttribute("state");
                if(isObject(rotable) || rotable === "y"){
                    this.buttonRotate.setAttribute("direction","y");
                } else {
                    this.buttonRotate.setAttribute("direction","x");
                }
            } else {
                this.buttonRotate.classList.add("hidden");
            }    
        } else {
            this.buttonDelete.classList.add("hidden");
            this.buttonRotate.classList.add("hidden");
        } 
    }

    render(){
        this.grid.options.cols = compositionGridSize.cols(this.level);
        this.grid.update();
        const y = this.composition.getAttribute("y");
        this.items.forEach((itemDatas) => {
            const {element, datas, grid, boxes, state} = itemDatas;
            const {containable} = datas;
            if(containable && state !=="face"){
                grid.options.element.style.height = containable.height;
                grid.options.element.style.bottom = containable.bottom;
            }
            element.style.display = "";
            for(const box of boxes){
                box.state = "item";
            }
        });
        this.buttonDelete.classList.add("hidden");
        this.buttonRotate.classList.add("hidden");
        
    }

    close(){
        if(this.itemSelected){
            const {status} = this.itemSelected;
            if(status === "created"){
                this.itemRemove();
            }
        }
        this.emit(View.SCREENSHOT);
    }

    addEvents(){
        this.categoryButtons.forEach((button) => {
            button.addEventListener(EVENTS.CLICK_TOUCH, this.handleCategoryClick);
        });
        this.buttonDelete.addEventListener(EVENTS.CLICK_TOUCH,this.handleItemDelete);
        this.buttonClose.addEventListener(EVENTS.CLICK_TOUCH,this.handleClose);
        this.buttonRotate.addEventListener(EVENTS.CLICK_TOUCH,this.handleItemRotate);
    }

    removeEvents(){

    }

    clear(){
        this.itemRemove();
        this.items.forEach((item) => {
            item.element.style.display = "none";
        });
        this.grid.reset();
    }

    empty(){
        this.itemRemove();
        this.items.forEach((item) => {
            item.element.remove();
        });
        this.items = [];
        this.grid.reset();
    }

    init(){
        this.component.hide();
        this.itemRemove();
    }
}