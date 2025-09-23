function OFP() {
    var href = window.document.location.href.split('/');
    href.pop();
    var absoluteDirectory = href.join('/');
    this.absoluteRootPath = absoluteDirectory + '/' + '../../';
    if (typeof window.rootPath === 'string') {
        if (/\.\.?\//g.test(window.rootPath)) {
            this.absoluteRootPath = absoluteDirectory + '/' + window.rootPath;
        } else {
            this.absoluteRootPath = window.rootPath;
        }
    }
    this.directory = absoluteDirectory.split('/').pop();

    this.iframeResizerContentWindowPath = Utility.removeTrailingSlash(this.absoluteRootPath) + '/' + Utility.removeStartingSlash(Constants.IFRAME_RESIZER);

    this.debug = false;
    this.player = new Player();
    this.user = {
        id: -1,
        name: 'anonymous',
    };

    this.scale = 1;

    this.course = {
        type: 'module',
        progress: 0,
        _location: 0,
        raw_score: null,
        max_score: null,
        content_data: '',
        completed: null,
        succeed: null,
    };
    this.autoCallSave = true;

    // rétro compatibilité
    this.scorm = {};
    this.scorm.location_data = this.course._location;
    Object.defineProperty(this.course, 'location', {
        get: function() {
            return this.course._location;
        }.bind(this),
        set: function(value) {
            this.course._location = value;
            this.scorm.location_data = value;
        }.bind(this),
    });
    this.scorm_enabled = true;

    this.timer = null;
    this.tutor = new Tutor();
    this.transitionLoader = new TransitionLoader('#transition-loader');

    this.loader = new Displayable('#loader');
    this.rotate = new Displayable('#rotate');
    this.content = new Displayable('#content').hide();
    this.home = new Displayable('#home').hide();
    this.end = new Displayable('#end').hide();
    this.menu = new Displayable('#menu').hide();
    this.popupConfirmation = new Displayable('#popupConfirmation').hide();

    this.__courseExited = false;

    // utilisé pour stocker des paires key/value accessibles dans les fiches
    this._stored = {
        timeLeft: -1, // temps restant d'une éval chronométrée
    };
    // temps total d'une éval chronométrée (variable non mise à jour utilisée pour connaître le temps initial défini)
    Object.defineProperty(this._stored, 'totalTime', {
        enumerable: false,
        get: function() {
            return this.player.dataprovider.config.passationTime;
        }.bind(this),
    });
    // valeur de scale appliquée à la fiche en cours (pour les contenus Adobe Edge Animate redimensionnés par l'interface)
    Object.defineProperty(this._stored, 'scale', {
        enumerable: false,
        writable: true,
        configurable: true,
        value: 1,
    });
    // numéro de la question/file actuelle (en partant de 1)
    Object.defineProperty(this._stored, 'numFile', {
        enumerable: false,
        get: function() {
            // return ofp.player.actualFile ? ofp.player.actualFile.index+1 : 0;	// pour dev : permet d'afficher l'index des questions
            return this.player.actualFile ? this.player.getNormalizedFiles().indexOf(this.player.actualFile) + 1 : 0;
        }.bind(this),
    });
    // nombre total de questions/files
    Object.defineProperty(this._stored, 'totalFile', {
        enumerable: false,
        get: function() {
            return this.player.getNormalizedFiles().length;
        }.bind(this),
    });
    // score actuel brut d'une éval
    Object.defineProperty(this._stored, 'score', {
        enumerable: false,
        get: function() {
            return this.player.getRawScore();
        }.bind(this),
    });
    // score max brut d'une éval
    Object.defineProperty(this._stored, 'maxScore', {
        enumerable: false,
        get: function() {
            return this.player.getMaxScore();
        }.bind(this),
    });
    // résultat global d'une éval (pourcentage)
    Object.defineProperty(this._stored, 'result', {
        enumerable: false,
        get: function() {
            return this.player.getPercentRawScore();
        }.bind(this),
    });

    this.ready = false;
}

/**
 * Redimensionne et positionne tous les éléments
 */
