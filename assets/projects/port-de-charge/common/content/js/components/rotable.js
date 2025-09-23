function Rotable(props){
    this.element = props.element;
    this.triggeringElement = props.triggeringElement != undefined ? props.triggeringElement : this.element;
    this.positionsReceiver = props.positionsReceiver != undefined ? props.positionsReceiver : this.element.parentNode;
    this.every = props.every != undefined ? props.every : 1;
    this.snapValue = props.snapValue != undefined && (360%props.snapValue) == 0 ? props.snapValue : null;
    this.angleStart = props.angleStart != undefined ? props.angleStart : null;
    this.angleMax = props.angleMax != undefined ? props.angleMax : null;
    this.angleMin = props.angleMin != undefined ? props.angleMin : null;
    this.cannotReset = props.cannotReset != undefined ? props.cannotReset : false;
    this.reverse = props.reverse != undefined ? true : false;
    this.customOnRotate = typeof props.customOnRotate == 'function' ? props.customOnRotate : function() {};
    this.customOnDown = typeof props.customOnDown == 'function' ? props.customOnDown : function() {};
    this.customOnUp = typeof props.customOnUp == 'function' ? props.customOnUp : function() {};

    this.angleCurrent = this.angleStart != null ? this.angleStart : 0;
    this.angleLast = this.angleStart != null ? this.angleStart : 0;
    this.anglePrevious = 0;

    this.handleDown = this.onDown.bind(this);
    this.handleMove = this.onMove.bind(this);
    this.handleUp = this.onUp.bind(this);

    this.triggeringElement.style["transform"] = "rotate("+(this.angleStart)+"deg)";
    this.triggeringElement.style["-moz-transform"] = "rotate("+(this.angleStart)+"deg)";
    this.triggeringElement.style["-webkit-transform"] = "rotate("+(this.angleStart)+"deg)";
    this.triggeringElement.style["-o-transform"] = "rotate("+(this.angleStart)+"deg)";
 
    $(this.triggeringElement).off().on(Constants.DOWN_TOUCHSTART,this.handleDown);
    this.triggeringElement.style["cursor"] = "grab";
    $(this.positionsReceiver).off();
}   

Rotable.prototype = {
    onDown:function(e) {
        e.preventDefault();
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        this.element.style['cursor'] = 'grabbing';
        this.triggeringElement.cursor = getCursorIn(event, this.positionsReceiver);
        var to = window.getComputedStyle(this.triggeringElement).transformOrigin,
        box = this.triggeringElement.getBoundingClientRect(),
        originX = parseFloat(to.split(" ")[0]),
        originY = parseFloat(to.split(" ")[1]);
        this.triggeringElement.center = { x: (this.triggeringElement.offsetLeft+originX), y: (this.triggeringElement.offsetTop+originY) };
        this.angleLast = this.angleCurrent;

        $(this.triggeringElement).off();
        this.addEvents();
        this.customOnDown();
    },
    onMove:function(e) {
        e.preventDefault();
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;

        var m = getCursorIn(event, this.positionsReceiver);
        var x = m.x - this.triggeringElement.center.x,
        y = m.y - this.triggeringElement.center.y,
        x2 = this.triggeringElement.cursor.x - this.triggeringElement.center.x,
        y2 = this.triggeringElement.cursor.y - this.triggeringElement.center.y,
        r = Math.atan2(y, x) - Math.atan2(y2,x2) + this.degToRad(this.angleLast),
        d = this.radToDeg(r),
        direction = ((d<this.anglePrevious)) ? "down" : "up";

        d = (this.reverse==true) ? -(360 - d) : d;
        var condition = (this.cannotReset==true) ? (Math.abs(this.anglePrevious-d)>100) : false;

        if(parseInt(d%this.every)==0){
            this.angleCurrent = (condition && direction=="down") ? 0 : (condition && direction=="up") ? 360 : d;
            this.triggeringElement.style["transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-moz-transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-webkit-transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-o-transform"] = "rotate("+(this.angleCurrent)+"deg)";
            if(this.angleMin!=null && d<this.angleMin && !condition && this.angleMin!=0){
                this.angleCurrent = this.angleMin;
                this.triggeringElement.style["transform"] = "rotate("+(this.angleMin)+"deg)";
                this.triggeringElement.style["-moz-transform"] = "rotate("+(this.angleMin)+"deg)";
                this.triggeringElement.style["-webkit-transform"] = "rotate("+(this.angleMin)+"deg)";
                this.triggeringElement.style["-o-transform"] = "rotate("+(this.angleMin)+"deg)";
            }
             if(this.angleMax!=null && d>this.angleMax && !condition && this.angleMax!=360){
                this.angleCurrent = this.angleMax;
                this.triggeringElement.style["transform"] = "rotate("+(this.angleMax)+"deg)";
                this.triggeringElement.style["-moz-transform"] = "rotate("+(this.angleMax)+"deg)";
                this.triggeringElement.style["-webkit-transform"] = "rotate("+(this.angleMax)+"deg)";
                this.triggeringElement.style["-o-transform"] = "rotate("+(this.angleMax)+"deg)";
            }
            if(!condition){
                this.customOnRotate(d);    
            }
            this.anglePrevious = (condition && direction=="down") ? 360 : (condition && direction=="up") ? 0 : d;
        }
    },
    onUp:function(e) {
        if(this.snapValue!=null){
            var t = [],
            m = 360/this.snapValue;
            for(var i=1; i<=m; i++){
                t[i-1] = (this.snapValue*i);
            }
            var closest = getClosest(t,this.angleCurrent);
            this.angleCurrent = closest;
            this.triggeringElement.style["transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-moz-transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-webkit-transform"] = "rotate("+(this.angleCurrent)+"deg)";
            this.triggeringElement.style["-o-transform"] = "rotate("+(this.angleCurrent)+"deg)";
        }
        this.customOnUp(this.angleCurrent);
        this.triggeringElement.style["cursor"] = "grab";
        this.removeEvents();
        $(this.triggeringElement).off().on(Constants.DOWN_TOUCHSTART,this.handleDown);
    },
    addEvents:function() {
        $(this.positionsReceiver).off(Constants.MOVE_TOUCHMOVE).on(Constants.MOVE_TOUCHMOVE,this.handleMove);
        $(this.positionsReceiver).off(Constants.UP_TOUCHEND).on(Constants.UP_TOUCHEND, this.handleUp);
    },
    removeEvents:function() {
        $(this.positionsReceiver).off();
    },
    dispose:function(){
        $(this.triggeringElement).off();
        this.triggeringElement.style["cursor"] = "";
        $(this.positionsReceiver).off();
    },
    radToDeg:function(radians){
        var degrees = radians * 180 / Math.PI;
        return degrees > 0.0 ? degrees%360 : (degrees + 360.0)%360;
    },
    degToRad: function(degrees) {
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
function getCursorIn(event,elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}

function getClosest(tab,goal){
    var c = tab.reduce(function(prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return c;
}