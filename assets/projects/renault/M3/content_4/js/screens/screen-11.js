const displayableSlidersMain = {};
let notDone = true;
const answers = {
    1:[
        [{ answer: true }, { answer: false }, { answer: false }],
        [{ answer: false }, { answer: true }, { answer: false }],
        [{ answer: false }, { answer: false }, { answer: true }],
        [{ answer: true }],
        [{ answer: true }, { answer: false }, { answer: false }],
        [{ answer: true }, { answer: false }, { answer: false }]
    ],
    2:[
        [{ answer: false }, { answer: false }, { answer: true }],
        [{ answer: true }, { answer: false }, { answer: false }],
        [{ answer: false }, { answer: true }, { answer: false }],
        [{ answer: true }],
        [{ answer: false }, { answer: false }, { answer: true }],
        [{ answer: true }, { answer: false }, { answer: false }]
    ]

}

function screen11(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;
    const screenContent = screenElement.querySelector(".screen-content");

    const options = {
        wrapper: screenElement,
        displayableClass: "s11-displayable",
        triggerClass: "category",
        seenClass: "done",
        buttonCloseClass: "screen-displayable-button-close",
    };

    const displayableM = new components.DisplayableManager(options);

    displayableM.on(displayableM.events.RENDER, (event) => {
        const target = event.data;

        notDone = true;

        screen.removeNextOverride("s11-displayable-1-slider-next");
        screen.removeNextOverride("s11-displayable-3-slider-next");

        if (target.state === "visible") {
            if (displayableSlidersMain[target.number]) {
                displayableSlidersMain[target.number].setAtPos(1);
            }
            screenContent.classList.add("displayable-visible");

            screen.addPreviousOverride({
                id: "s11-displayable-prev",
                action: () => {
                    if (notDone) {
                        screen.disableNext();
                    }

                    target.hide(notDone);
                },
            });

            
        } else {
            screenContent.classList.remove("displayable-visible");
            screen.removePreviousOverride("s11-displayable-prev");

            screen.enablePrevious();

            if(screen.seen) {
                screen.enableNext();
            } else {
                screen.disableNext();
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

    displayable(components, screen, displayableM,1);
    displayable(components, screen, displayableM,2);

    screen.addDisposer(() => {
        displayableM.dispose();
        screen.removePreviousOverride("s11-displayable-prev");
        screen.removeNextOverride("s11-displayable-1-slider-next");
        screen.removeNextOverride("s11-displayable-3-slider-next");
        screenContent.classList.remove("displayable-visible");
    });

    init();
}
function displayable(components, screen, displayableM, num) {
    const screenElement = screen.element;
    const displayableElement = screenElement.querySelector("#s11-displayable-"+num);
    //Slider principal
    const dones = [];
    const slider = displayableElement.querySelector(".s11-displayable-slider-main");
    const sliderM = new components.Slider({
        list: [{ element: slider }],
    });

    function enableNext() {
        screen.enableNext();
    }

    function disableNext() {
        screen.disableNext();
    }

    sliderM.on(sliderM.events.EACH, (event) => {
        screen.enablePrevious();

        if (
            sliderM.seen > sliderM.current ||
            (sliderM.ended === true && sliderM.current === 1) ||
            dones[sliderM.current - 1]
        ) {
            enableNext();
        } else {
            disableNext();
        }
    });

    sliderM.on(sliderM.events.EACHSTART, (event) => {
        screen.removePreviousOverride("s11-displayable-prev");
        screen.removeNextOverride("s11-displayable-3-slider-next");

        if (sliderM.current === 1) {
            screen.addPreviousOverride({
                id: "s11-displayable-prev",
                action: () => {
                    const target = displayableM.visible;

                    if (notDone) {
                        disableNext();
                    }

                    if (screen.seen) {
                        enableNext();
                    }

                    if (target) {
                        target.hide(notDone);
                    }
                },
            });
        }

        if (sliderM.current !== sliderM.total) {
            screen.addNextOverride({
                id: "s11-displayable-3-slider-next",
                action: () => {
                    screen.disableNavigation();
                    screen.removeNextOverride("s11-displayable-3-slider-next");
                    sliderM.nextSlide();
                },
            });
        }

        if (sliderM.current !== 1) {
            screen.addPreviousOverride({
                id: "s11-displayable-prev",
                action: () => {
                    screen.disableNavigation();
                    sliderM.prevSlide();
                },
            });
        }

        if(sliderM.current === sliderM.total) {
            screen.addNextOverride({
                id: "s11-displayable-3-slider-next",
                action: () => {
                    screen.disableNavigation();
                    screen.removeNextOverride("s11-displayable-3-slider-next");
                    displayableM.visible.hide();
                },
            });
        }
    });

    displayableSlidersMain[num] = sliderM;

    screen.addDisposer(() => {
        sliderM.dispose();
    });

    const qcmDatas = answers[num];
    for (let i = 1; i <= qcmDatas.length; i++) {
        displayableQCM(
            components,
            screen,
            slider.querySelector("#s11-displayable-"+num+"-slide-"+i),
            qcmDatas[i - 1],
            () => {
                dones[i - 1] = true;
                enableNext();
            }
        );
    }

    screen.addDisposer(() => {
    });
}

function displayableQCM(components, screen, wrapper, datas, callback) {
    const checkboxes = screen.utils.getElementsFrom(".qcm-checkbox", wrapper);
    const feedbacksWrapper = screen.utils.getElementFrom(".qcm-feedbacks", wrapper);
    const feedbacksOverlay = screen.utils.getElementFrom(".qcm-feedback-overlay", feedbacksWrapper);
    const feedbacksEls = screen.utils.getElementsFrom(".qcm-feedback", feedbacksWrapper);
    const feedbacks = [];
    let opening = false;
    let closing = false;

    feedbacksEls.forEach((feedbackEl) => {
        const quitButton = screen.utils.getElementFrom(".qcm-feedback-close", feedbackEl);

        feedbacks.push({
            element: feedbackEl,
            button: quitButton,
        });
    });

    const handleFeedbackClose = () => {
        if (!feedbacksWrapper || opening || closing) {
            return;
        }

        feedbacksWrapper.classList.remove("show");

        feedbacks.forEach((feedback) => {
            feedback.element.classList.remove("show");
        });

        opening = false;
        closing = true;

        screen.executeDelayed(() => {
            closing = false;
        }, 600);
    };

    const handleFeedbackOpen = function () {
        if (closing) {
            return;
        }

        const feedbackID = Number(this.dataset.feedbackID);

        if (Number.isNaN(feedbackID)) {
            return;
        }

        const feedback = feedbacks[feedbackID];

        if (!feedback) {
            return;
        }

        feedbacksWrapper.classList.add("show");
        feedback.element.classList.add("show");

        opening = true;

        screen.executeDelayed(() => {
            opening = false;
        }, 600);
    };

    const interaction = new components.Clickables({
        datas,
        buttons: checkboxes,
        correctionAuto: true,
    });

    interaction.on(interaction.events.END, () => {

        wrapper.classList.add("done");
        interaction.activate();
        callback();

        if (feedbacks.length === 0) {
            wrapper.classList.add("no-proposal-feedbacks");
            return;
        }

        checkboxes.forEach((checkbox, index) => {
            if (!feedbacks[index]) {
                checkbox.classList.add("no-feedback");
                return;
            }

            checkbox.dataset.feedbackID = index;
            checkbox.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackOpen);
        });

        if (feedbacksOverlay) {
            feedbacksOverlay.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackClose);
        }

        feedbacks.forEach((feedback) => {
            if (feedback.button) {
                feedback.button.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackClose);
            }
        });
    });

    screen.addDisposer(() => {
        if (feedbacksWrapper) {
            feedbacksWrapper.classList.remove("show");
        }

        feedbacks.forEach((feedback) => {
            feedback.element.classList.remove("show");
        });

        if (feedbacksOverlay) {
            feedbacksOverlay.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackClose);
        }

        feedbacks.forEach((feedback) => {
            if (feedback.button) {
                feedback.button.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackClose);
            }
        });

        checkboxes.forEach((checkbox) => {
            delete checkbox.dataset.feedbackID;
            checkbox.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleFeedbackOpen);
            checkbox.classList.remove("no-feedback");
        });

        wrapper.classList.remove("done");
        wrapper.classList.remove("no-proposal-feedbacks");

        interaction.dispose();
    });
}


export default screen11;