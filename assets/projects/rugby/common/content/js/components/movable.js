function Movable(props) {
    this.element = props.element;
    this.triggeringElement = props.triggeringElement != undefined ? props.triggeringElement : this.element;
    this.positionsReceiver = props.positionsReceiver != undefined ? props.positionsReceiver : this.element.parentNode;
    this.onMoveUpReceiver = props.onMoveUpReceiver != undefined ? props.onMoveUpReceiver : document;
    this.windowReceiver = props.windowReceiver != undefined ? props.windowReceiver : window;
    this.around = props.around != undefined ? true : false;
    this.percent = props.percent != undefined ? true : false;
    this.hasRotation = typeof props.hasRotation == "number" ? props.hasRotation : null;
    this.returnToStart = props.returnToStart != undefined ? true : false;
    this.cbDown = props.cbDown != undefined && typeof props.cbDown == 'function' ? props.cbDown.bind(this) : function () { };
    this.cbMove = props.cbMove != undefined && typeof props.cbMove == 'function' ? props.cbMove.bind(this) : function () { };
    this.cbUp = props.cbUp != undefined && typeof props.cbUp == 'function' ? props.cbUp.bind(this) : function () { };
    this.cbCheckMove = typeof props.cbCheckMove == 'function' ? props.cbCheckMove : function () { return false };
    this.cbCheckUp = typeof props.cbCheckUp == 'function' ? props.cbCheckUp : function () { return false };
    this.cbEnd = props.cbEnd != undefined && typeof props.cbEnd == 'function' ? props.cbEnd : function () { };
    this.cbLimitXStart = typeof props.cbLimitXStart == 'function' ? props.cbLimitXStart : function () { };
    this.cbLimitXEnd = typeof props.cbLimitXEnd == 'function' ? props.cbLimitXEnd : function () { };
    this.cbLimitYStart = typeof props.cbLimitYStart == 'function' ? props.cbLimitYStart : function () { };
    this.cbLimitYEnd = typeof props.cbLimitYEnd == 'function' ? props.cbLimitYEnd : function () { };
    this.cbReset = typeof props.cbReset == 'function' ? props.cbReset : function () { };
    this.startPositions = {
        left: this.percent == true ? this.pxToPercent(this.element.offsetLeft, "x") : this.element.offsetLeft,
        top: this.percent == true ? this.pxToPercent(this.element.offsetTop, "y") : this.element.offsetTop
    };
    this.positions = {
        left: this.startPositions.left,
        top: this.startPositions.top,
    };
    this.diff = {
        left: 0,
        top: 0
    }
    this.directions = {
        x: "middle",
        y: "middle"
    }
    this.sides = {
        x: "middle",
        y: "middle"
    }
    this.previous = null;

    this.limitXStart = this.getLimit(props.limitXStart, "x", "min");
    this.limitXEnd = this.getLimit(props.limitXEnd, "x", "max");
    this.limitYStart = this.getLimit(props.limitYStart, "y", "min");
    this.limitYEnd = this.getLimit(props.limitYEnd, "y", "max");

    this.handleDown = this.onDown.bind(this);
    this.handleMove = this.onMove.bind(this);
    this.handleUp = this.onUp.bind(this);

    this.reset();
}

