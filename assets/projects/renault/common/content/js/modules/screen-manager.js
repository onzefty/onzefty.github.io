import * as Utils from "../utils/utils.js";
import EmitterMixin from "../emitter/emitter-mixin.js";

let instance = null;

export class ScreenManager extends EmitterMixin {
    static SCREEN_SHOWN = "ScreenManager.screenShown";
    static SCREEN_HIDDEN = "ScreenManager.screenHidden";
    static REQUEST_NEXT = "ScreenManager.requestNext";
    static REQUEST_PREVIOUS = "ScreenManager.requestPrevious";
    static REQUEST_NEXT_ACTIVE = "ScreenManager.requestNextActive";
    static REQUEST_NEXT_INACTIVE = "ScreenManager.requestNextInactive";
    static REQUEST_PREVIOUS_ACTIVE = "ScreenManager.resquestPreviousActive";
    static REQUEST_PREVIOUS_INACTIVE = "ScreenManager.resquestPreviousInactive";
    static REQUEST_FOOTER_MODE = "ScreenManager.requestFooterMode";
    static QUESTION_PASSED = "ScreenManager.question.passed";
    static QUESTION_FAILED = "ScreenManager.question.failed";

    constructor() {
        if (instance) {
            return instance;
        } else {
            super();
            instance = this;
        }

        this.lastNavigationID = -1;
        this.navigationID = -1;
        this.list = [];
    }

    register(screen) {
        if (this.findByID(screen.id)) {
            return;
        }

        screen.on(NavigationScreen.SHOW, (event) => {
            const screen = event.target;
            const lastScreen = this.findByID(this.lastNavigationID);
            const goesPrevious = this.lastNavigationID > this.navigationID;
            let transmittedData = {};

            if (lastScreen) {
                transmittedData = {
                    ...lastScreen.dataToTransmit[goesPrevious ? "previous" : "next"],
                    globals: {
                        ...lastScreen.dataToTransmit.globals,
                    },
                };

                lastScreen.resetDatas();
            }

            const init = (options = {}) => {
                let initOptions = {
                    transmittedData,
                    ...options,
                };

                screen.init(initOptions);
            };

            this.emit(ScreenManager.SCREEN_SHOWN, {
                screen,
                init,
                transmittedData,
            });
        });

        screen.on(NavigationScreen.HIDE, () => {
            this.emit(ScreenManager.SCREEN_HIDDEN, {
                screen,
            });
        });

        screen.on(NavigationScreen.QUESTION_PASSED, () => {
            this.emit(ScreenManager.QUESTION_PASSED);
        });

        screen.on(NavigationScreen.QUESTION_FAILED, () => {
            this.emit(ScreenManager.QUESTION_FAILED);
        });

        screen.on(NavigationScreen.REQUEST_NEXT, () => {
            this.emit(ScreenManager.REQUEST_NEXT);
        });

        screen.on(NavigationScreen.REQUEST_PREVIOUS, () => {
            this.emit(ScreenManager.REQUEST_PREVIOUS);
        });

        screen.on(NavigationScreen.REQUEST_NEXT_ACTIVE, () => {
            this.emit(ScreenManager.REQUEST_NEXT_ACTIVE);
        });

        screen.on(NavigationScreen.REQUEST_NEXT_INACTIVE, () => {
            this.emit(ScreenManager.REQUEST_NEXT_INACTIVE);
        });

        screen.on(NavigationScreen.REQUEST_PREVIOUS_ACTIVE, () => {
            this.emit(ScreenManager.REQUEST_PREVIOUS_ACTIVE);
        });

        screen.on(NavigationScreen.REQUEST_PREVIOUS_INACTIVE, () => {
            this.emit(ScreenManager.REQUEST_PREVIOUS_INACTIVE);
        });

        screen.on(NavigationScreen.REQUEST_FOOTER_MODE, (event) => {
            this.emit(ScreenManager.REQUEST_FOOTER_MODE, event.data);
        });

        this.list.push(screen);
    }

    registerMultiple(screenList) {
        for (let i = 0; i < screenList.length; i++) {
            const screen = screenList[i];

            this.register(screen);
        }
    }

