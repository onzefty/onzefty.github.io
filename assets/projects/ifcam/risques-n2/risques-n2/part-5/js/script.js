var soundsData = [
    { id: 'sound_1', name: 'sound_5_1', path: 'local' },
    { id: 'sound_3', name: 'sound_5_3', path: 'local' }
];

var quiz;

var questions = [
    {
        choices:[
            {json:"q1-choice-1",answer:true},
            {json:"q1-choice-2",answer:true},
            {json:"q1-choice-3",answer:false},
            {json:"q1-choice-4",answer:false}
        ],
        helper:"quiz-qcm"
    },
    {
        choices:[
            {json:"q2-choice-1",answer:true},
            {json:"q2-choice-2",answer:false},
            {json:"q2-choice-3",answer:true}
        ],
        helper:"quiz-qcm"
    },
    {
        choices:[
            {json:"q3-choice-1",answer:true},
            {json:"q3-choice-2",answer:true},
            {json:"q3-choice-3",answer:true},
            {json:"q3-choice-4",answer:true}
        ],
        helper:"quiz-qcm"
    },
    {
        choices:[
            {json:"q4-choice-1",answer:true},
            {json:"q4-choice-2",answer:true},
            {json:"q4-choice-3",answer:true}
        ],
        helper:"quiz-qcm"
    },
    {
        choices:[
            {json:"q5-choice-1",answer:false},
            {json:"q5-choice-2",answer:false},
            {json:"q5-choice-3",answer:true}
        ],
        helper:"quiz-qcu"
    },
    {
        choices:[
            {json:"q6-choice-1",answer:true},
            {json:"q6-choice-2",answer:true},
            {json:"q6-choice-3",answer:false}
        ],
        helper:"quiz-qcm-2"
    },
    {
        choices:[
            {json:"q7-choice-1",answer:true},
            {json:"q7-choice-2",answer:true},
            {json:"q7-choice-3",answer:true},
            {json:"q7-choice-4",answer:false}
        ],
        helper:"quiz-qcm-2"
    },
    {
        choices:[
            {json:"q8-choice-1",answer:false},
            {json:"q8-choice-2",answer:true},
            {json:"q8-choice-3",answer:true}
        ],
        helper:"quiz-qcm-2"
    },
    {
        drops:[
            {json:"q9-drop-1",answer:2},
            {json:"q9-drop-2",answer:1},
            {json:"q9-drop-3",answer:5},
            {json:"q9-drop-4",answer:4},
            {json:"q9-drop-5",answer:3},
        ],
        drags:[
            {json:"q9-drag-1"},
            {json:"q9-drag-2"},
            {json:"q9-drag-3"},
            {json:"q9-drag-4"},
            {json:"q9-drag-5"}
        ],
        btValidate:{
            y:-200
        }
    }
];

function Quiz(props){
    var defaultOptions = {
        indexes:null,
        pick:null,
        score:null,
        current:null,
        cbRender: function(){},
        cbNext: function(){},
        cbEnd: function() {},
        cbReset: function() {},
    }
    this.options = Object.assign(defaultOptions, props);

    this.indexes = null;
    this.index = null;
    this.total = null;
    this.progress = 0;
    this.scoreScale = 0;
    this.current = (typeof this.options.current == "number") ? this.options.current : 1;
    this.score = (typeof this.options.score == "number") ? this.options.score : 0;
    this.success = false;
    this.ended = false;

    this.init();
}

Quiz.prototype = {
    createIndexes: function(){
        var tab = [];
        if(typeof this.options.pick == "number"){
            tab = getRandomArray(0,(this.options.questions.length-1),this.options.pick); 
        } else {
            for(var i=1; i<=this.options.indexes.length; i++){
                tab.push((i-1));
            }  
        }
        return tab;
    },
    init:function(){
        this.indexes = Array.isArray(this.options.indexes) ? this.options.indexes : this.createIndexes();
        this.total = this.indexes.length;
        this.index = this.indexes[this.current-1];
        this.progress = Math.round(this.current/this.total*100);
        this.scoreScale = Math.round(this.score/this.total*100);
    },
    validate:function(correct){
        if(correct==true){
            this.score++;
            this.scoreScale = Math.round(this.score/this.total*100);
            if(this.scoreScale==100){
                this.success = true;
            }
        }
        return this;
    },
    next:function(correct){
        if(this.current<this.total){
            this.current++;
            this.index = this.indexes[this.current-1];
            this.progress = Math.round(this.current/this.total*100);
            this.options.cbNext();
        } else {
            this.end();
        }
    },
    render:function(){
        this.options.cbRender(this.current,parseInt(this.index));
    },
    reset:function(){
        this.current = 1;
        this.success = false;
        this.progress = 0;
        this.score = 0;
        this.scoreScale = 0;
        this.ended = false;
    },
    restart:function(){
        this.reset();
        this.init();
        this.render();
    },
    end:function(){
        this.ended = true;
        this.options.cbEnd();
    }
}

