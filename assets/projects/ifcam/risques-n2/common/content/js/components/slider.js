// -> Moteur gestionnaire d'éléments à slider
// class slideClass à ajouter aux éléments qui seront animés
// utilise les transitions CSS pour les changements entre slides

function Slider(props) {
    this.element = props.element;
    this.btNext = props.btNext;
    this.btPrev = props.btPrev;
    this.disablingEl = props.disablingEl != undefined ? props.disablingEl : this.element.parentNode;
    this.axe = props.axe != undefined ? props.axe : "x";
    this.reverse = typeof props.reverse == "boolean" ? props.reverse : false;
    this.duration = typeof props.duration == "number" ? props.duration : 0.6;
    this.slideClass = typeof props.slideClass == "string" ? props.slideClass : "slide";
    this.inactiveClass = props.inactiveClass != undefined ? props.inactiveClass : "inactive";
    this.activeClass = props.activeClass != undefined ? props.activeClass : "active";
    this.easing = props.easing != undefined ? props.easing : "ease-out";
    this.cbEnd = typeof props.cbEnd == "function" ? props.cbEnd : function () { };
    this.cbReset = typeof props.cbReset == "function" ? props.cbReset : function () { };
    this.cbEach = typeof props.cbEach == "function" ? props.cbEach : function () { };
    this.cbEachEnd = typeof props.cbEachEnd == "function" ? props.cbEachEnd : function () { };
    this.slides = this.element.querySelectorAll("." + this.slideClass);
    this.max = this.slides.length;
    this.min = 1;
    this.current = 1;
    this.cssValue = this.axe == "x" ? "X" : "Y";
    this.forceEnd = false;
    this.ended = false;

    this.handleNext = this.nextSlide.bind(this);
    this.handlePrev = this.prevSlide.bind(this);
    this.handleTransiticbEnd = this.cbTransitionEnd.bind(this);

    this.init();
    this.setAtPos();
    this.cbEach(this.current);
    this.activate();
    this.addEvents();
}

