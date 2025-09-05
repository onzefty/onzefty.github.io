// Add trace in case of variable with same name is created into window after a find
function trace(property) {
    if (!window.finderTrace) {
        window.finderTrace = {};
    }

    window.finderTrace[property] = true;
}

function search(property, win, mode) {
    const modeValue = mode || "owner";
    const searchFunction = modeValue === "upper" ? findUpperWindowOwnerOf : findWindowOwnerOf;

    return searchFunction(property, win);
}

function isValidProperty(win, property) {
    const trace = win.finderTrace && win.finderTrace[property];
    const propertyValue = win[property];

    if (!trace && typeof propertyValue !== "undefined") {
        return true;
    }

    return false;
}

// Renvoyer le 1er niveau trouvé ou null
function findWindowOwnerOf(property, win) {
    let currentWindow = win || window;
    let ownerWindow = isValidProperty(currentWindow, property) ? currentWindow : null;

    while (!ownerWindow && currentWindow.parent && currentWindow.parent != currentWindow) {
        currentWindow = currentWindow.parent;
        try {
            if (isValidProperty(currentWindow, property)) {
                ownerWindow = currentWindow;
            }
        } catch (error) {}
    }

    if (ownerWindow) {
        trace(property, win);
    }

    return ownerWindow;
}

// Renvoyer le niveau le plus haut ou null
function findUpperWindowOwnerOf(property, win) {
    let currentWindow = win || window;
    let upper = isValidProperty(currentWindow, property) ? currentWindow : null;

    while (currentWindow.parent && currentWindow.parent !== currentWindow) {
        currentWindow = currentWindow.parent;
        try {
            if (isValidProperty(currentWindow, property)) {
                upper = currentWindow;
            }
        } catch (error) {}
    }

    if (upper) {
        trace(property, win);
    }

    return upper;
}

class InterfaceFinder {
    static get searchOfp() {
        return (mode) => {
            return (search("ofp", window, mode) || {}).ofp;
        };
    }

    static get searchStandard() {
        return (mode) => {
            return (search("standard", window, mode) || {}).standard;
        };
    }

    static get searchUtility() {
        return (mode) => {
            return (search("Utility", window, mode) || {}).Utility;
        };
    }

    static get searchConstants() {
        return (mode) => {
            return (search("Constants", window, mode) || {}).Constants;
        };
    }

    static get searchOfpWindow() {
        return (mode) => {
            return search("ofp", window, mode) || {};
        };
    }

    static get searchStandardWindow() {
        return (mode) => {
            return search("standard", window, mode) || {};
        };
    }
}

export default InterfaceFinder;