OFP.prototype.resize = function() {
    /**
     * ATTENTION : pour le bon fonctionnement de cette fonction, le stage du contenu Edge Animate doit être paramétré
     * sans centrage automatique ( Scène centrale ) ni redimensionnement automatique ( Mise à l'échelle réactive ) et doit
     * être placé haut à gauche en y/top=0 et x/left=0.
     */

    var Accessor = OFP.utils.Accessor;

    var home = new Accessor($('#home'));
    var content = new Accessor($('#content'));
    var end = new Accessor($('#end'));
    var menu = new Accessor($('#menu'));
    var popupConfirmation = new Accessor($('#popupConfirmation'));

    // redimensionne le contenu edge en prenant 100% de la largeur avec un centrage vertical
    var resizeByWidth = function() {
        // calcul de la position top à appliquer au stage pour obtenir un centrage vertical
        var getTopPosition = function(elem) {
            return (elem.h - elem.eaStage.h * ofp.scale) / 2;
        };

        var doResizeAndReplaceByWidth = function(elem) {
            // calcul de la valeur du scale à appliquer à l'élément
            ofp.scale = elem.w / elem.eaStage.w;
            // on place le point d'origine de la transformation du stage en haut à gauche
            elem.eaStage.el.css({
                'transform-origin': '0 0 0',
            });
            // application du scale
            Utility.setScale(elem.eaStage.el, ofp.scale);

            var top = ofp.mustCenter() ? getTopPosition(elem) : 0;

            // centrage vertical du stage
            elem.eaStage.el.css({
                left: 0 + 'px',
                top: top + 'px',
            });

            // on rétablit la taille de l'iframe à la taille du content ( nécessaire sur IOS sinon l'iframe a une taille trop importante avec des scrolls malgré l'iFrame Resizer )
            var elementIframe = elem.el.find('iframe');
            elementIframe.width(elem.w).height(elem.h);
            if (Utility.isMobile()) {
                // appel de la fonction de redimensionnement de l'iframe pour l'adapter au contenu
                elementIframe.iFrameResize();
            }
        };

        // valeur de depart du scale (1) qui sera augmentée ou diminuée en fonction de l'espace disponible par rapport à la taille d'origine
        ofp.scale = 1;

        [home, content, end, menu, popupConfirmation].forEach(function(elem) {
            if (elem.eaStage.el.length > 0) {
                doResizeAndReplaceByWidth(elem);
            }
        });
    };

    // redimensionne le contenu edge en prenant 100% de la hauteur avec un centrage horizontal
    var resizeByHeight = function() {
        // calcul de la position left à appliquer au stage pour obtenir un centrage horizontal
        var getLeftPosition = function(elem) {
            return (elem.w - elem.eaStage.w * ofp.scale) / 2;
        };

        var doResizeAndReplaceByHeight = function(elem) {
            // calcul de la valeur du scale à appliquer à l'intro
            ofp.scale = elem.h / elem.eaStage.h;
            // on place le point d'origine de la transformation du stage en haut à gauche
            elem.eaStage.el.css({
                'transform-origin': '0 0 0',
            });
            // application du scale
            Utility.setScale(elem.eaStage.el, ofp.scale);

            var left = ofp.mustCenter() ? getLeftPosition(elem) : 0;

            // centrage horizontal du stage
            elem.eaStage.el.css({
                top: 0 + 'px',
                left: left + 'px',
            });
            // on rétablit la taille de l'iframe à la taille du content ( nécessaire sur IOS sinon l'iframe a une taille trop importante avec des scrolls malgré l'iFrame Resizer )
            var elementIframe = elem.el.find('iframe');
            elementIframe.width(elem.w).height(elem.h);
            if (Utility.isMobile()) {
                // appel de la fonction de redimensionnement de l'iframe pour l'adapter au contenu
                elementIframe.iFrameResize();
            }
        };

        // valeur de depart du scale (1) qui sera augmentée ou diminuée en fonction de l'espace disponible par rapport à la taille d'origine
        ofp.scale = 1;

        [home, content, end, menu, popupConfirmation].forEach(function(elem) {
            if (elem.eaStage.el.length > 0) {
                doResizeAndReplaceByHeight(elem);
            }
        });
    };

    var resetStageTransform = function(elem) {
        elem.eaStage.el.css({
            '-webkit-transform': '',
            '-moz-transform': '',
            '-ms-transform': '',
            '-o-transform': '',
            transform: '',
        });
    };

    var resizeByHeightAfterWidth = function(elem) {
        if (elem.eaStage.h * ofp.scale > elem.h) {
            resizeByHeight.call();
        }
    };

    var checkOrientation = function() {
        this.rotate[Utility.isPortrait() && Utility.isMobile() && this.noMobilePortrait() ? 'show' : 'hide']();
        // this.rotate[ Utility.isPortrait() ? 'show' : 'hide' ]();
    }.bind(this);

    // on commence par réinitialiser la transformation appliquée au stage de l'intro/menu et du contenu
    [home, content, end, menu, popupConfirmation].forEach(function(elem) {
        resetStageTransform(elem);
    });

    switch (this.getResizeMode()) {
        case 'scale':
            // appel de la fonction de redimensionnement par la largeur
            resizeByWidth.call();

            // redimensionne par la hauteur après l'avoir fait par la largeur mais uniquement si le contenu est trop grand et donc est tronqué sur les parties supérieures et inférieures
            [home, content, end, menu, popupConfirmation].forEach(function(elem) {
                resizeByHeightAfterWidth(elem);
            });
            break;
        case 'truncate':
            resizeByHeight.call();
            break;
        default:
            break;
    }

    // fonction de vérification de l'orientation d'un périphérique mobile,
    // on affiche une message si l'affichage n'est pas en mode paysage
    checkOrientation();
};