function quizInit(){
    if(!quiz){
        quiz = new Quiz({
            questions:questions,
            current:parseInt(scorm.parsedDatas[currentFileId-1][3]),
            score:parseInt(scorm.parsedDatas[currentFileId-1][4]),
            indexes:scorm.parsedDatas[currentFileId-1][5],
            pick:8,
            cbRender:quizRender,
            cbNext:quizNext,
            cbEnd:function(){
                navigation.next(true);
            }
        });
        if(!scorm.parsedDatas[currentFileId-1][5]){
            scorm.parsedDatas[currentFileId-1][5] = quiz.indexes;
        }
    }
    else if(quiz.ended==true){
        quiz.restart();
        scorm.parsedDatas[currentFileId-1][5] = quiz.indexes;
    }
}

function quizRender(current,index){
    var quizQuestionEl = sections[1].querySelector("#quiz-question"),
    quizSentenceEl = sections[1].querySelector("#quiz-sentence"),
    quizHelperEl = sections[1].querySelector("#quiz-helper"),
    quizInteractionsWrapper = sections[1].querySelector("#quiz-interactions-wrapper"),
    quizClickablesContainer = quizInteractionsWrapper.querySelector("#quiz-interactions-clickables"),
    quizClickablesEls = quizClickablesContainer.querySelectorAll(".quiz-clickable"),
    quizListContainer = quizInteractionsWrapper.querySelector("#quiz-interactions-lists"),
    quizDragsContainer = quizInteractionsWrapper.querySelector("#quiz-interactions-drags"),
    quizBtValidateEl = sections[1].querySelector("#quiz-button-validate"),
    quizProgressEl = sections[1].querySelector("#quiz-progress-wrapper"),
    quizProgressEls = quizProgressEl.querySelectorAll("div"),
    quizImgsEl = sections[1].querySelector("#quiz-imgs"),
    quizImgsEls = quizImgsEl.querySelectorAll("img"),
    question = questions[index],
    num = (index+1);

    quizQuestionEl.innerHTML = languageManager.jsonObj["question"]+" "+current;
    quizSentenceEl.innerHTML = languageManager.jsonObj["q"+num+"-sentence"];
    quizSentenceEl.setAttribute("json","q"+num+"-sentence");
    if(question.helper){
        quizHelperEl.parentNode.classList.remove("hidden");
        quizInteractionsWrapper.style.height = "";
        quizHelperEl.innerHTML = languageManager.jsonObj[question.helper];
        quizHelperEl.setAttribute("json",question.helper);
    } else {
        quizHelperEl.parentNode.classList.add("hidden");
        quizInteractionsWrapper.style.height = "370px";
    }
    

    quizClickablesContainer.classList.add("hidden");
    quizListContainer.classList.add("hidden");
    quizDragsContainer.classList.add("hidden");

    quizBtValidateEl.style.translate = "";

    if(question.choices){
        quizClickablesContainer.classList.remove("hidden");
        quizClickablesContainer.setAttribute("num",question.choices.length);
        var clickables = [];
        for(var c=1; c<=quizClickablesEls.length; c++){
            var quizClickablesEl = quizClickablesEls[c-1],
            choice = question.choices[c-1];
            if(choice){
                quizClickablesEl.classList.remove("hidden");
                quizClickablesEl.querySelector("p").innerHTML = languageManager.jsonObj[choice.json];
                quizClickablesEl.querySelector("p").setAttribute("json",languageManager.jsonObj[choice.json]);
                clickables.push(quizClickablesEl);
            } else {
                quizClickablesEl.classList.add("hidden");
            }
        }
        new Clickables({
            datas:question.choices,
            buttons:clickables,
            btValidate:quizBtValidateEl,
            noCorrection:true,
            cbEnd:quizValidate
        });
    }
    else if(question.lists){
        quizListContainer.classList.remove("hidden");
        quizListContainer.setAttribute("json",question.json);
        //Remplacement des placeholders
        var str = languageManager.jsonObj[question.json];
        var matches = str.match(/<.*?>/g);
        for(var t=1; t<=matches.length; t++){
            var id = matches[t-1].replace(/<|>/g,"");
            var replacement = "<div id='"+id+"' class='quiz-list'></div>";
            str = str.replace(matches[t-1],replacement);
        }
        quizListContainer.innerHTML = str;
        new Lists({
            datas:question.lists,
            lists:quizListContainer.querySelectorAll(".quiz-list"),
            btValidate:quizBtValidateEl,
            noCorrection:true,
            cbEnd:quizValidate,
            cbSelect:function(listChoice){
                this.displayEl.querySelector("p").setAttribute("json",listChoice.element.getAttribute("json"));
            },
            cbInitListChoice:function(){
                this.element.innerHTML = languageManager.jsonObj["q4-choice-"+this.listNum+"-"+this.num];
                this.element.setAttribute("json","q4-choice-"+this.listNum+"-"+this.num);
            }
        });
    }
    else if(question.drags){
        quizDragsContainer.classList.remove("hidden");
        var drags = quizDragsContainer.querySelectorAll(".quiz-drag");
        var drops = quizDragsContainer.querySelectorAll(".quiz-drop")
        for(var d=1; d<=question.drops.length; d++){
            var drop = drops[d-1];
            var drag = drags[d-1];
            var dropDatas = question.drops[d-1];
            var dragDatas = question.drags[d-1];
            drop.querySelector("p").innerHTML = languageManager.jsonObj[dropDatas.json];
            drop.querySelector("p").setAttribute("json",dropDatas.json);
            if(dragDatas && drag){
                drag.querySelector("p").innerHTML = languageManager.jsonObj[dragDatas.json];
                drag.querySelector("p").setAttribute("json",dragDatas.json);
                drag.style.translate = "";
            }
        }
        new DragDrop({
            drags:drags,
            drops:drops,
            dropDatas: question.drops,
            btValidate: quizBtValidateEl,
            cbEnd:quizValidate,
            noCorrection:true
        });

        quizBtValidateEl.classList.remove("inactive");
    }

    if(question.btValidate){
        var x = question.btValidate.x || 0;
        var y = question.btValidate.y || 0;
        quizBtValidateEl.style.translate = x+"px "+y+"px";
    }

    var currentProgressEl = quizProgressEl.querySelector(".current");
    if(currentProgressEl){
        currentProgressEl.classList.remove("current");
    }
    quizProgressEls[current-1].classList.add("current");

    for(var i=1; i<=quizImgsEls.length; i++){
        quizImgsEls[i-1].style.translate = "100% 0%";
    }

    quizImgsEls[index].style.opacity = 1;
    quizImgsEls[index].style.translate = "0% 0%";
}

