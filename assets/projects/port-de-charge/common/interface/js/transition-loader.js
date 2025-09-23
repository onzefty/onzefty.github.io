/**
 * @class
 * @constructor
 * @param {String|HTMLElement} selectorOrElement Selector used with querySelector or HTMLElement instance
 */
 function TransitionLoader(selectorOrElement) {
    this.displayable = new Displayable(selectorOrElement).hide();
    this.loader = this.displayable.find('.' + TransitionLoader.LOADER_CSS_CLASS);
    this.transitionRunning = false;
}

TransitionLoader.prototype = {
    /**
     * Start the transition to be visible and display the loader
     * @method show
     * @returns {Promise} Resolved at the end of the transition or rejected if error
     */
    show: function() {
        if (this.transitionRunning === true || this.displayable.css('display') != 'none') {
            return Promise.reject(new Error('Transition loader already shown or in transition'));
        }
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                // écouteur de fin de transition ( sur 2 éléments donc on ne fait rien si callback déjà appelé )
                var executedOnce = false;
                self.transitionRunning = true;
                [self.displayable.find('.top'), self.displayable.find('.bottom')].forEach(function(element) {
                    element.off(Constants.TRANSITION_END).on(Constants.TRANSITION_END, function(/* e */) {
                        if (!executedOnce) {
                            executedOnce = true;
                            self.displayable.show();
                            self.displayable.find('.' + TransitionLoader.LOADER_CSS_CLASS).show();
                            self.transitionRunning = false;
                            resolve();
                        }
                    });
                });

                self.displayable.find('.' + TransitionLoader.LOADER_CSS_CLASS).hide();
                self.displayable.show();

                // on déclenche la transition
                self.displayable.find('.top').css('top', '0%');
                self.displayable.find('.bottom').css('bottom', '0%');
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * Hide the loader and start the transition to be hidden
     * @method hide
     * @returns {Promise} Resolved at the end of the transition or rejected if error
     */
    hide: function() {
        if (this.transitionRunning === true || this.displayable.css('display') == 'none') {
            return Promise.reject(new Error('Transition loader already hidden or in transition'));
        }
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                // écouteur de fin de transition
                var executedOnce = false;
                self.transitionRunning = true;
                [self.displayable.find('.top'), self.displayable.find('.bottom')].forEach(function(element) {
                    element.off(Constants.TRANSITION_END).on(Constants.TRANSITION_END, function(/* e */) {
                        if (!executedOnce) {
                            executedOnce = true;
                            self.displayable.hide();
                            self.displayable.find('.' + TransitionLoader.LOADER_CSS_CLASS).show();
                            self.transitionRunning = false;
                            resolve();
                        }
                    });
                });

                self.displayable.find('.' + TransitionLoader.LOADER_CSS_CLASS).hide();

                // on déclenche la transition
                self.displayable.find('.top').css('top', '-100%');
                self.displayable.find('.bottom').css('bottom', '-100%');
            } catch (error) {
                reject(error);
            }
        });
    },
};

/**
 * Classe CSS appliquée à la partie loader du transition-loader et qui permet de l'identifier
 */
TransitionLoader.LOADER_CSS_CLASS = 'loader-css-class';
