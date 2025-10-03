import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS, isDefined } from "../utils/utils.js";
import { pixelToPercentTranslate } from "../lib/dom.js";

const getClients = (e) => {
    return {
        x:e.touches ? e.touches[0].clientX : e.clientX,
        y:e.touches ? e.touches[0].clientY : e.clientY,
    }
}

const OFFSET_MIN = 3;

const getNaturalDimensions = (element) => {
    /*box-sizing: content-box; */
    const box = element.getBoundingClientRect();
    const width = parseFloat(window.getComputedStyle(element).getPropertyValue("width"));
    const height = parseFloat(window.getComputedStyle(element).getPropertyValue("height"));
    const left = box.left + ((box.width-width)/2);
    const top = box.top + ((box.height-height)/2);
    const right = box.right - ((box.width-width)/2);
    const bottom = box.bottom - ((box.height-height)/2);
    return  {
        width,height,left,top,right,bottom
    }
}

export default class Movable extends EmitterMixin {
    static get DOWN(){
        return 'Movable.down';
    }
    static get MOVE(){
        return 'Movable.move';
    }
    static get UP(){
        return 'Movable.up';
    }
    static get UP_NOMOVE(){
        return 'Movable.upNoMove';
    }
    static get RESET(){
        return 'Movable.reset';
    }
    static get BOUNDARY_X_MIN(){
        return 'Movable.boundaryXMin';
    }
    static get BOUNDARY_X_MAX(){
        return 'Movable.boundaryXMax';
    }
    static get BOUNDARY_Y_MIN(){
        return 'Movable.boundaryYMin';
    }
    static get BOUNDARY_Y_MAX(){
        return 'Movable.boundaryYMax';
    }
    constructor(props = {}){
        super();
        this.options = {
            element: null,
            positionsReceiver:document,
            boundaries:null,
            naturalBoundaries:false,
            unit:"px",
            ...props
        }

        this.from = null;

        this.diff = {
            x:0,
            y:0
        };
        this.directions = {
            x:"middle",
            y:"middle"
        }
        this.sides = {
            x:"middle",
            y:"middle"
        }

        this.handleDown = this.onDown.bind(this);
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleResize = this.onResize.bind(this);
        this.disabled = false;
        this.once = false;
        this.elements = [];
        this.addElements(this.options.element);
        this.reset();
        
    }

    get box(){
        const {element} = this.options;
        const box = element.getBoundingClientRect();
        return box
    }

    get boundaries(){
        const {boundaries, naturalBoundaries} = this.options;

        const getElementBoundaries = (element) => {
            const box = naturalBoundaries ? getNaturalDimensions(element) : element.getBoundingClientRect();
            return {
                x:{min:(box.left - this.start.left),max:box.right - this.start.right},
                y:{min:(box.top - this.start.top),max:box.bottom - this.start.bottom},
            }
        };
    
        if(boundaries instanceof HTMLElement){
            return getElementBoundaries(boundaries);
        }
        else if(isDefined(boundaries.x) && isDefined(boundaries.y)){
            const obj = {x:{min:0,max:0},y:{min:0,max:0}};
            if(boundaries.x instanceof HTMLElement){
                const boundariesCalc = getElementBoundaries(boundaries.x);
                obj.x.min = boundariesCalc.x.min;
                obj.x.max = boundariesCalc.x.max;
            }
            else if(typeof boundaries.x === "number"){
                obj.x.min = boundaries.x;
                obj.x.max = boundaries.x;
            } else {
                if(boundaries.x.min){
                    if(boundaries.x.min instanceof HTMLElement){
                        const boundariesCalc = getElementBoundaries(boundaries.x.min);
                        obj.x.min = boundariesCalc.x.min;
                    } else {
                        obj.x.min = boundaries.x.min;
                    }
                }
                if(boundaries.x.max){
                    if(boundaries.x.max instanceof HTMLElement){
                        const boundariesCalc = getElementBoundaries(boundaries.x.max);
                        obj.x.max = boundariesCalc.x.max;
                    } else {
                        obj.x.max = boundaries.x.max;
                    }
                }
            }
            if(boundaries.y instanceof HTMLElement){
                const boundariesCalc = getElementBoundaries(boundaries.y);
                obj.y.min = boundariesCalc.y.min;
                obj.y.max = boundariesCalc.y.max;
            }
            else if(typeof boundaries.y === "number"){
                obj.y.min = boundaries.y;
                obj.y.max = boundaries.y;
            } else {
                if(boundaries.y.min){
                    if(boundaries.y.min instanceof HTMLElement){
                        const boundariesCalc = getElementBoundaries(boundaries.y.min);
                        obj.y.min = boundariesCalc.y.min;
                    } else {
                        obj.y.min = boundaries.y.min;
                    }
                }
                if(boundaries.y.max){
                    if(boundaries.y.max instanceof HTMLElement){
                        const boundariesCalc = getElementBoundaries(boundaries.y.max);
                        obj.y.max = boundariesCalc.y.max;
                    } else {
                        obj.y.max = boundaries.y.max;
                    }
                }
            }
            return obj;
        }
    }

