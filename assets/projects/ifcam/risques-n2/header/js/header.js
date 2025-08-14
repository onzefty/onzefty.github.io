(function (win) {
    var STATICS = {
        HEADER_OPEN: {
            get: function () {
                return 'Header.menuOpen';
            }
        },
        HEADER_UPDATE: {
            get: function () {
                return 'Header.update';
            } 
        },
        HEADER_SHOW: {
            get: function () {
                return 'Header.show';
            } 
        },
        HEADER_HIDE: {
            get: function () {
                return 'Header.hide';
            } 
        },
        SWITCH_LANGUAGE: {
            get: function () {
                return 'switchLanguage';
            }
        }
    };

    setStatic(STATICS, Header);

    function Header(){
    	this.element = document.querySelector(".header");
        this.titleEl = this.element.querySelector("#header-title");

    	this.addEvents();
    }

    Header.prototype = {
    	addEvents:function(){
    	},
    	update:function(datas){
            if(typeof datas.title == "string"){
                this.titleEl.innerHTML = datas.title;
            }
    	},
        hide:function(){
            this.element.classList.add("hidden");
        },
        show:function(){
            this.element.classList.remove("hidden");
        }
    };

    mix(Header, EmitterMixin);
    win.Header = Header;
})(window);
