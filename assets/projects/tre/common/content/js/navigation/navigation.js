import EmitterMixin from "../emitter/emitter-mixin.js";
import { getUuidv4, clamp } from "../utils/utils.js";

const privateProperties = {};

class Navigation extends EmitterMixin {
    static get LOCATION_CHANGED() {
        return "Navigation.locationChanged";
    }

    static get PLAY_FROM_LABEL() {
        return "Navigation.goToLabel";
    }

    static get STOP_TO_LABEL() {
        return "Navigation.stopToLabel";
    }

    constructor(min) {
        super();

        this.id = getUuidv4();

        privateProperties[this.id] = {};

        this.min = min || 0;

        privateProperties[this.id].current = this.min;
        privateProperties[this.id].seen = this.min;
        privateProperties[this.id].total = this.min;

        this.nextEnabled = true;
        this.previousEnabled = true;
    }

    get current() {
        return clamp(this.min, privateProperties[this.id].current, this.total);
    }

    set current(value) {
        if (typeof value === "number") {
            privateProperties[this.id].current = clamp(this.min, value, this.total);
            this.seen = privateProperties[this.id].current;
        }
    }

    get seen() {
        return clamp(this.min, privateProperties[this.id].seen, this.total);
    }

    set seen(value) {
        if (typeof value === "number") {
            privateProperties[this.id].seen = clamp(privateProperties[this.id].seen, value, this.total);
        }
    }

    get total() {
        return Math.max(this.min, privateProperties[this.id].total);
    }

    set total(value) {
        if (typeof value === "number") {
            privateProperties[this.id].total = Math.max(this.min, value);
        }
    }

    init(current) {
        this.current = current || this.min;

        this.emit(Navigation.LOCATION_CHANGED, {
            previousLocation: null,
        });
    }

    nextTo(value) {
        if (!this.nextEnabled) {
            return false;
        }

        const previousLocation = this.current;

        this.current = this.current + value;

        if (previousLocation !== this.current) {
            this.emit(Navigation.LOCATION_CHANGED, {
                previousLocation: previousLocation,
            });
        }
    }

    next() {
        this.nextTo(1);
    }

    goTo(value) {
        if (value < this.current && !this.previousEnabled) {
            return false;
        }

        if (value > this.current && !this.nextEnabled) {
            return false;
        }

        const previousLocation = this.current;
        this.current = value;

        if (previousLocation !== this.current) {
            this.emit(Navigation.LOCATION_CHANGED, {
                previousLocation: previousLocation,
            });
        }
    }

    previousTo(value) {
        if (!this.previousEnabled) {
            return false;
        }

        const previousLocation = this.current;
        this.current = this.current - value;

        if (previousLocation !== this.current) {
            this.emit(Navigation.LOCATION_CHANGED, {
                previousLocation: previousLocation,
            });
        }
    }

    previous() {
        this.previousTo(1);
    }

    playFromLabel(label) {
        if (typeof label === "string") {
            this.emit(Navigation.PLAY_FROM_LABEL, {
                label: label,
            });
        }
    }

    stopToLabel(label) {
        if (typeof label === "string") {
            this.emit(Navigation.STOP_TO_LABEL, {
                label: label,
            });
        }
    }
}

export default Navigation;
