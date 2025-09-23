// Composant Evaluation gérant les indexes, calculs de score + pourcentage
// Couplé à ofp pour les envois plateformes
function Evaluation(props){
    this.hasFeedback = typeof props.hasFeedback=="boolean" ? props.hasFeedback : false;
    //Indexes au hasard/dans l'ordre
    this.randomized = typeof props.randomized=="boolean" ? props.randomized : false;
    //Envoi d'interactions
    this.sendInteractions = typeof props.sendInteractions=="boolean" ? props.sendInteractions : false;
    //Envoi du score
    this.sendScore = typeof props.sendScore=="boolean" ? props.sendScore : true;
    //Score de réussite
    this.completionScore = this.sendScore==false ? null : typeof props.completionScore=="number" ? Math.min(100,props.completionScore) : 80;
    this.current = typeof props.current == "number" ? props.current : 1;
    this.score = this.sendScore==false ? null : typeof props.score == "number" ? props.score : 0;
    //this.btValidate = (props.btValidate instanceof Element || props.btValidate instanceof HTMLDocument) ? props.btValidate : null;
    //this.btNextQuestion = (props.btNextQuestion instanceof Element || props.btNextQuestion instanceof HTMLDocument) ? props.btNextQuestion : null;
    this.questions = Array.isArray(props.questions) ? props.questions : [];
    if(this.questions.length==0){
        return console.error("Paramètre questions vide");
    }
    this.total = this.questions.length;
    this.max = typeof props.max == "number" ? props.max : this.total;
    this.indexes = Array.isArray(props.indexes) ? props.indexes : this.createIndexes();
    this.index = parseInt(this.indexes[this.current-1]);
    this.question = this.questions[this.index];
    this.percent = Math.round(this.score/this.max*100);
    this.status = "na";

    this.onCustomEnd = typeof props.onCustomEnd == "function" ? props.onCustomEnd : function(){};
    this.onCustomNext = typeof props.onCustomNext == "function" ? props.onCustomNext : function(){};
    this.onCustomStart = typeof props.onCustomStart == "function" ? props.onCustomStart : function(){};
    this.onCustomValidate = typeof props.onCustomValidate == "function" ? props.onCustomValidate : function(){};
    this.onCustomFeedback = typeof props.onCustomFeedback == "function" ? props.onCustomFeedback : null;
    this.onCustomReset = typeof props.onCustomReset == "function" ? props.onCustomReset : function(){};
}

Evaluation.prototype = {
    next: function(){
        if(this.status=="na"){
            this.status = "inprogress";
        }
        if(this.current<this.max){
            this.current++;
            this.index = parseInt(this.indexes[this.current-1]);
            this.question = this.questions[this.index];
            this.onCustomNext();
        } else {
            this.end();
        }
    },
    validate: function(datas){
        //SCORM
        if(datas.result==true && this.sendScore){
            this.score++;
            this.percent = Math.round(this.score/this.max*100);
        }
        if(this.sendInteractions){
            var obj = {};
            obj.id = (this.current);
            obj.type = datas.type || "choice";
            obj.result = (typeof datas.result == "number") ? datas.result : (typeof datas.result == "boolean") ? datas.result==true ? "correct" : "incorrect" : "correct";
            if(datas.type!=undefined){
                obj.type = datas.type;
            }
            if(datas.correctResponse!=undefined){
                obj.correctResponse = datas.correctResponse;
            }
            if(datas.studentResponse!=undefined){
                obj.studentResponse = datas.studentResponse;
            }
            if(datas.description!=undefined){
                obj.description = datas.description;
            }
            ofp.sendInteraction(obj); 
        }

        this.onCustomValidate(datas); 

        if(this.onCustomFeedback==null){
            this.next();
        } else {
           this.onCustomFeedback(datas);
        }
    },
    createIndexes: function(){
        var tab = [];
        if(this.randomized==false){
            for(var i=1; i<=this.max; i++){
                tab.push((i-1));
            }
        } else {
            tab = getRandomArray(0,(this.total-1),this.max); 
        }
        return tab;
    },
    start: function(){
        if(this.sendScore){
            if(this.current==1 && this.score!=0){
                this.score = 0;
            }
        }
        this.onCustomStart();
    },
    end: function(){
        if(this.sendScore==true){
            ofp.setScore(this.score,this.max,true);
            if(this.percent>=this.completionScore){
                this.status = "passed";
                //ofp.setSCOSuccessful();
                ofp.setStatus("c");
            } else {
                this.status = "failed";
                //ofp.setSCOFailed();
            }    
        } else {
           this.status = "finished";
           ofp.setStatus("c"); 
        }
        this.onCustomEnd();
    },
    reset: function(){
        if(this.sendScore){
            this.score = 0;
            this.percent = 0;
        }
        if(this.randomized){
            this.indexes = this.createIndexes();
        }
        this.current = 1;
        this.index = parseInt(this.indexes[this.current-1]);
        this.question = this.questions[this.index];
        this.onCustomReset();
    }
};

// -> Retourne un tableau d'index piochés au hasard
function getRandomArray(min,max,total) {
    var tab = [];

    for(var r=1; r<=total; r++){
        tab.push(getRandomIntInclusive(min,max,tab));
    }

    return tab;
}

// -> retourne une valeur au hasard qui n'a pas déjà été prise
function getRandomIntInclusive(min,max,picked){
    var min = Math.ceil(min),
    max = Math.floor(max),
    random = Math.floor(Math.random() * (max - min +1)) + min;
    if(picked.indexOf(random)!=-1){
        return getRandomIntInclusive(min,max,picked);
    } else {
        return random;    
    } 
}