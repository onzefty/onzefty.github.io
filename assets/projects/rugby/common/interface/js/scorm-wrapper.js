'use strict';


/**
 * @class
 * @constructor
 */
function SCORMWrapper() {
    this._debug = false;
    this.api = pipwerks.SCORM;

    Object.defineProperty(this, 'debug', {
        get: function () {
            return this._debug;
        },
        set: function (value) {
            this._debug = value;
            pipwerks.debug.isActive = value;
        }
    });
}
// fix Function.name for IE10- / readonly otherwise
try { SCORMWrapper.name = 'SCORMWrapper'; } catch (e) {/**/}

/**
 * @method init
 * @description Initialize the SCORM API, try a second time if the first failed
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.init = function () {
    return new Promise(function (resolve) {
        // pas d'API SCORM disponible
        if (!this.api.API.getHandle()) {
            // eslint-disable-next-line
            console.error('scorm-wrapper.js :: No SCORM API found !');
            resolve(false);
        } else {
            if (!this.api.version
                /* && SCORMWrapper.utils.isRemoteSCORMContext() */) {
                // eslint-disable-next-line
                console.warn('scorm-wrapper.js :: The version of the SCORM API was manually set to "2004", '
                    + 'the value was "' + this.api.version + '".');
                this.api.version = '2004';
            }
            // Initialisation de l'API
            (function initAPI(attempts) {
                var attempt = attempts + 1;
                if (!this.api.init()) {
                    if (attempt < 2) {
                        window.setTimeout(initAPI.bind(this, attempt), 250);
                    } else {
                        // eslint-disable-next-line
                        console.error('scorm-wrapper.js :: SCORM ' + this.api.version + ' API init failed !');
                        resolve(false);
                    }
                } else {
                    this.setCMIExitSuspend();
                    resolve(true);
                }
            }).call(this, 0);
        }
    }.bind(this));
};


/**
 * @method save
 * @description Make a commit, try a second time if the first failed
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.save = function () {
    return new Promise(function (resolve) {
        (function commit(attempts) {
            var attempt = attempts + 1;
            var result = this.api.save();
            if (!result && attempt < 2) {
                window.setTimeout(commit.bind(this, attempt), 250);
            } else {
                resolve(result);
            }
        }).call(this, 0);
    }.bind(this));
};


/**
 * @method quit
 * @description Terminate the API connection (LMSFinish), try a second time if the first failed
 * @return {Promise<boolean>} Resolved with the command result
*/
SCORMWrapper.prototype.quit = function () {
    return new Promise(function (resolve) {
        if (this.api) {
            // fermeture de l'API
            (function quitAPI(attempts) {
                var attempt = attempts + 1;
                if (!this.api.quit()) {
                    if (attempt < 2) {
                        window.setTimeout(quitAPI.bind(this, attempt), 250);
                    } else {
                        // eslint-disable-next-line
                        console.error('scorm-wrapper.js :: SCORM ' + this.api.version + ' API quit failed !');
                        resolve(false);
                    }
                } else {
                    resolve(true); // finish OK
                }
            }).call(this, 0);
        } else {
            // eslint-disable-next-line
            console.error('scorm-wrapper.js :: No SCORM API or connection inactive !');
            resolve(false); // quitter sans API
        }
    }.bind(this));
};


/**
 * @method setCMIExitSuspend
 * @description Set "cmi.exit" to value "suspend" to prevent the loss of data on the LMS
 * @return {boolean}   Result of the set AND save operation success
 */
SCORMWrapper.prototype.setCMIExitSuspend = function () {
    var setResult = this.api.set(this.api.version === '1.2' ? 'cmi.core.exit' : 'cmi.exit', 'suspend');
    var saveResult = this.api.save();
    return setResult && saveResult;
};


/**
 * Used to get the user data
 * @method getUser
 * @return {Promise<object>} Resolved with a user object { id, name }
 */
SCORMWrapper.prototype.getUser = function () {
    var learnerId = this.api.get(this.api.version === '1.2' ? 'cmi.core.student_id' : 'cmi.learner_id');
    var learnerName = this.api.get(this.api.version === '1.2' ? 'cmi.core.student_name' : 'cmi.learner_name');
    return Promise.resolve({
        id: learnerId,
        name: learnerName
    });
};

