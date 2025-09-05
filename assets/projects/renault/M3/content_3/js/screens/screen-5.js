const displayableSlidersMain = {};
let notDone = true;

function screen5(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;
    const screenContent = screenElement.querySelector(".screen-content");

    const options = {
        wrapper: screenElement,
        displayableClass: "s5-displayable",
        triggerClass: "category",
        seenClass: "done",
        buttonCloseClass: "screen-displayable-button-close",
    };

    const displayableM = new components.DisplayableManager(options);

    displayableM.on(displayableM.events.RENDER, (event) => {
        const target = event.data;

        notDone = true;

        screen.removeNextOverride("s5-displayable-1-slider-next");
        screen.removeNextOverride("s5-displayable-2-slider-next");

        if (target.state === "visible") {
            if (displayableSlidersMain[target.number]) {
                displayableSlidersMain[target.number].setAtPos(1);
            }
            screenContent.classList.add("displayable-visible");

            screen.addPreviousOverride({
                id: "s5-displayable-prev",
                action: () => {
                    if (notDone) {
                        screen.disableNext();
                    }

                    target.hide(notDone);
                },
            });

            screen.disableNext();
        } else {
            screenContent.classList.remove("displayable-visible");

            screen.removePreviousOverride("s5-displayable-prev");

            if (screen.seen) {
                screen.enableNext();
            }
        }
    });

    displayableM.on(displayableM.events.END, (event) => {
        const { state } = event.data;

        if (state === "visible") {
            screen.disableNext();
        } else {
            screen.enableNext();
        }
    });

    displayable1(components, screen);
    displayable2(components, screen);
 

    screen.addDisposer(() => {
        displayableM.dispose();
        screen.removePreviousOverride("s5-displayable-prev");
        screen.removeNextOverride("s5-displayable-1-slider-next");
        screen.removeNextOverride("s5-displayable-2-slider-next");
        screenContent.classList.remove("displayable-visible");
    });

    init();
}



function displayable1(components, screen) {
    const screenElement = screen.element;
    const displayableElement = screenElement.querySelector("#s5-displayable-1");

    //Slider
    const displayableSlide2 = displayableElement.querySelector("#s5-displayable-1-slide-1");
    const btPrev = displayableSlide2.querySelector(".slider-button-previous");
    const btNext = displayableSlide2.querySelector(".slider-button-next");
    const progress = displayableSlide2.querySelector(".slider-dots");
    const slider1 = displayableSlide2.querySelector(".s5-slider-1");
    const slider2 = displayableSlide2.querySelector(".s5-slider-2");
    const buttonClose = displayableSlide2.querySelector(".screen-displayable-button-close");

    const displayableSlider = new components.Slider({
        btNext,
        btPrev,
        progress,
        list: [{ element: slider1 }, { element: slider2, axis: "y" }],
    });

    displayableSlider.on(displayableSlider.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    displayableSlider.on(displayableSlider.events.NEXT, () => {
        progress.classList.remove("reverse");
    });

    displayableSlider.on(displayableSlider.events.END, (event) => {
        notDone = false;
        buttonClose.classList.remove("hidden");
    });

    screen.addDisposer(() => {
        buttonClose.classList.add("hidden");
        displayableSlider.dispose();
    });

    buttonClose.classList.add("hidden");
}

function displayable2(components, screen) {
    const screenElement = screen.element;
    const displayableElement = screenElement.querySelector("#s5-displayable-2");

    //Slider
    const displayableSlide2 = displayableElement.querySelector("#s5-displayable-2-slide-1");
    const btPrev = displayableSlide2.querySelector(".slider-button-previous");
    const btNext = displayableSlide2.querySelector(".slider-button-next");
    const progress = displayableSlide2.querySelector(".slider-dots");
    const slider1 = displayableSlide2.querySelector(".s5-slider-1");
    const slider2 = displayableSlide2.querySelector(".s5-slider-2");
    const buttonClose = displayableSlide2.querySelector(".screen-displayable-button-close");

    const displayableSlider = new components.Slider({
        btNext,
        btPrev,
        progress,
        list: [{ element: slider1 }, { element: slider2, axis: "y" }],
    });

    displayableSlider.on(displayableSlider.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    displayableSlider.on(displayableSlider.events.NEXT, () => {
        progress.classList.remove("reverse");
    });

    displayableSlider.on(displayableSlider.events.END, (event) => {
        notDone = false;
        buttonClose.classList.remove("hidden");
    });

    screen.addDisposer(() => {
        buttonClose.classList.add("hidden");
        displayableSlider.dispose();
    });

    buttonClose.classList.add("hidden");
}

export default screen5;
