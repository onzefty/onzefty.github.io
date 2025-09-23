function Movable(props){
    this.element = props.element;
    this.triggeringElement = props.triggeringElement != undefined ? props.triggeringElement : this.element;
    this.positionsReceiver = props.positionsReceiver != undefined ? props.positionsReceiver : this.element.parentNode;
    this.onMoveUpReceiver = props.onMoveUpReceiver != undefined ? props.onMoveUpReceiver : document;
    this.windowReceiver = props.windowReceiver != undefined ? props.windowReceiver : window;
    this.around = props.around != undefined ? true : false;
    this.percent = props.percent != undefined ? true : false;
    this.returnToStart = props.returnToStart != undefined ? true : false;
    this.snapXValues = Array.isArray(props.snapXValues) ? props.snapXValues : null;
    this.snapYValues = Array.isArray(props.snapYValues) ? props.snapYValues : null;
    this.customOnDown = props.customOnDown != undefined && typeof props.customOnDown == 'function' ? props.customOnDown.bind(this) : function(){},
    this.customOnMove = props.customOnMove != undefined && typeof props.customOnMove == 'function' ? props.customOnMove.bind(this) : function(){},
    this.customOnUp = props.customOnUp != undefined && typeof props.customOnUp == 'function' ? props.customOnUp.bind(this) : function(){};
    this.customOnCheck = props.customOnCheck != undefined && typeof props.customOnCheck == 'function' ? props.customOnCheck : function(){return false};
    this.customOnEnd = props.customOnEnd != undefined && typeof props.customOnEnd == 'function' ? props.customOnEnd : function(){};
    this.startPositions = {
        left:this.percent==true ? this.pxToPercent(this.element.offsetLeft,"x") : this.element.offsetLeft,
        top:this.percent==true ? this.pxToPercent(this.element.offsetTop,"y") : this.element.offsetTop
    };

    this.limitXStart = this.getLimit(props.limitXStart,"x","min");
    this.limitXEnd = this.getLimit(props.limitXEnd,"x","max");
    this.limitYStart = this.getLimit(props.limitYStart,"y","min");
    this.limitYEnd = this.getLimit(props.limitYEnd,"y","max");

    this.handleDown = this.onDown.bind(this);
    this.handleMove = this.onMove.bind(this);
    this.handleUp = this.onUp.bind(this);

    this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
    this.triggeringElement.addEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
    this.triggeringElement.style['cursor'] = 'grab';
    this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE,this.handleMove);
    this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND,this.handleUp);
}

