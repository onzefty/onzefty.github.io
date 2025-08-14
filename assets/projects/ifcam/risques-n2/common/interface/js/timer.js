

/**
 * Timer - chronomètre à rebours
 *
 * @param  {Object} options Configuration object
 * @return {object} The Timer instance for chaining
 */
function Timer(options) {
    var defautOptions = {
        // durée en minutes
        duration: 0,
        // handlers
        handlers: {
            onTick: function (values /* un objet contenant "hours", "minutes" et "seconds" */) {},
            onComplete: function () {}
        }
    };
    this.options = Utility.extend(true, defautOptions, options || {});
    this.id = -1;
    this.values = {
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    this.reset();
    return this;
}
Timer.prototype.setOptions = function (options) {
    this.options = Utility.extend(true, this.options, options || {});
    return this;
};
Timer.prototype.start = function () {
    if (this.options.duration <= 0) { return false; }
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
                }
            }
        }
        self.options.handlers.onTick.call(null, self.values);
    }, 1000);
    return this;
};
Timer.prototype.stop = function () {
    window.clearInterval(this.id);
    return this;
};
Timer.prototype.reset = function () {
    var h = Math.floor(this.options.duration / 60);


    var m = Math.floor(this.options.duration - Math.round(h * 60));


    var s = Math.round((this.options.duration - m - Math.round(h * 60)) * 60);
    this.values = {
        hours: h,
        minutes: m,
        seconds: s
    };
    this.options.handlers.onTick.call(null, this.values);
    return this;
};
// retourne la durée restante en secondes
Timer.prototype.getTime = function () {
    // conversion des heures, minutes et secondes en un temps en secondes
    return (parseInt(this.values.hours, 10) * 60 * 60) + (parseInt(this.values.minutes, 10) * 60) + parseInt(this.values.seconds, 10);
};
// retourne la durée totale en secondes
Timer.prototype.getDuration = function () {
    // conversion des minutes en secondes
    return this.options.duration * 60;
};
Timer.prototype.setTime = function (time) {
    // conversion du temps en secondes en heures, minutes et secondes pour définir le temps restant
    var h; var m; var s;
    h = Math.floor(time / 3600);
    if (h < 0) { h = 0; }
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
Timer.prototype.setDuration = function (duration) { /* duration en secondes */
    this.options.duration = duration / 60;
    this.reset.call();
    return this;
};
