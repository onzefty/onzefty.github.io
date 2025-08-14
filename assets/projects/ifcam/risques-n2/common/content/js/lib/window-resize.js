(function (win) {
    var instance = null;

    var STATICS = {
        CHANGE: {
            get: function () {
                return 'WindowResize.change';
            },
        },
    };

    setStatic(STATICS, WindowResize);

    function WindowResize() {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.boundHandleResize = this.handleResize.bind(this);

        this.addListeners();
    }

    WindowResize.prototype.addListeners = function () {
        window.addEventListener('resize', this.boundHandleResize);
    };

    WindowResize.prototype.removeListeners = function () {
        window.removeEventListener('resize', this.boundHandleResize);
    };

    WindowResize.prototype.handleResize = function (event) {
        this.emit(WindowResize.CHANGED, {
            originalEvent: event,
        });
    };

    WindowResize.prototype.destroy = function () {
        this.removeListeners();
        instance = null;
    };

    mix(WindowResize, EmitterMixin);

    win.WindowResize = WindowResize;
})(window);
