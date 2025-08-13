import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const {projects = []} = CONFIG;
const projectsContainer = document.querySelector('#projects-container');
const iframe = document.querySelector('#project-iframe');

function renderProjects() {
    const create = (project) => {
        const projectElement = document.createElement('article');
        projectElement.classList.add('project');
        projectElement.style.backgroundImage = `url(${project.image})`;
        projectElement.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
        `;
        return projectElement;
    }

    projects.forEach((project) => {
        projectsContainer.appendChild(create(project));
    });
}

function appReady() {
    if(projectsContainer.children.length === 0) {
        renderProjects()
    }
}

app.on(App.READY, appReady);