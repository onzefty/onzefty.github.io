function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

(function() {
    //Les éléments des lines des Steps doivent être dans l'ordre, en particulier pour le calcul des delays 'next' | 'same' | '+1000'
    //Les unités doivent idéalement correspondre à celles mises dans elements (sauf cas scale/opacity/skew/rotate)
    function Timeline(options){
        if(!options.steps){
            return console.error("Aucune étape introduite dans la priopriété steps");
        }
        if(!options.elements){
            return console.error("Pas de propriété elements, contenant le listing des éléments de toutes les étapes, ainsi que leurs propriétés de départ.");
        }
        if(!options.triggerEl || !options.triggerEl instanceof HTMLElement){
            return console.error("La propriété triggerEl n'est pas renseigné ou n'est pas un élément DOM");
        }
        this.status = "init";
        this.steps = {};
        this.currentStep = null;
        this.triggerEl = options.triggerEl;
        this.mainEnd = typeof options.mainEnd == "function" ? options.mainEnd : function(){};
        this.elements = Object.assign({},options.elements);
        this.init(options.steps);
    }

    Timeline.prototype = {
        init: function(steps) {
            //Check de la propriété elements
            for(var e in this.elements){
                var el = document.getElementById(e);
                if(!el){
                    console.warn("L'élément",e,"n'existe pas dans le document.")
                    delete this.elements[e];
                    continue;
                }
            }
            //Si aucun élément valide
            if(Object.keys(this.elements).length==0){
                return console.error("Aucun élement dont l'id est valide.");
            }
            //Check des étapes
            for(var prop in steps){
                this.steps[prop] = new Step(prop,steps[prop],this);
                for(var l=1; l<=this.steps[prop].line.length; l++){
                    var an = this.steps[prop].line[l-1];
                    an.executed = false;
                    if(an.time && typeof an.time == "number"){
                        continue;
                    }
                    if(!an.propertiesPrev){
                        an.propertiesPrev = {};
                    }
                    if(!an.propertiesRendered){
                        an.propertiesRendered = {};
                    }
                    for(var prop2 in an.properties){
                        var prevValue;
                        //Suppression de propriétés non spécifiées dans elements
                        if(this.elements[an.id][prop2]==undefined){
                            delete an.properties[prop2];
                            continue;
                        }
                        if(!an.propertiesRendered[prop2]){
                            an.propertiesRendered[prop2] = null;
                        }
                        //Cas deg
                        if((prop2=="skewX"||prop2=="skewY"||prop2=="rotate")&& typeof an.properties[prop2] == "string"){
                            an.properties[prop2] = parseFloat(an.properties[prop2]);
                        }
                        var previousInStep = this.steps[prop].getLastPropertyValue(an.id,prop2,(l-1)),
                        previousSameStep = this.steps[prop].getLastPropertyValue(an.id,prop2,(l)),
                        previousRemaining = this.getPrev({name:prop,id:an.id,property:prop2,ignoreFinished:true});
                        //Si valeur précédente se trouve dans la même étape
                        if(previousInStep!=undefined){
                            prevValue = previousInStep;
                        }
                        else if(previousRemaining != undefined){
                            //Cherche une valeur précédente dans toutes les étapes précédentes
                            prevValue = previousRemaining; 
                        } else {
                            //Si aucune, reprend celle de départ
                            prevValue = this.elements[an.id][prop2];
                            if(!an.propertiesRendered[prop2]){
                                an.propertiesRendered[prop2] = prevValue;
                            }
                        }
                        if(previousSameStep!=undefined){
                            an.propertiesRendered[prop2] = previousSameStep;
                        }
                        if(!an.propertiesPrev[prop2]){
                            an.propertiesPrev[prop2] = prevValue;
                        }
                        if(an.propertiesRendered[prop2]==null){
                            an.propertiesRendered[prop2] = this.elements[an.id][prop2];
                        }
                    }
                    //S'il n'existe aucune propriété valide, suppression
                    if(Object.keys(an.properties).length==0){
                        this.steps[prop].line.splice((l-1),1);
                        l--;
                        continue;
                    }
                }
                //Si aucun élément valide, l'étape est donc supprimée
                if(this.steps[prop].line.length==0){
                    delete this.steps[prop];
                    continue;
                }
            }
            //this.currentStep = Object.keys(this.steps)[0];
            this.render();
            this.status = "normal";
        },
        render: function(name) {
            if(this.status=="init"){
                for(var e in this.elements){
                    var el = document.getElementById(e);
                    var ani = animate({
                        element:el,
                        duration:1,
                        properties:[this.elements[e]],
                        autoplay:false
                    });
                    ani.overrideCSS(this.elements[e]);
                }
            }
            else if(this.status=="rendering"){
                var step = this.steps[name];
                for(var l=1; l<=step.line.length; l++){
                    var an = step.line[l-1],
                    el = document.getElementById(an.id);
                    if(an.time && typeof an.time == "number"){
                        var ftc = an.ftc.bind(this);
                        ftc();
                        continue;
                    }
                    for(var prop in an.propertiesRendered){
                        an.animation = animate({
                            element:el,
                            duration:1,
                            properties:[an.propertiesRendered],
                            autoplay:false
                        });
                        an.animation.overrideCSS(an.propertiesRendered);
                    }
                    an.executed = true;
                }
            }
        },
        stopAt: function(name,noForwardsEnd) {
            if(this.status=="normal"){
                this.status = "init";
                this.render();
                this.status = "rendering";

                var direction = this.getDirection(name);

                if(direction=="back"){
                    for(var prop in this.steps){
                        this.steps[prop].finished = false;
                    }    
                }
                
                var names = Object.keys(this.steps),
                reach = names.indexOf(name),
                index = 0;
                do {
                    var n = names[index],
                    step = this.steps[n];
                    //var condition = direction=="back" ? true : step.finished==true;
                    //((step.ignored==true&&step.finished==true)||step.ignored==false)
                    //if(condition==true){
                        this.render(n);
                        step.rendered();
                        if(step.seen==false){
                            step.seen = true;
                        }
                        step.finished = true;
                        if(n==name && noForwardsEnd==undefined){
                            step.forwardsEnd();
                        }     
                    //}
                    index++;
                }
                while(index<=reach)
                this.currentStep = name;
                this.mainEnd();
                this.status = "normal";
            }
        },
        playFrom: function(name,options) {
            if(this.status=="normal"){
                var prevStep = this.getPrev({name:name,includeIgnore:options.includeIgnore,ignoreFinished:options.ignoreFinished});
                this.stopAt(prevStep.name,false);
                this.play();
            }
        },
        play: function(name) {
            var step = typeof name == "string" ? this.steps[name] : this.currentStep==null ? this.steps[Object.keys(this.steps)[0]] : this.getNext();
            if(this.status=="normal" && step && step.playing==false){
                this.status="forwards";
                step.forwards();
                var ani = animate({
                    element:this.triggerEl,
                    duration:step.duration,
                    properties:{opacity:1},
                    end:function(){
                        step.playing = false;
                        if(step.seen==false){
                            step.seen = true;
                        }
                        step.finished = true;
                        this.status = "normal";
                        if(step.ignored==false){
                            this.currentStep = step.name;
                        }
                        this.mainEnd();
                    }.bind(this)
                });
            }
        },
        rewind: function(name) {
            var currentStep = typeof name == "string" ? name : this.currentStep,
            step = this.steps[currentStep],
            prev = this.getPrev({name:currentStep});
            if(this.status=="normal" && step && step.playing==false && prev){
                this.status="backwards";
                step.backwards();
                var ani = animate({
                    element:this.triggerEl,
                    duration:step.duration,
                    properties:{opacity:1},
                    end:function(){
                        step.playing = false;
                        step.finished = false;
                        this.status = "normal";
                        this.currentStep = prev.name;
                        this.mainEnd();
                    }.bind(this)
                });
            }
        },
        getPrev: function(options) {
            var currentStep = options && typeof options.name == "string" ? options.name : this.currentStep,
            id = options && options.id!=undefined ? options.id : undefined,
            property = options && options.property!=undefined ? options.property : undefined,
            includeIgnore = options && typeof options.includeIgnore == "boolean" ? options.includeIgnore : false,
            ignoreFinished = options && typeof options.ignoreFinished == "boolean" ? options.ignoreFinished : false,
            names = Object.keys(this.steps),
            min = 0,
            index = names.indexOf(currentStep)-1;
            if(index<0){
                return undefined;
            }
            do{
                var step = this.steps[names[index]];
                if(step){
                    //var condition = (includeIgnore==true ? ((step.ignored==true&&step.finished==true)||step.ignored==false) : step.ignored==false);
                    var condition = step.finished==true || (ignoreFinished==true && step.finished==false);
                    if(condition==true){
                        if(id!=undefined&&property!=undefined){
                            var previous = step.getLastPropertyValue(id,property);
                            if(previous!=undefined){
                                return previous;
                            }
                        } else {
                           return step; 
                        } 
                    }    
                } else {
                    return undefined;
                }
                index--;
            }
            while(index>=min)
        },
        getNext: function(options) {
            var currentStep = options && typeof options.name == "string" ? options.name : this.currentStep,
            includeIgnore = options && typeof options.includeIgnore == "boolean" ? options.includeIgnore : false,
            names = Object.keys(this.steps),
            max = names.length,
            index = names.indexOf(currentStep)+1;
            if(index>max){
                return undefined;
            }
            do {
                var step = this.steps[names[index]];
                if(step){
                    var condition = (includeIgnore==true ? ((step.ignored==true&&step.finished==true)||step.ignored==false) : step.ignored==false);
                    if(condition==true){
                        return step;
                    }    
                } else {
                    return undefined;
                }
                
                index++;
            }
            while(index<=max)
        },
        getDirection: function(name) {
            var keys = Object.keys(this.steps),
            index1 = keys.indexOf(name),
            index2 = keys.indexOf(this.currentStep);

            if(index1<index2){
                return "back";
            } else {
                return "go";
            }
        },
        isCurrentlyPlaying: function() {
            for(var prop in this.steps){
                var step = this.steps[prop];
                if(step.playing==true){
                    return true;
                }
            } 
            return false;
        },
        stopPlaying: function(){
            for(var prop in this.steps){
                var step = this.steps[prop];
                if(step.playing==true){
                    step.stop();
                }
            }
            this.status = "normal";
        }
    };

    function Step(name,datas,tl){
        if(!datas.options){
            datas.options = {};
        }
        this.tl = tl;
        this.name = name;
        this.line = datas.line;
        this.forwardsStart = typeof datas.options.forwardsStart == "function" ? datas.options.forwardsStart : function(){};
        this.forwardsEnd = typeof datas.options.forwardsEnd == "function" ? datas.options.forwardsEnd : function(){};
        this.backwardsStart = typeof datas.options.backwardsStart == "function" ? datas.options.backwardsStart : function(){};
        this.backwardsEnd = typeof datas.options.backwardsEnd == "function" ? datas.options.backwardsEnd : function(){};
        this.rendered = typeof datas.options.rendered == "function" ? datas.options.rendered : function(){};
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
        init: function(){
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1];
                if(an.time){
                    an.timeRef = an.time;
                }
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if(an.properties==undefined){
                    continue;
                }
                an.easing = getEasing(an.easing);
                an.delayRef = an.delay;
                an.ref = this.name+"-"+l;
                an.animation = null;
            }
        },
        update: function(dir) {
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1];
                //Exclusion des fonctions ponctuelles + si aucune properties d'animations
                if(an.time || an.properties==undefined){
                    continue;
                }

                if(an.duration==undefined){
                    an.duration = dir=="forwards" ? this.durationStandardForwards : this.durationStandardBackwards;
                }
                an.delay = this.getDelay((l-1));
            }
            this.duration = this.getDuration();
        },
        forwards: function(){
            this.playing = true;
            this.update("forwards");
            this.forwardsStart();
            var last = this.getLast();
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1],
                el = document.getElementById(an.id);
                if(an.reset==false && an.executed==true){
                    continue;
                }
                if(an.time && typeof an.time == "number" && an.time < this.duration){
                    var ftc = an.ftc.bind(this),
                    time = an.time;
                    an.animation = animate({
                        element:this.tl.triggerEl,
                        duration:time,
                        properties:{opacity:1},
                        end:ftc
                    });
                    continue;
                }
                if(an.properties==undefined){
                    continue;
                }
                an.executed = true;
                var ftc = an.ref==last.ref ? this.forwardsEnd.bind(this) : function(){};
                an.animation = animate({
                    element:el,
                    delay:an.delay,
                    duration:an.duration,
                    properties:[an.properties],
                    easing:an.easing.forwards,
                    end:ftc
                });
            }
        },
        backwards: function(prev){
            this.playing = true;
            this.update("backwards");
            this.backwardsStart();
            var last = this.getLast("backwards");
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1],
                el = document.getElementById(an.id);
                if(an.reset==false && an.executed==true){
                    continue;
                }
                if(an.time && typeof an.time == "number" && an.time < this.duration){
                    var ftc = an.ftc.bind(this),
                    time = (this.duration - an.time);
                    an.animation = animate({
                        element:this.tl.triggerEl,
                        duration:time,
                        properties:{opacity:1},
                        end:ftc
                    });
                    continue;
                }
                if(an.properties==undefined){
                    continue;
                }
                an.executed = true;
                var ftc = an.ref==last.ref ? this.backwardsEnd : function(){},
                delay = (this.duration - (an.duration + an.delay));
                an.animation = animate({
                    element:el,
                    delay:delay,
                    duration:an.duration,
                    properties:[an.propertiesPrev],
                    easing:an.easing.backwards,
                    reversed:true,
                    end:ftc
                });
            }
        },
        stop: function(){
            this.playing = false;
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1];
                if(an.animation!=null){
                    an.animation.pause();
                }
            }
        },
        getNext: function(index){
            var total = this.line.length;
            if(index==(total-1)){
                return;
            }
            do {
                index++;
                if(index>(total-1)){
                    return;
                }
                var next = this.line[index];
                if(next && (next.time==undefined && (next.reset==undefined||next.reset==false&&next.executed==false))){
                    return next;
                    break;
                }
            }
            while(index<=total)
        },
        getPrev: function(index){
            if(index<0){
                return;
            }
            do {
                index--;
                if(index<0){
                    return;
                }
                var prev = this.line[index];
                if(prev && (prev.time==undefined && (prev.reset==undefined||prev.reset==false&&prev.executed==prev))){
                    return prev;
                    break;
                }
            }
            while(index>=0)
        },
        getByDelayId: function(delayId){
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1];
                if(an.delayId==delayId){
                    return an;
                }
            }
            return null;
        },
        getLast: function(backwards){
            var max = 0, last;
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1],
                calc = backwards!=undefined ? (this.duration - (an.duration + an.delay)) : (an.duration+an.delay);
                if(calc>=max){
                    last = an;
                    max = (calc);
                }
            }
            return last;
        },
        getDuration: function(){
            var max = 0, comp1 = 0, comp2 = 0;
            for(var l=1; l<=this.line.length; l++){
                var an = this.line[l-1];
                if(an.time || an.properties==undefined){
                    continue;
                }
                if(this.tl.elements[an.id]==undefined||this.tl.elements[an.id]==null){
                    console.error("L'élément "+(an.id)+" n'existe pas.");
                    continue;
                }
                if(an.noCounted!=undefined || (an.reset==false && an.executed==true)){
                    continue;
                }
                comp1 = Math.max((an.delay + an.duration),comp2);
                comp2 = (an.delay + an.duration);
                max = Math.max(comp1,max);
            }
            return max;
        },
        getDelay: function(index,dir){
            var an = this.line[index],
            delayRef = an.delayRef,
            prevAn = this.getPrev(index),
            prevDelay = prevAn==undefined ? 0 : typeof prevAn.delay == "number" ? prevAn.delay : 0,
            duration = an.duration;
            if(delayRef==undefined){
                return 0;
            }
            else if(typeof delayRef == "string"){
                if(delayRef=="next"){
                    return (prevAn.duration + prevDelay);   
                } 
                else if (delayRef=="same"){
                    return prevDelay;
                }
                else if (delayRef.indexOf("+")!=-1 && delayRef.indexOf(":")==-1){
                    return (prevDelay+parseInt(delayRef));
                }
                else if (delayRef.indexOf(":")!=-1){
                    var delayId = delayRef.split(":")[0],
                    delayIdAn = this.getByDelayId(delayId);
                    if(delayIdAn!=null){
                        if(delayRef.indexOf("next")!=-1){
                            return (delayIdAn.delay+delayIdAn.duration);
                        }
                        else if(delayRef.indexOf("same")!=-1){
                            return(delayIdAn.delay);
                        }
                        else if(delayRef.indexOf("+")!=-1){
                            var secs = parseFloat(delayRef.split(":")[1]);
                            return (delayIdAn.delay+secs);
                        }
                    } else {
                        console.warn("delayId => ",delayId," n'est pas valide.");
                        return 0;
                    } 
                }
            } else {
                return delayRef;
            }
        },
        getLastPropertyValue: function(id,prop,index) {
            var start = typeof index == "number" ? index : this.line.length;
            for(var l=start; l>=1; l--){
                var an = this.line[l-1];
                if(an.id==id && an.properties[prop]!=undefined){  
                    return an.properties[prop];
                }
            }
            return undefined;
        }
    }

    function getEasing(easing){
        if(Array.isArray(easing) && easing.length==2){
            return {forwards:easing[0],backwards:easing[1]};
        }
        else if(typeof easing == "string"){
            return {forwards:easing,backwards:easing};
        }
        else if(typeof easing == "object"){
            var obj = {};
            if(easing.forwards){
                obj.forwards = easing.forwards;
            }
            if(easing.backwards){
                obj.backwards = easing.backwards;
            }
        } else {
            return {forwards:"linear",backwards:"linear"};
        }
    }

	window.Timeline = Timeline;
    window.Step = Step;
})();