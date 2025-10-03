export default class RendererTime {
    constructor() {
        this.startTime;
        this.currentTime;
        this.pausedTime;
        this.globalElapsed = 0;
        this.globalDelta = 0;
        this.globalInactiveTime = 0;
        this.localElapsed = 0;
        this.localDelta = 0;
        this.localInactiveTime = 0;
    }
}
