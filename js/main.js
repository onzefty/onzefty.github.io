import CONFIG from "./config.js";
import App from "./app.js";

const app = new App(CONFIG);

function appReady() {
    
}

app.on(App.READY, appReady);
app.init();