function quizValidate(correct){
    var c = (correct==1||correct==true);
    quiz.validate(c).next();
}

function quizNext(){
    //Enregistrement de la progression du quiz
    scorm.parsedDatas[currentFileId-1][3] = quiz.current;
    scorm.parsedDatas[currentFileId-1][4] = quiz.score;
    save(true);
    var quizWrapperEl = sections[1].querySelector("#quiz-wrapper"),
    quizImgsEl = sections[1].querySelector("#quiz-imgs"),
    quizImgsEls = quizImgsEl.querySelectorAll("img"),
    quizImgShow = quizImgsEls[quiz.index],
    quizImgHide = quizImgsEls[quiz.indexes[quiz.current-2]];
    quizWrapperEl.style["pointer-events"] = "none";
    
    quiz.render();

    quizImgShow.style.translate = "100% 0%";
    quizImgHide.style.translate = "0% 0%";

    animate({
        element:quizImgShow,
        properties:{
            translateX:"0%"
        },
        duration:1000,
        easing:"inOutExpo",
        end:function(){
            quizWrapperEl.style["pointer-events"] = "";
        }
    });

    animate({
        element:quizImgHide,
        properties:{
            translateX:"-100%"
        },
        duration:1000,
        easing:"inOutExpo"
    });    
}

