// Dependencies : Renderer, WindowResize

(function (win) {
    function InterfaceResizer(element) {
        this.container = getElFromValue(element);

        this.data = {
            bounding: this.container.getBoundingClientRect(),
            isResize: true,
            resize: {
                scale: 1,
                top: 0,
                left: 0,
            },
        };

        this.renderer = new Renderer();
        this.windowResize = new WindowResize();
        this.boundResize = this.resize.bind(this);

        this.init();
        this.render();
    }

    InterfaceResizer.prototype.init = function () {
        this.windowResize.on(WindowResize.CHANGED, this.boundResize);

        this.renderer.add({
            fct: this.render,
            context: this,
        });
    };

    InterfaceResizer.prototype.render = function () {
        if (this.data.isResize === true) {
            var width = this.data.bounding.width;
            var height = this.data.bounding.height;
            var target = this.container;
            var htmlElement = document.querySelector('html');

            var scale = Math.min(
                htmlElement.clientWidth / width,
                htmlElement.clientHeight / height
            );

            var newLeftPos = Math.abs(Math.floor((width * scale - htmlElement.clientWidth) / 2));
            var newTopPos = Math.abs(Math.floor((height * scale - htmlElement.clientHeight) / 2));

            setVendor(target, 'transformOrigin', '0 0');
            setVendor(target, 'transform', 'scale(' + scale + ')');

            target.style.position = 'absolute';
            target.style.top = newTopPos + 'px';
            target.style.left = newLeftPos + 'px';

            this.data.resize.scale = scale;
            this.data.resize.top = newTopPos;
            this.data.resize.left = newLeftPos;

            this.data.isResize = false;
        }
    };

    InterfaceResizer.prototype.applyResize = function (coords) {
        var x = (coords.x - this.data.resize.left) / this.data.resize.scale;
        var y = (coords.y - this.data.resize.top) / this.data.resize.scale;

        return {
            x: x,
            y: y,
        };
    };

    InterfaceResizer.prototype.resize = function () {
        this.data.isResize = true;
    };

    function setVendor(element, property, value) {
        var prop = property[0].toUpperCase() + property.slice(1);
        element.style[property] = value;
        element.style['webkit' + prop] = value;
        element.style['moz' + prop] = value;
        element.style['ms' + prop] = value;
        element.style['o' + prop] = value;
    }

    win.InterfaceResizer = InterfaceResizer;
})(window);
