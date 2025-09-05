import EmitterMixin from "../../common/content/js/emitter/emitter-mixin.js";
import { EVENTS } from "../../common/content/js/utils/utils.js";
import { translationRender } from "../../common/content/js/lib/dom.js";

const ELEMENTSSELECTORS = {
    main:"#footer",
    burger:"#footer-burger",
    next: "#footer-next",
    previous: "#footer-previous",
    title: "#footer-title .module-title",
    content: "#footer-title .module-content",
    progress: "#footer-progress"
}

export default class Footer extends EmitterMixin {
    static get PREVIOUS_CLICKED() {
        return 'Footer.previousClicked';
    }
    static get NEXT_CLICKED() {
        return 'Footer.nextClicked';
    }
    static get MENU_OPEN() {
            return 'Footer.menuOpen';
    }
    static get FOOTER_OPEN() {
        return 'Footer.FooterOpen';
    }
    static get FOOTER_UPDATE() {
        return 'Footer.update';
    } 
    static get FOOTER_SHOW() {
        return 'Footer.show';
    } 
    static get FOOTER_HIDE() {
        return 'Footer.hide';
    } 
    static get FOOTER_OFF() {
        return 'Footer.off';
    } 
    static get FOOTER_ON() {
        return 'Footer.on';
    } 
    static get FOOTER_OPEN_PART() {
            return 'Footer.openPart';
    }
    static get FOOTER_LANGUAGE() {
            return 'Footer.language';
    }
    constructor(){
        super();
        this.elements = {};
        this.boundHandlePrev = this.handlePrev.bind(this);
        this.boundHandleNext = this.handleNext.bind(this);
        this.boundHandleMenu = this.handleMenu.bind(this);
        this.initElements();
    	this.addEvents();
    }
    get state(){
        return this.element.getAttribute("data-state");
    }
    handlePrev(e){
        const value = parseFloat(e.currentTarget.getAttribute("data-value")) || null;
        this.emit(Footer.PREVIOUS_CLICKED,value);
        e.currentTarget.removeAttribute("data-value");
    }
    handleNext(e){
        const value = parseFloat(e.currentTarget.getAttribute("data-value")) || null;
        this.emit(Footer.NEXT_CLICKED,value);
        e.currentTarget.removeAttribute("data-value");
    }
    handleMenu(){
        this.emit(Footer.MENU_TOGGLE);
    }
    update(datas = {}){
        const {texts, buttons, state, menu, ID, fileID, progress, previousValue, nextValue} = datas;
        if(texts){
            this.elements.title.setAttribute("json","m"+(ID)+"-title");
            this.elements.content.setAttribute("json","m"+(ID)+"-content-"+(fileID)+"-title");
            translationRender(texts,this.elements.main);
        }
        if(buttons){
            const {next,previous} = buttons;
            if(next){
                this.elements.next.classList.remove("active");
                this.elements.next.classList.remove("disabled");
                const {active,enabled} = next;
                if(active === true){
                    this.elements.next.classList.add("active");
                }
                if(enabled === false){
                    this.elements.next.classList.add("disabled");
                }
            }
            if(previous) {
                this.elements.previous.classList.remove("active");
                this.elements.previous.classList.remove("disabled");
                const {active,enabled} = previous;
                if(active === true){
                    this.elements.previous.classList.add("active");
                }
                if(enabled === false){
                    this.elements.previous.classList.add("disabled");
                }
            }
        }
        if(typeof menu === "boolean"){
            this.elements.main.setAttribute("data-menu",menu);
        }
        if(typeof state === "string"){
            this.elements.burger.setAttribute("data-state",state);
        }
        if(progress){
            this.elements.progress.innerHTML = progress+"%";
        }

        if (typeof previousValue === "number") {
            this.elements.previous.setAttribute("data-value", previousValue);
        }

        if (previousValue === false) {
            this.elements.previous.removeAttribute("data-value");
        }

        if (typeof nextValue === "number") {
            this.elements.next.setAttribute("data-value", nextValue);
        }

        if (nextValue === false) {
            this.elements.next.removeAttribute("data-value");
        }
    }  
    initElements(){
        for(let key in ELEMENTSSELECTORS){
            this.elements[key] = document.querySelector(ELEMENTSSELECTORS[key]);
        }
    }
    addEvents(){
        if(this.elements.next){
            this.elements.next.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleNext);
        }
        if(this.elements.previous){
            this.elements.previous.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandlePrev);
        }
        if(this.elements.burger){
            this.elements.burger.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleMenu);
            
        }
    }
}