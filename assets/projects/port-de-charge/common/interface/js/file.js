
function File(data, index) {
    this.id = -1;
    this.src = '';
    this.title = '';
    this.index = index;
    this.normalized = true;
    this.type = '';

    // statut de la fiche pour le suivi ( na = >not attempted, i=>incomplete, c=>completed )
    this.status = Constants.STATUS_NOT_ATTEMPTED; // "na"

    // composition Edge Animate
    this.aEAComposition = null;

    this.answered = false;
    this.score = 0;

    this.objectiveId = null;

    this.parseData(data);
}

File.prototype.parseData = function (data) {
    var self = this;
    Object.keys(data).forEach(function (key) {
        if ((key in self) && Utility.isDefined(data[ key ])) {
            self[ key ] = data[ key ];
        }
    });
    return this;
};

File.prototype.setScore = function (score) {
    score = parseFloat(score) || 0;
    if (Number.isNaN(score) || score < 0) {
        score = 0;
    }
    this.score = score;
    return this;
};

File.prototype.reset = function () {
    this.status = Constants.STATUS_NOT_ATTEMPTED;
    this.score = 0;
    this.answered = false;
    return this;
};

File.prototype.setStatus = function (status) {
    if (this.status === Constants.STATUS_COMPLETED) { return false; }

    var newStatus;
    switch (status) {
    case Constants.STATUS_NOT_ATTEMPTED :
    case Constants.STATUS_INCOMPLETE :
    case Constants.STATUS_COMPLETED :
        newStatus = status;
        break;
    default :
        newStatus = Constants.STATUS_NOT_ATTEMPTED;
    }
    this.status = newStatus;

    // on considère la fiche/question comme répondue si elle est completed
    if (this.status === Constants.STATUS_COMPLETED) {
        this.answered = true;
    }
    return this;
};


/**
 * anonymous function - description
 *
 * @return {Promise}  description
 */
File.prototype.load = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        try {
            // on masque le contenu Edge Animate pendant le chargement et le redimensionnement mais ATTENTION il ne faut pas utiliser hide() => provoque une erreur avec nos autres composants EdgeCommons, iFrameResizer...
            ofp.content
                .show()
                .hidden();

            Utility.loadComposition(self.src, ofp.content.getDomElement(), function () {
                // on enregistre l'instance de la composition dans une variable liée à l'objet file
                if (this.composition) {
                    self.aEAComposition = this.composition;
                }
                // hack utilisé pour stopper la lecture da la composition ( surtout le son ) qui est en autoplay au chargement afin d'en contrôler le déclenchement
                // self.aEAComposition.getStage( ).stop(self.aEAComposition.getStage().getDuration() );
                ofp.content.getIframeDocument().head.appendChild(Utility.getScriptElement(ofp.iframeResizerContentWindowPath));
                ofp.content.getIframeDocument().body.style.overflow = 'hidden';
                resolve(self.aEAComposition);
            });
        } catch (e) {
            reject(e);
        }
    });
};
