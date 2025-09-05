import { getRandomID } from "./utils.js";

const privateProperties = {};

class EmitterMixin {
    constructor() {
        this.emitID = getRandomID();

        privateProperties[this.emitID] = {};
        privateProperties[this.emitID].listeners = {};
    }

    get listeners() {
        const privateListeners = privateProperties[this.emitID].listeners;
        const listeners = {};

        for (const name in privateListeners) {
            const listenerArray = privateListeners[name];
            listeners[name] = [...listenerArray];
        }

        return listeners;
    }

    get events() {
        const events = {};
        const keys = Reflect.ownKeys(this.constructor);
        const eventTestRegex = /([^.\n]+\.)+[^.\n]*/;

        keys.forEach((key) => {
            const value = this.constructor[key];
            const isPotentialEvent = eventTestRegex.test(value);

            if (typeof value === "string" && isPotentialEvent && isNaN(value)) {
                events[key] = value;
            }
        });

        if (keys.includes("EVENTS")) {
            const eventsDictionary = this.constructor.EVENTS;
            const dictKeys = Reflect.ownKeys(eventsDictionary);

            dictKeys.forEach((key) => {
                const value = eventsDictionary[key];

                if (typeof value === "string" && isPotentialEvent && isNaN(value)) {
                    events[key] = value;
                }
            });
        }

        return events;
    }

    on(type, handler) {
        return this.listen(type, handler);
    }

    once(type, handler) {
        const onceHandler = (event) => {
            event.off();
            handler.call(event.target, event);
        };

        return this.listen(type, onceHandler);
    }

    listen(type, handler) {
        const listeners = privateProperties[this.emitID].listeners;
        if (!Array.isArray(this.listeners[type])) {
            listeners[type] = [];
        }

        if (!listeners[type].includes(handler)) {
            listeners[type].push(handler);
        }

        return this;
    }

    has(type, handler) {
        if (this.listeners[type]) {
            if (handler) {
                return this.listeners[type].includes(handler);
            }

            return this.listeners[type].length > 0;
        }

        return false;
    }

    off(type, handler) {
        const listeners = privateProperties[this.emitID].listeners;
        const listenerArray = listeners[type];

        if (!type && !handler) {
            const keys = Object.keys(listeners);

            for (const name of keys) {
                delete listeners[name];
            }

            return this;
        }

        if (listenerArray) {
            if (handler) {
                const index = listenerArray.indexOf(handler);

                if (index > -1) {
                    listenerArray.splice(index, 1);
                }
            } else {
                listenerArray.length = 0;
            }
        }

        return this;
    }

    emit(type, data = {}) {
        const listenerArray = this.listeners[type];

        if (listenerArray) {
            const target = this;
            const event = new Event(type, target, data);

            listenerArray.forEach((handler) => {
                handler.call(event.target, event);

                if (event.called) {
                    this.off(event.type, handler);
                }
            });
        }
        return this;
    }
}

class Event {
    constructor(type, target, data) {
        this.type = type;
        this.target = target;
        this.data = data;
    }

    off() {
        this.called = true;
    }
}

export default EmitterMixin;
