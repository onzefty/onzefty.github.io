import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const {projects = []} = CONFIG;
const elements = {};
elements.introduction = document.querySelector('#introduction');
elements.projectsContainer = document.querySelector('#projects-container');
elements.iframe = document.querySelector('#project-iframe');
const projectsMap = new Map();


function loadIframe(url) {
  return new Promise((resolve, reject) => {
    elements.iframe.src = url;
    elements.iframe.onload = () => resolve(elements.iframe);
    elements.iframe.onerror = (e) => reject(e);
  });
}

function handleProjectClick(event) {
    const project = projectsMap.get(event.currentTarget);
    if (!project) return;

    if(elements.iframe.getAttribute("url") === project.url) {
        elements.iframe.innerHTML = "";
        elements.iframe.classList.remove('loaded');
        return;
    }

    if (project && project.url) {
        elements.iframe.setAttribute("url",project.url);
        elements.iframe.classList.add('loaded')
        loadIframe(project.url)
            .then(() => {
                
            })
            .catch(err => console.error(`Error loading project: ${err}`));
    }
}

function renderProjects() {
    const create = (project) => {
        const projectElement = document.createElement('article');
        projectElement.classList.add('project');
        projectElement.style.backgroundImage = `url(${project.image})`;
        projectElement.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
        `;
        projectElement.addEventListener(EVENTS.CLICK_TOUCH, handleProjectClick);
        projectsMap.set(projectElement, project);
        return projectElement;
    }

    projects.forEach((project) => {
        elements.projectsContainer.appendChild(create(project));
    });
}



function appReady() {
    if(elements.projectsContainer.children.length === 0) {
        renderProjects()
    }
}

app.on(App.READY, appReady);