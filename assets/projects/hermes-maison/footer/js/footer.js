import EmitterMixin from "../../common/content/js/lib/emitter-mixin.js";
import { EVENTS } from "../../common/content/js/lib/utils.js";
import { translationRender } from "../../common/content/js/lib/dom.js";

export default class Footer extends EmitterMixin {
    static get SHOW_MENU() {
        return 'Footer.showMenu';
    }
    static get HIDE_MENU() {
        return 'Footer.hideMenu';
    }
    static get HEADER_UPDATE() {
        return 'Footer.update';
    } 
    static get HEADER_SHOW() {
        return 'Footer.show';
    } 
    static HEADER_HIDE() {
        return 'Footer.hide';
    } 
    static SWITCH_LANGUAGE () {
        return 'switchLanguage';
    }
    constructor(){
        super()
        this.element = document.querySelector(".footer");
        this.buttonMenu = this.element.querySelector("#button-menu");
        this.buttonCapture = this.element.querySelector("#button-capture");
        this.buttonValidate = this.element.querySelector("#button-validate");
        this.titleEl = this.element.querySelector("#footer-title");
        this.subtitleEl = this.element.querySelector("#footer-subtitle");
        this.handleToggleMenu = this.toggleMenu.bind(this)
        this.handleTransitionEnd = this.transitionEnd.bind(this)

        this.addEvents();    
    }
    set mode(type){
        // switch(type){
        //     case "capture":
        //         this.titleEl.classList.add("hidden")
        //         this.buttonCapture.classList.remove("hidden")
        //         this.buttonValidate.classList.remove("hidden")
        //     break;
        //     case "menu-open":
        //         this.titleEl.classList.add("hidden")
        //         this.buttonCapture.classList.add("hidden")
        //         this.buttonValidate.classList.add("hidden")
        //     break;
        //     default:
        //         this.titleEl.classList.add("hidden")
        //         this.buttonCapture.classList.add("hidden")
        //         this.buttonValidate.classList.add("hidden")
        //     break;
        // }
    }
    get mode(){
        return "normal";
        //return !this.buttonCapture.classList.contains("hidden") ? "capture" : "normal"
    }
    addEvents(){
        this.buttonMenu.addEventListener(EVENTS.CLICK_TOUCH,this.handleToggleMenu)
        this.element.addEventListener("transitionend",this.handleTransitionEnd)
    }
    toggleMenu(){
        this.buttonMenu.style["pointer-events"] = "none"
        if(this.element.getAttribute("data-menu") === "true"){
            //this.mode = this.moveSaved;
            this.emit(Footer.HIDE_MENU);
        } else {
            //this.moveSaved = this.mode
            //this.mode = "menu-open";
            this.emit(Footer.SHOW_MENU);
        }
    }
    transitionEnd(e){
        this.buttonMenu.style["pointer-events"] = ""
    }
    update(datas = {}){
        const {texts, menu, mode, subtitle} = datas;
        if(texts){
            translationRender(texts,this.element)
        }
        if(menu){
            if(menu === "open"){
                this.element.setAttribute("data-menu","true")
            } else {
                this.element.setAttribute("data-menu","false")
            }
        }
        if(mode){
            this.mode = mode;
        }
        if(typeof subtitle === "string"){
            this.subtitleEl.innerHTML = subtitle;
            this.subtitleEl.style.opacity = 1;
        } else {
            this.subtitleEl.style.opacity = 0;
        }
    }
    hide(){
        this.element.classList.add("hidden");
    }
    show(){
        this.element.classList.remove("hidden");
    }
    
}