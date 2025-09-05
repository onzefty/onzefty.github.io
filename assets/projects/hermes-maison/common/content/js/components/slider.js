import EmitterMixin from "../lib/emitter-mixin.js";
import { clamp, EVENTS } from "../lib/utils.js";

export default class Slider extends EmitterMixin {
    static get END(){
        return 'Slider.end';
    }
    static get RESET(){
        return 'Slider.reset';
    }
    static get EACH(){
        return 'Slider.each';
    }
    static get EACHEND(){
        return 'Slider.eachEnd';
    }
    static get EXTREME(){
        return 'Slider.extreme';
    }
    constructor(props = {}){
        super();
        this.options = {
            element: document.createElement("div"),
            btNext: null,
            btPrev: null,
            gauge: null,
            axis:"x",
            reverse:false,
            duration:0.6,
            slideClass:"slide",
            inactiveClass:"inactive",
            activeClass:"active",
            easing: "ease-out",
            fading: false,
            disablingEl: null,
            ...props
        }

        this.ignore = [];
        this.current = 1;
        this.forceEnd = false;
        this.ended = false;
        this.slides = []; 
        
        const slides = this.options.element.querySelectorAll("." + this.options.slideClass);

        if(!slides){
            return console.warn("No slides elements found.");
        }

        this.disablingEl = this.options.disablingEl instanceof HTMLElement ? this.options.disablingEl : this.options.element.parentNode;

        this.handleNext = this.nextSlide.bind(this);
        this.handlePrev = this.prevSlide.bind(this);
        this.handleTransitioncbEnd = this.cbTransitionEnd.bind(this);
        this.handleDisplay = this.display.bind(this);
        this.init();
        this.setAtPos();
        this.emit(Slide.EACH,this.current);
        this.activate();
        this.addEvents();
    }

    get min(){
        let min = 0;
        do {
            min++;
        }
        while (this.ignore.indexOf(min) != -1);

        return min;
    }

    get max(){
        let max = this.slides.length + 1;
        do {
            max--;
        }
        while (this.ignore.indexOf(max) != -1);

        return max;
    }

    display(e){
        const current = this.current;
        if(typeof e === "number"){
            this.current = e;
        } else {
            const target = e.target;
            this.current = parseInt(target.getAttribute("level"));    
        }
        if (this.checkCompletion()) {
            this.ended = true;
            this.emit(Slider.END);
        }
        this.move(current);
    }

    render(){
        if(this.options.gauge instanceof HTMLElement){
            const levels = this.options.gauge.children;
            const currentLevel = this.options.gauge.querySelector(".current");
            if(currentLevel){
                currentLevel.classList.remove("current");
            }
            levels[this.current-1].classList.add("current")
        }
    }

    setAtPos(pos) {
        if (typeof pos === "number") {
            this.current = clamp(this.min,pos,this.max);
        }
        for (let t = 1; t <= this.slides.length; t++) {
            const slide = this.slides[t - 1];
            slide.element.style["transition-duration"] = "0s";
            if (t != this.current) {
                const value = (this.options.reverse === true) ? -101 : 101;
                slide.render(value);
            } else {
                const value = 0;
                slide.render(value);
            }
            slide.element.style["transition-duration"] = "";
        }
        this.render();
        //this.moveKeepers(false);
    }

