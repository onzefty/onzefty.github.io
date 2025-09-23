// -> Moteur gestionnaire de clique
// utilise jQuery pour les événements
function Clickables(props) {
    var defaultOptions = {
        datas: [],
        buttons: null,
        btValidate: null,
        btNext: null,
        wrongAttemptEl: null,
        btValidateInactiveClass: "inactive",
        attempts: 1,
        cbEnd: function () { },
        cbCorrection: function () { },
        cbClicked: function () { },
        cbReset: function () { },
        delayAfterAttempt: null,
        correctionAuto: false,
        noCorrection: false,
        alreadySelected: null,
        keepSelected: true
    }
    this.options = Object.assign(defaultOptions, props);
    this.multi = 0;
    this.currentAttempt = 1;
    this.setAttempt;
    this.disposed = false;
    this.success = false;
    this.handleClick = this.onClick.bind(this);
    this.handleValidate = this.validate.bind(this);
    this.handleCorrection = this.correction.bind(this);
    this.buttons = [];

    this.init();
}

Clickables.prototype = {
    unCheckAll: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            button.reset();
            button.activate();
        }
    },
    unSelectAll: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            if(button.isSelected==false){
                button.addClass("unselected");
            }
        }
    },
    desactivate: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            button.desactivate();
        }
    },
    activate: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            button.activate();
        }
    },
    checkIfOneClicked: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            if (button.isSelected==true) {
                return true;
            }
        }
        return false;
    },
    onClick: function (button, e) {
        if (button.isSelected==true) {
            this.options.cbClicked(this, "unselect");
            if (this.multi == 1) {
                this.unCheckAll();
            }
            button.unselect();
        } else {
            if (this.multi == 1) {
                this.unCheckAll();
            }
            button.select();
            if (this.multi == 1) {
                this.unSelectAll();
            }
            this.options.cbClicked(button, "select");
        }

        if (this.options.btValidate != null) {
            if (this.checkIfOneClicked()) {
                this.options.btValidate.classList.remove(this.options.btValidateInactiveClass);
            } else {
                this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
            }
        } else {
            if (this.checkIfOneClicked()) {
                this.validate();
            }
        }
    },
    init: function () {
        for (var c = 1; c <= this.options.buttons.length; c++) {
            var button = this.options.buttons[c - 1];
            this.buttons.push(new Clickable({
                element:button,
                answer:this.options.datas[c - 1].answer,
                num:c
            }));
            this.buttons[c-1].reset();
            if (this.options.alreadySelected == c) {
                this.buttons[c-1].select();
            } else {
                this.buttons[c-1].unselect();
            }
            this.buttons[c-1].activate();
            $(this.buttons[c-1].element).off().on(Constants.CLICK_TOUCH, this.onClick.bind(this, this.buttons[c - 1]));
            this.multi = this.options.datas[c - 1].answer == true ? this.multi + 1 : this.multi;
        }

        if (this.options.btValidate != null) {
            this.options.btValidate.classList.remove("hidden");
            if (this.options.alreadySelected) {
                this.options.btValidate.classList.remove(this.options.btValidateInactiveClass);
            } else {
                this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
            }
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }

        if (this.options.btNext != null) {
            this.options.btNext.classList.add("hidden");
        }

        if (this.options.wrongAttemptEl != null) {
            this.options.wrongAttemptEl.style.opacity = 0;
        }
    },
    addEvents: function () {
        for (var c = 1; c <= this.buttons.length; c++) {
            var button = this.buttons[c - 1];
            $(button.element).off().on(Constants.CLICK_TOUCH, this.onClick.bind(this, this.buttons[c - 1]));
        }

        if (this.options.btValidate != null) {
            $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleValidate);
        }
    },
    dispose: function () {
        for (var c = 1; c <= this.buttons.length; c++) {
            var button = this.buttons[c - 1];
            button.desactivate();
            button.removeClass("unselected");
            if(this.options.keepSelected==false){
                button.removeClass("selected");
            }
            $(button.element).off(Constants.CLICK_TOUCH);
        }
        if (this.options.btValidate != null) {
            $(this.options.btValidate).off(Constants.CLICK_TOUCH);
            this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
        }
        this.disposed = true;
    },
    reset: function (desactivation) {
        this.currentAttempt = 1;
        this.success = false;
        this.unCheckAll();
        if (this.options.wrongAttemptEl != null) {
            this.options.wrongAttemptEl.style.opacity = 0;
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.remove("hidden");
        }
        if (this.options.btNext != null) {
            this.options.btNext.classList.add("hidden");
        }
        if (this.disposed == true) {
            this.disposed = false;
            this.addEvents();
        }
        if (desactivation) {
            this.desactivate();
        }
        this.options.cbReset();
    },
    validate: function () {
        var corrects = 0,
            selected = 0;
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            if (button.isSelected==true && button.answer == true) {
                if(this.options.keepSelected==false){
                    button.removeClass("selected");
                }
                if (this.options.noCorrection == false) {
                    button.isRight();
                }
                corrects++;
                selected++;
            } else if (button.isSelected==true && button.answer == false) {
                if(this.options.keepSelected==false){
                    button.removeClass("selected");
                }
                if (this.options.noCorrection == false) {
                    button.isWrong();
                }
                selected++;
            } else if (button.isSelected==false && button.answer == true) {
                if(this.options.keepSelected==false){
                    button.removeClass("selected");
                }
                button.addClass("unselected");
            }
        }

        var isPassed = corrects == this.multi && corrects == selected;
        if (isPassed == true) {
            this.success = true;
            this.end(1);
        } else {
            var ind = corrects == 0 ? 0 : corrects == this.multi ? 0.5 : (corrects - (Math.abs(selected - corrects))) / this.multi;
            if (this.currentAttempt < this.options.attempts) {
                this.currentAttempt++;
                if (this.options.wrongAttemptEl != null) {
                    this.options.wrongAttemptEl.style.opacity = 1;
                }
                if (this.options.delayAfterAttempt != null) {
                    this.desactivate();
                    if (this.options.btValidate != null) {
                        this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
                    }
                    this.setAttempt = setTimeout(function () {
                        this.unCheckAll();
                        if (this.options.wrongAttemptEl != null) {
                            this.options.wrongAttemptEl.style.opacity = 0;
                        }
                        if (this.options.btValidate != null) {
                            this.options.btValidate.classList.remove(this.options.btValidateInactiveClass);
                        }
                    }.bind(this), this.options.delayAfterAttempt);
                } else {
                    this.unCheckAll();
                }
            } else {
                if (this.options.noCorrection) {
                    this.end(ind);
                }
                else if (this.options.correctionAuto || this.options.delayAfterAttempt != null || this.options.btValidate == null) {
                    this.correction(ind);
                } else {
                    this.options.cbCorrection();
                    $(this.options.btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleCorrection);
                }
            }
        }
    },
    correction: function (correct) {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1];
            if (button.isSelected==false && !button.correct && button.answer == true) {
                button.removeClass("unselected");
                button.isCorrected();
            }
        }
        this.end(correct);

    },
    end: function (correct) {
        this.dispose();
        if (this.options.btNext != null) {
            this.options.btNext.classList.remove("hidden");
            this.options.btValidate.classList.add("hidden");
            $(this.options.btNext).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, function () {
                this.options.cbEnd(correct);
            }.bind(this));
        } else {
            this.options.cbEnd(correct);
        }
    }
}

function Clickable(props) {
    this.element = props.element;
    this.num = props.num;
    this.answer = props.answer;
    this.isSelected = false;
    this.correct = null;
}

Clickable.prototype = {
    select:function(){
        this.isSelected = true;
        this.addClass("selected");
    },
    unselect:function(){
        this.isSelected = false;
        this.removeClass("selected");
    },
    reset:function(){
        this.correct = null;
        this.isSelected = false;
        this.element.classList.remove("unselected");
        this.element.classList.remove("selected");
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.element.classList.remove("corrected");  
    },
    activate:function(){
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