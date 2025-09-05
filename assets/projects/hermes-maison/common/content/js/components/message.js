const callbacks = [];
const protocol = location.protocol;
const port = location.port;
const hostname = location.hostname;
const localProtocol = protocol.toLowerCase() === "file:";

let origin = "*";
let instance = null;
let listening = false;

if (!localProtocol) {
    origin = `${protocol}//${hostname}${port ? ":" + port : ""}`;
}

class Message {
    constructor() {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.isLocal = localProtocol;
        this.protocol = protocol;
        this.origin = origin;
        this.port = port;
        this.hostname = hostname;

        this.boundHandleListenMessage = this.handleListenMessage.bind(this);
    }

    get listening() {
        return listening;
    }

    sendTo(target, data) {
        if (!target) {
            console.warn("[Message warning] : Cancelled sendTo due invalid target.");
            return;
        }

        let targetWin = target;

        if (targetWin.window !== targetWin) {
            if (targetWin.contentWindow) {
                targetWin = target.contentWindow;
            } else {
                console.warn("[Message warning] : Cancelled sendTo due invalid target.");
                return;
            }
        }

        targetWin.postMessage(data, this.origin);
    }

    send(data) {
        this.sendTo(window, data);
    }

    listen(callback = () => {}) {
        if (typeof callback === "function") {
            callbacks.push(callback);
        }

        if (this.listening === false) {
            listening = true;

            window.addEventListener("message", this.boundHandleListenMessage);
        }
    }

    handleListenMessage(event) {
        const { origin, data } = event;
        const callbacksLength = callbacks.length;

        if (!this.isLocal && origin != this.origin) {
            console.warn("[Message warning] : Ignore received message due bad origin.");
            console.warn(`[Message warning - details] : Expected "${this.origin}" but got "${origin}"`);
            return;
        }

        for (let i = 0; i < callbacksLength; i++) {
            const callback = callbacks[i];

            callback(data);
        }
    }

    stopListening() {
        listening = false;
        callbacks.length = 0;

        window.removeEventListener("message", this.boundHandleListenMessage);
    }
}

export default Message;
