(function (win) {
    var instance = null;

    function Renderer(autoLaunch) {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.renders = [];

        this.data = {
            started: false,
            id: 0,
        };

        var auto = autoLaunch === false ? autoLaunch : true;

        this.boundUpdate = this.update.bind(this);

        if (auto) {
            this.launch();
        }
    }

    Renderer.prototype.launch = function () {
        if (!this.data.started) {
            this.update();
            this.data.started = true;
        }
    };

    Renderer.prototype.finish = function () {
        if (this.data.started) {
            cancelAnimationFrame(this.data.id);
            this.data.started = false;
        }
    };

    Renderer.prototype.update = function () {
        forEach(this.renders, function (renderData) {
            renderData.fct.call(renderData.context);
        });

        this.data.id = requestAnimationFrame(this.boundUpdate);
    };

    Renderer.prototype.add = function (data) {
        var defaultData = {
            fct: noop,
            context: this,
        };

        var renderData = Object.assign({}, defaultData, data);

        if (renderData.fct !== noop) {
            this.renders.push(renderData);
        }
    };

    Renderer.prototype.remove = function (fct) {
        forEach(this.renders, function (renderData, index, renders) {
            if (renderData.fct === fct) {
                renders.splice(index, 1);
                return 'forEach.decrement';
            }
        });
    };

    Renderer.prototype.clear = function () {
        this.renders.length = 0;
    };

    mix(Renderer, EmitterMixin);

    win.Renderer = Renderer;
})(window);
