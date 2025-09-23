(function (window, $) {
    'use strict';

    window.standard = new Standard();

    window.ofp = new OFP();

    // DOM ready
    $(function () {
        // sur mobile, au tap/touch on empeche le comportement par defaut sauf s'il s'agit d'un composant natif qui doit conserver ses actions par defaut comme les videos ( sinon impossible de lancer la lecture des videos sous Android )
        if (Utility.isMobile()) {
            $('body').on(Constants.CLICK_TOUCH, function (e) {
                if (e.stopPropagation) {
                    var doPrevent = false;
                    var target = $(e.target) || null;
                    if (target)  {
                        doPrevent = true;
                        'audio video input textarea select'
                            .split(' ')
                            .forEach(function (type) {
                                if (target.is(type)) {
                                    doPrevent = false;
                                    return false;
                                }
                                return true;
                            });
                    }
                    if (doPrevent) {
                        e.preventDefault();
                    }
                }
            });
        }

        ofp.resize();

        // pour le SCORM distant, on attend le chargement des données
        if (Utility.isRemoteSCORMContext()) {
            var waitDistantSCORMAPI = function () {
                if (!window.ofp_distantSCORMAPILoaded) {
                    setTimeout(waitDistantSCORMAPI, 250);
                } else {
                    ofp.player.load();
                }
            };
            waitDistantSCORMAPI();
        } else {
            ofp.player.load();
        }
    });


    // écouteur de redimensionnement
    $(window).on('orientationchange resize', function (e) {
        // utilisation de requestAnimationFrame pour de meilleurs performances et une fluidité accrue
        window.requestAnimationFrame(ofp.resize.bind(ofp));
    });


    // écouteur d'unload de la page
    $(window).one('unload beforeunload', function (e) {
        // supression de l'écouteur sur les 2 événements afin que la fonction soit executée une seule fois et pas 2 fois d'affilée
        $(window).off('unload beforeunload');

        if (!ofp.__courseExited) {
            standard.quit()
                .then(function () {
                    ofp.__courseExited = true;
                });
        }
    });


    // cas clavier virtuel sur mobile, on replace la page
    $(window).on('focusout', function (e) {
        window.scrollTo(0, 0);
    });

    //--------------------------------------------------------------------------------------------
})(window, window.jQuery);
