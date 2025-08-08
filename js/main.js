import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const mainDom = document.querySelector('#main');
const header = mainDom.querySelector('header');

const handleIntersection = ([entry],observer) => {
    if (!entry.isIntersecting) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
};

const observer = new IntersectionObserver(handleIntersection,{
    root: mainDom,
    rootMargin: '0px'
});

mainDom.addEventListener(EVENTS.SCROLL, () => {
    console.log(mainDom.scrollTop,header.offsetHeight);
    if (mainDom.scrollTop <= header.offsetHeight) {
        header.classList.remove('fixed');
    } 
});

observer.observe(header);


function appReady() {
    
}

app.on(App.READY, appReady);
app.init();
