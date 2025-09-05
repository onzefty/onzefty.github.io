import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS } from "../lib/utils.js";
import { overLap } from "../lib/dom.js";

const getClients = (e) => {
    return {
        x:e.touches ? e.touches[0].clientX : e.clientX,
        y:e.touches ? e.touches[0].clientY : e.clientY,
    }
}

export default class DragDrop extends EmitterMixin {
    static get END(){
        return 'DragDrop.end';
    }
    static get ATTEMPT(){
        return 'DragDrop.attempt';
    }
    static get UP(){
        return 'DragDrop.up';
    }
    static get UP_NOMOVE(){
        return 'DragDrop.upNoMove';
    }
    static get RESET(){
        return 'DragDrop.reset';
    }
    static get SUCCESSION(){
        return 'DragDrop.succession';
    }
    static get OVERLAYDROP(){
        return 'DragDrop.overlayDrop';
    }
    static get OVERLAYDROPNOT(){
        return 'DragDrop.overlayDropNot';
    }
    static get DROPPED(){
        return 'DragDrop.dropped';
    }
    static get UNDROPPED(){
        return 'DragDrop.unDropped';
    }
    static get RIGHT(){
        return 'DragDrop.right'
    }
    static get WRONG(){
        return 'DragDrop.wrong'
    }
    constructor(props={}){
        super();
        this.options = {
            drags: [],
            drops: [],
            dragDatas: [],
            dropDatas: [],
            positionsReceiver: document,
            eventsReceiver: document,
            btValidate: null,
            wrongAttemptEl: null,
            btClass: "inactive",
            dropAxis: "center",
            dropHostRange: 1,
            dropHostFull: true,
            dropLockable: false,
            dropOverlap: 25,
            dropGap: 5,
            attempts: 1,
            hunting: false,
            steps: false,
            succession: false,
            once: false,
            ...props
        }

        this.drags = [];
        this.drops = [];
        this.from = null;
        this.dragSelected = null;
        this.currentAttempt = 1;
        this.setAttempt;
        this.disposed = false;
        this.success = false;
        this.current = 1;
        this.currentDrag;
        this.dragsTotal;
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleValidate = this.validate.bind(this);
        this.handleCorrection = this.correction.bind(this);

        this.init()
    }

