import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS } from "../lib/utils.js";

export default class Component extends EmitterMixin {
    static get SHOW(){
        return 'Component.show';
    }
    static get HIDE(){
        return 'Component.hide';
    }
    static get DISPLAY(){
        return 'Component.display';
    }
    constructor(props = {}){
        super()
        this.options = {
            element:null,
            showClass:"show",
            hideClass:"unavailable",
            closeClass:"component-close",
            displayClass: "displayed",
            ...props
        }
        const {element, closeClass} = this.options;
        this.closeEl = element.querySelector("."+closeClass);

        this.handleHide = this.hide.bind(this);
        this.handleShow = this.show.bind(this);


        this.addEvents()
    }

    addEvents(){
        if(this.closeEl){
            this.closeEl.addEventListener(EVENTS.CLICK_TOUCH, this.handleHide);
        }
    }

    show(){
        const {element, showClass, hideClass, displayClass} = this.options;
        element.classList.remove(hideClass);
        element.classList.remove(displayClass);
        element.classList.add(showClass);
        this.emit(Component.SHOW);
    }

    display(){
        const {element, showClass, hideClass, displayClass} = this.options;
        element.classList.remove(hideClass);
        element.classList.remove(showClass);
        element.classList.add(displayClass);
        this.emit(Component.DISPLAY);
    }

    hide(){
        const {element, showClass, hideClass, displayClass} = this.options;
        // if(element.id !== "vm-view" || element.id === 'vm-view' && once === false){
        //     if(element.id === "vm-view" && once === false){
        //         once = true;
        //     }
        //     element.classList.remove(showClass);
        //     element.classList.add(hideClass);    
        // }

        element.classList.remove(showClass);
        element.classList.remove(displayClass);
        element.classList.add(hideClass);
           
        this.emit(Component.HIDE);
  
    }
}

let once = false;