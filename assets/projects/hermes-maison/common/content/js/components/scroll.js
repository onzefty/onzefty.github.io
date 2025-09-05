import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS, clamp } from "../lib/utils.js";
import { Timeline } from "../lib/MotionBroth/timeline.js";

const getClients = (e) => {
    const {touches, changedTouches} = e;
    let x = 0;
    let y = 0;
    if(touches && touches.length > 0){
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }
    else if(changedTouches && changedTouches.length > 0){
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    return {x,y}
}

const OFFSET_MIN = 3;
const TIME = 120000;

export default class Scroll extends EmitterMixin {
    static get DOWN(){
        return 'Scroll.down';
    }
    static get MOVE(){
        return 'Scroll.move';
    }
    static get UP(){
        return 'Scroll.up';
    }
    static get SCROLL_UP(){
        return 'Scroll.scrollUp';
    }
    static get SCROLL_DOWN(){
        return 'Scroll.scrollDown';
    }
    static get RESET(){
        return 'Scroll.reset';
    }
    constructor(props = {}){
        super()
        this.options = {
            positionsReceiver:document,
            difference:100,
            time:1000,
            helper:false,
            helperParent:null,
            ignore:false,
            wheel:true,
            axis:"y",
            ...props
        }

        this.from = null;
        this.to = null;

        this.diff = 0;

        this.handleDown = this.onDown.bind(this);
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleShowHelper = this.showHelper.bind(this);
        this.disabled = true;

        if(this.options.helper === true){
            this.createHelper();
            const obj = {...ANIMATIONSDATAS};
            obj.triggers = {
                "end":()=>{
                    this.triggerHelper();
                }
            }
            this.timeline = new Timeline(obj);
            this.timer = setTimeout(this.handleShowHelper,TIME);
        }

        this.addEvents();
    }

    // set disabled(value){
    //     disabled = value;
    //     if(disabled !== true){
    //         this.triggerHelper();
    //     } else {
    //         clearTimeout(this.timer);
    //     }
    // }

    // get disabled(){
    //     return disabled;
    // }

    
    onDown(e){
        if(this.disabled === true){
            return;
        }
        e.stopPropagation();
        this.scrolling = true;
        this.from = {
            coords:getClients(e),
            time: new Date().getTime()
        }
        this.emit(Scroll.DOWN);
    }

    onMove(e){
        if(this.disabled === true || !this.from || !this.scrolling){
            return;
        }
        e.stopPropagation();
        const {axis,difference} = this.options;
        const coords = getClients(e);
        const gap = coords[axis] - this.from.coords[axis];
        const percent = clamp(0,Math.abs(gap/difference*100),100);
        const direction = gap > 0 ? "down" : "up"
        this.emit(Scroll.MOVE,{
            value:coords[axis],gap,percent,direction
        })
    }

    onUp(e){
        if(this.disabled === true || (!this.from && !e.deltaY)){
            return;
        }
        e.stopPropagation();
        this.scrolling = false;
        this.to = {
            coords:getClients(e),
            time: new Date().getTime()
        }
        //WHEEL
        if(e.deltaY){
            if(e.deltaY < 0 && this.disabled != "up"){
                this.disabled = true;
                this.triggerHelper();
                this.emit(Scroll.SCROLL_UP);
            }
            else if(e.deltaY > 0 && this.disabled != "down"){
                this.disabled = true;
                this.triggerHelper();
                this.emit(Scroll.SCROLL_DOWN);
            }
            return;
        }
        const {axis,difference,ignore} = this.options;
        const gap = this.to.coords[axis] - this.from.coords[axis];
        const percent = clamp(0,Math.abs(gap/difference*100),100);
        const condition = Math.abs(gap) >= this.options.difference;
        const gapTime = this.to.time - this.from.time;
        const conditionTime = gapTime <= this.options.time;
        if(condition && conditionTime || ignore === true){
            if(gap > 0 && this.disabled != "down"){
                this.disabled = true;
                this.triggerHelper();
                this.emit(Scroll.SCROLL_DOWN,{percent,direction:"down"});
            }
            else if(gap < 0 && this.disabled != "up"){
                this.disabled = true;
                this.triggerHelper();
                this.emit(Scroll.SCROLL_UP,{percent,direction:"up"});
            }
            return;
        }
    }

    createHelper(){
        const {helperParent} = this.options;
        const element = document.createElement("div");
        element.id = "scroll-wrap";
        element.className = "absolute widthAll heightAll lt0 hidden noEvents flexCenter col";
        const swapWrap = document.createElement("div");
        swapWrap.className = "swap-wrap flexYStartCol col";
        const swapTo = document.createElement("div");
        swapTo.className = "swap-to";
        const swapArrows = document.createElement("div");
        swapArrows.className = "swap-arrows flex col";
        swapArrows.innerHTML = "<div></div><div></div><div></div>";
        const swapCursor = document.createElement("div");
        swapCursor.className = "swap-cursor relative flexCenter";
        const swapUp = document.createElement("p");
        swapUp.className = "swap-up absolute";
        const swapDown = document.createElement("p");
        swapDown.className = "swap-down absolute";
        swapCursor.append(swapUp,swapDown);
        swapWrap.append(swapTo,swapArrows,swapCursor);
        element.append(swapWrap);
        this.helperElement = element;
        helperParent.appendChild(element);
    }

    showHelper(){
        clearTimeout(this.timer);
        this.timeline.play(0);
    }

    hideHelper(){
        if(this.timeline.playing){
            this.timeline.stopPlaying();
        }
        this.timeline.reset();
    }

    triggerHelper(){
        if(this.options.helper === true){
            clearTimeout(this.timer);
            this.hideHelper();
            this.timer = setTimeout(this.handleShowHelper,TIME);
        }
    }

    reset(){
        this.moving = false;
        this.disabled = false;
    }

    addEvents(){
        this.disposed = false;
        const {positionsReceiver,wheel} = this.options;
        positionsReceiver.addEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown,{passive:true});
        positionsReceiver.addEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove,{passive:true});
        positionsReceiver.addEventListener(EVENTS.UP_TOUCHEND,this.handleUp,{passive:true});
        if(wheel === true){
            positionsReceiver.addEventListener(EVENTS.WHEEL,this.handleUp);
        }
    }

    removeEvents(){
        this.disposed = true;
        const {positionsReceiver,wheel} = this.options;
        positionsReceiver.removeEventListener(EVENTS.DOWN_TOUCHSTART,this.handleDown);
        positionsReceiver.removeEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
        positionsReceiver.removeEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
        if(wheel === true){
            positionsReceiver.removeEventListener(EVENTS.WHEEL,this.handleUp);
        }
    }
}

