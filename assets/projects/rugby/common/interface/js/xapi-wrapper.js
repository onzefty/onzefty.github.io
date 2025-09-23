'use strict';


/**
 * @class
 * @constructor
 */
function XAPIWrapper() {
    this._debug = false;
    this.enabled = false;
    this.tincan = null;

    this.course_data = null;

    Object.defineProperty(this, 'debug', {
        get: function () {
            return this._debug;
        },
        set: function (value) {
            this._debug = value;
            TinCan.DEBUG = value;
        }
    });
}
// fix Function.name for IE10- / readonly otherwise
try { XAPIWrapper.name = 'XAPIWrapper'; } catch (e) {/**/}


/**
* Initialize TinCan
* @method init
* @return {Promise} Resolved with the enabled property
*/
XAPIWrapper.prototype.init = function () {
    return new Promise(function (resolve) {
        this.tincan = new TinCan({
            url: window.location.href
        });
        this.enabled = this.tincan.recordStores.length > 0;
        if (!this.enabled) {
            // eslint-disable-next-line
            console.error('xapi-wrapper.js :: xAPI disabled, TinCan recordStores empty !');
            resolve(this.enabled);
        } else {
            this.getCourseDuration()
                .then(function (/* duration*/) {
                    resolve(this.enabled);
                });
        }
    }.bind(this));
};


/**
* For compatibility with the SCORM wrapper
* @method save
* @return {Promise} Always resolved with true
*/
XAPIWrapper.prototype.save = function () {
    return Promise.resolve(true);
};


/**
* Send exit statement(s) synchronously
* @method quit
* @return {Promise} Resolved when requests are done
*/
XAPIWrapper.prototype.quit = function () {
// ATTENTION : cette fonction est volontairement écrite de façon à
// être synchrone pour permettre aux requêtes de s'executer même si
// la fonction est appelée dans un handler d'event beforeunload/unload
// la promise ne sera resolved qu'une fois les requêtes terminées
    var result = this.tincan.getStatements({
        // on veut les statements de l'activity et actor en cours uniquement
        sendActor: true,
        sendActivity: true
    });
    if (!result.err) {
        // sans modification des paramètres de la requête ( voir getStatements dans TinCan ) les statements
        // sont renvoyés par ordre chronologique descendant ( les derniers envois en premier ) donc on veut
        // prendre le premier statement trouvé dans le tableau ( s'il y en a un ) pour connaître le dernier
        // statut de completion envoyé (le statut de la course peut changer et redevenir non complété)
        var completionStatement = result.statementsResult.statements ? result.statementsResult.statements.find(function (statement) {
            return Object.prototype.hasOwnProperty.call(statement, 'result')
                && statement.result
                && Object.prototype.hasOwnProperty.call(statement.result, 'completion')
                && typeof statement.result.completion === 'boolean';
        }) : null;
    }
    var completed = completionStatement ? completionStatement.result.completion : false;
    // si la course n'est pas completed on envoie un statement "suspended"
    var statements = completed ? [] : [ this.createStatement('suspended') ];
    // dans tous les cas on envoie un statement "exited"
    statements.push(this.createStatement('exited'));
    // envoi du/des statements de façon synchrone
    this.sendStatementsSync(statements);
    return Promise.resolve();
};


/**
* Used to get the Actor data
* @method getUser
* @return {Promise} Resolved with a user object
*/
XAPIWrapper.prototype.getUser = function () {
    var actor = this.tincan.actor;
    return Promise.resolve({
        id: actor.account.name, // ?
        name: actor.name,
        account: actor.account
    });
};


