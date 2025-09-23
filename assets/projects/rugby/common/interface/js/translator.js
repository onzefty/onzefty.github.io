(function () {
    /**
     * @description The database {array} that will contains translations objects.
     * See @link translations
     */
    var database = [];
    /**
     * @description The translations {Object} that will contains translation key/value pairs for the
     * selected language (_language)
     */
    var translations = {};
    var _language = 'fr';

    /**
     * @export
     * @class Translator
     */
    function Translator() {}

    Object.defineProperty(Translator, 'language', {
        get: function () {
            return _language;
        },
        set: function (value) {
            if (this.isLanguageValid(value)) {
                _language = value;
                // console.info('Translator language is now ' + Translator.languages[value]) + ' (' + value + ')';
                var lang = database.find(function (translation) {
                    return Object.prototype.hasOwnProperty.call(translation, 'lang')
                        && translation.lang
                        && translation.lang === _language;
                });
                translations = lang ? lang.items : {};
                if (!lang) {
                    console.warn('No translations found in database for language "' + _language + '" !');
                }
            } else {
                console.error(value + ' is not a valid language code ! See Translator.languages');
            }
        }
    });

    /**
     * @method get
     * @description Retrieve a translation text by id
     * @static
     * @param {string} id translation id
     * @returns {string} The text matching the id or id if not found
     */
    Translator.get = function (id) {
        return translations[id] || id;
    };

    /**
     * @method setDatabase
     * @description Set the collection of translation data (retrieved from dataprovider)
     * @static
     * @param {array} data An array of objects containing key/value pairs, one for each lang
     * @returns {Translator} Translator static this
     */
    Translator.setDatabase = function (data) {
        database = data || [];
        this.language = _language;
        return this;
    };

    /**
     * @method isLanguageValid
     * @description Check the validity of a code language. See {@link Translator#languages} for a
     * full list of valid language code.
     * @static
     * @param {string} lang A code language
     * @returns {boolean} The code language validity
     */
    Translator.isLanguageValid = function (lang) {
        return Object.keys(this.languages).indexOf(lang) > -1;
    };

    /**
     * @description A languages {Object} containing key/value pairs for language code in 2 letters
     * format and the corresponding full name.
     * Source @link https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
     */
    Object.defineProperty(Translator, 'languages', {
        enumerable: true,
        writable: false,
        configurable: false,
        value: {
            'aa': 'Afar',
            'ab': 'Abkhazian',
            'ae': 'Avestan',
            'af': 'Afrikaans',
            'ak': 'Akan',
            'am': 'Amharic',
            'an': 'Aragonese',
            'ar': 'Arabic',
            'as': 'Assamese',
            'av': 'Avaric',
            'ay': 'Aymara',
            'az': 'Azerbaijani',
            'ba': 'Bashkir',
            'be': 'Belarusian',
            'bg': 'Bulgarian',
            'bh': 'Bihari',
            'bi': 'Bislama',
            'bm': 'Bambara',
            'bn': 'Bengali',
            'bo': 'Tibetan',
            'br': 'Breton',
            'bs': 'Bosnian',
            'ca': 'Catalan',
            'ce': 'Chechen',
            'ch': 'Chamorro',
            'co': 'Corsican',
            'cr': 'Cree',
            'cs': 'Czech',
            'cu': 'Old Church Slavonic',
            'cv': 'Chuvash',
            'cy': 'Welsh',
            'da': 'Danish',
            'de': 'German',
            'dv': 'Divehi',
            'dz': 'Dzongkha',
            'ee': 'Ewe',
            'el': 'Greek',
            'en': 'English',
            'eo': 'Esperanto',
            'es': 'Spanish',
            'et': 'Estonian',
            'eu': 'Basque',
            'fa': 'Persian',
            'ff': 'Fulah',
            'fi': 'Finnish',
            'fj': 'Fijian',
            'fo': 'Faroese',
            'fr': 'French',
            'fy': 'Western Frisian',
            'ga': 'Irish',
            'gd': 'Scottish Gaelic',
            'gl': 'Galician',
            'gn': 'Guarani',
            'gu': 'Gujarati',
            'gv': 'Manx',
            'ha': 'Hausa',
            'he': 'Hebrew',
            'hi': 'Hindi',
            'ho': 'Hiri Motu',
            'hr': 'Croatian',
            'ht': 'Haitian',
            'hu': 'Hungarian',
            'hy': 'Armenian',
            'hz': 'Herero',
            'ia': 'Interlingua',
            'id': 'Indonesian',
            'ie': 'Interlingue',
            'ig': 'Igbo',
            'ii': 'Sichuan Yi',
            'ik': 'Inupiaq',
            'io': 'Ido',
            'is': 'Icelandic',
            'it': 'Italian',
            'iu': 'Inuktitut',
            'ja': 'Japanese',
            'jv': 'Javanese',
            'ka': 'Georgian',
            'kg': 'Kongo',
            'ki': 'Kikuyu',
            'kj': 'Kwanyama',
            'kk': 'Kazakh',
            'kl': 'Greenlandic',
            'km': 'Khmer',
            'kn': 'Kannada',
            'ko': 'Korean',
            'kr': 'Kanuri',
            'ks': 'Kashmiri',
            'ku': 'Kurdish',
            'kv': 'Komi',
            'kw': 'Cornish',
            'ky': 'Kirghiz',
            'la': 'Latin',
            'lb': 'Luxembourgish',
            'lg': 'Ganda',
            'li': 'Limburgish',
            'ln': 'Lingala',
            'lo': 'Lao',
            'lt': 'Lithuanian',
            'lu': 'Luba',
            'lv': 'Latvian',
            'mg': 'Malagasy',
            'mh': 'Marshallese',
            'mi': 'Māori',
            'mk': 'Macedonian',
            'ml': 'Malayalam',
            'mn': 'Mongolian',
            'mo': 'Moldavian',
            'mr': 'Marathi',
            'ms': 'Malay',
            'mt': 'Maltese',
            'my': 'Burmese',
            'na': 'Nauru',
            'nb': 'Norwegian Bokmål',
            'nd': 'North Ndebele',
            'ne': 'Nepali',
            'ng': 'Ndonga',
            'nl': 'Dutch',
            'nn': 'Norwegian Nynorsk',
            'no': 'Norwegian',
            'nr': 'South Ndebele',
            'nv': 'Navajo',
            'ny': 'Chichewa',
            'oc': 'Occitan',
            'oj': 'Ojibwa',
            'om': 'Oromo',
            'or': 'Oriya',
            'os': 'Ossetian',
            'pa': 'Panjabi',
            'pi': 'Pāli',
            'pl': 'Polish',
            'ps': 'Pashto',
            'pt': 'Portuguese',
            'qu': 'Quechua',
            'rc': 'Reunionese',
            'rm': 'Romansh',
            'rn': 'Kirundi',
            'ro': 'Romanian',
            'ru': 'Russian',
            'rw': 'Kinyarwanda',
            'sa': 'Sanskrit',
            'sc': 'Sardinian',
            'sd': 'Sindhi',
            'se': 'Northern Sami',
            'sg': 'Sango',
            'sh': 'Serbo-Croatian',
            'si': 'Sinhalese',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'sm': 'Samoan',
            'sn': 'Shona',
            'so': 'Somali',
            'sq': 'Albanian',
            'sr': 'Serbian',
            'ss': 'Swati',
            'st': 'Sotho',
            'su': 'Sundanese',
            'sv': 'Swedish',
            'sw': 'Swahili',
            'ta': 'Tamil',
            'te': 'Telugu',
            'tg': 'Tajik',
            'th': 'Thai',
            'ti': 'Tigrinya',
            'tk': 'Turkmen',
            'tl': 'Tagalog',
            'tn': 'Tswana',
            'to': 'Tonga',
            'tr': 'Turkish',
            'ts': 'Tsonga',
            'tt': 'Tatar',
            'tw': 'Twi',
            'ty': 'Tahitian',
            'ug': 'Uighur',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'uz': 'Uzbek',
            've': 'Venda',
            'vi': 'Viêt Namese',
            'vo': 'Volapük',
            'wa': 'Walloon',
            'wo': 'Wolof',
            'xh': 'Xhosa',
            'yi': 'Yiddish',
            'yo': 'Yoruba',
            'za': 'Zhuang',
            'zh': 'Chinese',
            'zu': 'Zulu'
        }
    });
    (Object.freeze || Object)(Translator.languages);

    window.Translator = Translator;
})();
