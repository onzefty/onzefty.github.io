function Player() {
    // file actuelle
    this.actualFile = null;
    // tableau des "files" à gérer/charger dans l'interface, il s'agit aussi bien de contenu Captivate que de simples pages HTML
    this.files = [];
}

Player.prototype = {
    load: function() {
        Utility.loadJS('./dataprovider.js')
            .then(
                function() {
                    this.init();
                }.bind(this)
            )
            .catch(function(error) {
                // on remplace le loader par une icone d'erreur
                ofp.showError();
                // eslint-disable-next-line no-console
                console.error(error);
            });

        /*
        $.ajax({
            url: './dataprovider.json',
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.overrideMimeType('application/json');
            },
            success: this.init.bind(this),
            error: function (error) {
                // on remplace le loader par une icone d'erreur
                ofp.showError();
                console.error(error);
            }
        });
        */
    },
    init: function() {
        var self = this;
        var config = this.dataprovider.config;
        var normalizationConfig = config.normalization;
        var protoHasOwnProperty = Object.prototype.hasOwnProperty;

        // création et initialisation des objets files
        this.dataprovider.files.forEach(function(data, index) {
            var file = new File(data, index);
            self.files.push(file);
        });

        // courseType
        if (protoHasOwnProperty.call(this.dataprovider, 'courseType')) {
            if (/^(module|evaluation)$/i.test(this.dataprovider.courseType)) {
                ofp.course.type = this.dataprovider.courseType;
            }
        }

        // tirage aléatoire
        if (protoHasOwnProperty.call(config, 'randomize') && Utility.toBoolean(config.randomize)) {
            self.files = Utility.shuffle(self.files);
        }

        // temps de passation
        if (protoHasOwnProperty.call(config, 'passationTime') && Number.parseFloat(config.passationTime) > 0) {
            ofp.setData('timeLeft', config.passationTime);
        }

        // resumeLastLocation
        var mustRetrieveLocation = (protoHasOwnProperty.call(config, 'resumeLastLocation') && Utility.toBoolean(config.resumeLastLocation)) || self.files.length < 2;

        // tracking enabled ?
        if (protoHasOwnProperty.call(normalizationConfig, 'enabled')) {
            standard.enabled = Utility.toBoolean(normalizationConfig.enabled);
        }

        // save
        if (protoHasOwnProperty.call(normalizationConfig, 'save')) {
            ofp.autoCallSave = Utility.toBoolean(normalizationConfig.save);
        }

        // tutor
        if (!Utility.isLocalWindow() && !Utility.isRemoteSCORMContext() && !Utility.isRemoteSCORMContext(window.parent || {}) && protoHasOwnProperty.call(config, 'tutor') && Utility.toBoolean(config.tutor)) {
            // initialisation du Tutorat ( demande du XML de config mail, chat, visio )
            ofp.tutor.init();
        }

        // noTranslate
        if (protoHasOwnProperty.call(config, 'noTranslate') && Utility.toBoolean(config.noTranslate)) {
            $('head').append('<meta name="google" value="notranslate"/>');
        }

        // noRightClick
        if (protoHasOwnProperty.call(config, 'noRightClick') && Utility.toBoolean(config.noRightClick)) {
            $(window).on('contextmenu', function(e) {
                if (e) {
                    e.preventDefault();
                }
                return false;
            });
        }

        // iframeResizerPath
        if (protoHasOwnProperty.call(config, 'iframeResizerPath') && typeof config.iframeResizerPath === 'string' && config.iframeResizerPath.length > 0) {
            ofp.iframeResizerContentWindowPath = Utility.removeTrailingSlash(ofp.absoluteRootPath) + '/' + Utility.removeStartingSlash(config.iframeResizerPath);
        }

        // =============== SUIVI ===============

        // Initialisation de l'API
        standard.init();

        var promises = [];
        // suspend_data
        var courseData = standard.getCourseData().then(function(course) {
            if (course) {
                self.parseCourseData(course);
            }
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: getCourseData :', course);
            }
        });
        promises.push(courseData);
        // user
        var userData = standard.getUser().then(function(user) {
            Object.assign(ofp.user, user);
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: getUser :', user);
            }
        });
        promises.push(userData);
        // progress
        var courseProgress = standard.getCourseProgress().then(function(progress) {
            ofp.course.progress = progress || 0;
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: getCourseProgress :', progress);
            }
        });
        promises.push(courseProgress);
        // duration
        var courseLocation = standard.getCourseLocation().then(function(location) {
            if (mustRetrieveLocation) {
                ofp.course.location = location || 0;
            }
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: getCourseLocation :', location, ' - ofp.course.location=', ofp.course.location);
            }
        });
        promises.push(courseLocation);
        // score
        var courseScore = standard.getCourseScore().then(function(data) {
            if (data) {
                if (Object.prototype.hasOwnProperty.call(data, 'raw')) {
                    ofp.course.raw_score = data.raw || 0;
                }
                if (Object.prototype.hasOwnProperty.call(data, 'max')) {
                    ofp.course.max_score = data.max || 0;
                }
            }
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: getCourseScore :', data);
            }
        });
        promises.push(courseScore);

        var isCompletedPromise = standard.isCompleted().then(function(completed) {
            ofp.course.completed = completed;
            if (!completed) {
                standard.setCourseStarted();
            }
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('player.js :: standard.isCompleted() :', completed);
            }
        });
        promises.push(isCompletedPromise);

        Promise.all(promises)
            .then(function() {
                self.launch();
            })
            .catch(function(error) {
                self.launch();
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('player.js :: launch xAPI/SCORM data error in Promise.all :', error);
                }
                ofp.errorAlert('Le chargement des données n’a pu aboutir. Veuillez fermer votre contenu et faire une nouvelle tentative ou contacter votre administrateur si cette erreur se produit fréquemment');
            });
    },

    launch: function() {
        ofp.ready = true;
        window.dispatchEvent(Utility.createEvent(Constants.READY, ofp));

        var self = this;

        // fonction à déclencher une fois le chargement terminé
        var onIntroLoaded = function() {
            // 1er redimensionnement
            ofp.resize();
            // masque le loader
            ofp.loader.hide();
        };

        if (Object.prototype.hasOwnProperty.call(this.dataprovider, 'menu') && this.dataprovider.menu !== '') {
            ofp.menu.show();
            Utility.loadComposition(self.dataprovider.menu, ofp.menu.getDomElement(), function() {
                ofp.menu.getIframeDocument().head.appendChild(Utility.getScriptElement(ofp.iframeResizerContentWindowPath));
                ofp.menu.getIframeDocument().body.style.overflow = 'hidden';
                onIntroLoaded();
            });

            // on vérifie si un fichier à utiliser en introduction a été renseignée dans le JSON
        } else if (Object.prototype.hasOwnProperty.call(this.dataprovider, 'home') && this.dataprovider.home !== '') {
            ofp.home.show();
            Utility.loadComposition(self.dataprovider.home, ofp.home.getDomElement(), function() {
                ofp.home.getIframeDocument().head.appendChild(Utility.getScriptElement(ofp.iframeResizerContentWindowPath));
                ofp.home.getIframeDocument().body.style.overflow = 'hidden';
                onIntroLoaded();
            });
        } else {
            self.actualFile = this.getFirstFile();

            if (self.actualFile) {
                self.actualFile.load().then(function(composition) {
                    self.setContentLoaded(composition);
                    onIntroLoaded();
                });
            } else {
                ofp.showError();
                // eslint-disable-next-line no-console
                console.error('Player.js :: self.actualFile is null', self.actualFile);
            }
        }
    },

    getFirstFile: function() {
        var firstFile = this.files[this.files.length > 1 ? ofp.course.location : 0];
        if (ofp.course.type === 'module') {
            // si le module est completed on replace l'apprenant au début
            if (ofp.course.completed) {
                ofp.course.location = 0;
            }
            firstFile = this.files[this.files.length > 1 ? ofp.course.location : 0];

            // ofp.course.type === 'evaluation'
        } else {
            if (!firstFile || firstFile.status === Constants.STATUS_COMPLETED) {
                firstFile = this.getNextFile(firstFile);
            }
        }
        return firstFile;
    },

    /**
     * Appelé lorsque le chargement de la composition est terminé et qu'elle est initialisée
     * @param {Object} composition	Instance de la composition Adobe Edge Animate
     * @returns {undefined}
     */
    setContentLoaded: function(/* composition */) {
        // gestion du statut de la leçon : si elle n'avait pas encore été ouverte on la passe maintenant en "incomplete"
        if (this.actualFile && this.actualFile.status === Constants.STATUS_NOT_ATTEMPTED) {
            this.actualFile.setStatus(Constants.STATUS_INCOMPLETE);
        }

        // 1er redimensionnement
        ofp.resize();

        // on affiche le contenu Edge Animate une fois le chargement et le redimensionnement terminé
        ofp.content.visible();

        // transition qui masque le preloader
        ofp.transitionLoader
            .hide()
            .then(function() {
                // on relance la lecture depuis le début lors de la bascule
                // composition.getStage().play(0 );
            })
            .catch(function(error) {
                // eslint-disable-next-line no-console
                // console.error('error', error);
            });

        // on masque la map
        ofp.home.hide();
        ofp.end.hide();

        this.sendTrackingData();
    },

    /**
     * Envoi des informations de suivi SCORM
     */
    sendTrackingData: function(force) {
        force = typeof force === 'boolean' ? force : false;
        var self = this;

        return standard
            .isCompleted()
            .then(function(completed) {
                if (completed && !force) {
                    if (ofp.debug) {
                        // eslint-disable-next-line no-console
                        console.log('player.js :: sendTrackingData : course already completed => no more data will be sent !');
                    }
                } else {
                    var promises = [];
                    // suspend_data
                    var courseData = standard.setCourseData(self.getCourseData()).then(function() {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log('player.js :: sendTrackingData>setCourseData :', self.getCourseData(), ' => done');
                        }
                    });
                    promises.push(courseData);
                    // location
                    var courseLocation = standard.setCourseLocation(self.getLocationData()).then(function() {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log('player.js :: sendTrackingData>setCourseLocation :', self.getLocationData(), ' => done');
                        }
                    });
                    promises.push(courseLocation);
                    // duration
                    var courseDuration = standard.setCourseDuration().then(function() {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log('player.js :: sendTrackingData>setCourseDuration => done');
                        }
                    });
                    promises.push(courseDuration);
                    // progress
                    var courseProgress = standard.setCourseProgress(self.getProgressMeasure()).then(function() {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log('player.js :: sendTrackingData>setCourseProgress :', self.getProgressMeasure(), ' => done');
                        }
                    });
                    promises.push(courseProgress);
                    return Promise.all(promises);
                }
            })
            .then(function() {
                return ofp.autoCallSave ? standard.save() : Promise.resolve();
            })
            .then(function(result) {
                if (typeof result === 'boolean') {
                    if (!result) {
                        return Promise.reject(new Error('standard.save() failed'));
                    }
                    if (ofp.debug) {
                        // eslint-disable-next-line no-console
                        console.log('player.js :: sendTrackingData>save => done');
                    }
                }
                return true;
            })
            .catch(function(error) {
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('player.js :: sendTrackingData : error', error);
                }
                ofp.errorAlert();
            });
    },

    /**
     * Retourne une fiche en fonction de son index dans le tableau des files
     * @method getFileByIndex
     * @param {Number} index The index wanted
     * @returns {File|null} The corresponding file or null
     */
    getFileByIndex: function(index) {
        return this.files.find(function(_, idx) {
            return idx === index;
        });
    },

    /**
     * Retourne une fiche en fonction se son id
     * @method getFileById
     * @param {Number|String} id The id wanted
     * @returns {File|null} The corresponding file or null
     */
    getFileById: function(id) {
        return this.files.find(function(file) {
            return Number.parseInt(file.id, 10) === Number.parseInt(id, 10);
        });
    },

    /**
     * Retourne une fiche en fonction se son name
     * @method getFileByName
     * @param {String} name The name wanted
     * @returns {File|null} The corresponding file or null
     */
    getFileByName: function(name) {
        return this.files.find(function(file) {
            return file.name.toLowerCase() === name.toLowerCase();
        });
    },

    getNextFile: function(fromFile) {
        var startingFile = fromFile || this.actualFile;
        var index = startingFile ? this.files.indexOf(startingFile) : -1;
        var nextFile = null;
        var file;
        while (this.getNotAnsweredFiles().length > 0 && !nextFile) {
            if (index >= this.files.length - 1) {
                index = 0;
            } else {
                index++;
            }
            file = this.files[index];
            if (file && !file.answered) {
                nextFile = file;
            }
        }
        return nextFile;
    },

    getAnsweredFiles: function() {
        return this.files.filter(function(file) {
            return file.answered;
        });
    },

    getNotAnsweredFiles: function() {
        return this.files.filter(function(file) {
            return !file.answered;
        });
    },

    /**
     * Retourne un tableau contenant les files à prendre en compte dans le suivi ( file dont l'attribut "normalized" est à TRUE dans le JSON )
     */
    getNormalizedFiles: function() {
        return this.files.filter(function(file) {
            return file.normalized;
        });
    },

    getRawScore: function() {
        var autoCalculateScore = Object.prototype.hasOwnProperty.call(this.dataprovider.config.normalization, 'score') && this.dataprovider.config.normalization.score === true;
        var rawScore = this.getNormalizedFiles().reduce(function(accumulator, file) {
            return accumulator + (file.answered ? file.score : 0);
        }, 0);
        if (autoCalculateScore) {
            return rawScore;
        } else if (Utility.isDefined(ofp.course.raw_score) && Utility.isNumeric(ofp.course.raw_score)) {
            rawScore = ofp.course.raw_score;
        }
        return rawScore;
    },

    getMaxScore: function() {
        var autoCalculateScore = Object.prototype.hasOwnProperty.call(this.dataprovider.config.normalization, 'score') && this.dataprovider.config.normalization.score === true;
        var maxScore = this.getNormalizedFiles().length;
        if (autoCalculateScore) {
            return maxScore;
        } else if (Utility.isDefined(ofp.course.max_score) && Utility.isNumeric(ofp.course.max_score)) {
            maxScore = ofp.course.max_score;
        }
        return maxScore;
    },

    /**
     * Retourne une chaine de caractères formatée pour la variable supend_data et contenant le statut de chaque fiche normalisée composant le module
     */
    getCourseData: function() {
        var courseData = this.files.map(function(file) {
            return {
                id: file.id,
                status: file.status,
                score: file.score,
            };
        });
        return {
            course: courseData,
            content: ofp.getContentData(),
            timeLeft: Utility.round(ofp.getData('timeLeft'), 4),
        };
    },

    /**
     * Parse la variable "suspend_data" pour récupérer le statut des files
     */
    parseCourseData: function(courseData) {
        var self = this;
        // temps/chrono
        if (Object.prototype.hasOwnProperty.call(courseData,  'timeLeft')
            && courseData.timeLeft !== null) {
            ofp.setData('timeLeft', courseData.timeLeft);
        }
        // sco suspend_data
        if (Object.prototype.hasOwnProperty.call(courseData, 'content')) {
            ofp.course.content_data = courseData.content || '';
        }
        // files
        if (Object.prototype.hasOwnProperty.call(courseData, 'course')) {
            var file;
            var files = [];
            courseData.course.forEach(function(itemData) {
                file = self.getFileById(itemData.id);
                if (file) {
                    file.setStatus(itemData.status);
                    file.setScore(itemData.score);
                    files.push(file);
                }
            });
            if (files.length > 0) {
                // on sauvegarde les files non normalisées et leur emplacement
                /* var notNormalized = self.files.reduce(function (array, ffile, index) {
                    if (!ffile.normalized) {
                        array.push({ file: ffile, index: index });
                    }
                    return array;
                }, []); */
                self.files = files.slice();
                // on remet les files non normalisées à leur emplacmeent initial
                /*  notNormalized.forEach(function (data) {
                    self.files.splice(data.index, 0, data.file);
                }); */
            }
        }
        return this;
    },

    /**
     * Retourne une chaine de caractères contenant l'emplacement actuel dans le module/l'éval
     */
    getLocationData: function() {
        if (this.dataprovider.config.normalization.location) {
            var location = 0;
            // si le module est composé de plusieurs fiches
            if (this.files.length > 1) {
                if (this.actualFile) {
                    // location = this.actualFile.index;
                    location = this.files.indexOf(this.actualFile);
                }

                // si le module est composé d'une seule fiche on prend la progression à l'intérieur de la fiche
            } else {
                if (this.actualFile && this.actualFile.aEAComposition) {
                    location = this.actualFile.aEAComposition.getStage().getPosition();
                }
            }
            return location;
        }
        return ofp.course.location;
    },

    setLocationData: function(location) {
        ofp.course.location = location;
    },

    /**
     * Retourne le score en pourcentage
     */
    getPercentRawScore: function() {
        var percent = 0;
        if (this.getMaxScore() > 0) {
            percent = Utility.round((this.getRawScore() / this.getMaxScore()) * 100);
        }
        return percent;
    },

    getScaledScore: function() {
        return Utility.round(this.getPercentRawScore() / 100);
    },

    getProgressMeasure: function() {
        if (this.dataprovider.config.normalization.progress) {
            var progress = 0;
            // si le module est composé de plusieurs fiches
            if (this.files.length > 1) {
                progress = this.getProgressScaled();

                // si le module est composé d'une seule fiche on prend la progression à l'intérieur de la fiche
            } else {
                if (self.actualFile && self.actualFile.aEAComposition) {
                    progress = Utility.round((self.actualFile.aEAComposition.getStage().getPosition() / self.actualFile.aEAComposition.getStage().getDuration()) * 100) / 100;
                }
            }
            return Utility.round(progress);
        }
        return Utility.round(this.getProgress());
    },

    getProgress: function() {
        return ofp.course.progress;
    },

    /**
     * Défini le pourcentage de progression actuel
     */
    setProgress: function(scaleProgress) {
        var scaled = Utility.round(scaleProgress) || 0;
        // si la progression définie est supérieure à la valeur enregistrée auparavant, on prend la nouvelle valeur
        if (scaled > ofp.course.progress) {
            ofp.course.progress = scaled;
        }
    },

    /**
     * Retourne la progression actuelle dans le module sous la forme scaled ( compris entre 0 minimum et 1 maximum )
     */
    getProgressScaled: function() {
        if (this.dataprovider.config.normalization.progress) {
            var ps = 0;
            if (this.getProgressMax() > 0) {
                ps = Utility.round(this.getProgressRaw() / this.getProgressMax());
            }
            return ps;
        }
        return Utility.round(ofp.course.progress / 100);
    },

    /**
     * Retourne la progression actuelle dans le module sous la forme d'un nombre brut
     */
    getProgressRaw: function() {
        var self = this;
        var progressRaw = 0;

        // si le module est composé de plusieurs fiches
        if (this.files.length > 1) {
            progressRaw = Utility.round(
                this.getNormalizedFiles().reduce(function(accumulator, file) {
                    return accumulator + (file.status === Constants.STATUS_COMPLETED ? 1 : file.status === Constants.STATUS_INCOMPLETE ? 0.5 : 0);
                }, 0)
            );

            // si le module est composé d'une seule fiche on prend la progression à l'intérieur de la fiche
        } else {
            if (self.actualFile && self.actualFile.aEAComposition) {
                progressRaw = self.actualFile.aEAComposition.getStage().getPosition();
            }
        }
        return progressRaw;
    },

    /**
     * Retourne la progression maximum possible dans le module sous la forme d'un nombre brut
     */
    getProgressMax: function() {
        var self = this;
        var progressMax = 0;

        // si le module est composé de plusieurs fiches
        if (this.files.length > 1) {
            progressMax = this.getNormalizedFiles().length;

            // si le module est composé d'une seule fiche on prend la progression à l'intérieur de la fiche
        } else {
            if (self.actualFile && self.actualFile.aEAComposition) {
                progressMax = self.actualFile.aEAComposition.getStage().getDuration();
            }
        }
        return progressMax;
    },

    courseCompleted: function() {
        if (this.dataprovider.config.normalization.completion) {
            return this.getProgressMeasure() >= 1;
        }
        return ofp.course.completed;
    },

    setCourseCompleted: function(completed) {
        ofp.course.completed = completed;
    },

    courseSucceed: function() {
        if (this.dataprovider.config.normalization.success) {
            var succeed = false;
            // s'il n'y a plus de questions ( éval terminée )
            if (!this.getNextFile()) {
                // si on a un mastery score défini dans le dataprovider
                if (typeof this.dataprovider.config.mastery_score === 'number' && this.dataprovider.config.mastery_score > 0) {
                    succeed = this.getPercentRawScore() >= this.dataprovider.config.mastery_score;

                    // si pas de mastery score ( =100% pour passed )
                } else {
                    succeed = this.getRawScore() >= this.getMaxScore();
                }
            }
            return succeed;
        }
        return ofp.course.succeed;
    },

    setCourseSucceed: function(succeed) {
        ofp.course.succeed = succeed;
    },
};