/**
* Used to know if the course is completed or not
* @method isActivityCompleted
* @return {Promise} Resolved with a boolean
*/
XAPIWrapper.prototype.isActivityCompleted = function () {
    return new Promise(function (resolve, reject) {
        this.tincan.getStatements({
            // on veut les statements de l'activity et actor en cours uniquement
            sendActor: true,
            sendActivity: true,
            callback: function (error, result) {
                if (error !== null) {
                    reject(error);
                } else {
                    // sans modification des paramètres de la requête ( @see getStatements dans TinCan ) les statements
                    // sont renvoyés par ordre chronologique descendant ( les derniers envois en premier ) donc on veut
                    // prendre le premier statement trouvé dans le tableau ( s'il y en a un ) pour connaître le dernier
                    // statut de completion envoyé (le statut de la course peut changer et redevenir non complété)
                    var completionStatement = null;
                    if (Object.prototype.hasOwnProperty.call(result, 'statements') && Array.isArray(result.statements)) {
                        completionStatement = result.statements.find(function (statement) {
                            return Object.prototype.hasOwnProperty.call(statement, 'result')
                                && statement.result
                                && Object.prototype.hasOwnProperty.call(statement.result, 'completion')
                                && typeof statement.result.completion === 'boolean';
                        });
                    }
                    resolve(completionStatement ? completionStatement.result.completion : false);
                }
            }
        });
    }.bind(this));
};
XAPIWrapper.prototype.isCompleted = XAPIWrapper.prototype.isActivityCompleted;


/**
* Retrieve the course data on the LRS or in the local cache if defined
* @method getCourseData
* @return {Promise} Resolved with a data object. @see XAPIWrapper.DEFAULT_COURSE_DATA
*/
XAPIWrapper.prototype.getCourseData = function () {
    if (this.course_data) {
        return Promise.resolve(this.course_data);
    }
    return this.getState('course_data')
        .then(function (courseData) {
            var defaultData = Object.assign({}, XAPIWrapper.DEFAULT_COURSE_DATA);
            this.course_data = Object.assign(defaultData, this.course_data, courseData);
            return this.course_data;
        }.bind(this));
};

/**
* Set course data in the local cache and on the LRS
* @method setCourseData
* @param  {Object} data  The course data. @see XAPIWrapper.DEFAULT_COURSE_DATA
* @return {Promise} Resolved with data (object).
*/
XAPIWrapper.prototype.setCourseData = function (data) {
    this.course_data = Object.assign(this.course_data || {}, data);
    return this.setState('course_data', this.course_data);
};


/**
* Retrieve the course location on the LRS or in the local cache if defined
* @method setCourseLocation
* @return {Promise} Resolved with the course location
*/
XAPIWrapper.prototype.getCourseLocation = function () {
    if (this.course_data) {
        return Promise.resolve(this.course_data.location);
    }
    return this.getState('course_data')
        .then(function (courseData) {
            this.course_data = Object.assign({ location: 0 }, this.course_data, courseData);
            return this.course_data.location;
        }.bind(this));
};


/**
* Set the course location
* @method setCourseLocation
* @param  {Any} data The course location
* @return {Promise} Resolved with the setState result
*/
XAPIWrapper.prototype.setCourseLocation = function (data) {
    this.course_data = Object.assign(this.course_data || {}, { location: data });
    return this.setState('course_data',  this.course_data);
};


/**
* Retrieve the course duration on the LRS or in the local cache if defined
* @method getCourseDuration
* @return {Promise} Resolved with the course duration
*/
XAPIWrapper.prototype.getCourseDuration = function () {
    if (this.course_data) {
        return Promise.resolve(this.course_data.duration);
    }
    return this.getState('course_data')
        .then(function (courseData) {
            this.course_data = Object.assign({ duration: 0 }, this.course_data, courseData);
            return this.course_data.duration;
        }.bind(this));
};


/**
* Set the course duration
* @method setCourseDuration
* @return {Promise} Resolved with the setState result
*/
XAPIWrapper.prototype.setCourseDuration = function () {
    this.course_data = Object.assign(this.course_data || {}, { duration: this.getTotalDuration() });
    XAPIWrapper.utils._initializationTime = new Date().getTime();
    return this.setState('course_data',  this.course_data);
};


/**
* Retrieve the course progress on the LRS or in the local cache if defined
* @method getCourseDuration
* @return {Promise} Resolved with the course progress
*/
XAPIWrapper.prototype.getCourseProgress = function () {
    if (this.course_data) {
        return Promise.resolve(this.course_data.progress);
    }
    return this.getState('course_data')
        .then(function (courseData) {
            this.course_data = Object.assign({ progress: 0 }, this.course_data, courseData);
            return this.course_data.progress;
        }.bind(this));
};