/**
 * @method getCMILaunchData
 * @description Used to get the cmi launch data provided by the LMS (could be empty)
 * @return {Promise<string>} Resolved with a boolean
 */
SCORMWrapper.prototype.getCMILaunchData = function () {
    var launchData = this.api.get('cmi.launch_data');
    return Promise.resolve(launchData);
};


/**
 * @method isCompleted
 * @description Used to know if the course is completed or not
 * @return {Promise<boolean>} Resolved with a boolean
 */
SCORMWrapper.prototype.isCompleted = function () {
    var completed;
    switch (this.api.version) {
    case '1.2' :
        var lessonStatus = this.api.get('cmi.core.lesson_status');
        completed = lessonStatus === 'completed'
            || lessonStatus === 'passed'
            || lessonStatus === 'failed';
        break;
    case '2004' :
        var completionStatus = this.api.get('cmi.completion_status');
        // var success_status = this.api.get( 'cmi.success_status' );
        // completed = completion_status === 'completed'
        // || success_status ===  'passed'
        // || success_status ===  'failed';
        completed = completionStatus === 'completed';
        break;
    default :
        completed = false;
    }
    return Promise.resolve(completed);
};


/**
 * @method getCourseData
 * @description Retrieve the course data
 * @return {Promise<object>} Resolved with a data object. See parseCourseData
 */
SCORMWrapper.prototype.getCourseData = function () {
    var result = this.api.get('cmi.suspend_data');
    var parseddata = this.parseCourseData(result);
    return Promise.resolve(parseddata);
};


/**
 * @method setCourseData
 * @description Set course data
 * @param  {Object} data The course data. See parseCourseData
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseData = function (data) {
    var suspenddata = this.buildCourseData(data.course)
        + '+' + data.content
        + '$' + data.timeLeft
        + '@' + this.buildAssetsData(data.assets);
    var result = this.api.set('cmi.suspend_data', suspenddata);
    return Promise.resolve(result);
};


/**
 * @method getCourseLocation
 * @description Retrieve the course location
 * @return {Promise<number>} Resolved with the course location
 */
SCORMWrapper.prototype.getCourseLocation = function () {
    var locationVar = this.api.version === '1.2' ? 'cmi.core.lesson_location' : 'cmi.location';
    var location = Number.parseFloat(this.api.get(locationVar));
    if (Number.isNaN(location)) {
        location = 0;
    }
    return Promise.resolve(location);
};


/**
 * @method setCourseLocation
 * @description Set the course location
 * @param  {String|Number} data The course location
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseLocation = function (data) {
    var locationVar = this.api.version === '1.2' ? 'cmi.core.lesson_location' : 'cmi.location';
    var result = this.api.set(locationVar, data);
    return Promise.resolve(result);
};


/**
 * @method getCourseDuration
 * @description Retrieve the course duration
 * @return {Promise<number>} Resolved with the course duration
 */
SCORMWrapper.prototype.getCourseDuration = function () {
    var durationVar = this.api.version === '1.2' ? 'cmi.core.total_time' : 'cmi.total_time';
    var durationString = this.api.get(durationVar);
    var hours; var minutes; var seconds;
    if (this.api.version === '1.2') {
        var arr = durationString.split(':').map(function (stringValue) { return Number.parseFloat(stringValue); });
        hours =   arr[ 0 ] || 0;
        minutes = arr[ 1 ] || 0;
        seconds = arr[ 2 ] || 0;
    } else {
        durationString = durationString.replace('PT', '');
        var startIndex = durationString.indexOf('H');
        if (startIndex > -1) {
            hours = Number.parseFloat(durationString.substring(0, startIndex));
            startIndex += 1;
        } else {
            hours = startIndex = 0;
        }
        var index = durationString.indexOf('M');
        if (index > -1) {
            minutes = Number.parseFloat(durationString.substring(startIndex, durationString.indexOf('M')));
            index += 1;
        } else {
            minutes = index = 0;
        }
        seconds = durationString.indexOf('S') > -1 ? Number.parseFloat(durationString.substring(index, durationString.indexOf('S'))) : 0;
    }
    var duration = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
    return Promise.resolve(duration);
};