OFP.prototype.getUser = function() {
    return this.user;
};

OFP.prototype.showError = function() {
    // affiche le loader avant de le modifier
    this.loader.empty().show();
    // on remplace le loader CSS par une image SVG d'erreur
    this.loader.removeClass().addClass('error');
};

OFP.prototype.close = function() {
    var exit = function() {
        var win = Utility.findWindowOwnerOf('ofpSCOExit');
        if (win) {
            win.ofpSCOExit();
        } else {
            win = Utility.findOpenerWindow();
            if (win) {
                win.close();
            } else {
                // if ( pf ofp ) {

                if (window.history.length > 1) {
                    window.history.go(-1);
                } else {
                    // eslint-disable-next-line no-alert
                    window.alert('Vous pouvez désormais fermer votre fenêtre.');
                }
            }
        }
    };

    if (this.__courseExited) {
        exit();
    } else {
        standard.quit().then(
            function() {
                this.__courseExited = true;
                exit();
            }.bind(this)
        );
    }
};
OFP.prototype.quit = OFP.prototype.quitQuick = OFP.prototype.close;

OFP.prototype.toggleMenu = function() {
    this.menu.toggle();
};

OFP.prototype.openMenu = function() {
    this.menu.show();
};

OFP.prototype.closeMenu = function() {
    this.menu.hide();
};

OFP.prototype.getStatus = function() {
    return this.player && this.player.actualFile ? this.player.actualFile.status : 'na';
};

/**
 * 	Défini le statut de la leçon/mission actuelle ( appelé depuis les fiches )
 */
OFP.prototype.setStatus = function(status) {
    if (this.player.actualFile !== null) {
        this.player.actualFile.setStatus(status);
    }

    var allCompleted = this.player.getNormalizedFiles().every(function(file) {
        return file.status === Constants.STATUS_COMPLETED;
    });

    if (allCompleted) {
        this.setCourseCompleted();
    }
};

/**
 * Retourne le score actuel
 */
OFP.prototype.getRawScore = function() {
    return this.player.getRawScore();
};
OFP.prototype.getScore = OFP.prototype.getRawScore;

OFP.prototype.getMaxScore = function() {
    return this.player.getMaxScore();
};

/**
 * Set the course raw (and possibly max) score
 * @method setScore
 * @param {Number} score the course raw score
 * @param {Number} maxscore the course max score (default to 100)
 * @param {Boolean} force param to bypass the completed status to force recording
 * @return {undefined}
 */
OFP.prototype.setScore = function(score, maxscore, force) {
    score = Number.parseFloat(score);
    maxscore = Number.parseFloat(maxscore);
    force = typeof force === 'boolean' ? force : false;

    if (Number.isNaN(score) || score < 0) {
        score = 0;
    }
    if (Number.isNaN(maxscore) || maxscore < 0) {
        maxscore = 100;
    }

    if (score > maxscore && maxscore > 0) {
        // eslint-disable-next-line no-console
        console.warn('Attention : le score (' + score + ') est supérieur au score max (' + maxscore + ') => le score a donc été ramené au max');
        score = maxscore;
    }

    this.course.raw_score = this.course.raw_score ? (score > this.course.raw_score ? score : this.course.raw_score) : score;
    this.course.max_score = this.course.max_score ? (maxscore > this.course.max_score ? maxscore : this.course.max_score) : maxscore;

    // on vérifie le statut de la course, si completed on envoie pas de données
    return standard
        .isCompleted()
        .then(function(completed) {
            if (completed && !force) {
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: setScore : course already completed => no more data will be sent !');
                }
            } else {
                // score
                return standard
                    .setCourseScore({
                        raw: ofp.course.raw_score,
                        max: ofp.course.max_score,
                    })
                    .then(function() {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log(
                                'ofp.js :: setScore>setCourseScore :',
                                {
                                    raw: ofp.course.raw_score,
                                    max: ofp.course.max_score,
                                },
                                ' => done'
                            );
                        }
                    });
            }
        })
        .then(function() {
            var dataprovider = ofp.getDataProvider();
            var dataproviderSuccess = dataprovider.config.normalization.success;
            if (ofp.player.getProgressMeasure() >= 1 && dataproviderSuccess) {
                var masteryScore = typeof dataprovider.config.mastery_score === 'number' ? dataprovider.config.mastery_score : 100;
                return ofp.player.getPercentRawScore() >= masteryScore ? ofp.setCoursePassed() : ofp.setCourseFailed();
            }
            return Promise.resolve();
        })
        .then(function() {
            return ofp.sendTrackingData(force);
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: setScore : error', error);
            }
            ofp.errorAlert();
        });
};

/**
 * Appel de la fonction d'envoi des informations SCORM du player si le SCORM est actif
 */
OFP.prototype.sendTrackingData = function(force) {
    if (this.player) {
        return this.player.sendTrackingData(force);
    }
    return false;
};
OFP.prototype.sendToLMS = OFP.prototype.sendTrackingData;