/**
* Set course progress
* @method setCourseProgress
* @param  {Number} data  Progress between 0 and 100
* @return {Promise}      Resolved with the setState and sendStatement result
*/
XAPIWrapper.prototype.setCourseProgress = function (data) {
    this.course_data = Object.assign(this.course_data || {}, { progress: data });
    return Promise.all([
        this.setState('course_data',  this.course_data),
        this.sendStatement(this.createStatement('progressed',  data))
    ]);
};


/**
* Retrieve the course score on the LRS or in the local cache if defined
* @method getCourseScore
* @return {Promise} Resolved with data { min, max, raw, scaled } At least one property
*/
XAPIWrapper.prototype.getCourseScore = function () {
    if (this.course_data) {
        return Promise.resolve(this.course_data.score);
    }
    return this.getState('course_data')
        .then(function (courseData) {
            this.course_data = Object.assign({ score: {} }, this.course_data, courseData);
            return this.course_data.score;
        }.bind(this));
};


/**
* set the course score
* @method setCourseScore
* @param  {Object} data  { min, max, raw, scaled } At least one property required
* @return {Promise}      Resolved with the setState and sendStatement result
*/
XAPIWrapper.prototype.setCourseScore = function (data) {
    /**
    * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
    */
    this.course_data = Object.assign(this.course_data || {}, { score: data });
    return Promise.all([
        this.setState('course_data',  this.course_data),
        this.sendStatement(this.createStatement('scored',  data))
    ]);
};


/**
* Used to know if the course has been initialized (internal use : not exposed in Standard)
* @method isCourseInitialized
* @return {Promise} Resolved with boolean
*/
XAPIWrapper.prototype.isCourseInitialized = function () {
    return this.getState('course_data')
        .then(function (courseData) {
            return courseData !== null;
        });
};


/**
* Send a statement 'resumed' or 'initialized' depending on the course initialized status
* @method setCourseStarted
* @return {Promise} Resolved with the sendStatement result
*/
XAPIWrapper.prototype.setCourseStarted = function () {
    XAPIWrapper.utils.updateInteractionTime();
    return this.isCourseInitialized()
        .then(function (initialized) {
            var statement = initialized ? 'resumed' : 'initialized';
            return this.sendStatement(this.createStatement(statement));
        }.bind(this));
};


/**
* Send the statements 'completed' and 'terminated'
* @method setCourseCompleted
* @return {Promise} Resolved with the sendStatements result
*/
XAPIWrapper.prototype.setCourseCompleted = function () {
    return this.sendStatements([
        this.createStatement('completed'),
        this.createStatement('terminated')
    ]);
};


/**
* Send a statement 'passed'
* @method setCoursePassed
* @return {Promise} Resolved with the sendStatement result
*/
XAPIWrapper.prototype.setCoursePassed = function () {
    return this.sendStatement(this.createStatement('passed'));
};

/**
* Send a statement 'failed'
* @method setCourseFailed
* @return {Promise} Resolved with the sendStatement result
*/
XAPIWrapper.prototype.setCourseFailed = function () {
    return this.sendStatement(this.createStatement('failed'));
};


/**
* Send an interaction
* @method sendInteraction
* @param  {Object} data  { id, type, objectiveId, correctResponse, studentResponse, weighting, result, description }
* @return {Promise} Resolved with the sendStatement result
*/
XAPIWrapper.prototype.sendInteraction = function (data) {
    /**
    * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
    */
    return this.sendStatement(this.createStatement('answered',  data));
};


/**
* Send an objective
* @method sendObjective
* @param  {Object} data  { id, scoreMin, scoreMax, scoreRaw, success_status, completion_status, progress_measure, description }
* @return {Promise} Resolved with the sendStatement result
*/
XAPIWrapper.prototype.sendObjective = function (data) {
    /**
    * ATTENTION le paramètre "data" reçu ici a été traité par Standard.createMethodAdapter()
    */
    return this.sendStatement(this.createObjectiveStatement(data));
};