/**
 * @method setCourseDuration
 * @description Set the course duration
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseDuration = function () {
    var durationVar = this.api.version === '1.2' ? 'cmi.core.session_time' : 'cmi.session_time';
    var stringSessionTime = SCORMWrapper.utils.getStringSessionTime();
    if (this.api.version === '2004') {
        stringSessionTime = SCORMWrapper.utils.sessionTimeToScorm2004(stringSessionTime);
    }
    var result = this.api.set(durationVar, stringSessionTime);
    return Promise.resolve(result);
};


/**
 * @method getCourseProgress
 * @description Retrieve the course progress
 * @return {Promise<number>} Resolved with the course progress
 */
SCORMWrapper.prototype.getCourseProgress = function () {
    var result = 0;
    if (this.api.version === '2004') {
        result = Number.parseFloat(this.api.get('cmi.progress_measure'));
        if (Number.isNaN(result)) {
            result = 0;
        }
    } else {
        var status = this.api.get('cmi.core.lesson_status');
        if (status === 'incomplete') {
            result = 50;
        } else if (status === 'completed'
                    || status === 'passed'
                    || status === 'failed') {
            result = 100;
        }
    }
    return Promise.resolve(result);
};


/**
 * @method setCourseProgress
 * @description Set course progress
 * @param  {Number} data Progress between 0 and 100
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseProgress = function (data) {
    var result = true;
    if (this.api.version === '2004') {
        result = this.api.set('cmi.progress_measure', Number.parseFloat(data));
    }
    return Promise.resolve(result);
};


/**
 * @method getCourseScore
 * @description Retrieve the course score
 * @return {Promise<object>} Resolved with { min, max, raw, scaled }
 */
SCORMWrapper.prototype.getCourseScore = function () {
    var cmi = this.api.version === '1.2' ? 'cmi.core.score.' : 'cmi.score.';
    var scoreData = {};
    var variables = 'min max raw';
    if (this.api.version === '2004') {
        variables += ' scaled';
    }
    variables
        .split(' ')
        .forEach(function (varName) {
            var result = Number.parseFloat(this.api.get(cmi + varName));
            if (!Number.isNaN(result)) {
                scoreData[ varName ] = result;
            }
        }.bind(this));
    return Promise.resolve(scoreData);
};


/**
 * @method setCourseScore
 * @description Set the course score
 * @param  {Object} data  { min, max, raw, scaled } At least one property required
 * (!) IMPORTANT : the received data parameter has previously been processed by @see Standard.createMethodAdapter()
 * @return {Promise<boolean>}      Resolved with the commands global result
 */
SCORMWrapper.prototype.setCourseScore = function (data) {
    /**
	 * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
	 */
    var cmi = this.api.version === '1.2' ? 'cmi.core.score.' : 'cmi.score.';
    var finalResult = 	Object.keys(data).reduce(function (accumulator, varName) {
        if (varName === 'scaled' && this.api.version !== '2004') {
            return accumulator;
        }
        var result = this.api.set(cmi + varName, data[ varName ]);
        return accumulator && result;
    }.bind(this), true);
    return Promise.resolve(finalResult);
};


