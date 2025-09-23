(function (win) {
    var STATICS = {
        UNKNOWN: {
            get: function () {
                return 'DebugMode.unknown';
            },
        },
        LEFT: {
            get: function () {
                return 'DebugMode.left';
            },
        },
        RIGHT: {
            get: function () {
                return 'DebugMode.right';
            },
        },
        UP: {
            get: function () {
                return 'DebugMode.up';
            },
        },
        DOWN: {
            get: function () {
                return 'DebugMode.down';
            },
        },
        ENABLED: {
            get: function () {
                return 'DebugMode.enabled';
            },
        },
        DISABLED: {
            get: function () {
                return 'DebugMode.disabled';
            },
        },
    };

    var nativeConsole = console;
    var nativeConfirm = win.confirm;
    var nativePrompt = win.prompt;
    var nativeAlert = win.alert;

    var keysPressed = [];

    var timer = 0;

    var initialized = false;
    var instance = null;
    var activeDebug = false;

    setStatic(STATICS, DebugMode);

    function DebugMode(debug) {
        if (instance) {
            return instance;
        }

        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);

        Object.defineProperty(this, 'active', {
            get: function () {
                return activeDebug;
            },
        });

        activeDebug = debug;
        instance = this;
    }

    DebugMode.prototype.init = function () {
        if (!initialized) {
            document.addEventListener(Constants.KEY_DOWN, this.boundHandleKeyDown);
            document.addEventListener(Constants.KEY_UP, this.boundHandleKeyUp);

            toogleDebug();

            initialized = true;
        }
    };

    DebugMode.prototype.handleKeyUp = function (event) {
        var key = event.key;

        if (magicPressed(event) && key.length === 1) {
            var keyIndex = keysPressed.indexOf(key);

            if (keyIndex > -1) {
                keysPressed.slice(keyIndex, 1);
            }
        }

        clearPressed();
    };

    DebugMode.prototype.handleKeyDown = function (event) {
        var key = (event.key || 'none').toLowerCase();

        if (magicPressed(event) && key.length === 1) {
            var keyIndex = keysPressed.indexOf(key);

            if (keyIndex < 0) {
                keysPressed.push(key);
            } else {
                return false;
            }

            validCombination();
            clearPressed();

            event.stopPropagation();
            event.preventDefault();
        }
    };

    function magicPressed(event) {
        if (!event) {
            return false;
        }

        var shiftKey = event.shiftKey;
        var ctrlKey = event.ctrlKey;

        if (shiftKey && ctrlKey) {
            return true;
        }

        return false;
    }

    function clearPressed() {
        clearTimeout(timer);

        timer = setTimeout(function () {
            keysPressed.length = 0;
        }, 1000);
    }

    function validCombination() {
        var combination = keysPressed.join('');

        if (combination === 'debug') {
            activeDebug = !activeDebug;
            toogleDebug();
            keysPressed.length = 0;
        }
    }

    function debugInterpreter(event) {
        if (!activeDebug || !instance) {
            return false;
        }
        var key = event.key;
        var debugKey = DebugMode.UNKNOWN;

        switch (key) {
            case 'Left':
            case 'ArrowLeft':
                debugKey = DebugMode.LEFT;
                break;
            case 'Right':
            case 'ArrowRight':
                debugKey = DebugMode.RIGHT;
                break;
            case 'Up':
            case 'ArrowUp':
                debugKey = DebugMode.UP;
                break;
            case 'Down':
            case 'ArrowDown':
                debugKey = DebugMode.DOWN;
                break;
        }

        instance.emit(DebugMode.PRESS, {
            key: debugKey,
        });
    }

    function toogleDebug() {
        if (activeDebug) {
            enableDebug();
        } else {
            disableDebug();
        }
    }

    function enableDebug() {
        console = nativeConsole;

        win.confirm = nativeConfirm;
        win.prompt = nativePrompt;
        win.alert = nativeAlert;

        document.addEventListener(Constants.KEY_UP, debugInterpreter);

        if (instance) {
            instance.emit(DebugMode.ENABLED);
        }
    }

    function disableDebug() {
        console = {
            assert: function assert() {},
            clear: function clear() {},
            count: function count() {},
            countReset: function countReset() {},
            debug: function debug() {},
            error: function error() {},
            info: function info() {},
            log: function log() {},
            table: function table() {},
            trace: function trace() {},
            warn: function warn() {},
            dir: function dir() {},
            dirxml: function dirxml() {},
            group: function group() {},
            groupCollapsed: function groupCollapsed() {},
            groupEnd: function groupEnd() {},
            time: function time() {},
            timeLog: function timeLog() {},
            timeEnd: function timeEnd() {},
            exception: function exception() {},
            timeStamp: function timeStamp() {},
            profile: function profile() {},
            profileEnd: function profileEnd() {},
            context: function context() {},
            memory: function memory() {},
            markTimeline: function markTimeline() {},
            select: function select() {},
            timeline: function timeline() {},
            timelineEnd: function timelineEnd() {},
            takeHeapSnapshot: function takeHeapSnapshot() {},
            cd: function cd() {},
        };

        win.confirm = noop;
        win.prompt = noop;
        win.alert = noop;

        document.removeEventListener(Constants.KEY_UP, debugInterpreter);

        if (instance) {
            instance.emit(DebugMode.DISABLED);
        }
    }

    mix(DebugMode, EmitterMixin);

    win.DebugMode = DebugMode;
})(window);