/**
* Retrieve all objectives for the course
* @method getObjectives
* @return {Promise}      Resolved with an Array of Objects containing datas
*/
XAPIWrapper.prototype.getObjectives = function () {
    return new Promise(function (resolve, reject) {
        this.tincan.getStatements({
            // on veut les statements de l'actor en cours uniquement
            sendActor: true,
            sendActivity: false,	// false sinon les statements d'objectifs ne sont pas renvoyés car un objectif est une Activity en xAPI
            callback: function (error, result) {
                if (error !== null) {
                    reject(error);
                } else {
                    // sans modification des paramètres de la requête ( voir getStatements dans TinCan ) les statements
                    // sont renvoyés par ordre chronologique descendant ( les derniers envois en premier )
                    var objectiveStatements = result.statements.filter(function (statement) {
                        return Object.prototype.hasOwnProperty.call(statement, 'target')
                            && statement.target
                            && Object.prototype.hasOwnProperty.call(statement.target, 'definition')
                            && statement.target.definition
                            && Object.prototype.hasOwnProperty.call(statement.target.definition, 'type')
                            && statement.target.definition.type === XAPIWrapper.activities.objective
                            && Object.prototype.hasOwnProperty.call(statement.target, 'id');
                    });
                    var lastObjectivesStatements = [];
                    var progressExtensionId = XAPIWrapper.extensions.progress.id;
                    objectiveStatements.forEach(function (statement) {
                        if (!(lastObjectivesStatements.find(function (statementDataObject) { return statementDataObject.id === statement.target.id; }))) {
                            var objective = {
                                id: statement.target.id,
                                scoreMin: statement.result.score.min,
                                scoreMax: statement.result.score.max,
                                scoreRaw: statement.result.score.raw,
                                success_status: /passed|failed/g.test('' + statement.verb.id)
                                    ? (/passed/g.test('' + statement.verb.id)
                                        ? 'passed'
                                        : 'failed')
                                    : 'unknown',
                                completion_status: /completed/g.test('' + statement.verb.id)
                                    ? 'completed'
                                    : Object.prototype.hasOwnProperty.call(statement.result, 'completion')
                                        ?  statement.result.completion === true
                                            ? 'completed'
                                            : 'incomplete'
                                        : 'unknown',
                                progress_measure: Object.prototype.hasOwnProperty.call(statement.result, 'extensions')
                                    && typeof statement.result.extensions[ progressExtensionId ] === 'number'
                                    ? statement.result.extensions[ progressExtensionId ]
                                    : 0,
                                description: statement.target.definition.description
                            };
                            // attention il peut arriver que les derniers objectifs enregistrés ne soit pas les derniers objectifs envoyés
                            // donc on ne va push dans notre tableau que le dernier objectif considéré comme "complété" pour chaque id
                            var objectiveCompleted = Object.prototype.hasOwnProperty.call(objective, 'progress_measure') && objective.progress_measure >= 1
                                || Object.prototype.hasOwnProperty.call(objective, 'completion_status') && objective.completion_status === 'completed'
                                || Object.prototype.hasOwnProperty.call(objective, 'success_status') 	&& /passed|failed/g.test(objective.success_status);
                            if (objectiveCompleted) {
                                lastObjectivesStatements.push(objective);
                            }
                        }
                    });
                    resolve(lastObjectivesStatements);
                }
            }
        });
    }.bind(this));
};


/**
* Get a state on the LRS using his name
* @method getState
* @param  {String} name  The state name
* @return {Promise}      Resolved with null (if no data found) or the result.contents
*/
XAPIWrapper.prototype.getState = function (name) {
    return new Promise(function (resolve, reject) {
        this.tincan.getState(name, {
            callback: function (error, result) {
                if (error !== null) {
                    reject(error);
                } else {
                    if (result
                        && Object.prototype.hasOwnProperty.call(result, 'contents')) {
                        resolve(result.contents);
                    } else {
                        // result could be null if no data
                        resolve(result);
                    }
                }
            }
        });
    }.bind(this));
};


/**
* Set a state on the LRS
* @method setState
* @param  {String} name The state name
* @param  {Any} data  The data associated with the state
* @return {Promise} Resolved with true or rejected with error
*/
XAPIWrapper.prototype.setState = function (name, data) {
    return new Promise(function (resolve, reject) {
        this.tincan.setState(name, data, {
            contentType: 'application/json',
            overwriteJSON: false,
            callback: function (error /* , xhr */) {
                if (error !== null) {
                    reject(error);
                } else {
                    resolve(true);
                }
            }
        });
    }.bind(this));
};

