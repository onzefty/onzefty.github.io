// -> Moteur gestionnaire de déplacement de "cartes" à gauche/droite
// utilise jQuery pour les événements + movable.js pour le déplacement
function Cards(props) {
    var defaultOptions = {
        datas: [],
        cards: null,
        leftEl:null,
        rightEl:null,
        gaugeEl:null,
        angleMin:0,
        angleMax:8,
        translateLeftMin:[0,0],
        translateLeftMax:[0,0],
        translateRightMin:[0,0],
        translateRightMax:[0,0],
        delay:"front",
        scaleMin:1,
        scaleMax:1,
        cbEnd: function () { },
        cbMove: function () { },
        cbReset: function () { }
    }
    this.options = Object.assign(defaultOptions, props);
    this.current = 1;
    this.total = this.options.cards.length;
    this.timeout;
    this.disposed = false;
    this.success = false;
    this.finished = false;
    this.cards = [];

    this.init();
    this.update();
}

Cards.prototype = {
    init: function () {
        for (var c = 1; c <= this.options.cards.length; c++) {
            var card = this.options.cards[c-1];
            var defaultOptions = {
                element:card,
                num:c,
                delay:this.options.delay,
            }
            var options = Object.assign(defaultOptions,this.options.datas[c-1]);
            this.cards.push(new Card(options,this.options));
            this.cards[c-1].movable = new Movable({
                element:card,
                cbMove:this.onMove.bind(this,this.cards[c-1]),
                cbUp:this.onUp.bind(this,this.cards[c-1]),
                limitXStart:this.options.leftEl.offsetLeft,
                limitXEnd:this.options.rightEl.offsetLeft,
                limitYStart:card.offsetTop,
                limitYEnd:card.offsetTop
            })
            card.style["z-index"] = this.total-c;
            this.cards[c-1].reset().desactivate();
        }
    },
    update:function(){
        var card = this.cards[this.current-1]
        card.flip()
        var levelEls = this.options.gaugeEl.children;
        if(levelEls){
            var currentEl = this.options.gaugeEl.querySelector(".current")
            if(currentEl){
                currentEl.classList.remove("current")
            }
            levelEls[this.current-1].classList.add("current")
        }
    },
    dispose: function () {
        for (var c = 1; c <= this.cards.length; c++) {
            var card = this.cards[c - 1];
            card.style["z-index"] = "";
            card.movable.dispose()
        }
        clearTimeout(this.timeout)
        this.disposed = true;
    },
    reset: function () {
        this.currentAttempt = 1;
        this.current = 1;
        this.success = false;
        this.finished = false;
        if (this.disposed == true) {
            this.disposed = false;
            //this.addEvents();
        }
        for (var c = 1; c <= this.cards.length; c++) {
            var card = this.cards[c - 1];
            card.element.style["z-index"] = this.total-c;
            card.content.style["opacity"] = 1;
            card.reset().desactivate();
        }
        var levelEls = this.options.gaugeEl.children;
        if(levelEls){
            for(var l=1; l<=levelEls.length; l++){
                var levelEl = levelEls[l-1]
                levelEl.classList.remove("current")
                levelEl.classList.remove("right")
                levelEl.classList.remove("wrong")
            }
        }
        this.options.cbReset();
        return this;
    },
    validate: function () {
        var card = this.cards[this.current-1]
        var levelEls = this.options.gaugeEl.children;
        var levelEl = levelEls[this.current-1]
        if(levelEl){
            levelEl.classList.remove("current")
        }
        if(card.side===card.movable.sides.x){
            card.isRight()
            if(levelEl){
                levelEl.classList.add("right")
            } 
        } else {
            card.isWrong()
            if(levelEl){
                levelEl.classList.add("wrong")
            }
        }
        card.desactivate();
        this.timeout = setTimeout(function(){
            card.content.style.opacity = 0;
            this.next()
        }.bind(this),1500)
    },
    next:function(){
        if(this.current<this.total){
            this.current++;
            this.update();
        } else {
            var corrects = this.cards.filter(function(card){ return card.correct===true}).length;
            this.success = corrects>=this.total/2;
            this.finished = true;
            this.options.cbEnd()
        }
    },
    onMove: function (card, e) {
        card.update()
    },
    onUp: function (card, e) {
        var element = card.movable.sides.x === "left" ? this.options.leftEl : this.options.rightEl;
        var isOverlapped = overLap(card.element,element,"45%")
        if(isOverlapped){
            card.element.style.left = element.offsetLeft+"px"
            card.update()
            this.validate()
        } else {
            card.replace().activate();
        }
    }
}

