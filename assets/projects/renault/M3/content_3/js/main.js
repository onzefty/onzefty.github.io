import CONFIG from "./config.js";
import App from "../../../common/content/js/app.js";
import register from "./registers.js";
import screens from "./screens/index.js";

const app = new App(CONFIG);

async function screenShown(event) {
    const { data } = event;
    const { screen } = data;

    console.log(`Screen ${screen.id} was shown`);

    try {
        screens[`screen${screen.id}`](app, data, register());
    } catch (err) {
        console.error(`Error loading screen-${screen.id}.js:`, err);
    }
}

function screenHidden(event) {
    const { data } = event;
    const { screen } = data;

    console.log(`Screen ${screen.id} was hidden`);
}

function appReady() {
    app.screenManager.on(App.SCREEN_SHOWN, screenShown);
    app.screenManager.on(App.SCREEN_HIDDEN, screenHidden);
}

app.on(App.READY, appReady);
app.init();
