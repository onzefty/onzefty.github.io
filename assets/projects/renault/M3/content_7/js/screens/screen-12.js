async function screen12(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const resultEls = screenElement.querySelectorAll(".result");
    const feedbackTexts = screenElement.querySelector(".feedback-txts");
    const buttonRedo = screenElement.querySelector(".button-redo");
    const total = resultEls.length;
    let score = 0;

    const handleRedo = () => {
        app.navigation.previousTo(total+1);
    };

    for (let i = 1; i <= resultEls.length; i++) {
        const resultEl = resultEls[i - 1];
        const data = storedDatas[`content-7-question-${i}`];
        resultEl.classList.remove("wrong");
        resultEl.classList.remove("right");
        if (data === true) {
            resultEl.classList.add("right");
            score++;
        } else {
            resultEl.classList.add("wrong");
        }
    }

    feedbackTexts.classList.remove("wrong");
    feedbackTexts.classList.remove("right");

    const scorePercent = score / total * 100;
    const quizPassed = scorePercent >= 80;

    if (quizPassed === true) {
        feedbackTexts.classList.add("right");
    } else {
        feedbackTexts.classList.add("wrong");
    }

    //Envoie du score à la plateforme
    await app.scormInterface.scorm.setScore({
        min: 0,
        max: total,
        raw: score,
        scaled: score / total,
    });

    if (quizPassed === true) {
        buttonRedo.classList.add("hidden");
        screen.enableNext();
        await app.scormInterface.scorm.setSuccess();
    } else {
        buttonRedo.classList.remove("hidden");
        await app.scormInterface.scorm.setFailed();
    }

    buttonRedo.addEventListener(screen.utils.EVENTS.CLICK_TOUCH,handleRedo);

    screen.addDisposer(() => {
        buttonRedo.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH,handleRedo);
    });

    init();
}

export default screen12;
