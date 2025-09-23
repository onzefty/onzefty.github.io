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
        toBoolean: function (value) {
            var t = typeof value;
            switch (t) {
                //typeof new String("true") === "object", so handle objects as string via fall-through. 
                //See https://github.com/pipwerks/scorm-api-wrapper/issues/3
                case "object":
                case "string":
                    return (/(true|1)/i).test(value);
                case "number":
                    return !!value;
                case "boolean":
                    return value;
                case "undefined":
                    return null;
                default:
                    return false;
            }
        },
        loadJS: function (src, context) {
            return new Promise(function (resolve, reject) {
                var doc = context || window.document;
                var js = doc.createElement('script');
                js.onload = resolve;
                js.onerror = reject;
                js.async = true;
                js.src = src;
                doc.getElementsByTagName('head')[0].appendChild(js);
            });
        },
        round: function (number, precision) {
            var p = Math.pow(10, precision || 2);
            return Math.round(number * p) / p;
        },

        isTouchEvent: function (e) {
            return e.type.toLowerCase().indexOf('touch') > -1;
        },
        getMouseOrTouchEvent: function (e) {
            return Utility.isTouchEvent(e) ? e.originalEvent.touches[0] : e;
        },
        stripTags: function (input, allowed) {
            allowed = (((allowed || '') + '')
                .toLowerCase()
                .match(/<[a-z][a-z0-9]*>/g) || [])
                .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
            var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

            return input
                .replace(commentsAndPhpTags, '')
                .replace(tags, function ($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
        },

        /**
         *  Parse l'URL et récupère les variables passées en GET
         */
        getUrlParams: function (url) {
            var params = {};
            if (url.indexOf("?") > -1) {
                var urlParams = url.split("?")[1],
                    urlVars = urlParams.split("&"),
                    dataPair;
                // parcours des couples "variables=valeurs"
                urlVars.forEach(function (element, index, arr) {
                    dataPair = decodeURIComponent(element).split("=");
                    if (dataPair.length > 1) {
                        params[dataPair[0]] = dataPair[1];
                    }
                });
            }
            return params;
        },
        log: function (msg) {
            console.log('' + msg, arguments.length > 1 ? Array.prototype.slice.call(arguments, arguments.callee.length) : '');
        },
        isSSL: function (win) {
            return win.location.href.toLowerCase().indexOf('https://') == 0;
        },
        toObject: function (queryString) {
            var obj = {};
            var data;
            window.decodeURIComponent(queryString)
                .replace(/^[^?]*\?/g, '')
                .split('&')
                .forEach(function (pair) {
                    if (pair.indexOf('=') > -1) {
                        data = pair.split('=');
                        if (data[1].indexOf('{') > -1) {
                            data[1] = JSON.parse(data[1]);
                        }
                        obj[data[0]] = data[1];
                    }
                });
            return obj;
        },

        ajax: function (url, dataType) {
            return new Promise(function (resolve, reject) {
                var xhr = window.XMLHttpRequest ?
                    new XMLHttpRequest() :
                    new ActiveXObject('Microsoft.XMLHTTP');

                var type = 'application/x-www-form-urlencoded; charset=UTF-8';
                var completed = false;
                var accept = '*/*';

                switch (dataType) {
                    case 'text':
                        type = 'text/plain';
                        break;
                    case 'json':
                        type = 'application/json, text/javascript';
                        break;
                    case 'html':
                        type = 'text/html';
                        break;
                    case 'xml':
                        type = 'application/xml, text/xml';
                        break;
                    default:
                        break;
                }

                if (type !== 'application/x-www-form-urlencoded') {
                    accept = type + ', */*; q=0.01';
                }

                if (xhr) {
                    xhr.open('GET', url, true);
                    xhr.setRequestHeader('Accept', accept);
                    xhr.onreadystatechange = function onreadystatechange() {
                        // Ignore repeat invocations
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

        hasOwnProperty: function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        },

        isPlainObject: function (o) {
            return !!o && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
        },

        isDefined: function(value) {
            return value !== null && typeof value !== 'undefined';
        },

        isPropertyDefined: function (el, property, type) {
            var elDefined = !!el && this.hasOwnProperty(el, property)
                && el[property] !== null
                && el[property] !== undefined;
            if (elDefined && typeof type === 'string') {
                var lType = type.toLowerCase();
                var value = el[property];
                if (lType === 'object') {
                    return this.isPlainObject(value);
                }
                if (lType === 'array') {
                    return Array.isArray(value);
                }
                return typeof value === lType;
            }
            return elDefined;
        },

        getRandomIntInclusive: function (min, max) {
            var minn = Math.ceil(min);
            var maxx = Math.floor(max);
            return Math.floor(Math.random() * (maxx - minn + 1)) + minn;
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

        guid: function (length) {
            var chars = '0123456789abcdef'.split('');
            var guid = '';
            while (guid.length < (length || 32)) {
                guid += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            return guid;
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
