import EmitterMixin from "../emitter/emitter-mixin.js";
import InterfaceFinder from "../interface/interface-finder.js";
import Message from "../components/message.js";

export class FrameView extends EmitterMixin {
    static get LOADED() {
        return "FrameView.loaded";
    }

    static get FOCUSED() {
        return "FrameView.focused";
    }

    static get BLURRED() {
        return "FrameView.blured";
    }

    constructor(options) {
        super();

        this.config = { focusable: true, ...options };
        this.message = new Message();
        this.element = frameElement;
        this.parent = frameElement.parentNode;
        this.correspondents = [];
        this.scormInterface = InterfaceFinder.search();

        window.addEventListener("focus", this.focus.bind(this));
        window.addEventListener("blur", this.blur.bind(this));
        window.addEventListener("contextmenu", this.context.bind(this));

        this.load();
    }

    load() {
        if (!this.scormInterface || !this.scormInterface.ready) {
            const waitForReady = (event) => {
                const data = event.data;

                if (data.type === "interface-ready") {
                    window.removeEventListener("message", waitForReady);

                    if (!this.scormInterface) {
                        this.scormInterface = event.source.scormInterface;
                    }

                    if (this.scormInterface.ready){
                        this.loaded = true;
                        this.emit(FrameView.LOADED);
                    } else {
                        this.load();
                    }
                }
            };
            
            window.addEventListener("message", waitForReady);
        } else {
            this.loaded = true;
            this.emit(FrameView.LOADED);
        }
    }

    focus() {
        if (!this.config.focusable) {
            this.element.blur();
            this.element.contentWindow.blur();
            this.element.contentDocument.body.blur();
        }

        this.emit(FrameView.FOCUSED);
    }

    blur() {
        this.emit(FrameView.BLURRED);
    }

    context(event) {
        event.stopPropagation();
        event.preventDefault();

        return false;
    }

    listenMessages(listener) {
        this.message.listen(listener);
    }

    sendTo(correspondentName, data) {
        const correspondent = this.getCorrespondent(correspondentName);

        if (correspondent && correspondent.window) {
            this.message.sendTo(correspondent.window, data);
        }
    }

    addCorrespondent(correspondent) {
        const existingCorrespondent = this.getCorrespondent(correspondent);

        if (correspondent && !existingCorrespondent) {
            this.correspondents.push(correspondent);
        }
    }

    getCorrespondent(correspondentName) {
        let result = null;

        for (let i = 0; i < this.correspondents.length; i++) {
            const correspondent = this.correspondents[i];

            if (correspondent.name === correspondentName) {
                result = this.correspondents[i];
                break;
            }
        }

        return result;
    }

    removeCorrespondent(correspondent) {
        const correspondentIndex = this.correspondents.indexOf(correspondent);

        if (correspondentIndex > -1) {
            this.correspondents.splice(correspondentIndex, 1);
        }
    }
}

export class FrameCorrespondent {
    constructor(name, element) {
        this.name = name;
        this.element = element;

        if (this.element) {
            this.parent = this.element.parentNode;
            this.window = this.element.contentWindow;
        } else {
            return null;
        }
    }

    update(element) {
        if (!element && !this.parent) {
            return;
        }

        this.element = element || this.parent.querySelector("iframe");
        this.window = this.element.contentWindow;
    }
}

export default FrameView;