/**
 * @method setCourseStarted
 * @description Set the course status to 'incomplete'
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseStarted = function () {
    var completionVar = this.api.version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status';
    var result = this.api.set(completionVar, 'incomplete');
    SCORMWrapper.utils.updateInteractionTime();
    return Promise.resolve(result);
};


/**
 * @method setCourseCompleted
 * @description Set the course status to 'completed'
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseCompleted = function () {
    var completionVar = this.api.version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status';
    var result = this.api.set(completionVar, 'completed');
    return Promise.resolve(result);
};

/**
 * @method setCourseIncomplete
 * @description Set the course status to 'incomplete'
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseIncomplete = function () {
    var completionVar = this.api.version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status';
    var result = this.api.set(completionVar, 'incomplete');
    return Promise.resolve(result);
};

/**
 * @method setCoursePassed
 * @description Set the course status to 'passed'
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCoursePassed = function () {
    var successVar = this.api.version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.success_status';
    var result = this.api.set(successVar, 'passed');
    return Promise.resolve(result);
};

/**
 * @method setCourseFailed
 * @description Set the course status to 'failed'
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseFailed = function () {
    var successVar = this.api.version === '1.2' ? 'cmi.core.lesson_status' : 'cmi.success_status';
    var result = this.api.set(successVar, 'failed');
    return Promise.resolve(result);
};

/**
 * @method setCourseSuccessUnknown
 * @description Set the course success status to 'unknown' (SCORM 2004 only)
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setCourseSuccessUnknown = function () {
    var result = false;
    if (this.api && this.api.version === '2004') {
        result = this.api.set('cmi.success_status', 'unknown');
    }
    return Promise.resolve(result);
};


/**
 * @method sendInteraction
 * @description Send an interaction
 * @param  {Object} data { id, type, objectiveId, correctResponse, studentResponse, weighting, result, description }
 * (!) IMPORTANT : the received data parameter has previously been processed by @see Standard.createMethodAdapter()
 * @return {Promise<boolean>} Resolved with the commands global result
 */
SCORMWrapper.prototype.sendInteraction = function (data) {
    /**
	 * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
	 */
    var cmi = 'cmi.interactions.';
    var v2004 = this.api.version === '2004';
    var variables = 'id objectives.0.id time type correct_responses.0.pattern weighting student_response result latency';
    if (v2004) {
        variables = variables
            .replace(/time/, 'timestamp')
            .replace(/student_response/, 'learner_response')
            + ' description';
    } else {
        // le type d'interaction "other" n'existe pas en SCORM 1.2
        if (data.type === 'other') {
            data.type = 'performance';
        }
        // le résulat d'interaction "incorrect" n'existe pas en SCORM 1.2
        if (data.result === 'incorrect') {
            data.result = 'wrong';
        }
    }
    // si pas d'id objectif on n'envoie pas cette data pour éviter une erreur
    if (('' + data.objectiveId).trim().length === 0) {
        variables = variables.replace('objectives.0.id ', '');
    }
    var rawLatency = SCORMWrapper.utils.getInteractionLatency();
    var latency = SCORMWrapper.utils.sessionTimeToString(rawLatency);
    data.latency = v2004 ? SCORMWrapper.utils.sessionTimeToScorm2004(latency) : latency;

    var _matchDataName = function (name) {
        switch (name) {
        case 'objectives.0.id' : 			 return 'objectiveId';
        case 'correct_responses.0.pattern' : return 'correctResponse';
        case 'student_response' :
        case 'learner_response' :
            return 'studentResponse';
        default: return name;
        }
    };

    var	interactionIndex = Number.parseInt(this.api.get(cmi + '_count'), 10);

    /**
	 * state mode : we try to retrieve a potential previous
     * interaction index to keep only one interaction by id
	 */
    if (typeof data.id !== 'undefined') {
        var previousIndex = this.getInteractionIndexById(data.id);
        if (!Number.isNaN(previousIndex) && previousIndex >= 0) {
            interactionIndex = previousIndex;
        }
    }

    var finalResult = variables
        .split(' ')
        .reduce(function (accumulator, varName) {
            if (/time|timestamp/.test(varName)) {
                data[ varName ] = v2004 ? SCORMWrapper.utils.getISOStringDate() : SCORMWrapper.utils.getStringTime();
            }
            var dataVar = cmi  + interactionIndex + '.' + varName;
            var dataValue = data[ _matchDataName(varName) ];
            if (/id$/.test(varName)) {
                dataValue = (dataValue + '').trim();
            }
            var result = this.api.set(dataVar, dataValue);
            if (this.debug) {
                // eslint-disable-next-line
                console.log('scorm-wrapper.js :: SCORM ' + this.api.version + ' sendInteraction : ', dataVar, dataValue);
            }
            return accumulator && result;
        }.bind(this), true);
    return Promise.resolve(finalResult);
};


