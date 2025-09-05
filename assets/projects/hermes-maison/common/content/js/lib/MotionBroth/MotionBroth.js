import {setPoints, easings, deepClone, isCubicProperty, isObject, minMax, getDomElement} from "./MotionBroth-utils.js";
import {Timeline} from "./timeline.js";

const AnimationsOptions = {
    reversed: false,
    autoplay: true,
    triggers:{
        start: () => { },
        end: () => { },
        progress: () => { },
        reset: () => { },
        render: () => { }    
    } 
};

const AnimationOptions = {
    element: null,
    properties: [],
    duration: 1000,
    delay: 0,
    easing: "linear",
    triggers:{
        start: () => { },
        end: () => { },
        progress: () => { },
        reset: () => { },
        render: () => { }    
    }
};

// REQUESTANIMATIONFRAME
const requestAnimationFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    );
})();

// CANCELANIMATIONFRAME
const cancelAnimationFrame = (function () {
    return (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (id) {
            return window.clearTimeout(id);
        }
    );
})();

const actives = [];
let animating = false;
let ID = 0;

function loopThrough(t) {
    let len = actives.length;
    let i = 0;

    while (i < len) {
        const active = actives[i]
        if (active.playing !== false) {
            active.paint(t);
            i++;
        } else {
            actives.splice(i, 1);
            len--;
        }
    }

    if (i > 0) {
        requestAnimationFrame(loopThrough);
    } else {
        animating = false;
        cancelAnimationFrame(loopThrough);
    }
}

function launch() {
    if (actives.length > 0 && animating === false) {
        animating = true;
        requestAnimationFrame(loopThrough);
    }
}

const checkOnlyZero = (currentValue) => typeof currentValue === "number" ? currentValue === 0 : currentValue.value === 0;

function resetTime(a, b) {
    a.lastTime = a.lastTime + a.timestamp - a.startTime
    a.startTime = 0
    // a.startTime = 0;
    // a.lastTime = a.currentTime + b;
}

function getEasing(easing) {
    if (Array.isArray(easing) && easing.length == 2) {
        return { forwards: easing[0], backwards: easing[1] }
    }
    else if (typeof easing == "string") {
        return { forwards: easing, backwards: easing }
    }
    else if (typeof easing == "object") {
        var obj = {}
        if (easing.forwards) {
            obj.forwards = easing.forwards
        }
        if (easing.backwards) {
            obj.backwards = easing.backwards
        }
    } else {
        return { forwards: "linear", backwards: "linear" }
    }
}

//Classe d'une Animation
class Animation {
    constructor(datas = {}){
        this.id = datas.id;
        this.element = datas.element;
        this.properties = datas.properties;
        this.delay = datas.delay;
        this.easing = typeof datas.easing === "string" && easings[datas.easing] ? datas.easing : "linear";
        this.triggers = {
            ...AnimationsOptions.triggers,
            ...datas.triggers
        };
        this.resolve = datas.resolve;
        this.reversed = datas.reversed;
        this.started = false;
        this.animating = false;
        this.finished = false;
        this.resettable = typeof datas.resettable === "boolean" ? datas.resettable : true;
        this.cubic = Array.isArray(datas.cubic) === true ? datas.cubic : false;
        this.helper = typeof datas.helper === "boolean" ? datas.helper : false;
        this.percent = 0;
        this.currentTime = 0;
        this.paused = false;
        this.startTime = 0;
        this.lastTime = 0;
        this.autoplay = datas.autoplay;
        this.duration = typeof datas.duration === "number" ? datas.duration : 1000;
        this.delayNormal = this.delay
        this.delayReversed = (this.duration - (this.duration + this.delay)) + this.delay
        this.reversedTime = typeof datas.duration === "number" ? datas.duration : 1000;
        this.unapplied = typeof datas.unapplied === "boolean" ? datas.unapplied : false;
        this.rejectSame = this.unapplied === true ? false : true;
        this.applyOnly = typeof datas.applyOnly === "boolean" ? datas.applyOnly : false;
        this.updatable = typeof datas.updatable === "boolean" ? datas.updatable : false;
        this.updated = false;
        if(this.applyOnly === true){
            this.from = getProperties(this.element,datas.properties);
            this.cubicUpdate()
            this.apply(this.from);
        } else {
            const points = setPoints(this.element,this.properties);
            this.from =  {...points.from};
            this.to =  {...points.to};
            this.change =  {...points.change};
            // this.cubicUpdate();
            this.apply(); 
        }
        
        if(this.helper === true){
            if(this.cubic){
                fakeCubicCurve(this.element,Array.isArray(this.cubicCurve)?this.cubicCurve:this.cubic)
            }
        }
    }

