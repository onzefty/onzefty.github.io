import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS, clamp } from "../utils/utils.js";
import { getIntersection } from "../lib/dom.js";

const getClients = (e) => {
    return {
        x:e.touches ? e.touches[0].clientX : e.clientX,
        y:e.touches ? e.touches[0].clientY : e.clientY,
    }
}

const BOUNDARIES = {
    x: {min:0,max:Infinity},
    y: {min:0,max:Infinity},
}

const CLONESTYLE = {
    position: "relative",
    pointerEvents: "none",
    opacity: 0
}

const CLASSESNAMES = {
    right: "right",
    wrong: "wrong",
    corrected: "corrected",
    back: "back",
    dropped: "dropped"
}

export default class DragDrop extends EmitterMixin {
    static get END(){
        return 'DragDrop.end';
    }
    static get ATTEMPT(){
        return 'DragDrop.attempt';
    }
    static get DOWN(){
        return 'DragDrop.down';
    }
    static get UP(){
        return 'DragDrop.up';
    }
    static get MOVE(){
        return 'DragDrop.move';
    }
    static get UP_NOMOVE(){
        return 'DragDrop.upNoMove';
    }
    static get RESET(){
        return 'DragDrop.reset';
    }
    static get RETURNED(){
        return 'DragDrop.returned';
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
            boundariesElement: document.body,
            btValidate: null,
            validateOnDrop: false,
            btClass: "inactive",
            dropHostRange: 1,
            dropLockable: false,
            dropOverlap: 25,
            dropGap: 5,
            attempts: 1,
            once: false,
            resizable: true,
            switchable: false,
            noCorrection: false,
            ...props
        }

        this.options.cloneStyle = {
            ...CLONESTYLE,
            ...this.options.cloneStyle
        };

        this.options.classesNames = {
            ...CLASSESNAMES,
            ...this.options.classesNames
        }

