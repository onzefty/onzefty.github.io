import EmitterMixin from "../../common/content/js/lib/emitter-mixin.js";
import { EVENTS } from "../../common/content/js/lib/utils.js";
import { translationRender } from "../../common/content/js/lib/dom.js";

export default class Menu extends EmitterMixin {
    static get MENU_OPEN() {
        return 'Menu.menuOpen';
    }
    static get MENU_UPDATE() {
        return 'Menu.update';
    } 
    static get MENU_SHOW() {
        return 'Menu.show';
    } 
    static get MENU_HIDE() {
        return 'Menu.hide';
    } 
    static get MENU_OFF() {
        return 'Menu.off';
    } 
    static get MENU_ON() {
        return 'Menu.on';
    } 
    static get OPEN_PART() {
            return 'Menu.openPart';
    }
    static get SWITCH_LANGUAGE() {
            return 'Menu.switchLanguage';
    }
    constructor(){
        super();
        this.element = document.querySelector("#menu");
        this.buttons = this.element.querySelectorAll(".menu-bloc-button");
        this.animatedElements = this.element.querySelectorAll("animated-element");
        this.handleClick = this.onClick.bind(this);
        this.hide();
    	this.addEvents();   
    }
    get state(){
        return this.element.getAttribute("data-state");
    }
    addEvents(){
        for(var b=1; b<=this.buttons.length; b++){
            const button = this.buttons[b-1];
            button.setAttribute("file",(b+1));
            button.addEventListener(EVENTS.CLICK_TOUCH, this.handleClick);
        }
    }
    onClick(e){
        const id = e.currentTarget.getAttribute("file");
        this.emit(Menu.OPEN_PART,id);
    }
    update(datas = {}){
        const {texts, files, languageSelection, language} = datas;
        if(texts){
            translationRender(texts,this.element);
        }
        if(files){
            for(var b=1; b<=this.buttons.length; b++){
                const button = this.buttons[b-1];
                const circle = button.querySelector(".menu-bloc-circle");
                const fileId = parseInt(button.getAttribute("file"));
                const fileIdPrev = parseInt(button.getAttribute("file"))-1;
                const fileIdNext = parseInt(button.getAttribute("file"))+1;
                const file = files.filter((fl)=> fl.id === fileId)[0];
                const filePrev = files.filter((fl)=> fl.id === fileIdPrev)[0];
                const fileNext = files.filter((fl)=> fl.id === fileIdNext)[0];
                circle.classList.remove("pulseOrange");
                if(filePrev){
                    if(filePrev.status === "c"){
                        button.classList.remove("locked");
                        if(file && file.status === "na"){
                            circle.classList.add("pulseOrange");
                        }
                    }
                }
                if(file){
                    if(file.status === "c"){
                        button.classList.add("seen");
                        // if(fileNext && fileNext.status === "na"){
                        //     button.classList.add("just-completed");
                        // } else {
                        //     button.classList.add("seen");
                        // }
                    }
                }
            }
        }
        // if(languageSelection === false){
        //     this.languagesEl.style.display = "none";
        // }
        // if(language){
        //     this.language = language;
        //     const selectedEl = this.element.querySelector(".selected");
        //     if(selectedEl){
        //         selectedEl.classList.remove("selected");
        //     }
        //     for(let b=1; b<=this.buttonLanguageEls.length; b++){
        //         const buttonLanguageEl = this.buttonLanguageEls[b-1];
        //         const lang = buttonLanguageEl.getAttribute("language");
        //         if(language===lang){
        //             buttonLanguageEl.classList.add("selected");
        //         }
        //     }
        // }
    }
    hide(){
        this.element.setAttribute("data-state","closed");
    }
    show(obj = {}){
        this.element.setAttribute("data-state","opened");
        this.update(obj);
    }
    
}