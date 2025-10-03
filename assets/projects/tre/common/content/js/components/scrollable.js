import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS } from "../utils/utils.js";

const getClients = (e) => {
    return {
        x:e.touches ? e.touches[0].clientX : e.clientX,
        y:e.touches ? e.touches[0].clientY : e.clientY,
    }
}

export default class Scrollable extends EmitterMixin {
    static get DOWN(){
        return 'Scrollable.down';
    }
    static get MOVE(){
        return 'Scrollable.move';
    }
    static get UP(){
        return 'Scrollable.up';
    }
    constructor(props = {}){
        super()
        this.options = {
            element: null,
            axis: "y",
            each:"10%",
            current:null,
            cursor: false,
            ...props
        }
        const {element} = this.options;
        this.parent = element.parentNode;
        this.position = null;

        this.handleDown = this.onDown.bind(this);
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleWheel = this.onWheel.bind(this);
        this.handleResize = this.onResize.bind(this);
        if(this.options.cursor instanceof HTMLElement){
            this.cursor = this.options.cursor;
            this.cursorWrap = this.options.cursor.parentNode;
        }
        else if(this.options.cursor === true){
            const cursorWrap = document.createElement("div");
            cursorWrap.className = "scrollable-cursor-wrap";
            const cursor = document.createElement("div");
            cursor.className = "scrollable-cursor";
            cursorWrap.append(cursor);
            this.parent.append(cursorWrap);
            this.cursor = cursor;
            this.cursorWrap = cursorWrap;
        }
        this.addEvents();
        this.reset();
        this.parent.addEventListener(EVENTS.WHEEL,this.handleWheel, true);
        window.addEventListener(EVENTS.RESIZE, this.handleResize);
    }

    get getDatas(){
        let obj;
        const {element,each, axis} = this.options;
        const scrollableDim = axis === "y" ? element.offsetHeight : element.offsetWidth;
        const scrollableWrapDim = axis === "y" ? this.parent.offsetHeight : this.parent.offsetWidth;
        const scrollableMax = 0;
        const scrollableMin = scrollableWrapDim-scrollableDim;
        const eachCalc = typeof each === "string" ? parseFloat(each) : each/Math.abs(scrollableMin)*100;
        const min = 0;
        const max = 100/eachCalc;
        obj = {
            scrollableDim:scrollableDim,
            scrollableWrapDim:scrollableWrapDim,
            scrollableMax:scrollableMax,
            scrollableMin:scrollableMin,
            scrollableEach:eachCalc/100*(scrollableMin-scrollableMax),
            min:min,
            max:max
        }
        if(this.cursor){
            const cursorHeight = this.cursor.offsetHeight;
            const cursorWrapHeight = this.cursorWrap.offsetHeight;
            const cursorMin = 0;
            const cursorMax = cursorWrapHeight-cursorHeight;
            obj.cursorHeight = cursorHeight;
            obj.cursorWrapHeight = cursorWrapHeight;
            obj.cursorMin = cursorMin;
            obj.cursorMax = cursorMax;
            obj.cursorEach = eachCalc/100*(cursorMax-cursorMin);
        }
        return obj;
    }

