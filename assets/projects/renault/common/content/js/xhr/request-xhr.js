import EmitterMixin from "../emitter/emitter-mixin.js";
import { MIME_TYPES } from "../utils/utils.js";

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.onabort = () => reject(new Error("Read aborted"));

        reader.readAsDataURL(blob);
    });
}

function normalizeHeaderName(name) {
    const nameParts = name.toLowerCase().trim().split("-");
    const namePascalKebab = nameParts.map((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    return namePascalKebab.join("-");
}

function configRequest(request, config) {
    const contentType = MIME_TYPES[config.contentType] || "text/plain";
    const requestHeaders = config.requestHeaders;
    const auth = config.auth;
    const requestHeadersLength = requestHeaders.length;

    let authType = false;

    switch (config.return) {
        case "json":
            request.responseType = "json";
            break;
        case "buffer":
            request.responseType = "arraybuffer";
            break;
        case "uri":
        case "blob":
            request.responseType = "blob";
            break;
        case "html":
            request.responseType = "document";
            break;
        default:
            request.responseType = "";
    }

    if (typeof auth === "string") {
        authType = "oAuth";
    }

    if (Array.isArray(auth)) {
        authType = "basic";
    }

    if (config.CORS === true) {
        request.withCredentials = true;
    }

    request.setRequestHeader("Content-Type", contentType);

    if (requestHeaders && requestHeadersLength > 0) {
        for (let i = 0; i < requestHeadersLength; i++) {
            const header = requestHeaders[i];
            const headerName = normalizeHeaderName(header.name);

            xhr.setRequestHeader(headerName, header.value);
        }
    }

    if (authType) {
        let authstr = "";

        if (authType === "oAuth") {
            authstr = "Bearer " + auth;
        } else {
            authstr = "Basic " + btoa(auth[0] + ":" + auth[1]);
        }

        xhr.setRequestHeader("Authorization", authstr);
    }
}

export default class RequestXHR extends EmitterMixin {
    static get SUCCESS() {
        return "RequestXHR.success";
    }

    static get CANCELLED() {
        return "RequestXHR.cancelled";
    }

    static get ERROR() {
        return "RequestXHR.error";
    }

    constructor(options) {
        super();

        this.config = {
            url: "/",
            async: true,
            contentType: "txt", // All supported mime types from utils
            requestHeaders: [], // NOTE { name : "headerName", value : "headerValue" }
            auth: false, // NOTE oAuth (put Bearer token) or Basic (put an array with user and pwd) or false
            return: null, // "json", "buffer", "uri", "blob", "html" all other value will result as "text" | NOTE: "html" will return Document or XMLDocument depending of received data
            CORS: false,
            ...options,
        };

        this.sender = new XMLHttpRequest();
        this.error = false;

        this.boundHandleLoad = this.handleLoad.bind(this);
        this.boundHandleError = this.handleError.bind(this);

        return this;
    }

    get() {
        this.sender.open("GET", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    post() {
        this.sender.open("POST", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    put() {
        this.sender.open("PUT", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    patch() {
        this.sender.open("PATCH", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    delete() {
        this.sender.open("DELETE", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    head() {
        this.sender.open("HEAD", this.config.url, this.config.async);
        configRequest(this.sender, this.config);

        return this;
    }

    handleLoad() {
        const result = this.result();

        this.emit(RequestXHR.SUCCESS, result);
    }

    handleError(errorData) {
        if (this.sender.status === 404) {
            this.error = {
                error: "Not found",
            };
        } else if (this.sender.status !== 200 && this.sender.status !== 0) {
            this.error = errorData;
        } else {
            return;
        }

        const result = this.result();

        this.emit(RequestXHR.ERROR, result);
    }

    send(body) {
        this.error = false;

        this.sender.onload = this.boundHandleLoad;
        this.sender.onerror = this.boundHandleError;
        this.sender.onloadend = this.boundHandleError;

        if (body) {
            this.sender.send(body);
        } else {
            this.sender.send();
        }

        if (!this.config.async) {
            return this.result();
        }
    }

    close() {
        this.sender.onload = null;
        this.sender.onerror = null;
        this.sender.onloadend = null;

        this.sender.abort();

        this.emit(RequestXHR.CANCELLED);
    }

    result() {
        const data = {};
        const request = this.sender;
        const headersString = request.getAllResponseHeaders();
        const headersArray = headersString.trim().split("\r\n");
        const headers = {};

        for (let i = 0; i < headersArray.length; i++) {
            const header = headersArray[i];
            const headerParts = header.split(":");
            const key = headerParts.shift();
            const value = headerParts.join(":");

            headers[normalizeHeaderName(key)] = value.trim();
        }

        data.status = request.status;
        data.headers = headers;

        let response = request.response;

        switch (this.config.return) {
            case "uri":
                response = blobToDataURL(response);
                break;
        }

        data.response = response;

        if (this.error) {
            data.error = this.error.error;
        }

        return data;
    }
}
