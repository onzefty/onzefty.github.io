function Rotable(props) {
    this.element = props.element;
    this.triggeringElement = props.triggeringElement != undefined ? props.triggeringElement : this.element;
    this.positionsReceiver = props.positionsReceiver != undefined ? props.positionsReceiver : this.element.parentNode;
    this.every = props.every != undefined ? props.every : 1;
    this.snapValue = props.snapValue != undefined && (360 % props.snapValue) == 0 ? props.snapValue : null;
    this.angleStart = typeof props.angleStart == "number" ? props.angleStart : null;
    this.angleMax = typeof props.angleMax == "number" ? props.angleMax : null;
    this.angleMin = typeof props.angleMin == "number" ? props.angleMin : null;
    this.cannotReset = props.cannotReset != undefined ? props.cannotReset : false;
    this.reverse = props.reverse != undefined ? true : false;
    this.returnToStart = typeof props.returnToStart == 'boolean' ? props.returnToStart : false;
    this.resetCondition = typeof props.resetCondition == 'boolean' ? props.resetCondition : false;
    this.cbRotate = typeof props.cbRotate == 'function' ? props.cbRotate : function () { };
    this.cbRotateUp = typeof props.cbRotateUp == 'function' ? props.cbRotateUp : function () { };
    this.cbRotateDown = typeof props.cbRotateDown == 'function' ? props.cbRotateDown : function () { };
    this.cbDown = typeof props.cbDown == 'function' ? props.cbDown : function () { };
    this.cbUp = typeof props.cbUp == 'function' ? props.cbUp : function () { };
    this.cbReset = typeof props.cbReset == 'function' ? props.cbReset : function () { };
    

    this.angleCurrent = this.angleStart != null ? this.angleStart : 0;
    this.angleLast = this.angleStart != null ? this.angleStart : 0;
    this.anglePrevious = 0;
    this.turns = 0;
    this.percent = 0;
    this.direction;
    this.directionPrevious;
    this.started = false;
    this.isActive = true;

    this.handleDown = this.onDown.bind(this);
    this.handleMove = this.onMove.bind(this);
    this.handleUp = this.onUp.bind(this);

    this.init();
}