/**
* Send multiple statements to LRS(s)
* @method sendStatements
* @param   {Array} statements 	Array of statements object
* @return	{Promise} 			Resolved with statements response
*/
XAPIWrapper.prototype.sendStatements = function (statements) {
    return new Promise(function (resolve, reject) {
        this.tincan.sendStatements(statements, function (results, statementResponse) {
            var rests = results || { err: new Error('sendStatements : No results in response !'), xhr: null };
            if (rests.err) {
                reject(rests.err);
            } else {
                resolve(statementResponse);
            }
        });
    }.bind(this));
};

/**
* Synchronous request to send multiple statements to LRS(s)
* @method sendStatementsSync
* @param {Array} statements Array of statements object
* @return {Undefined} No return
*/
XAPIWrapper.prototype.sendStatementsSync = function (statements) {
    this.tincan.sendStatements(statements);
};


/**
* Send a statement to LRS(s)
* @method sendStatement
* @param  {Object} statement A statement object
* @return {Promise} Resolved with statement response
*/
XAPIWrapper.prototype.sendStatement = function (statement) {
    return new Promise(function (resolve, reject) {
        this.tincan.sendStatement(statement, function (results, statementResponse) {
            var rests = results || { err: new Error('sendStatement : No results in response !'), xhr: null };
            if (rests.err) {
                reject(rests.err);
            } else {
                resolve(statementResponse);
            }
        });
    }.bind(this));
};


/**
* Build a formatted Statement object
* @method createStatement
* @param  {string} 	name Match name of the verb to create statement
* @param  {null/Any} 	data Data associated with the statement
* @return {Object}    The formatted statement object
*/
XAPIWrapper.prototype.createStatement = function (name, data) {
    var statement = {
        context: {}
    };

    switch (name) {
    case 'initialized' :
        statement.verb = XAPIWrapper.verbs.initialized;
        statement.result = {
            completion: false,
            duration: 'PT0S'
        };
        break;
    case 'suspended' :
        statement.verb = XAPIWrapper.verbs.suspended;
        statement.result = {
            duration: TinCan.Utils.convertMillisecondsToISO8601Duration(this.getTotalDuration())
        };
        break;
    case 'resumed' :
        statement.verb = XAPIWrapper.verbs.resumed;
        break;
    case 'progressed' :
        statement.verb = XAPIWrapper.verbs.progressed;
        statement.result = {
            // extensions: {
            //   [ XAPIWrapper.extensions.progress.id ]: data || 0 // percent [0-100]
            // }
            extensions: (function () {
                var extensions = {};
                extensions[ XAPIWrapper.extensions.progress.id ] = data || 0; // percent [0-100]
                return extensions;
            })()
        };
        break;
    case 'scored' :
        statement.verb = XAPIWrapper.verbs.scored;
        statement.result = {
            score: data
        };
        break;
    case 'completed' :
        statement.verb = XAPIWrapper.verbs.completed;
        statement.result = {
            completion: true,
            duration: TinCan.Utils.convertMillisecondsToISO8601Duration(this.getTotalDuration())
        };
        break;
    case 'passed' :
        statement.verb = XAPIWrapper.verbs.passed;
        statement.result = {
            completion: true,
            success: true
        };
        break;
    case 'failed' :
        statement.verb = XAPIWrapper.verbs.failed;
        statement.result = {
            completion: true,
            success: false
        };
        break;
    case 'terminated' :
        statement.verb = XAPIWrapper.verbs.terminated;
        statement.result = {
            duration: TinCan.Utils.convertMillisecondsToISO8601Duration(this.getTotalDuration())
        };
        break;
    case 'exited' :
        statement.verb = XAPIWrapper.verbs.exited;
        statement.result = {
            duration: TinCan.Utils.convertMillisecondsToISO8601Duration(this.getTotalDuration())
        };
        break;
    case 'answered' :
    case 'responded' :
        statement.verb = XAPIWrapper.verbs[ name ];
        statement.result = {
            success: data.result === 'correct',
            score: {
                raw: data.result === 'correct' ? 1 : 0
            },
            duration: TinCan.Utils.convertMillisecondsToISO8601Duration(XAPIWrapper.utils.getInteractionLatency())
        };
        // s'il y a une student response
        if (data.studentResponse.length > 0) {
            statement.result.response = data.studentResponse;
        }

        statement.object = {
            id: XAPIWrapper.utils.makeInteractionId(this.tincan.activity.id, data.id),
            definition: {
                name: {
                    'fr-FR': 'Question ' + data.id
                },
                description: {
                    'fr-FR': data.description
                },
                type: XAPIWrapper.activities.interaction,
                interactionType: data.type
            },
            objectType: 'Activity'
        };
        // s'il y a une correct response ( pas de correctResponsesPattern indique que toutes les réponses sont justes, un array vide indique aucune bonne réponse )
        if (data.correctResponse.length > 0) {
            statement.object.definition.correctResponsesPattern = [
                data.correctResponse
            ];
        }
        // s'il y a un objectif associé à l'interaction et que l'API est active (nécessaire pour le context)
        if ((data.objectiveId + '').length > 0) {
            if (!Object.prototype.hasOwnProperty.call(statement.context, 'contextActivities')) {
                statement.context.contextActivities = {};
            }
            if (!statement.context.contextActivities.parent) {
                statement.context.contextActivities.parent = [];
            }
            statement.context.contextActivities.parent.push({
                id: XAPIWrapper.utils.makeObjectiveId(this.tincan.activity.id, data.objectiveId)
            });
        }
        break;

    default :
        throw new Error('XAPIWrapper :: createStatement : statement "' + name + '" not available !');
    }
    return statement;
};


