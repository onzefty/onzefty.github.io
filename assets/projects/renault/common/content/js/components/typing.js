import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS } from "../utils/utils.js";

const DEFAULTOPTIONS = {
    className: "typing",
    answers: false,
    placeHolder: "",
    caseSensitive: false,
    type: "text",
    maxLength: "auto",
    maxLines: "auto",
    allowOverflow: {
        x: false,
        y: false,
    },
    readOnly: false,
    class: "",
    color: "black",
    wrongColor: false,
    forbiddenChar: null,
    multiline: false,
    tabManagement: true
}

export default class Typing extends EmitterMixin {
    static get END(){
        return 'Typing.end';
    }
    static get CORRECTION(){
        return 'Typing.correction';
    }
    static get SELECTED(){
        return 'Typing.selected';
    }
    static get UNSELECTED(){
        return 'Typing.unselected';
    }
    static get RESET(){
        return 'Typing.reset';
    }
    static get VALIDATE(){
        return 'Typing.validate';
    }

    constructor(props = {}){
        super();
        this.options = {
            typings: [],
            btValidate: null,
            ...props
        };
        this.typings = new Map();
        this.success = false;
        this.handleValidate = this.validate.bind(this);

        this.init();
        this.addEvents();
    }

    get length(){
        let count = 0;
        for(const [key,typing] of this.typings){
            if(Array.isArray(typing.answers)){
                count++;
            }
        }
        return count;
    }

    init(){
        const {typings} = this.options;
        typings.forEach((typing,index)=>{
            this.typings.set(index+1,new BasicTyping(typing.container,{
                ...DEFAULTOPTIONS,
                ...typing
            }));
        });
    }

    validate(){
        let count = 0;
        const array = [];
        let successFlag = true;
        for(const [key,typing] of this.typings){
            const validationDatas = typing.validate(typing.value);
            if(!validationDatas){
                if(typing.value.length != 0){
                    successFlag = false;
                }
            } else {
                const {valid, correct} = validationDatas;
                if(!valid || !correct){
                    successFlag = false;
                } else {
                    count++;
                }
                array.push({
                    value:typing.value,
                    answers:typing.answers[0],
                });
            } 
        }
        this.success = successFlag;
        this.corrects = count;
        return array;
    }

    addEvents(){
        const {btValidate} = this.options;
        if(btValidate){
            btValidate.addEventListener(EVENTS.CLICK,this.handleValidate);
        }
    }

    removeEvents(){
        const {btValidate} = this.options;
        if(btValidate){
            btValidate.removeEventListener(EVENTS.CLICK,this.handleValidate);
        }
    }
}

class BasicTyping extends EmitterMixin {
    static #elements = [];
    static #indexing = {};

    static #getNextIndex = () => {
        let index = 1;

        while (this.#indexing[index]) {
            index++;
        }

        this.#indexing[index] = true;