    cubicUpdate(){
        if(this.cubic && this.cubic.length === 2){
            const start = []
            const end = []
            let flagX = ""
            let flagY = ""
            if(this.to.translateX){
                flagX = "translateX"
                start.push(getPixels(this.element,"translateX",this.from.translateX))
                end.push(getPixels(this.element,"translateX",this.to.translateX))
                if(this.from.translateX.unit === "%"){
                    flagX+="%"
                }
            }
            if(this.to.left){
                flagX = "left"
                start.push(getPixels(this.element,"left",this.from.left))
                end.push(getPixels(this.element,"left",this.to.left))
                if(this.from.left.unit === "%"){
                    flagX+="%"
                }
            }
            if(this.to.translateY){
                flagY = "translateY"
                start.push(getPixels(this.element,"translateY",this.from.translateY))
                end.push(getPixels(this.element,"translateY",this.to.translateY))
                if(this.from.translateY.unit === "%"){
                    flagY+="%"
                }
            }
            if(this.to.top){
                flagY = "top"
                start.push(getPixels(this.element,"top",this.from.top))
                end.push(getPixels(this.element,"top",this.to.top))
                if(this.from.top.unit === "%"){
                    flagY+="%"
                }
            }
            
            //Propriétés pour la courbe SVG
            this.cubicCurve = [start,...this.cubic,end]
            this.cubicValues = []
            //Restitution des valeurs pour les calculs lors des animations
            for(let c=1; c<=this.cubicCurve.length; c++){
                let x = 0
                let y = 0
                const propX = flagX.replace("%","")
                const propY = flagY.replace("%","")
                switch(c){
                    case 1:
                        x = this.from[propX].value
                        y = this.from[propY].value
                        break;
                    case 2:
                        if(flagX.indexOf("%")!=-1){
                            const maxValue = this.cubicCurve[0][0]/(this.from[propX].value/100)
                            x = this.cubicCurve[1][0]/maxValue*100
                        } else {
                            x = this.cubicCurve[1][0]
                        }
                        if(flagY.indexOf("%")!=-1){
                            const maxValue = this.cubicCurve[0][1]/(this.from[propY].value/100)
                            y = this.cubicCurve[1][1]/maxValue*100
                        } else {
                            y = this.cubicCurve[1][1]
                        }
                        break;
                    case 3:
                        if(flagX.indexOf("%")!=-1){
                            const maxValue = this.cubicCurve[0][0]/(this.from[propX].value/100)
                            x = this.cubicCurve[2][0]/maxValue*100
                        } else {
                            x = this.cubicCurve[2][0]
                        }
                        if(flagY.indexOf("%")!=-1){
                            const maxValue = this.cubicCurve[0][1]/(this.from[propY].value/100)
                            y = this.cubicCurve[2][1]/maxValue*100
                        } else {
                            y = this.cubicCurve[2][1]
                        }
                        break;
                    case 4:
                        x = this.to[propX].value
                        y = this.to[propY].value
                        break;
                }
                this.cubicValues.push([x,y])
            }
        }
    }

    modify(props){
        for(const prop in props){
            if(this.hasOwnProperty(prop)===true){
                this[prop] = props[prop];
            }
        }
    }

