import InterfaceFinder from "./lib/interface-finder.js";
import DebugMode from "./components/debug.js";
import Toast from "./components/toast.js";
import Message from "./components/message.js";
import { EVENTS } from "./lib/utils.js";
import MESSAGES from "./components/message-constants.js";
import ScormManager from "./components/scorm-manager.js";
import NavigationManager from "./components/navigation-manager.js";
import SoundsManager from "./components/sound-manager.js";
import JsonsManager from "./components/jsons-manager.js";
import { translationRender } from "./lib/dom.js";
import Scroll from "./components/scroll.js";
import EmitterMixin from "./lib/emitter-mixin.js";

let instance = null;

const navigationCbs = {
    cbChange:()=>{
        instance.save();
    },
}

const resizeW = 480;
//GO LEARN HEIGHT
const resizeH = 791;
const ratio = resizeW/resizeH;

function onResize(){
    const element = document.querySelector(".container-queries");
    if(element){
        if(element.clientHeight != resizeH){
            const widthNew = element.clientHeight * ratio;
            element.style.width = widthNew + "px";
        }
    }
}


export default class App extends EmitterMixin {
    static get LOADED() {
        return "App.loaded";
    }

    static get READY() {
        return "App.ready";
    }

    static get STARTED() {
        return "App.start";
    }

    static get LANGUAGE_CHANGED() {
        return "App.languageChanged";
    }

    constructor(config){
        if (instance) {
            return instance;
        } else {
            super();
            instance = this;
        }

        this.config = {
            soundsPath: "",
            language:"fr",
            jsons:[],
            sounds: [],
            isFileCompleted:() => {
                if (((parseInt(this.scorm.parsedDatas[this.currentFileId - 1][0]) / parseInt(this.scorm.parsedDatas[this.currentFileId - 1][1])) >= 1)) {
                    return true;
                }
                return false;
            },
            allFilesCompleted: () => {
                return (this.ofp.player.getAnsweredFiles().length == this.ofp.player.files.length);
            },
            ...config,
        };

        this.config.navigation = {
            ...config.navigation,
            ...navigationCbs  
        }

        this.ofp = InterfaceFinder.searchOfp();
        this.ofpUpper = InterfaceFinder.searchOfp("upper");
        this.ofpWin = InterfaceFinder.searchOfpWindow();
        this.scorm = new ScormManager(this.ofp, {
            ...this.ofp.getFromDataProvider('scorm'),
            isFileCompleted: this.config.isFileCompleted,
            allFilesCompleted: this.config.allFilesCompleted
        });
        this.navigation = new NavigationManager(this.config.navigation);
        

        this.loaded = false;
        this.ready = false;
        this.started = false;
        this.message = null;

        this.boundHandleLoad = this.handleLoad.bind(this);

        this.setupDebug();
    }

    handleLoad() {
        if (!this.ofp.ready) {
            this.ofpWin.addEventListener("ofp-ready", this.boundHandleLoad);
            return;
        }

        this.currentFileId = this.ofp.player.actualFile.id;
        this.soundTriggerDom = this.ofpWin.document.querySelector("#sound-trigger");
        this.mainDom = document.querySelector("#main");
        this.message = new Message();
        this.jsonsManager = new JsonsManager();
        this.soundManager = new SoundsManager(document.body, {
            rootPath: this.ofpWin.rootPath + "../",
            directoryName: 'sounds/'+this.config.language+'/',
        });


        this.listenMessages();
        this.promify();

        this.loaded = true;

        this.emit(App.LOADED);
    }

    setupDebug() {
        const mode = true
        let debugMode;

        if (this.ofpWin) {
            if (this.ofpWin.debugMode) {
                debugMode = new DebugMode(this.ofpWin.debugMode.active, this.ofpWin.debugMode.activeConsole);
            } else {
                debugMode = new DebugMode(mode);
            }
            this.ofpWin.debugMode = debugMode;
        } else {
            debugMode = new DebugMode(mode);
        }

        this.debugMode = debugMode;
    }

    setLanguage(lang) {
        // scorm.parsedDatas[6] = l;
        this.language = lang;
        ofp.lang = lang;
        setTranslations();
        this.emit(App.LANGUAGE_CHANGED);
        //soundManager.stopAll();
        //save()
    }

    setTranslations() {
        if(this.config.jsons.length > 0){
            this.mainDom.setAttribute("language",this.config.language);
            this.sendToFooter({
                type: MESSAGES.FOOTER_UPDATE,
                texts: this.jsonsManager.get(/footer-/g)
            });
            this.sendToMenu({
                type: MESSAGES.MENU_UPDATE,
                texts: this.jsonsManager.get(/menu-|logo-/g)
            });
            translationRender(this.jsonsManager.jsons,this.mainDom);    
        }  
    }

    setScorm() {
        //if(debug===true){
            this.ofp.player.files.forEach((file,index) => {
                const datas = this.scorm.parsedDatas[index];
                if(datas[2] > 1){
                    file.status = "i";
                }
                if(datas[0] === datas[1]){
                    file.status = "c";
                }
                
            });
            //return;
        //}
        // Si écran actuel est le même que le dernier
        // if ((scorm.parsedDatas[currentFileId - 1][2] == scorm.parsedDatas[currentFileId - 1][1])) {
        //     scorm.parsedDatas[currentFileId - 1][2] = 1;
        //     save();
        // }
    }

    setNavigation(){
        const parsedDatas = this.scorm.parsedDatas[this.currentFileId-1];
        this.navigation.total = parseFloat(parsedDatas[1]);
        this.navigation.current = parseFloat(parsedDatas[2]);
    }

