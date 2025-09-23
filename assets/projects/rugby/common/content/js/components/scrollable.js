//@ Utilise Constants
class Scrollable {
    constructor(props){
        var defaultOptions = {
            scrollable: document.createElement("div"),
            cursor: document.createElement("div"),
            each:"10%",
            current:null,
            cbScrolling: function () { },
            cbReset: function () { }
        }
        this.options = Object.assign(defaultOptions, props);

        this.cursorWrap = this.options.cursor.parentNode;
        this.scrollableWrap = this.options.scrollable.parentNode;
        this.disabled = false;
        
        Object.defineProperty(this, 'getDatas', {
            get() {
                const cursorHeight = this.options.cursor.offsetHeight;
                const cursorWrapHeight = this.cursorWrap.offsetHeight;
                const scrollableHeight = this.options.scrollable.offsetHeight;
                const scrollableWrapHeight = this.scrollableWrap.offsetHeight;
                const scrollableMax = 0;
                const scrollableMin = scrollableWrapHeight-scrollableHeight;
                const cursorMin = 0;
                const cursorMax = cursorWrapHeight-cursorHeight;
                const each = typeof this.options.each == "string" ? parseFloat(this.options.each) : this.options.each/Math.abs(scrollableMin)*100;
                const min = 0;
                const max = 100/each;
                return {
                    cursorHeight:cursorHeight,
                    cursorWrapHeight:cursorWrapHeight,
                    cursorMin:cursorMin,
                    cursorMax:cursorMax,
                    cursorEach:each/100*(cursorMax-cursorMin),
                    scrollableHeight:scrollableHeight,
                    scrollableWrapHeight:scrollableWrapHeight,
                    scrollableMax:scrollableMax,
                    scrollableMin:scrollableMin,
                    scrollableEach:each/100*(scrollableMin-scrollableMax),
                    min:min,
                    max:max
                }
            }
        });

        Object.defineProperty(this, 'getPosY', {
            get() {
                return this.options.cursor.posY;
            }
        });

        this.current = typeof this.options.current == "number" ? this.options.current : 0;

        this.handleWheel = this.onWheel.bind(this);
        this.handleDown = this.onDown.bind(this);
        this.handleMove = this.onMove.bind(this);
        this.handleUp = this.onUp.bind(this);

        this.reset();
        this.enable();
    }

    renderScroll(){
        const datas = this.getDatas;
        const value = this.current*datas.scrollableEach;
        this.options.scrollable.style["transform"] = "translateY("+(value)+"px)";
        this.options.scrollable.setAttribute("pos",value);
        this.options.cbScrolling();
    }

    renderCursor(){
        const datas = this.getDatas;
        const cursorValue = this.current*datas.cursorEach;
        this.options.cursor.style["transform"] = "translateY("+(cursorValue)+"px)";
        this.options.cursor.setAttribute("pos",cursorValue);
    }

    enable(){
        this.options.cursor.addEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.scrollableWrap.addEventListener("wheel", this.handleWheel);
    }

    onWheel(e){
        if(this.disabled==true){
            return;
        }
        const datas = this.getDatas;
        const direction = e.deltaY>0?"forwards":"backwards";
        this.current = direction=="forwards" ? Math.min(datas.max,this.current+1) : Math.max(datas.min,this.current-1);
        this.renderScroll();
        this.renderCursor();
    }

    onDown(e){
        this.options.cursor.posY = getCursorIn(e, document.body).y;
        document.addEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        document.addEventListener(Constants.UP_TOUCHEND, this.handleUp);
    }

    onMove(e){
        const datas = this.getDatas;
        const posY = getCursorIn(e, document.body).y;
        const prevPosY = this.getPosY;
        const direction = posY>prevPosY?"forwards":"backwards";
        const pos = parseFloat(this.options.cursor.getAttribute("pos"));
        const value = Math.max(datas.cursorMin,(Math.min(datas.cursorMax,(pos+(posY-prevPosY)))));
        this.options.cursor.style["transform"] = "translateY("+(value)+"px)";

        const percent = Math.round((value-datas.cursorMin)/(datas.cursorMax-datas.cursorMin)*100);
        const scrollValue = Math.round(percent/100*(datas.scrollableMin-datas.scrollableMax));
        this.current = Math.round(scrollValue/datas.scrollableEach);
        this.renderScroll();
    }

    onUp(e){
        document.removeEventListener(Constants.MOVE_TOUCHMOVE, this.handleMove);
        document.removeEventListener(Constants.UP_TOUCHEND, this.handleUp);
        this.renderCursor();
    }

    goTo(percent){
        if(this.disabled==true){
            return;
        }
        const datas = this.getDatas;
        const scrollValue = Math.round(percent/100*(datas.scrollableMin-datas.scrollableMax));
        this.current = Math.round(scrollValue/datas.scrollableEach);
        this.renderScroll();
        this.renderCursor();
    }

    addEvents(){
        this.options.cursor.addEventListener(Constants.DOWN_TOUCHSTART, this.handleDown);
        this.scrollableWrap.addEventListener("wheel", this.handleWheel);
    }

    removeEvents(){

    }

    reset(){
        const percent = Math.round(this.getDatas.scrollableWrapHeight/this.getDatas.scrollableHeight*100);
        if(percent>=100){
            this.disabled = true;
            this.cursorWrap.parentNode.style.display = "none";
        } else {
            this.disabled = false;
            this.cursorWrap.parentNode.style.display = "";
            this.options.cursor.style.height = (percent/100*(this.getDatas.cursorWrapHeight))+"px";
            this.current = 0;
            this.renderScroll();
            this.renderCursor();    
        }
    }

    dispose(){

    }
}

// -> Récupère la position du curseur par rapport à un élément
function getCursorIn(event, elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}