    set enabled(boolean){
        const {positionsReceiver} = this.options;
        if(typeof boolean === "boolean"){
            if(boolean === true){
                positionsReceiver.addEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove,{passive:true});
                positionsReceiver.addEventListener(EVENTS.UP_TOUCHEND,this.handleUp,{passive:true});
            } else {
                positionsReceiver.removeEventListener(EVENTS.MOVE_TOUCHMOVE,this.handleMove);
                positionsReceiver.removeEventListener(EVENTS.UP_TOUCHEND,this.handleUp);
            }
        }
    }

    onDown(drag, e) {
        drag.isGrabbed();
        this.from = getClients(e);
        this.dragSelected = drag;
        const drop = drag.hasDrop;
        if (drop) {
            drop.unhost(drag);
            //Replacement des drags suivants si besoin
            drop.reorder(drag);
            drag.placed = 0;
            drag.hasDrop = null;
            drag.element.classList.remove("dropped");
        }
        this.enabled = true;
    }

    onMove = (e) => window.requestAnimationFrame(() => {
        if(this.from){
            
            const to = getClients(e);
            this.dragSelected.place({
                left: this.dragSelected.anchors.left + (to.x - this.from.x),
                top: this.dragSelected.anchors.top + (to.y - this.from.y),
            });
            const drop = this.checkOnDrop();
            let dropNum = -1;
            if (drop) {
                //drop.cbOverlay();
                dropNum = drop.num;
            }
            for (let d = 1; d <= this.drops.length; d++) {
                const dropO = this.drops[d - 1];
                if (dropO.num != dropNum) {
                    //dropO.cbOverlayNot();
                }
            }    
        }
    })

    onUp(e) {
        this.enabled = false;
        this.emit(DragDrop.UP);
        this.dragSelected.isDropped();
        const samePositions = (this.dragSelected.positions.left === this.dragSelected.old.left && this.dragSelected.positions.top === this.dragSelected.old.top);
        if(samePositions){
            this.emit(DragDrop.UP_NOMOVE);
            return;
        } 
        const drop = this.checkOnDrop();
        const dragEl = this.dragSelected.element;
        const {steps,once,hunting,succession,btValidate,btClass,dropAxis} = this.options;
        if (drop != null) {
            let dragPositions;
            //Le drop est déjà à son max d'hosting
            if (drop.canHost() === false && steps === false && once === false) {
                let dragBack;
                if (drop.hostRange > 1) {
                    for (let h = 1; h <= drop.hosting.length; h++) {
                        const hosting = drop.hosting[h - 1];
                        const isOverlapped = overLap(dragEl, hosting.element, 20);
                        if (isOverlapped === true) {
                            dragBack = hosting;
                            break;
                        }
                    }
                    dragPositions = {};
                    //Si le drop possède plusieurs drags, le drag prend la place de celui survolé le plus proche
                    dragPositions.left = dragBack.box.left - this.dragSelected.startBox.left;
                    dragPositions.top = dragBack.box.top - this.dragSelected.startBox.top;
                } else {
                    //Si un seul, il prend la place standard
                    dragBack = drop.hosting[0];
                }

                if (hunting === true) {
                    const backPositions = { left: this.dragSelected.hasDrop.offsetLeft + "px", top: this.dragSelected.hasDrop.offsetTop + "px" }
                } else {
                    dragBack.isReturned(true, drop);
                    this.emit(DragDrop.UNDROPPED);
                }

            }
            //Le drag en cours se positionne
            if (!dragPositions) {
                dragPositions = drop.getHostPositions(this.dragSelected, dropAxis);
            }
            if (drop.axis != "none") {
                this.dragSelected.place(dragPositions);
                this.dragSelected.anchors = {
                    ...dragPositions
                };
            }
            drop.host(this.dragSelected);
            this.dragSelected.placed = drop.hosting.length;
            this.dragSelected.hasDrop = drop;
            this.dragSelected.element.classList.add("dropped");
            this.emit(DragDrop.DROPPED);
        } else {
            if (hunting === true) {
                this.checkAlreadyOnDrop();
                this.dragSelected.place({},true);
                this.dragSelected.positions.left = this.dragSelected.hasDrop.offsetLeft;
                this.dragSelected.positions.top = this.dragSelected.hasDrop.offsetTop;
            } else {
                this.dragSelected.isReturned(true);
            }
            return;
        }
        if (btValidate != null) {
            if (this.isReadyForValidation()) {
                btValidate.classList.remove(btClass);
            } else {
                btValidate.classList.add(btClass);
            }
        } else {
            if (succession === true) {
                this.checkSuccession();
            }
            else if (steps === true) {
                this.checkSteps();
            } else {
                if (this.isReadyForValidation()) {
                    this.validate();
                }
            }
        }
    }
    checkSteps() {
        this.desactivateAll();
        const drop = this.dragSelected.hasDrop;
        if (drop) {
            if (drop.isChecked()) {
                this.dragSelected.isRight();
                drop.corrected = true;
                this.emit(DragDrop.RIGHT,drop);
            } else {
                this.dragSelected.hasDrop = null;
                this.dragSelected.element.classList.remove("dropped");
                this.dragSelected.placed = 0;
                this.dragSelected.isReturned(true, drop);
                this.emit(DragDrop.WRONG,drop);
            }
        }
        setTimeout(() => {
            const remaining = this.getDragsUnDropped();
            if (remaining.length > 0) {
                this.activateAll();
            } else {
                this.success = true;
                this.dispose();
                this.emit(DragDrop.END,true);
            }
        }, 800);
    }
    checkSuccession() {
        this.desactivateAll();
        const drop = this.currentDrag.hasDrop;
        const answer = this.currentDrag.answer;
        const dragEl = this.currentDrag.element;
        if (drop) {
            if (drop.num === answer) {
                this.currentDrag.isRight();
            } else {
                this.currentDrag.isWrong();
                drop.unhost(this.currentDrag);
                this.currentDrag.hasDrop = null;
                this.currentDrag.element.classList.remove("dropped");
                this.currentDrag.placed = 0;
                const dropRight = this.getDropByNum(answer);
                const pos = dropRight.getHostPositions(this.currentDrag);
                this.dragSelected.place(pos, true);
                this.dragSelected.anchors = { ...pos};
            }
        }
        setTimeout(() => {
            this.currentDrag.isCorrected();
            this.successionNext();
        }, 1200);
    }
    successionNext() {
        this.currentDrag = this.getDragNext();
        if (this.currentDrag) {
            this.activateAll();
            this.current = this.currentDrag.num;
            for (let d = 1; d <= this.drags.length; d++) {
                const drag = this.drags[d - 1];
                drag.element.style["z-index"] = (d >= this.current) ? this.drags.length - (d - this.current) : (this.drags.length - (d - this.current)) - this.drags.length;
            }
            this.emit(DragDrop.SUCCESSION,this.current);
        } else {
            //Succession terminée !
            this.success = true;
            this.dispose();
            this.emit(DragDrop.END,true);
        }
    }
    successionPrev() {
        this.currentDrag = this.getDragPrev();
        if (this.currentDrag) {
            this.current = this.currentDrag.num;
            for (let d = 1; d <= this.drags.length; d++) {
                const drag = this.drags[d - 1];
                drag.element.style["z-index"] = (d >= this.current) ? this.drags.length - (d - this.current) : (this.drags.length - (d - this.current)) - this.drags.length;
            }
            this.emit(DragDrop.SUCCESSION,this.current);
        }
    }
    validate() {
        let count = 0;
        const {attempts, once} = this.options;
        for (let e = 1; e <= this.drags.length; e++) {
            const drag = this.drags[e - 1];
            drag.isWrong();
        }
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1],
                checked = drop.isChecked();
            //Drop est entièrement juste
            if (checked === true) {
                for (let h = 1; h <= drop.hosting.length; h++) {
                    drop.hosting[h - 1].isRight();
                }
                drop.corrected = true;
                count++;
            }
            else if (Array.isArray(checked)) {
                for (let c = 1; c <= checked.length; c++) {
                    checked[c - 1].isRight();
                }
            } else {
                if( once === true){
                    drop.unhost(this.dragSelected);
                }
            }
        }
        const condition = ((this.drops.length === this.drags.length) || (this.drops.length < this.drags.length)) ? count === this.drops.length : count === this.drags.length;
        if (condition === true) {
            this.success = true;
            this.dispose();
            this.emit(DragDrop.END,true);
        } else {
            if(once === true){
                this.dragSelected.gone();
                this.emit(DragDrop.ATTEMPT,this.dragSelected);
            } else {
                if (typeof attempts === "number") {
                    if (this.currentAttempt < attempts) {
                        this.currentAttempt++;
                        this.moveBack();
                        this.emit(DragDrop.ATTEMPT);
                    } else {
                        this.correction();
                        this.dispose();
                        this.emit(DragDrop.END,false);
                    }
                } else {
                    this.moveBack();
                    this.emit(DragDrop.ATTEMPT);
                }    
            }
        }
    }
    correction() {
        //Boucle 1 : enlever les drags mal placés des drops + status wrong
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            if (drag.rightPlaced === false) {
                drag.isWrong();
                if (drag.hasDrop) {
                    drag.hasDrop.unhost(drag);
                    drag.hasDrop.reorder(drag);
                    drag.hasDrop = null;
                    drag.placed = 0;
                    drag.element.classList.remove("dropped");
                }
            }
        }
        //Boucle 2 : les placer dans les bons drops ou emplacement initial
        for (let e = 1; e <= this.drags.length; e++) {
            const drag = this.drags[e - 1];
            if (drag.rightPlaced === false) {
                for (let f = 1; f <= this.drops.length; f++) {
                    const drop = this.drops[f - 1],
                        dragEl = drag.element,
                        dropEl = drop.element;
                    if (drop.matchHost(drag) == true && drop.corrected == false) {
                        drag.isCorrected();
                        const pos = drop.getHostPositions(drag);
                        drop.host(drag);
                        if (drop.isChecked() == true) {
                            drop.corrected = true;
                        }
                        if (drop.axis === "none") {
                            break;
                        }
                        drag.place(pos, true);
                        drag.anchors = { ...pos};
                        break;
                    }
                }
                if (drag.rightPlaced === false) {
                    drag.isReturned(true);
                }
            }
        }
    }
    moveBack() {
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            for (let h = 1; h <= drop.hosting.length; h++) {
                const drag = drop.hosting[h - 1];
                if (drag.rightPlaced === false) {
                    drag.isReturned(true, drop);
                }
            }
        }
    }
    checkAlreadyOnDrop() {
        if (this.options.hunting === true) {
            return false;
        }
        const drag = this.dragSelected;
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            if (drop.compareDrag(drag) === true) {
                drop.unhost(drag);
                drag.hasDrop = undefined;
                drag.element.classList.remove("dropped");
                break;
            }
        }
    }
    checkSamePosition(drop) {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1],
                conditionX = (drag.element.offsetLeft == drop.element.offsetLeft),
                conditionY = (drag.element.offsetTop == drop.element.offsetTop);
            if (conditionX && conditionY) {
                drag.hasDrop = drop;
                break;
            }
        }
    }
    checkOnDrop(d) {
        const drag = d != undefined ? d : this.dragSelected,
            dragEl = drag.element;
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1],
                dropEl = drop.element,
                isOverlapped = overLap(dragEl, dropEl, drop.overlap);
            if (isOverlapped) {
                return drop;
                break;
            }
        }
        return null;
    }
    getDropByNum(num) {
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            if (drop.num === num) {
                return drop;
                break;
            }
        }
        return null;
    }
    getDragNext() {
        const start = ((this.current + 1) > this.dragsTotal) ? 1 : this.current + 1;
        for (let d = start; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            if (drag.rightPlaced === false) {
                return drag;
                break;
            }
        }
        return null;
    }
    getDragPrev() {
        const start = ((this.current - 1) < 1) ? this.dragsTotal : this.current - 1;
        for (let d = start; d >= 1; d--) {
            const drag = this.drags[d - 1];
            if (drag.rightPlaced === false) {
                return drag;
                break;
            }
        }
        return null;
    }
    getDragsUnDropped() {
        const drags = [];
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            if (!drag.hasDrop) {
                drags.push(drag);
            }
        }
        return drags;
    }
    activateAll() {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.activate();
        }
    }
    desactivateAll() {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.desactivate();
        }
    }
    isReadyForValidation() {
        const {dropHostRange,once} = this.options;
        if(once){
            return true;
        }
        if ((this.drops.length === this.drags.length && dropHostRange === 1) || (this.drops.length < this.drags.length && dropHostRange == 1)) {
            return (this.drops.filter(function (drop) { if ((drop.hostFull === true) ? drop.hosting.length === drop.answer.length : drop.hosting.length === drop.hostRange) { return drop } }).length === this.drops.length);
        } else {
            return (this.drags.filter(function (drag) { if (drag.hasDrop != null) { return drag } }).length === this.drags.length);
        }
    }
    init() {
        for (let d = 1; d <= this.options.drags.length; d++) {
            let dragDatas = this.options.dragDatas[d - 1];
            if (!dragDatas) {
                dragDatas = {};
            }
            this.drags.push(new Drag({
                element: this.options.drags[d - 1],
                answer: dragDatas.answer,
                num: d
            }));
            this.drags[d - 1].handleDown = this.onDown.bind(this, this.drags[d - 1]);
            this.drags[d - 1].element.addEventListener(EVENTS.DOWN_TOUCHSTART, this.drags[d - 1].handleDown);
            if (this.options.succession == true) {
                this.drags[d - 1].element.style["z-index"] = this.options.drags.length - (d - 1);
            }
        }
        for (let e = 1; e <= this.options.drops.length; e++) {
            const dropDatas = this.options.dropDatas[e - 1];
            if (!dropDatas) {
                dropDatas = {};
            }
            this.drops.push(new Drop({
                element: this.options.drops[e - 1],
                num: e,
                answer: !Array.isArray(dropDatas.answer) ? [dropDatas.answer] : dropDatas.answer,
                hostRange: typeof dropDatas.hostRange === "number" ? dropDatas.hostRange : this.options.dropHostRange,
                hostFull: typeof dropDatas.hostFull === "boolean" ? dropDatas.hostFull : this.options.dropHostFull,
                lockable: typeof dropDatas.lockable === "boolean" ? dropDatas.lockable : this.options.dropLockable,
                axis: typeof dropDatas.axis === "string" ? dropDatas.axis : this.options.dropAxis,
                gap: typeof dropDatas.gap === "number" ? dropDatas.gap : this.options.dropGap,
                overlap: typeof dropDatas.overlap === "number" ? dropDatas.overlap : this.options.dropOverlap,
                cbOverlay: typeof dropDatas.cbOverlay === "function" ? dropDatas.cbOverlay : this.options.cbOverlayDrop,
                cbOverlayNot: typeof dropDatas.cbOverlayNot === "function" ? dropDatas.cbOverlayNot : this.options.cbOverlayDropNot
            }));
            this.checkSamePosition(this.drops[e - 1]);
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
            this.options.btValidate.classList.remove("hidden");
            this.options.btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
        }
        if (this.options.positionsReceiver == null) {
            this.options.positionsReceiver = this.drags[0].element.parentNode;
        }
        if (this.options.succession === true) {
            this.currentDrag = this.drags[this.current - 1];
            this.dragsTotal = this.drags.length;
            this.emit(DragDrop.SUCCESSION,this.current);
        }
    }
    setAnswers(tab) {
        for (let e = 1; e <= this.drops.length; e++) {
            const drop = this.drops[e - 1];
            if (tab[e - 1] && tab[e - 1].answer) {
                drop.answer = !Array.isArray(tab[e - 1]) ? [tab[e - 1].answer] : tab[e - 1].answer;
            }
        }
    }
    dispose() {
        this.disposed = true;
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.element.style["pointer-events"] = "";
            drag.element.style["cursor"] = "";
            drag.element.removeEventListener(EVENTS.DOWN_TOUCHSTART, drag.handleDown);
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
            this.options.btValidate.classList.add(this.options.btClass);
        }
        this.enabled = false;
    }
    reset() {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.reset();
            drag.place();
            drag.element.addEventListener(EVENTS.DOWN_TOUCHSTART, drag.handleDown);
            if (this.options.succession === true) {
                drag.element.style["z-index"] = this.drags.length - (d - 1);
            }
        }
        for (let e = 1; e <= this.drops.length; e++) {
            const drop = this.drops[e - 1];
            drop.reset();
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
            if (this.disposed === true) {
                this.disposed = false;
                this.options.btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
            }
        }
        this.success = false;
        this.currentAttempt = 1;
        if (this.options.succession === true) {
            this.current = 1;
            this.currentDrag = this.drags[this.current - 1];
            this.emit(DragDrop.SUCCESSION,this.current);
        }
        this.emit(DragDrop.RESET);
    }
}