    set enabled(boolean){
        const {positionsReceiver} = this.options;
        if(typeof boolean === "boolean"){
            if(boolean === true){
                positionsReceiver.addEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
                positionsReceiver.addEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
                this.removeEvents();
            } else {
                positionsReceiver.removeEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
                positionsReceiver.removeEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
                this.addEvents();
            }
        }
    }

    addElements(elements){
        if(elements instanceof NodeList || Array.isArray(elements)){
            for(const element of elements){
                this.elements.push(element);
            }
        } else {
            this.elements.push(elements);
        }
    }

    onDown(e){
        if(this.disabled === true){
            return;
        }
        if(!this.once){
            this.update();
            this.once = true;
        }
        e.preventDefault();
        e.stopPropagation();
        this.from = getClients(e);
        this.old = {... this.positions};
        this.enabled = true;
        this.date = new Date();
        this.emit(Movable.DOWN);
    }

    onMove = (e) => window.requestAnimationFrame(() => {
        if(this.disabled === true){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if(!this.moving){
            this.moving = true;
        }
        if(this.from){ 
            const to = getClients(e);
            const {x,y} = this.anchors;
            const obj = {
                x: x + (to.x - this.from.x),
                y: y + (to.y - this.from.y),
            };

            if (this.positions) {
                this.directions.x = (obj.x > this.positions.x) ? "right" : (obj.x < this.positions.x) ? "left" : "middle";
                this.directions.y = (obj.y > this.positions.y) ? "bottom" : (obj.y < this.positions.y) ? "top" : "middle";
            }

            obj.x = Math.max(this.boundaries.x.min,Math.min(this.boundaries.x.max,obj.x));
            obj.y = Math.max(this.boundaries.y.min,Math.min(this.boundaries.y.max,obj.y));

            if(Math.abs(obj.x - this.old.x ) > OFFSET_MIN || Math.abs(obj.y - this.old.y ) > OFFSET_MIN){
                this.place(obj); 
            }
        }
    });

    onUp(e){
        e.preventDefault();
        e.stopPropagation();
        const samePositions = (this.positions.x === this.old.x && this.positions.y === this.old.y);
        const time = new Date().getTime();
        const gap = time - this.date.getTime();
        if(gap > 300 && (!this.moving || samePositions)){
            this.disabled = false;
            this.enabled = false;
            this.from = null;
            return;
        }

        this.disabled = false;
        this.enabled = false;
        this.from = null;

        if(!this.moving || samePositions){
            this.emit(Movable.UP_NOMOVE);
        } 
        else if(this.moving && !samePositions) {
            this.anchors = {...this.positions};
            this.emit(Movable.UP,this.positions); 
        }
    }

    onResize(){
        this.update();
    }

    place(coords = {}){
        const {element,unit} = this.options;
        let {x,y} = coords;
        switch(unit){
            case "%":
                const {percentX, percentY} = pixelToPercentTranslate({element,pixelX:(x||0),pixelY:(y||0)});
                element.style.translate = percentX+"% "+percentY+"%";
                break;
            default:
                x = Math.max(this.boundaries.x.min,Math.min(this.boundaries.x.max,x));
                y = Math.max(this.boundaries.y.min,Math.min(this.boundaries.y.max,y));
                element.style.translate = (x||0)+"px "+(y||0)+"px";
            break;
        }

        this.positions = {
            x:(x||0),
            y:(y||0)
        };

        this.percents = {
            x: ((x||0)-this.boundaries.x.min)/(this.boundaries.x.max-this.boundaries.x.min)*100,
            y: ((y||0)-this.boundaries.y.min)/(this.boundaries.y.max-this.boundaries.y.min)*100,
        }

        this.emit(Movable.MOVE,coords);   
    }

    reset(){
        this.update();
        this.once = false;
        this.moving = false;
        this.disabled = false;
        this.enabled = false;
    }

    update(){
        const {element} = this.options;
        element.style.translate = "0px 0px";
        this.start = this.box;
        const percentX = this.percents?.x || 0;
        const percentY = this.percents?.y || 0;
        const x = percentX/100 * ((this.boundaries.x.max - this.boundaries.x.min) + this.boundaries.x.min);
        const y = percentY/100 * ((this.boundaries.y.max - this.boundaries.y.min) + this.boundaries.y.min);
        this.place({x,y});
        this.anchors = {...this.positions};
    }

    addEvents(){
        const {element} = this.options;
        element.addEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown);
        window.addEventListener(EVENTS.RESIZE, this.handleResize);
    }

    removeEvents(){
        const {element} = this.options;
        element.removeEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown);
        window.removeEventListener(EVENTS.RESIZE, this.handleResize);
    }
}