    display(screenID, animate = true) {
        const playAnimations = animate && this.navigationID !== -1;
        let currentScreen;
        let screensToHide = [];

        for (let i = 0; i < this.list.length; i++) {
            const screen = this.list[i];

            if (screen.id === screenID) {
                currentScreen = screen;

                this.lastNavigationID = this.navigationID;
                this.navigationID = screenID;
            } else {
                screensToHide.push(screen);
            }
        }

        const goesPrevious = this.lastNavigationID > this.navigationID;

        if (screensToHide.length > 0) {
            screensToHide.forEach((screenToHide) => {
                screenToHide.hide(playAnimations, goesPrevious);
            });
        }

        if (currentScreen) {
            currentScreen.show(playAnimations, goesPrevious);
        }
    }

    hide(screenID, animate = true) {
        const playAnimations = animate && this.navigationID !== -1;
        let currentScreen;

        for (let i = 0; i < this.list.length; i++) {
            const screen = this.list[i];

            if (screen.id === screenID) {
                currentScreen = screen;

                this.lastNavigationID = this.navigationID;
            }
        }

        if (currentScreen) {
            currentScreen.hide(playAnimations, this.lastNavigationID > this.navigationID);
        }
    }

    stopDelayedExecute() {
        for (let i = 0; i < this.list.length; i++) {
            const screen = this.list[i];

            if (screen.id === this.navigationID) {
                screen.stopDelayedExecute();
            }
        }
    }

    findByID(screenID) {
        return this.list.filter((screen) => screen.id === screenID)[0];
    }

    findByElement(screenElement) {
        return this.list.filter((screen) => screen.element === screenElement)[0];
    }
}

export class NavigationScreen extends EmitterMixin {
    static SHOW = "NavigationScreen.show";
    static HIDE = "NavigationScreen.hide";
    static REQUEST_NEXT = "NavigationScreen.requestNext";
    static REQUEST_PREVIOUS = "NavigationScreen.requestPrevious";
    static REQUEST_NEXT_ACTIVE = "NavigationScreen.requestNextActive";
    static REQUEST_NEXT_INACTIVE = "NavigationScreen.requestNextInactive";
    static REQUEST_PREVIOUS_ACTIVE = "NavigationScreen.resquestPreviousActive";
    static REQUEST_PREVIOUS_INACTIVE = "NavigationScreen.resquestPreviousInactive";
    static REQUEST_FOOTER_MODE = "NavigationScreen.requestFooterMode";
    static QUESTION_PASSED = "NavigationScreen.questionPassed";
    static QUESTION_FAILED = "NavigationScreen.questionFailed";

    static FOOTER_OPTIONS = {
        mode: false,
    };

    static NEXT_OPTIONS = {
        mode: "manual", // manual, auto
    };

    #animationTimers = [];
    #nextOverrides = [];
    #previousOverrides = [];
    #seen = null;
    #isHidding = false;

    constructor(options = {}) {
        super();

        this.element = options.element;
        this.mainID = options.mainID;
        this.id = options.id;
        this.previousID = options.previousID;
        this.bot = options.bot;
        this.rootPath = options.rootPath;
        this.module = options.module;
        this.storeScormDatas = options.storeScormDatas;
        this.getStoredScormDatas = options.getStoredScormDatas;
        this.botsManager = options.botsManager;
        this.utils = {
            ...Utils,
        };
        this.delayedFn = [];
        this.disposers = [];
        this.initOptions = null;
        this.footerOptions = null;
        this.transmittedData = {
            globals: {},
        };
        this.dataToTransmit = {
            next: {},
            previous: {},
            globals: {},
        };
        this.#seen = options.haveBeenSeen;
    }

    get seen() {
        if (!this.#seen || typeof this.#seen !== "function") {
            return false;
        }

        return this.#seen(this.id);
    }

    get isShown() {
        return this.element.classList.contains("active");
    }

    init(options) {
        this.initOptions = this.getMergedOptions({}, options);

        const { footer, transmittedData } = this.initOptions;

        this.footerOptions = this.getMergedOptions(NavigationScreen.FOOTER_OPTIONS, footer);
        this.transmittedData = { globals: {}, ...transmittedData };

        this.dataToTransmit.globals = {
            ...this.dataToTransmit.globals,
            ...this.transmittedData.globals,
        };

        this.start();
    }

    start() {
        this.changeFooterMode(this.footerOptions);
    }