/**
 * @method sendObjective
 * @description Send an objective
 * @param  {Object} data  { id, scoreMin, scoreMax, scoreRaw, success_status, completion_status, progress_measure, description }
 * (!) IMPORTANT : the received data parameter has previously been processed by @see Standard.createMethodAdapter()
 * @return {Promise<boolean>}      Resolved with the commands global result
 */
SCORMWrapper.prototype.sendObjective = function (data) {
    /**
	 * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
	 */
    var cmi = 'cmi.objectives.';
    var v2004 = this.api.version === '2004';
    var variables = 'id score.min score.max score.raw status';
    if (v2004) {
        variables = variables
            .replace(/status/, '')
            + 'score.scaled success_status completion_status progress_measure description';
    } else {
        // pas de success_status et completion_status en SCORM 1.2
        data.status = data.success_status !== 'unknown' ? data.success_status : data.completion_status;
    }

    var _matchDataName = function (name) {
        switch (name) {
        case 'score.min' : 	  return 'scoreMin';
        case 'score.max' : 	  return 'scoreMax';
        case 'score.raw' : 	  return 'scoreRaw';
        case 'score.scaled' : return 'scoreScaled';
        default: return name;
        }
    };

    var	objectiveIndex = Number.parseInt(this.api.get(cmi + '_count'), 10);

    /**
	 * state mode : we try to retrieve a potential previous
     * objective index to keep only one objective by id
    */
    if (typeof data.id !== 'undefined') {
        var previousIndex = this.getObjectiveIndexById(data.id);
        if (!Number.isNaN(previousIndex) && previousIndex >= 0) {
            objectiveIndex = previousIndex;
        }
    }

    var finalResult = variables
        .split(' ')
        .reduce(function (accumulator, varName) {
            var dataVar = cmi  + objectiveIndex + '.' + varName;
            var dataValue = data[ _matchDataName(varName) ];
            if (varName === 'id') {
                dataValue = (dataValue + '').trim();
            }
            var result = this.api.set(dataVar, dataValue);
            if (this.debug) {
                // eslint-disable-next-line
                console.log('scorm-wrapper.js :: SCORM ' + this.api.version + ' sendObjective : ', dataVar, dataValue);
            }
            return accumulator && result;
        }.bind(this), true);
    return Promise.resolve(finalResult);
};


/**
 * @method getObjectives
 * @description Retrieve all objectives for the course
 * @return {Promise<array>} Resolved with an Array of Objects containing datas
 */
SCORMWrapper.prototype.getObjectives = function () {
    var cmi = 'cmi.objectives.';
    var v2004 = this.api.version === '2004';
    var variables = 'id score.min score.max score.raw status';
    if (v2004) {
        variables = variables
            .replace(/status/, '')
            + 'score.scaled success_status completion_status progress_measure description';
    }

    var _matchDataName = function (name) {
        switch (name) {
        case 'score.min' : 	  return 'scoreMin';
        case 'score.max' : 	  return 'scoreMax';
        case 'score.raw' : 	  return 'scoreRaw';
        case 'score.scaled' : return 'scoreScaled';
        default: return name;
        }
    };

    var	objectivesNumber = Number.parseInt(this.api.get(cmi + '_count'), 10);
    if (Number.isNaN(objectivesNumber) || objectivesNumber < 0) {
        objectivesNumber = 0;
    }
    var data = [];
    var i = 0;
    var objective;
    for (; i < objectivesNumber; i++) {
        objective = variables
            .split(' ')
            .reduce(function (accumulator, varName) {
                var result = this.api.get(cmi  + i + '.' + varName);
                accumulator[ _matchDataName(varName) ] = /score|progress/.test(varName)
                    ? Number.parseFloat(result)
                    : result;
                return accumulator;
            }.bind(this), {});
        data.push(objective);
    }
    return Promise.resolve(data);
};


/**
 * @method getInteractionIndexById
 * @description Retrieve the potential interaction index searching by id
 * @param  {Number|String} id The interaction id to search for
 * @return {Number} The interaction index or -1 if not found
 */
SCORMWrapper.prototype.getInteractionIndexById = function (id) {
    return this.getChildIndexById(id, 'cmi.interactions');
};

