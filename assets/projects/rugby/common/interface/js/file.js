function File(data, index) {
    AbstractItem.call(this);

    this.index = index;

    // composition Edge Animate
    this.aEAComposition = null;

    this.answered = false;
    this.score = 0;

    this.objectiveId = null;

    this.parseData(data);
}
File.prototype = new AbstractItem();
File.prototype.constructor = this.constructor;


File.prototype.setScore = function (score) {
    score = parseFloat(score) || 0;
    if (Number.isNaN(score) || score < 0) {
        score = 0;
    }
    this.score = score;
    return this;
};

File.prototype.reset = function () {
    AbstractItem.prototype.reset.call(this);
    this.score = 0;
    this.answered = false;
    return this;
};

File.prototype.setStatus = function (status) {
    AbstractItem.prototype.setStatus.call(this, status);

    // on considère la fiche/question comme répondue si elle est completed
    if (this.status === Constants.STATUS_COMPLETED) {
        this.answered = true;
    }
    return this;
};


/**
 * @method load
 * @return {Promise<Composition|Error>} Promise resolved when loaded or rejected with error
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
                if (ofp.getResizeMode() !== "none") {
                    ofp.content.getIframeDocument().head.appendChild(Utility.getScriptElement(ofp.iframeResizerContentWindowPath));
                }

                if (ofp.applyOverflowOnBody() === true) {
                    ofp.content.getIframeDocument().body.style.overflow = 'hidden';
                }
                
                resolve(self.aEAComposition);
            });
        } catch (e) {
            reject(e);
        }
    });
};