function quizResults(){
    quizCorrections();
    var resultsGroupEl = sections[0].querySelector("#s3-group"),
    resultTxt1El = resultsGroupEl.querySelector(".result-txt-1"),
    resultTxt2El = resultsGroupEl.querySelector(".result-txt-2"),
    resultTxt3El = resultsGroupEl.querySelector(".s3-feedback-txt-score"),
    btRedoEl = resultsGroupEl.querySelector("#s3-button-redo"),
    which = quiz.success==true ? "perfect" : (quiz.scoreScale>=80) ? "good" : (quiz.scoreScale>=50) ? "medium" : "bad",
    txt1 = languageManager.jsonObj["s3-feedback-txt-"+which+"-1"],
    txt2 = languageManager.jsonObj["s3-feedback-txt-"+which+"-2"];
    
    if(txt1){
        resultTxt1El.innerHTML = txt1;
        resultTxt1El.setAttribute("json","s3-feedback-txt-"+which+"-1")
    }
    if(txt2){
        resultTxt2El.innerHTML = txt2;
        resultTxt2El.setAttribute("json","s3-feedback-txt-"+which+"-2")
    }
    
    //Remplacement des placeholders
    var str = languageManager.jsonObj["s3-feedback-txt-score"],
    toReplace = str.match(/<.*?>/g);
    str = str.replace(toReplace[0],quiz.scoreScale);
    resultTxt3El.innerHTML = str;

    //Score maj pour enregistrement
    //Envoie du valeur sur 100 car IFCAM ne prend pas en compte les bonnes valeurs de score_raw
    scorm.score.value = quiz.scoreScale;
    scorm.score.max = 100;
    scorm.score.scaled = quiz.scoreScale;
    //Les valeurs de current score et d'indexes sont remis à 0, dans le cas où l'apprenant quitte, relance le quiz (afin que ce soit remis à 0)
    scorm.parsedDatas[currentFileId-1][3] = 1;
    scorm.parsedDatas[currentFileId-1][4] = 0;
    scorm.parsedDatas[currentFileId-1].pop();
    save(true);
}

