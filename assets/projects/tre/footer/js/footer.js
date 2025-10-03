import EmitterMixin from "../../common/content/js/emitter/emitter-mixin.js";
import { EVENTS } from "../../common/content/js/utils/utils.js";
import { translationRender } from "../../common/content/js/lib/dom.js";
import Movable from "../../common/content/js/components/movable.js";

const ELEMENTSSELECTORS = {
    main:"#footer",
    burger:"#footer-burger",
    next: "#footer-next",
    quit: "#footer-quit",
    previous: "#footer-previous",
    navigationWrapper: "#footer-navigation",
    title: "#footer-title .module-title",
    content: "#footer-title .module-content",
    progressWrapper: "#footer-progress",
    progress: "#footer-progress-txt",
    level: "#footer-level",
    soundWrapper: "#footer-sound-wrapper",
    sound: "#footer-sound",
    volume: "#footer-volume-wrapper",
    volumeWrapper: ".volume.wrapper",
    volumeProgress: ".volume-bar-progress",
    volumeBarThumb: ".volume-bar-thumb",
}

export default class Footer extends EmitterMixin {
    static get PREVIOUS_CLICKED() {
        return 'Footer.previousClicked';
    }
    static get NEXT_CLICKED() {
        return 'Footer.nextClicked';
    }
    static get QUIT_CLICKED() {
        return 'Footer.quitClicked';
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
    static get FOOTER_SOUND_TOGGLE() {
            return 'Footer.soundToggle';
    }
    static get FOOTER_SOUND_VOLUME() {
            return 'Footer.soundVolume';
    }
    static get FOOTER_SOUND_ON() {
        return 'Footer.soundOn';
    }
    static get FOOTER_SOUND_OFF() {
        return 'Footer.soundOff';
    }
    constructor(){
        super();
        this.elements = {};
        this.boundHandlePrev = this.handlePrev.bind(this);
        this.boundHandleNext = this.handleNext.bind(this);
        this.boundHandleQuit = this.handleQuit.bind(this);
        this.boundHandleMenu = this.handleMenu.bind(this);
        this.boundHandleSoundToggle = this.handleSoundToggle.bind(this);
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
    handleQuit(){
        this.emit(Footer.QUIT_CLICKED);
    }
    handleSoundToggle(e){
        this.elements.volumeWrapper.style.transition = "width 0.5s, padding 0.5s";
        if(this.elements.volumeWrapper.classList.contains("hide")){
            this.elements.volumeWrapper.classList.remove("hide");
            //this.emit(Footer.FOOTER_SOUND_ON);
        } else {
            this.elements.volumeWrapper.classList.add("hide");
            //this.emit(Footer.FOOTER_SOUND_OFF);
        }
        return new Promise((resolve) => {
            this.elements.volumeWrapper.ontransitionend = () => {
                this.elements.volumeWrapper.style.transition = "";
                if(this.elements.volumeBarThumb && !this.movable){
                    this.movable = new Movable({
                        element: this.elements.volumeBarThumb,
                        boundaries: {
                            y: 0,
                            x: this.elements.volumeBarThumb.parentNode
                        }
                    });
                    this.movable.on(Movable.MOVE, () => {
                        this.handleVolume(this.movable.percents.x);
                        this.emit(Footer.FOOTER_SOUND_VOLUME, this.movable.percents.x/100);
                    });
                }
            };
        })
    }
    handleVolume(value){
        this.elements.volumeProgress.style.width = `${value}%`;
        if(value > 0){
            this.elements.sound.classList.remove("muted");
        } else {
            this.elements.sound.classList.add("muted");
        }
    }
    update(datas = {}){
        const {texts, buttons, state, menu, noSound, progress, previousValue, nextValue, navigation} = datas;
        if(texts){
            //this.elements.title.setAttribute("json","m"+(ID)+"-title");
            //this.elements.content.setAttribute("json","m"+(ID)+"-content-"+(fileID)+"-title");
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
        if(typeof noSound === "boolean" && noSound === true){
            this.elements.soundWrapper.classList.add("hidden");
        }
        if(typeof menu === "boolean"){
            this.elements.main.setAttribute("data-menu",menu);
        }
        if(typeof state === "string"){
            this.elements.burger.setAttribute("data-state",state);
        }
        if(progress){
            this.elements.progress.innerHTML = progress+"%";
            this.elements.main.style.setProperty("--data-progress", progress+"%");
        } 
        else if(progress === false){
            this.elements.progressWrapper.classList.add("hidden");
        }

        if(navigation === false){
            this.elements.navigationWrapper.classList.add("hidden");
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
        if(this.elements.sound){
            this.elements.sound.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleSoundToggle);
        }
        if(this.elements.quit){
            this.elements.quit.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleQuit);
        }
    }
}