/**
* Build a formatted statement for Objective Activity
* @method createObjectiveStatement
* @param  {Object} data Data associated with the statement
* @return {Object}    The formatted statement
*/
XAPIWrapper.prototype.createObjectiveStatement = function (data) {
    // on détermine le type de statement à envoyer en fonction des données
    var name = 'attempted';
    var passedOrFailed = /passed|failed/.test(data.success_status);
    if (passedOrFailed) {
        name = data.success_status;
    } else if (/completed/.test(data.completion_status)) {
        name = data.completion_status;
    }

    var statement = {
        context: {}
    };
    statement.verb = XAPIWrapper.verbs[ name ];
    statement.result = {
        completion: data.progress_measure >= 1,
        score: {
            min: data.scoreMin,
            max: data.scoreMax,
            raw: data.scoreRaw,
            scaled: data.scoreScaled
        },
        extensions: (function () {
            var extensions = {};
            extensions[ XAPIWrapper.extensions.progress.id ] = data.progress_measure;
            return extensions;
        })()
    };
    if (passedOrFailed) {
        statement.result.success = name === 'passed';
    }

    statement.object = {
        id: XAPIWrapper.utils.makeObjectiveId(this.tincan.activity.id, data.id),
        definition: {
            name: {
                'fr-FR': 'Objectif ' + data.id
            },
            description: {
                'fr-FR': data.description
            },
            type: XAPIWrapper.activities.objective
        },
        objectType: 'Activity'
    };

    statement.category = [
        XAPIWrapper.activities.profile
    ];
    return statement;
};


/**
* Return the total course duration
* with xAPI we have to calculate the total time on the client side
* (!= SCORM automaticaly calculate the total time with session_time)
* @method getTotalDuration
* @return {Number} The total course duration
*/
XAPIWrapper.prototype.getTotalDuration = function () {
    return	(this.course_data ? this.course_data.duration : 0) + XAPIWrapper.utils.getSessionTime();
};


/**
* The default course data object
*/
XAPIWrapper.DEFAULT_COURSE_DATA = {
    course: [],
    content: '',
    location: 0,
    duration: 0,
    progress: 0,
    score: {}
};


