/**
 * Testeur de bande passante (seul la méthode de test de download est implémentée pour le moment, TODO : upload, latence...)
 */
(function (window) {
    'use strict';

    /**
     * @constructor
     * @param {Object} options Objet contenant l'URL du fichier à utiliser pour le download ET sa taille en octets
     */
    function Bandwidth(options) {
        var defaultOptions = {
            testFileUrl: './1mo.jpg',
            testFileSize: 1070583 // octets/bytes (=8 bits)
        };
        this.options = Object.assign(defaultOptions, options || {});
    }
    /**
     * @description Méthode de test de la bande passante en download
     * @return {Promise} Retourne une Promise avec un objet contenant les résultats avec différentes variables : délai (secondes), bits téléchargés, bits/s, kb/s, mb/s
     */
    Bandwidth.prototype.download = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            var startTime;
            var endTime;
            var img = new Image();
            img.onload = function () {
                endTime = (new Date()).getTime();
                var duration = (endTime - startTime) / 1000;
                var bitsLoaded = self.options.testFileSize * 8;
                var bps = round(bitsLoaded / duration);
                var kbps = round(bps / 1024);
                var mbps = round(kbps / 1024);
                var Ko = round(kbps / 8);
                var Mo = round(mbps / 8);
                resolve({
                    duration: duration,
                    bitsLoaded: bitsLoaded,
                    bps: bps,
                    kbps: kbps,
                    mbps: mbps,
                    Ko: Ko,
                    Mo: Mo
                });
            };
            img.onerror = reject;
            startTime = (new Date()).getTime();
            img.src = self.options.testFileUrl + '?t=' + startTime;
        });
    };
    window.Bandwidth = Bandwidth;

    function round(number, precision) {
        var p = Math.pow(10, precision || 2);
        return Math.round(number * p) / p;
    }
})(window);