Movable.prototype = {
    onDown:function(e){
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e;
        this.triggeringElement.style['cursor'] = 'grabbing';
        this.triggeringElement.cursor = getCursorIn(event, this.element);
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
        this.addEvents();
        this.customOnDown();
    },
    onMove:function(e) {
        var event = (e.originalEvent && e.originalEvent.touches) ? e.originalEvent.touches[0] : (e.touches) ? e.touches[0] : e,
            cursor = getCursorIn(event, this.positionsReceiver),
            x = cursor.x - this.triggeringElement.cursor.x,
            y = cursor.y - this.triggeringElement.cursor.y;
            
        this.element.style.left = this.percent==true ? this.pxToPercent(x,"x")+"%" : this.around=true ? (Math.round(x))+"px" : (x)+"px";
        this.element.style.top = this.percent==true ? this.pxToPercent(y,"y")+"%" : this.around=true ? (Math.round(y))+"px" : (y)+"px";

        var l = this.percent==true ? this.pxToPercent(this.element.offsetLeft,"x") : this.element.offsetLeft,
            t = this.percent==true ? this.pxToPercent(this.element.offsetTop,"y") : this.element.offsetTop,
            w = this.percent==true ? this.pxToPercent(this.element.offsetWidth,"x") : this.element.offsetWidth,
            h = this.percent==true ? this.pxToPercent(this.element.offsetHeight,"y") : this.element.offsetHeight,
            minX = this.percent==true ? parseFloat(this.limitXStart) : this.limitXStart,
            maxX = this.percent==true ? parseFloat(this.limitXEnd) : this.limitXEnd,
            minY = this.percent==true ? parseFloat(this.limitYStart) : this.limitYStart,
            maxY = this.percent==true ? parseFloat(this.limitYEnd) : this.limitYEnd,
            conditionXMin = (l < minX),
            conditionXMax = (l > maxX),
            conditionYMin = (t < minY),
            conditionYMax = (t > maxY);

        if (conditionXMin) {
            this.element.style.left = this.percent==true ? this.limitXStart : (this.limitXStart)+"px";
        }

        if (conditionXMax) {
            this.element.style.left = this.percent==true ? this.limitXEnd : (this.limitXEnd)+"px";
        }

        if (conditionYMin) {
            this.element.style.top = this.percent==true ? this.limitYStart : (this.limitYStart)+"px";
        }

        if (conditionYMax) {
            this.element.style.top = this.percent==true ? this.limitYEnd : (this.limitYEnd)+"px";
        }

        this.customOnMove({x:x,y:y},this.element.prev);

        if(this.element.prev==undefined){
            this.element.prev = {}; 
            this.element.prevPos = {};  
        }

        this.element.prev.x = x;
        this.element.prev.y = y;
        this.element.prevPos.x = this.element.offsetLeft;
        this.element.prevPos.y = this.element.offsetTop;
    },
    onUp:function(e) {
        this.removeEvents();
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
        this.triggeringElement.addEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
        this.triggeringElement.style['cursor'] = 'grab';
        if(this.returnToStart==true){
        	this.replace();
        }
        if(this.snapXValues){
            var closest = getClosest(this.snapXValues,this.element.offsetLeft);
            this.element.style.left = closest+"px";
        }
        if(this.snapYValues){
            var closest = getClosest(this.snapYValues,this.element.offsetTop);
            this.element.style.top = closest+"px";
        }
        this.customOnUp();
        if(this.customOnCheck()){
            this.customOnEnd();
            this.dispose();
        }
    },
    replace:function() {
    	this.element.style.left = this.startPositions.left+(this.percent==true ? "%" : "px");
        this.element.style.top = this.startPositions.top+(this.percent==true ? "%" : "px");
    },
    desactivate:function() {
    	this.triggeringElement.style['pointer-events'] = 'none';
    },
    activate:function() {
    	this.triggeringElement.style['pointer-events'] = '';
    },
    addEvents:function() {
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE,this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND,this.handleUp);
        this.onMoveUpReceiver.addEventListener(Constants.MOVE_TOUCHMOVE,this.handleMove);
        this.onMoveUpReceiver.addEventListener(Constants.UP_TOUCHEND,this.handleUp);
    },
    removeEvents:function() {
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE,this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND,this.handleUp);
    },
    dispose:function(){
        this.triggeringElement.removeEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
        this.triggeringElement.style['cursor'] = '';
        this.onMoveUpReceiver.removeEventListener(Constants.MOVE_TOUCHMOVE,this.handleMove);
        this.onMoveUpReceiver.removeEventListener(Constants.UP_TOUCHEND,this.handleUp);
    },
    reset:function(){
        this.triggeringElement.addEventListener(Constants.DOWN_TOUCHSTART,this.handleDown);
        this.triggeringElement.style['cursor'] = 'grab';
    },
    getLimit:function(value,dir,extreme){
        if(this.percent==true){
            if(value==undefined || (value && ((typeof value == "string" && value.indexOf("%")==-1)|| (typeof value == "number")) ) ){
                if(value==undefined){
                    return (extreme=="min") ? "0%" : "100%";
                } else {
                   return (this.pxToPercent(parseInt(value),dir)).toString()+"%";
                }
            } else {
                return value;
            }
        } else {
            if(value==undefined){
                if(dir=="x" && extreme=="min"){
                    return this.positionsReceiver.offsetLeft;
                }
                else if(dir=="x" && extreme=="max"){
                    return (this.positionsReceiver.offsetLeft + this.positionsReceiver.offsetWidth - this.element.offsetWidth);
                }
                else if(dir=="y" && extreme=="min"){
                    return this.positionsReceiver.offsetTop;
                } else {
                    return (this.positionsReceiver.offsetTop + this.positionsReceiver.offsetHeight - this.element.offsetHeight);
                }
            } else {
                if(typeof value == "string" && value.indexOf("%")!=-1){
                    return (this.percentToPx(value,dir));
                } else {
                    return value;    
                }
                
            }
        }
    },
    pxToPercent:function(value,dir){
        var parent = this.element.parentNode,
        dim = dir=="x" ? parent.offsetWidth : parent.offsetHeight,
        percent = value/dim*100;

        return (this.around==true) ? Math.round(percent) : percent; 
    },
    percentToPx:function(value,dir){
        var parent = this.element.parentNode,
        dim = dir=="x" ? parent.offsetWidth : parent.offsetHeight,
        percent = parseInt(value),
        px = percent/100*dim;

        return (this.around==true) ? Math.round(px) : px; 
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