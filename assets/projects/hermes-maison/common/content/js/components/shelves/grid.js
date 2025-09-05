import EmitterMixin from "../../lib/emitter-mixin.js";
import { EVENTS } from "../../lib/utils.js";

export default class Grid extends EmitterMixin {
    static get ITEM_ADD(){
        return 'Grid.itemAdd';
    }
    constructor(props = {}){
        super()
        this.options = {
            element:null,
            rows:6,
            cols:10,
            ...props
        }

        this.items = {};
        this.boxes = [];
        this.create();
        this.addEvents();
    }

    get total(){
        return this.options.rows*this.options.cols;
    }

    isClicked(){
        this.emit(Grid.IS_CLICKED);
    }

    create(){
        const {element,cols,rows} = this.options;
        const squareAttrs = [["left","top"],["right","top"],["left","bottom"],["right","bottom"]]
        for(let b=1; b<=this.total; b++){
            const box = document.createElement("div");
            box.className = "grid-box relative";
            const row = Math.ceil(b/ cols);
            const col = (b % cols === 0) ? cols : b % cols;
            box.setAttribute("col",col);
            box.setAttribute("row",row);
            // for(let s=1; s<=4; s++){
            //     const square = document.createElement("div");
            //     const squareAttr = squareAttrs[s-1];
            //     square.className = "square";
            //     square.setAttribute("x",squareAttr[0]);
            //     square.setAttribute("y",squareAttr[1]);
            //     box.appendChild(square);
            // }
            this.boxes.push(new Box({
                element:box,
                row,col
            }))
            element.appendChild(box);

        }
        this.boxes = this.boxes.reverse();
        this.update();
    }

    getBoxesByState(state){
        const boxes = [];
        for(const box of this.boxes){
            if(box.state === state){
                boxes.push(box);
            }
        }
        return boxes;
    }

    getBoxesByFrom(from = { col:-1, row:-1}, width, depth){
        const {col,row} = from;
        const boxes = [];
        for(const box of this.boxes){
            const colTo = col - (width-1);
            const rowTo = row - (depth-1);
            const rowCondition = box.row<=row&&box.row>=rowTo;
            const colCondition = box.col<=col&&box.col>=colTo;
            if(rowCondition && colCondition){
                boxes.push(box);
            }
        }
        return boxes;
    }

    getAdjacents(from){
        const boxes = [];
        for(const box of this.boxes){
            if(from.col != box.col && from.row != box.row){
                const conditionRow = from.col === box.col && (box.row-1 === from.row || box.row+1 === from.row)
                const conditionCol = from.row === box.row && (box.col-1 === from.col || box.col+1 === from.col)
                if(conditionRow ||conditionCol){
                    boxes.push(box);
                }
            }
        }
        return boxes;
    }

    reset(){
        for(const box of this.boxes){
            box.reset();
        }  
    }

    update(){
        this.reset();
        const {element,cols,rows} = this.options;
        element.setAttribute("row",rows);
        element.setAttribute("cols",cols);
        element.style["grid-template-rows"] = "repeat("+rows+",1fr)";
        element.style["grid-template-columns"] = "repeat("+cols+",1fr)";
        for(const box of this.boxes){
            const {col,row} = box;
            if(col>cols||row>rows){
                box.element.style.display = "none";
            } else {
                box.element.style.display = "";
            }
        } 
    }

    addEvents(){
        if(this.hasItem){

        } else {
            this.options.element.addEventListener(EVENTS.CLICK_TOUCH, this.handleIsClicked);
        }
    }

    removeEvents(){
        if(this.hasItem){

        } else {
            this.options.element.removeEventListener(EVENTS.CLICK_TOUCH, this.handleIsClicked);
        }
    }
}

const STATES = ["item","yes","no"];

class Box {
    constructor(props = {}){
        this.element = props.element;
        this.row = props.row;
        this.col = props.col;
        this.disabled = false;
    }

    get adjacents(){
        return [
            {col:this.col+1, row:this.row},
            {col:this.col-1, row:this.row},
            {col:this.col, row:this.row+1},
            {col:this.col, row:this.row-1}
        ]
    }

    get state(){
        return this.element.getAttribute("state");
    }

    set state(str){
        if(typeof str === "string"){
            if(this.disabled === false){
                if(this.state === "item"){
                    this.shadowState = "item";
                }
                if(!STATES.includes(str) && this.shadowState){
                    this.element.setAttribute("state",this.shadowState);
                    this.shadowState = false;
                    return;    
                }    
            }
            this.element.setAttribute("state",str);
        }
    }

    reset(){
        this.shadowState = false;
        this.disabled = true;
        this.state = "reset";
        this.disabled = false;
    }
}