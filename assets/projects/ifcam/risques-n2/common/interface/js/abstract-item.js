
function AbstractItem() {
    this.id = -1;
    this.src = '';
    this.title = '';
    this.normalized = true;
    this.type = '';

    // statut de la fiche pour le suivi ( na = >not attempted, i=>incomplete, c=>completed )
    this.status = Constants.STATUS_NOT_ATTEMPTED; // "na"
}

AbstractItem.prototype.parseData = function (data) {
    var self = this;
    Object.keys(data).forEach(function (key) {
        if ((key in self) && Utility.isDefined(data[ key ])) {
            self[ key ] = data[ key ];
        }
    });
    return this;
};


AbstractItem.prototype.setStatus = function (status) {
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
    return this;
};

AbstractItem.prototype.reset = function () {
    this.status = Constants.STATUS_NOT_ATTEMPTED;
    return this;
};
