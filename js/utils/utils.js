const easings = {
    linear: (t) => {
        return t;
    },
    easeInSine: (t) => {
        return -1 * Math.cos(t * (Math.PI / 2)) + 1;
    },
    easeOutSine: (t) => {
        return Math.sin(t * (Math.PI / 2));
    },
    easeInOutSine: (t) => {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    },
    easeInQuad: (t) => {
        return t * t;
    },
    easeOutQuad: (t) => {
        return t * (2 - t);
    },
    easeInOutQuad: (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCirc: (t) => {
        return 1 - Math.sqrt(1 - Math.pow(t, 2));
    },
    easeOutCirc: (t) => {
        return Math.sqrt(1 - Math.pow(t - 1, 2));
    },
    easeInOutCirc: (t) => {
        return t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    },
    easeInCubic: (t) => {
        return t * t * t;
    },
    easeOutCubic: (t) => {
        return --t * t * t + 1;
    },
    easeInOutCubic: (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: (t) => {
        return t * t * t * t;
    },
    easeOutQuart: (t) => {
        return 1 - --t * t * t * t;
    },
    easeInOutQuart: (t) => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: (t) => {
        return t * t * t * t * t;
    },
    easeOutQuint: (t) => {
        return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: (t) => {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
    easeInExpo: (t) => {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    },
    easeOutExpo: (t) => {
        return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
    },
    easeInOutExpo: (t) => {
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    easeInBack: (t) => {
        return (1.70158 + 1) * t * t * t - 1.70158 * t * t;
    },
    easeOutBack: (t) => {
        return 1 + (1.70158 + 1) * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
    },
    easeInOutBack: (t) => {
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((1.70158 * 1.525 + 1) * 2 * t - 1.70158 * 1.525)) / 2
            : (Math.pow(2 * t - 2, 2) * ((1.70158 * 1.525 + 1) * (t * 2 - 2) + 1.70158 * 1.525) + 2) / 2;
    },
    easeInElastic: (t) => {
        return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
    },
    easeOutElastic: (t) => {
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
    },
    easeInOutElastic: (t) => {
        return t === 0
            ? 0
            : t === 1
            ? 1
            : t < 0.5
            ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2
            : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2 + 1;
    },
    easeInBounce: (t) => {
        return 1 - easings.easeOutBounce(1 - t);
    },
    easeOutBounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    },
    easeInOutBounce: (t) => {
        return t < 0.5 ? (1 - easings.easeOutBounce(1 - 2 * t)) / 2 : (1 + easings.easeOutBounce(2 * t - 1)) / 2;
    },
};

const touchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;

const events = {
    CLICK_TOUCH: touchDevice ? "click" : "click",
    DOWN_TOUCHSTART: touchDevice ? "touchstart" : "mousedown",
    MOVE_TOUCHMOVE: touchDevice ? "touchmove" : "mousemove",
    UP_TOUCHEND: touchDevice ? "touchend" : "mouseup",
    MOUSEENTER_TOUCHSTART: touchDevice ? "touchstart" : "mouseenter",
    MOUSELEAVE_TOUCHEND: touchDevice ? "touchend" : "mouseleave",
    MOUSEOVER_TOUCHSTART: touchDevice ? "touchstart" : "mouseover",
    MOUSEOUT_TOUCHEND: touchDevice ? "touchend" : "mouseout",
    SELECTION_CHANGE: "selectionchange",
    DROP: "drop",
    DRAG: "drag",
    DRAG_START: "dragstart",
    DRAG_END: "dragend",
    DRAG_OVER: "dragover",
    DRAG_ENTER: "dragenter",
    DRAG_LEAVE: "dragleave",
    PASTE: "paste",
    SCROLL: "scroll",
    CONTEXTMENU: "contextmenu",
    FOCUS: "focus",
    BLUR: "blur",
    INPUT: "input",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    KEYPRESS: "keypress",
    LOAD: "load",
    LOADED_METADATA: "loadedmetadata",
    CHANGE: "change",
    WHEEL: "wheel",
    ORIENTATION_CHANGE: "orientationchange", // !DEPRECATED - ScreenOrientation.onchange to use instead -> https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event
    RESIZE: "resize",
    BEFORE_UNLOAD: "beforeunload",
    UNLOAD: "unload",
    MESSAGE: "message",
    TRANSITION_START: "transitionstart",
    TRANSITION_END: "transitionend",
    TRANSITION_CANCEL: "transitioncancel",
    ANIMATION_START: "animationstart",
    ANIMATION_END: "animationend",
    ANIMATION_ITERATION: "animationiteration",
};

// NOTE According with https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const mimeTypes = {
    aac: "audio/aac",
    abw: "application/x-abiword",
    arc: "application/x-freearc",
    avif: "image/avif",
    avi: "video/x-msvideo",
    azw: "application/vnd.amazon.ebook",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    bz: "application/x-bzip",
    bz2: "application/x-bzip2",
    cda: "application/x-cdf",
    csh: "application/x-csh",
    css: "text/css",
    csv: "text/csv",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    eot: "application/vnd.ms-fontobject",
    epub: "application/epub+zip",
    gz: "application/gzip",
    gif: "image/gif",
    htm: "text/html",
    ico: "image/vnd.microsoft.icon",
    ics: "text/calendar",
    jar: "application/java-archive",
    jpeg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    jsonld: "application/ld+json",
    mid: "audio/midi",
    mjs: "text/javascript",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    mpkg: "application/vnd.apple.installer+xml",
    odp: "application/vnd.oasis.opendocument.presentation",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odt: "application/vnd.oasis.opendocument.text",
    oga: "audio/ogg",
    ogv: "video/ogg",
    ogx: "application/ogg",
    opus: "audio/opus",
    otf: "font/otf",
    png: "image/png",
    pdf: "application/pdf",
    php: "application/x-httpd-php",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    rar: "application/vnd.rar",
    rtf: "application/rtf",
    sh: "application/x-sh",
    svg: "image/svg+xml",
    tar: "application/x-tar",
    tif: "image/tiff",
    ts: "video/mp2t",
    ttf: "font/ttf",
    txt: "text/plain",
    vsd: "application/vnd.visio",
    wav: "audio/wav",
    weba: "audio/webm",
    webm: "video/webm",
    webp: "image/webp",
    woff: "font/woff",
    woff2: "font/woff2",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xml: "application/xml",
    xul: "application/vnd.mozilla.xul+xml",
    zip: "application/zip",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    "7z": "application/x-7z-compressed",
};

class Utils {
    /**
     * Easings constants
     * @returns {Object} Contains all animate built-in easings
     */
    static get EASINGS() {
        return easings;
    }

    /**
     * Events constants
     * @returns {Object} Contains all events constants depending on user's device type
     */
    static get EVENTS() {
        return events;
    }

    /**
     * Events constants
     * @returns {Object} Contains all events constants depending on user's device type
     */
    static get MIME_TYPES() {
        return mimeTypes;
    }

    /**
     * Dumb empty function
     *
     * @example
     * // ES6+ example
     * function test(a, b = Utils.noop){
     *      b();
     *      return a;
     * }
     *
     * test(1); // 1
     */
    static noop() {}

    /**
     * Check if a given value is defined
     *
     * @param {*} Value to check
     * @returns {Boolean}
     *
     * @example
     * Utils.isDefined("a"); // true
     * Utils.isDefined(""); // true
     * Utils.isDefined(0); // true
     * Utils.isDefined(false); // true
     * Utils.isDefined(NaN); // true
     * Utils.isDefined(function(){}); // true
     * Utils.isDefined(undefined); // false
     * Utils.isDefined(null); // false
     */

    static isDefined(value) {
        return value !== null && typeof value !== "undefined";
    }

    /**
     * Generate a unique random ID by following rfc4122 normalization
     *
     * @example
     * Utils.getUuidv4(); // '50f035f5-e212-4ed2-ac22-835852bc2a5b'
     */

    static getUuidv4() {
        if (crypto.randomUUID) {
            return crypto.randomUUID();
        } else {
            // NOTE Base on this : https://gist.github.com/jed/982883
            const baseStr = "10000000-1000-4000-8000-100000000000";

            return baseStr.replace(/[018]/g, (num) =>
                (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16)
            );
        }
    }

    /**
     * Generate a random ID without following rfc4122 normalization
     *
     * @example
     * Utils.getRandomID(); // 'gkv12kr5tiolhg64m0a579xuor1elbs'
     */

    static getRandomID() {
        const now = performance.now();
        const intPart = now | 0;

        return (
            intPart.toString(36) +
            Math.floor((now - intPart) * 1e7).toString(36) +
            Math.random().toString(36).substring(2)
        );
    }

    /**
     * Get a random value from an iterable value
     *
     * @param {any[]} List of values to get a random value from
     * @returns {any[]}
     *
     * @example
     * Utils.getRandomValue([1,2,3]); // 3
     * Utils.getRandomValue("123"); // "1"
     * Utils.getRandomValue(new Set([1,2,3])); // 2
     * Utils.getRandomValue(new Map([["ex1",1], ["ex2",2], ["ex3",3]])); // ['ex2', 2]
     */

    static getRandomValue(value) {
        if (value == null || typeof value[Symbol.iterator] !== "function") return null;

        const values = Array.from(value);
        const valuesLength = values.length;

        if (valuesLength === 0) return null;

        return values[Math.floor(Math.random() * valuesLength)];
    }

    /**
     * Get a random value from an iterable value
     *
     * @param {any[]} List of values to shuffle
     * @returns {any[]}
     *
     * @example
     * Utils.shuffleValue([1,2,3]); // [3,1,2]
     * Utils.shuffleValue("123"); // ["1","3","2]
     * Utils.shuffleValue(new Set([1,2,3])); // [2,3,1]
     * Utils.shuffleValue(new Map([["ex1",1], ["ex2",2], ["ex3",3]])); // ["ex3",3], ["ex1",1], ["ex2",2]
     */

    static shuffleValue(value) {
        if (value == null || typeof value[Symbol.iterator] !== "function") return null;

        const values = Array.from(value);

        for (let i = values.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]];
        }

        return values;
    }

    /**
     * Clamp limit a number to a given range
     * min / max values are commutable
     *
     * @param {Number} min Lowest value allowed (but can be highest)
     * @param {Number} num Number to limit into a given range
     * @param {Number} max Highest value allowed (but can be lowest)
     * @returns {Number} A number in the given min / max range
     *
     * @example
     * Utils.clamp(0, 5, 3); // 3
     * Utils.clamp(3, 5, 0); // 3
     * Utils.clamp(3, -1, 0); // 0
     * Utils.clamp(0, -1, 3); // 0
     */

    static clamp(min, num, max) {
        return Math.min(Math.max(num, Math.min(min, max)), Math.max(max, min));
    }

    /**
     * Get query parameters from a given context as an object
     *
     * @param  {Window} [context=window] - Targeted context to search query parameters, context must implement Location interface
     * @returns {String}
     *
     * @example
     * Utils.removeAccentsFrom("ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖòóôõöÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž"); // 'AAAAAAaaaaaaOOOOOOoooooEEEEeeeeCcIIIIiiiiUUUUuuuuNnSsYyyZz'
     */

    static getQueryParameters(context = window) {
        const strParameters = context.location.search;

        if (strParameters) {
            const parameters = new URLSearchParams(strParameters);
            const result = {};

            // NOTE I could use Object.fromEntries instead of code below but i prefered current implemented approach to maximizing compatibility
            // Example with Object.fromEntries for future implementation : Object.fromEntries(new URLSearchParams(context.location.search));
            for (const [key, value] of parameters) {
                result[key] = value;
            }

            return result;
        } else {
            return {};
        }
    }

    /**
     * Remove accents from a given string
     *
     * @param  {String} str - String with accented characters
     * @returns {String}
     *
     * @example
     * Utils.removeAccentsFrom("ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖòóôõöÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž"); // 'AAAAAAaaaaaaOOOOOOoooooEEEEeeeeCcIIIIiiiiUUUUuuuuNnSsYyyZz'
     */

    static removeAccentsFrom(str) {
        if (typeof str !== "string") {
            return "";
        }

        // NOTE Using Canonical Decomposition ("NFD") to remove accented part of the string
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize#using_normalize
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Get a HTMLElement from a given context and selector
     *
     * @param  {String | HTMLElement} [selector=""] - Value used to return matched element
     * @param  {HTMLElement} [container=document] - Context to search elements across the DOM
     * @returns {HTMLElement | null}
     *
     * @example
     * // Imagining that the DOM is :
     * // <html>
     * //     <head>
     * //     </head>
     * //     <body>
     * //         <div id="1"></div>
     * //         <div id="test">
     * //             <div id="2"></div>
     * //         </div>
     * //         <div></div>
     * //     </body>
     * // </html>
     *
     * const testDiv = document.querySelector("#test");
     *
     * Utils.getElementFrom(); // null
     * Utils.getElementFrom("img"); // null
     * Utils.getElementFrom(testDiv); // div#test
     * Utils.getElementFrom("div#test"); // div#test
     * Utils.getElementFrom("div"); // div#1
     * Utils.getElementFrom("div", testDiv); // div#2
     */

    static getElementFrom(selector = "", container = document) {
        let element = null;

        if (selector instanceof HTMLElement) {
            return selector;
        }

        try {
            element = container.querySelector(selector);
        } catch (error) {}

        return element;
    }

    /**
     * Get a HTMLElement from a given context and selector but in case of element is not found it return an empty HTMLElement
     *
     * @param  {String | HTMLElement} [selector=""] - Value used to return matched element
     * @param  {HTMLElement} [container=document] - Context to search elements across the DOM
     * @returns {HTMLElement}
     *
     * @example
     * // Imagining that the DOM is :
     * // <html>
     * //     <head>
     * //     </head>
     * //     <body>
     * //         <div id="1"></div>
     * //         <div id="test">
     * //             <div id="2"></div>
     * //         </div>
     * //         <div></div>
     * //     </body>
     * // </html>
     *
     * const testDiv = document.querySelector("#test");
     *
     * Utils.safeGetElementFrom(); // div
     * Utils.safeGetElementFrom("img"); // div
     * Utils.safeGetElementFrom(testDiv); // div#test
     * Utils.safeGetElementFrom("div#test"); // div#test
     * Utils.safeGetElementFrom("div"); // div#1
     * Utils.safeGetElementFrom("div", testDiv); // div#2
     */

    static safeGetElementFrom(selector = "", container = document) {
        const fallbackElement = document.createElement("div");

        let element = fallbackElement;

        if (selector instanceof HTMLElement) {
            return selector;
        }

        try {
            element = container.querySelector(selector);
        } catch (error) {}

        if (element instanceof HTMLElement === false) {
            return fallbackElement;
        }

        return element;
    }

    /**
     * Get a HTMLElement list from a given context and selector
     *
     * @param  {String | HTMLElement[] | NodeList} [selector=""] - Value used to return matched element
     * @param  {HTMLElement} [container=document] - Context to search elements across the DOM
     * @returns {HTMLElement[]}
     *
     * @example
     * // Imagining that the DOM is :
     * // <html>
     * //     <head>
     * //     </head>
     * //     <body>
     * //         <div></div>
     * //         <div id="test">
     * //             <div></div>
     * //         </div>
     * //         <div></div>
     * //     </body>
     * // </html>
     *
     * const testDiv = document.querySelector("#test");
     * const nodeListDiv = document.querySelectorAll("#test"); // NodeList [div#test]
     *
     * Utils.getElementsFrom(); // []
     * Utils.getElementsFrom("img"); // []
     * Utils.getElementsFrom(testDiv); // []
     * Utils.getElementsFrom("div"); // [div, div#test, div, div]
     * Utils.getElementsFrom("div", testDiv); // [div]
     * Utils.getElementsFrom([testDiv]); // [div#test]
     * Utils.getElementsFrom([testDiv, "a"]); // [div#test]
     * Utils.getElementsFrom(nodeListDiv); // [div#test]
     */

    static getElementsFrom(selector = "", container = document) {
        let elements = [];

        if (selector instanceof NodeList) {
            return Array.from(selector);
        }

        if (Array.isArray(selector)) {
            return selector.filter((value) => {
                return value instanceof HTMLElement;
            });
        }

        try {
            elements = container.querySelectorAll(selector);
            elements = Array.from(elements);
        } catch (error) {}

        return elements;
    }

    /**
     *
     * Function to copy a string into user clipboard
     *
     * @param  {String} str - String value to add to clipboard
     * @returns {Promise} Resolved when string has been copied into the user clipboard
     *
     * @example
     *   Utils.copyToClipboard("Test");
     */

    static copyToClipboard(str) {
        if (Utils.isDefined(navigator) && Utils.isDefined(navigator.clipboard)) {
            // NOTE Modern copy method
            return navigator.clipboard.writeText(str);
        }

        const textarea = document.createElement("textarea");

        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";

        textarea.value = str;
        textarea.setAttribute("readonly", "");

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        // NOTE Old deprecated copy method
        const copyStatus = document.execCommand("copy");

        textarea.removeAttribute("readonly");

        textarea.value = "";

        textarea.focus();
        textarea.select();

        // NOTE Old deprecated paste method
        document.execCommand("paste");

        const pasteValue = textarea.value;

        document.body.removeChild(textarea);

        return new Promise((resolve, reject) => {
            if (!copyStatus || pasteValue !== str) {
                reject("Failed to copy to clipboard");
            } else {
                resolve();
            }
        });
    }

    /**
     *
     * Function to get mouse position no matter if event is TouchEvent or MouseEvent
     *
     * @param  {TouchEvent|MouseEvent} event - String value to add to clipboard
     * @returns {Object} Object containing mouse coords
     *
     * @example
     *   Utils.getMousePosition(event);
     */

    static getMousePosition(event) {
        if (!event) {
            return false;
        }

        const foundEvent = event.changedTouches ? event.changedTouches[0] : event;

        return {
            pageX: foundEvent.pageX,
            pageY: foundEvent.pageY,
            clientX: foundEvent.clientX,
            clientY: foundEvent.clientY,
        };
    }

    /**
     *
     * Function to pad a number from start
     *
     * @param  {String|Number} value - Target value
     * @param  {Number} [padLength=2] - If value is lower than padLength, padValue will be added to reach the padLength
     * @param  {String} [padValue="0"] - Value to add while padding the given value
     * @returns {String} Padded string
     *
     * @example
     *   Utils.padStart("1", 3); // "001"
     *   Utils.padStart(1, 3); // "001"
     *   Utils.padStart("1", 3, "c"); // "cc1"
     *   Utils.padStart(1, 3, "c"); // "cc1"
     *   Utils.padStart("1", 3, "test"); // "te1"
     *   Utils.padStart(1, 3, "test"); // "te1"
     */

    static padStart(value, padLength = 2, padValue = "0") {
        if (typeof value === "string") {
            str.padStart(padLength, padValue);
        }

        if (typeof value === "number" && !Number.isNaN(value)) {
            return value.toString().padStart(padLength, padValue);
        }

        return "";
    }

    /**
     *
     * Function to pad a number from end
     *
     * @param  {String|Number} value - Target value
     * @param  {Number} [padLength=2] - If value is lower than padLength, padValue will be added to reach the padLength
     * @param  {String} [padValue="0"] - Value to add while padding the given value
     * @returns {String} Padded string
     *
     * @example
     *   Utils.padEnd("1", 3); // "100"
     *   Utils.padEnd(1, 3); // "100"
     *   Utils.padEnd("1", 3, "c"); // "1cc"
     *   Utils.padEnd(1, 3, "c"); // "1cc"
     *   Utils.padEnd("1", 3, "test"); // "1te"
     *   Utils.padEnd(1, 3, "test"); // "1te"
     */

    static padEnd(value, padLength = 2, padValue = "0") {
        if (typeof value === "string") {
            str.padEnd(padLength, padValue);
        }

        if (typeof value === "number" && !Number.isNaN(value)) {
            return value.toString().padEnd(padLength, padValue);
        }

        return "";
    }

    /**
     *
     * Check if browser allowing to play audio
     * Due new google chrome policies: https://developer.chrome.com/blog/autoplay/
     * Sometimes browser does not allow to play audio without user interaction
     *
     * @returns {Promise} Resolved when browser allows to play audio and rejected it if browser does not
     *
     * @example
     *   Utils.doesBrowserAllowToPlay().then(()=>{
     *      console.log("Can play audio without user interaction")
     *   }).catch(()=>{
     *      console.log("Can't play audio without user interaction")
     *   });
     *
     */

    static doesBrowserAllowToPlay() {
        return new Promise(function (resolve, reject) {
            const elem = document.createElement("audio");

            function play() {
                elem.play()
                    .then(function () {
                        resolve();
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            }

            elem.src =
                "data:audio/mpeg;base64,SUQzAwAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAAAAAAlwAAAAAtASxAAAASQAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAMQAAAlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjAbAAAAlwAAAAAAAD/4xjAbAAAAlwAAAAAAAD=";

            elem.load();

            if (elem.readyState >= 1) {
                play();
            } else {
                elem.addEventListener("canplaythrough", () => {
                    play();
                });
            }
        });
    }

    /**
     *
     * Append an element before another element
     *
     * @param  {HTMLElement} element - Element to add before
     * @param  {HTMLElement} target - Target on which the element must be placed before
     * @returns {HTMLElement} Returns the placed element
     *
     * @example
     *   Utils.insertBefore(element, target);
     *
     */

    static insertBefore(element, target) {
        return target.parentNode.insertBefore(element, target);
    }

    /**
     *
     * Append an element after another element
     *
     * @param  {HTMLElement} element - Element to add after
     * @param  {HTMLElement} target - Target on which the element must be placed after
     * @returns {HTMLElement} Returns the placed element
     *
     * @example
     *   Utils.insertAfter(element, target);
     *
     */

    static insertAfter(element, target) {
        const nextSibling = target.nextElementSibling;

        if (nextSibling) {
            return target.parentNode.insertBefore(element, nextSibling);
        } else {
            return target.parentNode.appendChild(element);
        }
    }

    /**
     *
     * Retrieve the real position of an element without considering transforms
     *
     * @param  {HTMLElement} element - Element to add after
     * @returns {HTMLElement} Returns real position of the element
     *
     * @example
     *   Utils.getPositionWithoutTransform(element);
     *
     */

    static getPositionWithoutTransform(element) {
        let x = 0;
        let y = 0;
        let currentElement = element;

        do {
            x += currentElement.offsetLeft + currentElement.clientLeft;
            y += currentElement.offsetTop + currentElement.clientTop;

            currentElement = currentElement.offsetParent;
        } while (currentElement);

        return {
            x,
            y,
        };
    }

    /**
     *
     * Add an element as first child of another element
     *
     * @param  {HTMLElement} element - Element to add as first child
     * @param  {HTMLElement} target - Target on which the element must be placed as first child
     * @returns {HTMLElement} Returns the placed element
     *
     * @example
     *   Utils.prependElement(element, target);
     *
     */

    static prependElement(element, target) {
        const firstChild = target.firstElementChild;

        if (firstChild) {
            return target.insertBefore(element, firstChild);
        } else {
            return target.appendChild(element);
        }
    }

    /**
     *
     * Add text to a HTML element using the smartest way
     *
     * @param  {HTMLElement} element - Element to add as first child
     * @param  {HTMLElement} text - Text to add to the element
     *
     * @example
     *   Utils.setText(element, text);
     *
     */

    static setText(element, text) {
        const brTagRegexPattern = "<\\s*br(?:\\s*\\/)?\\s*>|\\n";
        const htmlTagRegex = /<\/?(?!br(?:\s|\/|>))[^>]+>/i;

        if (htmlTagRegex.test(text)) {
            element.innerHTML = text;
            return;
        }

        const brCheckRegex = new RegExp(brTagRegexPattern, "i");

        if (brCheckRegex.test(text)) {
            const brReplaceRegex = new RegExp(brTagRegexPattern, "gi");
            element.innerText = text.replace(brReplaceRegex, "\n");
            return;
        }

        element.textContent = text;
    }

    /**
     *
     * Util to check if an element is visible or not and have an available bounding box
     *
     * @param  {HTMLElement} element - Target element to check visibility
     * @returns {Boolean} Returns if element is visible or not
     *
     * @example
     *   Utils.isVisible(element);
     *
     */

    static isVisible(element) {
        if (!element) {
            return false;
        }

        if (element.checkVisibility) {
            return element.checkVisibility();
        }

        return !!element.offsetParent;
    }

    /**
     *
     * Util to check if an element is visible for the user
     *
     * @param  {HTMLElement} element - Target element to check visibility
     * @returns {Boolean} Returns if element is visible or not
     *
     * @example
     *   Utils.isTotallyVisible(element);
     *
     */

    static isTotallyVisible(element) {
        if (!element) {
            return false;
        }

        if (element.checkVisibility) {
            return element.checkVisibility({
                checkVisibilityCSS: true,
                checkOpacity: true,
                contentVisibilityAutoHide: true,
            });
        }

        const domVisible = !!element.offsetParent;
        const elementStyle = getComputedStyle(element);
        const opacity = elementStyle.opacity !== "0";
        const contentVisibility = elementStyle.contentVisibility !== "hidden";
        const visibility = elementStyle.visibility !== "hidden";

        return domVisible && opacity && contentVisibility && visibility;
    }

    /**
     * Simple animation function
     * Built-in easings list available below (check out https://easings.net/ to visualize curves) :
     * linear, easeInSine, easeOutSine, easeInOutSine, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint, easeInExpo, easeOutExpo, easeInOutExpo, easeInCirc, easeOutCirc, easeInOutCirc, easeInBack, easeOutBack, easeInOutBack, easeInElastic, easeOutElastic, easeInOutElastic, easeInBounce, easeOutBounce, easeInOutBounce
     *
     * @param  {Object} values - Start values
     * @param  {Number} [values.exempleValue1] - An exemple of start value
     * @param  {Object} options - target values, update callback & complete callback
     * @param  {Number} [options.exempleValue1] - An exemple of end value
     * @param  {Number} [options.duration] - Duration of animation (in ms)
     * @param  {Function} [options.onUpdate] - Callback that fires when animation frame updates
     * @param  {String | Function} [options.ease] - easing name or easing function
     * @param  {Boolean} [options.autorun] - autorun or not the animation
     * @returns {Object} Object as : { run: Function, stop: Function, finished: Promise | Boolean }
     *
     * @example
     *   const element = document.getElementById('randomElement');
     *
     *   Utils.animate(
     *       { a: 0 },
     *       {
     *           a: 500,
     *           duration: 800,
     *           onUpdate: function (values) {
     *               element.style.transform = 'scaleX(' + values.a + ')';
     *           },
     *           ease: function (t) {
     *               return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
     *           },
     *       }
     *   ).then(function(){
     *       console.log('animation done !')
     *   })
     */

    static forEach(array, cb) {
        for (var i = 0; i < array.length; i++) {
            var value = cb(array[i], i, array);
            var valueIsDef = Utils.isDefined(value);

            if (valueIsDef && /forEach\.decrement/.test(value)) {
                i--;
            }

            if (valueIsDef && /forEach\.increment/.test(value)) {
                i++;
            }

            if (valueIsDef && /forEach\.continue/.test(value)) {
                continue;
            }

            if (valueIsDef && !/forEach\./.test(value)) {
                return value;
            }
        }
    }

    static isObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    static radToDeg(radians) {
        const degrees = (radians * 180) / Math.PI;
        return degrees > 0.0 ? degrees % 360 : (degrees + 360.0) % 360;
    }

    static degToRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    static getClosest(tab, goal) {
        const c = tab.reduce(function (prev, curr) {
            return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
        });
        return c;
    }

    static getMostFrequentElement(arr) {
        if (arr.length === 0) return null;

        const frequencyMap = new Map();
        let maxFrequency = 0;
        let mostFrequentElement = arr[0];

        for (const element of arr) {
            const frequency = (frequencyMap.get(element) || 0) + 1;
            frequencyMap.set(element, frequency);

            if (frequency > maxFrequency) {
                maxFrequency = frequency;
                mostFrequentElement = element;
            }
        }

        return mostFrequentElement;
    }

    static safeJsonParse(string, reviver) {
        try {
            const safeString = string
                .trim()
                .replace(/^(```)?(json)?/, "")
                .replace(/```$/, "")
                .replace(/^(\r\n|\n|\r)/, "")
                .replace(/(\r\n|\n|\r)$/, "");
            return JSON.parse(safeString, reviver);
        } catch (error) {
            return null;
        }
    }

    static animate(values, options) {
        const defaultOptions = {
            duration: 250,
            delay: 0,
            onUpdate: Utils.noop,
            onComplete: Utils.noop,
            ease: "linear",
            autorun: true,
        };

        const lerp = (source, target, amount) => {
            return source + amount * (target - source);
        };

        const opt = { ...defaultOptions, ...options };

        const duration = opt.duration;
        const onUpdate = opt.onUpdate;
        const onComplete = opt.onComplete;
        let ease = opt.ease;

        if (typeof ease === "string" && easings[opt.ease]) {
            ease = easings[opt.ease];
        } else if (typeof ease === "function") {
            ease = opt.ease;
        } else {
            ease = easings.linear;
        }

        const animationMap = Object.keys(values).reduce((map, key) => {
            const from = values[key];
            const to = opt[key];
            const fromIsValidNum = typeof from === "number" && !Number.isNaN(from);
            const toIsValidNum = typeof to === "number" && !Number.isNaN(to);

            if (fromIsValidNum && toIsValidNum) {
                map[key] = [from, to];
            }

            return map;
        }, {});

        const animationControllers = {};
        const animationKeys = Object.keys(animationMap);
        let delayTimerId = -1;
        let rafId = -1;
        let animationRunning = false;

        animationControllers.run = () => {
            animationControllers.finished = new Promise((resolve) => {
                let startTime;

                const tick = () => {
                    if (!animationRunning) {
                        resolve(values, true);
                    }

                    const now = Date.now();

                    if (!startTime) {
                        startTime = now;
                    }

                    const baseTime = Utils.clamp(0, (now - startTime) / duration, 1);
                    const time = duration > 0 ? baseTime : 1;

                    animationKeys.forEach((key) => {
                        const map = animationMap[key];
                        const from = map[0];
                        const to = map[1];
                        const progress = ease(time, from, to, duration);

                        values[key] = lerp(from, to, progress);
                    });

                    if (time >= 1) {
                        animationKeys.forEach((key) => {
                            return (values[key] = opt[key]);
                        });

                        onUpdate(values, time);
                        onComplete(values, time);
                        resolve(values);
                    } else {
                        onUpdate(values, time);
                        rafId = requestAnimationFrame(tick);
                    }
                };

                if (opt.delay > 0) {
                    setTimeout(() => {
                        animationRunning = true;
                        tick();
                    }, opt.delay);
                } else {
                    animationRunning = true;
                    tick();
                }
            });

            return animationControllers.finished;
        };

        animationControllers.stop = () => {
            clearTimeout(delayTimerId);
            cancelAnimationFrame(rafId);
            animationRunning = false;
        };

        if (opt.autorun) {
            animationControllers.run();
        } else {
            animationControllers.finished = false;
        }

        return animationControllers;
    }
}

export default Utils;

export const noop = Utils.noop;
export const EASINGS = Utils.EASINGS;
export const EVENTS = Utils.EVENTS;
export const MIME_TYPES = Utils.MIME_TYPES;
export const isDefined = Utils.isDefined;
export const forEach = Utils.forEach;
export const getUuidv4 = Utils.getUuidv4;
export const getRandomID = Utils.getRandomID;
export const getRandomValue = Utils.getRandomValue;
export const shuffleValue = Utils.shuffleValue;
export const clamp = Utils.clamp;
export const getQueryParameters = Utils.getQueryParameters;
export const removeAccentsFrom = Utils.removeAccentsFrom;
export const getElementFrom = Utils.getElementFrom;
export const safeGetElementFrom = Utils.safeGetElementFrom;
export const getElementsFrom = Utils.getElementsFrom;
export const copyToClipboard = Utils.copyToClipboard;
export const getMousePosition = Utils.getMousePosition;
export const padStart = Utils.padStart;
export const padEnd = Utils.padEnd;
export const doesBrowserAllowToPlay = Utils.doesBrowserAllowToPlay;
export const insertBefore = Utils.insertBefore;
export const insertAfter = Utils.insertAfter;
export const prependElement = Utils.prependElement;
export const getPositionWithoutTransform = Utils.getPositionWithoutTransform;
export const setText = Utils.setText;
export const isVisible = Utils.isVisible;
export const isTotallyVisible = Utils.isTotallyVisible;
export const animate = Utils.animate;
export const isObject = Utils.isObject;
export const degToRad = Utils.degToRad;
export const radToDeg = Utils.radToDeg;
export const getClosest = Utils.getClosest;
export const getMostFrequentElement = Utils.getMostFrequentElement;
export const safeJsonParse = Utils.safeJsonParse;