OFP.prototype.setQuestionScore = function(score, force) {
    force = typeof force === 'boolean' ? force : false;
    if (this.player && this.player.actualFile) {
        var file = this.player.actualFile;
        // on set le score obtenu et on passe la file à completed quand répondue
        file.setScore(score).setStatus(Constants.STATUS_COMPLETED);

        this.setScore(this.getRawScore(), this.getMaxScore(), force);

        // envoi interaction SCORM
        this.sendInteraction({
            id: file.id,
            type: 'other',
            objectiveId: file.objectiveId,
            correctResponse: '',
            studentResponse: '',
            weighting: 1,
            result: score,
            description: file.title,
        });

        var objective = this.getObjectiveById(file.objectiveId);
        if (objective) {
            var scoreMax = this.getObjectiveFiles(objective.id).length;
            var scoreRaw = this.getObjectiveFiles(objective.id).filter(function(ffile) {
                return ffile.score > 0;
            }).length;
            var answered = this.getObjectiveFiles(objective.id).filter(function(ffile) {
                return ffile.answered === true;
            }).length;
            var mastery_score = typeof objective.mastery_score === 'number' ? objective.mastery_score : scoreMax;

            this.sendObjective({
                id: objective.id,
                scoreMin: 0,
                scoreMax: scoreMax,
                scoreRaw: scoreRaw,
                success_status: answered >= scoreMax ? (scoreRaw >= mastery_score ? 'passed' : 'failed') : 'unknown',
                completion_status: answered >= scoreMax ? 'completed' : 'incomplete',
                progress_measure: Utility.round(answered / scoreMax),
                description: objective.title,
            });
        }
    }
};

OFP.prototype.terminateEvaluation = function() {
    if (this.timer) {
        this.timer.stop();
    }

    if (this.player) {
        this.player.getNormalizedFiles().forEach(
            function(file) {
                if (file.status !== Constants.STATUS_COMPLETED) {
                    file.setScore(0);
                    file.setStatus(Constants.STATUS_COMPLETED);

                    // { id, type, objectiveId, correctResponse, studentResponse, weighting, result, description }
                    this.sendInteraction({
                        id: file.id,
                        type: 'other',
                        objectiveId: file.objectiveId,
                        correctResponse: '',
                        studentResponse: '',
                        weighting: 1,
                        result: 0,
                        description: file.title,
                    });

                    var objective = this.getObjectiveById(file.objectiveId);
                    if (objective) {
                        var scoreMax = this.getObjectiveFiles(objective.id).length;
                        var scoreRaw = this.getObjectiveFiles(objective.id).filter(function(ffile) {
                            return ffile.score > 0;
                        }).length;
                        var answered = this.getObjectiveFiles(objective.id).filter(function(ffile) {
                            return ffile.answered === true;
                        }).length;
                        var mastery_score = typeof objective.mastery_score === 'number' ? objective.mastery_score : scoreMax;

                        this.sendObjective({
                            id: objective.id,
                            scoreMin: 0,
                            scoreMax: scoreMax,
                            scoreRaw: scoreRaw,
                            success_status: answered >= scoreMax ? (scoreRaw >= mastery_score ? 'passed' : 'failed') : 'unknown',
                            completion_status: answered >= scoreMax ? 'completed' : 'incomplete',
                            progress_measure: Utility.round(answered / scoreMax),
                            description: objective.title,
                        });
                    }
                }
            }.bind(this)
        );
        // pour les files qui ne sont pas "normalized"
        this.player.files.forEach(function(file) {
            if (file.status !== Constants.STATUS_COMPLETED) {
                file.setStatus(Constants.STATUS_COMPLETED);
            }
        });
        this.setScore(this.getRawScore(), this.getMaxScore());
        this.openNextFile();
    }

    return this;
};

OFP.prototype.openFirstFile = function() {
    if (this.player) {
        var firstFile = this.player.getFirstFile();
        if (firstFile) {
            this.openFile(firstFile);
        }
    }
    return this;
};

OFP.prototype.openNextFile = function() {
    if (this.player) {
        var nextFile = this.player.getNextFile();
        if (nextFile) {
            if ((this.player.actualFile && nextFile.id !== this.player.actualFile.id) || !this.player.actualFile) {
                this.openFile(nextFile);
            }
        } else {
            // Afficher page de fin avec le score et boutons :

            var self = this;
            self.transitionLoader
                .show()
                .then(function() {
                    var dataprovider = self.player.dataprovider;
                    if (Object.prototype.hasOwnProperty.call(dataprovider, 'end') && dataprovider.end !== '') {
                        ofp.end.show();
                        Utility.loadComposition(dataprovider.end, ofp.end.getDomElement(), function() {
                            ofp.end.getIframeDocument().head.appendChild(Utility.getScriptElement(ofp.iframeResizerContentWindowPath));
                            ofp.end.getIframeDocument().body.style.overflow = 'hidden';
                            ofp.resize();

                            ofp.home.hide();
                            ofp.content.hide();
                            ofp.transitionLoader
                                .hide()
                                .then(function() {})
                                .catch(function(error) {
                                    // eslint-disable-next-line no-console
                                    // console.error('error', error);
                                });
                        });
                    }
                })
                .catch(function(error) {
                    // eslint-disable-next-line no-console
                    // console.error('error', error);
                });

            // cas ou l'évaluation au complet est intégrée comme file dans une autre interface,
            // on passe le statut de cette file à "completed" et on envoie le score
            if (parent && typeof parent.ofp === 'object') {
                if (typeof parent.ofp.setStatus === 'function') {
                    parent.ofp.setStatus('c');
                }
                if (typeof parent.ofp.setScore === 'function') {
                    parent.ofp.setScore(this.getRawScore(), this.getMaxScore(),true);
                }
            }
        }
    }
    return this;
};

