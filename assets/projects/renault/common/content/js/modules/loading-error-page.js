let errorPage;
let instance;

export default class LoadingErrorPage {
    constructor(appManager) {
        if (instance) {
            return instance;
        } else {
            instance = this;
        }

        this.appManager = appManager;

        this.boundHandleError = this.handleError.bind(this);

        this.init();
    }

    init() {
        window.addEventListener("error", this.boundHandleError);
    }

    handleError() {
        const loader = this.appManager.transitionLoader;
        const loaderIsVisible = loader.displayable.css("display") !== "none";

        if (loaderIsVisible) {
            this.destroy();
            this.create();
            loader.hide();
        }
    }

    create() {
        if (errorPage) {
            return;
        }

        errorPage = document.createElement("div");

        errorPage.classList.add("error-page");

        const dataprovider = this.appManager.getDataProvider();

        if (dataprovider && dataprovider.data) {
            const projectName = dataprovider.data.projet;

            if (projectName) {
                errorPage.classList.add(projectName.toLowerCase());
            }
        }

        document.body.appendChild(errorPage);
    }

    destroy() {
        window.removeEventListener("error", this.boundHandleError);
    }
}
