import EventPrevention from "./modules/event-prevention.js";
import AutoFocus from "./modules/auto-focus.js";
import Toast from "./toast/toast.js";
import Message from "./components/message.js";
import MESSAGES from "./components/message-constants.js";
import InterfaceMediator from "./components/interface-mediator.js";
import Navigation from "./navigation/navigation.js";
import { ScreenManager, NavigationScreen } from "./modules/screen-manager.js";
import JsonsManager from "./components/jsons-manager.js";
import { translationRender } from "./lib/dom.js";
import EmitterMixin from "./emitter/emitter-mixin.js";
import FRAMESCONSTANTS from "../js/frames/frame-constants.js";
import BotsManager from "./bots/bots-manager.js";

const JSONSCONFIG = ["./json/${language}.json", "../../common/content/jsons/common-${language}.json"];

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

    static get SCREEN_SHOWN() {
        return ScreenManager.SCREEN_SHOWN;
    }

    static get SCREEN_HIDDEN() {
        return ScreenManager.SCREEN_HIDDEN;
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
            navigation: {},
            exercises: [],
            previous: {},
            hasBot: {},
            isFileCompleted: () => false,
            allFilesCompleted: () => false,
            ...config,
        };

        this.messagesConstants = MESSAGES;

        this.eventPrevention = new EventPrevention();
        this.botsManager = null;
        this.mediator = null;
        this.autoFocus = null;
        this.preload = false;
        this.loaded = false;
        this.ready = false;
        this.started = false;
        this.previousValues = [];
        this.contentType = "unknown";
        this.fileType = "unknown";
        this.iframes = {};
        this.active = false;
        this.openingFile = false;
        this.boundHandleLoad = this.handleLoad.bind(this);
        this.storeDebugEvents();
    }

    async handleLoad() {
        if (!this.scormInterface) {
            const waitForOpenFile = async (event) => {
                const data = event.data;

                if (data.type === "openFile") {
                    this.scormInterface = event.source.scormInterface;
                    this.setupDebug();
                    this.active = true;

                    window.removeEventListener("message", waitForOpenFile);
                    this.handleLoad();
                }
            };

            window.addEventListener("message", waitForOpenFile);
            return;
        }

        this.scormInterface.loader.show();

        this.mediator = new InterfaceMediator(this.scormInterface, {
            ...this.scormInterface.datas.scorm,
            isFileCompleted: this.config.isFileCompleted,
            allFilesCompleted: this.config.allFilesCompleted,
        });
        this.autoFocus = new AutoFocus(this);

        const { currentFile } = this.scormInterface;

        this.initFrames();
        this.initRoot();

        this.contentType = this.scormInterface.datas.type;
        this.file = currentFile;
        this.fileID = currentFile.dataStoreID;
        this.fileType = this.scormInterface.fileDatasMap[this.scormInterface.currentFile.id].type;

        this.flags = this.scormInterface.datas.flags;
        this.mainDom = document.querySelector("#main");
        this.jsonsManager = new JsonsManager();

        // this.config.jsons.push("../../common/content/jsons/"+this.flags.level+"-${language}.json")

        const ready = async () => {
            await this.promify();

            this.scormInterface.context.postMessage({ type: "file-opened" });

            const launch = () => {
                this.scormInterface.loader.hide();
                this.launch();
            };

            this.botsManager = new BotsManager({
                window: this.scormInterface.context,
                document: this.scormInterface.contextDocument,
            });

            await this.botsManager.init();

            this.botsManager.bots.forEach((bot) => {
                this.autoFocus.addContextException({
                    context: this.scormInterface.context,
                    selector: `#${bot.id}`,
                });
            });

            if (this.scormInterface.ready) {
                launch();
            } else {
                const waitForReady = (event) => {
                    const data = event.data;

                    if (data.type === "interface-ready") {
                        window.removeEventListener("message", waitForReady);
                        launch();
                    }
                };

                window.addEventListener("message", waitForReady);
            }
        };

        ready();

        this.loaded = true;

        this.emit(App.LOADED);
    }

    storeDebugEvents() {
        debugEvents.press = (event) => {
            if (!this.debugMode.active || !this.active) {
                return false;
            }

            if (!this.navigation) return;

            const { key } = event.data;
            const filesInfos = this.getFileInfos();

            switch (key) {
                case this.debugMode.events.LEFT:
                    if (filesInfos.previousId !== -1 && this.navigation.current === this.navigation.min) {
                        this.openPreviousFile();
                    } else {
                        this.navigation.previous();
                    }
                    break;
                case this.debugMode.events.RIGHT:
                    if (filesInfos.nextId !== -1 && this.navigation.current === this.navigation.total) {
                        this.openNextFile();
                        this.mediator.setStatus("c");
                    } else {
                        this.navigation.next();
                    }
                    break;
                case this.debugMode.events.UP:
                    if (filesInfos.nextId !== -1 && this.navigation.current === this.navigation.total) {
                        this.openNextFile();
                        this.mediator.setStatus("c");
                    } else {
                        this.navigation.goTo(this.navigation.total);
                    }
                    break;
                case this.debugMode.events.DOWN:
                    if (filesInfos.previousId !== -1 && this.navigation.current === this.navigation.min) {
                        this.openPreviousFile();
                    } else {
                        this.navigation.goTo(this.navigation.min);
                    }
                    break;
            }
        };

        debugEvents.logEnabled = () => {
            new Toast({
                container: document.body,
                wrapperClasses: ["debug-toast"],
                message: "Debug log actif",
                status: "success",
            });
        };

        debugEvents.logDisabled = () => {
            new Toast({
                container: document.body,
                wrapperClasses: ["debug-toast"],
                message: "Debug log inactif",
                status: "error",
            });
        };

        debugEvents.enabled = () => {
            new Toast({
                container: document.body,
                wrapperClasses: ["debug-toast"],
                message: "Debug actif",
                status: "success",
            });
        };

        debugEvents.disabled = () => {
            new Toast({
                container: document.body,
                wrapperClasses: ["debug-toast"],
                message: "Debug inactif",
                status: "error",
            });
        };
    }

    setupDebug() {
        this.debugMode = this.scormInterface.debug;

        this.debugMode.on(this.debugMode.events.PRESS, debugEvents.press);
        this.debugMode.on(this.debugMode.events.LOGS_ENABLED, debugEvents.logEnabled);
        this.debugMode.on(this.debugMode.events.LOGS_DISABLED, debugEvents.logDisabled);
        this.debugMode.on(this.debugMode.events.ENABLED, debugEvents.enabled);
        this.debugMode.on(this.debugMode.events.DISABLED, debugEvents.disabled);

        this.debugMode.initEvents(window);
    }

    removeDebug() {
        this.debugMode.removeEvents(window);

        this.debugMode.off(this.debugMode.events.PRESS, debugEvents.press);
        this.debugMode.off(this.debugMode.events.LOGS_ENABLED, debugEvents.logEnabled);
        this.debugMode.off(this.debugMode.events.LOGS_DISABLED, debugEvents.logDisabled);
        this.debugMode.off(this.debugMode.events.ENABLED, debugEvents.enabled);
        this.debugMode.off(this.debugMode.events.DISABLED, debugEvents.disabled);
    }

    addListeners() {
        this.navigation.on(Navigation.LOCATION_CHANGED, () => {
            const suspendData = this.mediator.parsedDatas;
            const screenData = suspendData[this.fileID];
            const screen = this.screenManager.findByID(this.navigation.current);

            this.sendTo("menu", {
                type: MESSAGES.MENU_TOGGLE,
                condition: "opened",
            });

            this.updateFooterNavigation();

            if (screen.bot) {
                this.botsManager.setCurrentBot(screen.bot);
            }

            this.screenManager.display(this.navigation.current, !this.openingFile);

            const maxSeen = this.navigation.total;
            screenData[0] = Math.min(maxSeen, this.navigation.seen);
            screenData[2] = this.navigation.current;

            const currentScreen = this.screenManager.findByID(this.screenManager.navigationID);
            const previousID = Number(currentScreen.previousID);

            if (currentScreen && !Number.isNaN(previousID)) {
                this.sendTo("footer", {
                    type: MESSAGES.FOOTER_UPDATE,
                    previousValue: previousID,
                });
            } else {
                this.sendTo("footer", {
                    type: MESSAGES.FOOTER_UPDATE,
                    previousValue: false,
                });
            }

            let progress = 0;
            this.mediator.parsedDatas.forEach((file, index) => {
                const seen = file[0] < 0 ? 0 : file[0];
                const total = file[1];
                progress += Math.floor((parseInt(seen) / parseInt(total)) * 100);
            });

            progress = Math.floor(progress / this.mediator.parsedDatas.length);

            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                progress,
            });

            this.mediator.save();

            this.openingFile = false;
        });

        this.screenManager.on(ScreenManager.REQUEST_NEXT, () => {
            const filesInfos = this.getFileInfos();
            const lastScreen = this.navigation.total;

            if (this.navigation.current === lastScreen) {
                this.mediator.setStatus("c");
            }

            if (filesInfos.nextId !== -1 && this.navigation.current === this.navigation.total) {
                this.openNextFile();
            } else {
                this.navigation.next();
            }
        });

        this.screenManager.on(ScreenManager.REQUEST_PREVIOUS, () => {
            const filesInfos = this.getFileInfos();

            if (filesInfos.previousId !== -1 && this.navigation.current === this.navigation.min) {
                this.openPreviousFile();
            } else {
                this.navigation.previous();
            }
        });

        this.screenManager.on(ScreenManager.REQUEST_NEXT_ACTIVE, () => {
            const filesInfos = this.getFileInfos();

            if (this.navigation.current === this.navigation.total && filesInfos.nextId === -1) {
                this.mediator.setStatus("c");
                return;
            }

            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                buttons: {
                    next: {
                        active: true,
                        enabled: true,
                    },
                },
            });

            const lastScreen = this.navigation.total;

            if (this.navigation.current === lastScreen) {
                this.mediator.setStatus("c");
            }
        });

        this.screenManager.on(ScreenManager.REQUEST_NEXT_INACTIVE, () => {
            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                buttons: {
                    next: {
                        active: false,
                        enabled: false,
                    },
                },
            });
        });

        this.screenManager.on(ScreenManager.REQUEST_PREVIOUS_ACTIVE, () => {
            const filesInfos = this.getFileInfos();

            if (this.navigation.current === this.navigation.min && filesInfos.previousId === -1) {
                return;
            }

            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                buttons: {
                    previous: {
                        active: true,
                        enabled: true,
                    },
                },
            });
        });

        this.screenManager.on(ScreenManager.REQUEST_PREVIOUS_INACTIVE, () => {
            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                buttons: {
                    previous: {
                        active: false,
                        enabled: false,
                    },
                },
            });
        });

        this.screenManager.on(ScreenManager.REQUEST_FOOTER_MODE, (event) => {
            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                mode: event.data.mode,
            });
        });
    }

    getNormalizedFiles() {
        const { fileDatas } = this.scormInterface;

        return fileDatas.filter((file) => file.normalized === true);
    }

    getFileInfos() {
        const { currentFile, fileDatasMap } = this.scormInterface;
        const files = this.getNormalizedFiles();
        const fileId = files.indexOf(fileDatasMap[currentFile.id]);
        const nextFile = files[fileId + 1];
        const previousFile = files[fileId - 1];

        return {
            fileId: currentFile.id,
            first: fileId === 0,
            last: fileId === files.length - 1,
            nextId: nextFile ? nextFile.id : -1,
            previousId: previousFile ? previousFile.id : -1,
        };
    }

    openNextFile() {
        const { nextId } = this.getFileInfos();

        if (this.end && !this.endShown) {
            this.showEnd();
        } else if (nextId > -1) {
            this.scormInterface.openFileById(nextId);
        }
    }

    openPreviousFile() {
        const { previousId } = this.getFileInfos();

        if (this.intro && !this.scormInterface.context.introLaunched) {
            this.showIntro();
        } else if (previousId > -1) {
            this.scormInterface.openFileById(previousId);
        }
    }

    initFrames() {
        for (const key in FRAMESCONSTANTS) {
            const frame = this.scormInterface.contextDocument.querySelector(FRAMESCONSTANTS[key]);
            if (frame) {
                this.iframes[key] = frame;
            }
        }
    }

    setLanguage(lang) {
        // scorm.parsedDatas[6] = l;
        this.language = lang;
        //ofp.lang = lang;
        setTranslations();
        this.emit(App.LANGUAGE_CHANGED);
        //save()
    }

    setTranslations() {
        if (this.config.jsons.length > 0) {
            this.mainDom.setAttribute("language", this.config.language);
            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                texts: this.jsonsManager.jsons,
                ID: this.scormInterface.datas.ID,
                fileID: this.fileID,
            });
            this.sendTo("menu", {
                type: MESSAGES.MENU_UPDATE,
                texts: this.jsonsManager.jsons,
                ID: this.scormInterface.datas.ID,
                fileID: this.fileID
            });
            translationRender(this.jsonsManager.jsons, this.mainDom);
        }
    }

    setScorm() {
        //if(TESTINGMODE===true){
        this.scormInterface.fileDatas.forEach((file, index) => {
            const datas = this.mediator.parsedDatas[index];
            if (parseFloat(datas[2]) === -1) {
                file.status = "c";
            }
        });
        return;
        //}
        // Si écran actuel est le même que le dernier
        // if ((scorm.parsedDatas[fileID - 1][2] == scorm.parsedDatas[fileID - 1][1])) {
        //     scorm.parsedDatas[fileID - 1][2] = 1;
        //     save();
        // }
    }

    setNavigation() {
        const suspendData = this.mediator.parsedDatas;
        const screenData = suspendData[this.fileID];

        let changedData = false;
        let [seen, total, current] = screenData;

        if (this.navigation.total !== total) {
            total = this.navigation.total;

            screenData[1] = total;
            changedData = true;
        }

        if (seen < this.navigation.seen) {
            seen = this.navigation.seen;

            screenData[0] = seen;
            changedData = true;
        }

        if (changedData) {
            this.mediator.save();
        }

        if (Number(current) === this.navigation.total && this.navigation.total > 1) {
            current = this.navigation.min;
        }

        this.navigation.seen = seen;

        this.navigation.init(Number(current));
        this.started = true;

        this.emit(App.STARTED);
    }

    updateFooterNavigation() {
        const { nextId, previousId } = this.getFileInfos();
        const { currentFile: loadedFile, fileDatas } = this.scormInterface;
        const currentFile = fileDatas[loadedFile.dataStoreID];

        const footerUpdate = {
            type: MESSAGES.FOOTER_UPDATE,
            buttons: {
                next: {
                    active: false,
                    enabled: false,
                },
                previous: {},
            },
        };

        const { current, seen, total, min } = this.navigation;
        const { next: nextButton, previous: previousButton } = footerUpdate.buttons;

        if (current === min && previousId === -1) {
            previousButton.active = false;
            previousButton.enabled = false;
        } else if (previousId !== -1) {
            previousButton.active = false;
            previousButton.enabled = true;
        }

        if (current === total) {
            nextButton.active = false;
            nextButton.enabled = false;
        }

        if (seen > current || (currentFile.status === "c" && nextId !== -1)) {
            nextButton.active = false;
            nextButton.enabled = true;
        }

        this.sendTo("footer", footerUpdate);
    }

    save(props = {}) {
        const parsedDatas = this.mediator.parsedDatas[this.fileID];
        // parsedDatas[2] = this.navigation.current;
        // parsedDatas[0] = this.navigation.maxReached;
        // scorm.parsedDatas[fileID - 1][0] = Math.max(navigation.current, scorm.parsedDatas[fileID - 1][0]);

        // //Calcul de la progression
        // var percent = 0, mainPercent = 0;
        // for (var a = 1; a <= scorm.parsedDatas.length; a++) {
        //     var datas = scorm.parsedDatas[a - 1];
        //     percent += Math.round((parseInt(datas[0]) / parseInt(datas[1])) * 100);
        // }
        // mainPercent = Math.round(percent / scorm.parsedDatas.length) / 100;
        // scorm.progress = mainPercent;
        this.mediator.save(props);
    }

    sendTo(key, datas) {
        const iframe = this.iframes[key];
        if (iframe) {
            this.messages.sendTo(iframe.contentWindow, datas);
        }
    }

    storeScormDatas(datas) {
        return this.mediator.setJSONComment(datas);
    }

    getStoredScormDatas() {
        return this.mediator.getJSONComment();
    }

    screenHaveBeenSeen(screenID) {
        if (screenID < this.navigation.seen || (screenID === this.navigation.seen && this.mediator.status === "c")) {
            return true;
        } else {
            return false;
        }
    }

    listenMessages() {
        this.messages.listen(async (datas, event) => {
            let screen = this.screenManager.findByID(this.navigation.current);

            if (datas.type === "openFile") {
                this.openingFile = true;

                this.setupDebug();
                this.active = true;

                this.autoFocus.focusRender.active = true;
                this.mediator.refresh();

                if (this.navigation.current === this.navigation.total && this.navigation.total > 1) {
                    this.navigation.goTo(this.navigation.min);
                } else if (screen) {
                    const previousID = Number(screen.previousID);

                    if (screen.bot) {
                        this.botsManager.setCurrentBot(screen.bot);
                    }

                    if (!Number.isNaN(previousID)) {
                        this.sendTo("footer", {
                            type: MESSAGES.FOOTER_UPDATE,
                            previousValue: previousID,
                        });
                    } else {
                        this.sendTo("footer", {
                            type: MESSAGES.FOOTER_UPDATE,
                            previousValue: false,
                        });
                    }

                    this.updateFooterNavigation();

                    screen.show(false);

                    this.openingFile = false;
                }

                this.sendTo("footer", {
                    type: MESSAGES.FOOTER_UPDATE,
                    texts: this.jsonsManager.jsons,
                    ID: this.scormInterface.datas.ID,
                    fileID: this.fileID
                });
                this.sendTo("menu", {
                    type: MESSAGES.MENU_UPDATE,
                    texts: this.jsonsManager.jsons,
                    ID: this.scormInterface.datas.ID,
                    array: this.scormInterface.fileDatas,
                    fileID: this.fileID
                });

                this.scormInterface.loader.hide();
            }

            if (datas.type === "closeFile") {
                this.screenManager.list.forEach((screen) => {
                    screen.stopAnimations();
                });

                this.active = false;

                if (screen) {
                    screen.hide(false);
                }

                this.sendTo("footer", {
                    type: MESSAGES.FOOTER_UPDATE,
                    previousValue: false,
                });

                this.removeDebug();
            }

            if (!this.active) return;

            const filesInfos = this.getFileInfos();

            switch (datas.type) {
                case MESSAGES.CONTENT_NEXT:
                    if (this.navigation.current === this.navigation.total) {
                        this.mediator.setStatus("c");
                    }

                    if (screen && screen.hasNextOverrides()) {
                        screen.executeNextOverrides();
                        break;
                    }

                    if (filesInfos.nextId !== -1 && this.navigation.current === this.navigation.total) {
                        this.openNextFile();
                    } else if (typeof datas.value === "number") {
                        this.navigation.goTo(datas.value);
                    } else {
                        this.navigation.next();
                    }
                    break;
                case MESSAGES.CONTENT_PREVIOUS:
                    if (screen && screen.hasPreviousOverrides()) {
                        screen.executePreviousOverrides();
                        break;
                    }

                    if (filesInfos.previousId !== -1 && this.navigation.current === this.navigation.min) {
                        this.openPreviousFile();
                    } else if (typeof datas.value === "number") {
                        this.navigation.goTo(datas.value);
                    } else {
                        this.navigation.previous();
                    }
                    break;
                case MESSAGES.CONTENT_UPDATE:
                    break;
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
                case MESSAGES.CONTENT_VOLUME:
                    break;
                case MESSAGES.MENU_SHOW:
                    this.sendToMenu({
                        type: MESSAGES.MENU_SHOW,
                    });
                    break;
                case MESSAGES.MENU_HIDE:
                    this.sendToMenu({
                        type: MESSAGES.MENU_HIDE,
                    });
                    break;
            }
        });
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
        if (preloadData) {
            this.preload = true;
            this.preloadData = [...preloadData];
        }

        if (document.readyState === "complete") {
            this.handleLoad();
        } else {
            window.addEventListener("load", this.boundHandleLoad);
        }
    }

    launch() {
        const screenElements = Array.from(document.querySelectorAll(".screen"));

        this.navigation = new Navigation(1);
        this.screenManager = new ScreenManager(this);
        this.messages = new Message();

        this.screens = screenElements.map((screen, index) => {
            const screenID = index + 1;
            const previousValues = this.config.previous;
            const botValues = this.config.hasBot;
            const screenPrevious = previousValues[`screen_${screenID}`];
            const screenBot = botValues[`screen_${screenID}`];

            let mainID = screenID;

            return new NavigationScreen({
                mainID,
                id: screenID,
                previousID: screenPrevious,
                bot: screenBot || false,
                element: screen,
                storeScormDatas: this.storeScormDatas.bind(this),
                getStoredScormDatas: this.getStoredScormDatas.bind(this),
                haveBeenSeen: this.screenHaveBeenSeen.bind(this),
                botsManager: this.botsManager,
                rootPath: {
                    relative: this.relativeContentRoot,
                    absolute: this.absoluteContentRoot,
                },
                module: {
                    title: this.moduleTitle,
                    contentType: this.contentType,
                    fileType: this.fileType,
                    contentSize: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                    footerSize: {
                        width: 1660,
                        height: 47,
                    },
                },
            });
        });

        this.screenManager.registerMultiple(this.screens);
        this.navigation.total = this.screens.length;

        this.addListeners();
        this.listenMessages();

        this.sendTo("menu", {
            type: "Menu.content",
            array: this.scormInterface.fileDatas,
            fileID: this.fileID,
            ID: this.scormInterface.datas.ID,
        });

        this.setTranslations();

        if (this.fileID !== 0) {
            this.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                menu: true,
            });
            this.sendTo("menu", {
                type: MESSAGES.MENU_ON,
            });
        }
        //this.setScorm();

        this.ready = true;
        this.emit(App.READY);

        this.setNavigation();
    }
}