OFP.prototype.getObjectiveFiles = function(objectiveId) {
    return this.player
        ? this.player.getNormalizedFiles().filter(function(file) {
              return file.objectiveId === objectiveId;
          })
        : [];
};

OFP.prototype.getData = function(key) {
    if (key in this._stored) {
        return this._stored[key];
    }
    return null;
};

OFP.prototype.setData = function(key, value) {
    if (Object.keys(this._stored).indexOf(key) > -1 && Utility.isDefined(value)) {
        this._stored[key] = value;
    }
    return this;
};

/**
 * Appel de la fonction d'envoi d'une interaction SCORM du player
 */
OFP.prototype.sendInteraction = function(data) {
    standard
        .isCompleted()
        .then(
            function(completed) {
                if (completed) {
                    if (ofp.debug) {
                        // eslint-disable-next-line no-console
                        console.log('ofp.js :: sendInteraction : course already completed => no more data will be sent !');
                    }
                } else {
                    if (this.player) {
                        if (this.player.actualFile && Object.prototype.hasOwnProperty.call(data, 'result')) {
                            var score;
                            if (typeof data.result === 'number') {
                                score = data.result;
                            } else {
                                score = data.result === 'correct' ? 1 : 0;
                            }
                            this.player.actualFile.setScore(score);
                        }
                    }
                    return standard.sendInteraction(data);
                }
            }.bind(this)
        )
        .then(function(result) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: sendInteraction : result', result);
            }
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: sendInteraction : error', error);
            }
            ofp.errorAlert();
        });
};
OFP.prototype.sendInteractionToLMS = OFP.prototype.sendInteraction;

/**
 * Appel de la fonction d'envoi d'un objectif SCORM du player
 */
OFP.prototype.sendObjective = function(data) {
    standard
        .isCompleted()
        .then(function(completed) {
            if (completed) {
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: sendObjective : course already completed => no more data will be sent !');
                }
            } else {
                return standard.sendObjective(data);
            }
        })
        .then(function(result) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: sendObjective : result', result);
            }
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: sendObjective : error', error);
            }
            ofp.errorAlert();
        });
};
OFP.prototype.sendObjectiveToLMS = OFP.prototype.sendObjective;

/**
 * 	Positionne la tête de lecture de la fiche actuelle à l'emplacement passé en paramètre
 */
OFP.prototype.seekTo = function(position) {
    if (this.player.actualFile && this.player.actualFile.aEAComposition) {
        this.player.actualFile.aEAComposition.getStage().play(position);
    }
};

var stopIframeAudio = function(iframe) {
    if (!iframe) {
        return false;
    }
    Utility.toArray(Utility.getIframeDocument(iframe).querySelectorAll('audio')).forEach(function(audio) {
        try {
            audio.pause();
            if (audio.currentTime) {
                audio.currentTime = 0;
            }
        } catch (e) {
            /**/
        }
    });
    return true;
};

OFP.prototype.openFile = function(file) {
    // parcours de toutes les balises audio pour couper les sons/voix éventuellement en cours de lecture lors de l'ouverture d'un fiche
    stopIframeAudio(this.content.getDomElement().firstChild);
    stopIframeAudio(this.home.getDomElement().firstChild);

    var player = this.player;
    var menu = this.menu;
    // transition qui affiche le preloader
    ofp.transitionLoader
        .show()
        .then(function() {
            menu.hide();
            player.actualFile = file;
            return player.actualFile.load();
        })
        .then(function(composition) {
            player.setContentLoaded(composition);
        })
        .catch(function(error) {
            // eslint-disable-next-line no-console
            // console.error('error', error);
        });
};

/**
 * 	Charge une fiche en fonction de son identifiant dans le XML du module
 */
OFP.prototype.openFileById = function(id) {
    this.openFile(this.player.getFileById(id));
};

/**
 * 	Charge une fiche en fonction de son attribut name dans le XML du module
 */
OFP.prototype.openFileByName = function(name) {
    this.openFile(this.player.getFileByName(name));
};

