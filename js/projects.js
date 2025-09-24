import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const {projects = []} = CONFIG;
const elements = {};
elements.main = document.querySelector("#main");
elements.introduction = document.querySelector('#introduction');
elements.projectsContainer = document.querySelector('#projects-container');
elements.iframe = document.querySelector('#project-iframe');
const projectsMap = new Map();

const handleIntersection = (entries,observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("visible")) {
            entry.target.classList.add("visible");
        }
    });
};

const observer = new IntersectionObserver(handleIntersection,{
    root: elements.main,
    rootMargin: '0px'
});


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

    const activeEl = elements.projectsContainer.querySelector('.project.active');
    if(activeEl) {
        activeEl.classList.remove('active');
    }
    
    if(elements.iframe.getAttribute("url") === project.url) {
        elements.iframe.innerHTML = "";
        elements.iframe.classList.remove('loaded');
        event.currentTarget.classList.remove('active');
        return;
    }

    if (project && project.url) {
        event.currentTarget.classList.add('active');
        elements.iframe.setAttribute("url",project.url);
        elements.iframe.classList.add('loaded');
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
        const projectLeftElement = document.createElement("div");
        projectLeftElement.classList.add("project-left");
        projectLeftElement.style.backgroundImage = `url(${project.image})`;
        const projectRightElement = document.createElement("div");
        projectRightElement.classList.add("project-right");
        projectRightElement.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
        `;
        if(project.tools){
            const projectToolsContainer = document.createElement("div");
            projectToolsContainer.classList.add("project-tools-container");
            project.tools.forEach(tool => {
                const projectToolElement = document.createElement("div");
                projectToolElement.innerHTML = tool;
                projectToolsContainer.appendChild(projectToolElement);
            });
            projectRightElement.append(projectToolsContainer);
        }
        projectElement.append(projectLeftElement,projectRightElement);
        projectElement.addEventListener(EVENTS.CLICK_TOUCH, handleProjectClick);
        projectsMap.set(projectElement, project);
        return projectElement;
    }

    projects.forEach((project) => {
        const projectElement = create(project)
        elements.projectsContainer.appendChild(projectElement);
        observer.observe(projectElement);
    });
}

function appReady() {
    if(elements.projectsContainer.children.length === 0) {
        renderProjects();
    }
}

app.on(App.READY, appReady);