    getEasingValues() {
        const toReturn = deepClone(this.from)
        const time = this.reversed === true ? this.reversedTime : this.currentTime;

        for(const property in this.from){
            const arrayFrom = this.from[property]
            const arrayChange = this.change[property]
            const arrayTimed = toReturn[property]

            arrayFrom.forEach((elementFrom,index) => {
                const elementChange = arrayChange[index]
                const elementTimed = arrayTimed[index]
                if(Array.isArray(elementFrom)){
                    elementFrom.forEach((partFrom,index2)=>{
                        const {updatable, value } = partFrom
                        if(updatable){
                            const sameChange = elementChange[index2]
                            const valueChange = sameChange.value
                            const sameTimed = elementTimed[index2]
                            let easingValue = ""
                            if(Array.isArray(this.cubic) && isCubicProperty(property)){
                                easingValue = getCubicValue(this,null,null,property);
                            } else {
                                easingValue = easings[this.easing](time, value, valueChange, this.duration);
                            }
                            sameTimed.value = easingValue 
                        }
                    })

                } else {
                    const {updatable, value} = elementFrom
                    if(updatable){
                        const valueChange = elementChange.value
                        let easingValue = ""
                        if(Array.isArray(this.cubic) && isCubicProperty(property)){
                            easingValue = getCubicValue(this,null,null,property);
                        } else {
                            easingValue = easings[this.easing](time, value, valueChange, this.duration);
                        }
                        elementTimed.value = easingValue 
                    }
                }
            })
        }
        return toReturn;        
    }

    update(timestamp) {
        const currentTime = timestamp
        this.timestamp = timestamp
        //Si l'élément n'existe plus, alors on supprime toutes les occurences ayant cet élément
        if (!this.element.parentNode) {
            return;
        }

        if (!this.startTime && this.finished === false) {
            this.startTime = currentTime;
        }

        if (this.finished === true) {
            return;
        }

        //La valeur temps est également à celle actuelle + (la dernière enregistrée - celle de départ) afin de retrancher pour celles ayant des delay > 0
        const time = (currentTime + (this.lastTime - this.startTime));
        this.time = time;
        this.currentTime = minMax(time, this.delay, (this.duration + this.delay)) - this.delay;
        const percent = (this.currentTime / this.duration) * 100;
        const reversedPercent = 100 - percent;
        this.reversedTime = reversedPercent / 100 * this.duration;
        this.percent = minMax(percent, 0, 100);
        //Delay
        if (time >= this.delay && this.finished === false) {
            if (!this.started) {
                this.started = true;
                this.triggers.start(this); 
            }
            this.animating = true;
            //Remise à jours des propriétés de départ (si l'élément a été modifié entre temps. Animations successives par exemple)
            // if(this.updated===false && this.updatable===true && this.reversed===false){
            //     this.updated=true;
            //     const points = setPoints(this.element,this.properties);
            //     this.from =  {...points.from};
            //     this.change =  {...points.change};
            // }
            this.apply();
        }
        //Fin de l'animation
        if (time >= (this.duration + this.delay) && this.animating === true) {
            this.lastTime = 0;
            this.paused = true;
            this.animating = false;
            if (this.finished === false) {
                this.paused = true;
                this.finished = true;
                this.triggers.end(this);
                if(this.resolve){
                    this.resolve(this);    
                }
                
            }
        }

        if (this.animating === true) {
            this.triggers.progress(this);
        }
    }

    play() {
        if(this.finished===true){
            return console.warn("animation already finished. Reset/Restart it to launch it again.");
        }
        this.promise = new Promise(resolve => {
            this.resolve = resolve
            if (this.paused === false) {
                if (this.finished === true && this.resettable === true) {
                    this.reset();
                }
                this.paused = false
            }
        });
    }

    pause() {
        this.paused = true;
        let bonus = 0;
        this.animating = false;
        if(this.finished===false){
            //Le bonus (décalage) est attribué uniquement aux animations suivantes non démarrées, sinon, leur delay est utilisé
            resetTime(this)
            if (this.lastTime != 0 && !bonus) {
                //Bonus attribué
                bonus = this.lastTime;
            }
        }
        return this;
    }