Rotable.prototype = {
    onDown: function (e) {
        e.preventDefault();
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        this.element.style['cursor'] = 'grabbing';
        this.triggeringElement.cursor = getCursorIn(event, this.positionsReceiver);
        var to = window.getComputedStyle(this.triggeringElement).transformOrigin,
            box = this.triggeringElement.getBoundingClientRect(),
            originX = parseFloat(to.split(" ")[0]),
            originY = parseFloat(to.split(" ")[1]);
        this.triggeringElement.center = { x: (this.triggeringElement.offsetLeft + originX), y: (this.triggeringElement.offsetTop + originY) };
        this.angleLast = this.angleCurrent;

        $(this.triggeringElement).off();
        this.addEvents();
        this.cbDown();
    },
    onMove: function (e) {
        e.preventDefault();
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;

        var m = getCursorIn(event, this.positionsReceiver);
        var x = m.x - this.triggeringElement.center.x,
        y = m.y - this.triggeringElement.center.y,
        x2 = this.triggeringElement.cursor.x - this.triggeringElement.center.x,
        y2 = this.triggeringElement.cursor.y - this.triggeringElement.center.y,
        r = Math.atan2(y, x) - Math.atan2(y2, x2) + this.degToRad(this.angleLast),
        d = this.radToDeg(r),
        closeTo360D = (360 - d) < 5,
        closeTo360P = (360 - this.anglePrevious) < 5,
        isDBelowPrevious = (d < this.anglePrevious),
        diffAngles = d == this.anglePrevious ? "same" : d < this.anglePrevious ? "less" : "more";

        if(this.cannotReset==true){
            if((((d-this.anglePrevious) > 350) && this.turns==0 && Math.floor(this.anglePrevious)==0) ||
            (this.turns==0 && this.direction=="down" && d>300 && this.anglePrevious<50 )
            ){
                this.isActive = false;
            } else if(this.isActive==false && d>this.anglePrevious && (d-this.anglePrevious) < 2) {
                this.isActive = true;
            }
        }

        if (this.started == true) {
            if ((closeTo360D && this.anglePrevious == 0) || (!closeTo360P && diffAngles == "less")) {
                this.direction = "down";
            }
            else if ((closeTo360P && d == 0) || (!closeTo360D && diffAngles == "more")) {
                this.direction = "up";
            }
        }

        d = (this.reverse == true) ? -(360 - d) : d;

        if (parseInt(d % this.every) == 0 && this.isActive==true) {
            this.angleCurrent = d;
            this.setAngle(this.angleCurrent);
            if (this.angleMin != null && d < this.angleMin && !this.resetCondition && this.angleMin != 0) {
                this.angleCurrent = this.angleMin;
                this.setAngle(this.angleMin);
            }
            if (this.angleMax != null && d > this.angleMax && !this.resetCondition && this.angleMax != 360) {
                this.angleCurrent = this.angleMax;
                this.setAngle(this.angleMax);
            }
            if (this.anglePrevious > d && (this.directionPrevious == "up" && closeTo360D == false && closeTo360P == true && diffAngles == "less")) {
                this.turns++;
            }
            else if (this.anglePrevious < d && (this.directionPrevious == "down" && closeTo360D == true && closeTo360P == false && diffAngles == "more")) {
                this.turns = Math.max(0,this.turns-1)
            }
            this.percent = Math.round(this.angleCurrent/360*100);
            this.cbRotate(d,this.percent);
            if (this.direction == "up") {
                this.cbRotateUp(d);
            }
            else if (this.direction == "down") {
                this.cbRotateDown(d);
            }
            this.anglePrevious = d;
            this.directionPrevious = this.direction;
            if (this.started == false && diffAngles != "same") {
                this.started = true;
            }
        }
    },
    onUp: function (e) {
        if (this.snapValue != null) {
            var t = [],
                m = 360 / this.snapValue;
            for (var i = 1; i <= m; i++) {
                t[i - 1] = (this.snapValue * i);
            }
            var closest = getClosest(t, this.angleCurrent);
            this.angleCurrent = closest;
            this.setAngle(this.angleCurrent);
            this.percent = Math.round(this.angleCurrent/360*100);
            this.cbRotate(this.angleCurrent,this.percent);
        }
        if(this.returnToStart ===true){
            this.angleCurrent = this.angleStart;
            this.setAngle(this.angleCurrent);
        }
        this.triggeringElement.style["cursor"] = "grab";
        this.removeEvents();
        $(this.triggeringElement).off().on(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.started = false;
        this.direction = undefined;
        this.directionPrevious = undefined;
        this.cbUp(this.angleCurrent,this.percent);
    },
    setAngle: function (angle) {
        this.triggeringElement.style["rotate"] = angle+"deg";
    },
    desactivate: function () {
        this.triggeringElement.style['pointer-events'] = 'none';
    },
    activate: function () {
        this.triggeringElement.style['pointer-events'] = '';
    },
    addEvents: function () {
        $(this.positionsReceiver).off(Constants.MOVE_TOUCHMOVE).on(Constants.MOVE_TOUCHMOVE, this.handleMove);
        $(this.positionsReceiver).off(Constants.UP_TOUCHEND).on(Constants.UP_TOUCHEND, this.handleUp);
    },
    removeEvents: function () {
        $(this.positionsReceiver).off();
    },
    dispose: function () {
        $(this.triggeringElement).off();
        this.triggeringElement.style["cursor"] = "";
        $(this.positionsReceiver).off();
    },
    init: function () {
        this.setAngle(this.angleStart);
        $(this.triggeringElement).off().on(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.triggeringElement.style["cursor"] = "grab";
        $(this.positionsReceiver).off();
    },
    reset: function () {
        this.setAngle(this.angleStart);
        this.angleCurrent = this.angleStart != null ? this.angleStart : 0;
        this.angleLast = this.angleStart != null ? this.angleStart : 0;
        this.anglePrevious = 0;
        this.turns = 0;
        this.percent = 0;
        this.direction;
        this.directionPrevious;
        this.started = false;
        $(this.triggeringElement).off().on(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.cbReset();
    },
    radToDeg: function (radians) {
        var degrees = radians * 180 / Math.PI;
        return degrees > 0.0 ? degrees % 360 : (degrees + 360.0) % 360;
    },
    degToRad: function (degrees) {
        return degrees * Math.PI / 180;
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