/**
 * @method getObjectiveIndexById
 * @description Retrieve the potential objective index searching by id
 * @param  {Number|String} id The objective id to search for
 * @return {Number} The objective index or -1 if not found
 */
SCORMWrapper.prototype.getObjectiveIndexById = function (id) {
    return this.getChildIndexById(id, 'cmi.objectives');
};

/**
 * @method getChildIndexById
 * @description Retrieve a potential existing child index searching by id
 * @param  {Number|String} id The id to search for
 * @param  {String} cmiVariable The SCORM cmi variable name to walk through
 * Ex: 'cmi.objectives' or 'cmi.interactions'
 * @return {Number} The index or -1 if not found
 */
SCORMWrapper.prototype.getChildIndexById = function (id, cmiVariable) {
    var	count = Number.parseInt(this.api.get(cmiVariable + '._count'), 10);
    var i = 0;
    for (; i < count; i += 1) {
        var currentId = this.api.get(cmiVariable + '.' + i + '.id');
        if (String(currentId) === String(id)) {
            return i;
        }
    }
    return -1;
};


/**
 * @method buildCourseData
 * @description Build a string from the data object to be used with the 'suspend_data' API variable
 * @param  {Array} items An array of items { id, status, score } all required
 * @return {String}	The string formatted data
 */
SCORMWrapper.prototype.buildCourseData = function (items) {
    var suspenddata = items.reduce(function (accumulator, item) {
        var itemdata = item.id + ':' + item.status + ':' + item.score;
        return accumulator === '' ? itemdata : accumulator + '-' + itemdata;
    }, '');
    return suspenddata;
};

/**
 * @method buildAssetsData
 * @description Build a string from the data object to be used with the 'suspend_data' API variable
 * @param  {Array} items An array of items { id, status } all required
 * @return {String}	The string formatted data
 */
SCORMWrapper.prototype.buildAssetsData = function (items) {
    var suspenddata = items.reduce(function (accumulator, item) {
        var itemdata = item.id + ':' + item.status;
        return accumulator === '' ? itemdata : accumulator + '-' + itemdata;
    }, '');
    return suspenddata;
};


/**
 * @method parseCourseData
 * @description Build an object from string data to reverse the 'suspend_data' variable to an object
 * @param  {String} data The 'suspend_data' variable from API
 * @return {Object}	The initial data object that has been saved
 */
SCORMWrapper.prototype.parseCourseData = function (data) {
    var workingData = window.decodeURIComponent(data);

    var assetsdata = [];
    if (workingData.indexOf('@') > -1) {
        var rawAssets = workingData.split('@').pop();
        assetsdata = rawAssets.split('-').map(function (rawdata) {
            var itemdata = rawdata.split(':');
            return {
                id: itemdata[ 0 ] || -1,
                status: itemdata[ 1 ] || 'na'
            };
        });
        workingData = workingData.split('@').shift();
    }

    var timeLeft = null;
    if (workingData.indexOf('$') > -1) {
        timeLeft = Number.parseFloat(workingData.split('$').pop());
        if (Number.isNaN(timeLeft)) { timeLeft = -1; }
        workingData = workingData.split('$').shift();
    }

    var contentdata = '';
    if (workingData.indexOf('+') > -1) {
        contentdata = workingData.split('+').pop();
        workingData = workingData.split('+').shift();
    }

    var coursedata = [];
    if (workingData.indexOf(':') > -1) {
        coursedata = workingData.split('-').map(function (rawdata) {
            var itemdata = rawdata.split(':');
            return {
                id: itemdata[ 0 ] || -1,
                status: itemdata[ 1 ] || 'na',
                score: itemdata[ 2 ] || 0
            };
        });
    }
    return {
        course: coursedata,
        assets: assetsdata,
        content: contentdata,
        timeLeft: timeLeft
    };
};


/**
 * @method getADLNavRequest
 * @description Get the 'adl.nav.request' value (SCORM 2004 only)
 * @return {Promise<string>} Resolved with the command result
 */
SCORMWrapper.prototype.getADLNavRequest = function () {
    var result = '_none_';
    if (this.api && this.api.version === '2004') {
        result = this.api.get('adl.nav.request');
    }
    return Promise.resolve(result);
};