        this.drags = [];
        this.drops = [];
        this.from = null;
        this.dragSelected = null;
        this.currentAttempt = 1;
        this.setAttempt;
        this.disposed = false;
        this.success = false;
        this.disabled = false;
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);
        this.handleValidate = this.validate.bind(this);
        this.handleCorrection = this.correction.bind(this);
        this.handleUpdate = this.update.bind(this);
        this.handleActivateAll = this.activateAll.bind(this);
        this.init();
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

    get datas(){
        const dragsDropped = this.drags.filter((drag) => drag.hasDrop != null);
        const dragsUndropped = this.drags.filter((drag) => drag.hasDrop == null);
        const dropsCorrected = this.drops.filter((drop) => drop.corrected === true);
        const allCorrected = dropsCorrected.length === this.drops.length;

        return {
            dragsDropped,
            dragsDroppedCount: dragsDropped.length,
            dragsUndropped,
            dragsUndroppedCount: dragsUndropped.length,
            dropsCorrected,
            allCorrected
        }
    }

    onDown(drag, e) {
        if(this.disabled){
            return;
        }
        this.update();
        drag.grabbed();
        this.from = getClients(e);
        this.dragSelected = drag;
        this.desactivateAll();
        const drop = drag.hasDrop;
        drag.fromDrop = drop;
        if (drop) {
            drop.unhost(drag);
        }
        this.enabled = true;
        this.emit(DragDrop.DOWN,{drag:this.dragSelected});
    }

    onMove = (e) => window.requestAnimationFrame(() => {
        if(this.disabled){
            return;
        }
        if(this.from){
            const to = getClients(e);
            const left = clamp(this.dragSelected.boundaries.x.min,(this.dragSelected.anchors.left + (to.x - this.from.x)),this.dragSelected.boundaries.x.max);
            const top = clamp(this.dragSelected.boundaries.y.min,(this.dragSelected.anchors.top + (to.y - this.from.y)),this.dragSelected.boundaries.y.max);
            this.dragSelected.place({
                left,
                top,
            });
            const drop = this.checkOnDrop();
            this.emit(DragDrop.MOVE,{drag:this.dragSelected,drop:drop});  
        }
    })

    onUp(e) {
        if(this.disabled){
            return;
        }
        this.from = null;
        this.enabled = false;
        this.emit(DragDrop.UP);
        const samePositions = (this.dragSelected.positions.left === this.dragSelected.old.left && this.dragSelected.positions.top === this.dragSelected.old.top);
        if(samePositions){
            this.dragSelected.dropped();
            if(this.dragSelected.fromDrop){
                this.dragSelected.hasDrop = this.dragSelected.fromDrop;
                this.dragSelected.hasDrop.host(this.dragSelected);
            }
            this.activateAll();
            this.emit(DragDrop.UP_NOMOVE);
            return;
        }
        const drop = this.checkOnDrop();
        const {btValidate,btClass,validateOnDrop} = this.options;
        if (drop != null) {
            if(validateOnDrop === true){
                this.validate(this.dragSelected,drop);
            } else {
                this.collision(this.dragSelected,drop);
            }
        } else { 
            this.dragSelected.isReturned(true);
            if(this.dragSelected.fromDrop){
                this.dragSelected.hasDrop = this.dragSelected.fromDrop;
                this.dragSelected.hasDrop.host(this.dragSelected);
            }
            this.emit(DragDrop.RETURNED,{
                drag:this.dragSelected
            });
        }
        if (btValidate != null) {
            if (this.isReadyForValidation()) {
                btValidate.classList.remove(btClass);
            } else {
                btValidate.classList.add(btClass);
            }
        } else {
            if (this.isReadyForValidation()) {
                this.validate();
            }
        }
    }

    collision(drag,drop) {
        const {classesNames, switchable} = this.options;
        //Le drop est déjà à son max d'hosting
        if (drop.canHost() === false) {
            const dragBack = drop.hosting[drop.hosting.length - 1];
            if(switchable){
                const fromDrop = drag.fromDrop;
                drop.unhost(dragBack);
                fromDrop.host(dragBack);
                const dragPositions = fromDrop.getHostPositions(dragBack);
                dragBack.place(dragPositions,true).then(() => {
                    dragBack.dropped();
                    dragBack.anchors = {
                        ...dragPositions
                    };
                });
            } else {
                dragBack.isReturned(true, drop);
                this.emit(DragDrop.UNDROPPED,{
                    drag:dragBack,drop
                });
            }
        }
        drop.host(drag);
        //Le drag en cours se positionne
        const dragPositions = drop.getHostPositions(drag);
        drag.place(dragPositions,true).then(() => {
            drag.dropped();
            drag.anchors = {
                ...dragPositions
            };
        });
        this.emit(DragDrop.DROPPED,{
            drag,drop
        });
    }

    validate(drag,drop) {
        if(drag && drop){
            if(drop.match(drag)){
                drag.isRight();
                this.collision(drag,drop);
            } else {
                drag.isReturned(true);
                this.emit(DragDrop.WRONG,{drag,drop})
            }
            const checked = drop.isChecked();
            //Drop est entièrement juste
            if (checked === true) {
                drop.corrected = true;
                this.activateAll();
            }
            if(this.datas.allCorrected===true){
                this.success = true;
                this.emit(DragDrop.END,true);
                this.end();
            } else {
                this.emit(DragDrop.ATTEMPT);
            }
        } else {
            let count = 0;
            const {attempts, once} = this.options;
            for (let e = 1; e <= this.drags.length; e++) {
                const drag = this.drags[e - 1];
                drag.isWrong();
            }
            for (let d = 1; d <= this.drops.length; d++) {
                const drop = this.drops[d - 1];
                if(drop.hosting.length > 0){
                    const checked = drop.isChecked();
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
            }
            const condition = ((this.drops.length === this.drags.length) || (this.drops.length < this.drags.length)) ? count === this.drops.length : count === this.drags.length;
            if (condition === true) {
                this.success = true;
                this.emit(DragDrop.END,true);
                this.end();
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
                            if( this.options.noCorrection === false){
                                this.correction();
                            }
                            this.emit(DragDrop.END,false);
                            this.end();
                        }
                    } else {
                        this.moveBack();
                        this.emit(DragDrop.ATTEMPT);
                    }    
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
                }
            }
        }
        //Boucle 2 : les placer dans les bons drops ou emplacement initial
        for (let e = 1; e <= this.drags.length; e++) {
            const drag = this.drags[e - 1];
            if (drag.rightPlaced === false) {
                for (let f = 1; f <= this.drops.length; f++) {
                    const drop = this.drops[f - 1];
                    if (drop.match(drag) == true && drop.corrected == false) {
                        drag.isCorrected();
                        drop.host(drag);
                        const pos = drop.getHostPositions(drag);
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
                    this.emit(DragDrop.WRONG,{
                        drag,drop
                    });
                }
            }
        }
    }
    checkAlreadyOnDrop() {
        const drag = this.dragSelected;
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            if (drop.compareDrag(drag) === true) {
                drop.unhost(drag);
                break;
            }
        }
    }
    checkOnDrop(d) {
        const drag = d != undefined ? d : this.dragSelected;
        const dragEl = drag.element;
        let dropFound = null;
        const comparison = {};
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            const {corrected, element} = drop;
            if(corrected){
                continue;
            }
            const dropEl = element; 
            const isOverlapped = getIntersection(dragEl, dropEl);
            if (isOverlapped && (isOverlapped.percentX >= drop.overlap && isOverlapped.percentY >= drop.overlap)) {
                if(!comparison.percentX){
                    comparison.percentX = isOverlapped.percentX;
                    comparison.percentY = isOverlapped.percentY;
                    dropFound = drop;
                } else {
                    const sumDrop = comparison.percentX + comparison.percentY;
                    const sumCurrent = isOverlapped.percentX + isOverlapped.percentY;
                    if (sumCurrent > sumDrop) {
                        comparison.percentX = isOverlapped.percentX;
                        comparison.percentY = isOverlapped.percentY;
                        dropFound = drop;
                    }
                }
            }
        }
        return dropFound;
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
    
    activateAll() {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            const {rightPlaced} = drag;
            if(rightPlaced === false){
                drag.activate();
            }
        }
    }
    desactivateAll() {
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.desactivate();
        }
    }
    isReadyForValidation() {
        const {dropHostRange,once, validateOnDrop} = this.options;
        if(validateOnDrop){
            return false;
        }
        if(once){
            return true;
        }
        if ((this.drops.length === this.drags.length && dropHostRange === 1) || (this.drops.length < this.drags.length && dropHostRange == 1)) {
            return (this.drops.filter((drop) => { if ((drop.hostFull === true) ? drop.hosting.length === drop.answer.length : drop.hosting.length === drop.hostRange) { return drop } }).length === this.drops.length);
        } else {
            return (this.drags.filter((drag) => drag.hasDrop != null).length === this.drags.length);
        }
    }
    init() {
        const {resizable, dropDatas, dragDatas, drags, cloneStyle, classesNames, drops, btValidate, btClass, boundariesElement, positionsReceiver, dropHostRange, dropLockable, dropGap, dropOverlap } = this.options;
        for (let e = 1; e <= drops.length; e++) {
            let dropData = dropDatas[e - 1];
            if (!dropData) {
                dropData = {};
            }
            this.drops.push(new Drop({
                element: drops[e - 1],
                num: e,
                boundariesElement,
                answer: !Array.isArray(dropData.answer) ? [dropData.answer] : dropData.answer,
                hostRange: typeof dropData.hostRange === "number" ? dropData.hostRange : dropHostRange,
                lockable: typeof dropData.lockable === "boolean" ? dropData.lockable : dropLockable,
                gap: typeof dropData.gap === "number" ? dropData.gap : dropGap,
                overlap: typeof dropData.overlap === "number" ? dropData.overlap : dropOverlap,
                drag: typeof dropData.drag === "number" ? dropData.drag : -1,
                classesNames
            }));
        }
        for (let d = 1; d <= drags.length; d++) {
            let dragData = dragDatas[d - 1];
            if (!dragData) {
                dragData = {};
            }
            const drag = new Drag({
                element: drags[d - 1],
                answer: dragData.answer,
                num: d,
                boundariesElement,
                cloneStyle,
                classesNames
            });
            this.drags.push(drag);
            drag.handleDown = this.onDown.bind(this, drag);
            drag.element.addEventListener(EVENTS.DOWN_TOUCHSTART,drag.handleDown);
            drag.on(Drag.PLACED,this.handleActivateAll);
            const parent = drags[d - 1].parentNode;
            if(drops.includes(parent)){
                const drop = this.drops[drops.indexOf(parent)];
                this.collision(drag,drop);
                drag.element.style["transition"] = "";
                if(this.options.switchable === false){
                    this.options.switchable = true;
                }
                if(this.options.switchable === true){
                    drag.switchable = true;
                }
            }
        }
        if (btValidate != null) {
            btValidate.classList.add(btClass);
            btValidate.classList.remove("hidden");
            btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
        }
        if (positionsReceiver == null) {
            positionsReceiver = this.drags[0].element.parentNode;
        }
        if(resizable === true){
            window.addEventListener(EVENTS.RESIZE, this.handleUpdate);
        }
        this.activateAll();
    }
    update(){
        for(let d = 1; d <= this.drags.length; d++){
            const drag = this.drags[d - 1];
            drag.update();
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
    end(){
        this.disabled = true;
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.element.style["pointer-events"] = "";
            drag.element.style["cursor"] = "";
            drag.element.style["transition"] = "";
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
        }
        this.enabled = false;
    }
    dispose() {
        this.off();
        this.disposed = true;
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.dispose();
            drag.element.removeEventListener(EVENTS.DOWN_TOUCHSTART, drag.handleDown);
        }
        for (let d = 1; d <= this.drops.length; d++) {
            const drop = this.drops[d - 1];
            drop.dispose();
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
        }
        this.unresize();
    }
    unresize(){
        window.removeEventListener(EVENTS.RESIZE, this.handleUpdate);
    }
    reset() {
        this.disabled = false;
        for (let e = 1; e <= this.drops.length; e++) {
            const drop = this.drops[e - 1];
            drop.reset();
        } 
        for (let d = 1; d <= this.drags.length; d++) {
            const drag = this.drags[d - 1];
            drag.reset();
            drag.place();
            drag.element.addEventListener(EVENTS.DOWN_TOUCHSTART, drag.handleDown);
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
        this.emit(DragDrop.RESET);
    }
}