        return index;
    };

    static #removeIndex = (index) => {
        delete this.#indexing[index];
    };

    static #addElement = (element) => {
        this.#elements.push(element);
    };

    static #removeElement = (element) => {
        const index = this.#elements.indexOf(element);

        if (index > -1) {
            this.#elements.splice(index, 1);
        }
    };

    static get CHANGE() {
        return "BasicTyping.change";
    }

    static get FOCUS() {
        return "BasicTyping.focus";
    }

    static get BLUR() {
        return "BasicTyping.blur";
    }

    static get ENTER() {
        return "BasicTyping.enter";
    }

    constructor(container, options) {
        super();

        this.container = container;
        this.options = {
            ...options
        };

        if (!this.options.multiline && !this.options.allowOverflow.y) {
            if (!options.allowOverflow || (options.allowOverflow && !options.allowOverflow.hasOwnProperty("y"))) {
                this.options.allowOverflow.y = true;
            }
        }

        this.element = null;
        this.measureElement = null;
        this.answers = this.options.answers;
        this.index = BasicTyping.#getNextIndex();

        this.savedValue = {
            value: "",
            start: 0,
            end: 0,
        };

        if (!Array.isArray(this.answers) && typeof this.answers === "string") {
            this.answers = [this.answers];
        }

        this.boundHandleInput = this.handleInput.bind(this);
        this.boundHandleFocus = this.handleFocus.bind(this);
        this.boundHandleBlur = this.handleBlur.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandlePaste = this.handlePaste.bind(this);
        this.boundHandleSelChange = this.handleSelChange.bind(this);

        this.build();
        this.addListeners();
    }

    get enabled() {
        return !this.element.getAttribute("disabled");
    }

    set enabled(boolean) {
        if (typeof boolean === "boolean") {
            if (!boolean) {
                this.element.classList.add("disabled");
                this.element.setAttribute("disabled", !boolean);
            } else {
                this.element.classList.remove("disabled");
                this.element.removeAttribute("disabled");
            }
        }
    }

    get value() {
        return this.element.value;
    }

    set value(value) {
        if (typeof value === "string" || typeof value === "number") {
            this.element.value = value;
        }
    }

    addListeners() {
        this.element.addEventListener(EVENTS.INPUT, this.boundHandleInput);
        this.element.addEventListener(EVENTS.FOCUS, this.boundHandleFocus);
        this.element.addEventListener(EVENTS.BLUR, this.boundHandleBlur);
        this.element.addEventListener(EVENTS.KEYDOWN, this.boundHandleKeyDown);
        this.element.addEventListener(EVENTS.KEYUP, this.boundHandleKeyUp);
        this.element.addEventListener(EVENTS.DRAG_OVER, this.handleDrag);
        this.element.addEventListener(EVENTS.DROP, this.handleDrag);

        document.addEventListener(EVENTS.SELECTION_CHANGE, this.boundHandleSelChange);
        document.addEventListener(EVENTS.PASTE, this.boundHandlePaste);
    }

    removeListeners() {
        this.element.removeEventListener(EVENTS.TEXT_INPUT, this.boundHandleInput);
        this.element.removeEventListener(EVENTS.FOCUS, this.boundHandleFocus);
        this.element.removeEventListener(EVENTS.BLUR, this.boundHandleBlur);
        this.element.removeEventListener(EVENTS.KEYDOWN, this.boundHandleKeyDown);
        this.element.removeEventListener(EVENTS.KEYUP, this.boundHandleKeyUp);
        this.element.removeEventListener(EVENTS.DRAG_OVER, this.handleDrag);
        this.element.removeEventListener(EVENTS.DROP, this.handleDrag);

        document.removeEventListener(EVENTS.SELECTION_CHANGE, this.boundHandleSelChange);
        document.removeEventListener(EVENTS.PASTE, this.boundHandlePaste);
    }

    reveal() {
        if (this.options.type === "password") {
            this.element.type = "text";
        }
    }

    unreveal() {
        if (this.options.type === "password") {
            this.element.type = "password";
        }
    }

    build() {
        let element = document.createElement("input");

        if (this.options.multiline) {
            element = document.createElement("div");
            element.setAttribute("contenteditable", true);
            element.classList.add("multiline");
        }

        if (this.options.allowOverflow.x) {
            element.classList.add("overflow-x");
        }

        if (this.options.allowOverflow.y) {
            element.classList.add("overflow-y");
        }

        if (this.options.maxLength > 0) {
            element.setAttribute("maxlength", this.options.maxLength);
        }

        if (this.options.readOnly) {
            element.setAttribute("readonly", this.options.readOnly);
        }

        const classList = this.options.class.split(" ");

        element.classList.add(this.options.className);

        classList.forEach((className) => {
            if (className.length > 0) {
                element.classList.add(className);
            }
        });

        element.setAttribute("tabIndex", this.index);
        element.setAttribute("placeholder", this.options.placeHolder);
        element.setAttribute("type", this.options.type);
        element.setAttribute("spellcheck", "false");
        element.setAttribute("autocomplete", "off");
        element.setAttribute("autocorrect", "off");
        element.setAttribute("autocapitalize", "off");

        this.container.appendChild(element);

        this.element = element;

        this.createMeasureClone(element);

        BasicTyping.#addElement(this.element);
    }

    createMeasureClone() {
        var clone = document.createElement("span");

        clone.classList.add(`${this.options.className}-measure`);

        var sourceStyles = window.getComputedStyle(this.element);

        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.height = "auto";
        clone.style.visibility = "hidden";

        clone.style.fontFamily = sourceStyles.fontFamily;
        clone.style.fontStyle = sourceStyles.fontStyle;
        clone.style.fontWeight = sourceStyles.fontWeight;
        clone.style.fontSize = sourceStyles.fontSize;
        clone.style.fontStretch = sourceStyles.fontStretch;
        clone.style.fontVariant = sourceStyles.fontVariant;
        clone.style.lineHeight = sourceStyles.lineHeight;
        clone.style.whiteSpace = this.options.allowOverflow.x ? "nowrap" : sourceStyles.whiteSpace;
        clone.style.overflowWrap = this.options.allowOverflow.x ? "normal" : sourceStyles.overflowWrap;

        document.body.appendChild(clone);

        this.measureElement = clone;
    }

    setMeasureText(text) {
        if (this.measureElement.nodeName === "INPUT") {
            this.measureElement.value = text;
        }

        this.measureElement.innerHTML = text;
    }

    isOverflowing() {
        const elementStyle = window.getComputedStyle(this.element);

        this.measureElement.style.width = elementStyle.width;

        this.setMeasureText("A");

        const lineHeight = this.measureElement.offsetHeight;

        this.setMeasureText(this.element.value || this.element.innerHTML);

        const elementSize = {
            width: this.measureElement.scrollWidth,
            height: this.measureElement.offsetHeight,
        };

        return {
            x: elementSize.width > this.element.offsetWidth,
            y: this.measureElement.offsetHeight > this.element.offsetHeight,
            lines: Math.ceil(elementSize.height / lineHeight),
        };
    }

    validate(value) {
        let valid = false;
        let correct = false;

        const normalizeValue = (givenValue = "") => {
            let normalizedValue = givenValue.replace(/[ \xa0]/g, " ");
            normalizedValue = this.options.caseSensitive ? normalizedValue : normalizedValue.toLowerCase();
            return normalizedValue;
        };

        if(Array.isArray(this.answers)){
            for (let i = 0; i < this.answers.length; i++) {
                const answer = normalizeValue(this.answers[i]);
                const compareValue = normalizeValue(value);

                if (!valid && answer.includes(compareValue)) {
                    valid = true;
                }

                if (!correct && answer === compareValue) {
                    correct = true;
                }
            }
            return {
                valid,
                correct,
            };
        } else {
            return false;
        }
    }

    enterPressed(event, value) {
        const isEnter = event.key === "Enter" || event.keyCode === 13;

        if (this.isForbiddenChar(event.key)) {
            event.preventDefault();
            return {
                isEnter,
            };
        }

        if (!isEnter) {
            event.stopPropagation();
            return {
                isEnter,
            };
        }

        const { valid, correct } = this.validate(value);

        return {
            valid,
            correct,
            isEnter,
        };
    }

    getSelectionData() {
        const isContentEditable = this.element.getAttribute("contenteditable") === "true";

        let selection,
            startPos,
            endPos,
            currentVal,
            currentHTMLValue,
            startNodeIndex,
            startNodeSubIndex,
            endNodeIndex,
            endNodeSubIndex,
            childCount;

        if (isContentEditable) {
            selection = window.getSelection();

            if (selection.rangeCount > 0) {
                const childNodes = Array.from(this.element.childNodes);
                const range = selection.getRangeAt(0);
                const startContainer = range.startContainer;
                const endContainer = range.endContainer;

                startPos = range.startOffset;
                endPos = range.endOffset;

                childNodes.forEach((node, index) => {
                    if (node === startContainer.parentElement || node === startContainer) {
                        startNodeIndex = index;

                        if (node.childNodes) {
                            startNodeSubIndex = Array.from(node.childNodes).indexOf(startContainer);
                        }
                    }

                    if (node === endContainer.parentElement || node === endContainer) {
                        endNodeIndex = index;

                        if (node.childNodes) {
                            endNodeSubIndex = Array.from(node.childNodes).indexOf(endContainer);
                        }
                    }
                });

                childCount = childNodes.length;
            }

            currentVal = this.element.innerText;
            currentHTMLValue = this.element.innerHTML;
        } else {
            startPos = this.element.selectionStart;
            endPos = this.element.selectionEnd;
            currentVal = this.element.value;
            currentHTMLValue = this.element.innerHTML;
        }

        return {
            selection,
            startPos,
            endPos,
            currentVal,
            currentHTMLValue,
            startNodeIndex,
            startNodeSubIndex,
            endNodeIndex,
            endNodeSubIndex,
            childCount,
        };
    }

    handleDrag(event) {
        event.preventDefault();
        return;
    }

    handlePaste(event) {
        if (!this.element.getAttribute("contenteditable")) return;

        event.preventDefault();

        const text = event.clipboardData.getData("text/plain");
        const selection = window.getSelection();

        if (!selection.rangeCount) return false;

        selection.deleteFromDocument();

        const range = selection.getRangeAt(0);
        const inputEvent = new Event("input", { bubbles: true, cancelable: true });

        if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const startNode = range.startContainer;
            const startPos = range.startOffset;

            startNode.data = startNode.data.slice(0, startPos) + text + startNode.data.slice(startPos);

            range.setStart(startNode, startPos + text.length);
            range.setEnd(startNode, startPos + text.length);
        } else {
            const startChild = range.startContainer.childNodes[range.startOffset - 1];

            if (startChild && startChild.nodeType === Node.TEXT_NODE) {
                const startPos = startChild.data.length;
                startChild.data = startChild.data.slice(0, startPos) + text;
                range.setStart(startChild, startPos + text.length);
                range.setEnd(startChild, startPos + text.length);
            } else {
                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
            }
        }

        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);

        inputEvent.inputType = "insertFromPaste";
        inputEvent.data = text;

        this.element.dispatchEvent(inputEvent);
    }

    handleSelChange() {
        const selectionData = this.getSelectionData();

        this.savedValue.value = selectionData.currentVal;
        this.savedValue.htmlValue = selectionData.currentHTMLValue;
        this.savedValue.start = selectionData.startPos;
        this.savedValue.end = selectionData.endPos;
        this.savedValue.startNodeIndex = selectionData.startNodeIndex;
        this.savedValue.startNodeSubIndex = selectionData.startNodeSubIndex;
        this.savedValue.endNodeIndex = selectionData.endNodeIndex;
        this.savedValue.endNodeSubIndex = selectionData.endNodeSubIndex;
    }

    handleInput(event) {
        const isContentEditable = this.element.getAttribute("contenteditable") === "true";
        const {
            selection,
            startPos,
            endPos,
            currentVal,
            currentHTMLValue,
            startNodeIndex,
            startNodeSubIndex,
            endNodeIndex,
            endNodeSubIndex,
        } = this.getSelectionData();

        const overflow = this.isOverflowing();
        const reachedMaxLines = this.options.maxLines !== "auto" ? overflow.lines > this.options.maxLines : false;
        const overflowX = overflow.x && !this.options.allowOverflow.x;
        const overflowY = (overflow.y && !this.options.allowOverflow.y) || reachedMaxLines;

        if ((overflowX || overflowY) && event.inputType.includes("insert")) {
            event.preventDefault();
            event.stopPropagation();

            const diffLength = currentVal.length - this.savedValue.value.length;

            if (isContentEditable) {
                this.element.innerHTML = this.savedValue.htmlValue;

                if (selection.rangeCount > 0) {
                    const range = document.createRange();

                    const startNodeId = this.savedValue.startNodeIndex;
                    const endNodeId = this.savedValue.endNodeIndex;
                    const startNodeSubId = this.savedValue.startNodeSubIndex;
                    const endNodeSubId = this.savedValue.endNodeSubIndex;
                    const startIndex = this.savedValue.start;
                    const endIndex = this.savedValue.end;

                    let startNode = this.element.childNodes[startNodeId];
                    let endNode = this.element.childNodes[endNodeId];

                    if (startNode && startNodeSubId > -1) {
                        startNode = startNode.childNodes[startNodeSubId];
                    } else if (!startNode) {
                        startNode = this.element;
                    }

                    if (endNode && endNodeSubId > -1) {
                        endNode = endNode.childNodes[endNodeSubId];
                    } else if (!endNode) {
                        endNode = this.element;
                    }

                    range.setStart(startNode, Math.max(0, startIndex));
                    range.setEnd(endNode, Math.max(0, endIndex));

                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } else {
                this.element.value = this.savedValue.value;
                this.element.setSelectionRange(startPos - diffLength, endPos - diffLength);
            }

            return false;
        }

        this.savedValue.value = currentVal;
        this.savedValue.htmlValue = currentHTMLValue;
        this.savedValue.start = startPos;
        this.savedValue.end = endPos;
        this.savedValue.startNodeIndex = startNodeIndex;
        this.savedValue.startNodeSubIndex = startNodeSubIndex;
        this.savedValue.endNodeIndex = endNodeIndex;
        this.savedValue.endNodeSubIndex = endNodeSubIndex;

        if(this.options.wrongColor){
            const { valid, correct } = this.validate(currentVal);
            const color = !valid && this.options.wrongColor ? this.options.wrongColor : this.options.color;
            this.element.style.color = color;
            this.emit(BasicTyping.CHANGE, {
                value: currentVal,
                valid,
                correct,
                originalEvent: event,
            });
        } else {
            this.emit(BasicTyping.CHANGE, {
                value: currentVal,
                originalEvent: event,
            });
        }
    }

    handleKeyDown(event) {
        const { valid, correct, isEnter } = this.enterPressed(event, this.value);

        if (event.keyCode == 9 && this.options.tabManagement) {
            event.preventDefault();

            const typingElements = BasicTyping.#elements
                .filter((element) => !element.getAttribute("disabled"))
                .map((element) => ({
                    element,
                    index: parseInt(element.getAttribute("tabIndex"), 10),
                }))
                .sort((a, b) => a.index - b.index);

            if (typingElements.length > 0) {
                const firstIndex = event.shiftKey ? typingElements.length - 1 : 0;
                const nextDirection = event.shiftKey ? -1 : 1;
                const nextIndex = typingElements.findIndex(({ index }) => index === this.index);
                const nextElement = typingElements[nextIndex + nextDirection];

                if (nextElement) {
                    nextElement.element.focus();
                } else {
                    typingElements[firstIndex].element.focus();
                }
            }
        }

        if (!isEnter) {
            return;
        }

        this.emit(BasicTyping.ENTER, {
            type: "down",
            value: this.value,
            valid,
            correct,
            originalEvent: event,
        });
    }

    handleKeyUp(event) {
        const { valid, correct, isEnter } = this.enterPressed(event, this.value);

        if (!isEnter) {
            return;
        }

        this.emit(BasicTyping.ENTER, {
            type: "up",
            value: this.value,
            valid,
            correct,
            originalEvent: event,
        });
    }

    isForbiddenChar(value) {
        const forbiddenChar = this.options.forbiddenChar;

        if (forbiddenChar) {
            forbiddenChar.lastIndex = 0;

            if (forbiddenChar.test(value)) {
                return true;
            }
        }

        return false;
    }

    handleFocus(event) {
        this.emit(BasicTyping.FOCUS, {
            originalEvent: event,
        });
    }

    handleBlur(event) {
        this.emit(BasicTyping.BLUR, {
            originalEvent: event,
        });
    }

    destroy() {
        this.removeListeners();

        BasicTyping.#removeIndex(this.index);
        BasicTyping.#removeElement(this.element);

        this.element.remove();

        if (this.measureElement) {
            this.measureElement.remove();
        }
    }

    reset() {
        this.value = "";
    }
}
