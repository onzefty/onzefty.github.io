import EmitterMixin from "../../emitter/emitter-mixin.js";
import { getRandomID } from "../../utils/utils.js";

const privateProperties = {};

function parseChunk(chunk) {
    if (!chunk || chunk.length === 0) {
        return null;
    }

    const FIELD_SEPARATOR = ":";
    const lines = chunk.split(/\n|\r\n|\r/);
    const data = { id: null, retry: null, data: "" };

    lines.forEach((line) => {
        const trimedLine = line.trimRight();
        const index = trimedLine.indexOf(FIELD_SEPARATOR);

        if (index <= 0) {
            // Line was either empty, or started with a separator and is a comment.
            // Either way, ignore.
            return;
        }

        const field = trimedLine.substring(0, index);

        if (field in data) {
            const fieldValue = trimedLine.substring(index + 1).trimLeft();

            if (field === "data") {
                data[field] += fieldValue;
            } else {
                data[field] = fieldValue;
            }
        }
    });

    return data;
}

export default class ServerSendEvent extends EmitterMixin {
    static get STATE() {
        return {
            INITIALIZING: -1,
            CONNECTING: 0,
            OPEN: 1,
            CLOSED: 2,
        };
    }

    static get EVENTS() {
        return {
            READYSTATECHANGE: "ServerSendEvent.readystatechange",
            ERROR: "ServerSendEvent.error",
            ABORT: "ServerSendEvent.abort",
            OPEN: "ServerSendEvent.open",
            MESSAGE: "ServerSendEvent.message",
        };
    }

    constructor(url, options) {
        super();

        const defaultOptions = {
            headers: {},
            payload: "",
            method: "GET",
            withCredentials: false,
        };

        this.id = getRandomID();

        privateProperties[this.id] = {};
        privateProperties[this.id].xhr = null;
        privateProperties[this.id].progress = 0;
        privateProperties[this.id].chunk = "";

        this.url = url;
        this.options = {
            ...defaultOptions,
            ...options,
        };

        if (this.options.payload && !options.method) {
            this.options.method = "POST";
        }

        this.state = this.INITIALIZING;

        this.boundHandleStreamLoad = this.handleStreamLoad.bind(this);
        this.boundHandleStreamState = this.handleStreamState.bind(this);
        this.boundHandleStreamProgress = this.handleStreamProgress.bind(this);
        this.boundHandleStreamError = this.handleStreamError.bind(this);
        this.boundHandleStreamAbort = this.handleStreamAbort.bind(this);
    }

    handleStreamLoad(event) {
        if (this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        this.handleStreamProgress(event);
    }

    handleStreamState(event) {
        if (this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        const xhr = event.currentTarget;

        if (xhr.readyState === XMLHttpRequest.DONE) {
            this.close(xhr);
        }
    }

    handleStreamProgress(event) {
        if (this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        const xhr = event.currentTarget;

        if (xhr.status !== 200) {
            this.handleStreamError(event);
            return;
        }

        if (this.state == this.CONNECTING) {
            this.state = ServerSendEvent.STATE.OPEN;

            this.emit(ServerSendEvent.EVENTS.READYSTATECHANGE, {
                state: readyState,
            });
        }

        const progress = privateProperties[this.id].progress;
        const response = xhr.responseText.substring(progress);
        const responseSplitted = response.split(/(\r\n|\r|\n){2}/g);

        privateProperties[this.id].progress += response.length;

        responseSplitted.forEach((responsePart) => {
            const str = responsePart.trim();

            if (str.length === 0) {
                const message = parseChunk(privateProperties[this.id].chunk);

                this.emit(ServerSendEvent.EVENTS.MESSAGE, {
                    message: message,
                });

                privateProperties[this.id].chunk = "";
            } else {
                privateProperties[this.id].chunk += str;
            }
        });
    }

    handleStreamError(event) {
        if (this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        const xhr = event.currentTarget;

        this.emit(ServerSendEvent.EVENTS.ERROR, {
            message: xhr.response,
        });

        this.close(xhr);
    }

    handleStreamAbort() {
        if (this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        this.emit(ServerSendEvent.EVENTS.ABORT);

        this.close(xhr);
    }

    stream() {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener("load", this.boundHandleStreamLoad);
        xhr.addEventListener("progress", this.boundHandleStreamProgress);
        xhr.addEventListener("readystatechange", this.boundHandleStreamState);
        xhr.addEventListener("error", this.boundHandleStreamError);
        xhr.addEventListener("abort", this.boundHandleStreamAbort);

        xhr.open(this.options.method, this.url);

        for (var header in this.options.headers) {
            xhr.setRequestHeader(header, this.options.headers[header]);
        }

        xhr.withCredentials = this.options.withCredentials;

        xhr.send(this.options.payload);

        this.state = ServerSendEvent.STATE.CONNECTING;

        this.emit(ServerSendEvent.EVENTS.READYSTATECHANGE, {
            state: this.state,
        });

        privateProperties[this.id].xhr = xhr;
    }

    close(xhr = privateProperties[this.id].xhr) {
        if (!xhr || this.state === ServerSendEvent.STATE.CLOSED) {
            return;
        }

        xhr.removeEventListener("load", this.boundHandleStreamLoad);
        xhr.removeEventListener("progress", this.boundHandleStreamProgress);
        xhr.removeEventListener("readystatechange", this.boundHandleStreamState);
        xhr.removeEventListener("error", this.boundHandleStreamError);
        xhr.removeEventListener("abort", this.boundHandleStreamAbort);

        xhr.abort();

        privateProperties[this.id].xhr = null;

        this.state = ServerSendEvent.STATE.CLOSED;

        this.emit(ServerSendEvent.EVENTS.READYSTATECHANGE, {
            state: this.state,
        });
    }
}
