import { getElementsFrom } from "../utils/utils.js";

let instance;

export default class EventPrevention {
    constructor() {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.observer = null;

        this.boundHandleContextmenu = this.handleContextmenu.bind(this);
        this.boundHandleKeydown = this.handleKeydown.bind(this);
        this.boundHandleDragStart = this.handleDragStart.bind(this);

        this.init();
        this.observeDOMChanges();
    }

    init() {
        window.addEventListener("keydown", this.boundHandleKeydown);
        window.addEventListener("contextmenu", this.boundHandleContextmenu);

        this.applyDragPrevention(getElementsFrom("img"));
    }

    observeDOMChanges() {
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.tagName === "IMG") {
                            this.applyDragPrevention([node]);
                        } else if (node.nodeType === 1 && node.querySelectorAll) {
                            this.applyDragPrevention(getElementsFrom("img", node));
                        }
                    });
                }

                if (mutation.type === "attributes" && mutation.attributeName === "disabled") {
                    const target = mutation.target;

                    if (target.hasAttribute("disabled")) {
                        this.applyDragPrevention([target]);
                    } else {
                        this.removeDragPrevention([target]);
                    }
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true,
        });
    }

    applyDragPrevention(images) {
        images.forEach((image) => {
            image.addEventListener("dragstart", this.boundHandleDragStart);
            image.setAttribute("draggable", false);
        });
    }

    removeDragPrevention(images) {
        images.forEach((image) => {
            image.removeEventListener("dragstart", this.boundHandleDragStart);
            image.removeAttribute("draggable");
        });
    }

    handleDragStart(event) {
        event.preventDefault();
    }

    // No context menu in formations
    handleContextmenu(event) {
        event.preventDefault();
    }

    // Prevent user to navigate back while doing formation
    handleKeydown(event) {
        const { target, key } = event;

        if (key == "Backspace" && !target.matches('input,[contenteditable="true"],textarea')) {
            event.preventDefault();
        }
    }

    destroy() {
        window.removeEventListener("keydown", this.boundHandleKeydown);
        window.removeEventListener("contextmenu", this.boundHandleContextmenu);

        this.removeDragPrevention(getElementsFrom("img"));
    }
}
