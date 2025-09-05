import EmitterMixin from "../../common/content/js/emitter/emitter-mixin.js";
import { EVENTS } from "../../common/content/js/utils/utils.js";
import { translationRender } from "../../common/content/js/lib/dom.js";

const ELEMENTSSELECTORS = {
    main:"#menu",
    left: "#menu-left",
    right: "#menu-right",
    title: "#menu-title",
}

function createContent(value,ID){
    const content = document.createElement("div");
    content.id = "menu-content-"+(value);
    content.classList.add("menu-content");
    content.setAttribute("data-value",(value+1));
    const contentTop = document.createElement("div");
    contentTop.className = "menu-content-top relative";
    contentTop.setAttribute("number",(value));
    contentTop.style["background-image"] = `url(./img/m${ID}-content-background-${value}.webp)`;
    const contentText = document.createElement("p");
    contentText.className = "menu-content-bottom";
    content.append(contentTop,contentText);
    return content;
}

export default class Menu extends EmitterMixin {
    static get MENU_OPEN() {
        return 'Menu.menuOpen';
    }
    static get MENU_UPDATE() {
        return 'Menu.update';
    }
    static get MENU_CONTENT(){
        return 'Menu.content';
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
        this.elements = {};
        this.boundHandleClick = this.handleClick.bind(this);
    	this.initElements();
        this.hide();
    }
    set enabled(boolean){
        if(typeof boolean === "boolean"){
            this.elements.main.setAttribute("data-enabled",boolean);
        }
    }
    get enabled(){
        return this.elements.main.getAttribute("data-enabled");
    }
    get state(){
        return this.elements.main.getAttribute("data-state");
    }
    addEvents(){
        for(let b=1; b<=this.elements.contents.length; b++){
            const content = this.elements.contents[b-1];
            content.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleClick);
        }
    }
    handleClick(e){
        const id = e.currentTarget.getAttribute("data-value");
        this.emit(Menu.OPEN_PART,id);
    }
    update(datas = {}){
        const {texts, ID, array, fileID} = datas;
        if(texts){
            for(let b=1; b<=this.elements.contents.length; b++){
                const content = this.elements.contents[b-1];
                const contentBottom = content.querySelector(".menu-content-bottom");
                contentBottom.setAttribute("json","m"+(ID)+"-content-"+b+"-title");
            }
            translationRender(texts,this.elements.main);
        }
        if(Array.isArray(array)){
            for(let b=1; b<=this.elements.contents.length; b++){
                const content = this.elements.contents[b-1];
                const datas = array[b];
                const {status} = datas;
                content.setAttribute("data-status",status);
            }
        }
        if(typeof fileID === "number" && fileID > 0){
            this.elements.contents[fileID-1].setAttribute("data-status","current");
        }
    }
    addContent(datas = {}){
        const {array, ID} = datas;
        if(this.elements.contents){
            return this.update({array});
        }
        this.elements.contents = [];
        array.forEach((element,index)=>{
            if(index > 0){
                const content = createContent(index,ID);
                this.elements.right.append(content);
                this.elements.contents.push(content);
            }  
        });
        const count = Math.floor(array.length/2);
        //this.elements.right.style = "--col-values: repeat("+count+", 1fr)";
        this.elements.right.setAttribute("data-count",array.length-1);
        this.addEvents();
        this.update(datas);
    }
    initElements(){
        for(let key in ELEMENTSSELECTORS){
            const selector = ELEMENTSSELECTORS[key];
            this.elements[key] = selector.includes(".") ? document.querySelectorAll(selector) :  document.querySelector(selector);
        }
    }
    hide(animated){
        if(animated === false){
            this.elements.main.style["transition-duration"] = "0s";
        }
        this.elements.main.setAttribute("data-state","closed");
        return new Promise((resolve) => {
            this.elements.main.ontransitionend = () => {
                resolve();
            }
        });
    }
    show(obj = {}){
        this.elements.main.style["transition-duration"] = "";
        this.elements.main.setAttribute("data-state","opened");
        this.update(obj);
        return new Promise((resolve) => {
            this.elements.main.ontransitionend = () => {
                resolve();
            }
        });
    }
    
}