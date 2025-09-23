function DragDrop(props){
    this.drags = NodeList.prototype.isPrototypeOf(props.drags)==true ? props.drags : null;
    this.drops = NodeList.prototype.isPrototypeOf(props.drops)==true ? props.drops : null;
    this.answers = Array.isArray(props.answers) ? props.answers : null; 
    this.btValidate = props.btValidate instanceof HTMLElement ? props.btValidate : null;
    this.limitXStart = typeof props.limitXStart == "number" ? props.limitXStart : undefined;
    this.limitXEnd = typeof props.limitXEnd == "number" ? props.limitXEnd : undefined;
    this.limitYStart = typeof props.limitYStart == "number" ? props.limitYStart : undefined;
    this.limitYEnd = typeof props.limitYEnd == "number" ? props.limitYEnd : undefined;
    this.classRight = typeof props.classRight == "string" ? props.classRight : "right";
    this.classWrong = typeof props.classWrong == "string" ? props.classWrong : "wrong";
    this.classInactive = typeof props.classInactive == "string" ? props.classInactive : "inactive";
    this.onEnd = typeof props.onEnd == "function" ? props.onEnd : function(){};
    this.onCustomDown = typeof props.onCustomDown == "function" ? props.onCustomDown : function(){};
    this.onCustomUp = typeof props.onCustomUp == "function" ? props.onCustomUp : function(){};
    this.onCustomCheck = typeof props.onCustomCheck == "function" ? props.onCustomCheck : function(){};
    this.attemptsMax = typeof props.attemptsMax == "number" ? props.attemptsMax : 1;
    this.noCorrection = typeof props.noCorrection == "boolean" ? props.noCorrection : false;
    this.attempts = 1;
    this.movables = [];
    this.corrects = 0;
    this.status = "na";
    this.handleCheck = this.check.bind(this);

    if(this.drags==null||this.drops==null||this.answers==null){
        return console.warn("Les options drags, drops ou answers ne sont pas des tableaux.");
    }

    this.init();
}