    move(dir) {
        this.forceEnd = false;
        const toShowSlide = this.slides[this.current - 1];
        const toHideIndex = typeof dir === "number" ? dir-1 : (dir === "next") ? this.getPrev()-1 : this.current;
        const toHideSlide = this.slides[toHideIndex];

        const {easing,duration,reverse} = this.options;

        toShowSlide.element.style["pointer-events"] = "";
        toShowSlide.play({duration,easing,value:0});

        if (toHideSlide) {
            const value = ((dir === "next" && reverse === false) || (dir === "prev" && reverse === true)) ? -101 : 101;
            toHideSlide.play({duration,easing,value});
        }
        this.render();
        this.moveKeepers(true);
    }
    getNext() {
        let current = this.current;
        do {
            current++;
        }
        while (this.ignore.indexOf(current) != -1);
        if (current <= this.max) {
            return current;
        } else {
            return null;
        }
    }
    getPrev() {
        let current = this.current;
        do {
            current--;
        }
        while (this.ignore.indexOf(current) != -1);
        if (current >= 1) {
            return current;
        } else {
            return null;
        }
    }
    moveKeepers(animated) {
        const keepers = this.options.element.querySelectorAll('[keep]');
        if (keepers) {
            for (let k = 1; k <= keepers.length; k++) {
                const keeper = keepers[k - 1];
                const parent = keeper.parentNode;
                const num = parent.num;
                const dim = this.options.axis === "x" ? parent.offsetWidth : parent.offsetHeight;
                const attr = keeper.getAttribute("keep");
                const values = attr.split("-");
                if (values.indexOf(this.current.toString()) != -1) {
                    const diff = (this.current - num);
                    const val = (this.options.reverse === true) ? -(diff * dim) : (diff * dim);
                    if (animated) {
                        keeper.style["transition-duration"] = this.options.duration + "s";
                        keeper.style["transition-timing-function"] = this.options.easing;
                    } else {
                        keeper.style["transition-duration"] = "0s";
                    }
                    keeper.style["transform"] = "translate" + this.cssValue + "(" + val + "px)";
                    if (animated === false) {
                        keeper.style["transition-duration"] = "";
                    }
                }
            }
        }
    }
    nextSlide() {
        const current = this.getNext();
        if (current) {
            this.current = current;
            this.desactivate();
            this.move("next");
            this.emit(Slider.EACH,this.current,"next"); 
            if (this.checkCompletion()) {
                this.ended = true;
                this.emit(Slider.END);
            }
        } else {
            this.emit(Slider.EXTREME);
        }
    }
    prevSlide() {
        const current = this.getPrev();
        if (current) {
            this.current = current;
            this.desactivate();
            this.move("prev");
            this.emit(Slider.EACH,this.current,"prev"); 
        } else {
            this.emit(Slider.EXTREME);
        }
    }
    cbTransitionEnd(e) {
        if (this.forceEnd === false) {
            this.forceEnd = true;
            const target = e.target;
            if (target.style.opacity == 0) {
                target.style["pointer-events"] = "none";
            } else {
                target.style["pointer-events"] = "";
            }
            this.emit(Slider.EACHEND,this.current);
            this.activate();
        }
    }
    activate() {
        if (this.options.btNext && this.options.btPrev) {
            this.options.btNext.style["pointer-events"] = "";
            this.options.btPrev.style["pointer-events"] = "";

            if (this.current === this.min) {
                this.options.btPrev.classList.add(this.options.inactiveClass);
                this.options.btPrev.classList.remove(this.options.activeClass);
                this.options.btNext.classList.remove(this.options.inactiveClass);
                this.options.btNext.classList.add(this.options.activeClass);
            }
            else if (this.current === this.max) {
                this.options.btNext.classList.add(this.options.inactiveClass);
                this.options.btNext.classList.remove(this.options.activeClass);
                this.options.btPrev.classList.remove(this.options.inactiveClass);
                this.options.btPrev.classList.add(this.options.activeClass);
            } else {
                this.options.btPrev.classList.remove(this.options.inactiveClass);
                this.options.btPrev.classList.add(this.options.activeClass);
                this.options.btNext.classList.remove(this.options.inactiveClass);
                this.options.btNext.classList.add(this.options.activeClass);
            }
        }
    }
    desactivate() {
        if (this.options.btNext && this.options.btPrev) {
            this.options.btNext.style["pointer-events"] = "none";
            this.options.btPrev.style["pointer-events"] = "none";

            if (this.current === 1) {
                this.options.btPrev.classList.add(this.options.inactiveClass);
                this.options.btPrev.classList.remove(this.options.activeClass);
                this.options.btNext.classList.remove(this.options.inactiveClass);
                this.options.btNext.classList.add(this.options.activeClass);
            }
            else if (this.current === this.max) {
                this.options.btNext.classList.add(this.options.inactiveClass);
                this.options.btNext.classList.remove(this.options.activeClass);
                this.options.btPrev.classList.remove(this.options.inactiveClass);
                this.options.btPrev.classList.add(this.options.activeClass);
            } else {
                this.options.btPrev.classList.remove(this.options.inactiveClass);
                this.options.btPrev.classList.add(this.options.activeClass);
                this.options.btNext.classList.remove(this.options.inactiveClass);
                this.options.btNext.classList.add(this.options.activeClass);
            }
        }
    }
    checkCompletion() {
        return (this.current === this.max)
    }
    init() {
        const slides = this.options.element.querySelectorAll("." + this.options.slideClass);
        for (let s = 1; s <= slides.length; s++) {
            const slide = slides[s - 1];
            this.slides.push(new Slide({
                element:slide,
                num:s,
                index: this.options.axis === "x" ? 0 : 1
            })) 
        }
        const keepers = this.options.element.querySelectorAll('[keep]');
        if (keepers) {
            for (let k = 1; k <= keepers.length; k++) {
                const keeper = keepers[k - 1];
                keeper.style["transition-property"] = "transform";
            }
        }
    }
    reset() {
        this.current = 1;
        this.ended = false;
        this.setAtPos();
        this.emit(Slider.EACH,this.current);
        this.emit(Slider.RESET); 
        this.activate();
    }
    enable() {
        this.disablingEl.style["pointer-events"] = "";
    }
    disable() {
        this.disablingEl.style["pointer-events"] = "none";
    }
    addEvents() {
        if (this.options.btNext && this.options.btPrev){
            this.options.btNext.addEventListener(EVENTS.CLICK_TOUCH,this.handleNext);
            this.options.btPrev.addEventListener(EVENTS.CLICK_TOUCH,this.handlePrev);
        }
        else if(this.options.gauge instanceof HTMLElement){
            const levels = this.options.gauge.children;
            for (let l = 1; l <= levels.length; l++) {
                const level = levels[l - 1];
                level.setAttribute("level",l);
                level.addEventListener(EVENTS.CLICK_TOUCH, this.handleDisplay);
            }
        }
        for (let t = 1; t <= this.slides.length; t++) {
            const slide = this.slides[t - 1];
            slide.element.addEventListener(EVENTS.TRANSITION_END, this.handleTransitioncbEnd);
        }
    }
    removeEvents() {
        if (this.options.btNext && this.options.btPrev) {
            this.options.btNext.removeEventListener(EVENTS.CLICK_TOUCH,this.handleNext);
            this.options.btPrev.removeEventListener(EVENTS.CLICK_TOUCH,this.handlePrev);
        }
        else if(this.options.gauge instanceof HTMLElement){
            const levels = this.options.gauge.children;
            for (let l = 1; l <= levels.length; l++) {
                const level = levels[l - 1];
                level.removeEventListener(EVENTS.CLICK_TOUCH, this.handleDisplay);
            }
        }
        for (const t = 1; t <= this.slides.length; t++) {
            const slide = this.slides[t - 1];
            slide.removeEventListener(EVENTS.TRANSITION_END, this.handleTransitioncbEnd);
        }
    }
}

class Slide {
    constructor(props = {}){
        this.element = props.element;
        this.num = props.num;
        this.index = props.index;

        this.element.style["transition-property"] = "opacity, translate";
    }

    render(value){
        const value1 = this.index === 0 ? value+"%" : "0%";
        const value2 = this.index === 1 ? value+"%" : "0%";
        this.element.style.translate = value1+" "+value2;
    }

    play({duration,value,easing}){
        this.element.style["transition-duration"] = duration + "s";
        this.element.style["transition-timing-function"] = easing;
        this.render(value);
    }
}