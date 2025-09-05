import EmitterMixin from "../lib/emitter-mixin.js";
import { getIntersection } from "../lib/dom.js";
import Rotable from "./rotable.js";

export default class Cards extends EmitterMixin {

    static get END(){
        return 'Cards.end';
    }

    static get MOVE(){
        return 'Cards.move';
    }

    static get EACH(){
        return 'Cards.each';
    }

    static get RESET(){
        return 'Cards.reset';
    }

    static get RIGHT(){
        return 'Cards.right'
    }

    static get WRONG(){
        return 'Cards.wrong'
    }

    constructor(props = {}){
        super();
        this.options = {
            datas: [],
            cards: null,
            gaugeEl:null,
            angleMin:344,
            angleMax:15,
            delayValidation: 1500,
            delay:"front",
            current:null,
            mustValidate:false,
            gapMin: 6,
            rightEl: null,
            leftEl: null,
            ...props
        }

        this.current = typeof this.options.current === "number" ? this.options.current : 1;
        this.total = this.options.cards.length;
        this.timeout;
        this.disposed = false;
        this.success = false;
        this.finished = false;
        this.cards = [];

        this.handleValidate = this.validate.bind(this);

        this.init();
        this.update();
    }

    set disabled(boolean){
        if(typeof boolean === "boolean"){
            for (let c = 1; c <= this.cards.length; c++) {
                const card = this.cards[c - 1];
                card.desactivate();
                if(boolean === false && this.current === c){
                    card.activate();
                }
            }
        }
    }

    init(){
        const {angleMax, angleMin ,mustValidate, gapMin} = this.options;
        for (let c = 1; c <= this.options.cards.length; c++) {
            const card = this.options.cards[c-1];
            const datas = this.options.datas[c-1] || {side:"leftright"}
            const options = {
                element:card,
                num:c,
                delay:this.options.delay,
                ...datas
            }
            this.cards.push(new Card(options,this.options));
            this.cards[c-1].rotable = new Rotable({
                element:card,
                angleMax, angleMin,
                gapMin
            });
            this.cards[c-1].rotable.on(Rotable.UP,this.handleValidate);
            this.cards[c-1].rotable.on(Rotable.MOVE,() => {
                this.emit(Cards.MOVE);
            });
            card.style["z-index"] = this.total-c;
            this.cards[c-1].reset().desactivate();
        }
    }
    update(){
        const card = this.cards[this.current-1];
        card.flip();
        if(this.options.gaugeEl instanceof HTMLElement){
            const levelEls = this.options.gaugeEl.children;
            if(levelEls){
                const currentEl = this.options.gaugeEl.querySelector(".current")
                if(currentEl){
                    currentEl.classList.remove("current")
                }
                levelEls[this.current-1].classList.add("current")
            }    
        }
    }
    dispose(){
        for (let c = 1; c <= this.cards.length; c++) {
            const card = this.cards[c - 1];
            card.style["z-index"] = "";
            card.rotable.dispose();
        }
        clearTimeout(this.timeout);
        this.disposed = true;
    }
    reset(){
        this.currentAttempt = 1;
        this.current = typeof this.options.current === "number" ? this.options.current : 1;
        this.success = false;
        this.finished = false;
        if (this.disposed == true) {
            this.disposed = false;
        }
        for (let c = 1; c <= this.cards.length; c++) {
            const card = this.cards[c - 1];
            card.element.style["z-index"] = this.total-c;
            if(card.content){
                card.content.style["opacity"] = 1;
                card.content.style.transition = "";
            }
            card.reset().desactivate();
        }
        if(this.options.gaugeEl instanceof HTMLElement){
            const levelEls = this.options.gaugeEl.children;
            if(levelEls){
                for (let l=1; l<=levelEls.length; l++){
                    const levelEl = levelEls[l-1]
                    levelEl.classList.remove("current")
                    levelEl.classList.remove("right")
                    levelEl.classList.remove("wrong")
                }
            }
        }
        this.update();
        this.emit(Cards.RESET);
        return this;
    }
    validate(){
        const {gaugeEl, mustValidate, delayValidation, rightEl, leftEl} = this.options;
        const card = this.cards[this.current-1];
        const {rotable, side} = card;
        let levelEl;
        let rightFlag = false;
        let rightOver = true;
        let leftOver = true;
        if(gaugeEl instanceof HTMLElement){
            const levelEls = gaugeEl.children;
            levelEl = levelEls[this.current-1];
            if(levelEl){
                levelEl.classList.remove("current");
            }
        }
        //Si présence des élements rightEl et wrongEl, il faut les survoler afin de déclencher les événements
        if(rightEl && leftEl){
            rightOver = getIntersection(rightEl,card.element) && side.includes("right");
            leftOver = getIntersection(leftEl,card.element) && side.includes("left");
        }
        if(side.indexOf(rotable.side)!=-1 && (rightOver||leftOver)){
            rightFlag = true;
            card.isRight();
            if(levelEl){
                levelEl.classList.add("right");
            }
            this.emit(Cards.RIGHT);
        } else {
            card.isWrong();
            if(levelEl){
                levelEl.classList.add("wrong");
            }
            rotable.replace();
            this.emit(Cards.WRONG);
        }
        if(mustValidate === false || (mustValidate === true && rightFlag===true)){
            card.desactivate();
            this.timeout = setTimeout(() => {
                if(card.content){
                    card.content.style.transition = "opacity ease-out .5s"; 
                    card.content.style.opacity = 0;
                    setTimeout(()=>{
                        card.content.style.transition = "";
                    },600);
                }
                this.next();
            },delayValidation);
        } 
    }
    next(){
        if(this.current<this.total){
            this.current++;
            this.update();
            this.emit(Cards.EACH);
        } else {
            const corrects = this.cards.filter(function(card){ return card.correct===true}).length;
            this.success = corrects>=this.total/2;
            this.finished = true;
            this.emit(Cards.END);
        }
    }
}