OFP.prototype.courseCompleted = function() {
    return this.player.courseCompleted();
};
OFP.prototype.getCompletionStatus = OFP.prototype.courseCompleted;

OFP.prototype.courseSucceed = function() {
    return this.player.courseSucceed();
};
OFP.prototype.getSuccessStatus = OFP.prototype.courseSucceed;

OFP.prototype.getCourseLocation = function(location) {
    return this.player.getLocationData(location);
};
OFP.prototype.getSCOLocation = OFP.prototype.getCourseLocation;

OFP.prototype.setCourseLocation = function(location) {
    this.player.setLocationData(location);
    return this.player.sendTrackingData();
};
OFP.prototype.setSCOLocation = OFP.prototype.setCourseLocation;

OFP.prototype.resetSCO = function() {
    /**
     * TODO : fonction à adapter pour la nouvelle interface, à tester en live pour modifications
     */

    this.course.succeed = null;
    this.course.completed = null;
    this.course.content_data = '';
    this.course.raw_score = 0;
    this.course._location = 0;
    this.course.progress = 0;

    this.player.files.forEach(function(file) {
        file.reset();
    });

    standard.setCourseScore({ raw: 0 });
    this.player.sendTrackingData();
    // temps de passation
    if (this.player.dataprovider.config.passationTime > 0) {
        this.setData('timeLeft', this.player.dataprovider.config.passationTime);
    }
    this.openFile(this.player.files[0]);
};

/**
 * Défini le statut du SCO comme "completed" en considérant toutes les fiches comme vues
 */
OFP.prototype.setCourseCompleted = function() {
    if (this.player) {
        // on vérifie le statut du module et on défini la variable "scorm.enabled", si le module est complété on envoie pas de données SCORM
        return standard
            .isCompleted()
            .then(
                function(completed) {
                    if (completed) {
                        if (ofp.debug) {
                            // eslint-disable-next-line no-console
                            console.log('ofp.js :: setCourseCompleted : course already completed => no more data will be sent !');
                        }
                    } else {
                        this.player.files.forEach(function(file) {
                            file.setStatus(Constants.STATUS_COMPLETED);
                        });
                        var promises = [];
                        // suspend_data
                        var courseData = standard.setCourseData(this.player.getCourseData()).then(function() {
                            if (ofp.debug) {
                                // eslint-disable-next-line no-console
                                console.log('ofp.js :: setCourseCompleted>setCourseData :', ofp.player.getCourseData(), ' => done');
                            }
                        });
                        promises.push(courseData);
                        // location
                        var courseLocation = standard.setCourseLocation(this.player.getLocationData()).then(function() {
                            if (ofp.debug) {
                                // eslint-disable-next-line no-console
                                console.log('ofp.js :: setCourseCompleted>setCourseLocation :', ofp.player.getLocationData(), ' => done');
                            }
                        });
                        promises.push(courseLocation);
                        // duration
                        var courseDuration = standard.setCourseDuration().then(function() {
                            if (ofp.debug) {
                                // eslint-disable-next-line no-console
                                console.log('ofp.js :: setCourseCompleted>setCourseDuration => done');
                            }
                        });
                        promises.push(courseDuration);
                        // progress
                        var courseProgress = standard.setCourseProgress(this.player.getProgressMeasure()).then(function() {
                            if (ofp.debug) {
                                // eslint-disable-next-line no-console
                                console.log('ofp.js :: setCourseCompleted>setCourseProgress :', ofp.player.getProgressMeasure(), ' => done');
                            }
                        });
                        promises.push(courseProgress);
                        // completion
                        var courseCompleted = standard.setCourseCompleted().then(function() {
                            if (ofp.debug) {
                                // eslint-disable-next-line no-console
                                console.log('ofp.js :: setCourseCompleted>setCourseCompleted => done');
                            }
                        });
                        promises.push(courseCompleted);
                        return Promise.all(promises);
                    }
                }.bind(this)
            )
            .then(function() {
                return ofp.autoCallSave ? standard.save() : Promise.resolve();
            })
            .then(function(result) {
                // rétro compatibilté
                ofp.scorm_enabled = false;

                if (typeof result === 'boolean') {
                    if (!result) {
                        return Promise.reject(new Error('standard.save() failed'));
                    }
                    if (ofp.debug) {
                        // eslint-disable-next-line no-console
                        console.log('ofp.js :: setCourseCompleted>save => done');
                    }
                }
            })
            .catch(function(error) {
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: setCourseCompleted : error', error);
                }
                ofp.errorAlert();
            });
    }
};
OFP.prototype.setSCOCompleted = OFP.prototype.setCourseCompleted;

OFP.prototype.setCoursePassed = function() {
    return standard
        .setCoursePassed()
        .then(function() {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: setCoursePassed>setCoursePassed => done');
            }
            return ofp.autoCallSave ? standard.save() : Promise.resolve();
        })
        .then(function(result) {
            if (typeof result === 'boolean') {
                if (!result) {
                    return Promise.reject(new Error('standard.save() failed'));
                }
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: setCoursePassed>save => done');
                }
            }
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: setCoursePassed : error', error);
            }
            ofp.errorAlert();
        });
};
OFP.prototype.setSCOSuccessful = OFP.prototype.setCoursePassed;