DragDrop.prototype = {
    onDown:function(movable){
        if(this.status=="na"){
            this.status = "inprogress";
        }
        this.onCustomDown(movable);
    },
    onMove:function(){
    },
    onUp:function(movable){
        var linked = false;
        for(var d=1; d<=this.drops.length; d++){
            var drop = this.drops[d-1];
            collision = overLap(movable.element,drop,"70%");
            if(collision==true){
                linked = true;
                var drag = this.getDragByDrop(drop.num);
                if(drag){
                    drag.replace();
                    drag.linked = null;
                    drop.linked = null;
                }
                movable.element.style.left = drop.offsetLeft+"px";
                movable.element.style.top = drop.offsetTop+"px";
                movable.linked = drop;
                drop.linked = movable;
                break;
            }
        }

        if(linked==false){
            movable.replace();
            movable.linked = null;
        }
        
        var unlinked = this.getDragUnlinked();
        if(unlinked.length==0){
            if(this.btValidate!=null){
                this.btValidate.classList.remove(this.classInactive);
            } else {
                this.check();
            }
        }

        this.onCustomUp(movable);
    },
    getDragUnlinked:function(){
        return this.movables.filter(function(m){ if(m.linked==null){ return m }});
    },
    getDragByDrop:function(num){
        return this.movables.filter(function(m){ if(m.linked!=null && m.linked.num==num){ return m }})[0];
    },
    getDropByAnswer:function(answer){
        for(var d=1; d<=this.drops.length; d++){
            var drop = this.drops[d-1],
            correct = answer.filter(function(a){ if(a==drop.num && drop.corrected==false){ return a;}}).length>0;
            if(correct){
                return drop;
                break;
            }
        }
    },
    check:function(){
        var count = 0;
        for(var m=1; m<=this.movables.length; m++){
            var movable = this.movables[m-1];
            if(movable.answer.indexOf(movable.linked.num)!=-1){
                movable.element.classList.add(this.classRight);
                count++;
            } else {
                movable.element.classList.add(this.classWrong);  
            }
        }

        this.corrects = count;

        if(count==this.movables.length){
            this.status = "passed";
            this.onCustomCheck(true);
            this.dispose();
            this.onEnd();
        } else {
            this.onCustomCheck(false);
            if(this.attempts<this.attemptsMax){
                this.attempts++;
                this.replaceAll();
                if(this.btValidate!=null){
                    this.btValidate.classList.add(this.classInactive);
                }
            } else {
                this.status = "failed";
                this.replaceAllCorrects();
                this.dispose();
                this.onEnd();
            }
        }
    },
    replaceAll:function(){
        for(var m=1; m<=this.movables.length; m++){
            var movable = this.movables[m-1];
            if(!movable.element.classList.contains(this.classRight)){
                movable.element.classList.remove(this.classWrong);
                if(movable.linked!=null){
                    movable.linked.linked = null;
                    movable.linked = null;
                }
                movable.replace();
            }
        }
    },
    replaceAllCorrects:function(force){
        if(this.noCorrection==true && force==undefined){
            return;
        }
        for(var m=1; m<=this.movables.length; m++){
            var movable = this.movables[m-1];
            if(!movable.element.classList.contains(this.classRight)){
                var drop = this.getDropByAnswer(movable.answer);
                movable.element.style.left = drop.offsetLeft+"px";
                movable.element.style.top = drop.offsetTop+"px";
                movable.element.classList.remove(this.classWrong);
                movable.element.classList.add(this.classRight);
                movable.linked = drop;
                drop.corrected = true;
            }
        }
    },
    reset:function(){
        for(var m=1; m<=this.movables.length; m++){
            var movable = this.movables[m-1],
            drop = this.drops[m-1];
            
            movable.element.classList.remove(this.classRight);
            movable.element.classList.remove(this.classWrong);
            movable.linked = null;
            movable.replace();
            movable.reset();

            if(drop){
                drop.linked = null;
                drop.corrected = false;
            }
        }
    },
    dispose:function(){
        for(var m=1; m<=this.movables.length; m++){
            this.movables[m-1].dispose();
        }
        if(this.btValidate!=null){
            this.btValidate.removeEventListener(Constants.CLICK_TOUCH,this.handleCheck);
        }
    },
    init:function(){
        for(var d=1; d<=this.drags.length; d++){
            var drag = this.drags[d-1],
            drop = this.drops[d-1];

            if(drop){
               drop.num = d; 
               drop.linked = null;
               drop.corrected = false;
            }

            drag.classList.remove(this.classRight);
            drag.classList.remove(this.classWrong);

            this.movables.push(
                new Movable({
                    element:drag,
                    limitXStart:this.limitXStart,
                    limitXEnd:this.limitXEnd,
                    limitYStart:this.limitYStart,
                    limitYEnd:this.limitYEnd
                })
            );

            this.movables[d-1].num = d;
            this.movables[d-1].linked = null;
            this.movables[d-1].answer = !Array.isArray(this.answers[d-1]) ? [this.answers[d-1]] : this.answers[d-1];
            this.movables[d-1].customOnDown = this.onDown.bind(this,this.movables[d-1]);
            this.movables[d-1].customOnUp = this.onUp.bind(this,this.movables[d-1]);
        }

        if(this.btValidate!=null){
            this.btValidate.classList.add(this.classInactive);
            this.btValidate.addEventListener(Constants.CLICK_TOUCH,this.handleCheck);
        }
    }
}

//Détecte 1 chevauchement entre 2 éléments
function overLap(overEl,overLapped,percent,axis){
    var partX = percent!=undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[0]) : parseInt(percent) : 100,
    partX2 = 100 - partX,
    partY = percent!=undefined ? Array.isArray(percent) && percent.length == 2 ? parseInt(percent[1]) : parseInt(percent) : 100,
    partY2 = 100 - partY,
    posXOver = overEl["offsetLeft"],
    dimXOver = overEl["offsetWidth"],
    rightOver = posXOver + dimXOver,
    dimXOver1 = Math.round(partX/100*overEl["offsetWidth"]),
    dimXOver2 = Math.round(partX2/100*overEl["offsetWidth"]),
    partRightOver1 = rightOver - dimXOver1,
    partRightOver2 = rightOver - dimXOver2,
    posYOver = overEl["offsetTop"],
    dimYOver = overEl["offsetHeight"],
    bottomOver = posYOver + dimYOver,
    dimYOver1 = Math.round(partY/100*overEl["offsetHeight"]),
    dimYOver2 = Math.round(partY2/100*overEl["offsetHeight"]),
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
    condition = (axis=="x") ? (isOverX && betweenY) : (axis=="y") ? (isOverY && betweenX) : (isOverX && isOverY);

    return condition;
}