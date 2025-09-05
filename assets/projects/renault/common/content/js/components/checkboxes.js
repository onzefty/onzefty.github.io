import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS } from "../utils/utils.js";
import Clickables from "./clickables.js";

export default class Checkboxes extends EmitterMixin {
    static get END(){
        return 'Checkboxes.end';
    }
    static get CORRECTION(){
        return 'Checkboxes.correction';
    }
    static get SELECTED(){
        return 'Checkboxes.selected';
    }
    static get UNSELECTED(){
        return 'Checkboxes.unselected';
    }
    static get RESET(){
        return 'Checkboxes.reset';
    }
    static get VALIDATE(){
        return 'Checkboxes.validate';
    }
    constructor(props = {}){
        super();
        this.options = {
            datas: [],
            btValidate: null,
            btValidateInactiveClass: "inactive",
            checkboxParentClass: "checkbox-wrap",
            checkboxClass: "checkbox",
            attempts: 1,
            //Correction automatique
            correctionAuto: true,
            //Pas de correction
            noCorrection: false,
            keepSelected: true,
            ...props
        };

        this.currentAttempt = 1;
        this.disposed = false;
        this.success = false;
        this.handleValidate = this.validate.bind(this);
        this.handleCorrection = this.correction.bind(this);
        this.checkboxes = new Map();
        this.init();
        this.addEvents();
    }

    get corrects(){
        const {datas} = this.options;
        const array = Array.from(this.checkboxes.values());
        let count = 0;
        array.forEach((checkbox,index) => {
            if(checkbox.success === true && datas[index].points){
                count+=datas[index].points;
            }
        });
        return count;
    }

    get checked(){
        const array = [];
        for (const [key,checkbox] of this.checkboxes) {
            array.push(checkbox.selected);
        }
        return array;
    }

    unCheckAll(reset) {
        for (const [key,checkbox] of this.checkboxes) {
            checkbox.unCheckAll(reset);
        }
    }
    unSelectAll() {
        for (const [key,checkbox] of this.checkboxes) {
            checkbox.unSelectAll();
        }
    }
    desactivate() {
        for (const [key,checkbox] of this.checkboxes) {
            checkbox.desactivate();
        }
    }
    activate() {
        for (const [key,checkbox] of this.checkboxes) {
            checkbox.activate();
        }
    }
    oneChecked() {
        for (const [key,checkbox] of this.checkboxes) {
            if(checkbox.checkOneClicked()){
                return true;
            }
        }
        return false;
    }
    allChecked() {
        for (const [key,checkbox] of this.checkboxes) {
            if(checkbox.checkAllClicked()){
                return true;
            }
        }
        return false;
    }
    init() {
        const {datas, alreadySelected, checkboxParentClass, checkboxClass, noCorrection, btValidate, btValidateInactiveClass} = this.options;
        const selector = !checkboxParentClass.startsWith('#') || checkboxParentClass.startsWith('.') ? `.${checkboxParentClass}` : checkboxParentClass;
        const checkBoxWrapEls = document.querySelectorAll(selector);
        if(!checkBoxWrapEls){
            return console.warn("No checkboxes found with class : ",checkboxParentClass);
        }
        datas.forEach((data,index) => {
            const {answers} = data;
            const checkboxEls = checkBoxWrapEls[index].querySelectorAll(`.${checkboxClass}`);
            const obj = {};
            const array = [];
            answers.forEach((answer) => {
                array.push({answer});
            });
            obj.datas = array;
            obj.buttons = checkboxEls;
            obj.noCorrection = noCorrection;
            const clickables = new Clickables(obj);
            clickables.noValidation = true;
            this.checkboxes.set(checkBoxWrapEls[index],clickables);
        });

        if (btValidate != null) {
            btValidate.classList.remove("hidden");
            if (alreadySelected) {
                btValidate.classList.remove(btValidateInactiveClass);
            } else {
                btValidate.classList.add(btValidateInactiveClass);
            }
        }
    }
    addEvents() {
        for (const [key,checkbox] of this.checkboxes) {
            checkbox.on(checkbox.events.SELECTED, () => {
                if(this.oneChecked() === true){
                    if (this.options.btValidate != null) {
                        this.options.btValidate.classList.remove(this.options.btValidateInactiveClass);
                    }
                }
            });
            checkbox.on(checkbox.events.UNSELECTED, () => {
                if(this.oneChecked() === false){
                    if (this.options.btValidate != null) {
                        this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
                    }
                }
            });
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
        }
    }
    dispose() {
        this.off();
        for(const [key,checkbox] of this.checkboxes){
            checkbox.dispose();
        }
        if (this.options.btValidate != null) {
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleValidate);
            this.options.btValidate.removeEventListener(EVENTS.CLICK_TOUCH, this.handleCorrection);
            this.options.btValidate.classList.add(this.options.btValidateInactiveClass);
        }
        this.disposed = true;
    }
    reset(desactivation) {
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
        this.emit(Checkboxes.RESET);
    }
    validate() {
        this.desactivate();
        let corrects = 0;
        const {noCorrection, btValidate, correctionAuto, attempts} = this.options;
        for(const [key,checkbox] of this.checkboxes){
            checkbox.validate();
            if(checkbox.success === true){
                corrects++;
            }
        }
        const isPassed = corrects === this.checkboxes.size;
        if (isPassed == true) {
            this.success = true;
            this.end(1);
        } else {
            if (this.currentAttempt < attempts) {
                this.currentAttempt++;
                this.unCheckAll();
            } else {
                if (noCorrection) {
                    this.end(0);
                }
                else if (correctionAuto || btValidate == null) {
                    this.emit(Checkboxes.CORRECTION);
                    this.correction(0);    
                } else {
                    this.emit(Checkboxes.CORRECTION);
                    btValidate.addEventListener(EVENTS.CLICK_TOUCH, this.handleCorrection);
                }
            }    
        }
        this.emit(Checkboxes.VALIDATE);
    }
    correction(correct) {
        for(const [key,checkbox] of this.checkboxes){
            checkbox.correction();
        }
        this.end(correct);
    }
    end(correct) {
        this.emit(Checkboxes.END,correct);
        this.dispose();
    }
}