Movable.prototype = {
    onDown: function (e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        this.triggeringElement.style['cursor'] = 'grabbing';
        if (this.hasRotation) {
            this.positionsReceiver.style["transform"] = "rotate(0deg)";
        }
        this.triggeringElement.cursor = getCursorIn(event, this.element);
        if (this.hasRotation) {
            this.positionsReceiver.style["transform"] = "rotate(" + this.hasRotation + "deg)";
        }
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.addEvents();
        this.cbDown();
    },
    onMove: function (e) {
        if (this.hasRotation) {
            this.positionsReceiver.style["transform"] = "rotate(0deg)";
        }

        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            cursor = getCursorIn(event, this.positionsReceiver),
            x = cursor.x - this.triggeringElement.cursor.x,
            y = cursor.y - this.triggeringElement.cursor.y;
        if (this.hasRotation) {
            this.positionsReceiver.style["transform"] = "rotate(" + this.hasRotation + "deg)";
        }

        if (this.previous) {
            this.directions.x = (x > this.previous.x) ? "right" : (x < this.previous.x) ? "left" : "middle";
            this.directions.y = (y > this.previous.y) ? "bottom" : (y < this.previous.y) ? "top" : "middle";
        }

        this.element.style.left = this.percent == true ? this.pxToPercent(x, "x") + "%" : this.around = true ? (Math.round(x)) + "px" : (x) + "px";
        this.element.style.top = this.percent == true ? this.pxToPercent(y, "y") + "%" : this.around = true ? (Math.round(y)) + "px" : (y) + "px";

        var l = this.percent == true ? this.pxToPercent(this.element.offsetLeft, "x") : this.element.offsetLeft,
            t = this.percent == true ? this.pxToPercent(this.element.offsetTop, "y") : this.element.offsetTop,
            w = this.percent == true ? this.pxToPercent(this.element.offsetWidth, "x") : this.element.offsetWidth,
            h = this.percent == true ? this.pxToPercent(this.element.offsetHeight, "y") : this.element.offsetHeight,
            minX = this.percent == true ? parseFloat(this.limitXStart) : this.limitXStart,
            maxX = this.percent == true ? parseFloat(this.limitXEnd) : this.limitXEnd,
            minY = this.percent == true ? parseFloat(this.limitYStart) : this.limitYStart,
            maxY = this.percent == true ? parseFloat(this.limitYEnd) : this.limitYEnd,
            conditionXMin = (l < minX),
            conditionXMax = (l > maxX),
            conditionYMin = (t < minY),
            conditionYMax = (t > maxY);

        if (conditionXMin) {
            this.element.style.left = this.percent == true ? this.limitXStart : (this.limitXStart) + "px";
            this.cbLimitXStart();
        }

        if (conditionXMax) {
            this.element.style.left = this.percent == true ? this.limitXEnd : (this.limitXEnd) + "px";
            this.cbLimitXEnd();
        }

        if (conditionYMin) {
            this.element.style.top = this.percent == true ? this.limitYStart : (this.limitYStart) + "px";
            this.cbLimitYStart();
        }

        if (conditionYMax) {
            this.element.style.top = this.percent == true ? this.limitYEnd : (this.limitYEnd) + "px";
            this.cbLimitYEnd();
        }

        this.positions.left = this.element.offsetLeft;
        this.positions.top = this.element.offsetTop;

        this.diff.left = this.element.offsetLeft - this.startPositions.left;
        this.diff.top = this.element.offsetTop - this.startPositions.top;
        if (this.previous) {
            this.sides.x = (this.element.offsetLeft > this.startPositions.left) ? "right" : (this.element.offsetLeft < this.startPositions.left) ? "left" : "middle";
            this.sides.y = (this.element.offsetTop > this.startPositions.top) ? "bottom" : (this.element.offsetTop < this.startPositions.top) ? "top" : "middle";
        }

        this.cbMove({ x: x, y: y }, this.previous, this.diff, this.directions, this.sides);

        if (!this.previous) {
            this.previous = {
                x: 0,
                y: 0,
                left: 0,
                top: 0
            }
        }

        this.previous.x = x;
        this.previous.y = y;
        this.previous.left = this.element.offsetLeft;
        this.previous.top = this.element.offsetTop;

        if (this.cbCheckMove({ x: x, y: y }, this.previous, this.diff, this.directions, this.sides)) {
            this.dispose();
            this.cbEnd();
        }
    },
    onUp: function (e) {
        this.removeEvents();
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.triggeringElement.addEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.triggeringElement.style['cursor'] = 'grab';
        if (this.returnToStart == true) {
            this.replace();
        }
        this.cbUp();
        if (this.cbCheckUp(this.previous, this.diff, this.directions, this.sides)) {
            this.cbEnd();
            this.dispose();
        }
    },
    replace: function () {
        this.diff = {
            left: 0,
            top: 0
        }
        this.directions = {
            x: "middle",
            y: "middle"
        }
        this.sides = {
            x: "middle",
            y: "middle"
        }
        this.positions = {
            left: this.startPositions.left,
            top: this.startPositions.top,
        }
        this.element.style.left = this.startPositions.left + (this.percent == true ? "%" : "px");
        this.element.style.top = this.startPositions.top + (this.percent == true ? "%" : "px");
    },
    desactivate: function () {
        this.triggeringElement.style['pointer-events'] = 'none';
    },
    activate: function () {
        this.triggeringElement.style['pointer-events'] = '';
    },
    addEvents: function () {
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND, this.handleUp);
        this.onMoveUpReceiver.addEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        this.onMoveUpReceiver.addEventListener(Constants.UP_TOUCHEND, this.handleUp);
    },
    removeEvents: function () {
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND, this.handleUp);
    },
    dispose: function () {
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.triggeringElement.style['cursor'] = '';
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND, this.handleUp);
    },
    reset: function () {
        this.replace();
        this.previous = null;
        this.triggeringElement.addEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.triggeringElement.style['cursor'] = 'grab';
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND, this.handleUp);
        this.cbReset();
    },
    getLimit: function (value, dir, extreme) {
        if (this.percent == true) {
            if (value == undefined || (value && ((typeof value == "string" && value.indexOf("%") == -1) || (typeof value == "number")))) {
                if (value == undefined) {
                    return (extreme == "min") ? "0%" : "100%";
                } else {
                    return (this.pxToPercent(parseInt(value), dir)).toString() + "%";
                }
            } else {
                return value;
            }
        } else {
            if (value == undefined) {
                if (dir == "x" && extreme == "min") {
                    return this.positionsReceiver.offsetLeft;
                }
                else if (dir == "x" && extreme == "max") {
                    return (this.positionsReceiver.offsetLeft + this.positionsReceiver.offsetWidth - this.element.offsetWidth);
                }
                else if (dir == "y" && extreme == "min") {
                    return this.positionsReceiver.offsetTop;
                } else {
                    return (this.positionsReceiver.offsetTop + this.positionsReceiver.offsetHeight - this.element.offsetHeight);
                }
            } else {
                if (typeof value == "string" && value.indexOf("%") != -1) {
                    return (this.percentToPx(value, dir));
                } else {
                    return value;
                }

            }
        }
    },
    pxToPercent: function (value, dir) {
        var parent = this.element.parentNode,
            dim = dir == "x" ? parent.offsetWidth : parent.offsetHeight,
            percent = value / dim * 100;

        return (this.around == true) ? Math.round(percent) : percent;
    },
    percentToPx: function (value, dir) {
        var parent = this.element.parentNode,
            dim = dir == "x" ? parent.offsetWidth : parent.offsetHeight,
            percent = parseInt(value),
            px = percent / 100 * dim;

        return (this.around == true) ? Math.round(px) : px;
    }
};

// -> Position par rapport à l'écran d'un élément
function getOffset(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
        left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
    };
}

// -> Récupère la position du curseur par rapport à un élément
function getCursorIn(event, elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}

function getClosest(tab, goal) {
    var c = tab.reduce(function (prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return c;
}

function overLap(overEl, overLapped, percent, axis) {
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

        posXOverlapped = overLapped["offsetLeft"],
        posYOverlapped = overLapped["offsetTop"],
        dimXOverlapped = overLapped["offsetWidth"],
        dimYOverlapped = overLapped["offsetHeight"],
        rightOverlapped = posXOverlapped + dimXOverlapped,
        bottomOverlapped = posYOverlapped + dimYOverlapped;



    var isOverX = (partRightOver1 >= posXOverlapped && partRightOver2 <= rightOverlapped),
        isOverY = (partBottomOver1 >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
        betweenX = (posXOver >= posXOverlapped && partRightOver2 <= rightOverlapped),
        betweenY = (posYOver >= posYOverlapped && partBottomOver2 <= bottomOverlapped),
        condition = (axis == "x") ? (isOverX && betweenY) : (axis == "y") ? (isOverY && betweenX) : (isOverX && isOverY);

    return condition;
}