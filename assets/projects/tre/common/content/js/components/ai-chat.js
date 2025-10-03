import ServerSendEvent from "./xhr/server-send-event.js";
import { marked } from "../lib/marked/marked.min.js";
import globalConfig from "./ai-chat-globals.js";

export default class AIChat {
    constructor(options) {
        this.config = {
            url: globalConfig.endPoint,
            prompt: "",
            systemPrompt: "",
            useGlobalPrompt: true,
            aiStopKeywords: [],
            ...options,
            gptConfig: {
                model: "gpt-4o",
                maxTokens: 1000,
                temperature: 1,
                stream: false,
                timeout: 30000,
                ...options?.gptConfig,
            },
        };

        delete this.config.gptConfig.messages;
        delete this.config.gptConfig.stop;

        this.sse = null;
        this.payload = null;
        this.abortController = null;
        this.timeoutID = null;
    }

    initSSE() {
        if (this.sse || !this.config.gptConfig.stream) return;

        const stringifiedPayload = JSON.stringify(this.payload);

        this.sse = new ServerSendEvent(globalConfig.baseURL + this.config.url, {
            headers: { "Content-Type": "text/plain" },
            payload: stringifiedPayload,
        });
    }

    isPromptValid(prompt) {
        if (typeof prompt !== "string") {
            return false;
        }

        if (!prompt.trim()) {
            return false;
        }

        return true;
    }

    createPayload() {
        if (this.payload) return;

        const { aiStopKeywords, prompt, systemPrompt } = this.config;

        let userMessages = [];
        let systemMessages = [];
        let stopKeywords = [];

        if (Array.isArray(aiStopKeywords)) {
            stopKeywords = aiStopKeywords.filter((keyword) => typeof keyword === "string");
        } else if (typeof aiStopKeywords === "string") {
            stopKeywords = [config.aiStopKeywords];
        }

        if (Array.isArray(prompt)) {
            userMessages = prompt
                .filter((message) => this.isPromptValid(message))
                .map((message) => {
                    return { role: "user", content: message.trim() };
                });
        } else if (this.isPromptValid(prompt)) {
            userMessages = [{ role: "user", content: prompt.trim() }];
        }

        if (Array.isArray(systemPrompt)) {
            systemMessages = systemPrompt
                .filter((message) => this.isPromptValid(message))
                .map((message) => {
                    return { role: "system", content: message.trim() };
                });
        } else if (this.isPromptValid(systemPrompt)) {
            systemMessages = [{ role: "system", content: systemPrompt.trim() }];
        }

        const messages = [];

        if (globalConfig.prompt && this.config.useGlobalPrompt) {
            messages.push({
                role: "system",
                content: globalConfig.prompt,
            });
        }

        this.payload = {
            stop: [...stopKeywords],
            messages: messages.concat([...systemMessages, ...userMessages]),
            ...this.config.gptConfig,
        };
    }

    send(messageCallback, endCallback) {
        this.createPayload();
        this.initSSE();

        let aiMessageCallback = messageCallback;
        let aiEndCallback = endCallback;
        let aiMessage = "";

        if (typeof messageCallback !== "function") {
            aiMessageCallback = () => {};
        }

        if (typeof endCallback !== "function") {
            aiEndCallback = () => {};
        }

        if (this.config.gptConfig.stream && this.sse) {
            const setupTimeout = () => {
                if (this.config.gptConfig.timeout) {
                    this.timeoutID = setTimeout(() => {
                        this.sse.close();
                    }, this.config.gptConfig.timeout);
                }
            };

            this.sse.on(ServerSendEvent.EVENTS.MESSAGE, (event) => {
                const { data } = event;
                const { message } = data;

                clearTimeout(this.timeoutID);

                if (!message) {
                    aiMessageCallback({
                        message: aiMessage,
                        parsed: marked(aiMessage),
                    });
                    return;
                }

                try {
                    const payload = JSON.parse(message.data);

                    if (payload && payload.text) {
                        aiMessage += payload.text;
                    }
                } catch (error) {
                    console.error("Failed to parse message.", error);
                }

                aiMessageCallback({
                    message: aiMessage,
                    parsed: marked(aiMessage),
                });

                setupTimeout();
            });

            this.sse.on(ServerSendEvent.EVENTS.READYSTATECHANGE, (event) => {
                const { data } = event;
                const { state } = data;

                clearTimeout(this.timeoutID);

                setupTimeout();

                if (state === ServerSendEvent.STATE.CLOSED) {
                    aiEndCallback({
                        message: aiMessage,
                        parsed: marked(aiMessage),
                    });
                }
            });

            this.sse.stream();
        } else if (!this.config.gptConfig.stream) {
            this.abortController = new AbortController();

            if (this.config.gptConfig.timeout) {
                this.timeoutID = setTimeout(() => {
                    this.abortController?.abort("Request timed out.");
                }, this.config.gptConfig.timeout);
            }

            fetch(globalConfig.baseURL + this.config.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.payload),
                signal: this.abortController.signal,
            })
                .then((response) => response.json())
                .then((response) => {
                    const result = response.result.choices[0].message.content;

                    clearTimeout(this.timeoutID);

                    aiEndCallback({
                        message: result,
                        parsed: marked(result),
                    });
                })
                .catch((error) => {
                    clearTimeout(this.timeoutID);

                    aiEndCallback({
                        message: "",
                        parsed: "",
                        error: error,
                    });

                    console.error("Failed to fetch data.", error);
                });
        }
    }

    cancel() {
        if (this.payload) {
            this.payload = null;
        }

        clearTimeout(this.timeoutID);

        if (this.sse) {
            this.sse.close();
            this.sse = null;
        } else {
            this.abortController?.abort("Request cancelled.");
            this.abortController = null;
        }
    }
}