class Drag extends EmitterMixin {
    static get PLACED(){
        return 'Drag.placed';
    }
    constructor(props = {}){
        super();
        this.boundariesElement = props.boundariesElement;
        this.cloneStyle = props.cloneStyle;
        this.classesNames = props.classesNames;
        this.element = props.element;
        this.num = props.num;
        this.answer = props.answer;
        this.switchable = props.switchable;

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

        this.element.classList.remove(this.classesNames.wrong);
        this.element.classList.remove(this.classesNames.right);
        this.element.classList.remove(this.classesNames.back);
        this.element.classList.remove(this.classesNames.dropped);
        this.element.classList.remove(this.classesNames.corrected);
        this.element.style.translate = "0px 0px";
        this.element.style["cursor"] = "grab";
        this.clone = this.createClone();
        this.update();
        this.activate();
    }

    get box(){
        return this.element.getBoundingClientRect();
    }

    get boundaries(){

        const box = this.boundariesElement.getBoundingClientRect();
        BOUNDARIES.x.max = this.boundariesElement.scrollWidth + box.left;
        BOUNDARIES.y.max = this.boundariesElement.scrollHeight + box.top;
        BOUNDARIES.x.min = -(this.boundariesElement.scrollLeft) + box.left;
        BOUNDARIES.y.min = -(this.boundariesElement.scrollTop) + box.top;

        return {
            x: {
                min:BOUNDARIES.x.min - this.startBox.left,
                max:BOUNDARIES.x.max - this.startBox.right
            },
            y: {
                min:BOUNDARIES.y.min - this.startBox.top,
                max:BOUNDARIES.y.max - this.startBox.bottom
            }
        }
    }

