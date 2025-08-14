var Constants = (function () {
    return {
        CLICK_TOUCH: 'click touch',
        DOWN_TOUCHSTART: 'mousedown touchstart',
        MOVE_TOUCHMOVE: 'mousemove touchmove',
        UP_TOUCHEND: 'mouseup touchend',
        WHEEL: 'wheel',
        TRANSITION_END: 'transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd',
        ANIMATION_END: 'animationend webkitAnimationEnd oanimationend oAnimationEnd MSAnimationEnd',

        // statuts utilisé pour le suivi/scorm
        STATUS_NOT_ATTEMPTED: 'na',
        STATUS_INCOMPLETE: 'i',
        STATUS_COMPLETED: 'c',
        STATUS_PASSED: 'p',
        STATUS_FAILED: 'f',

        // path relatif au dossier racine (window.rootPath)
        IFRAME_RESIZER: 'common/interface/js/lib/iframeresizer.contentwindow.js',

        READY: 'ofp-ready',

        NONE: 'none',
        NORMAL: 'normal',
        CRITICAL: 'critical'
    };
})();