    resume() {
        this.paused = false;
        return this.play();
    }

    reverse(){
        this.reversed = !this.reversed;
        if(this.reversed===true){
            this.delay = this.delayReversed;
        } else {
            this.delay = this.delayNormal;
        }
        
        this.percent = 100 - this.percent;
        const currentTime = this.currentTime;
        this.currentTime = this.reversedTime;
        this.reversedTime = currentTime;
        if(this.finished===true){
            this.finished = false;
        }
        this.lastTime = currentTime;
        return this;
    }

    reset() {
        this.finished = false;
        this.started = false;
        this.paused = false;
        this.currentTime = 0;
        this.reversedTime = this.duration;
        this.startTime = 0;
        this.lastTime = 0;
        this.updated = false;
        this.apply();
        return this;
    }

    render(){
        this.currentTime = this.duration;
        this.apply();
        return this;
    }

    restart() {
        this.reset().play();
    }

    rewind() {
        if(this.paused === true){
            this.paused = false
        }
        this.reverse().reset().play();
    }

    apply(props){
        const easingValues = props ? props : this.getEasingValues();
        if(this.unapplied===false){
            for(const property in easingValues){
                const array = easingValues[property];
                let str = ""
                array.forEach((element) => {
                    if(Array.isArray(element)){
                        element.forEach((part) => {
                            str += part.value+part.unit
                        })
                    } else {
                        str += element.value+element.unit
                    }
                })
                this.element.style[property] = str
            }
        }
    }
}

//Classe d'une série d'Animations successives
export class Animations {
    constructor(options){
        this.ID = ID;
        this.name = options.name;
        this.additionnalDelay = typeof options.additionnalDelay === "number" ? options.additionnalDelay : 0;
        this.autoplay = options.autoplay;
        this.reversed = options.reversed;
        this.ignored = options.ignored;
        this.triggers = {
            ...AnimationsOptions.triggers,
            ...options.triggers
        };
        this.seen = false;
        this.finished = false;
        this.playing = false;
        this.paused = false;
        this.forwarded = 0;
        this.backwarded = 0;
        this.promise = null;
        this.line = [];
        this.init(options.line);
        this.update();
        this.position = this.getPosition();

        if (this.autoplay === true) {
            this.play();
        }

        return this;
    }

    get easings(){
        return Object.keys(easings);
    }

    init(animations){
        animations.forEach((animation,index) => {
            const {element} = animation;
            const newOptions = {
                id:index,
                ...AnimationOptions,
                ...animation,
                reversed: this.reversed
            };
            if(element instanceof NodeList || Array.isArray(element) || (typeof element === "string" && (element.startsWith(".") || element.indexOf(">")!=-1))){
                let delayShared = null;
                let delayCleaned = null;
                if(newOptions.delay && newOptions.delay.indexOf("/")!=-1){
                    delayShared = newOptions.delay.replace(/(?=\/).*/g,"").replace("/","");
                    if(delayShared.length===0){
                        delayShared = 0
                    }
                    delayCleaned = newOptions.delay.replace(/.*(?=\/)/g,"").replace("/","");
                }
                const array = element instanceof NodeList || Array.isArray(element) ? element : document.querySelectorAll(element);
                array.forEach((el,index2)=> {
                    const optionsElements = {
                        ...newOptions,
                        element:typeof el === "string" ? getDomElement(el) : el
                    }
                    if(delayShared!==null){
                        optionsElements.delay = index2===0 ? delayShared : delayCleaned;
                    }
                    const animation = new Animation(optionsElements);
                    this.line.push(animation);
                    animation.delay = this.getDelay(this.line.length-1);
                    animation.render();
                    
                });
            } else {
                newOptions.element = getDomElement(newOptions.element);
                const animation = new Animation(newOptions);
                this.line.push(animation);
                animation.delay = this.getDelay(this.line.length-1);
                animation.render();
                
            }
        });
    }

