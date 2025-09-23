// -> Moteur gestionnaire de drag drop
// animate.js utilisé pour les animations
// utilise jQuery pour les événements
function DragDrop(props) {
    var defaultOptions = {
        drags: [],
        drops: [],
        dragDatas: [],
        dropDatas: [],
        positionsReceiver: null,
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
        succession: false,
        cbEnd: function () { },
        cbAttempt: function () { },
        cbUp: function () { },
        cbReset: function () { },
        cbSuccession: function () { },
        cbOverlayDrop: function () { },
        cbOverlayDropNot: function () { },
        cbDropped: function () { },
        cbUnDropped: function () { }
    }
    this.options = Object.assign(defaultOptions, props);

    this.drags = [];
    this.drops = [];
    this.cursor = null;
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

    this.init();
}

DragDrop.prototype = {
    onDown: function (drag, e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        drag.isGrabbed();
        this.cursor = getCursorIn(event, drag.element);
        this.dragSelected = drag;
        var drop = drag.hasDrop;
        if (drop) {
            drop.unhost(drag);
            //Replacement des drags suivants si besoin
            drop.reorder(drag);
            drag.placed = 0;
            drag.hasDrop = null;
            drag.element.classList.remove("dropped");
        }
        this.addEvents();
    },
    onMove: function (e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            cursor = getCursorIn(event, this.options.positionsReceiver);
        this.dragSelected.place({
            left: (cursor.x - this.cursor.x),
            top: (cursor.y - this.cursor.y),
        });
        var drop = this.checkOnDrop();
        var dropNum = -1;
        if (drop) {
            drop.cbOverlay();
            dropNum = drop.num;
        }
        for (var d = 1; d <= this.drops.length; d++) {
            var dropO = this.drops[d - 1];
            if (dropO.num != dropNum) {
                dropO.cbOverlayNot();
            }
        }
    },
    onUp: function (e) {
        this.removeEvents();
        this.options.cbUp();
        this.dragSelected.isDropped();
        var drop = this.checkOnDrop(),
            dragEl = this.dragSelected.element;
        if (drop != null) {
            var dropEl = drop.element,
                dragPositions;
            //Le drop est déjà à son max d'hosting
            if (drop.canHost() == false) {
                var dragBack;
                if (drop.hostRange > 1) {
                    for (var h = 1; h <= drop.hosting.length; h++) {
                        var hosting = drop.hosting[h - 1],
                            isOverlapped = overLap(dragEl, hosting.element, 20);
                        if (isOverlapped == true) {
                            dragBack = hosting;
                            break;
                        }
                    }
                    dragPositions = {};
                    //Si le drop possède plusieurs drags, le drag prend la place de celui survolé le plus proche
                    dragPositions.left = dragBack.element.offsetLeft;
                    dragPositions.top = dragBack.element.offsetTop;
                } else {
                    //Si un seul, il prend la place standard
                    dragBack = drop.hosting[0];
                }
                var backPositions = this.options.hunting == true ? { left: this.dragSelected.hasDrop.offsetLeft + "px", top: this.dragSelected.hasDrop.offsetTop + "px" } : { left: dragBack.startPositions.left + "px", top: dragBack.startPositions.top + "px" };
                dragBack.positions.left = backPositions.left;
                dragBack.positions.top = backPositions.top;
                dragBack.hasDrop.unhost(dragBack);
                var ani = animate({
                    element: dragBack.element,
                    duration: 500,
                    properties: backPositions,
                    end: function () {
                        if (this.options.hunting == true) {
                            //dragBack.hasDrop = this.dragSelected.hasDrop;
                            //this.dragSelected.hasDrop.hasDrag = dragBack;
                        }
                        dragBack.hasDrop = null;
                        dragBack.placed = 0;
                        dragBack.element.classList.remove("dropped");
                        this.options.cbUnDropped();
                    }.bind(this)
                });
            }
            //Le drag en cours se positionne
            if (!dragPositions) {
                dragPositions = drop.getHostPositions(dragEl, this.options.dropAxis);
            }
            //dragEl.style.left = (dragPositions.left) + "px";
            //dragEl.style.top = (dragPositions.top) + "px";
            if (drop.axis != "none") {
                this.dragSelected.place({
                    left: dragPositions.left,
                    top: dragPositions.top,
                });
            }
            drop.host(this.dragSelected);
            this.dragSelected.placed = drop.hosting.length;
            this.dragSelected.hasDrop = drop;
            this.dragSelected.element.classList.add("dropped");
            this.options.cbDropped();
        } else {
            if (this.options.hunting == true) {
                this.checkAlreadyOnDrop();

                var ani = animate({
                    element: this.dragSelected.element,
                    duration: 500,
                    properties: { left: this.dragSelected.hasDrop.offsetLeft + "px", top: this.dragSelected.hasDrop.offsetTop + "px" }
                });
                this.dragSelected.positions.left = this.dragSelected.hasDrop.offsetLeft;
                this.dragSelected.positions.top = this.dragSelected.hasDrop.offsetTop;
            } else {
                this.dragSelected.isReturned(true);
            }
        }
        if (this.options.btValidate != null) {
            if (this.isReadyForValidation()) {
                this.options.btValidate.classList.remove(this.options.btClass);
            } else {
                this.options.btValidate.classList.add(this.options.btClass);
            }
        } else {
            if (this.options.succession == true) {
                this.checkSuccession();
            } else {
                if (this.isReadyForValidation()) {
                    this.validate();
                }
            }
        }
    },
    checkSuccession: function () {
        this.desactivateAll();
        var drop = this.currentDrag.hasDrop;
        var answer = this.currentDrag.answer;
        var dragEl = this.currentDrag.element;
        if (drop) {
            if (drop.num == answer) {
                this.currentDrag.isRight();
            } else {
                this.currentDrag.isWrong();
                drop.unhost(this.currentDrag);
                this.currentDrag.hasDrop = null;
                this.currentDrag.element.classList.remove("dropped");
                this.currentDrag.placed = 0;
                var dropRight = this.getDropByNum(answer);
                var pos = dropRight.getHostPositions(dragEl);
                var ani = animate({
                    element: dragEl,
                    duration: 500,
                    properties: { left: pos.left + "px", top: pos.top + "px" }
                });
                this.currentDrag.positions.left = pos.left;
                this.currentDrag.positions.top = pos.top;
            }
        }
        setTimeout(function () {
            this.currentDrag.isCorrected();
            this.successionNext();
        }.bind(this), 1200);
    },
    successionNext: function () {
        this.currentDrag = this.getDragNext();
        if (this.currentDrag) {
            this.activateAll();
            this.current = this.currentDrag.num;
            for (var d = 1; d <= this.drags.length; d++) {
                var drag = this.drags[d - 1];
                drag.element.style["z-index"] = (d >= this.current) ? this.drags.length - (d - this.current) : (this.drags.length - (d - this.current)) - this.drags.length;
            }
            this.options.cbSuccession(this.current);
        } else {
            //Succession terminée !
            this.success = true;
            this.dispose();
            this.options.cbEnd(true);
        }
    },
    successionPrev: function () {
        this.currentDrag = this.getDragPrev();
        if (this.currentDrag) {
            this.current = this.currentDrag.num;
            for (var d = 1; d <= this.drags.length; d++) {
                var drag = this.drags[d - 1];
                drag.element.style["z-index"] = (d >= this.current) ? this.drags.length - (d - this.current) : (this.drags.length - (d - this.current)) - this.drags.length;
            }
            this.options.cbSuccession(this.current);
        } else {

        }
    },
    validate: function () {
        var count = 0;
        for (var e = 1; e <= this.drags.length; e++) {
            var drag = this.drags[e - 1];
            drag.isWrong();
        }
        for (var d = 1; d <= this.drops.length; d++) {
            var drop = this.drops[d - 1],
                checked = drop.isChecked();
            //Drop est entièrement juste
            if (checked == true) {
                for (var h = 1; h <= drop.hosting.length; h++) {
                    drop.hosting[h - 1].isRight();
                }
                drop.corrected = true;
                count++;
            }
            else if (Array.isArray(checked)) {
                for (var c = 1; c <= checked.length; c++) {
                    checked[c - 1].isRight();
                }
            }
        }
        var condition = ((this.drops.length == this.drags.length) || (this.drops.length < this.drags.length)) ? count == this.drops.length : count == this.drags.length;
        if (condition == true) {
            this.success = true;
            this.dispose();
            this.options.cbEnd(true);
        } else {
            if (typeof this.options.attempts == "number") {
                if (this.currentAttempt < this.options.attempts) {
                    this.currentAttempt++;
                    this.moveBack();
                    this.options.cbAttempt();
                } else {
                    this.correction();
                    this.dispose();
                    this.options.cbEnd(false);
                }
            } else {
                this.moveBack();
                this.options.cbAttempt();
            }
        }
    },
    correction: function () {
        //Boucle 1 : enlever les drags mal placés des drops + status wrong
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            if (drag.rightPlaced == false) {
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
        for (var e = 1; e <= this.drags.length; e++) {
            var drag = this.drags[e - 1];
            if (drag.rightPlaced == false) {
                for (var f = 1; f <= this.drops.length; f++) {
                    var drop = this.drops[f - 1],
                        dragEl = drag.element,
                        dropEl = drop.element;
                    if (drop.matchHost(drag) == true && drop.corrected == false) {
                        drag.isCorrected();
                        var pos = drop.getHostPositions(dragEl);
                        drop.host(drag);
                        if (drop.isChecked() == true) {
                            drop.corrected = true;
                        }
                        if (drop.axis == "none") {
                            break;
                        }
                        var ani = animate({
                            element: dragEl,
                            duration: 500,
                            properties: { left: pos.left + "px", top: pos.top + "px" }
                        });
                        drag.positions.left = pos.left;
                        drag.positions.top = pos.top;
                        break;
                    }
                }
                if (drag.rightPlaced == false) {
                    drag.isReturned(true);
                }
            }
        }
    },
    moveBack: function () {
        for (var d = 1; d <= this.drops.length; d++) {
            var drop = this.drops[d - 1];
            for (var h = 1; h <= drop.hosting.length; h++) {
                var drag = drop.hosting[h - 1];
                if (drag.rightPlaced == false) {
                    drag.isReturned(true, drop);
                }
            }
        }
    },
    checkAlreadyOnDrop: function () {
        if (this.options.hunting == true) {
            return false;
        }
        var drag = this.dragSelected;
        for (var d = 1; d <= this.drops.length; d++) {
            var drop = this.drops[d - 1];
            if (drop.compareDrag(drag) == true) {
                drop.unhost(drag);
                drag.hasDrop = undefined;
                drag.element.classList.remove("dropped");
                break;
            }
        }
    },
    checkSamePosition: function (drop) {
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1],
                conditionX = (drag.element.offsetLeft == drop.element.offsetLeft),
                conditionY = (drag.element.offsetTop == drop.element.offsetTop);
            if (conditionX && conditionY) {
                drag.hasDrop = drop;
                break;
            }
        }
    },
    checkOnDrop: function (d) {
        var drag = d != undefined ? d : this.dragSelected,
            dragEl = drag.element;
        for (var d = 1; d <= this.drops.length; d++) {
            var drop = this.drops[d - 1],
                dropEl = drop.element,
                isOverlapped = overLap(dragEl, dropEl, drop.overlap);
            if (isOverlapped) {
                return drop;
                break;
            }
        }
        return null;
    },
    getDropByNum: function (num) {
        for (var d = 1; d <= this.drops.length; d++) {
            var drop = this.drops[d - 1];
            if (drop.num == num) {
                return drop;
                break;
            }
        }
        return null;
    },
    getDragNext: function () {
        var start = ((this.current + 1) > this.dragsTotal) ? 1 : this.current + 1;
        for (var d = start; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            if (drag.rightPlaced == false) {
                return drag;
                break;
            }
        }
        return null;
    },
    getDragPrev: function () {
        var start = ((this.current - 1) < 1) ? this.dragsTotal : this.current - 1;
        for (var d = start; d >= 1; d--) {
            var drag = this.drags[d - 1];
            if (drag.rightPlaced == false) {
                return drag;
                break;
            }
        }
        return null;
    },
    getDragsUnDropped: function () {
        var drags = [];
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            if (!drag.hasDrop) {
                drags.push(drag);
            }
        }
        return drags;
    },
    activateAll: function () {
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            drag.activate();
        }
    },
    desactivateAll: function () {
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            drag.desactivate();
        }
    },
    isReadyForValidation: function () {
        if ((this.drops.length == this.drags.length && this.options.dropHostRange == 1) || (this.drops.length < this.drags.length && this.options.dropHostRange == 1)) {
            return (this.drops.filter(function (drop) { if ((drop.hostFull == true) ? drop.hosting.length == drop.answer.length : drop.hosting.length == drop.hostRange) { return drop } }).length == this.drops.length);
        } else {
            return (this.drags.filter(function (drag) { if (drag.hasDrop != null) { return drag } }).length == this.drags.length);
        }
    },
    init: function () {
        for (var d = 1; d <= this.options.drags.length; d++) {
            var dragDatas = this.options.dragDatas[d - 1];
            if (!dragDatas) {
                dragDatas = {};
            }
            this.drags.push(new Drag({
                element: this.options.drags[d - 1],
                answer: dragDatas.answer,
                num: d
            }));
            $(this.drags[d - 1].element).off().on(Constants.DOWN_TOUCHSTART, this.onDown.bind(this, this.drags[d - 1]));
            if (this.options.succession == true) {
                this.drags[d - 1].element.style["z-index"] = this.options.drags.length - (d - 1);
            }
        }
        for (var e = 1; e <= this.options.drops.length; e++) {
            var dropDatas = this.options.dropDatas[e - 1];
            if (!dropDatas) {
                dropDatas = {};
            }
            this.drops.push(new Drop({
                element: this.options.drops[e - 1],
                num: e,
                answer: !Array.isArray(dropDatas.answer) ? [dropDatas.answer] : dropDatas.answer,
                hostRange: typeof dropDatas.hostRange == "number" ? dropDatas.hostRange : this.options.dropHostRange,
                hostFull: typeof dropDatas.hostFull == "boolean" ? dropDatas.hostFull : this.options.dropHostFull,
                lockable: typeof dropDatas.lockable == "boolean" ? dropDatas.lockable : this.options.dropLockable,
                axis: typeof dropDatas.axis == "string" ? dropDatas.axis : this.options.dropAxis,
                gap: typeof dropDatas.gap == "number" ? dropDatas.gap : this.options.dropGap,
                overlap: typeof dropDatas.overlap == "number" ? dropDatas.overlap : this.options.dropOverlap,
                cbOverlay: typeof dropDatas.cbOverlay == "function" ? dropDatas.cbOverlay : this.options.cbOverlayDrop,
                cbOverlayNot: typeof dropDatas.cbOverlayNot == "function" ? dropDatas.cbOverlayNot : this.options.cbOverlayDropNot
            }));
            this.checkSamePosition(this.drops[e - 1]);
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
            this.options.btValidate.classList.remove("hidden");
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }
        if (this.options.positionsReceiver == null) {
            this.options.positionsReceiver = this.drags[0].element.parentNode;
        }
        if (this.options.succession == true) {
            this.currentDrag = this.drags[this.current - 1];
            this.dragsTotal = this.drags.length;
            this.options.cbSuccession(this.current);
        }
    },
    setAnswers: function (tab) {
        for (var e = 1; e <= this.drops.length; e++) {
            var drop = this.drops[e - 1];
            if (tab[e - 1] && tab[e - 1].answer) {
                drop.answer = !Array.isArray(tab[e - 1]) ? [tab[e - 1].answer] : tab[e - 1].answer;
            }
        }
    },
    addEvents: function () {
        $(this.options.eventsReceiver).off(Constants.MOVE_TOUCHMOVE).on(Constants.MOVE_TOUCHMOVE, this.handleMove);
        $(this.options.eventsReceiver).off(Constants.UP_TOUCHEND).on(Constants.UP_TOUCHEND, this.handleUp);
    },
    removeEvents: function () {
        $(this.options.eventsReceiver).off(Constants.MOVE_TOUCHMOVE, this.handleMove);
        $(this.options.eventsReceiver).off(Constants.UP_TOUCHEND, this.handleUp);
    },
    dispose: function () {
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            drag.element.style["pointer-events"] = "";
            drag.element.style["cursor"] = "";
            $(drag.element).off();
        }
        if (this.options.btValidate != null) {
            $(this.options.btValidate).off();
            this.options.btValidate.classList.add(this.options.btClass);
        }
        $(this.options.eventsReceiver).off(Constants.MOVE_TOUCHMOVE, this.handleMove);
        $(this.options.eventsReceiver).off(Constants.UP_TOUCHEND, this.handleUp);
    },
    reset: function () {
        for (var d = 1; d <= this.drags.length; d++) {
            var drag = this.drags[d - 1];
            drag.reset();
            drag.place();
            $(drag.element).off().on(Constants.DOWN_TOUCHSTART, this.onDown.bind(this, drag));
            if (this.options.succession == true) {
                drag.element.style["z-index"] = this.drags.length - (d - 1);
            }
        }
        for (var e = 1; e <= this.drops.length; e++) {
            var drop = this.drops[e - 1];
            drop.reset();
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }
        this.success = false;
        this.currentAttempt = 1;
        if (this.options.succession == true) {
            this.current = 1;
            this.currentDrag = this.drags[this.current - 1];
            this.options.cbSuccession(this.current);
        }
        this.options.cbReset();
    }
};

