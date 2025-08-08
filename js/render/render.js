import { getUuidv4, noop } from "../utils/utils.js";
import EmitterMixin from "../emitter/emitter-mixin.js";
import RendererTime from "./renderer-time.js";

const privateProperties = {};

export default class Render extends EmitterMixin {
    static get ACTIVE() {
        return "Render.active";
    }

    constructor(data) {
        super();

        this.id = getUuidv4();
        this.name = this.id;
        this.fct = noop;
        this.removeCallback = noop;
        this.context = this;
        this.autoStart = true;
        this.launch = false;
        this.time = new RendererTime();

        privateProperties[this.id] = {
            active: true,
        };

        this.set(data);
    }

    set active(state) {
        if (typeof state !== "boolean") {
            return;
        }

        if (state === true) {
            this.emit(Render.ACTIVE);
        }

        privateProperties[this.id].active = state;
    }

    get active() {
        return privateProperties[this.id].active;
    }

    set(data = {}) {
        if (typeof data.name === "string") {
            this.name = data.name;
        }

        if (typeof data.fct === "function") {
            this.fct = data.fct;
        }

        if (typeof data.removeCallback === "function") {
            this.removeCallback = data.removeCallback;
        }

        if (data.context !== undefined && data.context !== null) {
            this.context = data.context;
        }

        if (typeof data.autoStart === "boolean") {
            this.autoStart = data.autoStart;
        }

        if (typeof data.launch === "boolean") {
            this.launch = data.launch;
        }

        if (typeof data.active === "boolean") {
            privateProperties[this.id].active = data.active;
        }

        if (data.time instanceof RendererTime === true) {
            this.time = data.time;
        }
    }
}
