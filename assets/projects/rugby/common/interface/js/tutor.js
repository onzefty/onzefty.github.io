
function Tutor() {
    this.params = {
        mail: null,
        chat: null,
        visio: null
    };
}

Tutor.prototype = {
    init: function () {
        var self = this;
        $.ajax({
            type: 'GET',
            url: Tutor.PHP_TUTOR_URL,
            dataType: 'xml',
            success: function (response) {
                if (Utility.isDefined(response)) {
                    $(response).find('CONFIG BOUTON').each(function (index, xBouton) {
                        switch ($(xBouton).find('LABEL').text().toLowerCase()) {
                        case 'email':
                            self.params.mail = {
                                func: function () {
                                    var link = '/apprenant/formulaire.php?emailde=' + escape($(xBouton).find('PARAMS PARAM').text());
                                    window.open(link, 'EMAIL', 'width = 550,height = 321');
                                }
                            };
                            break;
                        case 'chat':
                            if (typeof (window.lpTag) === 'undefined') {
                                window.lpTag = window.lpTag || {}; if (typeof window.lpTag._tagCount === 'undefined') {window.lpTag = {site: '95053' || '', section: lpTag.section || '', autoStart: lpTag.autoStart === false ? false : true, ovr: lpTag.ovr || {}, _v: '1.6.0', _tagCount: 1, protocol: 'https:', events: {bind: function (app, ev, fn) {lpTag.defer(function () {lpTag.events.bind(app, ev, fn);}, 0);}, trigger: function (app, ev, json) {lpTag.defer(function () {lpTag.events.trigger(app, ev, json);}, 1);}}, defer: function (fn, fnType) {if (fnType  == 0) {this._defB = this._defB || [ ]; this._defB.push(fn);} else if (fnType  == 1) {this._defT = this._defT || []; this._defT.push(fn);} else {this._defL = this._defL || []; this._defL.push(fn);}}, load: function (src, chr, id) {var t = this; setTimeout(function () {t._load(src, chr, id);}, 0);}, _load: function (src, chr, id) {var url = src; if (!src) {url = this.protocol + '//' + ((this.ovr && this.ovr.domain) ? this.ovr.domain : 'lptag.liveperson.net') + '/tag/tag.js?site=' + this.site;} var s = document.createElement('script'); s.setAttribute('charset', chr ? chr : 'UTF-8'); if (id) {s.setAttribute('id', id);}s.setAttribute('src', url); document.getElementsByTagName('head').item(0).appendChild(s);}, init: function () {this._timing = this._timing || {}; this._timing.start = (new Date()).getTime(); var that = this; if (window.attachEvent) {window.attachEvent('onload', function () {that._domReady('domReady');});} else {window.addEventListener('DOMContentLoaded', function () {that._domReady('contReady');}, false); window.addEventListener('load', function () {that._domReady('domReady');}, false);} if (typeof (window._lptStop) === 'undefined') {this.load();}}, start: function () {this.autoStart = true;}, _domReady: function (n) {if (!this.isDom) {this.isDom = true; var el = document.createElement('div'); el.id = 'LP_DIV_1469450220152'; el.style.position = 'absolute'; el.style.display = 'none'; document.body.appendChild(el); this.events.trigger('LPT', 'DOM_READY', {t: n});} this._timing[n] = (new Date()).getTime();}, vars: lpTag.vars || [], dbs: lpTag.dbs || [], ctn: lpTag.ctn || [], sdes: lpTag.sdes || [], ev: lpTag.ev || [ ]}; lpTag.init();} else {window.lpTag._tagCount += 1;}
                                window.lpTag._domReady('domReady');
                            }
                            self.params.chat = {
                                func: function () {
                                    try {
                                        (function wait() {
                                            if (!document.getElementById('LP_DIV_1469450220152')
                                                || !document.getElementById('LP_DIV_1469450220152').firstChild) {
                                                setTimeout(wait, 100);
                                            } else {
                                                var el = document.getElementById('LP_DIV_1469450220152').firstChild;
                                                if (el && el.firstChild) {
                                                    el.firstChild.click();
                                                } else {
                                                    window.open('http://server.iad.liveperson.net/hc/95053/?cmd = file&file = visitorWantsToChat&site = 95053&referrer=' + window.document.location, 'chat95053', 'width = 472,height = 320');
                                                }
                                            }
                                        })();
                                    } catch (ex) {
                                        window.open('http://server.iad.liveperson.net/hc/95053/?cmd = file&file = visitorWantsToChat&site = 95053&referrer=' + window.document.location, 'chat95053', 'width = 472,height = 320');
                                    }
                                }
                            };
                            break;
                        case 'visio':
                            self.params.visio = {
                                func: function () {
                                    window.open('/visio/liste_tuteur_accessible.php', 'visiotuteur', 'scrollbars = no,width = 300px,height = 175px');
                                }
                            };
                            break;
                        default :
                        }
                    });
                }
            },
            error: function (error) {
                if (ofp.debug) {
                    console.log('Tutor.js :: init :: error with status', error.status, '- error object =>', error);
                }
            }
        });
    },
    getAvailableServices: function () {
        var services = []; var self = this;
        [ 'mail', 'chat', 'visio' ].forEach(function (element) {
            if (self.params[ element ] !== null) {
                services.push(element);
            }
        });
        return services;
    },
    callFunction: function (service) {
        if (this.params[ service ]) {
            if (typeof this.params[ service ].func === 'function') {
                this.params[ service ].func.call();
            }
        }
    },
    openMail: function () {
        this.callFunction('mail');
    },
    openChat: function () {
        this.callFunction('chat');
    },
    openVisio: function () {
        this.callFunction('visio');
    }
};

Tutor.PHP_TUTOR_URL = '/apprenant/tutorat.php';
