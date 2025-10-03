import EmitterMixin from "../emitter/emitter-mixin.js";
import { clamp, EVENTS, isObject } from "../utils/utils.js";

const DEFAULT_OPTIONS = {
    sliderClass: "slider",
    slideClass: "slide",
    duration: 0.6,
    navigationInnavigationActiveClass: "inactive",
    navigationActiveClass: "active",
    navigationCurrentClass: "current",
    easing: "ease-out",
    axis: "x",
}

const DEFAULT_TRANSITIONS = {
    "x": {
        out: {translate: "101% 0%", opacity: 0},
        in: {translate: "0% 0%", opacity: 1}
    },
    "y": {
        out: {translate: "0% 101%", opacity: 0},
        in: {translate: "0% 0%", opacity: 1}
    }
}

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
    static get EACHSTART(){
        return 'Slider.eachStart';
    }
    static get NEXT(){
        return 'Slider.next';
    }
    static get PREVIOUS(){
        return 'Slider.previous';
    }
    static get EXTREME(){
        return 'Slider.extreme';
    }
    constructor(props = {}){
        super();
        this.options = {
            list: [],
            btNext: null,
            btPrev: null,
            progress: null,
            reverse:false,
            fading: false,
            disablingEl: null,
            auto: true,
            resizable: false,
            ...DEFAULT_OPTIONS,
            ...props
        }

        this.list = new Map();
        this.excluded = [];
        this.current = 1;
        this.forceEnd = false;
        this.rafID = null;
        this.resized = false;
        this.ticking = true;

        this.handleNext = this.nextSlide.bind(this);
        this.handlePrev = this.prevSlide.bind(this);
        this.handleDisplay = this.display.bind(this);
        this.handleBoundResize = this.handleResize.bind(this);
        this.handleTick = this.tick.bind(this);
        
        //this.disablingEl = this.options.disablingEl instanceof HTMLElement ? this.options.disablingEl : this.options.element.parentNode;

        this.init();
        this.addEvents();
        if(this.options.auto === true){
            this.setAtPos();
            this.activate();
        }
        if(this.resizable){
            this.tick();
            this.resizeSlides();
        }
    }

    get min(){
        let min = 0;
        do {
            min++;
        }
        while (this.excluded.indexOf(min) != -1);

        return min;
    }

    get max(){
        let max = this.total + 1;
        do {
            max--;
        }
        while (this.excluded.indexOf(max) != -1);

        return max;
    }

    get total() {
        let total = 0;
        for(const [key,slider] of this.list){
            const {slides} = slider;
            total = Math.max(total,slides.length);
        }
        return total;
    }

    get slides(){
        const array = [];
        for(const [key,slider] of this.list){
            const {slides} = slider;
            array.push(slides[this.current - 1]);
        }
        return array;
    }

    get seen(){
        let seen = 0;
        for(const [key,slider] of this.list){
            const {slides} = slider;
            seen = Math.max(seen,slides.filter(slide => slide.seen === true).length);
        }
        return seen;
    }

    get ended(){
        return this.seen === this.total;
    }

    get resizable(){
        if(this.options.resizable !== true){
            return true;
        }
        const check = Array.from(this.list.values()).filter(slider => slider.resizable === true).length >= 0;
        if(check){
            return true;
        } else {
            return false;
        }
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
            this.emit(Slider.END);
        }
        this.move(current);
    }

    render(){
        const {progress, navigationCurrentClass} = this.options;
        if(progress instanceof HTMLElement){
            const levels = progress.children;
            const currentLevel = progress.querySelector("."+navigationCurrentClass);
            if(currentLevel){
                currentLevel.classList.remove(navigationCurrentClass);
            }
            levels[this.current-1].classList.add(navigationCurrentClass);
        }
    }

    setAtPos(pos) {
        if (typeof pos === "number") {
            this.current = clamp(this.min,pos,this.max);
        }
        let toShowSlide = null;
        for(const [element,slider] of this.list){
            const {slides, reverse} = slider;
            element.setAttribute("data-current",this.current);
            for (let t = 1; t <= slides.length; t++) {
                const slide = slides[t - 1];
                slide.element.style["transition-duration"] = "0s";
                if (t != this.current) {
                    slide.render("out");
                } else {
                    slide.render("in");
                    slide.seen = true;
                    toShowSlide = slide;
                }
                slide.element.style["transition-duration"] = "";
            }
        }
        this.resizeSlides();
        this.render();
        this.emit(Slider.EACHSTART,{
            current:this.current,
            toShowSlide
        });
        this.emit(Slider.EACH,{
            current:this.current,
            toShowSlide
        });
        if (this.checkCompletion()) {
            this.emit(Slider.END);
        }
    }

    move(dir) {
        this.forceEnd = false;
        let toShowSlide = null;
        let toHideSlide = null;
        const promises = [];
        for(const [element,slider] of this.list){
            element.setAttribute("data-current",this.current);
            const {slides,easing,duration,reverse} = slider;
            toShowSlide = slides[this.current - 1];
            const toHideIndex = typeof dir === "number" ? dir-1 : (dir === "next") ? this.getPrev()-1 : this.getNext() - 1;
            toHideSlide = slides[toHideIndex];

            toShowSlide.element.style["pointer-events"] = "";
            toShowSlide.seen = true;
            promises.push(toShowSlide.play("in",duration,easing));

            if (toHideSlide) {
                toHideSlide.play("out",duration,easing,dir);
            }
        }

        this.resizeSlides();

        Promise.all(promises).then(() => {
            this.emit(Slider.EACH,{
                current:this.current,
                toShowSlide,toHideSlide
            });
            this.activate();
        });

        this.emit(Slider.EACHSTART,{
            current:this.current,
            toShowSlide,toHideSlide
        });
        
        this.render();
    }
    getNext() {
        let current = this.current;
        do {
            current++;
        }
        while (this.excluded.indexOf(current) != -1);
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
        while (this.excluded.indexOf(current) != -1);
        if (current >= 1) {
            return current;
        } else {
            return null;
        }
    }
    nextSlide() {
        const current = this.getNext();
        if (current) {
            this.current = current;
            this.desactivate();
            this.move("next");
            this.emit(Slider.NEXT);
            if (this.checkCompletion()) {
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
            this.emit(Slider.PREVIOUS);
            if (this.checkCompletion()) {
                this.emit(Slider.END);
            }
        } else {
            this.emit(Slider.EXTREME);
        }
    }
    activate() {
        const {btNext,btPrev, navigationInnavigationActiveClass, navigationActiveClass} = this.options;
        if (btNext && btPrev) {
            btNext.style["pointer-events"] = "";
            btPrev.style["pointer-events"] = "";
            btPrev.classList.remove(navigationInnavigationActiveClass);
            btPrev.classList.add(navigationActiveClass);
            btNext.classList.remove(navigationInnavigationActiveClass);
            btNext.classList.add(navigationActiveClass);
            if (this.current === this.min) {
                btPrev.classList.add(navigationInnavigationActiveClass);
                btPrev.classList.remove(navigationActiveClass);
            }
            if (this.current === this.max) {
                btNext.classList.add(navigationInnavigationActiveClass);
                btNext.classList.remove(navigationActiveClass);
            } 
        }
    }
    desactivate() {
        const {btNext,btPrev, navigationInnavigationActiveClass, navigationActiveClass} = this.options;
        if (btNext && btPrev) {
            btNext.style["pointer-events"] = "none";
            btPrev.style["pointer-events"] = "none";

            if (this.current === 1) {
                btPrev.classList.add(navigationInnavigationActiveClass);
                btPrev.classList.remove(navigationActiveClass);
                btNext.classList.remove(navigationInnavigationActiveClass);
                btNext.classList.add(navigationActiveClass);
            }
            else if (this.current === this.max) {
                btNext.classList.add(navigationInnavigationActiveClass);
                btNext.classList.remove(navigationActiveClass);
                btPrev.classList.remove(navigationInnavigationActiveClass);
                btPrev.classList.add(navigationActiveClass);
            } else {
                btPrev.classList.remove(navigationInnavigationActiveClass);
                btPrev.classList.add(navigationActiveClass);
                btNext.classList.remove(navigationInnavigationActiveClass);
                btNext.classList.add(navigationActiveClass);
            }
        }
    }
    checkCompletion() {
        return (this.seen === this.max)
    }
    init() {
        let {list, slideClass} = this.options;
        if(isObject(list)){
            list = [list];
        }
        if(!Array.isArray(list)){
            return console.warn("Elements must be an array");
        }

        list.forEach((datas,index) => {
            const {element, axis, reverse, easing, duration, resizable} = datas;
            const children = Array.from(element.children);
            const slideElements = children.filter(child => child.classList.contains(slideClass) );
            let resizableOption = false;
            if(resizable === true){
                resizableOption = true;
            } else {
                if(this.options.resizable !== false){
                    if(Array.isArray(this.options.resizable)){
                        resizableOption = this.options.resizable[index] !== null ? this.options.resizable[index] : this.options.resizable[0];
                    } else if (typeof this.options.resizable === "boolean") {
                        resizableOption = this.options.resizable;
                    }
                }
            }
            if(slideElements){
                const slides = [];
                for (let s = 1; s <= slideElements.length; s++) {
                    const slideElement = slideElements[s - 1];
                    slides.push(new Slide({
                        element:slideElement,
                        reverse: reverse || this.options.reverse,
                        num:s,
                        index: (axis || this.options.axis) === "x" ? 0 : 1
                    })) 
                }
                this.list.set(element,{
                    axis: axis || this.options.axis,
                    reverse: reverse || this.options.reverse,
                    easing: easing || this.options.easing,
                    duration: duration || this.options.duration,
                    resizable: resizableOption,
                    slides,
                    num: index + 1
                });
            }
        });
    }
    reset() {
        this.current = 1;
        this.setAtPos();
        this.emit(Slider.RESET); 
        this.activate();
    }
    enable() {
        this.disablingEl.style["pointer-events"] = "";
    }
    disable() {
        this.disablingEl.style["pointer-events"] = "none";
    }
    exclude(number) {
        if(typeof number !== "number"){
            return console.warn("Number must be a number");
        }
        const exclusion = clamp(this.min,number,this.max);
        if(this.excluded.indexOf(exclusion) === -1){
            this.excluded.push(number);
            for(const [key,slider] of this.list){
                const {slides,easing,duration} = slider;
                const toHideSlide = slides[exclusion - 1];
                if (toHideSlide) {
                    //const value = 101;
                    //toHideSlide.play({duration,easing,value});
                    toHideSlide.play("out",duration,easing);
                }
            }
            if(exclusion === this.current){
                const next = this.getNext();
                const previous = this.getPrev();
                if(next){
                    this.current = next;
                    this.move("next");
                }
                else if(previous){
                    this.current = previous;
                    this.move("prev");
                }
            }   
        }
    }
    addEvents() {
        const {btNext,btPrev,progress} = this.options;
        if (btNext && btPrev){
            btNext.addEventListener(EVENTS.CLICK_TOUCH,this.handleNext);
            btPrev.addEventListener(EVENTS.CLICK_TOUCH,this.handlePrev);
        }
        else if(progress instanceof HTMLElement){
            const levels = progress.children;
            for (let l = 1; l <= levels.length; l++) {
                const level = levels[l - 1];
                level.setAttribute("level",l);
                level.addEventListener(EVENTS.CLICK_TOUCH, this.handleDisplay);
            }
        }
        if(this.resizable){
            this.ticking = true;
            this.rafID = requestAnimationFrame(this.handleTick);
            window.addEventListener(EVENTS.RESIZE, this.handleBoundResize);
        }
    }
    resizeSlides() {
        for(const [key,slider] of this.list){
            const {slides,resizable} = slider;
            if(resizable === true){
                const currentSlide = slides[this.current - 1];
                if (currentSlide) {
                    key.style.height = `${currentSlide.element.scrollHeight}px`;
                }
            }
        }
    }
    tick() {
        if (!this.ticking) {
            return;
        }

        if (this.resized) {
            this.resizeSlides();
            this.resized = false;
        }

        this.rafID = requestAnimationFrame(this.handleTick);
    }
    handleResize() {
        for(const [key,slider] of this.list){
            const {resizable} = slider;
            if(resizable){
                key.style.height = "";
            }
        }
        this.resized = true;
    }
    dispose() {
        this.off();
        const {btNext,btPrev,progress} = this.options;
        if (btNext && btPrev) {
            btNext.removeEventListener(EVENTS.CLICK_TOUCH,this.handleNext);
            btPrev.removeEventListener(EVENTS.CLICK_TOUCH,this.handlePrev);
        }
        else if(progress instanceof HTMLElement){
            const levels = progress.children;
            for (let l = 1; l <= levels.length; l++) {
                const level = levels[l - 1];
                level.removeEventListener(EVENTS.CLICK_TOUCH, this.handleDisplay);
            }
        }
        for(const [key,slider] of this.list){
            const {slides,resizable} = slider;
            if(resizable){
                key.style.height = "";
            }
            for (let t = 1; t <= slides.length; t++) {
                const slide = slides[t - 1];
                slide.dispose();
            }
        }
        if(this.resizable){
            this.ticking = false;
            cancelAnimationFrame(this.rafID);
            window.removeEventListener(EVENTS.RESIZE, this.handleBoundResize);
        }
    }
}

