import WindowResize from "../resizer/window-resize.js";
import Renderer from "../render/renderer.js";
import { getElementFrom } from "../utils/utils.js";

class InterfaceResizer {
    constructor(element) {
        this.container = getElementFrom(element);

        if (!this.container || this.container.classList.contains("no-resize")) {
            return;
        }

        this.data = {
            bounding: null,
            resize: {
                scale: 1,
                top: 0,
                left: 0,
            },
        };

        this.windowResize = new WindowResize();
        this.renderer = new Renderer();

        this.boundResize = this.resize.bind(this);

        this.init();
        this.render();
    }

    init() {
        this.windowResize.on(WindowResize.CHANGED, this.boundResize);

        this.data.resizeRender = this.renderer.add({
            fct: this.render,
            context: this,
            active: false,
        });

        this.setBounding();
    }

    setBounding() {
        if (this.data.bounding) {
            return true;
        }

        if (this.container.offsetParent || this.container.parentNode) {
            this.data.bounding = this.container.getBoundingClientRect();
            return true;
        }

        return false;
    }

    render() {
        if (!this.setBounding()) {
            return false;
        }

        const width = this.data.bounding.width;
        const height = this.data.bounding.height;
        const target = this.container;
        const htmlElement = document.querySelector("html");

        const scale = Math.min(htmlElement.clientWidth / width, htmlElement.clientHeight / height);

        const newLeftPos = Math.abs(Math.floor((width * scale - htmlElement.clientWidth) / 2));
        const newTopPos = Math.abs(Math.floor((height * scale - htmlElement.clientHeight) / 2));

        target.style.transformOrigin = "0 0";
        target.style.transform = "scale(" + scale + ")";
        target.style.position = "absolute";
        target.style.top = newTopPos + "px";
        target.style.left = newLeftPos + "px";

        this.data.resize.scale = scale;
        this.data.resize.top = newTopPos;
        this.data.resize.left = newLeftPos;

        this.data.resizeRender.active = false;
    }

    applyResize(coords) {
        const x = (coords.x - this.data.resize.left) / this.data.resize.scale;
        const y = (coords.y - this.data.resize.top) / this.data.resize.scale;

        return {
            x: x,
            y: y,
        };
    }

    resize() {
        this.data.resizeRender.active = true;
    }
}

export default InterfaceResizer;