function quizCorrections(){
    var buttonCorrections = sections[0].querySelector("#s3-button-corrections"),
    correctionsWrapEl = sections[0].querySelector("#s3-quiz-corrections-wrap"),
    correctionsButtonClose = correctionsWrapEl.querySelector("#s3-quiz-corrections-button-close"),
    correctionsButtonEls = correctionsWrapEl.querySelectorAll(".s3-quiz-corrections-button"),
    correctionsSentenceEl = correctionsWrapEl.querySelector("#s3-quiz-corrections-sentence"),
    correctionsRightWrapperEl = correctionsWrapEl.querySelector("#s3-quiz-corrections-right-wrapper"),
    correctionsWrongWrapperEl = correctionsWrapEl.querySelector("#s3-quiz-corrections-wrong-wrapper"),
    correctionsHelperEl = correctionsWrapEl.querySelector("#s3-quiz-corrections-helper");

    function correctionDisplay(){
        correctionEmpty();
        var selectedEl = this.parentNode.querySelector("[status='selected']");
        if(selectedEl){
            selectedEl.removeAttribute("status");
        }
        this.setAttribute("status","selected");
        var index = parseFloat(this.getAttribute("index")),
        question = questions[index], 
        sentence = "q"+(index+1)+"-sentence";
        correctionsSentenceEl.innerHTML = languageManager.getTextFromJSON(sentence);
        correctionsRightWrapperEl.style.opacity = 1;
        correctionsWrongWrapperEl.style.opacity = 1;
        correctionsHelperEl.style.opacity = 0;

        if(question.choices){
            for(var c=1; c<=question.choices.length; c++){
                var choice = question.choices[c-1],
                text = languageManager.getTextFromJSON(choice.json),
                wrap = choice.answer === true ? correctionsRightWrapperEl : correctionsWrongWrapperEl,
                item = document.createElement("div");
                item.className = "s3-quiz-corrections-item flexCenter removable";
                item.innerHTML = "<p class='Roboto-Regular'>"+text+"</p>";
                wrap.appendChild(item);
            }

            correctionsRightWrapperEl.setAttribute("grid",correctionsRightWrapperEl.querySelectorAll(".s3-quiz-corrections-item").length)
            correctionsWrongWrapperEl.setAttribute("grid",correctionsWrongWrapperEl.querySelectorAll(".s3-quiz-corrections-item").length)
        }
        else if(question.lists) {
            //Rights
            var str = languageManager.getTextFromJSON(question.json),
            matches = str.match(/<.*?>/g);
            for(var t=1; t<=matches.length; t++){
                var correct = question.lists[t-1].filter(function(l){ return l.answer===true})[0].json,
                txt = languageManager.getTextFromJSON(correct);
                var replacement = "<span>"+txt+"</span>";
                str = str.replace(matches[t-1],replacement);
            }
            var rightEl = document.createElement("p");
            rightEl.innerHTML = str;
            rightEl.className = "s3-corrections-p Roboto-Regular removable";
            correctionsRightWrapperEl.appendChild(rightEl);

            //Wrongs
            var container = document.createElement("div");
            container.className = "flex s3-corrections-list-el removable";
            for(var u=1; u<=question.corrections.length; u++){
                var text = languageManager.getTextFromJSON(question.corrections[u-1]);
                var container2 = document.createElement("div");
                container2.className = "flex";
                container2.style["gap"] = "15px";
                container2.innerHTML = "<p class='Roboto-Regular'>"+text+"</p><div></div>";
                container.appendChild(container2);
                var listing = container2.querySelector("div");
                for(var l=1; l<=question.lists[u-1].length; l++){
                    var list = question.lists[u-1][l-1];
                    if(list.answer===false){
                        var wrongEl = document.createElement("p");
                        wrongEl.innerHTML = languageManager.getTextFromJSON(list.json);
                        wrongEl.className = "s3-corrections-p Roboto-Regular";
                        listing.appendChild(wrongEl);
                        if(l!=question.lists[u-1].length){
                            wrongEl.style["margin-bottom"] = "8px";
                        }
                    } 
                }  
            }
            correctionsWrongWrapperEl.appendChild(container);
        } 
        else if(question.drags){
            correctionsRightWrapperEl.style.display = "none";
            correctionsWrongWrapperEl.style.display = "none";
            var container = document.createElement("div");
            container.className = "correction-drag flex col removable";
            for(var d=1; d<=question.drops.length; d++){
                var dropDatas = question.drops[d-1];
                var answer = dropDatas.answer
                var dragDatas = question.drags[answer-1];

                var line = document.createElement("div");
                line.className = "correction-line flexXStart";
                var dropEl = document.createElement("div");
                var dropPEl = document.createElement("p");
                dropEl.className = "correction-box flexXStart Roboto-Regular";
                dropPEl.innerHTML = languageManager.jsonObj[dropDatas.json];
                dropEl.appendChild(dropPEl);
                var dragEl = document.createElement("div");
                var dragPEl = document.createElement("p");
                dragEl.className = "correction-box flexXStart Roboto-Regular";
                dragPEl.innerHTML = languageManager.jsonObj[dragDatas.json];
                dragEl.appendChild(dragPEl);
                var arrowEl = document.createElement("img");
                arrowEl.src = "imgs/edge-green.svg";
                arrowEl.style.width = "12px";
                line.append(dropEl,arrowEl,dragEl);
                container.appendChild(line);
            }
            correctionsSentenceEl.parentNode.insertAdjacentElement("afterend",container);
        }
    }

    function correctionClean(){
        var selectedEl = correctionsButtonEls[0].parentNode.querySelector("[status='selected']");
        if(selectedEl){
            selectedEl.removeAttribute("status");
        }
        correctionsSentenceEl.innerHTML = "";
        correctionsRightWrapperEl.style.opacity = 0;
        correctionsWrongWrapperEl.style.opacity = 0;
        correctionEmpty();
    }

    function correctionEmpty(){
        correctionsRightWrapperEl.style.display = "";
        correctionsWrongWrapperEl.style.display = "";
        correctionsRightWrapperEl.removeAttribute("grid");
        correctionsWrongWrapperEl.removeAttribute("grid");
        var children = correctionsRightWrapperEl.parentNode.querySelectorAll(".removable");
        if(children.length > 0){
            for(var c=1; c<=children.length; c++){
                var child = children[c-1];
                child.parentNode.removeChild(child);
            }
        }
    }

    function correctionShow(){
        if(timeline.status==="normal"){
            correctionClean();
            timeline.play("screen-3-corrections-show",true);
        }
    }

    function correctionHide(){
        if(timeline.status==="normal"){
            timeline.play("screen-3-corrections-hide",true);
        }
    }

    //Init
    for(var b=1; b<=correctionsButtonEls.length; b++){
        var correctionsButtonEl = correctionsButtonEls[b-1];
        correctionsButtonEl.setAttribute("index",quiz.indexes[b-1]);
        $(correctionsButtonEl).on(Constants.CLICK_TOUCH,correctionDisplay);

    }
    $(buttonCorrections).on(Constants.CLICK_TOUCH,correctionShow);
    $(correctionsButtonClose).on(Constants.CLICK_TOUCH,correctionHide);
}

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