    get isGrabbed(){
        return this.element.style["cursor"] === "grabbing"
    }

    createClone(){
        const clone = this.element.cloneNode(true);
        clone.setAttribute("data-drag-clone",this.num);
        for(let p in this.cloneStyle){
            clone.style[p] = this.cloneStyle[p];
        }
        return clone;
    }

    dispose(){
        this.dropped();
        this.off();
    }

    update(){
        this.element.style.translate = "0px 0px";
        const box = this.element.getBoundingClientRect();
        this.startBox = {};
        for(let p in box){
            this.startBox[p] = box[p];
        }
        this.startBox.top = this.startBox.top + this.boundariesElement.scrollTop;
        this.startBox.left = this.startBox.left + this.boundariesElement.scrollLeft;
        this.startBox.right = this.startBox.right + this.boundariesElement.scrollLeft;
        this.startBox.bottom = this.startBox.bottom + this.boundariesElement.scrollTop;
        if(this.hasDrop){
            const dragPositions = this.hasDrop.getHostPositions(this);
            if (this.hasDrop.axis != "none") {
                this.place(dragPositions);
            }
        }
    }

    transitionEnd(e) {
        this.element.style.transition = "";
        this.emit(Drag.PLACED,this);
    }
    place(pos, animated) {
        const left = pos && pos.left ? pos.left : this.startPositions.left;
        const top = pos && pos.top ? pos.top : this.startPositions.top;
        this.positions.left = left;
        this.positions.top = top;
        if (animated === true) {
            this.element.style.transition = "translate .5s linear";
            this.element.style["pointer-events"] = "none";
            this.element.style.translate = left + "px " + top + "px";
            return new Promise((resolve) => {
                this.element.ontransitionend = (event) => {
                    this.handleTransitionEnd(event);
                    resolve();
                }
            });
        } else {
            this.element.style.translate = left + "px " + top + "px";
            if(!this.isGrabbed){
                this.emit(Drag.PLACED,this);
            }
            return Promise.resolve();
        }
    }
    grabbed() {
        this.element.style["cursor"] = "grabbing";
        this.element.style["z-index"] = 100;
        this.element.classList.remove(this.classesNames.back);
        this.old = {...this.positions};
    }
    dropped() {
        this.element.style["cursor"] = "grab";
        this.element.style["z-index"] = "";
    }
    isRight() {
        this.element.classList.remove(this.classesNames.wrong);
        this.element.classList.add(this.classesNames.right);
        this.rightPlaced = true;
        this.desactivate();
    }
    isWrong() {
        this.element.classList.add(this.classesNames.wrong);
        this.element.classList.remove(this.classesNames.right);
    }
    isCorrected() {
        this.element.classList.remove(this.classesNames.wrong);
        this.element.classList.remove(this.classesNames.right);
        this.element.classList.add(this.classesNames.corrected);
        this.rightPlaced = true;
        this.desactivate();
    }
    isReturned(animated, drop) {
        this.placed = 0;
        this.element.classList.remove(this.classesNames.wrong);
        this.element.classList.add(this.classesNames.back);
        this.positions = {...this.startPositions};
        this.anchors = {...this.startPositions};
        if (animated === true) {
            this.desactivate();
            if (drop) {
                drop.unhost(this);
            }
            if(this.fromDrop && this.switchable === true){
                this.fromDrop.host(this);
                const dragPositions = this.fromDrop.getHostPositions(this);
                return this.place(dragPositions,true).then(() => {
                    this.dropped();
                    this.anchors = {
                        ...dragPositions
                    };
                });
            }
            return this.place(undefined,true).then(() => {
                this.dropped();
                this.reset();
            });
        } else {
            if(this.fromDrop && this.switchable === true){
                this.fromDrop.host(this);
                const dragPositions = this.fromDrop.getHostPositions(this);
                this.place(dragPositions);
                this.dropped();
                this.anchors = {
                    ...dragPositions
                };
            } else {
                this.element.style.transition = "";
                this.dropped();
                this.place();
            } 
        }
    }
    reset() {
        if(!this.fromDrop){
            this.hasDrop = null;
        }
        this.rightPlaced = false;
        this.placed = 0;
        this.ignored = false;
        this.element.classList.remove(this.classesNames.wrong);
        this.element.classList.remove(this.classesNames.right);
        this.element.classList.remove(this.classesNames.corrected);
        this.element.classList.remove(this.classesNames.back);
        this.element.classList.remove(this.classesNames.dropped);
        this.element.style.translate = "0px 0px";
        this.element.style.opacity = 1;
        this.positions = {...this.startPositions};
        this.anchors = {...this.startPositions};
        if(!this.clone){
            this.clone = this.createClone();
        }
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
        this.boundariesElement = props.boundariesElement;
        this.classesNames = props.classesNames;
        this.element = props.element;
        this.num = props.num;
        this.answer = props.answer;
        this.hostRange = props.hostRange;
        this.lockable = props.lockable;;
        this.gap = props.gap;
        this.axis = props.axis;
        this.overlap = props.overlap;
        this.drag = props.drag;
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
    }