class Card {
    constructor(props = {}){
        this.element = props.element;
        this.content = this.element.querySelector(".card-content");
        this.num = props.num;
        this.side = props.side;
        this.correct = null;
        this.delay = props.delay;
        this.timeout;

        this.handleActivate = this.activate.bind(this);
    }

    select(){
        this.isSelected = true;
        this.addClass("selected");
    }
    unselect(){
        this.isSelected = false;
        this.removeClass("selected");
    }
    update(){
        const side = this.movable.sides.x;
        this.element.setAttribute("side",side);
    }
    flip(){
        if(!this.element.classList.contains("flipped")){
            this.element.classList.add("flipped");
            this.trigger();
        }
    }
    trigger(){
        const delay = null;
        if(typeof this.delay === "number"){
            if(this.delay > 0){
                delay = this.delay;
            }
        }
        else if(typeof this.delay === "string"){
            const animated = this.element.querySelector("."+this.delay);
            if(animated){
                const datas = window.getComputedStyle(animated).getPropertyValue("animation-duration")
                if(datas.length > 0){
                    delay = parseFloat(datas)*1000;
                }
            }  
        }
        if(delay){
            this.timeout = setTimeout(this.handleActivate,delay);
        } else {
            this.activate();
        }
    }
    reset(){
        this.correct = null;
        this.element.classList.remove("unselected");
        this.element.classList.remove("selected");
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.element.classList.remove("corrected");
        this.element.classList.remove("flipped");
        this.element.removeAttribute("side");
        this.replace();
        return this;
    }
    replace(){
        this.element.removeAttribute("side");
        this.rotable.reset();
        return this;
    }
    activate(e){
        this.element.style["pointer-events"] = "";
    }
    desactivate(){
        this.element.style["pointer-events"] = "none";
    }
    isRight(){
        this.correct = true;
        this.addClass("right");
    }
    isWrong(){
        this.correct = false;
        this.addClass("wrong");
    }
    isCorrected(){
        this.correct = true;
        this.addClass("corrected");
    }
    addClass(cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        const tab = !Array.isArray(cl) ? [cl] : cl;
        for (let t=1; t<=tab.length; t++){
            this.element.classList.add(tab[t-1]);
        }
    }
    removeClass(cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        const tab = !Array.isArray(cl) ? [cl] : cl;
        for (let t=1; t<=tab.length; t++){
            this.element.classList.remove(tab[t-1]);
        }
    }
}