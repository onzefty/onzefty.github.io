// -> Moteur gestionnaire d'infos à display
// transition css utilisées pour les animations
// utilise jQuery pour les événements
function Infos(props) {
    var defaultOptions = {
        buttons: [],
        infos: [],
        duration: 0.8,
        easing: "ease-out",
        cbEach: function () { },
        cbHide: function () { },
        cbEnd: function () { },
        cbEndHidden: function () { },
        cbReset: function () { },
        clickedClass: "clicked",
        activeClass: "active",
        inactiveClass: "inactive",
        hideClass: "hidden",
        seenClass: false,
        buttonCloseClass: "button-close",
        hideButtons: false,
        noHiding: false,
        keepClickedClass: false,
        onlyOneInfoDisplayed: false,
        alreadyShown: null
    }
    this.options = Object.assign(defaultOptions, props);
    this.options.transitionsOut = this.getPropertiesArray("out", props.transitionsOut, this.options.infos.length);
    this.options.transitionsIn = this.getPropertiesArray("in", props.transitionsIn, this.options.infos.length);
    this.options.transitionsLinked = props.transitionsLinked ? this.getPropertiesArray("linked", props.transitionsLinked, this.options.infos.length) : null;

    this.infos = [];
    this.buttons = [];
    this.completed = false;
    this.allSeen = false;

    this.handleClick = this.onClick.bind(this);
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);

    this.init();
}

Infos.prototype = {
    getPropertiesArray: function (w, trans, length) {
        transforms = ["translateX", "translateY", "rotate", "scaleX", "scaleY"];
        if (Array.isArray(trans) == true && trans.length == length) {
            for (var p = 1; p <= trans.length; p++) {
                var pro = trans[p - 1];
                for (var pr in pro) {
                    if (transforms.indexOf(pr) != -1) {
                        if (pro.transform == undefined) {
                            pro.transform = {};
                        }
                        pro.transform[pr] = pro[pr];
                        delete pro[pr];
                    }
                }
            }
            return trans;
        } else {
            var arr = [];
            for (var p = 1; p <= length; p++) {
                if (trans != undefined) {
                    for (var pr in trans) {
                        if (transforms.indexOf(pr) != -1) {
                            if (trans.transform == undefined) {
                                trans.transform = {};
                            }
                            trans.transform[pr] = trans[pr];
                            delete trans[pr];
                        }
                    }
                    arr.push(trans);
                } else {
                    arr.push((w == "out") ? { opacity: 1, transform: { scaleX: 1, scaleY: 1 } } : { opacity: 0, transform: { scaleX: 0, scaleY: 0 } });
                }

            }
            return arr;
        }
    },
    onClick: function (button, e) {
        var info = this.infos[button.num - 1];
        if (info.opened == true) {
            if (this.options.keepClickedClass == false) {
                button.removeClass(this.options.clickedClass)
            }
            if (button.seen == true && typeof this.options.seenClass == "string") {
                button.addClass(this.options.seenClass);
            }
            if (this.options.noHiding == false) {
                this.hide(info);
                this.options.cbHide(button.num);
            }
        } else {
            button.isSeen(this.options.clickedClass);
            button.removeClass(this.options.activeClass);
            if (this.options.hideButtons == true) {
                button.addClass(this.options.hideClass);
            }
            this.show(info);
            this.options.cbEach(button.num);
        }
    },
    show: function (info) {
        if (this.options.onlyOneInfoDisplayed == true) {
            for (var i = 1; i <= this.infos.length; i++) {
                var inf = this.infos[i - 1],
                    button = this.buttons[i - 1];
                if (inf.opened == true) {
                    inf.hide();
                    if (this.options.keepClickedClass == false) {
                        button.removeClass(this.options.clickedClass);
                    }
                    if (button.seen == true && typeof this.options.seenClass == "string") {
                        button.addClass(this.options.seenClass);
                    }
                }
                if (inf.opened == false && this.options.transitionsLinked) {
                    inf.hide();
                }
            }
        }
        info.removeClass(this.options.hideClass);
        info.show();

    },
    hide: function (info) {
        info.hide();
    },
    hideAll: function () {
        for (var i = 1; i <= this.infos.length; i++) {
            var info = this.infos[i - 1],
                button = this.buttons[i - 1];
            info.hide();
            if (this.options.keepClickedClass == false) {
                button.removeClass(this.options.clickedClass);
            }
        }
    },
    onTransitionEnd: function (info, e) {
        if (info.forceEnd == false) {
            info.forceEnd = true;
            //info.element.style["pointer-events"] = info.state == "out" ? "" : "none";
            if (info.state == "in") {
                info.addClass(this.options.hideClass);
            }
            if (this.checkOpened() == true) {
                this.allSeen = true;
                this.options.cbEnd();
                if (this.completed == false && info.state == "in") {
                    this.completed = true;
                    this.options.cbEndHidden();
                }
            }
        }
    },
    checkOpened: function () {
        var count = 0;
        for (var b = 1; b <= this.buttons.length; b++) {
            if (this.buttons[b - 1].seen == true) {
                count++;
            }
        }
        return (count == this.buttons.length);
    },
    reset: function () {
        for (var b = 1; b <= this.buttons.length; b++) {
            var button = this.buttons[b - 1],
                info = this.infos[b - 1];

            info.hide();
            button.removeClass(this.options.hideClass);
            button.removeClass(this.options.clickedClass);
            button.removeClass(this.options.seenClass);
            button.addClass(this.options.activeClass);
            button.seen = false;
            $(button.element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.onClick.bind(this, button));

        }
        if (this.options.alreadyShown != null) {
            this.buttons[this.options.alreadyShown - 1].isSeen(this.options.clickedClass);
            this.buttons[this.options.alreadyShown - 1].addClass(this.options.clickedClass);
            this.show(this.infos[this.options.alreadyShown - 1]);
        }
        this.completed = false;
        this.allSeen = false;
        this.options.cbReset();
    },
    dispose: function () {
        for (var b = 1; b <= this.options.buttons.length; b++) {
            var button = this.options.buttons[b - 1],
                info = this.options.infos[b - 1];
            $(this.buttons[b - 1].element).off(Constants.CLICK_TOUCH);
            info.removeEventListener("transitionend", this.onTransitionEnd.bind(this, this.infos[b - 1]));
            info.removeEventListener("webkitTransitionEnd", this.onTransitionEnd.bind(this, this.infos[b - 1]));
            var buttonClose = info.querySelector("." + this.options.buttonCloseClass);
            if (buttonClose) {
                $(buttonClose).off(Constants.CLICK_TOUCH);
            }
        }
    },
    init: function () {
        for (var b = 1; b <= this.options.buttons.length; b++) {
            var button = this.options.buttons[b - 1],
                info = this.options.infos[b - 1];

            this.buttons.push(new InfoButton({
                element: button,
                num: b,
            }));
            this.buttons[b - 1].removeClass(this.options.hideClass);
            this.buttons[b - 1].removeClass(this.options.clickedClass);
            this.buttons[b - 1].addClass(this.options.activeClass);
            $(this.buttons[b - 1].element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.onClick.bind(this, this.buttons[b - 1]));

            this.infos.push(new InfoDisplay({
                element: info,
                num: b,
                transitionsIn: this.options.transitionsIn[b - 1],
                transitionsOut: this.options.transitionsOut[b - 1],
                transitionsLinked: Array.isArray(this.options.transitionsLinked) ? this.options.transitionsLinked[b - 1] : null,
            }));

            this.infos[b - 1].addClass(this.options.hideClass);

            var transIn = this.options.transitionsIn[b - 1],
                s = "", i = 1, total = Object.keys(transIn).length;
            for (var t in transIn) {
                s += i < total ? t + "," : t;
                if (t == "transform") {
                    var s2 = "";
                    for (var t2 in transIn[t]) {
                        s2 += t2 + "(" + (transIn[t][t2]) + ")"
                    }
                    info.style["transform"] = s2;
                } else {
                    info.style[t] = transIn[t];
                }
                i++;
            }
            info.style["transition-property"] = s;
            info.style["transition-duration"] = this.options.duration + "s";
            info.setAttribute("state", "in");
            //info.style["pointer-events"] = "none";
            info.removeEventListener("transitionend", this.onTransitionEnd.bind(this, this.infos[b - 1]));
            info.removeEventListener("webkitTransitionEnd", this.onTransitionEnd.bind(this, this.infos[b - 1]));
            info.addEventListener("transitionend", this.onTransitionEnd.bind(this, this.infos[b - 1]));
            info.addEventListener("webkitTransitionEnd", this.onTransitionEnd.bind(this, this.infos[b - 1]));

            var buttonClose = info.querySelector("." + this.options.buttonCloseClass);
            if (buttonClose) {
                $(buttonClose).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.onClick.bind(this, this.buttons[b - 1]));
            }
        }

        if (this.options.alreadyShown != null) {
            this.buttons[this.options.alreadyShown - 1].addClass(this.options.clickedClass);
            this.show(this.infos[this.options.alreadyShown - 1]);
        }
    }
}