    get box(){
        return this.element.getBoundingClientRect();
    }

    get full(){
        return this.hosting.length === this.hostRange;
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
        drag.placed = this.hosting.length;
        drag.hasDrop = this;
        drag.fromDrop = this;
        this.element.append(drag.clone);
        if (this.lockable === true) {
            this.locked = true;
        }
    }
    unhost(drag) {
        drag.placed = 0;
        drag.hasDrop = null;
        drag.element.classList.remove(this.classesNames.dropped);
        this.hosting = this.hosting.filter((h) => h.num != drag.num);
        this.element.removeChild(drag.clone);
        this.locked = false;
        this.reorder();
    }
    reorder() {
        if (this.hostRange > 1) {
            for (let h = this.hosting.length; h >= 1; h--) {
                const hosting = this.hosting[h - 1];
                const {clone} = hosting;
                const box = clone.getBoundingClientRect();
                hosting.place({
                    left: box.left - hosting.startBox.left,
                    top: box.top - hosting.startBox.top
                })
            }
        }
    }
    getHostPositions(drag) {
        const pos = {};
        const scrollTop = this.boundariesElement.scrollTop;
        const scrollLeft = this.boundariesElement.scrollLeft;
        const box = drag.clone.getBoundingClientRect();
        const left = box.left - drag.startBox.left + scrollLeft;
        const top = box.top - drag.startBox.top + scrollTop;
        pos.left = left;
        pos.top = top;
        return pos;
    }
    match(drag) {
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
            const match = this.match(hosting);
            if (match === true) {
                count++;
                right.push(hosting);
            } else {
                count--;
            }
        }
        const total = Math.min(this.answer.length, this.hostRange);
        return count === total ? true : right.length > 0 ? right : false;
    }
    dispose(){
        const children = this.element.children;
        for(let c = children.length; c >= 1; c--){
            const child = children[c - 1];
            if(child.hasAttribute("data-drag-clone")){
                this.element.removeChild(child);
            }
        }
    }
    reset() {
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
        this.dispose();
    }
}