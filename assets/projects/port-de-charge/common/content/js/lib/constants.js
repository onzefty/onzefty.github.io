Object.defineProperty(window, 'Constants', {
    get: function () {
        var touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

        return {
            CLICK_TOUCH: touchDevice ? 'touchend' : 'click',
            DOWN_TOUCHSTART: touchDevice ? 'touchstart' : 'mousedown',
            MOVE_TOUCHMOVE: touchDevice ? 'touchmove' : 'mousemove',
            UP_TOUCHEND: touchDevice ? 'touchend' : 'mouseup',
            MOUSEENTER_TOUCHSTART: touchDevice ? 'touchstart' : 'mouseenter',
            MOUSELEAVE_TOUCHEND: touchDevice ? 'touchend' : 'mouseleave',
            CONTEXTMENU: 'contextmenu',
            FOCUS: 'focus',
            BLUR: 'blur',
            TEXT_INPUT: 'input',
            KEY_DOWN: 'keydown',
            KEY_UP: 'keyup',
            LOAD: 'load',
            LOADED_META_DATA: 'loadedmetadata',
            CHANGE: 'change',
            WHEEL: 'wheel',
            ORIENTATION_CHANGE: 'orientationchange',
            RESIZE: 'resize',
            BEFORE_UNLOAD: 'beforeunload',
            UNLOAD: 'unload',
            TRANSITION_START:
                'transitionstart webkitTransitionStart otransitionstart oTransitionStart msTransitionStart',
            TRANSITION_END:
                'transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
            EASINGS: {
                linear: function (t) {
                    return t;
                },
                easeInSine: function (t) {
                    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
                },
                easeOutSine: function (t) {
                    return Math.sin(t * (Math.PI / 2));
                },
                easeInOutSine: function (t) {
                    return -0.5 * (Math.cos(Math.PI * t) - 1);
                },
                easeInQuad: function (t) {
                    return t * t;
                },
                easeOutQuad: function (t) {
                    return t * (2 - t);
                },
                easeInOutQuad: function (t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },
                easeInCubic: function (t) {
                    return t * t * t;
                },
                easeOutCubic: function (t) {
                    return --t * t * t + 1;
                },
                easeInOutCubic: function (t) {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                },
                easeInQuart: function (t) {
                    return t * t * t * t;
                },
                easeOutQuart: function (t) {
                    return 1 - --t * t * t * t;
                },
                easeInOutQuart: function (t) {
                    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
                },
                easeInQuint: function (t) {
                    return t * t * t * t * t;
                },
                easeOutQuint: function (t) {
                    return 1 + --t * t * t * t * t;
                },
                easeInOutQuint: function (t) {
                    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
                },
                easeInExpo: function (t) {
                    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
                },
                easeOutExpo: function (t) {
                    return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
                },
                easeInOutExpo: function (t) {
                    return t === 0
                        ? 0
                        : t === 1
                        ? 1
                        : t < 0.5
                        ? Math.pow(2, 20 * t - 10) / 2
                        : (2 - Math.pow(2, -20 * t + 10)) / 2;
                },
                easeInBack: function (t) {
                    return (1.70158 + 1) * t * t * t - 1.70158 * t * t;
                },
                easeOutBack: function (t) {
                    return 1 + (1.70158 + 1) * pow(t - 1, 3) + 1.70158 * pow(t - 1, 2);
                },
                easeInOutBack: function (t) {
                    return t < 0.5
                        ? (pow(2 * t, 2) * ((1.70158 * 1.525 + 1) * 2 * t - 1.70158 * 1.525)) / 2
                        : (pow(2 * t - 2, 2) *
                              ((1.70158 * 1.525 + 1) * (t * 2 - 2) + 1.70158 * 1.525) +
                              2) /
                              2;
                },
            },
        };
    },
});
