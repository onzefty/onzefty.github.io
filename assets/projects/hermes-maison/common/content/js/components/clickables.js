import EmitterMixin from "../lib/emitter-mixin.js";
import { EVENTS } from "../lib/utils.js";

const CLASSES = {
    "unselected": "unselected",
    "selected": "selected"
}

export default class Clickables extends EmitterMixin {
    static get END(){
        return 'Clickables.end';
    }
    static get CORRECTION(){
        return 'Clickables.correction';
    }
    static get SELECTED(){
        return 'Clickables.selected';
    }
    static get UNSELECTED(){
        return 'Clickables.unselected';
    }
    static get RESET(){
        return 'Clickables.reset';
    }
    static get VALIDATE(){
        return 'Clickables.validate';
    }
    constructor(props = {}){
        super();
        this.options = {
            datas: [],
            buttons: null,
            btValidate: null,
            btNext: null,
            wrongAttemptEl: null,
            btValidateInactiveClass: "inactive",
            attempts: 1,
            delayAfterAttempt: null,
            correctionAuto: false,
            noCorrection: false,
            alreadySelected: null,
            keepSelected: true,
            once: false,
            steps: false,
            unselectedClass: CLASSES.unselected,
            selectedClass: CLASSES.selected,
            ...props
        };

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
        this.addEvents();
    }

    unCheckAll(reset) {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            button.activate();
            if(reset){
                button.reset();
            } else {
                button.unCheck();
            }
        }
    }
    unSelectAll() {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            if (button.isSelected === false) {
                button.addClass(this.options.unselectedClass);
            }
        }
    }
    desactivate() {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            button.desactivate();
        }
    }
    activate() {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            button.activate();
        }
    }
    checkOneClicked() {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            if (button.isSelected === true) {
                return true;
            }
        }
        return false;
    }
    checkAllClicked() {
        return this.buttons.filter((button) => button.count > 0).length === this.buttons.length;
    }
    onClick(button, e) {
        if(this.options.once === true && button.count > 0){
            return;
        }
        if (button.isSelected === true) {
            this.emit(Clickables.UNSELECTED,button);
            if (this.multi === 1) {
                this.unCheckAll();
            }
            button.unselect();
        } else {
            if (this.multi === 1) {
                this.unCheckAll();
            }
            button.select();
            if (this.multi === 1) {
                this.unSelectAll();
            }
            this.emit(Clickables.SELECTED,button);
        }

        if(this.noValidation){
            if(this.checkAllClicked() === true){
                this.success = true;
                this.emit(Clickables.END,true);
            }
            return;
        }

        if (this.options.btValidate != null) {
            if (this.checkOneClicked()) {
                this.options.btValidate.classList.remove(this.options.btValidateInactiveClass);
            } else {
                this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
            }
        } else {
            if (this.checkOneClicked()) {
                this.validate();
            }
        }
    }
    init() {
        const {unselectedClass, selectedClass, datas, buttons, alreadySelected, btValidate, btNext, wrongAttemptEl, btValidateInactiveClass} = this.options;
        for (let c = 1; c <= buttons.length; c++) {
            const button = buttons[c - 1];
            this.buttons.push(new Clickable({
                element: button,
                answer: datas[c - 1] ? datas[c-1].answer : null,
                num: c,
                unselectedClass,
                selectedClass,
            }));
            this.buttons[c - 1].reset();
            if (alreadySelected === c) {
                this.buttons[c - 1].select();
            } else {
                this.buttons[c - 1].unselect();
            }
            this.buttons[c - 1].handleClick = this.onClick.bind(this, this.buttons[c - 1]);
            this.buttons[c - 1].activate();
            
            if(datas[c-1]){
                this.multi = datas[c - 1].answer === true ? this.multi + 1 : this.multi;
            }
        }

        if(datas.length === 0){
            this.noValidation = true;
            this.multi = 1;
        }

        if (btValidate != null) {
            btValidate.classList.remove("hidden");
            if (alreadySelected) {
                btValidate.classList.remove(btValidateInactiveClass);
            } else {
                btValidate.classList.add(btValidateInactiveClass);
            }
        }

        if (btNext != null) {
            btNext.classList.add("hidden");
        }

        if (wrongAttemptEl != null) {
            wrongAttemptEl.style.opacity = 0;
        }
    }
    addEvents() {
        for (let c = 1; c <= this.buttons.length; c++) {
            const button = this.buttons[c - 1];
            button.element.addEventListener(EVENTS.CLICK_TOUCH,button.handleClick);
        }

        if (this.options.btValidate != null) {
            this.options.btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
        }
    }
    dispose() {
        clearTimeout(this.setAttempt);
        for (let c = 1; c <= this.buttons.length; c++) {
            const button = this.buttons[c - 1];
            button.desactivate();
            button.removeClass(this.options.unselectedClass);
            if (this.options.keepSelected === false) {
                button.removeClass(this.options.selectedClass);
            }
            button.element.removeEventListener(EVENTS.CLICK_TOUCH,button.handleClick);
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleCorrection);
            this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
        }
        this.disposed = true;
    }
    reset(desactivation) {
        clearTimeout(this.setAttempt);
        this.currentAttempt = 1;
        this.success = false;
        this.unCheckAll(true);
        if (this.options.wrongAttemptEl != null) {
            this.options.wrongAttemptEl.style.opacity = 0;
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.classList.remove("hidden");
            this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
        }
        if (this.options.btNext != null) {
            this.options.btNext.classList.add("hidden");
        }
        if (this.disposed === true) {
            this.disposed = false;
            this.addEvents();
        }
        if (desactivation) {
            this.desactivate();
        }
        this.emit(Clickables.RESET);
    }
    validate() {
        if(this.noValidation){
            return;
        }
        this.desactivate();
        let corrects = 0;
        let selected = 0;
        const {steps, noCorrection, correctionAuto, keepSelected, selectedClass, unselectedClass, btValidateInactiveClass, delayAfterAttempt, btValidate, wrongAttemptEl, attempts} = this.options;
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            if (button.isSelected === true && button.answer === true) {
                if (keepSelected === false) {
                    button.removeClass(selectedClass);
                }
                if (noCorrection === false) {
                    button.isRight();
                }
                corrects++;
                selected++;
            } else if (button.isSelected === true && button.answer === false) {
                if (keepSelected === false) {
                    button.removeClass(selectedClass);
                }
                if (noCorrection === false) {
                    button.isWrong();
                }
                selected++;
            } else if (button.isSelected === false && button.answer === true) {
                if (keepSelected === false) {
                    button.removeClass(selectedClass);
                }
                button.addClass(unselectedClass);
            }
        }

        const isPassed = corrects === this.multi && corrects === selected;
        if (isPassed == true) {
            this.success = true;
            if (delayAfterAttempt != null) {
                this.setAttempt = setTimeout(() => {
                    this.end(1);
                }, delayAfterAttempt);
            } else {
                this.end(1);
            }
        } else {
            const ind = corrects == 0 ? 0 : corrects == this.multi ? 0.5 : (corrects - (Math.abs(selected - corrects))) / this.multi;
            if(steps === true){
                if (delayAfterAttempt != null) {
                    this.setAttempt = setTimeout(() => {
                        this.unCheckAll();
                    }, delayAfterAttempt);
                } else {
                    this.unCheckAll();
                }
            } else {
                if (this.currentAttempt < attempts) {
                    this.currentAttempt++;
                    if (wrongAttemptEl != null) {
                        wrongAttemptEl.style.opacity = 1;
                    }
                    if (delayAfterAttempt != null) {
                        if (btValidate != null) {
                            btValidate.classList.add(btValidateInactiveClass);
                        }
                        this.setAttempt = setTimeout(() => {
                            this.unCheckAll();
                            if (wrongAttemptEl != null) {
                                wrongAttemptEl.style.opacity = 0;
                            }
                        }, delayAfterAttempt);
                    } else {
                        this.unCheckAll();
                    }
                } else {
                    if (noCorrection) {
                        this.end(ind);
                    }
                    else if (correctionAuto || delayAfterAttempt != null || btValidate == null) {
                        this.emit(Clickables.CORRECTION);
                        this.correction(ind);    
                    } else {
                        this.emit(Clickables.CORRECTION);
                        btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleCorrection);
                    }
                }    
            }
        }
        this.emit(Clickables.VALIDATE);
    }
    correction(correct) {
        for (let b = 1; b <= this.buttons.length; b++) {
            const button = this.buttons[b - 1];
            if (button.isSelected === false && !button.correct && button.answer === true) {
                button.removeClass(this.options.unselectedClass);
                button.isCorrected();
            }
        }
        if (this.options.delayAfterAttempt != null) {
            this.setAttempt = setTimeout(() => {
                this.end(correct);
            }, this.options.delayAfterAttempt);
        } else {
            this.end(correct);
        }
        

    }
    end(correct) {
        this.dispose();
        if(this.setAttempt){
            clearTimeout(this.setAttempt);
            this.setAttempt = null;
        }
        if (this.options.btNext != null) {
            this.options.btNext.classList.remove("hidden");
            this.options.btValidate.classList.add("hidden");
            this.options.btNext.addEventListener(EVENTS.CLICK_TOUCH, () => {
                //this.options.btNext.off(EVENTS.CLICK_TOUCH);
                this.emit(Clickables.END,correct);
            });
        } else {
            this.emit(Clickables.END,correct);
        }
    }
}

