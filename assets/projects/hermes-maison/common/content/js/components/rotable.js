import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS, getMousePosition, degToRad, radToDeg, getClosest } from "../lib/utils.js";

const getEvent = (e) => {
    return (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
}

export default class Rotable extends EmitterMixin {
    static get DOWN(){
        return 'Rotable.down';
    }
    static get MOVE(){
        return 'Rotable.move';
    }
    static get MOVE_UP(){
        return 'Rotable.moveUp';
    }
    static get MOVE_DOWN(){
        return 'Rotable.moveDown';
    }
    static get UP(){
        return 'Rotable.up';
    }
    static get RESET(){
        return 'Rotable.reset';
    }

    constructor(props = {}){
        super();
        this.options = {
            element: document.createElement("div"),
            triggeringElement: null,
            positionsReceiver: null,
            every: 1,
            snapValues: null,
            angleStart: 0,
            angleMax: null,
            angleMin: null,
            angleUpMin: null,
            angleUpMax: null,
            angleDownMin: null,
            angleDownMax: null,
            cannotReset: false,
            reverse: false,
            returnToStart: false,
            resetCondition: false,
            transformOrigin: false,
            gapMin:0,
            ...props
        }

        if(!this.options.element){
            return console.error("No Element added");
        }

        this.triggeringElement = this.options.triggeringElement instanceof HTMLElement ? props.triggeringElement : this.options.element;
        this.positionsReceiver = this.options.positionsReceiver instanceof HTMLElement ? props.positionsReceiver : document;
        this.angleCurrent = this.options.angleStart;
        this.angleLast = this.options.angleStart;
        this.anglePrevious = 0;
        this.turns = 0;
        this.percent = 0;
        this.direction;
        this.directionPrevious;
        this.started = false;
        this.isActive = true;
        this.from = {};
        this.snapValues = null;

        const {angleMin, angleMax} = this.options;
        if(angleMin > angleMax){
            this.options.angleMax += 360;
        }

        this.handleDown = this.onDown.bind(this);
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleResize = this.onResize.bind(this);

        if(typeof this.options.transformOrigin === "function"){
            this.onResize();
            window.addEventListener(EVENTS.RESIZE,this.handleResize);
        }

        this.reset();
    }

    get origin(){
        const transformOrigin = window.getComputedStyle(this.triggeringElement).transformOrigin;
        const x = parseFloat(transformOrigin.split(" ")[0]);
        const y = parseFloat(transformOrigin.split(" ")[1]);
        return {x,y};
    }

    get box(){
        const box = this.triggeringElement.getBoundingClientRect();
        return box;
    }

    set enabled(boolean){
        if(typeof boolean === "boolean"){
            if(boolean === true){
                this.triggeringElement.removeEventListener(EVENTS.DOWN_TOUCHSTART, this.handleDown);
                this.positionsReceiver.addEventListener(EVENTS.MOVE_TOUCHMOVE, this.handleMove, {passive: true});
                this.positionsReceiver.addEventListener(EVENTS.UP_TOUCHEND, this.handleUp, {passive: true});
            } else {
                this.triggeringElement.addEventListener(EVENTS.DOWN_TOUCHSTART, this.handleDown, {passive: true});
                this.positionsReceiver.removeEventListener(EVENTS.MOVE_TOUCHMOVE, this.handleMove, {passive: true});
                this.positionsReceiver.removeEventListener(EVENTS.UP_TOUCHEND, this.handleUp, {passive: true});
            }
        }
    }

    onResize(){
        this.triggeringElement.style.transformOrigin = this.options.transformOrigin();
        this.setAngle(0);
        //Recalcul de décalage selon l'origine avec un angle forcé à 0
        this.from.center = { x: (this.box.left + this.origin.x), y: (this.box.top + this.origin.y) };
        this.setAngle(this.angleCurrent);
    }

    onDown(e){
        const event = getEvent(e);
        this.options.element.style['cursor'] = 'grabbing';
        this.from.mouse = getMousePosition(event);
        this.angleLast = this.angleCurrent;
        this.enabled = true;
        this.emit(Rotable.DOWN);
    }

    onMove = (e) => window.requestAnimationFrame(() => {
        const event = getEvent(e);
        const mouse = getMousePosition(event);
        const x = mouse.clientX - this.from.center.x;
        const y = mouse.clientY - this.from.center.y;
        const x2 = this.from.mouse.clientX - this.from.center.x;
        const y2 = this.from.mouse.clientY - this.from.center.y;
        const r = Math.atan2(y, x) - Math.atan2(y2, x2) + degToRad(this.angleLast);
        let d = radToDeg(r);
        const closeTo360D = (360 - d) < 5;
        const closeTo360P = (360 - this.anglePrevious) < 5;
        //const isDBelowPrevious = (d < this.anglePrevious);
        const diffAngles = d === this.anglePrevious ? "same" : d < this.anglePrevious ? "less" : "more";

        const {angleMin, angleMax, cannotReset, reverse, resetCondition, every} = this.options;

        if(cannotReset===true){
            if((((d-this.anglePrevious) > 350) && this.turns===0 && Math.floor(this.anglePrevious)===0) ||
            (this.turns===0 && this.direction==="down" && d>300 && this.anglePrevious<50 )
            ){
                this.isActive = false;
            } else if(this.isActive==false && d>this.anglePrevious && (d-this.anglePrevious) < 2) {
                this.isActive = true;
            }
        }

        if (this.started === true) {
            this.side = d<=180 ? "right" : "left";
            if ((closeTo360D && this.anglePrevious === 0) || (!closeTo360P && diffAngles === "less")) {
                this.direction = "down";
            }
            else if ((closeTo360P && d === 0) || (!closeTo360D && diffAngles === "more")) {
                this.direction = "up";
            }
        }

        d = (reverse === true) ? -(360 - d) : d;

        if (parseInt(d % every) === 0 && this.isActive===true) {
            this.angleCurrent = d;
            this.setAngle(this.angleCurrent);
            if(angleMin && angleMax && !resetCondition){
                const compare = d < angleMin && d < angleMax && d < 180 ? d + 360 : d;
                //angleMin != 0
                if (compare < angleMin) {
                    this.angleCurrent = angleMin;
                    this.setAngle(this.angleCurrent);
                }
                //angleMax != 360
                if (compare > angleMax) {
                    this.angleCurrent = angleMax;
                    this.setAngle(this.angleCurrent);
                }
            }
            if (this.anglePrevious > d && (this.directionPrevious === "up" && closeTo360D === false && closeTo360P === true && diffAngles === "less")) {
                this.turns++;
            }
            else if (this.anglePrevious < d && (this.directionPrevious === "down" && closeTo360D === true && closeTo360P === false && diffAngles === "more")) {
                this.turns = Math.max(0,this.turns-1)
            }
            this.percent = Math.round(this.angleCurrent/360*100);
            this.emit(Rotable.MOVE,d,this.percent);
            if (this.direction === "up") {
                this.emit(Rotable.MOVE_UP,d);
            }
            else if (this.direction === "down") {
                this.emit(Rotable.MOVE_DOWN,d);
            }
            this.anglePrevious = d;
            this.directionPrevious = this.direction;
            if (this.started === false && diffAngles != "same") {
                this.started = true;
            }
        }
    });

    onUp(e){
        if (this.snapValues != null) {
            const closest = getClosest(this.snapValues, this.angleCurrent);
            this.angleCurrent = closest;
            this.setAngle(this.angleCurrent);
            this.percent = Math.round(this.angleCurrent/360*100);
            this.emit(Rotable.MOVE,this.angleCurrent,this.percent);
        }
        
        this.triggeringElement.style["cursor"] = "grab";
        this.enabled = false;
        this.started = false;
        this.direction = undefined;
        this.directionPrevious = undefined;
        const {gapMin, returnToStart, angleStart} = this.options;
        const last = this.side === "left" && this.angleLast === 0 ? 360 : this.angleLast;
        const gap = Math.abs(this.angleCurrent - last);
        const gapRespected = gap > gapMin;
        if(returnToStart === true && !gapRespected){
            this.angleCurrent = angleStart;
            this.setAngle(this.angleCurrent);
            this.emit(Rotable.UP,this.angleCurrent,this.percent);
        } else {
            if(gapRespected){
                this.emit(Rotable.UP,this.angleCurrent,this.percent);
            } else {
                this.angleCurrent = angleStart;
                this.setAngle(this.angleCurrent);
            }
        }
    }

    replace(){
        const {angleStart} = this.options;
        this.angleCurrent = angleStart;
        this.setAngle(this.angleCurrent);
    }

    setAngle(angle) {
        this.triggeringElement.style["rotate"] = angle+"deg";
    }

    desactivate() {
        this.triggeringElement.style['pointer-events'] = 'none';
    }

    activate() {
        this.triggeringElement.style['pointer-events'] = '';
    }

    dispose() {
        this.enabled = false;
        this.triggeringElement.removeEventListener(EVENTS.DOWN_TOUCHSTART, this.handleDown);
        if(typeof this.options.transformOrigin === "function"){
            window.removeEventListener(EVENTS.RESIZE,this.handleResize);
        }
    }

    reset() {
        const {snapValues} = this.options;
        if(snapValues && !this.snapValues){
            if(Array.isArray(snapValues)){
                this.snapValues = [...snapValues];
            } else {
                const m = 360 / snapValues;
                for (var i = 1; i <= m; i++) {
                    this.snapValues[i - 1] = (snapValues * i);
                }
            }
        } 
        this.triggeringElement.style["cursor"] = "grab";
        this.setAngle(0);
        //Recalcul de décalage selon l'origine avec un angle forcé à 0
        this.from.center = { x: (this.box.left + this.origin.x), y: (this.box.top + this.origin.y) };
        this.setAngle(this.options.angleStart);
        this.angleCurrent = this.options.angleStart;
        this.angleLast = this.options.angleStart;
        this.anglePrevious = 0;
        this.turns = 0;
        this.percent = 0;
        this.direction;
        this.directionPrevious;
        this.started = false;
        this.enabled = false;
        this.emit(Rotable.RESET,this.angleCurrent);
    }
}