    set enabled(boolean){
        if(typeof boolean === "boolean"){
            if(boolean === true){
                window.addEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove,true);
                window.addEventListener(EVENTS.UP_TOUCHEND,this.handleUp,true);
                this.removeEvents();
            } else {
                window.removeEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
                window.removeEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
                this.addEvents();
            }
        }
    }

    get percent(){
        return parseFloat(this.options.element.getAttribute("data-percent"));
    }

    set percent(value){
        const datas = this.getDatas;
        const {axis,element} = this.options;
        const cssValue = axis === "y" ? "translateY" : "translateX";
        const cursorValue = Math.floor(value/100 * (datas.cursorMax - datas.cursorMin));
        this.cursor.style["transform"] = cssValue+"("+(cursorValue)+"px)";
        this.cursor.setAttribute("data-pos-changing",cursorValue);
        this.cursor.setAttribute("data-percent",value);

        const scrollableValue = -(Math.floor((value)/100 * (datas.scrollableMax - datas.scrollableMin)));
        element.style["transform"] = cssValue+"("+(scrollableValue)+"px)";
        element.setAttribute("data-pos-changing",scrollableValue);
        element.setAttribute("data-percent",value);

    }

    onDown(e){
        if(this.disabled){
            return;
        }
        const { currentTarget, target } = e;
        const {axis} = this.options;
        const positions = getClients(e);
        this.position = axis === "y" ? positions.y : positions.x;
        this.by = [currentTarget,target];
        this.enabled = true;
        this.emit(Scrollable.DOWN);
    }

    onMove(e){
        if(this.position){
            if(!this.scrolling){
                this.scrolling = true;
            }
            const {element,axis} = this.options;
            const positions = getClients(e);
            let position = axis === "y" ? positions.y : positions.x;
            const gap = position - this.position;

            if(this.by.includes(this.cursor)){
                const posFrom = this.cursor.getAttribute("data-pos"); 
                const pos = parseFloat(posFrom);
                const value = (pos+(gap));
                this.calculate(value,this.cursor);
            } else {
                const posFrom = element.getAttribute("data-pos"); 
                const pos = parseFloat(posFrom);
                const value = (pos+(gap));
                this.calculate(value,element);
            }
            this.emit(Scrollable.MOVE);
        }
    }

    onUp(e){
        this.position = null;
        if(this.scrolling){
            const {element} = this.options;
            this.enabled = false;
            this.scrolling = false;
            this.updatePositions();
            this.emit(Scrollable.UP);    
        }
    }

    onWheel(e){     
        if(this.disabled){
            return;
        }
        const {element} = this.options;
        const deltaY = -e.deltaY
        const posFrom = element.getAttribute("data-pos"); 
        const pos = parseFloat(posFrom);
        const value = (pos+deltaY);
        this.calculate(value,element);
        this.updatePositions();
        this.emit(Scrollable.MOVE);
    }

    onResize() {
        this.update();
    }

    calculate(value,element){
        const datas = this.getDatas;
        const min = element === this.cursor ? datas.cursorMin : datas.scrollableMin;
        const max = element === this.cursor ? datas.cursorMax : datas.scrollableMax;
        const newValue = Math.max(min,(Math.min(max,value)));
        const percent = element === this.cursor ? (newValue - min) / (max - min) * 100 : ((newValue + min) / (max + min) *100) - 100;
        this.percent = percent;
    }

    updatePositions(){
        const {element} = this.options;
        if(element.getAttribute("data-pos-changing")){
            element.setAttribute("data-pos",element.getAttribute("data-pos-changing"));
            element.removeAttribute("data-pos-changing");
        }
        if(this.cursor && this.cursor.getAttribute("data-pos-changing")){
            this.cursor.setAttribute("data-pos",this.cursor.getAttribute("data-pos-changing"));
            this.cursor.removeAttribute("data-pos-changing");
        }
    }

    reset(){
        this.options.element.setAttribute("data-pos","0");
        this.options.element.setAttribute("data-percent","0");
        if(this.cursor){
            this.cursor.setAttribute("data-pos","0");
            this.cursor.setAttribute("data-percent","0");
        }
        this.update();
    }

    update(){
        setTimeout(()=>{
            this.scrolling = false;
            const {scrollableWrapDim, scrollableDim} = this.getDatas;
            const percent = Math.round(scrollableWrapDim/scrollableDim*100);
            if(percent>=100){
                this.disabled = true;
                if(this.cursor){
                    this.cursorWrap.style.display = "none";
                }
            } else {
                if(this.cursor){
                    this.cursorWrap.style.display = "";
                    this.cursor.style.height = (percent/100*(this.getDatas.cursorWrapHeight))+"px";
                }   
            }
            
            this.percent = this.percent;
            this.updatePositions();
        },50);      
    }

    dispose(){
        this.removeEvents();
        window.removeEventListener(EVENTS.RESIZE, this.handleResize);
        this.parent.removeEventListener(EVENTS.WHEEL,this.handleWheel, true);
        window.removeEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
        window.removeEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
    }

    addEvents(){
        this.parent.addEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown,true);
        if(this.cursor){
            this.cursor.addEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown,true);
        }
    }

    removeEvents(){
        this.parent.removeEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown);
        if(this.cursor){
            this.cursor.removeEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown,true);
        }
    }
}