/**
 * @method setADLNavRequest
 * @description Set the 'adl.nav.request' value (SCORM 2004 only)
 * @param {string} actionOrIdentifier An action or a SCO manifest item identifier to open
 * @return {Promise<boolean>} Resolved with the command result
 */
SCORMWrapper.prototype.setADLNavRequest = function (actionOrIdentifier) {
    var result = false;
    if (this.api && this.api.version === '2004') {
        var value;
        if (typeof actionOrIdentifier === 'string') {
            var simpleAction = 'continue previous exit exitAll abandon abandonAll suspendAll _none_'
                .split(' ')
                .indexOf(actionOrIdentifier) > -1;
            value = simpleAction
                ? actionOrIdentifier
                : '{target=' + actionOrIdentifier + '}choice';
        }
        if (value) {
            result = this.api.set('adl.nav.request', value);
        }
    }
    return Promise.resolve(result);
};

/**
 * @method getADLNavRequestValid
 * @description Get an 'adl.nav.request_valid' value (SCORM 2004 only)
 * @param {string} actionOrIdentifier An action or a SCO manifest item identifier to determine
 * if the navigation request will succeed.
 * @return {Promise<string>}  Resolved with the command result
 */
SCORMWrapper.prototype.getADLNavRequestValid = function (actionOrIdentifier) {
    var result = 'unknown';
    if (this.api && this.api.version === '2004') {
        var value;
        if (typeof actionOrIdentifier === 'string') {
            var simpleAction = /^(continue|previous)$/g.test(actionOrIdentifier.trim());
            value = simpleAction
                ? actionOrIdentifier.trim()
                : 'choice.{target=' + actionOrIdentifier + '}';
        }
        if (value) {
            result = this.api.get('adl.nav.request_valid.' + value);
        }
    }
    return Promise.resolve(result);
};


/**
 * @method getLearnerPreferenceLanguage
 * @description Get the 'langugage preference' value
 * @return {Promise<string>} Resolved with the command result
 */
SCORMWrapper.prototype.getLearnerPreferenceLanguage = function () {
    var result = '';
    if (this.api) {
        var varName = this.api.version === '2004'
            ? 'learner'
            : 'student';
        result = this.api.get('cmi.' + varName + '_preference.language');
    }
    return Promise.resolve(result);
};

/**
 * @method setLearnerPreferenceLanguage
 * @description Get the 'langugage preference' value
 * @param {string} value The langage code
 * @return {Promise<string>} Resolved with the command result
 */
SCORMWrapper.prototype.setLearnerPreferenceLanguage = function (value) {
    var result = true;
    if (this.api) {
        var varName = this.api.version === '2004'
            ? 'learner'
            : 'student';
        result = this.api.set('cmi.' + varName + '_preference.language', value);
    }
    return Promise.resolve(result);
};


/**
 * @method appendExerciceTime
 * @description Custom onlineformapro API function to store
 * an exercice asset duration to append to the session time
 * @param {number} minutes Number of minutes
 * @return {Promise}  Always resolved
 */
SCORMWrapper.prototype.appendExerciceTime = function (minutes) {
    if (this.api
        && this.api.API
        && this.api.API.getHandle()) {
        var api = this.api.API.getHandle();
        if (typeof api.AppendExerciceTime === 'function') {
            // eslint-disable-next-line new-cap
            api.AppendExerciceTime(minutes);
        }
    }
    return Promise.resolve();
};

/**
 * Utils
 */
SCORMWrapper.utils = {};

SCORMWrapper.utils._initializationTime = new Date().getTime();
SCORMWrapper.utils.getSessionTime = function () {
    return new Date().getTime() - this._initializationTime;
};

SCORMWrapper.utils._interactionTime = new Date().getTime();
SCORMWrapper.utils.getInteractionLatency = function () {
    var latency = new Date().getTime() - this._interactionTime;
    this.updateInteractionTime();
    return latency;
};
SCORMWrapper.utils.updateInteractionTime = function () {
    this._interactionTime = new Date().getTime();
};

