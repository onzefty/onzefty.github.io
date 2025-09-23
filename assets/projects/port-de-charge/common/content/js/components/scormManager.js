(function (win) {
    // Properties
    // type - type de SCORM || "standard"
    // --> standard : set defaultBuildValues selon le nombre de fichiers du dataprovider
    // --> unique : set defaultBuildValues une fois, en ignorant le nombre de fichiers du dataprovider
    // --> question : set defaultBuildValues par 'question' dont le total est défini par totalDatasNumber
    // filesSeparator - séparateur utilisé entre les données par fichier (files) || *
    // defaultBuildValues - valeurs utilisées pour la construction du SCORM || [0,0,0]
    // Methods
    // getStatus - retourne le statut de la formation
    // setStatus (status) - définit le statut de la formation
    // getSuspendData - retourne le suspendData
    // save - enregistre et envoie le suspendata à la plateforme

    /**
     * Classe ScormManager
     * @class
     * @version 1.0.0
     * @property {object} ofp
     * @property {object} params
     * @property {string} type
     * @property {string} filesSeparator
     * @property {array} separators
     * @property {array} separators
     * @property {array} defaultBuildValue
     * @property {function} onSave
     * @property {string} suspendData
     * @property {string} status
     * @property {number} totalDatasNumber
     * @property {number} totalFilesNumber
     * @property {array} parsedDatas
     */

    function ScormManager(ofp,nbData) {
        this.params = ofp.getFromDataProvider('scorm') || {};
        this.type = this.params.type || 'standard';
        this.separators = this.params.separators || ['*',',', '#', '/', '|', '.'];;
        this.defaultBuildValues =
            this.params.defaultBuildValues != undefined
                ? this.params.defaultBuildValues
                : [0, 0, 0];
        this.onSave =
            this.params.onSave != undefined && typeof this.params.onSave == 'function'
                ? this.params.onSave.bind(this)
                : function () {};
        this.suspendData = null;
        this.status = null;
        this.totalDatasNumber = nbData || 1;
        this.totalFilesNumber = ofp.getFromDataProvider('files').filter(function (file) {
            return file.type === 'lesson';
        }).length;
        this.parsedDatas = [];

        this.updateScormData();
        this.parseSuspendData();
    }

    ScormManager.prototype = {
        updateScormData: function () {
            this.suspendData = this.getSuspendData();
            this.status = this.getStatus();
        },
        getStatus: function () {
            return ofp.getStatus();
        },
        getSuspendData: function () {
            return ofp.getSCOSuspendData();
        },
        setStatus: function (status) {
            ofp.setStatus(status);
            this.updateScormData();
        },
        setSuspendData: function (suspendData) {
            if (suspendData instanceof Array) {
                this.parsedDatas = suspendData;
                return this.buildSuspendData();
            }

            var promise = ofp.setSCOSuspendData(suspendData);

            this.updateScormData();
            this.parseSuspendData();

            return promise;
        },
        parseSuspendData: function () {
            var fileDatas = [];
            var fileDatasLength = 0;
            var i = 0;
            if (
                typeof this.suspendData === 'string' &&
                this.suspendData.trim() != '' &&
                this.suspendData.length != 0
            ) {
                switch (this.type) {
                    case 'question':
                    /*
                        var datas =
                            this.suspendData.indexOf(this.filesSeparator) > -1
                                ? this.suspendData.split(this.filesSeparator)
                                : [this.suspendData];
                        for (var i = 0; i < this.totalDatasNumber; i++) {
                            this.parsedDatas[i] = datas[i];
                        }
                        */
                        break;
                    case 'unique':
                        this.parsedDatas = this.stringToTab(this.suspendData, 0);
                        break;
                    default:
                        this.parsedDatas = this.stringToTab(this.suspendData, 0);
                        break;
                }
            } else {
                // Première fois
                // Création du tableau en fonction du type
                switch (this.type) {
                    case 'question':
                        for (var i = 0; i < this.totalDatasNumber; i++) {
                            this.parsedDatas[i] = this.defaultBuildValues.map(function (x) {
                                return x;
                            });
                        }
                        break;
                    case 'unique':
                        this.parsedDatas = this.defaultBuildValues.map(function (x) {
                            return x;
                        });
                        break;
                    default:
                        for(var f=1; f<=this.totalFilesNumber; f++){
                            this.parsedDatas[f-1] = this.defaultBuildValues.map(function (x) {
                                return x;
                            });    
                        }
                        break;
                }
                this.buildSuspendData();
            }

            return this.parsedDatas;
        },
        buildSuspendData: function () {
            var parsedDatasLength = this.parsedDatas.length;
            var s = '';

            switch (this.type) {
                case 'question':
                    for (var i = 0; i < parsedDatasLength; i++) {
                        s +=
                            i < parsedDatasLength - 1
                                ? this.parsedDatas[i] + this.filesSeparator
                                : this.parsedDatas[i];
                    }
                    break;
                case 'unique':
                    s = this.tabToString(this.parsedDatas,"",0);
                    break;
                default:
                    s = this.tabToString(this.parsedDatas,"",0);
                    break;
            }

            return this.setSuspendData(s);
        },
        save: throttle(save, 1000 * 60, false, true),
        tabToString: function (arr,s,index) {
            for(var a=1; a<=arr.length; a++){
                var el = arr[a-1];
                if(Array.isArray(el)){
                    s+= (a==arr.length) ? this.tabToString(arr[a-1],"",(index+1)) : this.tabToString(arr[a-1],"",(index+1))+(this.separators[index]);
                } else {
                    s+= (a==arr.length) ? el : el+(this.separators[index]);
                }
            }

            return s;
        },
        stringToTab: function (string,index) {
            var checkSeparators = function(string,sep){
                if(sep){
                    return string.indexOf(sep)!=-1;
                } else {
                    return (/\*|\,|\#|\/|\||\./g).test(string);
                }
            },
            intoArray = function(e,i){
                if(checkSeparators(e,this.separators[i])){
                    var arr2 = e.split(this.separators[i]);
                    for(var a=1; a<=arr2.length; a++){
                        var el=arr2[a-1];
                        if(checkSeparators(el,this.separators[(i+1)])){
                            arr2[a-1] = intoArray(el,(i+1));
                        }
                    }
                    return arr2;
                } else {
                    return e;
                }
            }.bind(this),
            arr = string.split(this.separators[index]);
            for(var t=1; t<=arr.length; t++){
                var ele = arr[t-1];
                if(checkSeparators(ele,this.separators[index+1])){
                    arr[t-1] = intoArray(ele,(index+1));
                }
            }
            return arr;
        }
    };

    function save(force) {
        force = force ? force : false;
        if (this.getStatus() != 'c' || force) {
            if (this.getStatus() == 'na') {
                this.setStatus('i');
            }
            //onSave present in the dataprovider
            //afin de pouvoir set d'autres éléments (score, interactions)
            this.onSave();
            this.buildSuspendData().then(
                function () {
                    ofp.save();
                }.bind(this)
            );
        }
    }
    /**
     * Retourne une fonction qui, tant qu'elle est appelée,
     * n'est exécutée au plus qu'une fois toutes les N millisecondes.
     * Paramètres :
     *  - func : la fonction à contrôler
     *  - wait : le nombre de millisecondes (période N) à attendre avant
     *           de pouvoir exécuter à nouveau la function func()
     *  - leading (optionnel) : Appeler également func() à la première
     *                          invocation (Faux par défaut)
     *  - trailing (optionnel) : Appeler également func() à la dernière
     *                           invocation (Faux par défaut)
     *  - context (optionnel) : le contexte dans lequel appeler func()
     *                          (this par défaut)
     */
    function throttle(func, wait, leading, trailing, context) {
        var ctx, args, result;
        var timeout = null;
        var previous = 0;
        var later = function () {
            previous = new Date();
            timeout = null;
            result = func.apply(ctx, args);
        };
        return function () {
            var now = new Date();
            if (!previous && !leading) previous = now;
            var remaining = wait - (now - previous);
            ctx = context || this;
            args = arguments;

            var executor = {
                execute: function execute() {
                    return func.apply(ctx, args);
                },
            };

            // Si la période d'attente est écoulée
            if (remaining <= 0) {
                // Réinitialiser les compteurs
                clearTimeout(timeout);
                timeout = null;
                // Enregistrer le moment du dernier appel
                previous = now;
                // Appeler la fonction
                result = func.apply(ctx, args);
            } else if (!timeout && trailing) {
                // Sinon on s’endort pendant le temps restant
                timeout = setTimeout(later, remaining);
            }
            return result || executor;
        };
    }

    win.ScormManager = ScormManager;
})(window);