    getDuration(){
        let max = 0;
        let comp1 = 0;
        let comp2 = 0;
        for (let l = 1; l <= this.line.length; l++) {
            const animation = this.line[l - 1]
            if (animation.properties === undefined) {
                continue;
            }
            if (animation.noCounted != undefined || (animation.reset === false && animation.executed === true)) {
                continue;
            }
            comp1 = Math.max((animation.delay + animation.duration), comp2)
            comp2 = (animation.delay + animation.duration)
            max = Math.max(comp1, max)
        }
        return max
    }

    getPosition(){
        let position = (this.reversed === true) ? this.duration : 0;
        for (let l = 1; l <= this.line.length; l++) {
            const animation = this.line[l - 1];
            if(this.reversed === true){
                position = Math.min(position,this.duration-animation.time);
            } else {
                position = Math.max(position,animation.time);
            }
        }
        return isNaN(position) ? 0 : minMax(position,0,this.duration);
    }

    setPosition(pos){
        if(typeof pos === "number" && this.playing === false){
            this.position = minMax(pos,0,this.duration);
            const position = this.reversed === true ? this.duration - this.position : this.position;
            let l = this.reversed === true ? this.line.length : 1;
            do {
                const animation = this.line[l - 1];
                animation.lastTime = position;
                animation.finished = false;
                animation.startTime = 0;
                animation.update(position);
                //animation.startTime = 0;
                l = this.reversed === true ? l-1 : l+1;
            }
            while(this.reversed === true ? l>=1 : l<=this.line.length )
        }  
    }

    update() {
        this.duration = this.getDuration();
        for (let l = 1; l <= this.line.length; l++) {
            const animation = this.line[l - 1];
            animation.reset();
        }
        let l = this.reversed === true ? 1 : this.line.length;
        do {
            const animation = this.line[l - 1];
            //Exclusion des fonctions ponctuelles + si aucune properties d'animations
            if (!animation) {
                continue
            }
            const delay = animation.delay + this.additionnalDelay;
            animation.delayNormal = delay;
            animation.delayReversed = (this.duration - (animation.duration + animation.delay));
            animation.delay = this.reversed ? animation.delayReversed : animation.delayNormal;
            const value = 0;
            animation.lastTime = value;
            animation.update(value);
            animation.startTime = 0;
            l = this.reversed === true ? l+1 : l-1;
        }
        while(this.reversed===true ? l<=this.line.length : l>=1 )
        return this;
    }

    play(){
        this.paused = false;
        this.promises = [];
        this.playing = this.reversed === true ? "backwards" : "forwards";
        this.triggers.start(this);
        for (let l = 1; l <= this.line.length; l++) {
            const animation = this.line[l - 1];
            animation.play();
            this.promises.push(animation.promise);
        }
        actives.push(this);
        launch();
        this.promise = Promise.all(this.promises).then(() => {
            this.hasPlayed();
        });
        return this;
    }

    pause(){
        this.paused = this.playing;
        this.playing = false;  
        this.promise = null;
        this.line.forEach((animation) => {
            animation.pause();
        });
    }

    resume(label){
        if(typeof label === "string"){
            const mustReverse = this.paused !== false ? label != this.paused : (this.reversed === true && label === "forwards") || (this.reversed === false && label === "backwards") ;
            if(mustReverse === true){
                this.reverse();
                this.play();
            } else {
                this.play();
            }
        } else {
            this.play();
        }
    }

    paint(t){
        this.line.forEach((animation) => {
            animation.update(t);
        });
        this.position = this.getPosition();
        this.triggers.progress(this,this.position);
    }

    reverse(){
        this.reversed = !this.reversed;
        this.line.forEach((animation) => {
            animation.reverse();
        });
        this.setPosition(this.position);
        return this;
    }

    reset(){
        this.forwarded = 0;
        this.backwarded = 0;
        this.position = 0;
        this.finished = false;
        this.promise = null;
        this.line.reverse().forEach((animation) => {
            animation.reset();
        });
        this.line.reverse();
        this.triggers.reset(this);
    }

