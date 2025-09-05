function screen17(_, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const datas = [{ answer: false }, { answer: true }];

    const wrapper = screen.utils.getElementFrom(".qcm-wrapper", screenElement);
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

    interaction.on(interaction.events.END, (event) => {
        const correct = event.data;

        wrapper.classList.add("done");

        if (correct) {
            wrapper.classList.add("feedback-right");
        } else {
            wrapper.classList.add("feedback-wrong");
        }

        interaction.activate();

        screen.enableNext();

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
        wrapper.classList.remove("feedback-right");
        wrapper.classList.remove("feedback-wrong");

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

    init();
}

export default screen17;