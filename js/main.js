import CONFIG from "./config.js";
import App from "./app.js";
import {EVENTS} from "./utils/utils.js";

const app = new App(CONFIG);
const {projects = []} = CONFIG;
const projectsMap = new Map();
const elements = {};
elements.main = document.querySelector("#main");
elements.header = elements.main.querySelector('header');
elements.nav = elements.header.querySelector("nav");
elements.buttonMenu = elements.header.querySelector("#button-menu");
elements.breadcrumb = elements.header.querySelector("#breadcrumb");
elements.breadcrumbItems = elements.breadcrumb.querySelectorAll("li");
elements.sections = elements.main.querySelectorAll("section");
elements.projectsContainer = elements.main.querySelector('#projects-container');
elements.iframe = elements.main.querySelector('#project-iframe');

const handleIntersection = (entries,observer) => {
    const {target} = entries[0];
    if(target.tagName.toLowerCase() === "header") {
        if (!entries[0].isIntersecting) {
            elements.header.classList.add('fixed');
        } else {
            elements.header.classList.remove('fixed');
        }
    } else {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains("visible")) {
                entry.target.classList.add("visible");
            }
        });
    } 
};

const handleMenuToggle = () => {
    return;
    const state = elements.nav.getAttribute("state");
    elements.nav.setAttribute("state",state==="close"?"open":"close");
};

const updateBreadcrumb = () => {
    const scrollPosition = elements.main.scrollTop + elements.header.offsetHeight + 50;
    
    let currentSection = null;
    
    elements.sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section;
        }
    });
    
    elements.breadcrumbItems.forEach((item) => {
        const link = item.querySelector("a");
        const targetId = link.getAttribute("href").substring(1);
        if (currentSection && currentSection.id === targetId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

const observer = new IntersectionObserver(handleIntersection,{
    root: elements.main,
    rootMargin: '0px'
});

elements.main.addEventListener(EVENTS.SCROLL, () => {
    if (elements.main.scrollTop <= elements.header.offsetHeight) {
        elements.header.classList.remove('fixed');
    }
    updateBreadcrumb();
});

//elements.buttonMenu.addEventListener(EVENTS.CLICK_TOUCH,handleMenuToggle);

// Smooth scroll pour les liens du breadcrumb
elements.breadcrumbItems.forEach((item) => {
    const link = item.querySelector("a");
    link.addEventListener(EVENTS.CLICK_TOUCH, (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            elements.main.scrollTo({
                top: targetSection.offsetTop - elements.header.offsetHeight,
                behavior: "smooth"
            });
        }
    });
});

observer.observe(elements.header);

// Initialiser le breadcrumb au chargement
updateBreadcrumb();

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

function loadIframe(url) {
  return new Promise((resolve, reject) => {
    elements.iframe.src = url;
    elements.iframe.onload = () => resolve(elements.iframe);
    elements.iframe.onerror = (e) => reject(e);
  });
}

function appReady() {
    if(elements.projectsContainer.children.length === 0) {
        renderProjects();
    }
}

app.on(App.READY, appReady);
app.init();
