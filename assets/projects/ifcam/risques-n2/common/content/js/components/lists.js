// -> Moteur gestionnaire de listes déroulantes
// css utilisé pour les animations
// utilise jQuery pour les événements
function Lists(props){
    var defaultOptions = {
        datas: [],
        lists: [],
        btValidate: null,
        btClassInactive:"inactive",
        attempts: 1,
        noCorrection: false,
        cbOpen: function(){},
        cbClose: function(){},
        cbSelect: function(){},
        cbInitListChoice: function(){},
        cbEnd: function () { },
        cbReset: function () { },
    }
    this.options = Object.assign(defaultOptions, props);

    this.lists = [];
    this.currentAttempt = 1;
    this.success = false;

    this.handleValidate = this.validate.bind(this);
    this.handleReadyValidation = this.isReadyForValidation.bind(this);

    this.init();
    this.reset();
}

Lists.prototype = {
    init:function(){
        for(var l=1; l<=this.options.lists.length; l++){
            var list = this.options.lists[l-1],
            datas = this.options.datas[l-1];
            this.lists.push(new List({
                element:list,
                datas:datas,
                num:l,
                cbInitListChoice:this.options.cbInitListChoice,
                cbSelect:this.options.cbSelect,
                isReadyForValidation:this.handleReadyValidation
            }));
        }
    },
    validate: function(){
        var count = 0;
        for(var l=1; l<=this.lists.length; l++){
            var list = this.lists[l-1];
            if(list.answer==true){
                count++;
                list.isRight();
            } else {
                list.isWrong();
            }
        }
        if(count==this.lists.length){
            this.success = true;
            this.end(true);
        } else {
            if (this.currentAttempt < this.options.attempts) {
                this.currentAttempt++;
            } else {
                if (this.options.noCorrection) {
                    this.end(false);
                } else {
                    this.correction();
                    this.end(false);
                }
            }
        }
    },
    correction:function(){
        for(var l=1; l<=this.lists.length; l++){
            var list = this.lists[l-1];
            if(list.answer==false){
                list.isCorrected();
            }
        }
    },
    isReadyForValidation: function () {
        var listsFull = this.getListsFull();
        if(listsFull.length==this.lists.length){
            this.options.btValidate.classList.remove(this.options.btClassInactive);
        }
    },
    getListsFull: function(){
        return this.lists.filter(function(list){ if(list.full==true){return list}});
    },
    dispose:function(){
        for(var l=1; l<=this.lists.length; l++){
            var list = this.lists[l-1];
            list.dispose();
        }
        if (this.options.btValidate != null) {
            $(this.options.btValidate).off(Constants.CLICK_TOUCH);
        }
    },
    reset:function(){
        this.success = false;
        for(var l=1; l<=this.lists.length; l++){
            var list = this.lists[l-1];
            list.reset();
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.add(this.options.btClassInactive);
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }
        this.options.cbReset();
    },
    end:function(correct){
        this.dispose();
        this.options.cbEnd(correct);
    }
}

function List(props){
    this.element = props.element;
    this.datas = props.datas;
    this.num = props.num;
    this.cbInitListChoice = props.cbInitListChoice;
    this.cbSelect = props.cbSelect;
    this.isReadyForValidation = props.isReadyForValidation;
    this.displayEl = this.element.querySelector(".list-display");
    this.choicesEl;
    this.choicesEls;
    this.correct = false;
    this.answer = false;
    this.full = false;
    this.state = "close";
    this.choices = [];

    this.handleToggle = this.toggle.bind(this);
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);

    this.init();
    this.addEvents();
    this.reset();
    this.activate();
}

