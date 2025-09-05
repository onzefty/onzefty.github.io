const SCORMSEPARATORS = ['*', '#', '/', '|', '.', ','];
const SCORMDEFAULTBUILDVALUES = [0, 0, 0];
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
 * @property {string} suspendData
 * @property {string} status
 * @property {number} totalDatasNumber
 * @property {number} totalFilesNumber
 * @property {array} parsedDatas
 */

export default class ScormManager {
    constructor(ofp,props = {}){
        this.ofp = ofp;
        this.options = {
            separators: SCORMSEPARATORS,
            defaultBuildValues: SCORMDEFAULTBUILDVALUES,
            type: 'standard',
            progress: false,
            success: false,
            score: false,
            totalDatasNumber: 1,
            isFileCompleted: () => false,
            allFilesCompleted: () => false,
            checkCoursePassed: () => false,
            ...props
        }
        this.lockIfCompleted = ofp.getFromDataProvider("config").normalization.lockIfCompleted;
        this.totalFilesNumber = ofp.getFromDataProvider('files').filter((file) => file.type === 'lesson').length;
        this.progress = this.ofp.getSCOProgress();
        this.score = {
            value:this.ofp.getRawScore(),
            max:this.ofp.getMaxScore()
        }
        this.score.scaled = Math.round(this.score.value/this.score.max);
        this.interactions = null;
        this.suspendData = null;
        this.status = null;
        this.parsedDatas = [];
        this.updateScormData();
        this.parseSuspendData();    
    }
    updateScormData() {
        this.suspendData = this.getSuspendData();
        this.status = this.getStatus();
    }
    getStatus() {
        return this.ofp.getStatus();
    }
    getSuspendData() {
        return this.ofp.getSCOSuspendData();
    }
    setStatus(status) {
        this.ofp.setStatus(status);
        this.updateScormData();
    }
    setSuspendData(suspendData) {
        if (suspendData instanceof Array) {
            this.parsedDatas = suspendData;
            return this.buildSuspendData();
        }

        var promise = this.ofp.setSCOSuspendData(suspendData);

        this.updateScormData();
        this.parseSuspendData();

        return promise;
    }
    parseSuspendData() {
        if (
            typeof this.suspendData === 'string' &&
            this.suspendData.trim() != '' &&
            this.suspendData.length != 0
        ) {
            switch (this.options.type) {
                case 'unique':
                    this.parsedDatas = stringToTab(this.suspendData, 0, this.options.separators);
                    break;
                default:
                    this.parsedDatas = stringToTab(this.suspendData, 0, this.options.separators);
                    break;
            }
        } else {
            // Première fois
            // Création du tableau en fonction du type
            switch (this.options.type) {
                case 'question':
                    for (var i = 0; i < this.options.totalDatasNumber; i++) {
                        this.parsedDatas[i] = this.options.defaultBuildValues.map((x) => x);
                    }
                    break;
                case 'unique':
                    this.parsedDatas = this.options.defaultBuildValues.map((x) => x);
                    break;
                default:
                    for(var f=1; f<=this.totalFilesNumber; f++){
                        this.parsedDatas[f-1] = this.options.defaultBuildValues.map((x) => x);   
                    }
                    break;
            }
            this.buildSuspendData();
        }

        return this.parsedDatas;
    }
    buildSuspendData() {
        var parsedDatasLength = this.parsedDatas.length;
        var s = '';

        switch (this.options.type) {
            case 'question':
                for (var i = 0; i < parsedDatasLength; i++) {
                    s +=
                        i < parsedDatasLength - 1
                            ? this.parsedDatas[i] + this.filesSeparator
                            : this.parsedDatas[i];
                }
                break;
            case 'unique':
                s = tabToString(this.parsedDatas,"",0,this.options.separators);
                break;
            default:
                s = tabToString(this.parsedDatas,"",0,this.options.separators);
                break;
        }

        return this.setSuspendData(s);
    }
    save(props = {}){
        let {progress,score,interactions, status} = props;

        if (this.getStatus() != 'c' || this.lockIfCompleted==false) {
            const scormSave = () => {
                this.ofp.save();
            }

            const scormProgress = () => {
                if (this.options.progress === true && progress) {
                    const oldProgress = this.ofp.getSCOProgress();
                    if(progress < oldProgress){
                        progress = oldProgress;
                    }
                    this.ofp.setSCOProgress(progress).then(scormStatus);
                } else {
                    scormStatus();
                }
            }

            const scormStatus = () => {
                if(!status){
                    scormInteractions();
                    return;
                }
                if (this.options.isFileCompleted() === true && this.options.allFilesCompleted() === false) {
                    this.ofp.setStatus("c");
                    scormInteractions();
                }
                else if (this.options.allFilesCompleted() === true) {
                    this.ofp.setStatus("c");
                    this.ofp.setCourseCompleted()
                        .then(function () {
                            const condition = this.options.success ? typeof this.options.score === "number" ? this.ofp.getRawScore()>=this.options.score : true : false
                            if (condition) {
                                return this.ofp.setCoursePassed();
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then(scormInteractions);
                }
                else if (typeof status === "string") {
                    this.ofp.setStatus(status);
                    scormInteractions();
                }
            }

            const scormInteractions = () => {
                if(interactions!=null){
                    const promises = [];
                    const toSend = Array.isArray(interactions) ? interactions : [interactions];
                    toSend.forEach((interaction) => {
                        //console.log(interaction);
                        promises.push(this.ofp.sendInteraction(interaction));
                    });
                    Promise.all(promises).then(() => {
                        scormSave();
                    });
                } else {
                    scormSave();
                }  
            }
    
            return this.buildSuspendData().then(() => {
                if (this.options.score && score) {
                    this.ofp.setScore(score, score.max, true).then(scormProgress);
                } else {
                    scormProgress();
                }
            });
        } else {
            return Promise.resolve();
        }
    }
}

function tabToString(arr,s,index,separators) {
    for(let a=1; a<=arr.length; a++){
        var el = arr[a-1];
        if(Array.isArray(el)){
            s+= (a==arr.length) ? tabToString(arr[a-1],"",(index+1),separators) : tabToString(arr[a-1],"",(index+1),separators)+(separators[index]);
        } else {
            s+= (a==arr.length) ? el : el+(separators[index]);
        }
    }

    return s;
}

function stringToTab(string,index,separators) {
    const checkSeparators = (string,sep) => {
        if(sep){
            return string.indexOf(sep)!=-1;
        } else {
            return (/\*|\,|\#|\/|\||\./g).test(string);
        }
    }
    const intoArray = (e,i) => {
        if(checkSeparators(e,separators[i])){
            var arr2 = e.split(separators[i]);
            for(var a=1; a<=arr2.length; a++){
                var el=arr2[a-1];
                if(checkSeparators(el,separators[(i+1)])){
                    arr2[a-1] = intoArray(el,(i+1));
                }
            }
            return arr2;
        } else {
            return e;
        }
    }
    let arr = string.split(separators[index]);
    for(let t=1; t<=arr.length; t++){
        var ele = arr[t-1];
        if(checkSeparators(ele,separators[index+1])){
            arr[t-1] = intoArray(ele,(index+1));
        }
    }
    return arr;
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
            executeexecute() {
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