SCORMWrapper.utils.getStringSessionTime = function () {
    return this.sessionTimeToString(this.getSessionTime());
};

SCORMWrapper.utils.sessionTimeToString = function (sessionTime) {
    var st = sessionTime;
    var hours = Math.floor(st / 3600000);
    if (hours < 0) { hours = 0; }
    st %= 3600000;

    var dmin = Math.floor(st / 600000);
    st %= 600000;

    var min = Math.floor(st / 60000);
    st %= 60000;

    var dsec = Math.floor(st / 10000);
    st %= 10000;

    var sec = Math.floor(st / 1000);
    var sHours = hours < 9 ? '0' + String(hours) : String(hours);
    return sHours + ':' + dmin + min + ':' + dsec + sec;
};

SCORMWrapper.utils.milliSecondsToSCORM2004Time = function (intTotalMilliseconds) {
    var ScormTime = '';

    var HundredthsOfASecond;	// decrementing counter - work at the hundreths of a second level because that is all the precision that is required

    var Seconds;	// 100 hundreths of a seconds
    var Minutes;	// 60 seconds
    var Hours;		// 60 minutes
    var Days;		// 24 hours
    var Months;		// assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
    var Years;		// assumed to be 12 "average" months

    var HUNDREDTHS_PER_SECOND = 100;
    var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
    var HUNDREDTHS_PER_HOUR   = HUNDREDTHS_PER_MINUTE * 60;
    var HUNDREDTHS_PER_DAY    = HUNDREDTHS_PER_HOUR * 24;
    var HUNDREDTHS_PER_MONTH  = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48);
    var HUNDREDTHS_PER_YEAR   = HUNDREDTHS_PER_MONTH * 12;

    HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);

    Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
    HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);

    Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
    HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);

    Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
    HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);

    Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
    HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);

    Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
    HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);

    Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
    HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);

    if (Years > 0) {
        ScormTime += Years + 'Y';
    }
    if (Months > 0) {
        ScormTime += Months + 'M';
    }
    if (Days > 0) {
        ScormTime += Days + 'D';
    }

    // check to see if we have any time before adding the "T"
    if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0) {
        ScormTime += 'T';

        if (Hours > 0) {
            ScormTime += Hours + 'H';
        }

        if (Minutes > 0) {
            ScormTime += Minutes + 'M';
        }

        if ((HundredthsOfASecond + Seconds) > 0) {
            ScormTime += Seconds;

            if (HundredthsOfASecond > 0) {
                ScormTime += '.' + HundredthsOfASecond;
            }

            ScormTime += 'S';
        }
    }

    if (ScormTime === '') {
        ScormTime = '0S';
    }

    ScormTime = 'P' + ScormTime;

    return ScormTime;
};

SCORMWrapper.utils.sessionTimeToScorm2004 = function (stringSessionTime) {
    var aSessionTime = stringSessionTime.split(':');
    var sTimeHour = Number.parseInt(aSessionTime[0], 10);
    return 'PT' + (sTimeHour < 1000 ? '0' : '') + (sTimeHour < 100 ? '0' : '') + aSessionTime[0] + 'H' + aSessionTime[1] + 'M' + aSessionTime[2] + 'S';
};

SCORMWrapper.utils.getUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
    );
};

SCORMWrapper.utils.getStringTime = function () {
    var pad = function (number) {
        return (number < 10 ? '0' : '') + number;
    };
    var date = new Date();
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
};

SCORMWrapper.utils.getISOStringDate = function () {
    var isoString = new Date().toISOString();
    var ms = isoString.split('.').pop();
    return isoString.replace(ms, ms.substring(0, 1) + 'Z');
};

SCORMWrapper.utils.round = function (number, precision) {
    var coefficient = Math.pow(10, precision || 2);
    return Math.round(number * coefficient) / coefficient;
};

SCORMWrapper.utils.isRemoteSCORMContext = function (win) {
    var targetedWindow = win || window;
    try {
        return typeof targetedWindow.ofp_waitForDistantSCORMAPI !== 'undefined'
            && targetedWindow.ofp_waitForDistantSCORMAPI;
    } catch (error) {
        return false;
    }
};