    render(){
        if(this.playing === false){
            this.setPosition(this.duration);
            this.hasPlayed();
        }
        this.triggers.render(this);
    }

    hasPlayed(){
        const playing = this.playing;
        this.position = playing === "forwards" ? this.duration : 0;
        this.playing = false;
        if (this.seen === false) {
            this.seen = true;
        }
        this.finished = true;
        this.promise = null;
        if(playing === "forwards"){
            this.forwarded++;
        } else {
            this.backwarded++;
        }
        this.triggers.end(this,playing);
        console.log("Animations finished");
    }

    getNext(index) {
        const total = this.line.length
        if (index == (total - 1)) {
            return;
        }
        do {
            index++
            if (index > (total - 1)) {
                return;
            }
            const next = this.line[index]
            if (next) {
                return next;
            }
        }
        while (index <= total)
    }
    getPrev(index) {
        if (index < 0) {
            return;
        }
        do {
            index--
            if (index < 0) {
                return;
            }
            const prev = this.line[index];
            if (prev) {
                return prev;
            }
        }
        while (index >= 0)
    }

    getByDelayId(delayId) {
        if (typeof delayId !== "string") {
            return null;
        }
        for (let l = 1; l <= this.line.length; l++) {
            const animation = this.line[l - 1];
            if (animation.delayId === delayId) {
                return animation;
            }
        }
        return null;
    }

    getDelay(index) {
        const animation = this.line[index];
        const delayRef = animation.delay;
        const prevAn = this.getPrev(index);
        const prevDelay = prevAn == undefined ? 0 : typeof prevAn.delay === "number" ? prevAn.delay : 0;
        function getAddPrev(tab,index){
            for(let a=(index-1); a>=0; a--){
                const t = tab[a]
                if(t!=="+"&&t!=="-"){
                    return t
                }
            }
        }
        if (delayRef === undefined) {
            return 0
        }
        else if (typeof delayRef === "string") {
            const adds = delayRef.trim().split(/(\+|-)/g).filter(function (t) { if (t != "") { return t } });
            let delay = 0;
            let sign = "+";
            for (let a = 1; a <= adds.length; a++) {
                const add = adds[a - 1]
                const ref = this.getByDelayId(add)
                const prevRef = this.getByDelayId(getAddPrev(adds,a-1))
                if(add==="+"||add==="-"){
                    sign = add
                } else {
                    let value
                    if (ref) {
                        value = ref.delay
                    }
                    else if (add.indexOf("{") != -1) {
                        const prop = add.match(/{.*\(/g).join("").replace(/{|\(/g, "")
                        if (typeof this.tl.cbGetDatas[prop] === "function") {
                            const isParam = add.match(/\((.*?)\)/g)
                            const param = isParam ? isParam.join("").replace(/\(|\)/g, "") : null
                            value = this.tl.cbGetDatas[prop](param)
                        }
                    }
                    else if (add === "same") {
                        value = prevRef ? 0 : prevDelay
                    }
                    else if (add === "next") {
                        value = prevRef ? prevRef.duration + prevRef.delay : prevAn.duration + prevAn.delay
                    } else {
                        value = getAddPrev(adds,a-1) ? parseFloat(add) : prevDelay + parseFloat(add)
                    }
                    delay = sign==="+" ? delay+value : delay-value
                }
                
            }
            return delay
        } else {
            return delayRef
        }
    }
}

function MotionBroth(props) {
    let options = {};
    if(isObject(props)){
        if(props.line){ 
            options = {
                ...AnimationsOptions,
                ...props
            };
        } else {
            options = {
                line:[props],
                ...AnimationsOptions
            };
        }
    }
    else if(Array.isArray(props)){
        options = {
            line:props,
            ...AnimationsOptions
        };
    }
    const anims = new Animations(options);
    ID++;
    return anims; 
}

export {Timeline, MotionBroth};
