const SCORMSEPARATORS = ["*", "#", "/", "|", ".", ","];
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
// save - enregistre le suspendata (et autres données si précisées [progress, score, interactions, status])

/**
 * Classe InterfaceMediator
 * @class
 * @version 1.0.0
 * @property {object} scormInterface
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

export default class InterfaceMediator {
    #localComment = {};

    constructor(scormInterface, props = {}) {
        this.scormInterface = scormInterface;
        this.options = {
            separators: SCORMSEPARATORS,
            defaultBuildValues: SCORMDEFAULTBUILDVALUES,
            type: "standard",
            progress: false,
            success: false,
            score: false,
            totalDatasNumber: 1,
            isFileCompleted: () => false,
            allFilesCompleted: () => false,
            checkCoursePassed: () => false,
            ...props,
        };
        //this.lockIfCompleted = scormInterface.getFromDataProvider("config").normalization.lockIfCompleted;
        this.totalFilesNumber = scormInterface.fileDatas.filter((file) => file.type === "lesson").length;
        this.progress = this.scormInterface.scorm.progress;
        this.score = {
            value: this.scormInterface.scorm.score.raw,
            max: this.scormInterface.scorm.score.max,
        };
        this.score.scaled = Math.round(this.score.value / this.score.max);
        this.interactions = null;
        this.parsedDatas = [];
        this.init();
    }

    #getUpperScormInterface() {
        if (!this.scormInterface.upperInterface) {
            return this.scormInterface;
        }

        return this.scormInterface.upperInterface;
    }

    #getUpperScormManager() {
        return this.#getUpperScormInterface().scorm;
    }

    #getCommentKey() {
        const api = this.#getUpperScormManager().api;

        if (!api) {
            return;
        }

        if (api.version === "2004") {
            return "cmi.comments_from_learner.0.comment";
        }

        return "";
    }

    get suspendData() {
        return this.scormInterface.scorm.suspendData;
    }

    get status() {
        const { currentFile, fileDatas } = this.scormInterface;
        return fileDatas[currentFile.dataStoreID].status;
    }

    setStatus(status) {
        const scormInterface = this.#getUpperScormInterface();
        const { currentFile } = scormInterface;

        if (currentFile.status !== status) {
            if(status === "c"){
                return this.buildSuspendData().then(() => {
                    scormInterface.setFileStatus(currentFile.id, status);
                });
            } else {
                return scormInterface.setFileStatus(currentFile.id, status);
            }
        }
    }

    setSuspendData(suspendData) {
        if (suspendData instanceof Array) {
            this.parsedDatas = suspendData;
            return this.buildSuspendData();
        }
        return this.scormInterface.scorm.setSuspendData(suspendData).then(() => {
            this.parseSuspendData();
        });
    }
    parseSuspendData() {
        this.parsedDatas = stringToTab(this.suspendData, 0, this.options.separators);
    }
    buildSuspendData() {
        const parsedDatasLength = this.parsedDatas.length;
        let s = "";

        switch (this.options.type) {
            case "question":
                for (let i = 0; i < parsedDatasLength; i++) {
                    s += i < parsedDatasLength - 1 ? this.parsedDatas[i] + this.filesSeparator : this.parsedDatas[i];
                }
                break;
            case "unique":
                s = tabToString(this.parsedDatas, "", 0, this.options.separators);
                break;
            default:
                s = tabToString(this.parsedDatas, "", 0, this.options.separators);
                break;
        }

        return this.setSuspendData(s);
    }
    save(props = {}) {
        let { progress, score, interactions, status } = props;

        const { currentFile, fileDatas } = this.scormInterface;
        const file = fileDatas[currentFile.dataStoreID];

        if (file.status != "c" /*|| this.lockIfCompleted==false*/) {
            const scormSave = () => {
                //this.scormInterface.scorm.save();
            };

            const scormProgress = () => {
                if (this.options.progress === true && progress) {
                    const oldProgress = this.scormInterface.scorm.progress;
                    if (progress < oldProgress) {
                        progress = oldProgress;
                    }
                    this.scormInterface.scorm.setProgress(progress).then(scormStatus);
                } else {
                    scormStatus();
                }
            };

            const scormStatus = () => {
                if (!status) {
                    scormInteractions();
                    return;
                }
                if (this.options.isFileCompleted() === true && this.options.allFilesCompleted() === false) {
                    this.scormInterface.setFileStatus(currentFile.id, "c");
                    scormInteractions();
                } else if (this.options.allFilesCompleted() === true) {
                    this.scormInterface.setFileStatus(currentFile.id, "c");
                    this.scormInterface.scorm
                        .completeCourse()
                        .then(function () {
                            const condition = this.options.success
                                ? typeof this.options.score === "number"
                                    ? this.scormInterface.scorm.score.raw >= this.options.score
                                    : true
                                : false;
                            if (condition) {
                                return this.scormInterface.scorm.setSuccess();
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then(scormInteractions);
                } else if (typeof status === "string") {
                    this.scormInterface.setFileStatus(currentFile.id, status);
                    scormInteractions();
                }
            };

            const scormInteractions = () => {
                if (interactions != null) {
                    const promises = [];
                    const toSend = Array.isArray(interactions) ? interactions : [interactions];
                    toSend.forEach((interaction) => {
                        promises.push(this.scormInterface.scorm.setInteraction(interaction));
                    });
                    Promise.all(promises).then(() => {
                        scormSave();
                    });
                } else {
                    scormSave();
                }
            };

            return this.buildSuspendData().then(() => {
                if (this.options.score && score) {
                    this.scormInterface.scorm.setScore(score, score.max, true).then(scormProgress);
                } else {
                    scormProgress();
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    async setJSONComment(jsonData) {
        const scormManager = this.#getUpperScormManager();
        const api = scormManager.api;

        if (!api || (api.version === null && !api.connection.isActive)) {
            this.#localComment = jsonData;

            return true;
        }

        const key = this.#getCommentKey();
        let value = "";

        try {
            value = JSON.stringify(jsonData);
            value = value.trim();
        } catch (e) {
            throw new Error("Failed to set JSON comment due invalid value");
        }

        if (!value) {
            throw new Error("Failed to set JSON comment due empty value");
        }

        let setSucceed = false;

        if (!key) {
            setSucceed = await scormManager.setSuspendComment(value);
        } else {
            setSucceed = api.set(key, value);

            if (!setSucceed) {
                throw new Error("Failed to set JSON comment");
            }
        }

        const saveSucceed = api.save();

        if (!saveSucceed) {
            throw new Error("Failed to save JSON comment");
        }

        return true;
    }

    getJSONComment() {
        const defaultData = {};
        const scormManager = this.#getUpperScormManager();
        const api = scormManager.api;

        if (!api || (api.version === null && !api.connection.isActive)) {
            return this.#localComment;
        }

        const key = this.#getCommentKey();
        let jsonStr = "";

        if (!key) {
            jsonStr = scormManager.suspendComment;
        } else {
            jsonStr = api.get(key);
        }

        let jsonData = defaultData;

        if (!jsonStr || jsonStr === "null" || jsonStr === "undefined") {
            return jsonData;
        }

        try {
            jsonData = JSON.parse(jsonStr);
        } catch (e) {
            return defaultData;
        }

        return jsonData;
    }

    refresh() {
        this.parseSuspendData();
    }
    init() {
        const firstLaunch = !(
            typeof this.suspendData === "string" &&
            this.suspendData.trim() != "" &&
            this.suspendData.length != 0
        );

        if (firstLaunch === true) {
            switch (this.options.type) {
                case "question":
                    for (var i = 0; i < this.options.totalDatasNumber; i++) {
                        this.parsedDatas[i] = this.options.defaultBuildValues.map((x) => x);
                    }
                    break;
                case "unique":
                    this.parsedDatas = this.options.defaultBuildValues.map((x) => x);
                    break;
                default:
                    for (var f = 1; f <= this.totalFilesNumber; f++) {
                        this.parsedDatas[f - 1] = this.options.defaultBuildValues.map((x) => x);
                    }
                    break;
            }
            this.buildSuspendData();
        } else {
            this.parseSuspendData();
        }
    }
}

function tabToString(arr, s, index, separators) {
    for (let a = 1; a <= arr.length; a++) {
        var el = arr[a - 1];
        if (Array.isArray(el)) {
            s +=
                a == arr.length
                    ? tabToString(arr[a - 1], "", index + 1, separators)
                    : tabToString(arr[a - 1], "", index + 1, separators) + separators[index];
        } else {
            s += a == arr.length ? el : el + separators[index];
        }
    }

    return s;
}

function stringToTab(string, index, separators) {
    const checkSeparators = (string, sep) => {
        if (sep) {
            return string.indexOf(sep) != -1;
        } else {
            return /\*|\,|\#|\/|\||\./g.test(string);
        }
    };
    const intoArray = (e, i) => {
        if (checkSeparators(e, separators[i])) {
            var arr2 = e.split(separators[i]);
            for (var a = 1; a <= arr2.length; a++) {
                var el = arr2[a - 1];
                if (checkSeparators(el, separators[i + 1])) {
                    arr2[a - 1] = intoArray(el, i + 1);
                } else {
                    arr2[a-1] = parseFloat(el);
                }
            }
            return arr2;
        } else {
            return e;
        }
    };
    let arr = string.split(separators[index]);
    for (let t = 1; t <= arr.length; t++) {
        var ele = arr[t - 1];
        if (checkSeparators(ele, separators[index + 1])) {
            arr[t - 1] = intoArray(ele, index + 1);
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