class Drag {
    constructor(props = {}){
        this.element = props.element;
        this.num = props.num;
        this.answer = props.answer;

        this.startPositions = {
            left: 0,
            top: 0,
        }

        this.handleTransitionEnd = this.transitionEnd.bind(this);

        this.positions = {...this.startPositions};
        this.anchors = {...this.startPositions};

        this.hasDrop = null;
        this.rightPlaced = false;
        this.placed = 0;
        this.ignored = false;

        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.remove("back");
        this.element.classList.remove("dropped");
        this.element.classList.remove("corrected");
        this.element.style.translate = "0px 0px";
        this.element.style["cursor"] = "grab";
        this.startBox = this.element.getBoundingClientRect();
        this.element.addEventListener("transitionend", this.handleTransitionEnd);
    }

    get box(){
        return this.element.getBoundingClientRect();
    }

    transitionEnd(e) {
        this.element.style.transition = "";
        if (typeof this.callback === "function") {
            this.callback();
            this.callback = null;
        }
    }
    place(pos, animated) {
        const left = pos && pos.left ? pos.left : this.startPositions.left;
        const top = pos && pos.top ? pos.top : this.startPositions.top;
        this.positions.left = left;
        this.positions.top = top;
        if (animated === true) {
            this.element.style.transition = "translate .5s linear";
        }
        this.element.style.translate = left + "px " + top + "px";
        // this.element.style.left = (left) + "px";
        // this.element.style.top = (top) + "px";
    }
    isGrabbed() {
        this.element.style["cursor"] = "grabbing";
        this.element.style["z-index"] = 10;
        this.element.classList.remove("back");
        this.old = {...this.positions};
    }
    isDropped() {
        this.element.style["cursor"] = "grab";
        this.element.style["z-index"] = "";
    }
    isRight() {
        this.element.classList.remove("wrong");
        this.element.classList.add("right");
        this.rightPlaced = true;
        this.desactivate();
    }
    isWrong() {
        this.element.classList.add("wrong");
        this.element.classList.remove("right");
    }
    isCorrected() {
        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.add("corrected");
        this.rightPlaced = true;
        this.desactivate();
    }
    isReturned(animated, drop) {
        this.element.classList.remove("wrong");
        this.element.classList.add("back");
        this.positions = {...this.startPositions};
        this.anchors = {...this.startPositions};
        if (animated === true) {
            this.element.style.transition = "translate .5s linear";
            this.reset();
            if (drop) {
                drop.unhost(this);
            }
        } else {
            this.element.style.transition = "";
            this.place();
        }
    }
    reset() {
        this.hasDrop = null;
        this.rightPlaced = false;
        this.placed = 0;
        this.ignored = false;
        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.remove("corrected");
        this.element.classList.remove("back");
        this.element.classList.remove("dropped");
        this.element.style.translate = "0px 0px";
        this.element.style.opacity = 1;
        this.positions = {...this.startPositions};
        this.anchors = {...this.startPositions};
        this.activate();
    }
    activate() {
        this.element.style["pointer-events"] = "";
    }
    desactivate() {
        this.element.style["pointer-events"] = "none";
    }
    gone(){
        this.ignored = true;
        this.desactivate();
        this.element.style.opacity = 0;
    }
}