class Slide extends EmitterMixin {
    constructor(props = {}){
        super();
        this.element = props.element;
        this.num = props.num;
        this.index = props.index;
        this.reverse = props.reverse;
        this.forceEnd = false;
        this.seen = false;
        this.handleTransitionEnd = this.onTransitionEnd.bind(this);
        this.init();
    }

    get out(){
        const dataOut = this.element.getAttribute("data-out");
        if(dataOut){
            return JSON.parse(dataOut);
        }
        if((this.direction === "next" && this.reverse === false) || (this.direction === "prev" && this.reverse === true)){
            const obj = {...DEFAULT_TRANSITIONS[this.index === 0 ? "x" : "y"].out}
            obj.translate = this.index === 0 ? "-101% 0%" : "0% -101%";
            return obj;
        }
        return DEFAULT_TRANSITIONS[this.index === 0 ? "x" : "y"].out;
    }

    get in(){
        const dataIn = this.element.getAttribute("data-in");
        if(dataIn){
            return JSON.parse(dataIn);
        }
        return DEFAULT_TRANSITIONS[this.index === 0 ? "x" : "y"].in;
    }

    init(){
        const properties = Object.keys(this.out).join(",");
        this.element.style["transition-property"] = properties;
    }

    isVisible(){
        return this.element.offsetWidth > 0 && this.element.offsetHeight > 0;
    }

    onTransitionEnd(e){
        if (this.forceEnd === false) {
            this.forceEnd = true;
            const target = e.target;
            if (target.style.opacity === 0) {
                target.style["pointer-events"] = "none";
            } else {
                target.style["pointer-events"] = "";
            }
        }
    }

    render(position,direction){
        this.direction = direction;
        const obj = position === "out" ? this.out : this.in;
        for(const prop in obj){
            this.element.style[prop] = obj[prop];
        }
    }

    play(position,duration,easing,direction){
        this.forceEnd = false;
        this.element.style["transition-duration"] = duration + "s";
        this.element.style["transition-timing-function"] = easing;
        this.render(position,direction);
        return new Promise((resolve) => {
            if(this.isVisible()){
                this.element.ontransitionend = (event) => {
                    this.handleTransitionEnd(event);
                    resolve();
                }
            } else {
                this.handleTransitionEnd({target:this.element});
                resolve();
            }
        });
    }

    dispose(){
        this.off();
    }
}