class Clickable {
    constructor(props = {}){
        this.element = props.element;
        this.num = props.num;
        this.answer = props.answer;
        this.selectedClass = props.selectedClass;
        this.unselectedClass = props.unselectedClass;
        this.isSelected = false;
        this.count = 0;
        this.correct = null;
    }

    select() {
        this.count++;
        this.isSelected = true;
        this.addClass(this.selectedClass);
    }
    unselect() {
        this.isSelected = false;
        this.removeClass(this.selectedClass);
    }
    unCheck() {
        this.correct = null;
        this.isSelected = false;
        this.element.classList.remove(this.unselectedClass);
        this.element.classList.remove(this.selectedClass);
        this.element.classList.remove("right");
        this.element.classList.remove("wrong");
        this.element.classList.remove("corrected");
    }
    reset() {
        this.count = 0;
        this.unCheck();
    }
    activate() {
        this.element.style["pointer-events"] = "";
    }
    desactivate() {
        this.element.style["pointer-events"] = "none";
    }
    isRight() {
        this.correct = true;
        this.addClass("right");
    }
    isWrong() {
        this.correct = false;
        this.addClass("wrong");
    }
    isCorrected() {
        this.correct = true;
        this.addClass("corrected");
    }
    addClass(cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        const array = !Array.isArray(cl) ? [cl] : cl;
        for (let t = 1; t <= array.length; t++) {
            this.element.classList.add(array[t - 1]);
        }
    }
    removeClass(cl) {
        if (typeof cl != "string" && !Array.isArray(cl)) {
            return;
        }
        const array = !Array.isArray(cl) ? [cl] : cl;
        for (let t = 1; t <= array.length; t++) {
            this.element.classList.remove(array[t - 1]);
        }
    }
}