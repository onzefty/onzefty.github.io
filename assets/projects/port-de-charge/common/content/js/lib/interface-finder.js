(function (win) {
    var STATICS = {
        searchOfp: {
            get: function () {
                return function () {
                    return (findUpperWindowOwnerOf('ofp', window) || {}).ofp;
                };
            },
        },
        searchStandard: {
            get: function () {
                return function () {
                    return (findWindowOwnerOf('standard', window) || {}).standard;
                };
            },
        },
        searchUtility: {
            get: function () {
                return function () {
                    return (findUpperWindowOwnerOf('Utility', window) || {}).Utility;
                };
            },
        },
        searchConstants: {
            get: function () {
                return function () {
                    return (findUpperWindowOwnerOf('Constants', window) || {}).Constants;
                };
            },
        },
        searchOfpWindow: {
            get: function () {
                return function () {
                    return (findUpperWindowOwnerOf('ofp', window) || {});
                };
            },
        },
        searchStandardWindow: {
            get: function () {
                return function () {
                    return (findWindowOwnerOf('standard', window) || {});
                };
            },
        },
    };

    setStatic(STATICS, InterfaceFinder);

    function InterfaceFinder() {}

    // Renvoyer le 1er niveau trouvé ou null
    function findWindowOwnerOf(property, win) {
        var currentWindow = win || window;
        var isDefined = function (elem) {
            return elem && typeof elem !== 'undefined';
        };
        var ownerWindow = isDefined(currentWindow[property]) ? currentWindow : null;
        while (!ownerWindow && currentWindow.parent && currentWindow.parent != currentWindow) {
            currentWindow = currentWindow.parent;
            try {
                if (isDefined(currentWindow[property])) {
                    ownerWindow = currentWindow;
                }
            } catch (error) {}
        }
        return ownerWindow;
    }

    // Renvoyer le niveau le plus haut ou null
    function findUpperWindowOwnerOf(property, win) {
        var currentWindow = win || window;
        var isDefined = function (elem) {
            return elem && typeof elem !== 'undefined';
        };
        var upper = isDefined(currentWindow[property]) ? currentWindow : null;
        while (currentWindow.parent && currentWindow.parent !== currentWindow) {
            currentWindow = currentWindow.parent;
            try {
                if (isDefined(currentWindow[property])) {
                    upper = currentWindow;
                }
            } catch (error) {}
        }
        return upper;
    }

    win.InterfaceFinder = InterfaceFinder;
})(window);
