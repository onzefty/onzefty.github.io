import EmitterMixin from "../emitter/emitter-mixin.js";
import { clamp, EVENTS, isObject, getElementFrom } from "../utils/utils.js";

const DEFAULT_OPTIONS = {
    displayableClass: "displayable",
    triggerClass: "displayable-trigger",
    hiddenClass: "hidden",
    visibleClass: "visible",
    seenClass: "seen",
    currentClass: "current",
    buttonCloseClass: "button-close",
    onlyOne: false,
    displayed: false,
    // visible | hidden | none
    seenWhen: "hidden"
}

export default class DisplayableManager extends EmitterMixin {
    static get END(){
        return 'DisplayableManager.end';
    }
    static get RESET(){
        return 'DisplayableManager.reset';
    }
    static get RENDER(){
        return 'DisplayableManager.render';
    }
    constructor(props = {}){
        super();
        this.options = {
            wrapper: null,
            ...DEFAULT_OPTIONS,
            ...props
        }

        this.list = new Map();
        this.handleRender = this.render.bind(this);
        this.handleUpdate = this.update.bind(this);

        this.init();
    }

    get total() {
        return this.list.size;
    }

    get seen(){
        return Array.from(this.list.values()).filter(displayable => displayable.seen).length === this.total;
    }

    get visible(){
        const array = Array.from(this.list.values());
        const displayable = array.find(displayable => displayable.state === this.options.visibleClass);
        return displayable;
    }

    update(event){
        const {target} = event;
        if(this.seen === true){
            this.emit(DisplayableManager.END, target);
        }
    }

    render(event){
        const {target} = event;
        if(this.options.onlyOne === true){
            for(const displayable of this.list.values()){
                if(target !== displayable){
                    displayable.forceHide();
                }
            }
        }
        this.emit(DisplayableManager.RENDER, target);
        this.update(event);
    }

    init() {
        let {displayed, displayableClass, triggerClass, buttonCloseClass, wrapper, visibleClass, hiddenClass, seenWhen, seenClass, currentClass} = this.options;
        this.wrapper = getElementFrom(wrapper);
        if(!this.wrapper){
            return console.warn("Wrapper not found");
        }

        const displayableList = this.wrapper.querySelectorAll("." + displayableClass);
        const triggerList = this.wrapper.querySelectorAll("." + triggerClass);

        for(let i = 1; i <= displayableList.length; i++){
            const displayableEl = displayableList[i-1];
            const trigger = triggerList[i-1];
            const seeWhenValue = Array.isArray(seenWhen) ? seenWhen[i-1] : seenWhen;
            const buttonClose = displayableEl.querySelectorAll("." + buttonCloseClass).length > 1 ? displayableEl.querySelectorAll("." + buttonCloseClass) : displayableEl.querySelector("." + buttonCloseClass);
            const displayable = new Displayable({
                element: displayableEl,
                trigger,
                number: i,
                buttonClose,
                visibleClass, hiddenClass, seenWhen: seeWhenValue, seenClass, currentClass
            })
            this.list.set(displayableEl,displayable);
            displayable.on(Displayable.SHOW, this.handleRender);
            displayable.on(Displayable.HIDE, this.handleRender);
            displayable.on(Displayable.SEEN, this.handleUpdate);

            if(typeof displayed === "number" && displayed === i){
                displayable.show();
            }
        }
    }

    dispose() {
        this.off();
        for(const displayable of this.list.values()){
            displayable.dispose();
        }
        
    }
}

class Displayable extends EmitterMixin {
    static get HIDE(){
        return 'Displayable.hide';
    }
    static get SHOW(){
        return 'Displayable.show';
    }
    static get SEEN(){
        return 'Displayable.seen';
    }
    constructor(props = {}){
        super();
        this.element = props.element;
        this.trigger = props.trigger;
        this.number = props.number;
        this.buttonClose = props.buttonClose;
        this.visibleClass = props.visibleClass;
        this.hiddenClass = props.hiddenClass;
        this.seenClass = props.seenClass;
        this.currentClass = props.currentClass;
        this.seenWhen = props.seenWhen;

        this.handleHide = this.hide.bind(this);
        this.handleToggle = this.toggle.bind(this);

        this.reset();
        this.addEvents();
    }

    get state(){
        const isVisible = this.element.classList.contains(this.visibleClass);
        return isVisible ? 'visible' : 'hidden';
    }

    set state(state){
        if(state === this.visibleClass){
            this.element.classList.add(this.visibleClass);
            this.element.classList.remove(this.hiddenClass);
            this.emit(Displayable.SHOW);
        } else {
            this.element.classList.remove(this.visibleClass);
            this.element.classList.add(this.hiddenClass);
            if(!this.locked){
                this.emit(Displayable.HIDE);
            }
            
        }
    }

    get seen(){
        return this.trigger.classList.contains(this.seenClass);
    }

    set seen(boolean){
        if(typeof boolean === 'boolean'){
            if(boolean === true){
                this.trigger.classList.add(this.seenClass);
                this.emit(Displayable.SEEN);
            } else {
                this.trigger.classList.remove(this.seenClass);
            }
        }
    }

    show(){
        if(this.seenWhen === this.visibleClass && !this.seen){
            this.seen = true;
        }
        this.trigger.classList.add(this.currentClass);
        this.state = this.visibleClass;
    }

    hide(onReset){
        if(this.seenWhen === this.hiddenClass && !this.seen && onReset!=true){
            this.seen = true;
        }
        this.trigger.classList.remove(this.currentClass);
        this.state = this.hiddenClass;
    }

    forceHide(){
        if(this.seenWhen === this.hiddenClass && !this.seen && this.state !== this.hiddenClass){
            this.seen = true;
        }
        this.trigger.classList.remove(this.currentClass);
        this.locked = true;
        this.state = this.hiddenClass;
        this.locked = false;
    }

    toggle(){
        this.state === this.visibleClass ? this.hide() : this.show();
    }

    addEvents(){
        if(this.buttonClose && this.buttonClose.length > 0){
            for(const button of this.buttonClose){
                button.addEventListener(EVENTS.CLICK_TOUCH, this.handleHide);
            }
        }
        else if(this.buttonClose){
            this.buttonClose.addEventListener(EVENTS.CLICK_TOUCH, this.handleHide);
        }
        this.trigger.addEventListener(EVENTS.CLICK_TOUCH, this.handleToggle);
    }

    reset(){
        this.seen = false;
        this.hide(true);
    }

    dispose(){
        this.seen = false;
        this.off();
        if(this.buttonClose && this.buttonClose.length > 0){
            for(const button of this.buttonClose){
                button.removeEventListener(EVENTS.CLICK_TOUCH, this.handleHide);
            }
        }
        else if(this.buttonClose){
            this.buttonClose.removeEventListener(EVENTS.CLICK_TOUCH, this.handleHide);
        }
        this.trigger.classList.remove(this.currentClass);
        this.trigger.removeEventListener(EVENTS.CLICK_TOUCH, this.handleToggle);
    }
}