OFP.prototype.setCourseFailed = function() {
    return standard
        .setCourseFailed()
        .then(function() {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: setCourseFailed>setCourseFailed => done');
            }
            return ofp.autoCallSave ? standard.save() : Promise.resolve();
        })
        .then(function(result) {
            if (typeof result === 'boolean') {
                if (!result) {
                    return Promise.reject(new Error('standard.save() failed'));
                }
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: setCourseFailed>save => done');
                }
            }
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: setCourseFailed : error', error);
            }
            ofp.errorAlert();
        });
};
OFP.prototype.setSCOFailed = OFP.prototype.setCourseFailed;

OFP.prototype.getCourseProgress = function() {
    return ofp.course.progress;
};
OFP.prototype.getSCOProgress = OFP.prototype.getCourseProgress;

OFP.prototype.setCourseProgress = function(scaleProgress) {
    if (this.player) {
        this.player.setProgress(scaleProgress);
        return this.player.sendTrackingData();
    }
};
OFP.prototype.setSCOProgress = OFP.prototype.setCourseProgress;

OFP.prototype.save = function() {
    return standard
        .save()
        .then(function(result) {
            if (typeof result === 'boolean') {
                if (!result) {
                    return Promise.reject(new Error('standard.save() failed'));
                }
                if (ofp.debug) {
                    // eslint-disable-next-line no-console
                    console.log('ofp.js :: save => done');
                }
            }
            return true;
        })
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.log('ofp.js :: save : error', error);
            }
            ofp.errorAlert();
        });
};

// présent uniquement pour rétro-compatibilité, géré directement par chaque Wrapper (xAPI/SCORM)
OFP.prototype.updateInteractionTimer = function() {};

OFP.prototype.suspendEvaluation = function() {
    this.player
        .sendTrackingData()
        .then(function() {
            return standard.quit();
        })
        .then(
            function() {
                this.__courseExited = true;
                ofp.close();
            }.bind(this)
        )
        .catch(function(error) {
            if (ofp.debug) {
                // eslint-disable-next-line no-console
                console.warn('ofp.js :: sendTrackingData : error', error);
            }
        });

    return this;
};

OFP.prototype.getDataProvider = function() {
    return this.player && this.player.dataprovider ? this.player.dataprovider : {};
};

OFP.prototype.getTitle = function() {
    var dataprovider = this.getDataProvider();
    return Object.prototype.hasOwnProperty.call(dataprovider, 'title') ? dataprovider.title : '';
};

OFP.prototype.getFromDataProvider = function(key) {
    var dataprovider = this.getDataProvider();
    return Object.prototype.hasOwnProperty.call(dataprovider, key) ? dataprovider[key] : null;
};

OFP.prototype.getObjectiveById = function(id) {
    var dataprovider = this.getDataProvider();
    return Object.prototype.hasOwnProperty.call(dataprovider, 'objectives') && dataprovider.objectives
        ? dataprovider.objectives.find(function(objective) {
              return objective.id === id;
          })
        : null;
};

OFP.prototype.getResizeMode = function() {
    var dataprovider = this.getDataProvider();
    var mode = 'truncate';
    var has = Object.prototype.hasOwnProperty;
    var config = has.call(dataprovider, 'config') && dataprovider.config ? dataprovider.config : { resize: 'truncate' };
    if (has.call(config, 'resize') && /^(truncate|scale|none)$/i.test(config.resize)) {
        mode = config.resize;
    }
    return mode;
};

OFP.prototype.mustCenter = function() {
    var dataprovider = this.getDataProvider();
    var has = Object.prototype.hasOwnProperty;
    var config = has.call(dataprovider, 'config') && dataprovider.config ? dataprovider.config : { center: true };
    if (has.call(config, 'center')) {
        return Utility.toBoolean(config.center);
    }
    return true;
};

OFP.prototype.noMobilePortrait = function() {
    var dataprovider = this.getDataProvider();
    var has = Object.prototype.hasOwnProperty;
    var config = has.call(dataprovider, 'config') && dataprovider.config ? dataprovider.config : { noMobilePortrait: true };
    if (has.call(config, 'noMobilePortrait')) {
        return Utility.toBoolean(config.noMobilePortrait);
    }
    return true;
};

/**
 * Retourne le suspend_data du SCO ( c.à.dire la partie correspondant aux fiche(s) et ne dépendant pas de l'interface, utilisé par les concepteurs pour enregistrer des données )
 */
OFP.prototype.getContentData = function() {
    return this.course.content_data;
};
OFP.prototype.getSCOSuspendData = OFP.prototype.getContentData;