    show(animate, invert) {
        if (!this.isShown) {
            this.stopAnimations();

            if (animate) {
                this.element.classList.add("animate");
                this.element.classList.remove("hidding");

                this.botsManager.setDisplayDirection(this.bot, `${invert ? "left" : "right"}-to-mid`);

                if (invert) {
                    this.element.classList.add("invert");
                } else {
                    this.element.classList.remove("invert");
                }

                this.element.classList.add("waiting");

                const showTimer = setTimeout(() => {
                    this.#animationTimers.push(
                        setTimeout(() => {
                            this.element.classList.remove("invert");
                            this.element.classList.remove("animate");
                        }, 1000)
                    );

                    this.botsManager.display(this.bot);
                    this.element.classList.remove("waiting");
                    this.element.classList.add("active");
                }, 20);

                this.#animationTimers.push(showTimer);
            } else {
                this.botsManager.display(this.bot);
                this.element.classList.add("active");
            }

            this.emit(NavigationScreen.SHOW);
        }
    }

    #hideDispose() {
        this.initOptions = null;

        this.stopDelayedExecute();

        this.disposers.forEach((disposer) => {
            disposer();
        });

        this.disposers.length = 0;
    }

    #hideCallback() {
        this.botsManager.realHide(this.bot);

        this.#hideDispose();
        this.emit(NavigationScreen.HIDE);
        this.#isHidding = false;
    }

    hide(animate, invert) {
        if (this.isShown) {
            this.clearNextOverrides();
            this.clearPreviousOverrides();

            this.botsManager.off();

            this.botsManager.send(this.bot, {
                type: "stop",
            });

            if (animate) {
                this.stopAnimations();

                this.botsManager.setDisplayDirection(this.bot, `mid-to-${invert ? "right" : "left"}`);

                this.element.classList.add("animate");

                if (invert) {
                    this.element.classList.add("invert");
                } else {
                    this.element.classList.remove("invert");
                }

                this.element.classList.add("waiting");

                const hideTimer = setTimeout(() => {
                    this.#animationTimers.push(
                        setTimeout(() => {
                            this.element.classList.remove("hidding");
                            this.element.classList.remove("invert");
                            this.element.classList.remove("animate");

                            this.#hideCallback();
                        }, 1000)
                    );

                    this.botsManager.hide(this.bot);
                    this.element.classList.remove("waiting");
                    this.element.classList.remove("active");
                    this.element.classList.add("hidding");
                    this.#isHidding = true;
                }, 20);

                this.#animationTimers.push(hideTimer);
            } else {
                this.element.classList.remove("active");
                this.#hideCallback();
            }
        }
    }

    stopAnimations() {
        if (this.#isHidding) {
            this.#hideCallback();
        }

        this.#animationTimers.forEach((timer) => {
            this.element.classList.remove("invert");
            this.element.classList.remove("animate");
            this.element.classList.remove("hidding");
            this.element.classList.remove("invert");
            this.element.classList.remove("animate");

            clearTimeout(timer);
        });
    }

    goToNext() {
        this.emit(NavigationScreen.REQUEST_NEXT);
    }

    goToPrevious() {
        this.emit(NavigationScreen.REQUEST_PREVIOUS);
    }

    questionPassed() {
        if (this.module.fileType !== "evaluation") {
            return;
        }

        this.executeDelayed(() => {
            this.emit(NavigationScreen.QUESTION_PASSED);
        }, 1500);
    }

    questionFailed() {
        if (this.module.fileType !== "evaluation") {
            return;
        }

        this.executeDelayed(() => {
            this.emit(NavigationScreen.QUESTION_FAILED);
        }, 1500);
    }

    enableNext() {
        this.emit(NavigationScreen.REQUEST_NEXT_ACTIVE);
    }

    disableNext() {
        this.emit(NavigationScreen.REQUEST_NEXT_INACTIVE);
    }

    enablePrevious() {
        this.emit(NavigationScreen.REQUEST_PREVIOUS_ACTIVE);
    }

    disablePrevious() {
        this.emit(NavigationScreen.REQUEST_PREVIOUS_INACTIVE);
    }

    disableNavigation() {
        this.disableNext();
        this.disablePrevious();
    }

    enableNavigation() {
        this.enableNext();
        this.enablePrevious();
    }

    changeFooterMode(options = {}) {
        const footerOpts = {
            ...NavigationScreen.FOOTER_OPTIONS,
            ...options,
        };

        if (footerOpts.mode !== false) {
            this.emit(NavigationScreen.REQUEST_FOOTER_MODE, footerOpts);
        }
    }

    addDisposer(fn) {
        this.disposers.push(fn);
    }

    executeDelayed(fn, delay = 0, name) {
        if (delay === 0) {
            fn();
        } else {
            let delayedData = { name };

            const delayedID = setTimeout(() => {
                const index = this.delayedFn.indexOf(delayedData);

                if (index > -1) {
                    this.delayedFn.splice(index, 1);
                }

                fn();
            }, delay);

            delayedData.id = delayedID;

            this.delayedFn.push(delayedData);
        }
    }

    hasNextOverrides() {
        return this.#nextOverrides.length > 0;
    }

    executeNextOverrides() {
        this.#nextOverrides.forEach((override) => {
            override.execute();
        });
    }

    addNextOverride(config = {}) {
        if (!config.id) {
            return false;
        }

        const existingOverride = this.#nextOverrides.find((item) => item.id === config.id);

        if (existingOverride) {
            return false;
        }

        config.type = "next";

        const override = new NavigationOverride(config);

        this.#nextOverrides.push(override);

        return true;
    }

    removeNextOverride(id) {
        if (!id) {
            return false;
        }

        const existingOverride = this.#nextOverrides.find((item) => item.id === id);

        if (!existingOverride) {
            return false;
        }

        const overrideIndex = this.#nextOverrides.indexOf(existingOverride);
        const override = this.#nextOverrides[overrideIndex];

        this.#nextOverrides.splice(overrideIndex, 1);
        override.destroy();

        return true;
    }

    clearNextOverrides() {
        this.#nextOverrides.forEach((override) => {
            override.destroy();
        });

        this.#nextOverrides.length = 0;
    }

    hasPreviousOverrides() {
        return this.#previousOverrides.length > 0;
    }

    executePreviousOverrides() {
        this.#previousOverrides.forEach((override) => {
            override.execute();
        });
    }

    addPreviousOverride(config = {}) {
        if (!config.id) {
            return false;
        }

        const existingOverride = this.#previousOverrides.find((item) => item.id === config.id);

        if (existingOverride) {
            return false;
        }

        config.type = "previous";

        const override = new NavigationOverride(config);

        this.#previousOverrides.push(override);

        return true;
    }

    removePreviousOverride(id) {
        if (!id) {
            return false;
        }

        const existingOverride = this.#previousOverrides.find((item) => item.id === id);

        if (!existingOverride) {
            return false;
        }

        const overrideIndex = this.#previousOverrides.indexOf(existingOverride);
        const override = this.#previousOverrides[overrideIndex];

        this.#previousOverrides.splice(overrideIndex, 1);
        override.destroy();

        return true;
    }

    clearPreviousOverrides() {
        this.#previousOverrides.forEach((override) => {
            override.destroy();
        });

        this.#previousOverrides.length = 0;
    }

    stopDelayedExecute(name) {
        this.delayedFn.forEach((delayedData) => {
            if (name && delayedData.name) {
                if (delayedData.name === name) clearTimeout(delayedData.id);
            } else {
                clearTimeout(delayedData.id);
            }
        });
    }

    getMergedOptions(defaultOptions, specificOptions) {
        return {
            ...defaultOptions,
            ...specificOptions,
        };
    }

    resetDatas() {
        this.dataToTransmit = {
            next: {},
            previous: {},
            globals: this.transmittedData.globals,
        };
    }
}

export class NavigationOverride {
    #id = null;
    #type = null;
    #action = null;
    #context = null;

    constructor(options = {}) {
        const config = {
            id: "",
            type: "next",
            action: Utils.noop,
            context: null,
            ...options,
        };

        this.#id = config.id;
        this.#type = config.type;
        this.#action = config.action;
        this.#context = config.context;
    }

    get id() {
        return this.#id;
    }

    get type() {
        return this.#type;
    }

    execute() {
        if (!this.#action || typeof this.#action !== "function") {
            return;
        }

        if (!this.#context) {
            this.#action();
        } else {
            this.#action.call(this.#context);
        }
    }

    destroy() {
        this.#action = null;
        this.#context = null;
        this.#id = null;
        this.#type = null;
    }
}

export default ScreenManager;
