function Standard() {
    this.type = 'none';
    this.wrapper = null;
    this.enabled = true;
    this._debug = false;

    var self = this;
    var _alert = null;

    // detect the standard type used, FakeWrapper in local
    if (!Standard.utils.isLocal(window)) {
        this.type = Standard.utils.hasXAPIQueryStringParameters(window.location.href) ? 'xAPI' : 'SCORM';
    }

    // instantiate the wrapper accordingly to the detected type, with fallback to FakeWrapper
    switch (this.type.toLowerCase()) {
    case 'scorm' :
        if (typeof window.SCORMWrapper === 'function' && typeof window.pipwerks === 'object') {
            this.wrapper = new SCORMWrapper();
        } else {
            this.wrapper = new FakeWrapper();
            _alert = 'WARNING : "' + this.type + '" detected but "SCORMWrapper" and/or "pipwerks" not found ! Fallback to "FakeWrapper"';
        }
        break;
    case 'xapi' :
        if (typeof window.XAPIWrapper === 'function' && typeof window.TinCan === 'function') {
            this.wrapper = new XAPIWrapper();
        } else {
            this.wrapper = new FakeWrapper();
            _alert = 'WARNING : "' + this.type + '" detected but "XAPIWrapper" and/or "TinCan" not found ! Fallback to "FakeWrapper"';
        }
        break;
    default :
        this.wrapper = new FakeWrapper();
        break;
    }
    this.wrapper.debug = this._debug;

    // dynamic assignation of the wrapper methods to Standard
    Standard.METHODS.forEach(function (name) {
        // assign the SCORMWrapper/XAPIWrapper method to Standard or create it otherwise (FakeWrapper)
        Standard.prototype[ name ] = typeof self.wrapper[ name ] === 'function'
            ?
            // wrap the original SCORMWrapper/XAPIWrapper method to manage Standard.enabled dynamically and use FakeWrapper as a fallback if disabled
            function () {
                if (self.enabled) {
                    return self.wrapper[ name ].apply(self.wrapper, Array.prototype.slice.call(arguments));
                }
                return Standard.utils.createFakeWrapperFunction.call(self.wrapper, name).apply(self.wrapper, Array.prototype.slice.call(arguments));
            }
            :
            Standard.utils.createFakeWrapperFunction.call(self.wrapper, name);

        // for some of the wrappers methods, we must do the same data checking/processing
        // so we use an adapter to wrap a same process to the wrappers originals methods
        Standard.createMethodAdapter(name);
    });

    var wrapperClassName =  [ SCORMWrapper, XAPIWrapper, FakeWrapper ].find(function (Class) {
        return self.wrapper instanceof Class;
    }).name;

    var print = function print() {
        /* eslint-disable  */
        if (this._debug) {
            console.log('---------------------------------------------------');
            console.log('\tStandard detected : "' + this.type + '"');
            console.log('\tWrapper instance : "' + wrapperClassName + '"');
            console.log('---------------------------------------------------');
        }
        if (_alert) {
            console.warn('\t' + _alert);
        }
        /* eslint-enable  */
    };
    print.call(this);

    // define a "debug" getter/setter
    Object.defineProperty(this, 'debug', {
        get: function () {
            return this._debug;
        },
        set: function (value) {
            this._debug = this.wrapper.debug = value;
            print.call(this);
        }
    });
}


/**
 * Methods exposed by Standard
 */
Standard.METHODS = 'init save quit isCompleted getUser setCourseStarted getCourseData setCourseData getCourseLocation setCourseLocation getCourseDuration setCourseDuration getCourseProgress setCourseProgress getCourseScore setCourseScore setCourseCompleted setCoursePassed setCourseFailed sendInteraction sendObjective getObjectives'.split(' ');

/**
 * @class FakeWrapper
 */
function FakeWrapper() {
    this.debug = false;
}
// fix Function.name for IE10- / readonly otherwise
try { FakeWrapper.name = 'FakeWrapper'; } catch (e) {/**/}


/**
 * Utils
 */
Standard.utils = {};
Standard.utils.decode = function (string) {
    return window.decodeURIComponent(string.replace(/\+/g, ' '));
};
Standard.utils.isLocal = function (win) {
    return /^file/i.test(win.location.protocol);
};
Standard.utils.round = function (number, precision) {
    var p = Math.pow(10, precision || 2);
    return Math.round(number * p) / p;
};


/**
 * Parse an url to search for xAPI specifics query string parameters
 * @function hasXAPIQueryStringParameters
 * @param  {String} url An URL
 * @return {Boolean} The result
 */