function InfoDisplay(props) {
    this.element = props.element;
    this.num = props.num;
    this.transitionsIn = props.transitionsIn;
    this.transitionsOut = props.transitionsOut;
    this.transitionsLinked = props.transitionsLinked;
    this.forceEnd = false;
    this.opened = false;
    this.state = "in";
}

InfoDisplay.prototype = {
    setValue: function (w) {
        var props = w == "out" ? this.transitionsOut : w == "in" ? this.transitionsIn : this.transitionsLinked;
        for (var t in props) {
            if (t == "transform") {
                var s2 = "";
                for (var t2 in props[t]) {
                    s2 += t2 + "(" + (props[t][t2]) + ")";
                }
                this.element.style["transform"] = s2;
            } else {
                this.element.style[t] = props[t];
            }
        }
    },
    show: function () {
        this.opened = true;
        this.state = "out";
        this.forceEnd = false;
        this.element.setAttribute("state", "out");
        this.setValue("out");
    },
    hide: function () {
        this.opened = false;
        this.state = "in";
        this.forceEnd = false;
        this.element.setAttribute("state", "in");
        this.setValue(this.transitionsLinked ? "linked" : "in");
    },
    addClass: function (cl) {
        this.element.classList.add(cl);
    },
    removeClass: function (cl) {
        this.element.classList.remove(cl);
    }
}

function InfoButton(props) {
    this.element = props.element;
    this.num = props.num;
    this.seen = false;
}

InfoButton.prototype = {
    isSeen: function (cl) {
        this.seen = true;
        this.addClass(cl);
    },
    addClass: function (cl) {
        this.element.classList.add(cl);
    },
    removeClass: function (cl) {
        this.element.classList.remove(cl);
    }
}