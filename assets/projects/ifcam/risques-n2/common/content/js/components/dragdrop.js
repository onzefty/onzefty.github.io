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
        btClass: "hidden",
        dropAxis: "center",
        dropHostRange: 1,
        dropLockable: false,
        dropOverlap:25,
        dropGap: 5,
        attempts: 1,
        hunting: false,
        succession: false,
        noCorrection: false,
        correctionDelay:0,
        cbEnd: function () { },
        cbReset: function () { },
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
        this.cursor = getCursorIn(event, this.options.positionsReceiver);
        this.dragSelected = drag;
        this.dragSelected.update();
        this.addEvents();
    },
    onMove: function (e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            cursor = getCursorIn(event, this.options.positionsReceiver);

        this.dragSelected.place({
            left: this.dragSelected.movingPositions.left + (cursor.x - this.cursor.x),
            top:  this.dragSelected.movingPositions.top + (cursor.y - this.cursor.y),
        });
        this.dragSelected.status = "moving";
        var drop = this.dragSelected.hasDrop;
        if (drop) {
            drop.unhost(this.dragSelected);
            //Replacement des drags suivants si besoin
            drop.reorder(this.dragSelected);
            this.dragSelected.placed = 0;
            this.dragSelected.hasDrop = null;
        }
    },
    onUp: function (e) {
        this.removeEvents();
        if(this.dragSelected.status!=="moving"){
            this.dragSelected.status = "normal";
            return;
        }
        this.dragSelected.isDropped();
        var drop = this.checkOnDrop(),
            dragEl = this.dragSelected.element;
        if (drop != null) {
            var dropEl = drop.element,
            dragPositions;
            //Le drop est déjà à son max d'hosting
            if (drop.canHost()==false) {
                var dragBack;
                if(drop.hostRange>1){
                    for(var h=1; h<=drop.hosting.length; h++){
                        var hosting = drop.hosting[h-1],
                        isOverlapped = overLap(dragEl,hosting.element,20);
                        if(isOverlapped==true){
                            dragBack = hosting;
                            break;
                        }
                    }
                    dragPositions = {};
                    var x = dragBack.box.left - this.dragSelected.startPositions.left
                    var y = dragBack.box.top - this.dragSelected.startPositions.top
                    //Si le drop possède plusieurs drags, le drag prend la place de celui survolé le plus proche
                    dragPositions.left = x;
                    dragPositions.top = y;
                } else {
                    //Si un seul, il prend la place standard
                    dragBack = drop.hosting[0];
                }
                var x = dragBack.box.left - this.dragSelected.startPositions.left
                var y = dragBack.box.top - this.dragSelected.startPositions.top
                var backPositions = this.options.hunting == true ? { left: this.dragSelected.hasDrop.offsetLeft + "px", top: this.dragSelected.hasDrop.offsetTop + "px" } : { translateX: "0px", translateY: "0px" };
                dragBack.positions.left = backPositions.left;
                dragBack.positions.top = backPositions.top;
                dragBack.hasDrop.unhost(dragBack);
                var ani = animate({
                    element: dragBack.element,
                    duration: 500,
                    properties: backPositions,
                    end: function () {
                        if (this.options.hunting==true) {
                            //dragBack.hasDrop = this.dragSelected.hasDrop;
                            //this.dragSelected.hasDrop.hasDrag = dragBack;
                        }
                        dragBack.hasDrop = null;
                        dragBack.placed = 0;
                    }.bind(this)
                });    
            }
            //Le drag en cours se positionne
            if(!dragPositions){
                dragPositions = drop.getHostPositions(this.dragSelected,this.options.dropAxis);
            }
            this.dragSelected.place({
                left: dragPositions.left,
                top: dragPositions.top,
            });
            drop.host(this.dragSelected);
            this.dragSelected.placed = drop.hosting.length;
            this.dragSelected.hasDrop = drop;
        } else {
            if (this.options.hunting == true) {
                this.checkAlreadyOnDrop();
                
                var ani = animate({
                    element: this.dragSelected.element,
                    duration: 500,
                    properties: { translateX: "0px", translateY: "0px" }
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
            if (this.isReadyForValidation()) {
                this.validate();
            }
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
                for(var h=1; h<=drop.hosting.length; h++){
                    drop.hosting[h-1].isRight();
                }
                drop.corrected = true;
                count++;
            }
            else if(Array.isArray(checked)){
                for(var c=1; c<=checked.length; c++){
                    checked[c-1].isRight();
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
                } else {
                    if(this.options.noCorrection === false){
                        if(this.options.correctionDelay > 0){
                            setTimeout(this.correction.bind(this),this.options.correctionDelay )
                        } else {
                            this.correction(); 
                        }  
                    }
                    this.dispose();
                    this.options.cbEnd(false);
                }
            } else {
                this.moveBack();
            }
        }
    },
    correction: function () {
        var self = this;
        var total = this.drags.length;
        //Boucle 1 : enlever les drags mal placés des drops + status wrong
        for (var d = 1; d <= total; d++) {
            var drag = this.drags[d - 1];
            if (drag.rightPlaced == false) {
                drag.isWrong();
                if(drag.hasDrop){
                    drag.hasDrop.unhost(drag);
                    drag.hasDrop.reorder(drag);
                    drag.hasDrop = null;
                    drag.placed = 0;
                }
            }
        }

        // Boucle 2 : les placer dans les bons drops ou emplacement initial
        for (var e = this.drags.length; e >= 1 ; e--) {
            var drag = this.drags[e - 1],
            dragEl = drag.element;
            if (drag.rightPlaced == false) {
                for (var f = 1; f <= this.drops.length; f++) {
                    var drop = this.drops[f - 1];
                    if (drop.matchHost(drag) == true && drop.corrected == false) {
                        drag.isCorrected();
                        var pos = drop.getHostPositions(drag);
                        if(drop.isChecked()==true){
                            drop.corrected = true;
                        }
                        drop.host(drag);
                        var ani = animate({
                            element: dragEl,
                            duration: 500,
                            properties: { translateX: pos.left + "px", translateY: pos.top + "px" }
                        });
                        drag.moved = true;
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
            for(var h=1; h<=drop.hosting.length; h++){
                var drag = drop.hosting[h-1];
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
            isOverlapped = overLap(dragEl,dropEl,drop.overlap);
            if (isOverlapped) {
                return drop;
                break;
            }
        }
        return null;
    },
    isReadyForValidation: function () {
        if ((this.drops.length == this.drags.length && this.options.dropHostRange==1) || (this.drops.length < this.drags.length && this.options.dropHostRange==1)) {
            return (this.drops.filter(function (drop) { if (drop.hosting.length == drop.answer.length) { return drop } }).length == this.drops.length);
        } else {
            return (this.drags.filter(function (drag) { if (drag.hasDrop != null) { return drag } }).length == this.drags.length);
        }
    },
    init: function () {
        for (var d = 1; d <= this.options.drags.length; d++) {
            this.drags.push(new Drag({
                element: this.options.drags[d - 1],
                num: d
            }));
            $(this.drags[d - 1].element).off().on(Constants.DOWN_TOUCHSTART, this.onDown.bind(this, this.drags[d - 1]));
        }
        for (var e = 1; e <= this.options.drops.length; e++) {
            var dropDatas = this.options.dropDatas[e - 1];
            this.drops.push(new Drop({
                element: this.options.drops[e - 1],
                num: e,
                answer: !Array.isArray(dropDatas.answer) ? [dropDatas.answer] : dropDatas.answer,
                hostRange: typeof dropDatas.hostRange == "number" ? dropDatas.hostRange : this.options.dropHostRange,
                lockable: typeof dropDatas.lockable == "boolean" ? dropDatas.lockable : this.options.dropLockable,
                axis: typeof dropDatas.axis == "string" ? dropDatas.axis : this.options.dropAxis,
                gap: typeof dropDatas.gap == "number" ? dropDatas.gap : this.options.dropGap,
                overlap: typeof dropDatas.overlap == "number" ? dropDatas.overlap : this.options.dropOverlap
            }));
            this.checkSamePosition(this.drops[e - 1]);
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClass);
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }
        if (this.options.positionsReceiver == null) {
            this.options.positionsReceiver = this.drags[0].element.parentNode;
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
        this.options.cbReset();
    }
};

function Drag(props) {
    this.element = props.element;
    this.num = props.num;

    this.startPositions = {
        left: this.element.getBoundingClientRect().left,
        top: this.element.getBoundingClientRect().top,
    }

    this.positions = Object.assign({},this.startPositions);
    this.hasDrop = null;
    this.rightPlaced = false;
    this.placed = 0;
    this.status = "normal";

    this.element.classList.remove("wrong");
    this.element.classList.remove("right");
    this.element.classList.remove("back");
    this.element.classList.remove("corrected");
    this.element.style.left = "";
    this.element.style.top = "";
    this.element.style["cursor"] = "grab";

    Object.defineProperty(this, 'box', {
        get() {
          return this.element.getBoundingClientRect()
        }
    });
}

Drag.prototype = {
    update: function(){
        var translates = this.element.style.translate
        var left = 0
        var top = 0
        if(translates.length > 0){
            var split = translates.split(/\s/g)
            if(split[0]){
                left = parseFloat(split[0])
            }
            if(split[1]){
                top = parseFloat(split[1])
            }
        }
        this.movingPositions = {
            left:left,
            top:top
        }
    },
    place: function (pos) {
        var left = pos && pos.left ? pos.left : 0,
            top = pos && pos.top ? pos.top : 0;
        this.positions.left = left;
        this.positions.top = top;
        this.element.style.translate = (left) + "px "+(top) + "px";
    },
    isGrabbed: function () {
        this.element.style["cursor"] = "grabbing";
        this.element.style["z-index"] = 10;
        this.element.classList.remove("back");
        this.status = "grabbed";
    },
    isDropped: function () {
        this.element.style["cursor"] = "grab";
        this.element.style["z-index"] = "";
        this.status = "dropped";
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
        this.positions = Object.assign({},this.startPositions);
        if (animated === true) {
            var ani = animate({
                element: this.element,
                duration: 500,
                properties: {translateX:"0px",translateY:"0px"},
                end: function () {
                    this.reset();
                    if (drop) {
                        drop.unhost(this);
                    }
                }.bind(this)
            });
        } else {
            this.status = "normal";
            this.place();
        }
    },
    reset: function () {
        this.hasDrop = null;
        this.rightPlaced = false;
        this.placed = 0;
        this.moved = false;
        this.status = "normal";
        this.element.classList.remove("wrong");
        this.element.classList.remove("right");
        this.element.classList.remove("corrected");
        this.element.classList.remove("back");
        this.element.style.translate = "0px 0px";
        this.startPositions = {
            left: this.element.getBoundingClientRect().left,
            top: this.element.getBoundingClientRect().top,
        }
        this.positions = Object.assign({},this.startPositions);
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
    this.lockable = props.lockable;
    this.gap = props.gap;
    this.axis = props.axis;
    this.overlap = props.overlap;
    this.hosting = [];
    this.corrected = false;
    this.locked = false;
    
    Object.defineProperty(this, 'box', {
        get() {
          return this.element.getBoundingClientRect()
        }
    });
}

Drop.prototype = {
    compareDrag: function (drag) {
        return this.hosting.filter(function(h){
            if (typeof drag == "number") {
                return (h.num == drag);
            } else {
                return (h.num == drag.num);
            }
        }).length>0;
    },
    isHosting:function(){
        return this.hosting.length > 0;
    },
    canHost:function(){
        return this.hosting.length<this.hostRange && this.locked==false;
    },
    host:function(drag){
        this.hosting.push(drag);
        if(this.lockable==true){
            this.locked = true;
        }
    },
    unhost:function(drag){
        this.hosting = this.hosting.filter(function(h){
            if(h.num != drag.num){
                return h;
            }
        });
        this.locked = false;
    },
    reorder:function(drag){
        if(this.hostRange>1){
            for(var h=this.hosting.length; h>=1; h--){
                var hosting = this.hosting[h-1];
                var x = drag.box.left - hosting.startPositions.left
                var y = drag.box.top - hosting.startPositions.top
                if(hosting.placed>drag.placed){
                    hosting.placed--;
                    if(hosting.placed==1){
                        hosting.element.style.translate =  x+"px "+y+"px"
                        hosting.positions.left = x
                        hosting.positions.top = y
                    } else {
                        if(hosting.placed==drag.placed){
                            hosting.element.style.translate =  x+"px "+y+"px"
                            hosting.positions.left = x
                            hosting.positions.top = y
                        } else {
                            var xh = this.hosting[h-2].box.left - hosting.startPositions.left
                            var yh = this.hosting[h-2].box.top - hosting.startPositions.top
                            hosting.element.style.translate =  xh+"px "+yh+"px"
                            hosting.positions.left = xh
                            hosting.positions.top = yh
                        } 
                    }    
                } 
            }
        }
    },
    getHostPositions:function(drag,axis,gap){
        var pos = {};
        var x = this.box.left - drag.startPositions.left
        var y = this.box.top - drag.startPositions.top
        if(this.hostRange>1){
            if(this.isHosting()==true){
                var dragRef = this.hosting[this.hosting.length-1],
                dragEl = dragRef.element,
                left = dragRef.moved ? dragEl.offsetLeft + dragRef.positions.left : dragRef.box.left,
                top  = dragRef.moved ? dragEl.offsetTop + dragRef.positions.top : dragRef.box.top,
                width = dragRef.box.width,
                height = dragRef.box.height;
                var xRef = left - drag.startPositions.left
                var yRef = top - drag.startPositions.top
                switch(this.axis){
                    case "top":
                        pos.left = xRef + ((this.box.width - drag.box.width) / 2)
                        pos.top = yRef + height + this.gap
                    break;

                    case "center":
                        pos.left = xRef + width + this.gap
                        pos.top = yRef +  ((this.box.height - drag.box.height) / 2);
                    break;
                }
            } else {
                switch(this.axis){
                    case "top":
                        pos.left = x + ((this.box.width - drag.box.width) / 2);
                        pos.top = y
                    break;

                    case "center":
                        pos.left = y+ ((this.box.height - drag.box.height) / 2);
                        pos.top = x
                    break;
                }
            }
        } else {
            pos.left = this.axis == "center" ? x + ((this.box.width - drag.box.width) / 2) : x;
            pos.top = this.axis == "center" ? y + ((this.box.height - drag.box.height) / 2) : y;
        }
        return pos;
    },
    getHostPositionsByPlaced:function(placed,drag){
        var pos = {};
        var x = this.box.left - drag.startPositions.left
        var y = this.box.top - drag.startPositions.top
        if(placed==1){
            pos.left = this.axis == "center" ? x + ((this.box.width - drag.box.width) / 2) : x;
            pos.top = this.axis == "center" ? y + ((this.box.height - drag.box.height) / 2) : y;
        } else {
            var width = drag.box.width,
            height = drag.box.height;


            pos.left = this.axis == "top" ? x + ((this.box.width - drag.box.width) / 2) : left + width + this.gap;
                pos.top = this.axis == "top" ? top + height + this.gap : y + ((this.box.height - drag.box.height) / 2);
        }
        return pos;
    },
    matchHost:function(drag){
        return (this.answer.indexOf(drag.num) != -1);
    },
    isChecked: function() {
        var count = 0, right = [];
        for(var c=1; c<=this.hosting.length; c++){
            var hosting = this.hosting[c-1],
            match = this.matchHost(hosting);
            if (match==true) {
                count++;
                right.push(hosting);
            } else {
                count--;
            }
        }
        return count==this.answer.length ? true: right.length>0 ? right : false;
    },
    reset: function () {
        this.hosting = [];
        this.corrected = false;
        this.locked = false;
    },
};

function overLap(overEl,overLappedEl,percent,axis){
    var partX = percent!=undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[0]) : parseInt(percent) : 100,
    partX2 = 100 - partX,
    partY = percent!=undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[1]) : parseInt(percent) : 100,
    partY2 = 100 - partY,
    boxOverEl = overEl.getBoundingClientRect(),
    posXOver = boxOverEl.left,
    dimXOver = boxOverEl.width,
    rightOver = boxOverEl.right,
    dimXOver1 = Math.round(partX/100*dimXOver),
    dimXOver2 = Math.round(partX2/100*dimXOver),
    partRightOver1 = rightOver - dimXOver1,
    partRightOver2 = rightOver - dimXOver2,
    posYOver = boxOverEl.top,
    dimYOver = boxOverEl.height,
    bottomOver = boxOverEl.bottom,
    dimYOver1 = Math.round(partY/100*dimYOver),
    dimYOver2 = Math.round(partY2/100*dimYOver),
    partBottomOver1 = bottomOver - dimYOver1,
    partBottomOver2 = bottomOver - dimYOver2,

    boxOverlappedEl = overLappedEl.getBoundingClientRect();
    posXOverlapped = boxOverlappedEl.left,
    posYOverlapped = boxOverlappedEl.top,
    dimXOverlapped = boxOverlappedEl.width,
    dimYOverlapped = boxOverlappedEl.height,
    rightOverlapped = boxOverlappedEl.right,
    bottomOverlapped = boxOverlappedEl.bottom;

    var isOverX = (partRightOver1 >= posXOverlapped && partRightOver2 <= rightOverlapped),
    isOverY = (partBottomOver1 >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
    betweenX = (posXOver >= posXOverlapped && partRightOver2 <= rightOverlapped),
    betweenY = (posYOver >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
    condition = (axis=="x") ? (isOverX && betweenY) : (axis=="y") ? (isOverY && betweenX) : (isOverX && isOverY);

    return condition;
}