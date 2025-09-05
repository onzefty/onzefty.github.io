import Renderer from "../render/renderer.js";
import { getRandomID } from "../utils/utils.js";

const privateVariables = {};
let instance;

export default class AutoFocus {
    constructor(app) {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.id = getRandomID();
        this.app = app;

        privateVariables[this.id] = {};
        privateVariables[this.id].exceptions = [];
        privateVariables[this.id].contextException = [];

        this.renderer = new Renderer();
        this.focusRender;
        this.focusFrameCount = 0;
        this.focusFrameNeeded = 5;
        this.lastFocused = document.body;

        this.boundHandleFocus = this.handleFocus.bind(this);
        this.boundHandleFocusOut = this.handleFocusOut.bind(this);

        this.init();
    }

    get exceptions() {
        return [...privateVariables[this.id].exceptions];
    }

    get contextException() {
        return [...privateVariables[this.id].contextException];
    }

    addException(selector) {
        if (!this.exceptions.includes(selector)) {
            privateVariables[this.id].exceptions.push(selector);
        }
    }

    addContextException(exception) {
        if (exception.context && exception.selector) {
            for (let i = 0; i < this.contextException.length; i++) {
                const context = this.contextException[i].context;
                const selector = this.contextException[i].selector;

                if (context === exception.context && selector === exception.selector) {
                    return;
                }
            }

            privateVariables[this.id].contextException.push(exception);
        }
    }

    removeException(selector) {
        const exceptionIndex = this.exceptions.indexOf(selector);

        if (exceptionIndex > -1) {
            privateVariables[this.id].exceptions.splice(exceptionIndex, 1);
        }
    }

    removeContextException(exception) {
        const exceptionContext = exception.context;
        const exceptionSelector = exception.selector;

        if (!exceptionContext && !exceptionSelector) {
            return;
        }

        for (let i = 0; i < this.contextException.length; i++) {
            const context = this.contextException[i].context;
            const selector = this.contextException[i].selector;

            if (context === exceptionContext && selector === exceptionSelector) {
                privateVariables[this.id].contextException.splice(i, 1);
                break;
            }
        }
    }

    clearExceptions() {
        privateVariables[this.id].exceptions.length = 0;
    }

    clearContextExceptions() {
        privateVariables[this.id].contextException.length = 0;
    }

    isException(element) {
        for (let i = 0; i < this.exceptions.length; i++) {
            const selector = this.exceptions[i];

            if (element.matches(selector)) {
                return true;
            }
        }

        return false;
    }

    isContextException() {
        const frameEl = frameElement;

        if (frameEl) {
            const frameElOwner = frameEl.ownerDocument;

            for (let i = 0; i < this.contextException.length; i++) {
                const contextException = this.contextException[i];
                const context = contextException.context;
                const selector = contextException.selector;
                let exceptionOwner = context;

                if (exceptionOwner.Window) {
                    exceptionOwner = exceptionOwner.document;
                }

                if (!exceptionOwner.defaultView) {
                    exceptionOwner = exceptionOwner.ownerDocument;
                }

                if (!exceptionOwner || !exceptionOwner.activeElement) {
                    continue;
                }

                const exceptionEl = exceptionOwner.activeElement;

                if (frameElOwner === exceptionOwner && exceptionEl.matches(selector)) {
                    if (exceptionEl.tagName.toLowerCase() === "iframe") {
                        const frameSelector = contextException.frameSelector;
                        const frameDocument = exceptionEl.contentDocument;

                        if (frameSelector && frameDocument && frameDocument.activeElement.matches(frameSelector)) {
                            return true;
                        } else if (!frameSelector) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    init() {
        this.focusRender = this.renderer.add({
            name: "autoFocus",
            fct: this.focus,
            context: this,
        });

        window.addEventListener("focusin", this.boundHandleFocus);
        window.addEventListener("blur", this.boundHandleFocusOut);
    }

    focus() {
        if (!this.app.active) {
            this.focusRender.active = false;
            return;
        }

        if (this.isContextException()) {
            this.focusFrameCount = 0;
            this.focusRender.active = false;
            return;
        }

        window.focus();

        if (!this.lastFocused || !this.lastFocused.isConnected || this.lastFocused.offsetParent === null) {
            this.lastFocused = document.body;
        }

        if (this.focusFrameCount === this.focusFrameNeeded) {
            this.focusFrameCount = 0;
            this.focusRender.active = false;
            this.checkedContextException = false;
        }

        this.lastFocused.focus();

        this.focusFrameCount++;
    }

    handleFocus(event) {
        const activeElement = event.target;
        const isIFrame = activeElement instanceof HTMLIFrameElement;
        const isBody = activeElement === document.body;
        const isDisplayed = activeElement.offsetParent !== null;
        const isException = this.isException(activeElement);

        if (!isException && !isBody && !isIFrame && isDisplayed && activeElement.isConnected) {
            this.lastFocused = activeElement;
        }

        this.focusRender.active = true;
    }

    handleFocusOut(event) {
        const inactiveElement = event.target;

        this.focusRender.active = true;

        inactiveElement.removeEventListener("focusout", this.boundHandleFocusOut);
    }
}
