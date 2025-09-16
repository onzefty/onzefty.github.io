import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const elements = {};
elements.main = document.querySelector("#main");
elements.header = elements.main.querySelector('header');
elements.nav = elements.header.querySelector("nav");
elements.buttonMenu = elements.header.querySelector("#button-menu");

const handleIntersection = ([entry],observer) => {
    if (!entry.isIntersecting) {
        elements.header.classList.add('fixed');
    } else {
        elements.header.classList.remove('fixed');
    }
};

const handleMenuToggle = () => {
    const state = elements.nav.getAttribute("state");
    elements.nav.setAttribute("state",state==="close"?"open":"close");
};

const observer = new IntersectionObserver(handleIntersection,{
    root: elements.main,
    rootMargin: '0px'
});

elements.main.addEventListener(EVENTS.SCROLL, () => {
    if (elements.main.scrollTop <= elements.header.offsetHeight) {
        elements.header.classList.remove('fixed');
    } 
});

elements.buttonMenu.addEventListener(EVENTS.CLICK_TOUCH,handleMenuToggle);

observer.observe(elements.header);

function appReady() {
    console.log("App is ready");
}

app.on(App.READY, appReady);
app.init();