Standard.utils.hasXAPIQueryStringParameters = function (url) {
    var decodedUrl = this.decode(url);
    return    /[?&]actor\={/g.test(decodedUrl)
           && /[?&]endpoint\=/g.test(decodedUrl)
           && /[?&]activity_id\=/g.test(decodedUrl);
};

/**
 * Create a method for the FakeWrapper to simulate the normal behavior of a wrapper
 * @function createFakeWrapperFunction
 * @param  {String} name The method name
 * @return {Function}  The method
 */
Standard.utils.createFakeWrapperFunction = function (name) {
    var returned;
    switch (name) {
    case 'init' :
    case 'save' :
    case 'quit' :
    case 'setCourseStarted' :
    case 'setCourseData' :
    case 'setCourseLocation' :
    case 'setCourseDuration' :
    case 'setCourseProgress' :
    case 'setCourseScore' :
    case 'setCourseCompleted' :
    case 'setCoursePassed' :
    case 'setCourseFailed' :
    case 'sendInteraction' :
    case 'sendObjective' :
        returned = true;
        break;
    case 'isCompleted' :
        returned = false;
        break;
    default :
        returned = null;
    }
    return function () {
        var args = Array.prototype.slice.call(arguments);
        if (this.debug) {
            /* eslint-disable  */
            console.log(FakeWrapper.name + ' :: function "' + name + '" called' + (args.length > 0 ? ' with ' + args.length + ' arguments : ' : ''));
            args.forEach(function (arg, index) {
                console.log('\t-argument ' + (index + 1) + ' = ', arg);
            });
            /* eslint-enable  */
        }
        return Promise.resolve(returned);
    }.bind(this);
};

/**
 * Make a Promise from any function
 * @function promisify
 * @param  {Function} fun The function to promisify (could already be a Promise)
 * @return {Function} The new function that returns a Promise
 */
Standard.utils.promisify = function (fun) {
    return function () {
        return new Promise(function (resolve, reject) {
            var result = fun.apply(null, Array.prototype.slice.call(arguments));
            try {
                return result.then(resolve, reject);
            } catch (e) {
                if (e instanceof TypeError) {
                    resolve(result);
                } else {
                    reject(e);
                }
                return true;
            }
        });
    };
};


/**
 * Modify the receives data (before) and/or returned (after) by the original wrapper methods
 * @function createMethodAdapter
 * @param  {String} name The method name
 * @return {undefined}
 */
Standard.createMethodAdapter = function (name) {
    var protoHasOwnProperty = Object.prototype.hasOwnProperty;
    switch (name) {
    case 'setCourseScore' :
        var originalSetCourseScoreMethod = Standard.prototype[ name ];
        var setCourseScore = function (data) {
            if (!data || 'min max raw scaled'.split(' ').every(function (key) { return !protoHasOwnProperty.call(data,  key) || Number.isNaN(data[ key ]); })) {
                throw new Error('setCourseScore :: invalid data : ' + data + '. min, max, raw or scaled required');
            }
            var scoreData = {
                scaled: 0
            };
            if (data) {
                var hasMin = 	protoHasOwnProperty.call(data,  'min') 	&& !Number.isNaN(data.min);
                var hasRaw = 	protoHasOwnProperty.call(data,  'raw') 	&& !Number.isNaN(data.raw);
                var hasMax = 	protoHasOwnProperty.call(data,  'max') 	&& !Number.isNaN(data.max);
                var hasScaled = protoHasOwnProperty.call(data,  'scaled') && !Number.isNaN(data.scaled);
                if (!hasScaled && hasRaw && hasMax) {
                    data.scaled = data.max > 0
                        ? Math.round((data.raw / data.max) * 100) / 100
                        : 0;
                }
                if (!hasMin && hasRaw && hasMax) {
                    data.min = 0;
                }
                if (hasMin || hasRaw || hasMax || hasScaled) {
                    scoreData = Object.assign({}, data);
                }
            }
            return originalSetCourseScoreMethod(scoreData);
        };
        Standard.prototype[ name ] = setCourseScore;
        break;

    case 'sendInteraction' :
        var originalSendInteractionMethod = Standard.prototype[ name ];
        var sendInteraction = function (data) {
            if (!data
                || 'id type result'
                    .split(' ')
                    .some(function (key) {
                        return !protoHasOwnProperty.call(data,  key)
                            || (data[ key ] === null
                            || typeof data[ key ] === 'undefined');
                    })) {
                throw new Error('sendInteraction :: invalid data : ' + data + '. id, type and result required');
            }
            var interactionData = {
                // id,       required so must trow an exception if missing
                // type,     required so must trow an exception if missing
                objectiveId: '',
                correctResponse: '',
                studentResponse: '',
                weighting: 1,
                // result,  required so must trow an exception if missing
                description: ''
            };
            if (data) {
                interactionData = Object.assign({}, data);
                if (protoHasOwnProperty.call(interactionData,  'result')
                    && typeof interactionData.result === 'number') {
                    interactionData.result = interactionData.result > 0 ? 'correct' : 'incorrect';
                }
                'correctResponse studentResponse'
                    .split(' ')
                    .forEach(function (key) {
                        interactionData[ key ] = (interactionData[ key ] + '').replace(/(\.|\,)/g, '[$1]');
                    });
            }
            return originalSendInteractionMethod(interactionData);
        };
        Standard.prototype[ name ] = sendInteraction;
        break;

    case 'sendObjective' :
        var originalSendObjectiveMethod = Standard.prototype[ name ];
        var sendObjective = function (data) {
            if (!data || !protoHasOwnProperty.call(data,  'id') || !data.id) {
                throw new Error('sendObjective :: invalid data : ' + data + '. id required');
            }
            var objectiveData = {
                // id,       required so must trow an exception if missing
                scoreMin: 0,
                scoreMax: 100,
                scoreRaw: 0,
                scoreScaled: 0,
                success_status: 'unknown',
                completion_status: 'unknown',
                progress_measure: 0,
                description: ''
            };
            if (data) {
                objectiveData = Object.assign({}, data);
                objectiveData.scoreScaled = objectiveData.scoreMax > 0 ? Standard.utils.round(objectiveData.scoreRaw / objectiveData.scoreMax) : 0;
            }
            return originalSendObjectiveMethod(objectiveData);
        };
        Standard.prototype[ name ] = sendObjective;
        break;

        /**
         * Example of data processing after the method
         */
    case 'methodName' :
        var originalMethod = Standard.prototype[ name ];
        Standard.prototype[ name ] = Standard.utils.promisify(originalMethod)
            .then(function (data) {
                var modifiedData = Object.assign({}, data);
                // modify/process data here
                // ...
                return modifiedData;
            });
        break;
    default:
        break;
    }
};