List.prototype = {
    init:function(){
        if(!this.displayEl){
            this.element.innerHTML = "<div class='list-display flex'><p></p><img src='imgs/list-img.svg'></div><div class='list-choices origin50-0'></div><div class='indicator'></div>";
            var choicesEl = this.element.querySelector(".list-choices");
            //Ajouts des p selon le nombre de possibilités
            for(var p=1; p<=this.datas.length; p++){
                choicesEl.appendChild(document.createElement("p"));
            }
        }
        this.displayEl = this.element.querySelector(".list-display");
        this.choicesEl = this.element.querySelector(".list-choices");
        this.choicesEls = this.choicesEl.querySelectorAll("p");

        var widthM = 0,
        heightM = 0;

        for(var c=1; c<=this.datas.length; c++){
            var choiceEl = this.choicesEls[c-1],
            data = this.datas[c-1];

            this.choices.push(new ListChoice({
                element:choiceEl,
                answer:data.answer,
                num:c,
                listNum:this.num,
                cbInit:this.cbInitListChoice,
                select:this.select.bind(this)
            }));
            $(this.choices[c-1].element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,this.select.bind(this,this.choices[c-1]));
            widthM = Math.max(widthM,choiceEl.offsetWidth);
            if(heightM==0){
                heightM = choiceEl.offsetHeight;
            } else {
                heightM = Math.min(heightM,choiceEl.offsetHeight);
            }  
        }
        this.displayEl.querySelector("p").innerHTML = "dummy";
        this.displayEl.querySelector("p").style.opacity = 0;
    },
    reset:function(){
        this.state = "close";
        this.correct = false;
        this.answer = false;
        this.full = false;
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.element.classList.remove("open");
        this.element.classList.remove("corrected");
        this.choicesEl.style.scale = "1 0";
        this.choicesEl.style["transition-property"] = "scale";
        this.choicesEl.style["transition-duration"] = "0.8s";
        this.choicesEl.style["transition-timing-function"] = "cubic-bezier(0.16, 1, 0.3, 1)";
        this.displayEl.querySelector("p").innerHTML = "dummy";
        this.displayEl.querySelector("p").style.opacity = 0;
        this.activate();
        this.addEvents();
    },
    open:function(){
        this.desactivate();
        this.state = "open";
        this.element.classList.add("open");

        this.choicesEl.style.scale = "1 1";
        this.choicesEl.style["transition-delay"] = "0s";
        var inc = 0.2;

        for(var c=1; c<=this.choices.length; c++){
            var choice = this.choices[c-1];
            choice.show(inc);
            inc+=inc;
        }

        //onOpen(this);
    },
    close:function(force){
        if(!force){
            this.desactivate(); 
        }
        this.state = "close";
        this.element.classList.remove("open");

        this.choicesEl.style.scale = "1 0";
        this.choicesEl.style["transition-delay"] = "0.2s";

        var inc = 0;

        for(var c=this.choices.length; c>=1; c--){
            var choice = this.choices[c-1];
            choice.hide(inc);
            inc+=0.2;
        }
 
        //onClose(this);
    },
    toggle:function(){
        if(this.state=="open"){
            this.close();
        } else {
            this.open();
        }
    },
    select:function(listChoice){
        this.full = true;
        this.answer = listChoice.answer;
        this.close();

        this.displayEl.querySelector("p").innerHTML = listChoice.element.innerHTML;
        this.displayEl.querySelector("p").style.opacity = "";
        this.cbSelect(listChoice);
    },
    isRight:function(){
        this.desactivate();
        this.correct = true;
        this.element.classList.add("right");
    },
    isWrong:function(){
        this.desactivate();
        this.correct = false;
        this.element.classList.add("wrong");
    },
    isCorrected:function(){
        this.desactivate();
        this.correct = true;
        this.element.classList.add("corrected");
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.displayEl.querySelector("p").innerHTML = this.getAnswer();
    },
    getAnswer:function(){
        for(var c=1; c<=this.choices.length; c++){
            var choice = this.choices[c-1];
            if(choice.answer===true){
                return choice.element.innerHTML;
            }
        }
    },
    activate:function(){
        this.element.style["pointer-events"] = "";
        return this;
    },
    desactivate:function(){
        this.element.style["pointer-events"] = "none";
        return this;
    },
    onTransitionEnd: function(e){
        if(e.target.classList.contains("list-choices")){
            this.activate();
            this.isReadyForValidation();
        }
    },
    addEvents:function(){
        $(this.displayEl).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,this.handleToggle);
        this.choicesEl.addEventListener("transitionend",this.handleTransitionEnd);
        this.choicesEl.addEventListener("webkitTransitionEnd",this.handleTransitionEnd);
        for(var c=1; c<=this.choices.length; c++){
            var choice = this.choices[c-1];
            $(choice.element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,this.select.bind(this,this.choices[c-1]));
        }
    },
    dispose:function(){
        $(this.displayEl).off(Constants.CLICK_TOUCH);
        this.choicesEl.removeEventListener("transitionend",this.handleTransitionEnd);
        this.choicesEl.removeEventListener("webkitTransitionEnd",this.handleTransitionEnd);
        for(var c=1; c<=this.choices.length; c++){
            var choice = this.choices[c-1];
            $(choice.element).off(Constants.CLICK_TOUCH);
        }
    }
}

function ListChoice(props){
    this.element = props.element;
    this.answer = props.answer;
    this.num = props.num;
    this.listNum = props.listNum;
    this.cbInit = props.cbInit;
    this.isSelected = false;

    this.init();
}

ListChoice.prototype = {
    init:function(){
        this.element.style.opacity = 0;
        this.element.style.translate = "-10% 0";
        this.element.style["transition-property"] = "opacity, translate";
        this.element.style["transition-duration"] = "0.4s";
        this.cbInit();
    },
    show:function(inc){
        this.element.style["transition-delay"] = inc+"s";
        this.element.style.opacity = 1;
        this.element.style.translate = "0% 0";
    },
    hide:function(inc){
        this.element.style["transition-delay"] = inc+"s";
        this.element.style.opacity = 0;
        this.element.style.translate = "-10% 0";
    }
}