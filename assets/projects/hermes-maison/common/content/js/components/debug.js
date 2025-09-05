import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS, noop } from "../lib//utils.js";

const consolePrefix = "🚧 [DebugMode] •••• LOGGER •••• 🚀";
const LOGCOLLAPSED = Symbol();

const nativeConsole = console;
const nativeConsoleFunctions = {
    error: nativeConsole.error,
    warn: nativeConsole.warn,
};
const nativeConfirm = window.confirm;
const nativePrompt = window.prompt;
const nativeAlert = window.alert;
const counters = {
    error: 0,
    warn: 0,
};
const keysPressed = [];

let instance = null;
let initialized = false;
let activeDebug = false;
let activeConsole = false;
let toogledByCombination = false;
let consoleGroupOpen = false;
let consoleGroupName = "";
let timer = 0;

export default class DebugMode extends EmitterMixin {
    static get UNKNOWN() {
        return "DebugMode.unknown";
    }

    static get LEFT() {
        return "DebugMode.left";
    }

    static get RIGHT() {
        return "DebugMode.right";
    }

    static get UP() {
        return "DebugMode.up";
    }

    static get DOWN() {
        return "DebugMode.down";
    }

    static get PRESS() {
        return "DebugMode.press";
    }

    static get ENABLED() {
        return "DebugMode.enabled";
    }

    static get DISABLED() {
        return "DebugMode.disabled";
    }

    static get LOGS_ENABLED() {
        return "DebugMode.console.enabled";
    }

    static get LOGS_DISABLED() {
        return "DebugMode.console.disabled";
    }

    static get ACTIVE() {
        return activeDebug;
    }

    static get LOG() {
        return log;
    }

    static get LOG_GROUP() {
        return logGroup;
    }

    static get LOG_GROUP_COLLAPSE() {
        return logGroupCollapse;
    }

    static get LOG_GROUP_END() {
        return logGroupEnd;
    }

    constructor(debug, debugConsole) {
        if (instance) {
            return instance;
        } else {
            super();
            instance = this;
        }

        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);

        activeDebug = debug;
        activeConsole = debugConsole !== undefined ? debugConsole : debug;

        instance = this;
    }

    get active() {
        return activeDebug;
    }

    get activeConsole() {
        return activeConsole;
    }

    init() {
        if (!initialized) {
            document.addEventListener(EVENTS.KEYDOWN, this.boundHandleKeyDown);
            document.addEventListener(EVENTS.KEYUP, this.boundHandleKeyUp);

            toggles();
            consoleMiddleware();

            initialized = true;
        }
    }
    handleKeyUp(event) {
        const key = event.key;

        if (magicPressed(event) && key.length === 1) {
            const keyIndex = keysPressed.indexOf(key);

            if (keyIndex > -1) {
                keysPressed.splice(keyIndex, 1);
            }
        }

        clearPressed();
    }
    handleKeyDown(event) {
        const key = (event.key || "none").toLowerCase();

        if (magicPressed(event) && key.length === 1) {
            if (!keysPressed.includes(key)) {
                keysPressed.push(key);
            } else {
                return false;
            }

            validCombination();
            clearPressed();

            event.stopPropagation();
            event.preventDefault();
        }
    }
    log() {
        log(arguments);
    }
    logGroup() {
        logGroup(arguments);
    }
    logGroupCollapse() {
        logGroupCollapse(arguments);
    }
    logGroupEnd() {
        logGroupEnd();
    }
}

function consoleMiddleware() {
    console.error = function () {
        if (consoleGroupOpen) {
            counters.error++;
        }

        nativeConsoleFunctions.error.apply(console, arguments);
    };

    console.warn = function () {
        if (consoleGroupOpen) {
            counters.warn++;
        }

        nativeConsoleFunctions.warn.apply(console, arguments);
    };

    window.addEventListener("error", function () {
        if (consoleGroupOpen) {
            counters.error++;
            logGroupEnd();
        }
    });
}

function resetCounters() {
    for (const [key, _] of Object.entries(counters)) {
        counters[key] = 0;
    }
}

function logGroupCollapse() {
    logGroup.apply(this, [LOGCOLLAPSED, ...arguments]);
}

function logGroup() {
    const args = [...arguments];
    let collapsed = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === LOGCOLLAPSED) {
            collapsed = true;
            args.splice(i, 1);
            break;
        }
    }

    if (args.length <= 0 || !activeConsole) {
        return;
    }

    const logGroup = collapsed ? console.groupCollapsed : console.group;

    logGroup.apply(console, [consolePrefix, ...args]);

    consoleGroupOpen = true;
    consoleGroupName = args[0];
}

