function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

(function () {
    //Les éléments des lines des Steps doivent être dans l'ordre, en particulier pour le calcul des delays 'next' | 'same' | '+1000'
    //Les unités doivent idéalement correspondre à celles mises dans elements (sauf cas scale/opacity/skew/rotate)
    function Timeline(options) {
        this.attrName = typeof options.attrName == "string" ? options.attrName : "anims";
        var els = document.querySelectorAll("*[" + this.attrName + "]");
        if (!options.steps) {
            return console.error("Aucune étape introduite dans la priopriété steps");
        }
        if (!options.elements && !els) {
            return console.error("Pas de propriété elements, contenant le listing des éléments de toutes les étapes, ainsi que leurs propriétés de départ.");
        }
        if (!options.triggerEl || !options.triggerEl instanceof HTMLElement) {
            return console.error("La propriété triggerEl n'est pas renseigné ou n'est pas un élément DOM");
        }
        this.status = "init";
        this.currentIndex = 0;
        this.steps = {};
        this.triggerEl = options.triggerEl;
        this.mainEnd = typeof options.mainEnd == "function" ? options.mainEnd : function () { };
        this.cbGetDatas = typeof options.cbGetDatas === "object" ? options.cbGetDatas : {};
        this.elements = this.setElements(tIntoObject(els, this.attrName) || Object.assign({}, options.elements));
        this.line = this.setLine(Array.isArray(options.line) ? options.line : Object.keys(options.steps));
        this.steps = this.setSteps(options.steps);

        this.render();
        this.status = "normal";
    }

    Timeline.prototype = {
        setElements: function (els) {
            //Check de la propriété elements
            for (var e in els) {
                var el = document.getElementById(e);
                if (!el) {
                    console.warn("L'élément", e, "n'existe pas dans le document.")
                    delete els[e];
                    continue;
                }
            }
            //Si aucun élément valide
            if (Object.keys(els).length == 0) {
                return console.error("Aucun élement dont l'id est valide.");
            }
            return els;
        },
        setLine: function (tab) {
            var newTab = [];
            for (var t = 1; t <= tab.length; t++) {
                var el = tab[t - 1];
                if (typeof el == "string") {
                    var obj = {};
                    obj[el] = 0;
                    datas = obj;
                } else {
                    datas = el;
                }
                newTab.push(datas);
            }
            return newTab;
        },
        setSteps: function (steps) {
            var obj = {};
            var banished = [];
            //Les étapes présentes dans la ligne sont créées (leurs valeurs précédentes dépendent justement de l'ordre établi)
            for (var l = 1; l <= this.line.length; l++) {
                var el = this.line[l - 1];
                for (var prop in el) {
                    if (obj[prop] == undefined) {
                        var step = this.createStep(prop, steps[prop], l);
                        if (typeof step == "string") {
                            banished.push(prop);
                        } else {
                            obj[prop] = step;
                        }
                    }
                }
            }
            //Les étapes manquantes sont ensuite créées (leurs valeurs précédentes seront directement celles dans this.elements)
            for (var prop in steps) {
                if (obj[prop] == undefined && banished.indexOf(prop) == -1) {
                    var step = this.createStep(prop, steps[prop]);
                    if (typeof step == "string") {
                        banished.push(el);
                    } else {
                        obj[prop] = step;
                    }
                }
            }

            return obj;
        },
        createStep: function (name, options, index) {
            var step = new Step(name, options, this);
            for (var m = 1; m <= step.line.length; m++) {
                var an = step.line[m - 1];
                an.executed = false;
                if (an.time && typeof an.time == "number") {
                    continue;
                }
                //S'il l'id ne correspond pas aux ids dans la tableau elements
                if (!this.elements[an.id]) {
                    console.warn("L'id " + an.id + " n'est pas spécifié dans le tableau des éléments de la Timeline.");
                    step.line.splice((m - 1), 1);
                    m--;
                    continue;
                }
                //S'il n'existe aucune propriété valide, suppression
                if (Object.keys(an.properties).length == 0) {
                    step.line.splice((m - 1), 1);
                    m--;
                    continue;
                }
            }
            if (step.line.length > 0) {
                return step;
            } else {
                return name;
            }
        },
        render: function (num) {
            if (this.status == "init") {
                for (var e in this.elements) {
                    var el = document.getElementById(e);
                    var ani = animate({
                        element: el,
                        duration: 1,
                        properties: [this.elements[e]],
                        autoplay: false
                    });
                    ani.overrideCSS(this.elements[e]);
                }
            }
            /*
            else if(this.status=="rendering"){
                var currentLine = this.line[num];
                for(var prop in currentLine){
                    var step = this.steps[prop];
                    if(step){
                        step.render();
                    }
                } 
            }
            */
        },
        stopAt: function (reach, noForwardsEnd) {
            if (this.status == "normal") {
                this.status = "init";
                this.render();
                this.status = "rendering";

                var direction = this.getDirection(name);

                if (direction == "back") {
                    for (var prop in this.steps) {
                        this.steps[prop].finished = false;
                    }
                }

                //Parcours des étapes considérées non vues (dans l'autre sens)
                for (var index2 = this.line.length; index2 > reach; index2--) {
                    var currentLine = this.line[index2];
                    for (var prop in currentLine) {
                        var step = this.steps[prop],
                            datas = currentLine[prop];
                        if (datas == "ignored") {
                            continue;
                        }
                        if (step) {
                            step.resetted();
                        }
                    }
                }

                //Parcours des étapes considérées vues
                for (var index1 = 0; index1 <= reach; index1++) {
                    var currentLine = this.line[index1];
                    for (var prop in currentLine) {
                        var step = this.steps[prop],
                            datas = currentLine[prop];
                        if (datas == "ignored") {
                            continue;
                        }
                        if (step) {
                            step.render();
                            step.rendered();
                            if (step.seen == false) {
                                step.seen = true;
                            }
                            step.finished = true;
                            if (index1 == reach && noForwardsEnd == undefined) {
                                step.forwardsEnd();
                            }
                        }
                    }
                }

                this.currentIndex = reach;
                this.mainEnd();
                this.status = "normal";
            }
        },
        playFrom: function (num) {
            if (this.status == "normal") {
                this.stopAt(num - 1, false);
                this.play();
            }
        },
        playNext: function () {

        },
        play: function (el, force, isIgnored) {
            if (el == undefined) {
                var currentLine = this.getNext();
            }
            else if (typeof el == "string") {
                var obj = {};
                obj[el] = 0;
                var currentLine = obj;
            } else if (typeof el == "number") {
                var currentLine = this.line[el];
            } else if (typeof el === "object") {
                var currentLine = el;
            } else {
                var currentLine = null;
            }
            if ((this.status == "normal" || force) && currentLine) {
                var datas = currentLine,
                    maxDuration = 0;
                if (!isIgnored) {
                    this.status = "forwards";
                }
                //Parcourt
                for (var prop in datas) {
                    var step = this.steps[prop];
                    if (datas[prop] == "ignored") {
                        continue;
                    }
                    var additionnalDelay = datas[prop];
                    step.forwards(additionnalDelay);
                    var ani = animate({
                        element: this.triggerEl,
                        duration: step.duration,
                        properties: { opacity: 1 },
                        delay: additionnalDelay,
                        end: function () {
                            this.playing = false;
                            if (this.seen == false) {
                                this.seen = true;
                            }
                            this.finished = true;
                        }.bind(step)
                    });

                    var duration = step.duration + additionnalDelay;
                    maxDuration = Math.max(maxDuration, duration);
                }
                var ani2 = animate({
                    element: this.triggerEl,
                    duration: maxDuration,
                    properties: { opacity: 1 },
                    end: function () {
                        this.status = "normal";
                        if (typeof el == "number") {
                            this.currentIndex = el;
                        }
                        this.mainEnd();
                    }.bind(this)
                });
            }
        },
        rewind: function (num) {
            var currentLine = this.line[num] ? this.line[num] : this.line[this.currentIndex],
                prevLine = this.line[this.currentIndex - 1];
            if (this.status == "normal" && currentLine && prevLine) {
                var datas = currentLine,
                    maxDuration = 0;
                this.status = "backwards";
                //Set les durées pour les calculs de décalage et de durée
                for (var prop in datas) {
                    var step = this.steps[prop],
                        additionnalDelay = datas[prop];
                    step.update("backwards");
                    var duration = step.duration + additionnalDelay;
                    maxDuration = Math.max(maxDuration, duration);
                }
                //Parcourt
                for (var prop in datas) {
                    var step = this.steps[prop],
                        additionnalDelay = (maxDuration - (step.duration + datas[prop]));
                    step.backwards(additionnalDelay);
                    var ani = animate({
                        element: this.triggerEl,
                        duration: duration,
                        properties: { opacity: 1 },
                        delay: additionnalDelay,
                        end: function () {
                            this.playing = false;
                            this.finished = false;
                        }.bind(step)
                    });

                    var duration = step.duration + additionnalDelay;
                    maxDuration = Math.max(maxDuration, duration);
                }
                var ani2 = animate({
                    element: this.triggerEl,
                    duration: maxDuration,
                    properties: { opacity: 1 },
                    end: function () {
                        this.status = "normal";
                        this.currentIndex = Math.max(0, this.currentIndex - 1);
                        this.mainEnd();
                    }.bind(this)
                });
            }
        },
        getPrev: function (num, props) {
            var currentIndex = typeof num == "number" ? num : this.currentIndex,
                options = props != undefined ? props : {};
            if (this.line[currentIndex - 1]) {
                if (options.id != undefined && options.property != undefined) {
                    var line = this.line[currentIndex - 1];
                    for (var data in line) {
                        var step = this.steps[data];
                        var previous = step.getLastPropertyValue(options.id, options.property);
                        if (previous != undefined) {
                            return previous;
                        }
                    }
                    return this.getPrev(currentIndex - 1, options);
                } else {
                    return this.line[currentIndex - 1];
                }
            }
            return null;
        },
        getNext: function (num) {
            var currentIndex = typeof num == "number" ? num : this.currentIndex;
            if (this.line[currentIndex + 1]) {
                return this.line[currentIndex + 1];
            }
            return null;
        },
        getDirection: function (num) {
            if (num < this.currentIndex) {
                return "back";
            } else {
                return "go";
            }
        },
        isCurrentlyPlaying: function () {
            const steps = [];
            for (var prop in this.steps) {
                var step = this.steps[prop];
                if (step.playing == true) {
                    steps.push(step);
                }
            }
            return steps.length > 0 ? steps : false;
        },
        stopPlaying: function () {
            for (var prop in this.steps) {
                var step = this.steps[prop];
                if (step.playing == true) {
                    step.stop();
                }
            }
            this.status = "normal";
        },
        canPlayNext: function (num) {
            if (this.getNext(num) == null) {
                return false;
            }
            return true;
        },
        canPlayPrev: function (num) {
            if (this.getPrev(num) == null) {
                return false;
            }
            return true;
        }
    };

    function Step(name, datas, tl) {
        if (!datas.options) {
            datas.options = {};
        }
        this.tl = tl;
        this.name = name;
        this.line = datas.line;
        this.forwardsStart = typeof datas.options.forwardsStart == "function" ? datas.options.forwardsStart : function () { };
        this.forwardsEnd = typeof datas.options.forwardsEnd == "function" ? datas.options.forwardsEnd : function () { };
        this.backwardsStart = typeof datas.options.backwardsStart == "function" ? datas.options.backwardsStart : function () { };
        this.backwardsEnd = typeof datas.options.backwardsEnd == "function" ? datas.options.backwardsEnd : function () { };
        this.rendered = typeof datas.options.rendered == "function" ? datas.options.rendered : function () { };
        this.resetted = typeof datas.options.resetted == "function" ? datas.options.resetted : function () { };
        this.ignored = typeof datas.options.ignored == "boolean" ? datas.options.ignored : false;
        this.durationStandardForwards = typeof datas.durationStandardForwards == "number" ? datas.durationStandardForwards : 1000;
        this.durationStandardBackwards = typeof datas.durationStandardBackwards == "number" ? datas.durationStandardBackwards : 1000;
        this.duration = 0;
        this.seen = false;
        this.finished = false;
        this.playing = false;

        this.init();
    }

    Step.prototype = {
        init: function () {
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                if (an.time) {
                    an.timeRef = an.time;
                }
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if (an.properties == undefined) {
                    continue;
                }
                if (!an.propertiesPrev) {
                    an.propertiesPrev = {};
                }
                for (var prop in an.properties) {
                    if (!this.tl.elements[an.id]) {
                        console.warn("L'élément id " + an.id + " n'existe pas dans la propriétés elements");
                        continue;
                    }
                    if ((prop == "skewX" || prop == "skewY" || prop == "rotate") && typeof an.properties[prop] == "string") {
                        an.properties[prop] = parseFloat(an.properties[prop]);
                    }
                    //Suppression de propriétés non spécifiées dans elements
                    if (this.tl.elements[an.id][prop] == undefined) {
                        delete an.properties[prop];
                        continue;
                    }
                }
                if (!an.propertiesRendered) {
                    an.propertiesRendered = Object.assign({}, an.properties);
                }
                if (!an.propertiesStart) {
                    an.propertiesStart = Object.assign({}, this.tl.elements[an.id]);
                }
                an.easing = getEasing(an.easing);
                an.delayRef = an.delay;
                an.ref = this.name + "-" + l;
                an.animation = null;
            }
        },
        update: function (dir) {
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if (an.time || an.properties == undefined) {
                    continue;
                }
                if (an.duration == undefined) {
                    an.duration = dir == "forwards" ? this.durationStandardForwards : this.durationStandardBackwards;
                }
                an.delay = this.getDelay((l - 1));
            }
            this.duration = this.getDuration();
        },
        render: function () {
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    el = document.getElementById(an.id);
                if (an.time && typeof an.time == "number") {
                    var ftc = an.ftc.bind(this);
                    ftc();
                    continue;
                }
                for (var prop in an.propertiesRendered) {
                    an.animation = animate({
                        element: el,
                        duration: 1,
                        properties: [an.propertiesRendered],
                        autoplay: false
                    });
                    an.animation.overrideCSS(an.propertiesRendered);
                }
                an.executed = true;
            }
        },
        forwards: function (additionnalDelay) {
            this.playing = true;
            this.update("forwards");
            var first = this.getFirst(),
                last = this.getLast();
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    el = document.getElementById(an.id);
                if (an.reset == false && an.executed == true) {
                    continue;
                }
                if (an.time && typeof an.time == "number" && an.time < this.duration) {
                    var ftc = an.ftc.bind(this),
                        time = an.time;
                    an.animation = animate({
                        element: this.tl.triggerEl,
                        duration: time + additionnalDelay,
                        properties: { opacity: 1 },
                        end: ftc
                    });
                    continue;
                }
                if (an.properties == undefined) {
                    continue;
                }
                an.executed = true;
                var cbStart = an.ref == first.ref ? this.forwardsStart.bind(this) : typeof an.cbStart == "function" ? an.cbStart.bind(this) : function () { },
                    cbEnd = an.ref == last.ref ? this.forwardsEnd.bind(this) : typeof an.cbEnd == "function" ? an.cbEnd.bind(this) : function () { };
                an.animation = animate({
                    element: el,
                    delay: an.delay + additionnalDelay,
                    duration: an.duration,
                    properties: [an.properties],
                    easing: an.easing.forwards,
                    cubic: an.cubic,
                    start: cbStart,
                    end: cbEnd
                });
            }
        },
        backwards: function (additionnalDelay) {
            this.playing = true;
            this.update("backwards");
            this.setPrevValues();
            var first = this.getFirst("backwards"),
                last = this.getLast("backwards");
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    el = document.getElementById(an.id);
                if (an.reset == false && an.executed == true) {
                    continue;
                }
                if (an.time && typeof an.time == "number" && an.time < this.duration) {
                    var ftc = an.ftc.bind(this),
                        time = (this.duration - an.time);
                    an.animation = animate({
                        element: this.tl.triggerEl,
                        duration: time,
                        properties: { opacity: 1 },
                        end: ftc
                    });
                    continue;
                }
                if (an.properties == undefined) {
                    continue;
                }
                an.executed = true;
                var cbStart = an.ref == first.ref ? this.backwardsStart.bind(this) : function () { },
                    cbEnd = an.ref == last.ref ? this.backwardsEnd.bind(this) : function () { };
                delay = (this.duration - (an.duration + an.delay)) + additionnalDelay;
                an.animation = animate({
                    element: el,
                    delay: delay,
                    duration: an.duration,
                    properties: [an.propertiesPrev],
                    easing: an.easing.backwards,
                    reversed: true,
                    cubic: an.cubic,
                    start: cbStart,
                    end: cbEnd
                });
            }
        },
        stop: function () {
            this.playing = false;
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                if (an.animation != null) {
                    an.animation.pause();
                }
            }
        },
        reset: function () {
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    el = document.getElementById(an.id);
                if (an.time && typeof an.time == "number") {
                    continue;
                }
                for (var prop in an.propertiesStart) {
                    an.animation = animate({
                        element: el,
                        duration: 1,
                        properties: [an.propertiesStart],
                        autoplay: false
                    });
                    an.animation.overrideCSS(an.propertiesStart);
                }
                an.executed = false;
            }
            this.resetted();
        },
        getNext: function (index) {
            var total = this.line.length;
            if (index == (total - 1)) {
                return;
            }
            do {
                index++;
                if (index > (total - 1)) {
                    return;
                }
                var next = this.line[index];
                if (next && (next.time == undefined && (next.reset == undefined || next.reset == false && next.executed == false))) {
                    return next;
                    break;
                }
            }
            while (index <= total)
        },
        getPrev: function (index) {
            if (index < 0) {
                return;
            }
            do {
                index--;
                if (index < 0) {
                    return;
                }
                var prev = this.line[index];
                if (prev && (prev.time == undefined && (prev.reset == undefined || prev.reset == false && prev.executed == prev))) {
                    return prev;
                    break;
                }
            }
            while (index >= 0)
        },
        getByDelayId: function (delayId) {
            if (typeof delayId != "string") {
                return null;
            }
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                if (an.delayId == delayId) {
                    return an;
                }
            }
            return null;
        },
        getFirst: function (backwards) {
            var min = 800000000000, first;
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    calc = backwards != undefined ? (this.duration - (an.duration + an.delay)) : (an.duration + an.delay);
                if (calc <= min) {
                    first = an;
                    min = (calc);
                }
            }
            return first;
        },
        getLast: function (backwards) {
            var max = 0, last;
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1],
                    calc = backwards != undefined ? (this.duration - (an.duration + an.delay)) : (an.duration + an.delay);
                if (calc >= max) {
                    last = an;
                    max = (calc);
                }
            }
            return last;
        },
        getDuration: function () {
            var max = 0, comp1 = 0, comp2 = 0;
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                if (an.time || an.properties == undefined) {
                    continue;
                }
                if (this.tl.elements[an.id] == undefined || this.tl.elements[an.id] == null) {
                    console.error("L'élément " + (an.id) + " n'existe pas.");
                    continue;
                }
                if (an.noCounted != undefined || (an.reset == false && an.executed == true)) {
                    continue;
                }
                comp1 = Math.max((an.delay + an.duration), comp2);
                comp2 = (an.delay + an.duration);
                max = Math.max(comp1, max);
            }
            return max;
        },
        getDelay: function (index, dir) {
            var an = this.line[index],
                delayRef = an.delayRef,
                delayFunction = an.delayFunction,
                prevAn = this.getPrev(index),
                prevDelay = prevAn == undefined ? 0 : typeof prevAn.delay == "number" ? prevAn.delay : 0,
                duration = an.duration;
            if (delayRef == undefined) {
                return 0;
            }
            else if (typeof delayRef == "string") {
                var adds = delayRef.split("+").filter(function (t) { if (t != "") { return t } }),
                    sum = [];
                for (var a = 1; a <= adds.length; a++) {
                    var add = adds[a - 1],
                        ref = this.getByDelayId(add),
                        prevRef = this.getByDelayId(adds[a - 2]);
                    if (ref) {
                        sum.push(ref.delay);
                    }
                    else if (add.indexOf("{") != -1) {
                        var prop = add.match(/{.*\(/g).join("").replace(/{|\(/g, "");
                        if (typeof this.tl.cbGetDatas[prop] == "function") {
                            var isParam = add.match(/\((.*?)\)/g),
                                param = isParam ? isParam.join("").replace(/\(|\)/g, "") : null;
                            sum.push(this.tl.cbGetDatas[prop](param))
                        }
                    }
                    else if (add == "same") {
                        sum.push(prevRef ? 0 : prevDelay);
                    }
                    else if (add == "next") {
                        sum.push(prevRef ? prevRef.duration + prevRef.delay : prevAn.duration + prevAn.delay);
                    } else {
                        sum.push(adds[a - 2] ? parseFloat(add) : prevDelay + parseFloat(add));
                    }
                }
                //console.log(an.id+" : "+sum);
                return sum.reduce(function (a, b) { return a + b });


            } else {
                return delayRef;
            }
        },
        setPrevValues: function () {
            var tl = this.tl,
                elements = tl.elements;
            for (var l = 1; l <= this.line.length; l++) {
                var an = this.line[l - 1];
                if (an.time || an.properties == undefined) {
                    continue;
                }
                for (var prop in an.properties) {
                    var prevValue,
                        previousInStep = this.getLastPropertyValue(an.id, prop, (l - 1)),
                        previousRemaining = tl.getPrev(tl.currentIndex, { id: an.id, property: prop });
                    //Si valeur précédente se trouve dans la même étape
                    if (previousInStep != undefined) {
                        prevValue = previousInStep;
                    }
                    else if (previousRemaining != undefined) {
                        //Cherche une valeur précédente dans les étapes précédentes
                        prevValue = previousRemaining;
                    } else {
                        //Si aucune, reprend celle de départ
                        prevValue = elements[an.id][prop];
                    }
                    an.propertiesPrev[prop] = prevValue;
                }
            }
        },
        getLastPropertyValue: function (id, prop, index) {
            var start = typeof index == "number" ? index : this.line.length;
            for (var l = start; l >= 1; l--) {
                var an = this.line[l - 1];
                if (an.id == id && an.properties[prop] != undefined) {
                    return an.properties[prop];
                }
            }
            return undefined;
        }
    }

    function getEasing(easing) {
        if (Array.isArray(easing) && easing.length == 2) {
            return { forwards: easing[0], backwards: easing[1] };
        }
        else if (typeof easing == "string") {
            return { forwards: easing, backwards: easing };
        }
        else if (typeof easing == "object") {
            var obj = {};
            if (easing.forwards) {
                obj.forwards = easing.forwards;
            }
            if (easing.backwards) {
                obj.backwards = easing.backwards;
            }
        } else {
            return { forwards: "linear", backwards: "linear" };
        }
    }

    function tIntoObject(nodes, attrName) {
        if (nodes.length == 0) {
            return null;
        }
        var obj = {};
        for (var n = 1; n <= nodes.length; n++) {
            var node = nodes[n - 1];
            obj[node.id] = JSON.parse(node.getAttribute(attrName));
        }
        return obj;
    }

    window.Timeline = Timeline;
    window.Step = Step;
})();