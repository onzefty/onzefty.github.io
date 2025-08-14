var Utility = (function () {
    /**
     * @constant CHARACTERS_MAP
     * @description A map of accented/non accented character key/value pairs
     */
    var CHARACTERS_MAP = {
        'À': 'A',
        'Á': 'A',
        'Â': 'A',
        'Ã': 'A',
        'Ä': 'A',
        'Å': 'A',
        'Ấ': 'A',
        'Ắ': 'A',
        'Ẳ': 'A',
        'Ẵ': 'A',
        'Ặ': 'A',
        'Æ': 'AE',
        'Ầ': 'A',
        'Ằ': 'A',
        'Ȃ': 'A',
        'Ç': 'C',
        'Ḉ': 'C',
        'È': 'E',
        'É': 'E',
        'Ê': 'E',
        'Ë': 'E',
        'Ế': 'E',
        'Ḗ': 'E',
        'Ề': 'E',
        'Ḕ': 'E',
        'Ḝ': 'E',
        'Ȇ': 'E',
        'Ì': 'I',
        'Í': 'I',
        'Î': 'I',
        'Ï': 'I',
        'Ḯ': 'I',
        'Ȋ': 'I',
        'Ð': 'D',
        'Ñ': 'N',
        'Ò': 'O',
        'Ó': 'O',
        'Ô': 'O',
        'Õ': 'O',
        'Ö': 'O',
        'Ø': 'O',
        'Ố': 'O',
        'Ṍ': 'O',
        'Ṓ': 'O',
        'Ȏ': 'O',
        'Ù': 'U',
        'Ú': 'U',
        'Û': 'U',
        'Ü': 'U',
        'Ý': 'Y',
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'a',
        'å': 'a',
        'ấ': 'a',
        'ắ': 'a',
        'ẳ': 'a',
        'ẵ': 'a',
        'ặ': 'a',
        'æ': 'ae',
        'ầ': 'a',
        'ằ': 'a',
        'ȃ': 'a',
        'ç': 'c',
        'ḉ': 'c',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ế': 'e',
        'ḗ': 'e',
        'ề': 'e',
        'ḕ': 'e',
        'ḝ': 'e',
        'ȇ': 'e',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ḯ': 'i',
        'ȋ': 'i',
        'ð': 'd',
        'ñ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'o',
        'ø': 'o',
        'ố': 'o',
        'ṍ': 'o',
        'ṓ': 'o',
        'ȏ': 'o',
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ü': 'u',
        'ý': 'y',
        'ÿ': 'y',
        'Ā': 'A',
        'ā': 'a',
        'Ă': 'A',
        'ă': 'a',
        'Ą': 'A',
        'ą': 'a',
        'Ć': 'C',
        'ć': 'c',
        'Ĉ': 'C',
        'ĉ': 'c',
        'Ċ': 'C',
        'ċ': 'c',
        'Č': 'C',
        'č': 'c',
        'C̆': 'C',
        'c̆': 'c',
        'Ď': 'D',
        'ď': 'd',
        'Đ': 'D',
        'đ': 'd',
        'Ē': 'E',
        'ē': 'e',
        'Ĕ': 'E',
        'ĕ': 'e',
        'Ė': 'E',
        'ė': 'e',
        'Ę': 'E',
        'ę': 'e',
        'Ě': 'E',
        'ě': 'e',
        'Ĝ': 'G',
        'Ǵ': 'G',
        'ĝ': 'g',
        'ǵ': 'g',
        'Ğ': 'G',
        'ğ': 'g',
        'Ġ': 'G',
        'ġ': 'g',
        'Ģ': 'G',
        'ģ': 'g',
        'Ĥ': 'H',
        'ĥ': 'h',
        'Ħ': 'H',
        'ħ': 'h',
        'Ḫ': 'H',
        'ḫ': 'h',
        'Ĩ': 'I',
        'ĩ': 'i',
        'Ī': 'I',
        'ī': 'i',
        'Ĭ': 'I',
        'ĭ': 'i',
        'Į': 'I',
        'į': 'i',
        'İ': 'I',
        'ı': 'i',
        'Ĳ': 'IJ',
        'ĳ': 'ij',
        'Ĵ': 'J',
        'ĵ': 'j',
        'Ķ': 'K',
        'ķ': 'k',
        'Ḱ': 'K',
        'ḱ': 'k',
        'K̆': 'K',
        'k̆': 'k',
        'Ĺ': 'L',
        'ĺ': 'l',
        'Ļ': 'L',
        'ļ': 'l',
        'Ľ': 'L',
        'ľ': 'l',
        'Ŀ': 'L',
        'ŀ': 'l',
        'Ł': 'l',
        'ł': 'l',
        'Ḿ': 'M',
        'ḿ': 'm',
        'M̆': 'M',
        'm̆': 'm',
        'Ń': 'N',
        'ń': 'n',
        'Ņ': 'N',
        'ņ': 'n',
        'Ň': 'N',
        'ň': 'n',
        'ŉ': 'n',
        'N̆': 'N',
        'n̆': 'n',
        'Ō': 'O',
        'ō': 'o',
        'Ŏ': 'O',
        'ŏ': 'o',
        'Ő': 'O',
        'ő': 'o',
        'Œ': 'OE',
        'œ': 'oe',
        'P̆': 'P',
        'p̆': 'p',
        'Ŕ': 'R',
        'ŕ': 'r',
        'Ŗ': 'R',
        'ŗ': 'r',
        'Ř': 'R',
        'ř': 'r',
        'R̆': 'R',
        'r̆': 'r',
        'Ȓ': 'R',
        'ȓ': 'r',
        'Ś': 'S',
        'ś': 's',
        'Ŝ': 'S',
        'ŝ': 's',
        'Ş': 'S',
        'Ș': 'S',
        'ș': 's',
        'ş': 's',
        'Š': 'S',
        'š': 's',
        'Ţ': 'T',
        'ţ': 't',
        'ț': 't',
        'Ț': 'T',
        'Ť': 'T',
        'ť': 't',
        'Ŧ': 'T',
        'ŧ': 't',
        'T̆': 'T',
        't̆': 't',
        'Ũ': 'U',
        'ũ': 'u',
        'Ū': 'U',
        'ū': 'u',
        'Ŭ': 'U',
        'ŭ': 'u',
        'Ů': 'U',
        'ů': 'u',
        'Ű': 'U',
        'ű': 'u',
        'Ų': 'U',
        'ų': 'u',
        'Ȗ': 'U',
        'ȗ': 'u',
        'V̆': 'V',
        'v̆': 'v',
        'Ŵ': 'W',
        'ŵ': 'w',
        'Ẃ': 'W',
        'ẃ': 'w',
        'X̆': 'X',
        'x̆': 'x',
        'Ŷ': 'Y',
        'ŷ': 'y',
        'Ÿ': 'Y',
        'Y̆': 'Y',
        'y̆': 'y',
        'Ź': 'Z',
        'ź': 'z',
        'Ż': 'Z',
        'ż': 'z',
        'Ž': 'Z',
        'ž': 'z',
        'ſ': 's',
        'ƒ': 'f',
        'Ơ': 'O',
        'ơ': 'o',
        'Ư': 'U',
        'ư': 'u',
        'Ǎ': 'A',
        'ǎ': 'a',
        'Ǐ': 'I',
        'ǐ': 'i',
        'Ǒ': 'O',
        'ǒ': 'o',
        'Ǔ': 'U',
        'ǔ': 'u',
        'Ǖ': 'U',
        'ǖ': 'u',
        'Ǘ': 'U',
        'ǘ': 'u',
        'Ǚ': 'U',
        'ǚ': 'u',
        'Ǜ': 'U',
        'ǜ': 'u',
        'Ứ': 'U',
        'ứ': 'u',
        'Ṹ': 'U',
        'ṹ': 'u',
        'Ǻ': 'A',
        'ǻ': 'a',
        'Ǽ': 'AE',
        'ǽ': 'ae',
        'Ǿ': 'O',
        'ǿ': 'o',
        'Þ': 'TH',
        'þ': 'th',
        'Ṕ': 'P',
        'ṕ': 'p',
        'Ṥ': 'S',
        'ṥ': 's',
        'X́': 'X',
        'x́': 'x',
        'Ѓ': 'Г',
        'ѓ': 'г',
        'Ќ': 'К',
        'ќ': 'к',
        'A̋': 'A',
        'a̋': 'a',
        'E̋': 'E',
        'e̋': 'e',
        'I̋': 'I',
        'i̋': 'i',
        'Ǹ': 'N',
        'ǹ': 'n',
        'Ồ': 'O',
        'ồ': 'o',
        'Ṑ': 'O',
        'ṑ': 'o',
        'Ừ': 'U',
        'ừ': 'u',
        'Ẁ': 'W',
        'ẁ': 'w',
        'Ỳ': 'Y',
        'ỳ': 'y',
        'Ȁ': 'A',
        'ȁ': 'a',
        'Ȅ': 'E',
        'ȅ': 'e',
        'Ȉ': 'I',
        'ȉ': 'i',
        'Ȍ': 'O',
        'ȍ': 'o',
        'Ȑ': 'R',
        'ȑ': 'r',
        'Ȕ': 'U',
        'ȕ': 'u',
        'B̌': 'B',
        'b̌': 'b',
        'Č̣': 'C',
        'č̣': 'c',
        'Ê̌': 'E',
        'ê̌': 'e',
        'F̌': 'F',
        'f̌': 'f',
        'Ǧ': 'G',
        'ǧ': 'g',
        'Ȟ': 'H',
        'ȟ': 'h',
        'J̌': 'J',
        'ǰ': 'j',
        'Ǩ': 'K',
        'ǩ': 'k',
        'M̌': 'M',
        'm̌': 'm',
        'P̌': 'P',
        'p̌': 'p',
        'Q̌': 'Q',
        'q̌': 'q',
        'Ř̩': 'R',
        'ř̩': 'r',
        'Ṧ': 'S',
        'ṧ': 's',
        'V̌': 'V',
        'v̌': 'v',
        'W̌': 'W',
        'w̌': 'w',
        'X̌': 'X',
        'x̌': 'x',
        'Y̌': 'Y',
        'y̌': 'y',
        'A̧': 'A',
        'a̧': 'a',
        'B̧': 'B',
        'b̧': 'b',
        'Ḑ': 'D',
        'ḑ': 'd',
        'Ȩ': 'E',
        'ȩ': 'e',
        'Ɛ̧': 'E',
        'ɛ̧': 'e',
        'Ḩ': 'H',
        'ḩ': 'h',
        'I̧': 'I',
        'i̧': 'i',
        'Ɨ̧': 'I',
        'ɨ̧': 'i',
        'M̧': 'M',
        'm̧': 'm',
        'O̧': 'O',
        'o̧': 'o',
        'Q̧': 'Q',
        'q̧': 'q',
        'U̧': 'U',
        'u̧': 'u',
        'X̧': 'X',
        'x̧': 'x',
        'Z̧': 'Z',
        'z̧': 'z',
    };
    return {

        mix: function (baseClass) {
            var mixins = Array.prototype.slice.call(arguments).slice(1);
            mixins.forEach(function (mixin) {
                Object.getOwnPropertyNames(mixin).concat(Object.getOwnPropertySymbols(mixin))
                    .forEach(function (key) {
                        if (key in baseClass.prototype) {
                            return;
                        }
                        var sourceDescriptor = Object.getOwnPropertyDescriptor(mixin, key);
                        sourceDescriptor.enumerable = false;
                        Object.defineProperty(baseClass.prototype, key, sourceDescriptor);
                    });
            });
        },

        isNullOrUndefined: function (value) {
            return value === null || typeof value === 'undefined';
        },

        isDefined: function (value) {
            return value !== null && typeof value !== 'undefined';
        },

        isNumeric: function (value) {
            return !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value);
        },

        isPlainObject: function (o) {
            return !!o && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
        },

        extend: function () {
            var options;
            var src;
            var copy;
            var copyIsArray;
            var clone;
            var args = Array.prototype.slice.call(arguments);
            var target = args[0] || {};
            var i = 1;
            var length = args.length;

            var deep = false;
            // Handle a deep copy situation
            if (typeof target === 'boolean') {
                deep = target;
                target = args[1] || {};
                // skip the boolean and the target
                i = 2;
            }
            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== 'object' && typeof target !== 'function') {
                target = {};
            }
            // extend Utility itself if only one argument is passed
            if (length === i) {
                target = this;
                i -= 1;
            }

            var doCopy = function (name) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target !== copy) {
                    // Recurse if we're merging plain objects or arrays
                    copyIsArray = Array.isArray(copy);
                    if (deep && copy && (Utility.isPlainObject(copy) || copyIsArray)) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = (src && Array.isArray(src)) ? src : [];
                        } else {
                            clone = (src && Utility.isPlainObject(src)) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = Utility.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== void 0) {
                        target[name] = copy;
                    }
                }
            };

            for (; i < length; i += 1) {
                // Only deal with non-null/undefined values
                options = args[i];
                if (options != null) {
                    // Extend the base object
                    Object.keys(options).forEach(doCopy);
                }
            }
            // Return the modified object
            return target;
        },

        getGUID: function (length) {
            var chars = '0123456789abcdef'.split('');


            var guid = '';
            while (guid.length < (length || 32)) {
                guid += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            return guid;
        },
        uuidv4: function (a) {
            return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018 ]/g, Utility.uuidv4);
        },
        isObjectEmpty: function (obj) {
            for (var p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    return true;
                }
            }
            return false;
        },
        getObjectLength: function (obj) {
            var i = 0;
            for (var p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    i++;
                }
            }
            return i;
        },
        isjQueryObject: function (obj) {
            return (obj && (obj instanceof window.jQuery || obj.constructor.prototype.jquery));
        },
        objInArray: function (obj, arr) {
            return JSON.stringify(arr).indexOf(JSON.stringify(obj)) > -1;
        },
        toLtGtEntities: function (str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        /**
         * getStringDate - Retourne la date au format String JJ/MM/AAAA
         *
         * @param  {Number} ms Timestamp définissant la date ou null pour la date actuelle (optional)
         * @param  {String} separator séparateur, '/' par défaut (optional)
         * @return {String} The formatted Date
         */
        getStringDate: function getStringDate(ms, separator) {
            separator = separator && typeof separator === 'string' ? separator : '/';
            var date = ms ? new Date(ms) : new Date();


            var year = date.getFullYear();


            var month = date.getMonth() + 1;


            var day = date.getDate();


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return normalize(day) + separator + normalize(month) + separator + year;
        },
        getStringTime: function (seconds, autoHideZeros) {
            autoHideZeros = typeof autoHideZeros === 'boolean' ? autoHideZeros : true;
            var hours = Math.round(seconds / 3600);


            var minutes = Math.round((seconds % 3600) / 60);


            var seconds = Math.round((seconds % 3600) % 60);


            var milliseconds = Math.round((seconds % 3600) % (60 * 1000));


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            if (autoHideZeros) {
                return (hours > 0 ? normalize(hours) + ':' : '') + ((hours > 0 || minutes > 0) ? normalize(minutes) + ':' : '') + normalize(seconds) + '.' + normalize(milliseconds);
            }
            return normalize(hours) + ':' + normalize(minutes) + ':' + normalize(seconds) + '.' + normalize(milliseconds);
        },
        getNow: function (ms, separator) {
            separator = typeof separator === 'string' ? separator : ':';
            var date = typeof ms === 'number' ? new Date(ms) : new Date();


            var hour = date.getHours();


            var minutes = date.getMinutes();


            var seconds = date.getSeconds();


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return normalize(hour) + separator + normalize(minutes) + separator + normalize(seconds);
        },
        getStringDateTime: function (ms) {
            var date = ms ? new Date(ms) : new Date();


            var year = date.getFullYear();


            var month = date.getMonth() + 1;


            var day = date.getDate();


            var hour = date.getHours();


            var minutes = date.getMinutes();


            var seconds = date.getSeconds();


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return normalize(day) + '/' + normalize(month) + '/' + year + ' ' + normalize(hour) + ':' + normalize(minutes) + ':' + normalize(seconds);
        },
        getUTCStringDate: function (ms, separator) {
            separator = typeof separator === 'string' ? separator : '/';
            var date = ms ? new Date(ms) : new Date();


            var year = date.getUTCFullYear();


            var month = date.getUTCMonth() + 1;


            var day = date.getUTCDate();


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return normalize(day) + separator + normalize(month) + separator + year;
        },
        getUTCStringDateTime: function (ms) {
            var date = ms ? new Date(ms) : new Date();


            var year = date.getUTCFullYear();


            var month = date.getUTCMonth() + 1;


            var day = date.getUTCDate();


            var hour = date.getUTCHours();


            var minutes = date.getUTCMinutes();


            var seconds = date.getUTCSeconds();


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return normalize(day) + '/' + normalize(month) + '/' + year + ' ' + normalize(hour) + ':' + normalize(minutes) + ':' + normalize(seconds);
        },
        timestampToHMS: function (ms, decimal) {
            decimal = typeof decimal === 'boolean' ? decimal : false;
            var milliseconds = parseInt((ms % 1000) / 100);


            var seconds = parseInt((ms / 1000) % 60);


            var minutes = parseInt((ms / (1000 * 60)) % 60);


            var hours = parseInt((ms / (1000 * 60 * 60)) % 24);


            var days = parseInt(ms / (1000 * 60 * 60 * 24));


            var normalize = function (n) {
                if (isNaN(n)) {
                    n = 0;
                }
                return n < 10 ? '0' + n : '' + n;
            };
            return (days > 0 ? (days + ' Jour' + (days > 1 ? 's ' : ' ')) : '') + normalize(hours) + ':' + normalize(minutes) + ':' + normalize(seconds) + (decimal ? '.' + milliseconds : '');
        },
        stringDateToTimestamp: function (sDate) { // "JJ/MM/AAAA"
            var aDate = sDate.split('/');
            return (new Date(aDate[1] + '/' + aDate[0] + '/' + aDate[2]).getTime());
        },
        stringDateTimeToTimestamp: function (sDateTime) { // "JJ/MM/AAAA HH:MM:SS"
            var aDate = sDateTime.split(' ')[0].split('/');
            return (new Date(aDate[1] + '/' + aDate[0] + '/' + aDate[2] + ' ' + aDate[1]).getTime());
        },
        stringUTCDateToTimestamp: function (sDate) { // "JJ/MM/AAAA"
            var aDate = sDate.split('/');


            var date = new Date(aDate[1] + '/' + aDate[0] + '/' + aDate[2]);
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        },
        stringUTCDateTimeToTimestamp: function (sDateTime) { // "JJ/MM/AAAA HH:MM:SS"
            var aDate = sDateTime.split(' ')[0].split('/');


            var date = (new Date(aDate[1] + '/' + aDate[0] + '/' + aDate[2] + ' ' + aDate[1]));
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        },
        /**
         * Compare une date ( sDate) à une date de référence (sDateRef) et renvoie un booléen indiquant si la date (sDate) est supérieure ou égale à la date de référence (sDateRef )
         * @param   sDate       Date à comparer     ( sous forme de string "JJ/MM/AAAA" )
         * @param   sDateRef    Date de référence   ( sous forme de string "JJ/MM/AAAA" )
         * @return  BOOLEAN     TRUE si la date ( sDate) est supérieure ou égale à la date de référence (sDateRef ), FALSE sinon.
         */
        isDatePassed: function (sDate, sDateRef) {
            var d = new Date(this.stringDateToTimestamp(sDate));


            var dref = new Date(this.stringDateToTimestamp(sDateRef));


            var isPassed = false;
            if (d.getFullYear() > dref.getFullYear()) {
                isPassed = true;
            } else if (d.getFullYear() === dref.getFullYear()) {
                if (d.getMonth() > dref.getMonth()) {
                    isPassed = true;
                } else if (d.getMonth() === dref.getMonth()) {
                    if (d.getDate() >= dref.getDate()) {
                        isPassed = true;
                    }
                }
            }
            return isPassed;
        },
        isUTCDatePassed: function (sDate, sDateRef) {
            var d = new Date(this.stringUTCDateToTimestamp(sDate));


            var dref = new Date(this.stringUTCDateToTimestamp(sDateRef));


            var isPassed = false;
            if (d.getUTCFullYear() > dref.getUTCFullYear()) {
                isPassed = true;
            } else if (d.getUTCFullYear() === dref.getUTCFullYear()) {
                if (d.getUTCMonth() > dref.getUTCMonth()) {
                    isPassed = true;
                } else if (d.getUTCMonth() === dref.getUTCMonth()) {
                    if (d.getUTCDate() >= dref.getUTCDate()) {
                        isPassed = true;
                    }
                }
            }
            return isPassed;
        },
        toBoolean: function (value) {
            var t = typeof value;
            switch (t) {
            // typeof new String( "true" ) === "object", so handle objects as string via fall-through.
            // See https://github.com/pipwerks/scorm-api-wrapper/issues/3
            case 'object':
            case 'string':
                return (/(true|1)/i).test(value);
            case 'number':
                return !!value;
            case 'boolean':
                return value;
            case 'undefined':
                return null;
            default:
                return false;
            }
        },
        toArray: function (obj) {
            return Array.prototype.slice.call(obj);
        },
        getObjectById: function (array, id) {
            var match;
            array.forEach(function (element) {
                if (element.id && element.id === id) {
                    match = element;
                    return false;
                }
                return true;
            });
            return match;
        },
        loadJS: function (src) {
            return new Promise(function (resolve, reject) {
                var doc = window.document;
                var js = doc.createElement('script');
                js.onload = resolve;
                js.onerror = reject;
                js.async = true;
                js.src = src;
                doc.getElementsByTagName('head')[0].appendChild(js);
            });
        },

        ajax: function (url, dataType) {
            return new Promise(function (resolve, reject) {
                var xhr = window.XMLHttpRequest
                    ? new XMLHttpRequest()
                    : new ActiveXObject('Microsoft.XMLHTTP');
            
                var type = 'application/x-www-form-urlencoded; charset=UTF-8';
                var completed = false;
                var accept = '*/*';
            
                switch (dataType) {
                case 'text':
                    type = 'text/plain';
                    break;
                case 'json':
                    type = 'application/json, text/javascript';
                    break;
                case 'html':
                    type = 'text/html';
                    break;
                case 'xml':
                    type = 'application/xml, text/xml';
                    break;
                default:
                    break;
                }
            
                if (type !== 'application/x-www-form-urlencoded') {
                    accept = type + ', */*; q=0.01';
                }
            
                if (xhr) {
                    xhr.open('GET', url, true);
                    xhr.setRequestHeader('Accept', accept);
                    xhr.onreadystatechange = function onreadystatechange() {
                        // Ignore repeat invocations
                        if (completed) {
                            return;
                        }
            
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                completed = true;
                                var data;
                                switch (dataType) {
                                case 'json':
                                    data = JSON.parse(xhr.responseText);
                                    break;
                                case 'xml':
                                    data = xhr.responseXML;
                                    break;
                                default:
                                    data = xhr.responseText;
                                    break;
                                }
                                resolve(data);
                            } else {
                                reject(xhr.status);
                            }
                        }
                    };
                    xhr.send();
                }
            });
        },

        /*!
        loadCSS: load a CSS file asynchronously.
        [c]2015 @scottjehl, Filament Group, Inc.
        Licensed MIT
        */
        loadCSS: function (href, doc, callback, before, media) {
            // "use strict";

            // Arguments explained:
            // `href` [ REQUIRED ] is the URL for your CSS file.
            // `before` [ OPTIONAL ] is the element the script should use as a reference for injecting our stylesheet <link> before
            // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
            // `media` [ OPTIONAL ] is the media type or query of the stylesheet. By default it will be 'all'
            var ss = (doc || window.document).createElement('link');
            var ref;
            if (before) {
                ref = before;
            } else {
                var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
                ref = refs[refs.length - 1];
            }

            var sheets = doc.styleSheets;
            ss.rel = 'stylesheet';
            ss.href = href;
            // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
            ss.media = 'only x';

            // Inject link
            // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
            // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
            ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
            // A method ( exposed on return object for external use ) that mimics onload by polling until document.styleSheets until it includes the new sheet.
            var onloadcssdefined = function (cb) {
                var resolvedHref = ss.href;
                var i = sheets.length;
                while (i--) {
                    if (sheets[i].href === resolvedHref) {
                        return cb();
                    }
                }
                setTimeout(function () {
                    onloadcssdefined(cb);
                });
            };

            // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
            ss.onloadcssdefined = onloadcssdefined;
            onloadcssdefined(function () {
                ss.media = media || 'all';
            });

            ss.onload = function () {
                ss.onload = null;
                if (callback) {
                    callback.call(ss);
                }
            };
            // This code is for browsers that don’t support onload, any browser that supports onload should use that instead. No support for onload: * Android 4.3 ( Samsung Galaxy S4, Browserstack), * Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L), * Android 2.3 (Pantech Burst P9070 )
            if ('isApplicationInstalled' in navigator && 'onloadcssdefined' in ss) { // Weak inference targets Android < 4.4
                ss.onloadcssdefined(callback);
            }

            return ss;
        },
        getMaxTextWidth: function ($elementsArray) {
            var mw = 0;


            var iw = 0;
            $elementsArray.forEach(function (element) {
                iw = element.width();
                if (iw > mw) {
                    mw = iw;
                }
            });
            return mw;
        },
        domElIsInArrayById: function ($el, $array) {
            var isInArray = false;
            $array.forEach(function (element) {
                if (element.attr('id') === $el.attr('id')) {
                    isInArray = true;
                    return false;
                }
                return true;
            });
            return isInArray;
        },
        round: function (number, precision) {
            var p = Math.pow(10, precision || 2);
            return Math.round(number * p) / p;
        },
        // utilise WebRTC pour déterminer la/les adresse(s) IP locales
        findLocalIp: function (callback) {
            var noop = function () {};


            var RTCPeerConnection = window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection ||
                function () {
                    return {
                        createDataChannel: noop,
                        createOffer: noop,
                        onicecandidate: noop
                    };
                };


            var pc = new RTCPeerConnection({
                iceServers: []
            });


            var localIPs = {};


            var ipRegex = /( [ 0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9 ]{1,4}){7} )/g;


            var ipIterate = function (ip) {
                if (!localIPs[ip]) {
                    callback(ip);
                }
                localIPs[ip] = true;
            };
            pc.createDataChannel('');
            pc.createOffer(function (sdp) {
                sdp.sdp.split('\n').forEach(function (line) {
                    if (line.indexOf('candidate') < 0) {
                        return;
                    }
                    line.match(ipRegex).forEach(ipIterate);
                });
                pc.setLocalDescription(sdp, noop, noop);
            }, noop);
            pc.onicecandidate = function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
                    return;
                }
                ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
            };
        },
        isTouchEvent: function (e) {
            return e.type.toLowerCase().indexOf('touch') > -1;
        },
        getMouseOrTouchEvent: function (e) {
            return this.isTouchEvent(e) ? e.originalEvent.touches[0] : e;
        },
        noDraggable: function ($domElement) {
            [$domElement, $domElement.find('*')].forEach(function (el) {
                $(el)
                    // on rend tous les éléments contenus non draggable
                    .attr('draggable', false)
                    // nécessaire d'utiliser cette astuce pour empêcher le drag ( sous FF par ex ), l'attribut draggable n'est pas pris en compte et le navigateur rend les images draggable
                    .attr('ondragstart', 'return false;');
            });
            return this;
        },

        /**
         * Retourne la valeur de la largeur et de la hauteur d'une image en background CSS d'un élément
         */
        getBackgroundImageSize: function ($elem, callback) {
            var img = new Image();
            img.onload = function () {
                (callback || function () {}).call({
                    width: this.width,
                    height: this.height
                });
            };
            img.src = $elem.css('background-image').replace(/url\(|\)$|"/ig, '') + '?t=' + new Date().getTime();
            return this;
        },
        /**
         * Conversion du session_time du format String SCORM 1.2 au format String SCORM 2004
         */
        sessionTimeToScorm2004: function (stringSessionTime) {
            var aSessionTime = stringSessionTime.split(':');
            var sTimeHour = parseInt(aSessionTime[0], 10);
            return 'PT' + (sTimeHour < 1000 ? '0' : '') + (sTimeHour < 100 ? '0' : '') + aSessionTime[0] + 'H' + aSessionTime[1] + 'M' + aSessionTime[2] + 'S';
        },

        /**
         * Retourne l'heure actuelle au format String HH:MM:SS
         */
        getStringActualTime: function () {
            var date = new Date();
            var h = date.getHours() + '';
            if (parseInt(h, 10) < 10) {
                h = '0' + h;
            }
            var m = date.getMinutes() + '';
            if (parseInt(m, 10) < 10) {
                m = '0' + m;
            }
            var s = date.getSeconds() + '';
            if (parseInt(s, 10) < 10) {
                s = '0' + s;
            }
            return h + ':' + m + ':' + s;
        },

        /**
         * Retourne la date et l'heure actuelle au format ISO String ( utilisé pour la variable timestamp d'une interaction en SCORM 2004 )
         */
        getIsoStringDate: function () {
            return new Date().toISOString();
        },


        isPortrait: function () {
            return (window.innerHeight / window.innerWidth) > 1;
        },

        isLandscape: function () {
            return (window.innerHeight / window.innerWidth) < 1;
        },


        isIosDevice: function () {
            return (navigator.userAgent.match(/(iPod|iPhone|iPad)/i) !== null);
        },
        isMobileSafari: function () {
            var matchSafari = navigator.userAgent.match(/Safari/i) !== null;
            var matchChrome = navigator.userAgent.match(/Chrome/i) !== null;
            return this.isIosDevice() &&
                matchSafari &&
                !matchChrome;
        },

        isChrome: function () {
            var isChromium = window.chrome;
            var navigator = window.navigator;
            var vendorName = navigator.vendor;
            var isOpera = typeof window.opr !== 'undefined';
            var isIEedge = navigator.userAgent.indexOf('Edge') > -1;
            var isIOSChrome = navigator.userAgent.match('CriOS');
            return isIOSChrome || (isChromium !== null &&
                typeof isChromium !== 'undefined' &&
                vendorName === 'Google Inc.' &&
                isOpera === false &&
                isIEedge === false);
        },

        getMatrix: function ($element) {
            return $element.css('-webkit-transform') ||
                $element.css('-moz-transform') ||
                $element.css('-ms-transform') ||
                $element.css('-o-transform') ||
                $element.css('transform');
        },
        getScale: function ($element) {
            var values = {
                scaleX: 1,
                scaleY: 1
            };
            var matrix = this.getMatrix($element);
            if (matrix) {
                var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;

                var matches = matrix.match(matrixRegex); // matches[1] = scaleX et matches[2]=scaleY => ATTENTION uniquement si une transformation de scale a été appliquée à l'objet
                if (matches) {
                    if (!isNaN(parseFloat(matches[1]))) {
                        values.scaleX = parseFloat(matches[1]);
                    }
                    if (!isNaN(parseFloat(matches[2]))) {
                        values.scaleY = parseFloat(matches[2]);
                    }
                }
            }
            return values;
        },

        /**
         * Permet de scaler une div :
         */
        setScale: function ($element, scale) {
            var value = 'scale( ' + scale + ' )';
            $element.css({
                '-webkit-transform': value,
                '-moz-transform': value,
                '-ms-transform': value,
                '-o-transform': value,
                'transform': value
            });
        },


        /**
         * Fonction strip_tags type PHP permettant de choisir une ou plusieurs balises à laisser intactes et de supprimmer toutes les autres en conservant le texte.
         */
        strip_tags: function (input, allowed) {
            allowed = (((allowed || '') + '').toLowerCase()
                .match(/<[ a-z][a-z0-9]*>/g) || [])
                .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c> )

            var tags = /<\/?( [ a-z][a-z0-9]* )\b[^> ]*>/gi;


            var commentsAndPhpTags = /<!--[ \s\S]*?-->|<\?( ?:php )?[\s\S ]*?\?>/gi;

            return input.replace(commentsAndPhpTags, '')
                .replace(tags, function ($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
        },

        /**
         *  Parse l'URL et récupère les variables passées en GET
         */
        getUrlParams: function (url) {
            var params = {};
            if (url.indexOf('?') > -1) {
                var urlParams = url.split('?')[1];


                var urlVars = urlParams.split('&');


                var dataPair;
                // parcours des couples "variables = valeurs"
                urlVars.forEach(function (element) {
                    dataPair = decodeURIComponent(encodeURIComponent(element)).split('=');
                    if (dataPair.length > 1) {
                        params[dataPair[0]] = dataPair[1];
                    }
                });
            }
            return params;
        },

        /**
         * Encode les virgules d'une chaine de caractères dans un format SCORM
         */
        SCORM_encodeComma: function (input) {
            return typeof (input) === 'string' ? input.split(',').join('[;]') : input;
        },
        /**
         * Décode les virgules d'une chaine de caractères encodée au format SCORM
         */
        SCORM_decodeComma: function (input) {
            return typeof (input) === 'string' ? input.split('[;]').join(',') : input;
        },

        /**
         * Retourne le nombre de caratères de la plus grande chaine au sein du tableau passé en paramètre
         */
        getMaxStringLength: function (array) {
            var n = 0;
            array.slice().forEach(function (element) {
                if (element.length > n) {
                    n = element.length;
                }
            });
            return n;
        },

        getTextWidth: function (text, tag, options) {
            text = text || '';
            tag = tag || 'span';
            var w = 0;


            var $html = $('<' + tag + " id = 'getTextWidth_" + Math.round(Math.random() * 10000000) + "'>" + text + '</' + tag + '>').css('display', 'none');
            if (options) {
                $html.css(options);
            }
            $('body').append($html);
            if (typeof $html.outerWidth() === 'number') {
                w = $html.outerWidth();
            }
            $html.remove();
            return w;
        },

        getTextAreaNumLines: function ($textarea) {
            var taWidth = $textarea.width();


            var entry = $textarea.val();


            var jumps = (entry.split('\n').length) > 0 ? entry.split('\n').length - 1 : 0;


            var totalInlineWidth = this.getTextWidth(entry);
            return Math.ceil(totalInlineWidth / taWidth) + jumps;
        },


        textareaAutoResize: function ($textarea) {
            // Textarea Auto Resize
            var hiddenDiv = $('.hiddendiv').first();
            if (!hiddenDiv.length) {
                hiddenDiv = $('<div class = "hiddendiv common"></div>');
                $('body').append(hiddenDiv);
            }

            var fontFamily = $textarea.css('font-family');
            var fontSize = $textarea.css('font-size');
            var lineHeight = $textarea.css('line-height');

            if (fontSize) {
                hiddenDiv.css('font-size', fontSize);
            }
            if (fontFamily) {
                hiddenDiv.css('font-family', fontFamily);
            }
            if (lineHeight) {
                hiddenDiv.css('line-height', lineHeight);
            }

            // Set original-height, if none
            if (!$textarea.data('original-height')) {
                $textarea.data('original-height', $textarea.height());
            }

            if ($textarea.attr('wrap') === 'off') {
                hiddenDiv.css('overflow-wrap', 'normal')
                    .css('white-space', 'pre');
            }

            hiddenDiv.text($textarea.val() + '\n');
            var content = hiddenDiv.html().replace(/\n/g, '<br>');
            hiddenDiv.html(content);

            if ($textarea.is(':visible')) {
                hiddenDiv.css('width', $textarea.width());
            } else {
                hiddenDiv.css('width', $(window).width() / 2);
            }

            var padTop = parseFloat($textarea.css('padding-top'));


            var padBottom = parseFloat($textarea.css('padding-bottom'));


            var radius = parseFloat($textarea.css('border-top-left-radius'));


            var heightValue = hiddenDiv.height() + /* start ofp add */ padTop + padBottom + radius;

            if ($textarea.data('original-height') <= heightValue) {
                $textarea.css('height', heightValue);
            } else if ($textarea.val().length < $textarea.data('previous-length')) {
                $textarea.css('height', $textarea.data('original-height'));
            }
            $textarea.data('previous-length', $textarea.val().length);
            return this;
        },

        /**
         * Effectue le redimensionnement proportionnel d'un objet par rapport à une largeur et une hauteur maximum.
         * @param img   élément kinetic, jquery, ou javascript à redimensionner
         * @param w     largeur maximum
         * @param h     hauteur maximum
         */
        resizeObjectInBox: function (img, w, h) {
            var coefBox = w / h;


            var getW = function (o) {
                if (typeof (o.getWidth) === 'function') {
                    return o.getWidth();
                } else if (typeof (o.width) === 'function') {
                    return o.width();
                }
                return o.width;
            };


            var getH = function (o) {
                if (typeof (o.getHeight) === 'function') {
                    return o.getHeight();
                } else if (typeof (o.height) === 'function') {
                    return o.height();
                }
                return o.height;
            };


            var setW = function (o, w) {
                if (typeof (o.setWidth) === 'function') {
                    o.setWidth(w);
                } else if (typeof (o.width) === 'function') {
                    o.width(w);
                } else {
                    o.width = w;
                }
                return o;
            };


            var setH = function (o, h) {
                if (typeof (o.setHeight) === 'function') {
                    o.setHeight(h);
                } else if (typeof (o.height) === 'function') {
                    o.height(h);
                } else {
                    o.height = h;
                }
                return o;
            };


            var resizeByHeight = function (o, h) {
                setW(o, (getW(o) / getH(o)) * h);
                setH(o, h);
                return o;
            };


            var resizeByWidth = function (o, w) {
                setH(o, (getH(o) / getW(o)) * w);
                setW(o, w);
                return o;
            };


            var coefImg = getW(img) / getH(img);
            return (coefBox > coefImg) ? resizeByHeight(img, h) : resizeByWidth(img, w);
        },

        getObjectSizeInBox: function (imgRatio, boxW, boxH) {
            var boxRatio = boxW / boxH;
            var getSizeByHeight = function () {
                return {
                    height: boxH,
                    width: imgRatio * boxH
                };
            };
            var getSizeByWidth = function () {
                return {
                    width: boxW,
                    height: boxW / imgRatio
                };
            };
            return (boxRatio > imgRatio) ? getSizeByHeight() : getSizeByWidth();
        },

        // place la sélection sur un élément HTML ( ex: nouveau paragraphe créé, nouvelle ligne... )
        setSelection: function (htmlElement) {
            var selection = window.getSelection();


            var range = document.createRange();
            range.setStart(htmlElement, htmlElement.childElementCount);
            range.setEnd(htmlElement, htmlElement.childElementCount);
            selection.removeAllRanges();
            selection.addRange(range);
            return this;
        },

        /**
         * Retourne une couleur aléatoire au format hexadecimal
         */
        getRandomColor: function () {
            var letters = '0123456789ABCDEF'.split('');


            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        log: function (msg) {
            // eslint-disable-next-line no-console
            console.log('' + msg, arguments.length > 1 ? Array.prototype.slice.call(arguments) : '');
            return this;
        },
        isSSL: function (win) {
            return win.location.href.toLowerCase().indexOf('https://') === 0;
        },

        arrayBufferToBlob: function (arrayBuffer, type) {
            return new Blob([new window.Uint8Array(arrayBuffer)], {
                type: type || 'image/png'
            });
        },

        toQueryString: function (obj) {
            return Object.keys(obj).reduce(function (accumulator, key) {
                return accumulator + (accumulator === '' ? '' : '&') + key + '=' + obj[key];
            }, '');
        },
        toObject: function (queryString) {
            var obj = {};
            var data;
            window.decodeURIComponent(queryString)
                .replace(/.*\?/g, '')
                .split('&')
                .forEach(function (pair) {
                    if (pair.indexOf('=') > -1) {
                        data = pair.split('=');
                        var key = data[0];
                        var value = data[1];
                        if (/\{|\[/.test(value)) {
                            try {
                                value = JSON.parse(value);
                            } catch (error) {
                                value = data[1];
                            }
                        }
                        if (/true|false/i.test(value)) {
                            value = /true/i.test(value);
                        }
                        obj[key] = value;
                    }
                });
            return obj;
        },

        getHiddenProperty: function () {
            if ('hidden' in window.document) {
                return 'hidden';
            }
            var prefixes = ['webkit', 'moz', 'ms', 'o'];
            var property;
            for (var i = 0; i < prefixes.length; i++) {
                property = prefixes[i] + 'Hidden';
                if (property in window.document) {
                    return property;
                }
            }
            return null;
        },
        windowInactive: function () {
            var prop = this.getHiddenProperty();
            return prop ? window.document[prop] : false;
        },

        isMobile: function () {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        getRandomIntInclusive: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        globalToLocal: function ($element, left, top) {
            var position = $element.offset();
            return ({
                left: Math.floor(left - position.left),
                top: Math.floor(top - position.top)
            });
        },

        isRTCPeerConnectionSupported: function () {
            return !!(window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection);
        },

        checkSupportForIce: function (server) {
            var stunServer = server || 'stun:stun.l.google.com:19302';
            var config = [{
                urls: stunServer
            }];
            try {
                var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
                var pc = new RTCPeerConnection(config);
                return pc && !!pc.iceConnectionState;
            } catch (e) {
                return false;
            }
        },

        isWebRtcCompatible: function () {
            try {
                var supportsVideoElement = !!document.createElement('video').canPlayType;
                var supportsVP8 = document.createElement('video').canPlayType('video/webm; codecs = "vp8", vorbis') === 'probably';
                var supportsGetUserMedia = !!(navigator.mozGetUserMedia ||
                    navigator.webkitGetUserMedia ||
                    // navigator.msGetUserMedia        ||
                    navigator.getUserMedia);
                var supportsRTCPeerConnection = Utility.isRTCPeerConnectionSupported();
                var supportsIceCandidates = Utility.checkSupportForIce();

                return supportsVideoElement &&
                    supportsVP8 &&
                    supportsGetUserMedia &&
                    supportsRTCPeerConnection &&
                    supportsIceCandidates;
            } catch (e) {
                return false;
            }
        },

        loadComposition: function (src, container, onCompositionLoaded) {
            if (!container) {
                throw new Error('container is ' + container + ' !');
            }
            if (!(container instanceof HTMLElement)) {
                throw new TypeError('container must be an instance of HTMLElement !');
            }
            var ifr = document.createElement('iframe');
            ifr.id = this.uuidv4();
            ifr.allowFullscreen = true;
            ifr.scrolling = 'no';
            ifr.width = '1px';
            ifr.height = '1px';
            var style = ifr.style;
            style.overflow = 'hidden';
            // style.width = '100%';
            // style.height = '100%';
            style.minWidth = '100%';
            style.minHeight = '100%';
            style.margin = '0px';
            style.border = '0 none';
            style.background = 'rgba(255,255,255,0)';
            var onIframeLoaded = function () {
                this.removeEventListener('load', onIframeLoaded);
                var innerWindow = ifr.contentWindow;

                // s'il s'agit d'un contenu Adobe Edge Animate on ajoute notre callback à la fin du load de la composition
                if (innerWindow.AdobeEdge && typeof innerWindow.AdobeEdge !== 'undefined') {
                    innerWindow.AdobeEdge.bootstrapCallback(function (compId) {
                        var innerComp = innerWindow.AdobeEdge.getComposition(compId);
                        // console.log("TCL: onIframeLoaded -> innerComp._l", innerComp._l);
                        (onCompositionLoaded || function () {}).call({
                            composition: innerComp
                        });
                    });
                } else {
                    (onCompositionLoaded || function () {}).call();
                }
            };
            ifr.addEventListener('load', onIframeLoaded);
            ifr.src = src;
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(ifr);
            return this;
        },

        sortOn: function (property, array) {
            var localToLower = function (param) {
                if (typeof (param) === 'string') {
                    return param.toLowerCase();
                }
                return param;
            };
            return array.slice().sort(function (a, b) {
                if (localToLower(a[property]) > localToLower(b[property])) {
                    return 1;
                }
                if (localToLower(a[property]) < localToLower(b[property])) {
                    return -1;
                }
                return 0;
            });
        },

        shuffle: function (array, max, from, to) {
            var shuffled = [];
            var maxLength = this.isDefined(max) ? Math.min(max, array.length) : array.length;
            var startIndex = this.isDefined(from) ? Math.max(0, from - 1) : 0;
            var endIndex = this.isDefined(to) ? Math.min(to - 1, array.length - 1) : array.length - 1;
            var source = array.slice(startIndex, endIndex + 1);
            while (shuffled.length < maxLength && source.length > 0) {
                var index = this.getRandomIntInclusive(0, source.length - 1);
                shuffled.push(source[index]);
                source.splice(index, 1);
            }
            return shuffled;
        },

        isLocalWindow: function (win) {
            var targetedWindow = win || window;
            return targetedWindow.location.protocol.toLowerCase().indexOf('file') > -1;
        },
        getWindowOrigin: function () {
            return this.isLocalWindow() ? '*' : window.location.protocol + '//' + window.document.domain + ((window.location.port !== '') ? ':' + window.location.port : '');
        },

        isRemoteSCORMContext: function (win) {
            var targetedWindow = win || window;
            try {
                return typeof targetedWindow.ofp_waitForDistantSCORMAPI !== 'undefined'
                    && targetedWindow.ofp_waitForDistantSCORMAPI;
            } catch (error) {
                return false;
            }
        },

        getIframeDocument: function (elementOrselector) {
            var iframe = typeof elementOrselector === 'string'
                ? document.querySelector(elementOrselector)
                : elementOrselector;
            if (iframe) {
                return iframe.contentDocument || iframe.contentWindow.document;
            }
            return null;
        },

        getScriptElement: function (src) {
            var script = document.createElement('script');
            script.src = src;
            script.charset = 'UTF-8';
            return script;
        },

        findOpenerWindow: function (win) {
            var currentWindow = win || window;
            while (!currentWindow.opener &&
                currentWindow.parent &&
                currentWindow.parent !== currentWindow) {
                currentWindow = currentWindow.parent;
            }
            return currentWindow.opener ? currentWindow : null;
        },

        findWindowOwnerOf: function (property, win) {
            var currentWindow = win || window;
            var ownerWindow = this.isDefined(currentWindow[property]) ? currentWindow : null;
            while (!ownerWindow &&
                currentWindow.parent &&
                currentWindow.parent !== currentWindow) {
                currentWindow = currentWindow.parent;
                try {
                    if (this.isDefined(currentWindow[property])) {
                        ownerWindow = currentWindow;
                    }
                } catch (error) {
                    /**/
                }
            }
            return ownerWindow;
        },

        findUpperWindowOwnerOf: function (property, win) {
            var currentWindow = win || window;
            var upper = this.isDefined(currentWindow[property]) ? currentWindow : null;
            while (currentWindow.parent && currentWindow.parent !== currentWindow) {
                currentWindow = currentWindow.parent;
                try {
                    if (this.isDefined(currentWindow[property])) {
                        upper = currentWindow;
                    }
                } catch (error) {
                    /**/
                }
            }
            return upper;
        },

        pad: function (numberOrString) {
            var paddedNumber = Number.parseFloat(numberOrString);
            if (Number.isNaN(paddedNumber)) {
                paddedNumber = 0;
            }
            return paddedNumber < 10 ? '0' + paddedNumber : '' + paddedNumber;
        },

        /**
         * path - A browser fork of node path (posix part only for moment)
         */
        path: (function createPath() {
            // resolves . and .. elements in a path array with directory names there
            // must be no slashes, empty elements, or device names (c:\) in the array
            // (so also no leading and trailing slashes - it does not distinguish
            // relative and absolute paths)
            function normalizeArray(parts, allowAboveRoot) {
                // if the path tries to go above the root, `up` ends up > 0
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === '.') {
                        parts.splice(i, 1);
                    } else if (last === '..') {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }

                // if the path is allowed to go above the root, restore leading ..s
                if (allowAboveRoot) {
                    for (; up--; up) {
                        parts.unshift('..');
                    }
                }

                return parts;
            }

            // Split a filename into [root, dir, basename, ext], unix version
            // 'root' is just a slash, or nothing.
            var splitPathRe =
                /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            var splitPath = function (filename) {
                return splitPathRe.exec(filename).slice(1);
            };

            function filter(xs, f) {
                if (xs.filter) return xs.filter(f);
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    if (f(xs[i], i, xs)) res.push(xs[i]);
                }
                return res;
            }

            // String.prototype.substr - negative index don't work in IE8
            var substr = 'ab'.substr(-1) === 'b' ?
                function (str, start, len) {
                    return str.substr(start, len);
                } :
                function (str, start, len) {
                    if (start < 0) start = str.length + start;
                    return str.substr(start, len);
                };

            var posix = {};

            // path.resolve([from ...], to)
            // posix version
            posix.resolve = function () {
                var resolvedPath = '';
                var resolvedAbsolute = false;

                for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    // var path = (i >= 0) ? arguments[i] : process.cwd();
                    var path = (i >= 0) ? arguments[i] : '';

                    // Skip empty and invalid entries
                    if (typeof path !== 'string') {
                        throw new TypeError('Arguments to path.resolve must be strings');
                    } else if (!path) {
                        continue;
                    }

                    resolvedPath = path + '/' + resolvedPath;
                    resolvedAbsolute = path.charAt(0) === '/';
                }

                // At this point the path should be resolved to a full absolute path, but
                // handle relative paths to be safe (might happen when process.cwd() fails)

                // Normalize the path
                resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
                    return !!p;
                }), !resolvedAbsolute).join('/');

                return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
            };

            // path.normalize(path)
            // posix version
            posix.normalize = function (path) {
                var isAbsolute = posix.isAbsolute(path);


                var trailingSlash = substr(path, -1) === '/';

                // Normalize the path
                path = normalizeArray(filter(path.split('/'), function (p) {
                    return !!p;
                }), !isAbsolute).join('/');

                if (!path && !isAbsolute) {
                    path = '.';
                }
                if (path && trailingSlash) {
                    path += '/';
                }

                return (isAbsolute ? '/' : '') + path;
            };

            // posix version
            posix.isAbsolute = function (path) {
                return path.charAt(0) === '/';
            };

            // posix version
            posix.join = function () {
                var paths = Array.prototype.slice.call(arguments, 0);
                return posix.normalize(filter(paths, function (p, index) {
                    if (typeof p !== 'string') {
                        throw new TypeError('Arguments to path.join must be strings');
                    }
                    return p;
                }).join('/'));
            };


            // path.relative(from, to)
            // posix version
            posix.relative = function (from, to) {
                from = posix.resolve(from).substr(1);
                to = posix.resolve(to).substr(1);

                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== '') break;
                    }

                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== '') break;
                    }

                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }

                var fromParts = trim(from.split('/'));
                var toParts = trim(to.split('/'));

                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break;
                    }
                }

                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push('..');
                }

                outputParts = outputParts.concat(toParts.slice(samePartsLength));

                return outputParts.join('/');
            };

            posix.sep = '/';
            posix.delimiter = ':';

            posix.basename = function (path, ext) {
                var f = splitPath(path)[2];
                // TODO: make this comparison case-insensitive on windows?
                if (ext && f.substr(-1 * ext.length) === ext) {
                    f = f.substr(0, f.length - ext.length);
                }
                return f;
            };


            posix.extname = function (path) {
                return splitPath(path)[3];
            };

            posix.dirname = function (pathh) {
                if (typeof pathh !== 'string') {
                    throw new TypeError('Path must be a string. Received ' + typeof pathh);
                }
                if (pathh.length === 0) {
                    return '.';
                }
                var code = pathh.charCodeAt(0);
                var hasRoot = (code === 47);
                var end = -1;
                var matchedSlash = true;
                for (var i = pathh.length - 1; i >= 1; --i) {
                    code = pathh.charCodeAt(i);
                    if (code === 47) {
                        if (!matchedSlash) {
                            end = i;
                            break;
                        }
                    } else {
                        // We saw the first non-path separator
                        matchedSlash = false;
                    }
                }

                if (end === -1) {
                    return hasRoot ? '/' : '.';
                }
                if (hasRoot && end === 1) {
                    return '//';
                }
                return pathh.slice(0, end);
            };
            return posix;
        }()),

        /**
         * Limit a function execution to a min amount of time
         * @param {function} func The function to execute
         * @param {number} limit The minimum number of seconds between two function execution
         * @returns {undefined}
         */
        limitedExecution: function (func, limit) {
            Utility.__executionHistory = Utility.__executionHistory || {};
            var lastExec = Utility.__executionHistory[func.toString()];
            if (typeof lastExec === 'undefined') {
                lastExec = Utility.__executionHistory[func.toString()] = 0;
            }
            if (new Date().getTime() - lastExec > limit) {
                Utility.__executionHistory[func.toString()] = new Date().getTime();
                func();
            }
        },

        removeTrailingSlash: function (path) {
            if (path.charAt(path.length - 1) === '/') {
                return path.substring(0, path.length - 1);
            }
            return path;
        },

        removeStartingSlash: function (path) {
            if (path.charAt(0) === '/') {
                return path.substring(1, path.length);
            }
            return path;
        },

        createEvent: function (eventName, data) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
            return Object.assign(event, data);
        },

        /**
         * @function hasOwnProperty
         * @description Determines whether an object has a property with the specified name.
         * Shorthand for Object.prototype.hasOwnProperty
         * @param {Object} object The object instance
         * @param {String} property The property name
         * @returns {Boolean} The result
         */
        hasOwnProperty: function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        },

        /**
         * @description An helper to test or remove accents from a string
         */
        Accents: (function createAccents() {
            var chars = Object.keys(CHARACTERS_MAP).join('|');
            var allAccentsRegExp = new RegExp(chars, 'g');
            var firstAccentRegExp = new RegExp(chars, '');

            /**
             * @function remove
             * @description Removes all the accents of a string by replacing each accented
             * character with its equivalent without accent
             * @param {String} string A string that can contain accents
             * @returns {String} The new string without accents
             */
            function remove(string) {
                return string.replace(allAccentsRegExp, function (match) {
                    return CHARACTERS_MAP[match];
                });
            }

            /**
             * @function has
             * @description Determine if a string contains accent(s) or not
             * @param {String} string A string that can contain accents
             * @returns {Boolean} A boolean indicating if the @param string contains accents or not
             */
            function has(string) {
                return !!string.match(firstAccentRegExp);
            }

            return { remove: remove, has: has };
        }()),

        buildIdentifier: function (data) {
            var id = 'id' in data ? data.id : -1;
            var name = 'name' in data ? data.name : 'anonymous';
            return id + '|' + this.Accents.remove(name)
                .replace(/[^A-Za-z0-9_-]+?/g, '');
        }
    };
})();
