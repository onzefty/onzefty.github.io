import { EVENTS, getElementFrom, safeGetElementFrom } from "../utils/utils.js";

export default class Toast {
    constructor(options) {
        this.options = {
            container: document.body,
            wrapperClasses: [],
            message: "",
            closable: true,
            closeDelay: 5000,
            closeAnimationDelay: 1000,
            status: null, // className
            statusMessage: "",
            limit: -1,
            ...options,
        };

        this.container = this.options.container || document.body;
        this.element = null;
        this.timerId = -1;

        this.boundHandleClose = this.close.bind(this);

        this.init();
    }

    init() {
        if (!this.container) {
            return false;
        }

        if (this.options.wrapperClasses.length) {
            for (let i = 0; i < this.options.wrapperClasses.length; i++) {
                const className = this.options.wrapperClasses[i];
                const wrapper = getElementFrom(`.toast-wrapper.${className}`, this.container);

                if (wrapper) {
                    this.wrapper = wrapper;
                    break;
                }
            }
        } else {
            this.wrapper = getElementFrom('[class="toast-wrapper"]', this.container);
        }

        if (this.wrapper) {
            const limit = parseInt(this.wrapper.dataset.limit);

            if (!isNaN(limit)) {
                const openChilds = Array.from(this.wrapper.children).filter((child) =>
                    child.classList.contains("open")
                );

                if (openChilds.length >= limit) {
                    return;
                }
            }
        }

        this.create();
        this.open();
    }

    create() {
        if (!this.wrapper) {
            this.wrapper = document.createElement("div");
            this.wrapper.classList.add("toast-wrapper");

            if (this.options.limit > 0) {
                this.wrapper.dataset.limit = this.options.limit;
            }

            if (this.options.wrapperClasses.length) {
                this.wrapper.classList.add(...this.options.wrapperClasses);
            }

            this.container.appendChild(this.wrapper);
        }

        this.element = document.createElement("div");
        this.element.classList.add("toast");

        if (this.options.status) {
            const status = document.createElement("span");
            const statusMessage = this.options.statusMessage;

            status.classList.add("toast-status", this.options.status);

            if (typeof statusMessage === "string" && statusMessage.trim()) {
                status.innerHTML = statusMessage;
            }

            this.element.appendChild(status);
        }

        const message = document.createElement("span");
        const messageStr = this.options.message;

        message.classList.add("toast-message");

        if (typeof messageStr === "string" && messageStr.trim()) {
            message.innerHTML = this.options.message;
        }

        this.element.appendChild(message);

        if (this.options.closable) {
            const close = document.createElement("span");

            close.classList.add("toast-close");
            close.textContent = "×";

            close.addEventListener(EVENTS.CLICK_TOUCH, this.boundHandleClose);

            this.element.appendChild(close);
        }

        this.wrapper.appendChild(this.element);

        if (this.options.closeDelay !== false) {
            this.timerId = setTimeout(() => {
                this.close();
            }, this.options.closeDelay);
        }
    }

    open() {
        setTimeout(() => {
            this.element.classList.add("open");
        }, 50);
    }

    close() {
        clearTimeout(this.timerId);

        this.element.classList.remove("open");

        setTimeout(() => {
            this.element.remove();

            if (!this.wrapper.children.length) {
                this.wrapper.remove();
            }
        }, this.options.closeAnimationDelay);
    }
}