function Drag(props) {
    this.element = props.element;
    this.num = props.num;
    this.answer = props.answer;

    this.startPositions = {
        left: this.element.offsetLeft,
        top: this.element.offsetTop,
    }

    this.positions = Object.assign({}, this.startPositions);

    this.hasDrop = null;
    this.rightPlaced = false;
    this.placed = 0;

    this.element.classList.remove("wrong");
    this.element.classList.remove("right");
    this.element.classList.remove("back");
    this.element.classList.remove("dropped");
    this.element.classList.remove("corrected");
    this.element.style.left = "";
    this.element.style.top = "";
    this.element.style["cursor"] = "grab";
}

Drag.prototype = {
    place: function (pos) {
        var left = pos && pos.left ? pos.left : this.startPositions.left,
            top = pos && pos.top ? pos.top : this.startPositions.top;
        this.positions.left = left;
        this.positions.top = top;
        this.element.style.left = (left) + "px";
        this.element.style.top = (top) + "px";
    },
    isGrabbed: function () {
        this.element.style["cursor"] = "grabbing";
        this.element.style["z-index"] = 10;
        this.element.classList.remove("back");
    },
    isDropped: function () {
        this.element.style["cursor"] = "grab";
        this.element.style["z-index"] = "";
    },
    isRight: function () {
        this.element.classList.remove("wrong");
        this.element.classList.add("right");
        this.rightPlaced = true;
        this.desactivate();
    },
    isWrong: function () {
        this.element.classList.add("wrong");
        this.element.classList.remove("right");
    },
    isCorrected: function () {
        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.add("corrected");
        this.rightPlaced = true;
        this.desactivate();
    },
    isReturned: function (animated, drop) {
        this.element.classList.remove("wrong");
        this.element.classList.add("back");
        this.positions = Object.assign({}, this.startPositions);
        if (animated == true) {
            var ani = animate({
                element: this.element,
                duration: 500,
                properties: { left: this.startPositions.left + "px", top: this.startPositions.top + "px" },
                end: function () {
                    this.reset();
                    if (drop) {
                        drop.unhost(this);
                    }
                }.bind(this)
            });
        } else {
            this.place();
        }
    },
    reset: function () {
        this.hasDrop = null;
        this.rightPlaced = false;
        this.placed = 0;
        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.remove("corrected");
        this.element.classList.remove("back");
        this.element.classList.remove("dropped");
        this.element.style.left = "";
        this.element.style.top = "";
        this.startPositions = {
            left: this.element.offsetLeft,
            top: this.element.offsetTop,
        }
        this.activate();
    },
    activate: function () {
        this.element.style["pointer-events"] = "";
    },
    desactivate: function () {
        this.element.style["pointer-events"] = "none";
    }
};