function Card(props,mains) {
    this.element = props.element;
    this.content = this.element.querySelector(".card-content");
    this.mains = mains;
    this.num = props.num;
    this.side = props.side;
    this.correct = null;
    this.delay = props.delay;
    this.timeout;

    this.handleActivate = this.activate.bind(this);
}

Card.prototype = {
    select:function(){
        this.isSelected = true;
        this.addClass("selected");
    },
    unselect:function(){
        this.isSelected = false;
        this.removeClass("selected");
    },
    update:function(){
        var side = this.movable.sides.x;
        this.element.setAttribute("side",side);
        if(this.content){
            var diffScale = this.mains.scaleMax - this.mains.scaleMin,
            diffRotate = this.mains.angleMax - this.mains.angleMin,
            min = (side==="left") ? this.movable.limitXStart : this.movable.startPositions.left,
            max = (side==="left") ? this.movable.startPositions.left : this.movable.limitXEnd,
            percent = Math.round(((this.element.offsetLeft-min)/(max-min))*100);

            percent = Math.min(100,Math.abs(percent))

            if(side==="left"){
                percent = 100 - percent;
            }

            var scale = this.mains.scaleMin+(percent/100*(diffScale));
            var angle = this.mains.angleMin-(percent/100*(diffRotate));

            var translateMinArrays = side==="left" ? this.mains.translateLeftMin : this.mains.translateRightMin;
            var translateMaxArrays = side==="left" ? this.mains.translateLeftMax : this.mains.translateRightMax;

            if(Array.isArray(translateMinArrays) && Array.isArray(translateMaxArrays)){
                var diffTranslateX = translateMaxArrays[0] - translateMinArrays[0];
                var diffTranslateY = translateMaxArrays[1] - translateMinArrays[1];
                var translateX = Math.abs(translateMinArrays[0]-(percent/100*(diffTranslateX)));
                var translateY = Math.abs(translateMinArrays[1]-(percent/100*(diffTranslateY)));
                this.content.style["translate"] = translateX+"px "+translateY+"px";
            }

            if(side==="right"){
                angle = -angle;
            }

            this.content.style["scale"] = scale+" "+scale;
            this.content.style["rotate"] = angle+"deg";
        }
    },
    flip:function(){
        if(!this.element.classList.contains("flipped")){
            this.element.classList.add("flipped");
            this.trigger();
        }
    },
    trigger:function(){
        var delay = null;
        if(typeof this.delay == "number"){
            if(this.delay > 0){
                delay = this.delay;
            }
        }
        else if(typeof this.delay == "string"){
            var animated = document.querySelector("#s4-card-1").querySelector("."+this.delay);
            if(animated){
                var datas = window.getComputedStyle(animated).getPropertyValue("animation-duration")
                if(datas.length > 0){
                    delay = parseFloat(datas)*1000;
                }
            }  
        }
        if(delay){
            this.timeout = setTimeout(this.handleActivate,delay);
        } else {
            this.activate();
        }
    },
    reset:function(){
        this.correct = null;
        this.element.classList.remove("unselected");
        this.element.classList.remove("selected");
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.element.classList.remove("corrected");
        this.element.classList.remove("flipped");
        this.element.removeAttribute("side");
        this.replace();
        return this;
    },
    replace(){
        this.element.removeAttribute("side");
        this.movable.replace();
        if(this.content){
            this.content.style["scale"] = "";
            this.content.style["rotate"] = "";
            this.content.style["translate"] = "";
        }
        return this;
    },
    activate:function(e){
        this.element.style["pointer-events"] = "";
    },
    desactivate:function(){
        this.element.style["pointer-events"] = "none";
    },
    isRight: function () {
        this.correct = true;
        this.addClass("right");
    },
    isWrong: function () {
        this.correct = false;
        this.addClass("wrong");
    },
    isCorrected: function(){
        this.correct = true;
        this.addClass("corrected");
    },
    addClass: function (cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        var tab = !Array.isArray(cl) ? [cl] : cl;
        for(var t=1; t<=tab.length; t++){
            this.element.classList.add(tab[t-1]);
        }
    },
    removeClass: function (cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        var tab = !Array.isArray(cl) ? [cl] : cl;
        for(var t=1; t<=tab.length; t++){
            this.element.classList.remove(tab[t-1]);
        }
    }
}