/**
* xAPI verbs
*/
XAPIWrapper.verbs = {
    'abandoned': {
        'id': 'https://w3id.org/xapi/adl/verbs/abandoned',
        'display': {'en-US': 'abandoned',
            'fr-FR': 'a abandonné'}
    },
    'answered': {
        'id': 'http://adlnet.gov/expapi/verbs/answered',
        'display': {'de-DE': 'beantwortete',
            'en-US': 'answered',
            'fr-FR': 'a répondu',
            'es-ES': 'contestó'}
    },
    'asked': {
        'id': 'http://adlnet.gov/expapi/verbs/asked',
        'display': {'de-DE': 'fragte',
            'en-US': 'asked',
            'fr-FR': 'a demandé',
            'es-ES': 'preguntó'}
    },
    'attempted': {
        'id': 'http://adlnet.gov/expapi/verbs/attempted',
        'display': {'de-DE': 'versuchte',
            'en-US': 'attempted',
            'fr-FR': 'a essayé',
            'es-ES': 'intentó'}
    },
    'attended': {
        'id': 'http://adlnet.gov/expapi/verbs/attended',
        'display': {'de-DE': 'nahm teil an',
            'en-US': 'attended',
            'fr-FR': 'a suivi',
            'es-ES': 'asistió'}
    },
    'commented': {
        'id': 'http://adlnet.gov/expapi/verbs/commented',
        'display': {'de-DE': 'kommentierte',
            'en-US': 'commented',
            'fr-FR': 'a commenté',
            'es-ES': 'comentó'}
    },
    'completed': {
        'id': 'http://adlnet.gov/expapi/verbs/completed',
        'display': {'de-DE': 'beendete',
            'en-US': 'completed',
            'fr-FR': 'a terminé',
            'es-ES': 'completó'}
    },
    'exited': {
        'id': 'http://adlnet.gov/expapi/verbs/exited',
        'display': {'de-DE': 'verließ',
            'en-US': 'exited',
            'fr-FR': 'a quitté',
            'es-ES': 'salió'}
    },
    'experienced': {
        'id': 'http://adlnet.gov/expapi/verbs/experienced',
        'display': {'de-DE': 'erlebte',
            'en-US': 'experienced',
            'fr-FR': 'a éprouvé',
            'es-ES': 'experimentó'}
    },
    'failed': {
        'id': 'http://adlnet.gov/expapi/verbs/failed',
        'display': {'de-DE': 'verfehlte',
            'en-US': 'failed',
            'fr-FR': 'a échoué',
            'es-ES': 'fracasó'}
    },
    'imported': {
        'id': 'http://adlnet.gov/expapi/verbs/imported',
        'display': {'de-DE': 'importierte',
            'en-US': 'imported',
            'fr-FR': 'a importé',
            'es-ES': 'importó'}
    },
    'initialized': {
        'id': 'http://adlnet.gov/expapi/verbs/initialized',
        'display': {'de-DE': 'initialisierte',
            'en-US': 'initialized',
            'fr-FR': 'a initialisé',
            'es-ES': 'inicializó'}
    },
    'interacted': {
        'id': 'http://adlnet.gov/expapi/verbs/interacted',
        'display': {'de-DE': 'interagierte',
            'en-US': 'interacted',
            'fr-FR': 'a interagi',
            'es-ES': 'interactuó'}
    },
    'launched': {
        'id': 'http://adlnet.gov/expapi/verbs/launched',
        'display': {'de-DE': 'startete',
            'en-US': 'launched',
            'fr-FR': 'a lancé',
            'es-ES': 'lanzó'}
    },
    'mastered': {
        'id': 'http://adlnet.gov/expapi/verbs/mastered',
        'display': {'de-DE': 'meisterte',
            'en-US': 'mastered',
            'fr-FR': 'a maîtrisé',
            'es-ES': 'dominó'}
    },
    'passed': {
        'id': 'http://adlnet.gov/expapi/verbs/passed',
        'display': {'de-DE': 'bestand',
            'en-US': 'passed',
            'fr-FR': 'a réussi',
            'es-ES': 'aprobó'}
    },
    'preferred': {
        'id': 'http://adlnet.gov/expapi/verbs/preferred',
        'display': {'de-DE': 'bevorzugte',
            'en-US': 'preferred',
            'fr-FR': 'a préféré',
            'es-ES': 'prefirió'}
    },
    'progressed': {
        'id': 'http://adlnet.gov/expapi/verbs/progressed',
        'display': {'de-DE': 'machte Fortschritt mit',
            'en-US': 'progressed',
            'fr-FR': 'a progressé',
            'es-ES': 'progresó'}
    },
    'registered': {
        'id': 'http://adlnet.gov/expapi/verbs/registered',
        'display': {'de-DE': 'registrierte',
            'en-US': 'registered',
            'fr-FR': 'a enregistré',
            'es-ES': 'registró'}
    },
    'responded': {
        'id': 'http://adlnet.gov/expapi/verbs/responded',
        'display': {'de-DE': 'reagierte',
            'en-US': 'responded',
            'fr-FR': 'a répondu',
            'es-ES': 'respondió'}
    },
    'resumed': {
        'id': 'http://adlnet.gov/expapi/verbs/resumed',
        'display': {'de-DE': 'setzte fort',
            'en-US': 'resumed',
            'fr-FR': 'a repris',
            'es-ES': 'continuó'}
    },
    'satisfied': {
        'id': 'https://w3id.org/xapi/adl/verbs/satisfied',
        'display': {'en-US': 'satisfied'}
    },
    'scored': {
        'id': 'http://adlnet.gov/expapi/verbs/scored',
        'display': {'de-DE': 'erreichte',
            'en-US': 'scored',
            'fr-FR': 'a marqué',
            'es-ES': 'anotó'}
    },
    'shared': {
        'id': 'http://adlnet.gov/expapi/verbs/shared',
        'display': {'de-DE': 'teilte',
            'en-US': 'shared',
            'fr-FR': 'a partagé',
            'es-ES': 'compartió'}
    },
    'suspended': {
        'id': 'http://adlnet.gov/expapi/verbs/suspended',
        'display': {'de-DE': 'pausierte',
            'en-US': 'suspended',
            'fr-FR': 'a suspendu',
            'es-ES': 'aplazó'}
    },
    'terminated': {
        'id': 'http://adlnet.gov/expapi/verbs/terminated',
        'display': {'de-DE': 'beendete',
            'en-US': 'terminated',
            'fr-FR': 'a terminé',
            'es-ES': 'terminó'}
    },
    'voided': {
        'id': 'http://adlnet.gov/expapi/verbs/voided',
        'display': {'de-DE': 'entwertete',
            'en-US': 'voided',
            'fr-FR': 'a annulé',
            'es-ES': 'anuló'}
    },
    'waived': {
        'id': 'https://w3id.org/xapi/adl/verbs/waived',
        'display': {'en-US': 'waived'}
    }
};

