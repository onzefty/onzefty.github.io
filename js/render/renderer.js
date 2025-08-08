import { noop } from "../utils/utils.js";
import RendererTime from "./renderer-time.js";
import Render from "./render.js";

let instance;

class Renderer {
    constructor(autoLaunch) {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.renders = {};
        this.time = new RendererTime();

        this.data = {
            started: false,
            waitForActiveRender: false,
            id: 0,
        };

        this.boundUpdate = this.update.bind(this);
        this.boundHandleActiveRender = this.handleActiveRender.bind(this);

        if (autoLaunch !== false) {
            this.launch();
        }
    }

    launch() {
        if (!this.data.started) {
            this.time.startTime = performance.now();
            this.time.currentTime = this.time.startTime;

            this.data.started = true;
            this.data.id = requestAnimationFrame(this.boundUpdate);
        }
    }

    finish() {
        if (this.data.started) {
            cancelAnimationFrame(this.data.id);
            this.data.started = false;
            this.data.waitForActiveRender = false;
        }
    }

    update() {
        if (this.data.waitForActiveRender === true) {
            return;
        }

        const time = performance.now();
        const renders = this.getAll();
        const activeRenders = [];

        renders.forEach((renderData) => {
            if (renderData.active === true) {
                activeRenders.push(renderData);
                return;
            }

            if (renderData.active === false && !renderData.time.pausedTime) {
                renderData.time.pausedTime = time;
            }
        });

        if (activeRenders.length === 0) {
            this.data.waitForActiveRender = true;
            this.time.pausedTime = time;
            return;
        }

        this.setTime(time, this.time);

        activeRenders.forEach((renderData) => {
            if (renderData.launch) {
                this.setTime(time, renderData.time, this.time);

                renderData.fct.call(renderData.context, {
                    name: renderData.name,
                    time: renderData.time,
                });
            } else {
                if (!renderData.time.startTime) {
                    renderData.time.startTime = null;
                    renderData.time.currentTime = null;
                }
            }
        });

        this.data.id = requestAnimationFrame(this.boundUpdate);
    }

    setTime(time, timeData, globalTimeData) {
        const { startTime: baseStartTime, pausedTime } = timeData;
        let timeDiff = 0;

        if (!baseStartTime) {
            timeData.startTime = time;
            timeData.currentTime = time;
        }

        if (pausedTime && baseStartTime) {
            timeDiff = time - pausedTime;

            timeData.localInactiveTime += timeDiff;
        }

        const { localInactiveTime, currentTime, startTime } = timeData;

        if (globalTimeData) {
            timeData.globalElapsed = globalTimeData.localElapsed;
            timeData.globalDelta = globalTimeData.localDelta;
            timeData.globalInactiveTime = globalTimeData.localInactiveTime;
        }

        timeData.localDelta = time - currentTime - timeDiff;
        timeData.currentTime = time;
        timeData.localElapsed = time - startTime - localInactiveTime;
        timeData.pausedTime = null;
    }

    add(data) {
        const renderData = new Render({
            context: this,
        });

        renderData.set(data);

        if (renderData.autoStart) {
            renderData.launch = true;
        }

        if (typeof renderData.fct !== "function") {
            console.warn(`Renderer.add: A renderer without valid function tried to be added. It will be ignored.`);
            return;
        }

        if (renderData.fct === noop) {
            console.warn(`Renderer.add: A renderer without mechanism function tried to be added. It will be ignored.`);
            return;
        }

        const renderDataName = renderData.name;

        if (this.getByName(renderDataName)) {
            console.warn(`Renderer.add: A renderer with name "${renderData.name}" already exists. It will be ignored.`);
            return;
        }

        if (renderData.active) {
            this.handleActiveRender();
        }

        renderData.on(Render.ACTIVE, this.boundHandleActiveRender);

        this.renders[renderDataName] = renderData;
        return renderData;
    }

    remove(renderData) {
        const renderDataName = renderData.name;
        const storedRenderData = this.renders[renderDataName];

        if (storedRenderData) {
            storedRenderData.removeCallback.call(storedRenderData.context, {
                name: renderDataName,
                time: renderData.time,
            });

            storedRenderData.off(Render.ACTIVE, this.boundHandleActiveRender);

            delete this.renders[renderDataName];
        }
    }

    removeByFct(fct) {
        const renderData = this.getByFct(fct);

        if (renderData) {
            this.remove(renderData);
        }
    }

    removeByName(name) {
        const renderData = this.getByName(name);

        if (renderData) {
            this.remove(renderData);
        }
    }

    getAll() {
        return Object.values(this.renders);
    }

    getAllActive() {
        return this.getAll().filter((renderData) => renderData.active === true);
    }

    getAllInactive() {
        return this.getAll().filter((renderData) => renderData.active === false);
    }

    getByFct(fct) {
        return this.getAll().find((renderData) => renderData.fct === fct);
    }

    getByName(name) {
        return this.renders[name];
    }

    clear() {
        this.renders = {};
    }

    handleActiveRender() {
        if (this.data.started === true && this.data.waitForActiveRender === true) {
            this.data.waitForActiveRender = false;
            this.data.id = requestAnimationFrame(this.boundUpdate);
        }
    }
}

export default Renderer;
