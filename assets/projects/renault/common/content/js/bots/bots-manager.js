import EmitterMixin from "../emitter/emitter-mixin.js";
import { getElementFrom, getElementsFrom } from "../utils/utils.js";

export default class BotsManager extends EmitterMixin {
    static GOT_UUID = "BotsManager.bot.uuid";
    static GOTO_TRAINER = "BotsManager.bot.goto.trainer";
    static DONE = "BotsManager.bot.done";

    constructor(options) {
        super();

        this.config = {
            window: window,
            document: document,
            botsContainerSelector: "#bots",
            botsSelector: ".bot",
            autoInit: false,
            ...options,
        };

        this.bots = [];
        this.currentBot = null;

        this.elements = {};

        if (this.config.autoInit) {
            this.init();
        }
    }

    init() {
        this.elements.container = getElementFrom(this.config.botsContainerSelector, this.config.document);

        if (!this.elements.container) {
            return Promise.resolve();
        }

        this.elements.bots = getElementsFrom(this.config.botsSelector, this.elements.container);

        if (this.elements.bots.length === 0) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const promises = [];

            this.elements.bots.forEach((bot) => {
                promises.push(
                    new Promise((readyResolve) => {
                        let waitingTimer = null;

                        const waitForBotReady = (event) => {
                            const { data, source } = event;

                            if (source !== bot.contentWindow) {
                                return;
                            }

                            if (data.type === "bot.ready") {
                                this.config.window.removeEventListener("message", waitForBotReady);
                                this.bots.push(new Bot(bot));

                                clearTimeout(waitingTimer);
                                readyResolve();
                            }
                        };

                        waitingTimer = setTimeout(() => {
                            console.warn("Bot", bot, "did not respond to ready message.");
                            this.config.window.removeEventListener("message", waitForBotReady);
                            readyResolve();
                        }, 1000);

                        this.config.window.addEventListener("message", waitForBotReady);
                        bot.contentWindow.postMessage({ type: "are-you-ready" }, "*");
                    })
                );
            });

            Promise.all(promises).then(() => {
                this.#listenBotMessages();

                resolve(this);
            });
        });
    }

    #listenBotMessages() {
        this.config.window.addEventListener("message", (event) => {
            const { data, source } = event;
            const emitter = this.bots.find((bot) => bot.window === source);

            if (emitter !== this.currentBot) {
                return;
            }

            if (data.type === "bot.completed") {
                this.emit(BotsManager.DONE, {
                    ...data,
                    source: emitter,
                });
            }

            if (data.type === "bot.go-to-trainer") {
                this.emit(BotsManager.GOTO_TRAINER, {
                    ...data,
                    source: emitter,
                });
            }

            if (data.type === "bot.uuid") {
                this.emit(BotsManager.GOT_UUID, {
                    ...data,
                    source: emitter,
                });
            }
        });
    }

    setCurrentBot(botID) {
        const bot = this.bots.find((bot) => bot.id === botID);

        if (!bot) {
            this.currentBot = null;
            return;
        }

        if (this.currentBot && bot !== this.currentBot) {
            this.currentBot.element.classList.remove("show");
            this.currentBot.element.classList.remove("hide");

            if (this.currentBot.direction) {
                this.currentBot.element.classList.remove(this.currentBot.direction);
            }
        }

        this.currentBot = bot;
    }

    send(botID, data) {
        const bot = this.findBot(botID);

        if (!bot) {
            return;
        }

        bot.window.postMessage(data, "*");
    }

    setDisplayDirection(botID, direction) {
        const bot = this.findBot(botID);

        if (!bot) {
            return;
        }

        if (bot.direction && bot.direction !== direction) {
            bot.element.classList.remove(bot.direction);
        }

        bot.element.classList.add(direction);
        bot.direction = direction;
    }

    display(botID) {
        const bot = this.findBot(botID);

        if (!bot) {
            return;
        }

        bot.element.classList.add("show");
        bot.element.classList.remove("hide");
    }

    hide(botID) {
        const bot = this.findBot(botID);

        if (!bot) {
            return;
        }

        bot.element.classList.remove("show");
        bot.element.classList.add("hide");
    }

    realHide(botID) {
        const bot = this.findBot(botID);

        if (!bot) {
            return;
        }

        bot.element.classList.remove("show");
        bot.element.classList.remove("hide");

        if (bot.direction) {
            bot.element.classList.remove(bot.direction);
        }
    }

    findBot(botID) {
        return this.bots.find((bot) => bot.id === botID);
    }
}

class Bot {
    constructor(element) {
        this.element = element;
        this.id = element.id;
        this.window = element.contentWindow;
        this.document = element.contentDocument || element.document;
        this.direction = null;
    }

    destroy() {
        this.element = null;
        this.id = null;
        this.window = null;
        this.document = null;
        this.direction = null;
    }
}