/**
* xAPI extensions
*/
XAPIWrapper.extensions = {
    'progress': {
        'id': 'https://w3id.org/xapi/cmi5/result/extensions/progress'
    }
};

/**
* xAPI activities
*/
XAPIWrapper.activities = {
    'interaction': 'http://adlnet.gov/expapi/activities/cmi.interaction',
    'objective': 'http://adlnet.gov/expapi/activities/objective',
    'profile': {
        'id': 'https://w3id.org/xapi/scorm',
        'definition': {
            'type': 'http://adlnet.gov/expapi/activities/profile'
        }
    }
};


/**
* Utils
*/
XAPIWrapper.utils = {};

XAPIWrapper.utils._initializationTime = new Date().getTime();
XAPIWrapper.utils.getSessionTime = function () {
    return new Date().getTime() - this._initializationTime;
};

XAPIWrapper.utils._interactionTime = new Date().getTime();
XAPIWrapper.utils.getInteractionLatency = function () {
    var latency = new Date().getTime() - this._interactionTime;
    this.updateInteractionTime();
    return latency;
};
XAPIWrapper.utils.updateInteractionTime = function () {
    this._interactionTime = new Date().getTime();
};

XAPIWrapper.utils.getUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
    );
};

XAPIWrapper.utils.makeInteractionId = function (activityId, interactionId) {
// return activityId + '/interaction/' + this.getUUID() + '/question/' + interactionId;
    return activityId + '/interaction/' + interactionId;
};

XAPIWrapper.utils.makeObjectiveId = function (activityId, objectiveId) {
    return activityId + '/objective/' + objectiveId;
};