class Drop {
    constructor(props = {}){
        this.element = props.element;
        this.num = props.num;
        this.answer = props.answer;
        this.hostRange = props.hostRange;
        this.hostFull = props.hostFull;
        this.lockable = props.lockable;
        this.cbOverlay = props.cbOverlay;
        this.cbOverlayNot = props.cbOverlayNot;
        this.gap = props.gap;
        this.axis = props.axis;
        this.overlap = props.overlap;
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
    }

    get box(){
        return this.element.getBoundingClientRect();
    }

    compareDrag(drag) {
        return this.hosting.filter(function (h) {
            if (typeof drag === "number") {
                return (h.num === drag);
            } else {
                return (h.num === drag.num);
            }
        }).length > 0;
    }
    isHosting() {
        return this.hosting.length > 0;
    }
    canHost() {
        return this.hosting.length < this.hostRange && this.locked === false && this.corrected === false;
    }
    host(drag) {
        this.hosting.push(drag);
        if (this.lockable === true) {
            this.locked = true;
        }
    }
    unhost(drag) {
        this.hosting = this.hosting.filter(function (h) {
            if (h.num != drag.num) {
                return h;
            }
        });
        this.locked = false;
    }
    reorder(drag) {
        if (this.hostRange > 1) {
            for (let h = this.hosting.length; h >= 1; h--) {
                const hosting = this.hosting[h - 1];
                if (hosting.placed > drag.placed) {
                    hosting.placed--;
                    if (hosting.placed === 1) {
                        if (this.axis === "top") {
                            hosting.element.style.top = drag.element.offsetTop + "px";
                            hosting.positions.top = drag.element.offsetTop;
                        } else {
                            hosting.element.style.left = drag.element.offsetLeft + "px";
                            hosting.positions.left = drag.element.offsetLeft;
                        }
                    } else {
                        if (hosting.placed === drag.placed) {
                            if (this.axis === "top") {
                                hosting.element.style.top = drag.element.offsetTop + "px";
                                hosting.positions.top = drag.offsetTop;
                            } else {
                                hosting.element.style.left = drag.element.offsetLeft + "px";
                                hosting.positions.left = drag.element.offsetLeft;
                            }
                        } else {
                            if (this.axis == "top") {
                                hosting.element.style.top = this.hosting[h - 2].element.offsetTop + "px";
                                hosting.positions.top = this.hosting[h - 2].element.offsetTop;
                            } else {
                                hosting.element.style.left = this.hosting[h - 2].element.offsetLeft + "px";
                                hosting.positions.left = this.hosting[h - 2].element.offsetLeft;
                            }
                        }
                    }
                }
            }
        }
    }
    getHostPositions(drag, axis, gap) {
        const pos = {};
        const dropEl = this.element;
        const dragEl = drag.element;
        const left = this.box.left - drag.startBox.left;
        const top = this.box.top - drag.startBox.top;
        if (this.hostRange > 1) {
            if (this.isHosting() == true) {
                const dragRef = this.hosting[this.hosting.length - 1];
                const left = dragRef.positions.left;
                const top = dragRef.positions.top;
                const width = dragRef.element.offsetWidth;
                const height = dragRef.element.offsetHeight;
                pos.left = this.axis === "top" ? left + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : left + width + this.gap;
                pos.top = this.axis === "top" ? top + height + this.gap : top + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
            } else {
                pos.left = this.axis === "top" ? left + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : top + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
                pos.top = this.axis === "top" ? top + 5 : left + 5;
            }
        } else {
            pos.left = this.axis === "center" ? left + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : left;
            pos.top = this.axis === "center" ? top + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2) : top;
        }
        return pos;
    }
    getHostPositionsByPlaced(placed, dragEl) {
        const pos = {};
        const dropEl = this.element;
        if (placed === 1) {
            pos.left = this.axis === "center" ? this.box.left + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : this.box.left;
            pos.top = this.axis === "center" ? this.box.top + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2) : this.box.top;
        } else {
            const width = dragEl.offsetWidth;
            const height = dragEl.offsetHeight;
            pos.left = this.axis === "top" ? this.box.left + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : left + width + this.gap;
            pos.top = this.axis === "top" ? top + height + this.gap : this.box.top + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
        }
        return pos;
    }
    matchHost(drag) {
        return (this.answer.indexOf(drag.num) != -1);
    }
    isChecked() {
        if(this.corrected === true){
            return false;
        }
        let count = 0;
        const right = [];
        for (let c = 1; c <= this.hosting.length; c++) {
            const hosting = this.hosting[c - 1];
            const match = this.matchHost(hosting);
            if (match === true) {
                count++;
                right.push(hosting);
            } else {
                count--;
            }
        }
        return (this.hostFull === true) ? count === this.answer.length : count === this.hostRange ? true : right.length > 0 ? right : false;
    }
    reset() {
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
    }
}