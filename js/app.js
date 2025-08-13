import Message from "./components/message.js";
import MESSAGES from "./components/message-constants.js";
import JsonsManager from "./components/jsons-manager.js";
import SoundManager from "./components/sound-manager.js";
import { translationRender } from "./lib/dom.js";
import EmitterMixin from "./emitter/emitter-mixin.js";

const JSONSCONFIG = ["./assets/jsons/content.json",];

const debugEvents = {};
let instance = null;

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

    constructor(config) {
        if (instance) {
            return instance;
        } else {
            super();
            instance = this;
        }

        this.config = {
            language: "fr",
            jsons: [...JSONSCONFIG],
            soundsPath: "",
            sounds: [],
            ...config,
        };

        this.messagesConstants = MESSAGES;
        this.preload = false;
        this.loaded = false;
        this.ready = false;
        this.started = false;
        this.boundHandleLoad = this.handleLoad.bind(this);
    }

    addListeners() {
    }


    openProject() {
        
    }

    initFrames() {
        
    }

    setLanguage(lang) {
        this.language = lang;
        setTranslations();
        this.emit(App.LANGUAGE_CHANGED);
    }

    setTranslations() {
        if (this.config.jsons.length > 0) {
            
            translationRender(this.jsonsManager.jsons, this.mainDom);
        }
    }

    sendTo(key, datas) {
        const iframe = this.iframes[key];
        if (iframe) {
            this.messages.sendTo(iframe.contentWindow, datas);
        }
    }

    listenMessages() {
        this.messages.listen(async (datas, event) => {

            switch (datas.type) {
                case MESSAGES.CONTENT_CHANGE:
                    const { id } = datas;
                    this.sendTo("menu", {
                        type: MESSAGES.MENU_HIDE,
                    });
                    this.scormInterface.openFileById(id);
                    break;
                case MESSAGES.CONTENT_SWITCH_LANGUAGE:
                    if (datas.language != language) {
                        changeLanguage(datas.language);
                    }
                    break;
            }
        });
    }

    async handleLoad() {

        //this.initRoot();
        this.mainDom = document.querySelector("#main");
        this.jsonsManager = new JsonsManager();
        const ready = async () => {
            await this.promify();

            this.launch();
        };

        ready();

        this.loaded = true;

        this.emit(App.LOADED);
    }

    promify() {
        //Retourne les promises attendues selon la config spécifiée
        //Sons / jsons / vidéos ?
        const { jsons, language } = this.config;
        const promises = [];

        if (jsons) {
            const paths = jsons.map((json) => {
                return json.replace("${language}", language);
            });
            promises.push(this.jsonsManager.load(paths));
        }

        return Promise.all(promises);
    }

    initRoot() {
        const absoluteRootPath = this.scormInterface.basePath + this.scormInterface.root.relative;
        const directory = this.scormInterface.basePath;
        const relRoot = absoluteRootPath.replace(directory, "");
        const splitDirectory = directory.replace(/\/$/, "").split("/");
        const splitRelRoot = relRoot.replace(/\/$/, "").split("/");
        const rootDir = `${splitDirectory.slice(0, splitDirectory.length - splitRelRoot.length).join("/")}/`;
        const contentRoot = window.location.href.replace(rootDir, "").split("/");

        contentRoot.pop();

        this.relativeContentRoot = `${contentRoot.map(() => "..").join("/")}/`;
        this.absoluteContentRoot = rootDir;
    }

    init(preloadData) {
        if (document.readyState === "complete") {
            this.handleLoad();
        } else {
            window.addEventListener("load", this.boundHandleLoad);
        }
    }

    launch() {
        this.setTranslations();
        this.ready = true;
        this.emit(App.READY);
    }
}