const ANIMATIONSDATAS = {
	steps: {
		"swap-helper":{
			triggers:{
				"end":()=>{
					document.querySelector("#scroll-wrap").classList.add("hidden");
				},
				"reset":()=>{
					document.querySelector(".swap-wrap").classList.remove("reverse");
                    document.querySelector("#scroll-wrap").classList.add("hidden");
					document.querySelector(".swap-cursor").removeAttribute("direction");
				}
			},
			line:[
				{
					element:".swap-wrap",
					easing:"outBack",
					delay:"+500",
					duration:1000,
					properties:{opacity:1, translate:"0% 0%"},
					triggers:{
						"start":()=> {
							document.querySelector("#scroll-wrap").classList.remove("hidden");
							document.querySelector(".swap-cursor").removeAttribute("direction");
						}
					}
				},
				{
					element:".swap-cursor",
					delay:"next",
					duration:1000,
					properties:{translate:"0% -253%"},
					triggers:{
						"start":()=> {
							document.querySelector(".swap-cursor").setAttribute("direction","up");
						},
						"end":()=> {
							document.querySelector(".swap-wrap").classList.add("reverse");
						}
					},
				},
				{
					element:".swap-cursor",
					delay:"next+800",
					duration:1000,
					properties:{translate:"0% 0%"},
					triggers:{
						"start":()=> {
							document.querySelector(".swap-cursor").setAttribute("direction","down");
						},
						"end":()=> {
							document.querySelector(".swap-wrap").classList.remove("reverse");
						}
					},
				},
				{
					element:".swap-wrap",
					easing:"outBack",
					delay:"next+800",
					duration:800,
					properties:{opacity:0}
				}
			]
		}
	}
}