    save(props = {}){
        const parsedDatas = this.scorm.parsedDatas[this.currentFileId-1];
        parsedDatas[2] = this.navigation.current;
        parsedDatas[0] = this.navigation.maxReached;
        // scorm.parsedDatas[currentFileId - 1][0] = Math.max(navigation.current, scorm.parsedDatas[currentFileId - 1][0]);

        // //Calcul de la progression    
        // var percent = 0, mainPercent = 0;
        // for (var a = 1; a <= scorm.parsedDatas.length; a++) {
        //     var datas = scorm.parsedDatas[a - 1];
        //     percent += Math.round((parseInt(datas[0]) / parseInt(datas[1])) * 100);
        // }
        // mainPercent = Math.round(percent / scorm.parsedDatas.length) / 100;
        // scorm.progress = mainPercent;
        this.scorm.save(props);
    }

    sendToFooter(datas) {
        const footer = this.ofpWin.document.querySelector('#footer');
        if (footer) {
            this.message.sendTo(footer.contentWindow, datas);
        }
    }
    
    sendToMenu(datas) {
        const menu = this.ofpWin.document.querySelector('#menuFrame');
        if (menu) {
            if(datas.type === MESSAGES.MENU_SHOW || datas.type === MESSAGES.MENU_TOGGLE){
                const obj = {
                    files: this.ofp.player.files,
                    ...datas
                }
                this.message.sendTo(menu.contentWindow, obj);    
            } else {
                this.message.sendTo(menu.contentWindow, datas);   
            }
        }
    }

    listenMessages() {
        this.message.listen((datas) => {
            const type = datas.type;
            switch (type) {
                case MESSAGES.CONTENT_NEXT:
                    if (timeline.status == "normal") {
                        var value = typeof datas.value == "number" ? datas.value : 1;
                        navigation.load(value, true, true);
                    }
                    break;
                case MESSAGES.CONTENT_PREVIOUS:
                    if (timeline.status == "normal") {
                        var value = typeof datas.value == "number" ? datas.value : -1;
                        navigation.load(value, true);
                    }
                    break;
                case MESSAGES.CONTENT_UPDATE:
                    navigation.update();
                    break;
                case MESSAGES.CONTENT_CHANGE:
                    this.ofp.openFileById(datas.id);
                    break;
                case MESSAGES.CONTENT_SWITCH_LANGUAGE:
                    if(datas.language!=language){
                        soundManager.stopAll();
                        changeLanguage(datas.language);    
                    }
                    break;
                case MESSAGES.CONTENT_VOLUME:
                    soundManager.setAllVolume(datas.value);
                    break;
                case MESSAGES.MENU_SHOW:
                    this.sendToMenu({
                        type: MESSAGES.MENU_SHOW
                    });
                    break;
                case MESSAGES.MENU_HIDE:
                    this.sendToMenu({
                        type: MESSAGES.MENU_HIDE
                    });
                    break;
            }
        });
    }

    promify() {
        //Retourne les promises attendues selon la config spécifiée
        //Sons / jsons / vidéos ?
        const {jsons, language, sounds} = this.config
        const promises = []

        if(sounds){
            promises.push(this.soundManager.addSounds(sounds))
        }

        if(jsons){
            const paths = jsons.map((json) => {
                return json.replace("${language}",language)
            })
            promises.push(this.jsonsManager.load(paths))
        }
        Promise.all(promises)
        .then((reply) => {
            this.launch();
        })
        .catch((err) => {
            console.log(err);
        })
    }


    init(){
        if (document.readyState === "complete") {
            this.handleLoad();
        } else {
            window.addEventListener(EVENTS.LOAD, this.boundHandleLoad);
        }
        // if(EVENTS.CLICK_TOUCH === "click"){
        //     window.addEventListener(EVENTS.RESIZE, onResize);
        //     onResize();    
        // }  
    }

    launch() {
        //SPEC
        if(this.ofp.player.actualFile.title !== "VM"){
            this.swap = new Scroll({
                //helperParent:this.mainDom.querySelector(".container-queries")
            });
            this.swap.on(this.swap.events.SCROLL_UP,()=>{
                if(this.navigation.current === this.navigation.total){
                    this.sendToMenu({
                        type: MESSAGES.MENU_TOGGLE,
                        condition:"closed",
                        byFooter:true
                    });
                    this.swap.disabled = "up";
                } else {
                    this.navigation.next(true);
                }
            });
            this.swap.on(this.swap.events.SCROLL_DOWN,()=>{
                this.navigation.prev(true);
            });
        }   
        this.setTranslations();
        this.setScorm();
        this.setNavigation();
        this.sendToMenu({
            type: MESSAGES.MENU_UPDATE,
            files: this.ofp.player.files
        });
        this.sendToMenu({
            type: MESSAGES.MENU_TOGGLE,
            condition: "opened",
            byFooter: true
        });
        //Si aucune intéraction utilisateur au démarrage, on force un click
        if(this.soundManager.list.length>0){
            this.soundManager.canPlaySounds().then().catch(() => {
                this.ofp.loader.hide();
                this.soundTriggerDom.style.display = "";
                this.soundTriggerDom.querySelector("p").innerHTML = this.jsonsManager.get("start");
                this.soundTriggerDom.querySelector("#sound-trigger-button").addEventListener(EVENTS.CLICK_TOUCH,() => {
                    this.ofp.loader.hide();
                    this.soundTriggerDom.style.display = "none";
                });
            })
        } else {
            this.ofp.loader.hide();
            this.soundTriggerDom.style.display = "none"; 
        }
        this.debugMode.init();
        this.ready = true;
        this.emit(App.READY);
    }
}