/**
 *  Défini le suspend_data du SCO ( c.à.dire la partie correspondant aux fiche(s) et ne dépendant pas de l'interface, utilisé par les concepteurs pour enregistrer des données )
 */
OFP.prototype.setContentData = function(contentData) {
    this.course.content_data = contentData || '';
    return this.player.sendTrackingData();
};
OFP.prototype.setSCOSuspendData = OFP.prototype.setContentData;

OFP.prototype.updateMenuData = function(data) {
    if (this.menu.getIframeWindow()) {
        var updateData = Utility.extend(true, data || {}, { type: 'update-menu-message' });
        this.menu.getIframeWindow().postMessage(updateData, Utility.getWindowOrigin());
    }
};

OFP.prototype.postToContent = function(data) {
    if (this.content.getIframeWindow()) {
        var postData = Utility.extend(true, data || {}, { type: 'data-post-message' });
        this.content.getIframeWindow().postMessage(postData, Utility.getWindowOrigin());
    }
};

OFP.prototype.postMessage = function(data) {
    if (window.parent) {
        window.parent.postMessage(data, Utility.getWindowOrigin());
    }
};

OFP.prototype.addMessageListener = function(handler) {
    $(window)
        .off('message')
        .on('message', function(e) {
            var evt = e.originalEvent;
            // si on est pas en local ( pour dev ) on vérifie l'origine du message
            if (!Utility.isLocalWindow() && evt.origin !== Utility.getWindowOrigin()) {
                // eslint-disable-next-line no-console
                console.error("Le message ne sera pas traité car son émetteur n'est pas celui attendu. Emetteur : ", evt.origin, 'Attendu : ', Utility.getWindowOrigin());
                return false;
            }
            return (handler || function() {}).call(this, evt);
        });
};

OFP.prototype.openEvaluation = function() {
    var evaluation = this.player.files.find(function(file) {
        return file.type === 'evaluation';
    });
    if (evaluation) {
        // parcours de toutes les balises audio pour couper les sons/voix éventuellement en cours de lecture lors de l'ouverture d'un fiche
        stopIframeAudio(this.content.getDomElement().firstChild);
        stopIframeAudio(this.home.getDomElement().firstChild);

        this.menu.hide();

        var p = this.player;
        p.actualFile = evaluation;
        if (p.actualFile) {
            p.actualFile.load().then(function(composition) {
                p.setContentLoaded(composition);
            });
        }
    }
};

OFP.prototype.getFiles = function() {
    return this.player.files.slice();
};
OFP.prototype.getPlayerSuspendData = OFP.prototype.getFiles;

OFP.prototype.openAssetById = function(id) {
    var assets = this.getDataProvider().assets;
    if (assets.length > 0) {
        var asset = assets.find(function(assett) {
            return assett.id === id;
        });
        window.open(asset.src, '_blank');
    }
};

OFP.prototype.errorAlert = function(message) {
    Utility.limitedExecution(
        function() {
            var norm = this.getDataProvider().config.normalization;
            var enabled = Object.prototype.hasOwnProperty.call(norm, 'errorAlert') ? norm.errorAlert : true;
            if (enabled) {
                Toaster.dismissAll().toast(message || 'La sauvegarde intermédiaire n’a pu aboutir. Si cette erreur se produit fréquemment veuillez fermer votre contenu et retenter plus tard ou contacter votre administrateur', { icon: 'warning', classes: 'ofp-toast' });
            }
        }.bind(this),
        1000
    );
};

OFP.prototype.openFileFromIdentifier = function(identifier) {
    if (typeof standard !== 'undefined') {
        if (standard.type === 'SCORM') {
            var standardWrapper = standard.wrapper;
            if (standardWrapper) {
                standardWrapper.setADLNavigationRequest(identifier);
            }
        }
    }
    this.close();
    return this;
};

OFP.prototype.getQueryString = function() {
    return Utility.toObject(window.location.search);
};

OFP.utils = {};
OFP.utils._initializationTime = new Date().getTime();
OFP.utils.getSessionTime = function() {
    return new Date().getTime() - this._initializationTime;
};

OFP.utils._interactionTime = new Date().getTime();
OFP.utils.getInteractionTime = function() {
    var elapsed = new Date().getTime() - this._interactionTime;
    this._interactionTime = new Date().getTime();
    return elapsed;
};

// Helper utilisé dans la fonction de redimensionnement
OFP.utils.Accessor = function($elem) {
    this.$elem = $elem;
};
OFP.utils.Accessor.prototype = {
    get el() {
        return this.$elem;
    },
    get eaStage() {
        var self = this;
        return {
            get el() {
                return self.$elem
                    .find('iframe')
                    .contents()
                    .find('#Stage');
            },
            get w() {
                return this.el.width();
            },
            get h() {
                return this.el.height();
            },
        };
    },
    get w() {
        return this.$elem.width();
    },
    get h() {
        return this.$elem.height();
    },
};

Utility.mix(OFP, window.EmitterMixin);