Slider.prototype = {
    setAtPos: function (pos) {
        if (pos) {
            this.current = pos;
        }
        for (var t = 1; t <= this.slides.length; t++) {
            var slide = this.slides[t - 1];
            slide.style["transition-duration"] = "0s";
            if (t != this.current) {
                //slide.style.opacity = 0;
                slide.style["transform"] = (this.reverse == true) ? "translate" + this.cssValue + "(-100%)" : "translate" + this.cssValue + "(100%)";
            } else {
                //slide.style.opacity = 1;
                slide.style["transform"] = "translate" + this.cssValue + "(0%)";
            }
            slide.style["transition-duration"] = "";
        }
        this.moveKeepers(false);
    },
    move: function (dir) {
        this.forceEnd = false;
        var toShowSlide = this.slides[this.current - 1],
            toHideSlide = this.slides[(dir == "next") ? this.current - 2 : this.current];

        toShowSlide.style["pointer-events"] = "";
        toShowSlide.style["transition-duration"] = this.duration + "s";
        toShowSlide.style["transition-timing-function"] = this.easing;
        //toShowSlide.style.opacity = 1;
        toShowSlide.style["transform"] = "translate" + this.cssValue + "(0%)";

        toHideSlide.style["transition-duration"] = this.duration + "s";
        toHideSlide.style["transition-timing-function"] = this.easin
        //toHideSlide.style.opacity = 0;
        toHideSlide.style["transform"] = ((dir == "next" && this.reverse == false) || (dir == "prev" && this.reverse == true)) ? "translate" + this.cssValue + "(-100%)" : "translate" + this.cssValue + "(100%)";

        this.moveKeepers(true);
    },
    moveKeepers: function (animated) {
        var keepers = this.element.querySelectorAll('[keep]');
        if (keepers) {
            for (var k = 1; k <= keepers.length; k++) {
                var keeper = keepers[k - 1],
                    parent = keeper.parentNode,
                    num = parent.num,
                    dim = this.axe == "x" ? parent.offsetWidth : parent.offsetHeight,
                    attr = keeper.getAttribute("keep"),
                    values = attr.split("-");
                if (values.indexOf(this.current.toString()) != -1) {
                    var diff = (this.current - num),
                        val = (this.reverse == true) ? -(diff * dim) : (diff * dim);
                    if (animated) {
                        keeper.style["transition-duration"] = this.duration + "s";
                        keeper.style["transition-timing-function"] = this.easing;
                    } else {
                        keeper.style["transition-duration"] = "0s";
                    }
                    keeper.style["transform"] = "translate" + this.cssValue + "(" + val + "px)";
                    if (animated == false) {
                        keeper.style["transition-duration"] = "";
                    }
                }
            }
        }
    },
    nextSlide: function () {
        if (this.current < this.max) {
            this.desactivate();
            this.current++;
            this.move("next");
            this.cbEach(this.current, "next");
            if (this.checkCompletion()) {
                this.ended = true;
                this.cbEnd();
            }
        }
    },
    prevSlide: function () {
        if (this.current > 1) {
            this.desactivate();
            this.current--;
            this.move("prev");
            this.cbEach(this.current, "prev");
        }
    },
    cbTransitionEnd: function (e) {
        if (this.forceEnd == false) {
            this.forceEnd = true;
            var target = e.target;
            if (target.style.opacity == 0) {
                target.style["pointer-events"] = "none";
            } else {
                target.style["pointer-events"] = "";
            }
            this.cbEachEnd(this.current);
            this.activate();
        }
    },
    activate: function () {
        if (this.btNext && this.btPrev) {
            this.btNext.style["pointer-events"] = "";
            this.btPrev.style["pointer-events"] = "";

            if (this.current == 1) {
                this.btPrev.classList.add(this.inactiveClass);
                this.btPrev.classList.remove(this.activeClass);
                this.btNext.classList.remove(this.inactiveClass);
                this.btNext.classList.add(this.activeClass);
            }
            else if (this.current == this.max) {
                this.btNext.classList.add(this.inactiveClass);
                this.btNext.classList.remove(this.activeClass);
                this.btPrev.classList.remove(this.inactiveClass);
                this.btPrev.classList.add(this.activeClass);
            } else {
                this.btPrev.classList.remove(this.inactiveClass);
                this.btPrev.classList.add(this.activeClass);
                this.btNext.classList.remove(this.inactiveClass);
                this.btNext.classList.add(this.activeClass);
            }
        }
    },
    desactivate: function () {
        if (this.btNext && this.btPrev) {
            this.btNext.style["pointer-events"] = "none";
            this.btPrev.style["pointer-events"] = "none";

            if (this.current == 1) {
                this.btPrev.classList.add(this.inactiveClass);
                this.btPrev.classList.remove(this.activeClass);
                this.btNext.classList.remove(this.inactiveClass);
                this.btNext.classList.add(this.activeClass);
            }
            else if (this.current == this.max) {
                this.btNext.classList.add(this.inactiveClass);
                this.btNext.classList.remove(this.activeClass);
                this.btPrev.classList.remove(this.inactiveClass);
                this.btPrev.classList.add(this.activeClass);
            } else {
                this.btPrev.classList.remove(this.inactiveClass);
                this.btPrev.classList.add(this.activeClass);
                this.btNext.classList.remove(this.inactiveClass);
                this.btNext.classList.add(this.activeClass);
            }
        }
    },
    checkCompletion: function () {
        return (this.current == this.max)
    },
    init: function () {
        for (var s = 1; s <= this.slides.length; s++) {
            var slide = this.slides[s - 1];
            slide.num = s;
            slide.style["transition-property"] = "opacity, transform";
        }
        var keepers = this.element.querySelectorAll('[keep]');
        if (keepers) {
            for (var k = 1; k <= keepers.length; k++) {
                var keeper = keepers[k - 1];
                keeper.style["transition-property"] = "transform";
            }
        }
    },
    reset: function(){
        this.current = 1;
        this.ended = false;
        this.setAtPos();
        this.cbReset();
        this.activate();
    },
    enable: function(){
        this.disablingEl.style["pointer-events"] = "";
    },
    disable: function(){
        this.disablingEl.style["pointer-events"] = "none";
    },
    addEvents: function () {
        if (this.btNext && this.btPrev) {
            $(this.btNext).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handleNext);
            $(this.btPrev).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, this.handlePrev);
        }
        for (var t = 1; t <= this.slides.length; t++) {
            var slide = this.slides[t - 1];
            slide.addEventListener("transitionend", this.handleTransiticbEnd);
            slide.addEventListener("webkitTransiticbEnd", this.handleTransiticbEnd);
        }
    },
    removeEvents: function () {
        if (this.btNext && this.btPrev) {
            $(this.btNext).off(Constants.CLICK_TOUCH);
            $(this.btPrev).off(Constants.CLICK_TOUCH);
        }
        for (var t = 1; t <= this.slides.length; t++) {
            var slide = this.slides[t - 1];
            slide.removeEventListener("transitionend", this.handleTransiticbEnd);
            slide.removeEventListener("webkitTransiticbEnd", this.handleTransiticbEnd);
        }
    }
};