function logGroupEnd() {
    if (!activeConsole) {
        return;
    }

    console.groupEnd();

    consoleGroupOpen = false;

    const prefix = consolePrefix;

    if (counters.error > 0) {
        console.error(prefix, consoleGroupName, `[ERROR : ${counters.error}]`);
    }

    if (counters.warn > 0) {
        console.warn(prefix, consoleGroupName, `[WARN : ${counters.warn}]`);
    }

    resetCounters();

    consoleGroupName = "";
}

function log() {
    if (arguments.length <= 0 || !activeConsole) {
        return;
    }

    let args = arguments;

    if (!consoleGroupOpen) {
        args = [consolePrefix, ...args];
    }

    console.log.apply(console, args);
}

function magicPressed(event) {
    if (!event) {
        return false;
    }

    if (event.shiftKey && event.ctrlKey) {
        return true;
    }

    return false;
}

function clearPressed() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        keysPressed.length = 0;
    }, 1000);
}

function validCombination() {
    const combination = keysPressed.join("");

    if (combination === "d") {
        activeDebug = !activeDebug;
        toogledByCombination = true;
        keysPressed.length = 0;
    }

    if (combination === "l") {
        activeConsole = !activeConsole;
        toogledByCombination = true;
        keysPressed.length = 0;
    }

    if (toogledByCombination) {
        toggles();
    }
}

function debugInterpreter(event) {
    if (!activeDebug || !instance) {
        return false;
    }

    const key = event.key;
    const eventActions = () => {
        event.stopPropagation();
    };

    let debugKey = DebugMode.UNKNOWN;

    switch (key) {
        case "Left":
        case "ArrowLeft":
            debugKey = DebugMode.LEFT;
            eventActions();
            break;
        case "Right":
        case "ArrowRight":
            debugKey = DebugMode.RIGHT;
            eventActions();
            break;
        case "Up":
        case "ArrowUp":
            debugKey = DebugMode.UP;
            eventActions();
            break;
        case "Down":
        case "ArrowDown":
            debugKey = DebugMode.DOWN;
            eventActions();
            break;
    }

    instance.emit(DebugMode.PRESS, {
        key: debugKey,
        baseKey: key,
        code: event.keyCode,
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        meta: event.metaKey,
    });
}

function toggles() {
    toggleDebug();
    toggleLog();
}

function toggleDebug() {
    if (activeDebug) {
        enableDebug();
    } else {
        disableDebug();
    }
}

function toggleLog() {
    if (activeConsole) {
        enableConsole();
    } else {
        disableConsole();
    }
}

function enableConsole() {
    if (!activeConsole) {
        return;
    }

    console = nativeConsole;

    window.confirm = nativeConfirm;
    window.prompt = nativePrompt;
    window.alert = nativeAlert;

    if (instance) {
        instance.emit(DebugMode.LOGS_ENABLED, {
            combination: toogledByCombination,
        });

        toogledByCombination = false;
    }
}

function disableConsole() {
    if (activeConsole) {
        return;
    }

    console = {
        assert: () => {},
        clear: () => {},
        count: () => {},
        countReset: () => {},
        debug: () => {},
        error: () => {},
        info: () => {},
        log: () => {},
        table: () => {},
        trace: () => {},
        warn: () => {},
        dir: () => {},
        dirxml: () => {},
        group: () => {},
        groupCollapsed: () => {},
        groupEnd: () => {},
        time: () => {},
        timeLog: () => {},
        timeEnd: () => {},
        exception: () => {},
        timeStamp: () => {},
        profile: () => {},
        profileEnd: () => {},
        context: () => {},
        memory: () => {},
        markTimeline: () => {},
        select: () => {},
        timeline: () => {},
        timelineEnd: () => {},
        takeHeapSnapshot: () => {},
        cd: () => {},
    };

    window.confirm = noop;
    window.prompt = noop;
    window.alert = noop;

    if (instance) {
        instance.emit(DebugMode.LOGS_DISABLED, {
            combination: toogledByCombination,
        });

        toogledByCombination = false;
    }
}

function enableDebug() {
    if (!activeDebug) {
        return;
    }

    document.addEventListener(EVENTS.KEYUP, debugInterpreter, true);

    if (instance) {
        instance.emit(DebugMode.ENABLED, {
            combination: toogledByCombination,
        });

        toogledByCombination = false;
    }
}

function disableDebug() {
    if (activeDebug) {
        return;
    }

    document.removeEventListener(EVENTS.KEYUP, debugInterpreter);

    if (instance) {
        instance.emit(DebugMode.DISABLED, {
            combination: toogledByCombination,
        });

        toogledByCombination = false;
    }
}