function Drop(props) {
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

Drop.prototype = {
    compareDrag: function (drag) {
        return this.hosting.filter(function (h) {
            if (typeof drag == "number") {
                return (h.num == drag);
            } else {
                return (h.num == drag.num);
            }
        }).length > 0;
    },
    isHosting: function () {
        return this.hosting.length > 0;
    },
    canHost: function () {
        return this.hosting.length < this.hostRange && this.locked == false;
    },
    host: function (drag) {
        this.hosting.push(drag);
        if (this.lockable == true) {
            this.locked = true;
        }
    },
    unhost: function (drag) {
        this.hosting = this.hosting.filter(function (h) {
            if (h.num != drag.num) {
                return h;
            }
        });
        this.locked = false;
    },
    reorder: function (drag) {
        if (this.hostRange > 1) {
            for (var h = this.hosting.length; h >= 1; h--) {
                var hosting = this.hosting[h - 1];
                if (hosting.placed > drag.placed) {
                    hosting.placed--;
                    if (hosting.placed == 1) {
                        if (this.axis == "top") {
                            hosting.element.style.top = drag.element.offsetTop + "px";
                            hosting.positions.top = drag.element.offsetTop;
                        } else {
                            hosting.element.style.left = drag.element.offsetLeft + "px";
                            hosting.positions.left = drag.element.offsetLeft;
                        }
                    } else {
                        if (hosting.placed == drag.placed) {
                            if (this.axis == "top") {
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
    },
    getHostPositions: function (dragEl, axis, gap) {
        var pos = {}, dropEl = this.element;
        if (this.hostRange > 1) {
            if (this.isHosting() == true) {
                var dragRef = this.hosting[this.hosting.length - 1],
                    left = dragRef.positions.left,
                    top = dragRef.positions.top,
                    width = dragRef.element.offsetWidth,
                    height = dragRef.element.offsetHeight;
                pos.left = this.axis == "top" ? dropEl.offsetLeft + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : left + width + this.gap;
                pos.top = this.axis == "top" ? top + height + this.gap : dropEl.offsetTop + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
            } else {
                pos.left = this.axis == "top" ? dropEl.offsetLeft + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : dropEl.offsetTop + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
                pos.top = this.axis == "top" ? dropEl.offsetTop + 5 : dropEl.offsetLeft + 5;
            }
        } else {
            pos.left = this.axis == "center" ? dropEl.offsetLeft + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : dropEl.offsetLeft;
            pos.top = this.axis == "center" ? dropEl.offsetTop + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2) : dropEl.offsetTop;
        }
        return pos;
    },
    getHostPositionsByPlaced: function (placed, dragEl) {
        var pos = {}, dropEl = this.element;
        if (placed == 1) {
            pos.left = this.axis == "center" ? dropEl.offsetLeft + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : dropEl.offsetLeft;
            pos.top = this.axis == "center" ? dropEl.offsetTop + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2) : dropEl.offsetTop;
        } else {
            var width = dragEl.offsetWidth,
                height = dragEl.offsetHeight;


            pos.left = this.axis == "top" ? dropEl.offsetLeft + ((dropEl.offsetWidth - dragEl.offsetWidth) / 2) : left + width + this.gap;
            pos.top = this.axis == "top" ? top + height + this.gap : dropEl.offsetTop + ((dropEl.offsetHeight - dragEl.offsetHeight) / 2);
        }
        return pos;
    },
    matchHost: function (drag) {
        return (this.answer.indexOf(drag.num) != -1);
    },
    isChecked: function () {
        var count = 0, right = [];
        for (var c = 1; c <= this.hosting.length; c++) {
            var hosting = this.hosting[c - 1],
                match = this.matchHost(hosting);
            if (match == true) {
                count++;
                right.push(hosting);
            } else {
                count--;
            }
        }
        return (this.hostFull == true) ? count == this.answer.length : count == this.hostRange ? true : right.length > 0 ? right : false;
    },
    reset: function () {
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
    },
};

function overLap(overEl, overLappedEl, percent, axis) {
    var partX = percent != undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[0]) : parseInt(percent) : 100,
        partX2 = 100 - partX,
        partY = percent != undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[1]) : parseInt(percent) : 100,
        partY2 = 100 - partY,
        posXOver = overEl["offsetLeft"],
        dimXOver = overEl["offsetWidth"],
        rightOver = posXOver + dimXOver,
        dimXOver1 = Math.round(partX / 100 * overEl["offsetWidth"]),
        dimXOver2 = Math.round(partX2 / 100 * overEl["offsetWidth"]),
        partRightOver1 = rightOver - dimXOver1,
        partRightOver2 = rightOver - dimXOver2,
        posYOver = overEl["offsetTop"],
        dimYOver = overEl["offsetHeight"],
        bottomOver = posYOver + dimYOver,
        dimYOver1 = Math.round(partY / 100 * overEl["offsetHeight"]),
        dimYOver2 = Math.round(partY2 / 100 * overEl["offsetHeight"]),
        partBottomOver1 = bottomOver - dimYOver1,
        partBottomOver2 = bottomOver - dimYOver2,

        posXOverlapped = overLappedEl["offsetLeft"],
        posYOverlapped = overLappedEl["offsetTop"],
        dimXOverlapped = overLappedEl["offsetWidth"],
        dimYOverlapped = overLappedEl["offsetHeight"],
        rightOverlapped = posXOverlapped + dimXOverlapped,
        bottomOverlapped = posYOverlapped + dimYOverlapped;

    var isOverX = (partRightOver1 >= posXOverlapped && partRightOver2 <= rightOverlapped),
        isOverY = (partBottomOver1 >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
        betweenX = (posXOver >= posXOverlapped && partRightOver2 <= rightOverlapped),
        betweenY = (posYOver >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
        condition = (axis == "x") ? (isOverX && betweenY) : (axis == "y") ? (isOverY && betweenX) : (isOverX && isOverY);

    return condition;
}