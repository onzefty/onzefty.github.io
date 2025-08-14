(function () {
    //Les éléments des lines des Steps doivent être dans l'ordre, en particulier pour le calcul des delays 'next' | 'same' | '+1000'
    //Les unités doivent idéalement correspondre à celles mises dans elements (sauf cas scale/opacity/skew/rotate)
    //Timeline contenant n Step(s)
    class Timeline {
        constructor(options = {}){
            this.attrName = typeof options.attrName === "string" ? options.attrName : "anims"
            const els = document.querySelectorAll("*[" + this.attrName + "]")
            if (!options.steps) {
                return console.error("La propriété [steps] n'est pas renseignée ou est invalide.")
            }
            this.status = "normal" 
            this.registered = null
            this.currentIndex = -1
            if(options.triggerEl instanceof HTMLElement){
                this.triggerEl = options.triggerEl
            } else {
                this.triggerEl = document.createElement("div")
                document.body.appendChild(this.triggerEl)
            }
            this.preview = new Preview(options.previewEl)
            this.mainEnd = typeof options.mainEnd === "function" ? options.mainEnd : () => {}
            this.cbPlaying = typeof options.cbPlaying === "function" ? options.cbPlaying : () => {}
            this.cbGetDatas = typeof options.cbGetDatas === "object" ? options.cbGetDatas : {}
            //steps: contient toutes les étapes de la Timeline (certaines étapes peuvent être joués indépendamment de la ligne principale)
            this.steps = options.steps
            //line: Ligne principale contenant toutes les étapes dans l'ordre (tous les Steps créés n'ont pas besoin d'être dans la ligne principale)
            this.line = this.setLine(Array.isArray(options.line) ? options.line : Object.keys(options.steps))
            if(Object.keys(this.steps).length===0){
                return console.error("Aucune des étapes fournies n'est valide")
            }
            this.reset()       
        }
        reset(){
            //Remet à 0 toutes les étapes
            for(let l=this.line.length; l>=1; l--){
                const steps = this.line[l-1]
                for(let s=steps.length; s>=1; s--){
                    const step = steps[s-1]
                    step.reset()
                    step.update("forwards")
                }
            }
            this.currentIndex = -1
            return this
        }
        render(num,noForwardsEnd) {
            const reach = typeof num === "number" ? num : this.currentIndex
            //Render toutes les étapes selon la paramètre num (ou currentIndex)
            for(let l=this.line.length; l>=1; l--){
                if((l-1)>reach){
                    const steps = this.line[l-1]
                    for(let s=steps.length; s>=1; s--){
                        const step = steps[s-1]
                        step.reset()
                    }
                } 
            }
            for(let l=1; l<=this.line.length; l++){
                const steps = this.line[l-1]
                if((l-1)<=reach){
                    steps.forEach((step)=> {
                        if(step.ignored === false){
                            step.render()
                            if (step.seen === false) {
                                step.seen = true
                            }
                            step.finished = true
                            if ((l-1) === reach && noForwardsEnd === undefined) {
                                step.forwardsEnd()
                            }    
                        } else {
                            step.reset()
                        }
                    })
                }
            }
            this.currentIndex = num
        } 
        setLine(tab) {
            const newTab = []
            for (let t = 1; t <= tab.length; t++) {
                let el = tab[t - 1]
                if (typeof el === "string") {
                    el = { [el]: 0}
                }
                const steps = []
                for(let prop in el){
                    if(!this.steps[prop]){
                        console.warn("Le nom d'étape ",prop," n'existe pas dans l'objet steps définis dans les paramètres")
                        delete el[prop]
                    } else {
                        const datas = {
                            name:prop,
                            additionnalDelay:el[prop]==="ignored" ? 0 : el[prop],
                            ignored:el[prop]==="ignored",
                            ...this.steps[prop]
                        }
                        const step = this.createStep(datas,datas.additionnalDelay!=="ignored")
                        steps.push(step)
                    }
                }
                if(Object.keys(el).length === 0){
                    console.warn("Aucune bonne étape valide")
                    continue
                }
                newTab.push(steps)
            }
            return newTab
        }
        createStep(options,staged) {
            const newOptions = {
                ...options
            }
            newOptions.unstaged = !staged
            const step = new Step(newOptions, this)
            if (step.line.length===0) {
                return newOptions.name
            }
            for (let m = 1; m <= step.line.length; m++) {
                const an = step.line[m - 1]
                an.executed = false
                if (an.time && typeof an.time === "number") {
                    continue
                }
            }
            return step
        }
        getStep(name) {
            for(let l=this.line.length; l>=1; l--){
                const steps = this.line[l-1]
                for(let s=steps.length; s>=1; s--){
                    const step = steps[s-1]
                    if(step.name===name){
                        return step
                    }
                }
            }
        }
        getLine(name){
            if(typeof name === "number"){
                return this.line[name]
            }
            if(typeof name === "string" && name === "paused"){
                const loop = (steps) => { return steps.filter((step) => { if(step.paused === true) { return step } })[0]   }
                return this.line.filter(loop)
            }
        }
        stopAt(reach, noForwardsEnd) {
            if (this.status === "normal") {
                this.status = "rendering"
                this.render(reach, noForwardsEnd)
                this.mainEnd()
                this.status = "normal"
            }
            return this
        }
        stopAtEnd(){
            this.render(this.line.length-1)
            this.currentIndex = this.line.length-1
            return this
        }
        setAt(options = {}){
            const {index, position} = options
            const line = this.getLine(index)
            for(let l=1; l<=this.line.length; l++){
                const lineEl = this.line[l-1]
                if((l-1)<index){
                    for(let name in lineEl.steps){
                        const step = this.steps[name]
                        if(lineEl[name] === "ignored"){
                            step.reset()
                        } else {
                            step.render()
                            if (step.seen === false) {
                                step.seen = true
                            }
                            step.finished = true
                            if ((l-1) === index) {
                                step.forwardsEnd()
                            }    
                        } 
                    }
                }
            }
            if(line){
                line.setAt(position)
            }
        }
        playFrom(num) {
            if (this.status === "normal") {
                this.stopAt(num - 1, false)
                this.play()
            }
        }
        resume(direction){
            if(this.status === "stop"){
                const promises = []
                this.status = typeof direction === "string" ? direction : this.registered
                const switched = direction!=this.registered
                this.registered = null
                const line = this.getLine("paused")
                if(line){
                    line.forEach((steps) => {
                        steps.forEach((step) => {
                            if(switched){
                                step.switch(direction)
                            }
                            if(direction==="forwards"){
                                promises.push(step.forwards())
                            } else {
                                promises.push( step.backwards())
                            } 
                        })
                    })
                    return Promise.all(promises).then(() => {
                        const status = this.status
                        this.status = "normal"
                        if(status==="forwards"){
                            this.currentIndex++
                        } else {
                            this.currentIndex = Math.max(-1, this.currentIndex - 1)
                        }
                        this.mainEnd()
                    })    
                }
            }
        }
        play(el, force, isIgnored) {
            let currentLine
            const promises = []
            let flagUnstaged = false
            if (el === undefined) {
                el = this.currentIndex+1
                currentLine = this.line[this.currentIndex + 1]
            }
            else if (typeof el === "string") {
                const stepUnstaged = this.getStep(el)
                if(stepUnstaged){
                    if(stepUnstaged.canPlay(true)===true){
                        stepUnstaged.update("forwards")
                        stepUnstaged.forwards()
                    }
                    flagUnstaged = true
                } else {
                    const obj = {
                        name:el,
                        additionnalDelay:0,
                        ...this.steps[el]
                    }
                    currentLine = [this.createStep(obj,false)]
                }  
            }
            else if (typeof el === "number") {
                currentLine = this.line[el]
            }
            else if (typeof el === "object") {
                currentLine = [el]
            } else {
                currentLine = null
            }
            if (this.canPlay(force) && Array.isArray(currentLine) && flagUnstaged===false) {
                if (!isIgnored) {
                    this.status = "forwards"
                }
                this.preview.clean().build(currentLine)
                currentLine.forEach((step) => {
                    if(step.canPlay()===true){
                        step.update("forwards")
                        promises.push(step.forwards())
                    }
                })
                return Promise.all(promises).then(() => {
                    this.status = "normal"
                    if (typeof el === "number") {
                        this.currentIndex = el
                    }
                    this.mainEnd()
                })    
            }
        }
        rewind(num) {
            const to = typeof num === "number" ? num : this.currentIndex
            const currentLine = this.line[to]
            const promises = []
            if (this.canPlay() && Array.isArray(currentLine)) {
                this.status = "backwards"
                currentLine.forEach((step) => {
                    if(step.paused===false && step.ignored===false){
                        step.update("backwards")
                        promises.push(step.backwards())
                    } 
                })
                return Promise.all(promises).then((resolve, reject) => {
                    this.status = "normal"
                    this.currentIndex = Math.max(-1, this.currentIndex - 1)
                    this.mainEnd()
                }) 
            }
        }
        getDirection(num) {
            if (num < this.currentIndex) {
                return "back"
            } else {
                return "go"
            }
        }
        isCurrentlyPlaying() {
            const toReturn = []
            for(let l=this.line.length; l>=1; l--){
                const steps = this.line[l-1]
                steps.forEach((step)=> {
                    if (step.playing !== false) {
                        toReturn.push(step)
                    }
                })
            }
            return toReturn.length > 0 ? toReturn : false
        }
        stopPlaying() {
            for(let l=this.line.length; l>=1; l--){
                const steps = this.line[l-1]
                steps.forEach((step)=> {
                    if(step.playing!==false){
                        step.stop()
                    }
                })
            }
            this.registered = this.status
            this.status = "stop"
            return this
        }
        canPlay(force){
            return (this.status === "normal" || force)
        }
    }

    //Étape contenant n StepAnimation(s) pouvant être joués simultanément
    class Step {
        constructor(datas, tl){
            if (!datas.options) {
                datas.options = {}
            }
            const {forwardsStart, forwardsEnd, backwardsStart, backwardsEnd, rendered, resetted, ignored, once, connected} = datas.options
            this.tl = tl
            this.name = datas.name
            this.line = datas.line
            this.additionnalDelay = datas.additionnalDelay
            this.forwardsStart = typeof forwardsStart === "function" ? forwardsStart : function () {}
            this.forwardsEnd = typeof forwardsEnd === "function" ? forwardsEnd : function () {}
            this.backwardsStart = typeof backwardsStart === "function" ? backwardsStart : function () {}
            this.backwardsEnd = typeof backwardsEnd === "function" ? backwardsEnd : function () {}
            this.rendered = typeof rendered === "function" ? rendered : function () {}
            this.resetted = typeof resetted === "function" ? resetted : function () {}
            this.once = typeof once === "boolean" ? once : false
            this.ignored = typeof ignored === "boolean" ? ignored : typeof datas.ignored === "boolean" ? datas.ignored : false
            this.connected = connected ? typeof connected === "string" ? [connected] : connected : []
            this.unstaged = datas.unstaged
            this.durationStandardForwards = typeof datas.durationStandardForwards === "number" ? datas.durationStandardForwards : 1000
            this.durationStandardBackwards = typeof datas.durationStandardBackwards === "number" ? datas.durationStandardBackwards : 1000
            this.seen = false
            this.finished = false
            this.playing = false
            this.paused = false
            this.played = 0
            this.position = 0
            this.promise = null
            this.init()    
        }
        get duration() {
            let max = 0
            let comp1 = 0
            let comp2 = 0
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                if (animation.time || animation.properties === undefined) {
                    continue
                }
                if (animation.noCounted != undefined || (animation.reset === false && animation.executed === true)) {
                    continue
                }
                comp1 = Math.max((animation.delay + animation.duration), comp2)
                comp2 = (animation.delay + animation.duration)
                max = Math.max(comp1, max)
            }
            return max
        }
        init() {
            const self = this
            const line = []
            for (let l = 1; l <= this.line.length; l++) {
                const options = {
                    progress:this.getPosition.bind(this),
                    ...this.line[l - 1]
                }
                const element = getDomElement(options.id)
                if(!element){
                    console.warn("Le sélecteur "+options.id+" n'existe pas. => Rejeté")
                    continue
                }
                if(element instanceof NodeList || Array.isArray(element)){
                    const anims = []
                    element.forEach((el,index)=> {
                        const newOptions = {...options}
                        newOptions.element = el
                        newOptions.updatable = this.ignored === false
                        options.ref = self.name + "-" + l + "-" + (index+1)
                        if(newOptions.delay.indexOf("[")!=-1){
                            const beforeBrackets = newOptions.delay.match(/.*\[/g).join("").replace(/\[|\]/g,"")
                            const betweenBrackets = newOptions.delay.match(/\[.*?\]/g)[0].replace(/\[|\]/g,"")
                            const value = index===0 ? beforeBrackets : "+"+betweenBrackets
                            newOptions.delay = value
                        }
                        if(newOptions.delay.indexOf("/")!=-1){
                            const str = newOptions.delay.match(/\/.*/g).join("");
                            const num = parseFloat(str.replace(/\//g,""));
                            let value = num*index
                            newOptions.delay = newOptions.delay.replace(str,"+"+value);
                        }
                        line.push(new StepAnimation(newOptions))
                    })
                } else {
                   //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                    if (options.properties === undefined) {
                        continue
                    }
                    options.ref = this.name + "-" + l
                    options.element = element
                    options.updatable = this.ignored === false
                    line.push(new StepAnimation(options))
                }
            }
            this.line = line
        }
        update(dir) {
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if (animation.time || animation.properties === undefined) {
                    continue
                }
                if (animation.duration === undefined) {
                    animation.duration = dir === "forwards" ? this.durationStandardForwards : this.durationStandardBackwards
                }
                animation.delay = this.getDelay((l - 1))
                const duration = animation.duration
                const delay = dir === "forwards" ? animation.delay + this.additionnalDelay : (this.duration - (animation.duration + animation.delay)) + this.additionnalDelay
                const easing = animation.easing[dir]
                const reversed = dir === "forwards" ? false : true
                animation.renderer.modify({
                    finished:false,
                    reversed:false,
                    delay: delay,
                    delayNormal:delay,
                    delayReversed:animation.duration - (animation.duration + delay) + delay,
                    duration: duration,
                    easing: easing,
                    cubic: animation.cubic,
                    reversed:reversed,
                    updated:false,
                    started:false,
                    paused: false,
                    startTime:0,
                    lastTime:0
                })
            }
            return this
        }
        switch(dir){
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if (animation.time || animation.properties === undefined) {
                    continue
                } 
                const delay = dir === "forwards" ? animation.delay + this.additionnalDelay : (this.duration - (animation.duration + animation.delay)) + this.additionnalDelay
                const easing = animation.easing[dir]
                animation.renderer.modify({
                    delayNormal:delay,
                    delayReversed:animation.duration - (animation.duration + delay) + delay,
                    easing: easing
                })
                animation.renderer.switch()
            }
            return this
        }
        render() {
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                if (animation.time && typeof animation.time === "number") {
                    const ftc = animation.ftc.bind(this)
                    ftc()
                    continue
                }
                animation.renderer.setAt(100)
                animation.executed = true
            }
            this.hasPlayed()
            this.rendered()
            return this
        }
        forwards() {
            this.playing = "forwards"
            this.paused = false
            this.promises = []
            const first = this.getFirst("forwards")
            const last = this.getLast("forwards")
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                const {reset, time} = animation
                if (reset === false && animation.executed === true) {
                    continue
                }
                if (time && typeof time === "number" && time < this.duration) {
                    const ftc = animation.ftc.bind(this)
                    const time = time
                    animate({
                        element: this.tl.triggerEl,
                        duration: time + this.additionnalDelay,
                        unapplied: true,
                        properties: {opacity: 1},
                        end: ftc
                    })
                    continue
                }
                if (animation.properties === undefined) {
                    continue
                }
                const cbStart = animation.ref === first.ref ? this.forwardsStart.bind(this) : typeof animation.cbStart === "function" ? animation.cbStart.bind(this) : function () { }
                const cbEnd = animation.ref === last.ref ? this.forwardsEnd.bind(this) : typeof animation.cbEnd === "function" ? animation.cbEnd.bind(this) : function () { }
                animation.cbStart = cbStart
                animation.cbEnd = cbEnd
                this.promises.push(animation.play().then(() => {
                    cbEnd()
                }))
            }
            return Promise.all(this.promises).then((resolve,fail) => {
                this.hasPlayed()
            })
        }
        backwards() {
            this.playing = "backwards"
            this.paused = false
            this.promises = []
            if(this.position === 0){
                this.position = this.duration
            }
            const first = this.getFirst("backwards")
            const last = this.getLast("backwards")
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                if (animation.reset === false && animation.executed === true) {
                    continue
                }
                if (animation.time && typeof animation.time === "number" && animation.time < this.duration) {
                    const ftc = animation.ftc.bind(this)
                    const time = this.duration - animation.time
                    an.animation = animate({
                        element: this.tl.triggerEl,
                        duration: time,
                        unapplied: true,
                        properties: { opacity: 1 },
                        end: ftc
                    })
                    continue
                }
                if (animation.properties === undefined) {
                    continue
                }
                const cbStart = animation.ref === first.ref ? this.backwardsStart.bind(this)  : typeof animation.cbStart === "function" ? animation.cbStart.bind(this) : function () { }
                const cbEnd = animation.ref === last.ref ? this.backwardsEnd.bind(this) : typeof animation.cbEnd === "function" ? animation.cbEnd.bind(this) : function () { }
                animation.cbStart = cbStart
                animation.cbEnd = cbEnd
                this.promises.push(animation.play("backwards").then((value) => {
                    cbEnd()
                }))
            }
            return Promise.all(this.promises).then((value) => {
                this.playing = false
                this.finished = false
                this.position = 0
                this.tl.preview.update(this)
            })
        }
        stop() {
            this.playing = false
            this.paused = true
            for (let l = this.line.length; l >= 1; l--) {
                const animation = this.line[l - 1]
                if (animation.time && typeof animation.time === "number") {
                    continue
                }
                animation.renderer.pause()
            }
            return this
        }
        reset() {
            for (let l = this.line.length; l >= 1; l--) {
                const animation = this.line[l - 1]
                if (animation.time && typeof animation.time === "number") {
                    continue
                }
                animation.renderer.setAt(0)
                animation.executed = false
            }
            this.resetted()
            this.played = 0
            this.position = 0
            this.paused = false
            return this
        }
        setAt(position,from){
            if(typeof position === "number"){
                this.position = Math.max(0,Math.min(this.duration,(position-from)))
                for (let l = this.line.length; l >= 1; l--) {
                    const animation = this.line[l - 1]
                    if (animation.time && typeof animation.time === "number") {
                        continue
                    }
                    const value = Math.max(0,Math.min(animation.duration,(this.position-animation.delay)))
                    const percent = value/animation.duration*100
                    animation.renderer.setAt(percent)
                }
            }
        }
        canPlay(force){
            let connectedCondition = true
            if(this.connected.length > 0){
                connectedCondition = this.connected.filter((connected) => {
                    const step = this.tl.getStep(connected)
                    if(step.seen ===  true){
                        return connected
                    }
                }).length === this.connected.length
            }
            const standardCondition = force===true || this.paused===false && this.ignored===false
            const onceCondition = this.once === true ? this.seen===false : true

            return standardCondition === true && connectedCondition === true && onceCondition === true
        }
        hasPlayed(){
            this.playing = false
            this.position = this.duration
            if (this.seen === false) {
                this.seen = true
            }
            this.finished = true
            this.played++
            this.tl.preview.update(this)
        }
        getNext(index) {
            const total = this.line.length
            if (index == (total - 1)) {
                return
            }
            do {
                index++
                if (index > (total - 1)) {
                    return
                }
                const next = this.line[index]
                if (next && (next.time == undefined && (next.reset == undefined || next.reset == false && next.executed == false))) {
                    return next
                    break
                }
            }
            while (index <= total)
        }
        getPrev(index) {
            if (index < 0) {
                return
            }
            do {
                index--
                if (index < 0) {
                    return
                }
                const prev = this.line[index]
                if (prev && (prev.time == undefined && (prev.reset == undefined || prev.reset == false && prev.executed == prev))) {
                    return prev
                    break
                }
            }
            while (index >= 0)
        }
        getByDelayId(delayId) {
            if (typeof delayId !== "string") {
                return null
            }
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                if (animation.delayId === delayId) {
                    return animation
                }
            }
            return null
        }
        getFirst(dir) {
            let min = Infinity
            let first
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                const calc = dir==="backwards" ? (this.duration - (animation.duration + animation.delay)) : (animation.duration + animation.delay)
                if (calc <= min) {
                    first = animation
                    min = (calc)
                }
            }
            return first
        }
        getLast(dir) {
            let max = 0
            let last
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                const calc = dir==="backwards" ? (this.duration - (animation.duration + animation.delay)) : (animation.duration + animation.delay)
                if (calc >= max) {
                    last = animation
                    max = (calc)
                }
            }
            return last
        }
        getPosition(){
            let percents = 0
            let by = 0
            for (let l = 1; l <= this.line.length; l++) {
                const animation = this.line[l - 1]
                if (animation.time || animation.properties === undefined) {
                    continue
                }
                const datas = animation.datas
                percents += datas.percent
                by+= 100
            }
            const calc = percents/by*this.duration
            const toReturn = this.playing === "forwards" ? calc  : this.duration-(calc)
            this.position = toReturn
            this.tl.preview.update(this)
        }
        getDelay(index, dir) {
            const animation = this.line[index]
            const delayRef = animation.delayRef
            const delayFunction = animation.delayFunction
            const prevAn = this.getPrev(index)
            const prevDelay = prevAn == undefined ? 0 : typeof prevAn.delay === "number" ? prevAn.delay : 0
            const duration = animation.duration
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
                const adds = delayRef.trim().split(/(\+|-)/g).filter(function (t) { if (t != "") { return t } })
                let delay = 0
                let sign = "+"
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

    //Animation contenant les propriétés d'animations sur n élément(s)
    class StepAnimation {
        constructor(props){
            this.element = props.element
            this.time = props.time ? props.time : null
            this.properties = props.properties
            this.easing = getEasing(props.easing)
            this.duration = props.duration
            this.delay = props.delay
            this.delayRef = props.delay
            this.delayId = props.delayId
            this.ref = props.ref
            this.cbStart = props.cbStart
            this.cbEnd = props.cbEnd
            this.renderer = animate({
                element: this.element,
                properties: this.properties,
                updatable: true,
                progress:props.progress,
                autoplay: false,
                resettable:false
            })
            this.executed = false

            this.renderer.setAt(100)
        }

        get datas() {
            return {
                currentTime:this.renderer.currentTime,
                reversedTime:this.renderer.reversedTime,
                percent:this.renderer.percent
            }
        }

        play(direction){
            this.renderer.modify({
                start: this.cbStart,
                //reversed:direction==="backwards"?true:false,
                paused:false
            })
            this.executed = true
            
            return new Promise(resolve => {
                this.renderer.modify({
                    end:resolve
                })
                this.renderer.play()
            })
        }
    }

    //Preview des Lines et de leurs Steps inclus (pour visualiser/manipuler si besoin)
    class Preview {
        constructor(element){
            this.element = element instanceof HTMLElement ? element : null
            this.colors = ["70,214,204","63,214,57","208,218,61","214,135,56","208,65,57","217,79,191","129,64,194","48,77,197"]
            this.index = 0
        }

        clean(){
            if(this.element===null){
                return this
            }
            this.element.innerHTML = "<div style='position:relative;'></div>"
            this.index = 0
            return this
        }

        build(line){
            if(this.element===null){
                return this
            }
            if(Array.isArray(line)){
                line.forEach((step)=>{
                    const {position, duration, additionnalDelay, name, ignored} = step
                    if(step && ignored !== true){
                        const stepEl = document.createElement("div")
                        stepEl.className = "step step-"+name
                        stepEl.style.backgroundColor = "rgba("+this.colors[this.index]+",0.2)"
                        const stepElDiv = document.createElement("div")
                        stepElDiv.style.backgroundColor = "rgb("+this.colors[this.index]+")"
                        stepEl.append(stepElDiv)
                        const stepElP = document.createElement("p")
                        stepEl.append(stepElP)
                        this.element.querySelector("div").append(stepEl)
                        this.index++
                        if(this.index===this.colors.length){
                            this.index = 0
                        } 
                    }
                })   
            }
            let cursor = this.element.querySelector("#timeline-cursor")
            if(!cursor){
                cursor = document.createElement("div")
                cursor.id = "timeline-cursor"
                this.element.querySelector("div").appendChild(cursor)
            }
            return this
        }

        update(step){
            if(this.element===null){
                return this
            }
            if(step){
                const {name,position, duration, additionnalDelay} = step
                // 
                // const percent = (position/duration*100)
                // cursor.style.left = "calc("+percent+"% - "+cursor.offsetWidth+"px)"
                
                if(additionnalDelay !== "ignored" && step.playing!==false){
                    const stepEl = this.element.querySelector(".step-"+name)
                    if(stepEl){
                        const stepElDiv = stepEl.querySelector("div")
                        const stepElP = stepEl.querySelector("p")
                        //const percentWidth = step.duration/duration*100
                        //const percentX = value/duration*100
                        //stepEl.style.width = (percentWidth/100*stepEl.parentNode.offsetWidth)+"px"
                        //stepEl.style.translate = (percentX/100*stepEl.parentNode.offsetWidth)+"px 0px"
                        stepElDiv.style.width = (position/duration*100)+"%"
                        stepElP.innerHTML = Math.max(0,position.toFixed(0))+"/"+duration    
                    }
                    
                }
                if(step.tl){
                    const playings = step.tl.isCurrentlyPlaying()
                    if(playings){
                        const cursor = this.element.querySelector("#timeline-cursor")
                        let percent = 0
                        let by = 0
                        playings.forEach((playing) => {
                            percent += (playing.position/playing.duration*100)
                            by+=100
                        })
                        const main = (percent/by*100)
                        cursor.style.left = "calc("+main+"% - "+cursor.offsetWidth+"px)"
                    }
                }
                
            }
        }
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

    function tIntoObject(nodes, attrName) {
        if (nodes.length === 0) {
            return null
        }
        const obj = {}
        for (let n = 1; n <= nodes.length; n++) {
            const node = nodes[n - 1]
            const attrVal = node.getAttribute(attrName)
            obj[node.id] = attrVal.length != 0 ? JSON.parse(node.getAttribute(attrName)) : ""
        }
        return obj
    }

    function getDomElement(ref){
        const byGetId = document.getElementById(ref)
        const byQuery = document.querySelector(ref)
        const byQueries = document.querySelectorAll(ref)
        if(byGetId){
            return byGetId
        }
        if(byQueries && byQueries.length>1){
            return byQueries
        }
        if(byQuery){
            return byQuery
        }
        return null
    }

    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max)
    }

    window.Timeline = Timeline
    window.Step = Step
})();