import {
    getEvent,
    getIntersection,
    globalToLocal,
    hitTestElements,
} from "../lib/dom.js";
import { EVENTS } from "../lib/utils.js";

export default class DragDropManager {
    current = null;
    drags = [];
    drops = [];
 
    constructor(options) {
        this.options = {
            onDown: () => {},
            onMove: () => {},
            onUp: () => {},
            ...options
        }
    }

    addDrag = (element) => {
        if (!this.drags.includes(element)) {
            this.drags.push(element);
            element.ondragstart = () => false;
            element.addEventListener(EVENTS.DOWN_TOUCHSTART, this.handleDown);
        }
        return this;
    };

    addDrop = (element) => {
        if (!this.drops.includes(element)) {
            this.drops.push(element);
        }
        return this;
    };

    handleDown = (e) => {
        const { target: element, clientY: top, clientX: left } = getEvent(e);
        const globalPoint = { top, left };

        if (element && !this.current) {
            // const parentPoint = offset(target.parentNode);
            const localPoint = globalToLocal(element, globalPoint);

            this.current = {
                element,
                localPoint,
            };

            window.addEventListener(EVENTS.MOVE_TOUCHMOVE, this.handleMove);
            window.addEventListener(EVENTS.UP_TOUCHEND, this.handleUp);

            element.classList.add("dragged");
            this.options.onDown(element)
        }
        return this;
    };

    handleMove = (e) => window.requestAnimationFrame(() => {
        if (this.current) {
            const { clientY: top, clientX: left } = getEvent(e);
            const { element, localPoint } = this.current;
            const currentPoint = windowConstraint(element, {
                top: top - localPoint.top,
                left: left - localPoint.left,
            });

            element.style.top = `${currentPoint.top}px`;
            element.style.left = `${currentPoint.left}px`;

            this.current.drop = null

            this.drops.forEach((drop) => {
                const hit = hitTestElements(element, drop);
                drop.classList[hit ? "add" : "remove"]("droppable");

                const intersection = getIntersection(element, drop);

                if(intersection){
                    this.current.drop = drop
                }
            });
            this.options.onMove()
        }
    });

    handleUp = () => {
        console.log('🚀 :: DragDropManager :: handleUp:');
        if (this.current) {
            const { element, drop } = this.current;
            element.classList.remove("dragged");
            if(drop){
                this.options.onUp(element,drop)
                
            } else {
                element.style.left = ""
                element.style.top = ""
            }
            
        }

        this.drops.forEach((drop) => {
            drop.classList.remove("droppable");
        });

        window.removeEventListener(EVENTS.MOVE_TOUCHMOVE, this.handleMove);
        window.removeEventListener(EVENTS.UP_TOUCHEND, this.handleUp);
        this.current = null;
    };
    
}

function windowConstraint(element, point) {
    return {
        top: Math.min(Math.max(0, point.top), window.innerHeight - element.offsetHeight),
        left: Math.min(Math.max(0, point.left), window.innerWidth - element.offsetWidth),
    };
}