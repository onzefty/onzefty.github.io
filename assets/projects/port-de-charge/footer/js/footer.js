(function (win) {
    var STATICS = {
        PREVIOUS_CLICKED: {
            get: function () {
                return 'Footer.previousClicked';
            }
        },
        NEXT_CLICKED: {
            get: function () {
                return 'Footer.nextClicked';
            }
        },
        FOOTER_UPDATE: {
            get: function () {
                return 'Footer.update';
            } 
        },
        FOOTER_OFF: {
            get: function () {
                return 'Footer.off';
            } 
        },
        FOOTER_ON: {
            get: function () {
                return 'Footer.on';
            } 
        }
    };

    setStatic(STATICS, Footer);

    function Footer(){
    	this.element = document.querySelector(".footer");
    	this.buttonPrev = this.element.querySelector("#button-prev");
    	this.buttonNext = this.element.querySelector("#button-next");
    	this.currentPartEl = this.element.querySelector("#footer-part-number-current");
    	this.totalPartsEl = this.element.querySelector("#footer-parts-total");
        this.sepPartEl = this.element.querySelector("#footer-part-sep");
        this.titlePartEl = this.element.querySelector("#footer-part-title");
        this.progressEl = this.element.querySelector("#footer-progress");
        
        this.boundHandlePrev = this.handlePrev.bind(this);
        this.boundHandleNext = this.handleNext.bind(this);
        this.boundHandleOn = this.handleOn.bind(this);
        this.boundHandleOff = this.handleOff.bind(this);

        this.nextValue = 1;
        this.prevValue = -1;

    	this.addEvents();
    }

    Footer.prototype = {
    	addEvents:function(){
    		this.buttonPrev.addEventListener(Constants.CLICK_TOUCH, this.boundHandlePrev);
    		this.buttonNext.addEventListener(Constants.CLICK_TOUCH, this.boundHandleNext);
    	},
    	handlePrev:function(){
            this.emit(Footer.PREVIOUS_CLICKED);
    	},
    	handleNext:function(){
    		this.emit(Footer.NEXT_CLICKED);
    	},
        handleOn:function(w){
            if(w=="next"){
                this.buttonNext.classList.remove("inactive");
                this.buttonNext.classList.add("active");
                this.buttonPrev.classList.add("inactive");
                this.buttonPrev.classList.remove("active");
            }
            else if(w=="prev"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            } else {
                this.buttonNext.classList.remove("inactive");
                this.buttonNext.classList.add("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            }
        },
        handleOff:function(w){
            if(w=="next"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            }
            else if(w=="prev"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            } else {
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.add("inactive");
                this.buttonPrev.classList.remove("active");
            }
        },
    	update:function(datas){
            if(datas.title!=undefined){
                this.titlePartEl.innerHTML = datas.title;
            }
            if(datas.currentPart!=undefined){
                this.currentPartEl.innerHTML = datas.currentPart;
                if(datas.currentPart.length==0){
                    this.sepPartEl.innerHTML = "";
                } else {
                    this.sepPartEl.innerHTML = "/";
                }
            }
            if(datas.totalParts!=undefined){
                this.totalPartsEl.innerHTML = datas.totalParts;                
            }
            if(datas.progress!=undefined){
                this.progressEl.style.width = datas.progress+"%";
            }
    	}
    };

    mix(Footer, EmitterMixin);
    win.Footer = Footer;
})(window);
