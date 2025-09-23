(function () {
    function PieTimer(selectorOrElement, options) {
        this.container = selectorOrElement instanceof HTMLElement ?
            selectorOrElement :
            document.querySelector(selectorOrElement);;
        this.defautOptions = {
            // durée en secondes
            duration: 0,
            preAngle: 25,
            steps: [{
                    percentage: 50,
                    color: 'orange'
                },
                {
                    percentage: 75,
                    color: 'red'
                },
            ],
            // handlers
            handlers: {
                onTick: function (values /* un objet contenant "hours", "minutes" et "seconds" */ ) {},
                onComplete: function () {}
            }
        };
        this.options = extend(true, this.defautOptions, options || {});
        this.id = -1;
        this.flow = -1;
        this.values = {
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        this.dom = buildDom();
        this.container.innerHTML = '';
        this.container.appendChild(this.dom);

        this.pie = this.dom.querySelector('.pie');
        this.prePie = this.dom.querySelector('.pre-pie');
        this.pieBg = this.dom.querySelector('.pie-bg');
        this.border = this.dom.querySelector('.border');
        this.background = this.dom.querySelector('.background');

        this.halfWidth = this.dom.getBoundingClientRect().width * 0.5;
        this.border.setAttribute('r', this.halfWidth);
        this.pieBg.setAttribute('r', this.halfWidth - 1);
        this.background.setAttribute('r', this.halfWidth - 1);

        this.initialTransitionProperty = window.getComputedStyle(this.pieBg).getPropertyValue('transition-property');

        this.percent = 0;
        this.elapsed = 0;
        this.startTime = 0;

        this.animationFrameId = -1;
        this.boundHandleResize = function (e) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = window.requestAnimationFrame(function () {
                this.handleResize.call(this, e)
            });
        };
        window.addEventListener('resize', this.boundHandleResize);

        this.reset();
    }

    PieTimer.prototype.setOptions = function (options) {
        this.options = extend(true, this.defautOptions, this.options, options || {});
        return this;
    };

    PieTimer.prototype.start = function () {
        if (this.options.duration <= 0) {
            return false;
        }
        var self = this;
        self.id = window.setInterval(function () {
            // Décompte des secondes
            if (self.values.seconds > 0) {
                self.values.seconds--;
            } else {
                // Décompte des minutes
                if (self.values.minutes > 0) {
                    self.values.minutes--;
                    self.values.seconds = 59;
                } else {
                    // Décompte des heures
                    if (self.values.hours > 0) {
                        self.values.hours--;
                        self.values.minutes = 59;
                        self.values.seconds = 59;
                    } else {
                        self.stop();
                        self.options.handlers.onComplete.call();
                        this.pieBg.style.transition = 'none';
                        this.pieBg.style.fill = '';
                        return;
                    }
                }
            }
            self.options.handlers.onTick.call(null, self.values);
        }.bind(this), 1000);

        this.startTime = Date.now() - this.elapsed;
        this.elapsed = 0;
        this.flow = window.setInterval(function () {
            var time = Date.now() - this.startTime;
            if (time >= this.getDuration() * 1000) {
                window.clearInterval(this.flow);
            }
            var percent = (time / (this.getDuration() * 1000)) * 100;
            var progress = Math.min(100, Math.max(percent, 0));
            this.draw(progress);

            this.pieBg.style.transition = '';
            this.options.steps.forEach(function (step) {
                if (progress >= step.percentage) {
                    this.pieBg.style.fill = step.color;
                }
            }.bind(this));
        }.bind(this), 1000 / 60);

        return this;
    };

    PieTimer.prototype.stop = function () {
        window.clearInterval(this.id);
        window.clearInterval(this.flow);
        if (this.elapsed === 0) {
            this.elapsed = Date.now() - this.startTime;
        }
        return this;
    };

    PieTimer.prototype.reset = function () {
        this.stop();
        this.pieBg.style.transition = 'none';
        this.pieBg.style.fill = '';
        var h = Math.floor(this.options.duration / 60 / 60);
        var m = Math.floor((this.options.duration / 60) - Math.round(h * 60));
        var s = Math.round(((this.options.duration / 60) - m - Math.round(h * 60)) * 60);
        this.values = {
            hours: h,
            minutes: m,
            seconds: s
        };
        this.options.handlers.onTick.call(null, this.values);
        this.elapsed = -1;
        this.draw(0);
        return this;
    };

    // retourne la durée restante en secondes
    PieTimer.prototype.getTime = function () {
        // conversion des heures, minutes et secondes en un temps en secondes
        return (parseInt(this.values.hours, 10) * 60 * 60) + (parseInt(this.values.minutes, 10) * 60) + parseInt(this.values.seconds, 10);
    };

    // retourne la durée totale en secondes
    PieTimer.prototype.getDuration = function () {
        return this.options.duration;
    };

    PieTimer.prototype.setTime = function (time) {
        // conversion du temps en secondes en heures, minutes et secondes pour définir le temps restant
        var h;
        var m;
        var s;
        h = Math.floor(time / 3600);
        if (h < 0) {
            h = 0;
        }
        time %= 3600;
        m = Math.floor(time / 60);
        time %= 60;
        s = Math.floor(time);
        this.values = {
            hours: h,
            minutes: m,
            seconds: s
        };
        this.options.handlers.onTick.call(null, this.values);
        return this;
    };

    PieTimer.prototype.setDuration = function (duration) {
        /* duration en secondes */
        this.options.duration = duration;
        this.reset();
        return this;
    };

    PieTimer.prototype.getDom = function () {
        return this.dom;
    };

    PieTimer.prototype.draw = function (percent) {
        var angle = Math.round((360 / 100) * percent);
        var radian = toRadian(angle);
        var x = Math.sin(radian) * this.halfWidth;
        var y = Math.cos(radian) * -this.halfWidth;
        var mid = (angle > 180) ? 1 : 0;

        var preRadian = toRadian(this.options.preAngle);
        var preX = Math.sin(preRadian) * this.halfWidth;
        var preY = Math.cos(preRadian) * -this.halfWidth;

        this.prePie.classList[angle > 0 ? 'remove' : 'add']('hidden');
        this.prePie.setAttribute('d', 'M 0 0 v -'+this.halfWidth+' A '+this.halfWidth+' '+this.halfWidth+' 1 0 1 '+preX+' '+preY+' z');
        this.prePie.style.transform = 'translate(50%, 50%) scale(0.8) rotate('+Math.floor(angle / this.options.preAngle) * this.options.preAngle+'deg)';

                   
        var anim = 'M 0 0 v -'+this.halfWidth+' A '+this.halfWidth+' '+this.halfWidth+' 1 '+mid+' 1 '+x+' '+y+' z';
        this.pie.setAttribute('d', anim);
        this.percent = percent;
        return this;
    };

    PieTimer.prototype.handleResize = function () {
        this.halfWidth = this.dom.getBoundingClientRect().width * 0.5;
        this.border.setAttribute('r', this.halfWidth);
        this.pieBg.setAttribute('r', this.halfWidth - 1);
        this.background.setAttribute('r', this.halfWidth - 1);
        this.draw(this.percent);
    };

    PieTimer.prototype.destroy = function () {
        window.cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.boundHandleResize);
        return this;
    };

    function createNS(type) {
        return document.createElementNS('http://www.w3.org/2000/svg', type);
    }

    function buildDom() {
        var svg = createNS('svg');
        svg.classList.add('pie-timer');
        
        var border = createNS('circle');
        border.classList.add('border');
        svg.appendChild(border);

        var background = createNS('circle');
        background.classList.add('background');
        svg.appendChild(background);

        var pieBg = createNS('circle');
        pieBg.classList.add('pie-bg');
        svg.appendChild(pieBg);

        var prePie = createNS('path');
        prePie.classList.add('pre-pie');
        svg.appendChild(prePie);

        var pie = createNS('path');
        pie.classList.add('pie');
        svg.appendChild(pie);
        return svg;
    }

    /**
     * @description Convertion de degrés en radians
     * @param {Number} deg L'angle en degrés
     * @returns {Number} L'angle en radians
     */
    function toRadian(deg) {
        return deg * (Math.PI / 180);
    }


    function extend() {
        var extended = {};
        var deep = false;
        var i = 0;

        // deep merge ?
        if (typeof (arguments[0]) === 'boolean') {
            deep = arguments[0];
            i++;
        }

        var merge = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        // deep merge and the property is an object
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        // regular "shallow" merge
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < arguments.length; i++) {
            merge(arguments[i]);
        }
        return extended;
    };

    window.PieTimer = PieTimer;
})();