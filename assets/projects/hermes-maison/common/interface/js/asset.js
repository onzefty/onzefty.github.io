function Asset(data) {
    AbstractItem.call(this);
    this.duration = -1;

    this.parseData(data);
}
Asset.prototype = new AbstractItem();
Asset.prototype.constructor = this.constructor;


Asset.prototype.open = function () {
    if (/exercis|ce/ig.test(this.type)
        && this.duration > -1
        && this.status !== Constants.STATUS_COMPLETED) {
        OFP.utils.appendExerciceTime(this.duration);
    }
    this.setStatus(Constants.STATUS_COMPLETED);
    window.open(this.src, '_blank');
};
