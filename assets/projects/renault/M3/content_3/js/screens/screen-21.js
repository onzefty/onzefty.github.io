function screen21(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const resultEls = screenElement.querySelectorAll(".result");
    const feedbackTexts = screenElement.querySelector(".feedback-txts");
    const buttonContinue = screenElement.querySelector(".button-continue");
    const buttonRedo = screenElement.querySelector(".button-redo");
    const total = resultEls.length;
    let score = 0;
    const handleNext = () => {
        screen.goToNext();
    };
    const handleRedo = () => {
        app.navigation.previousTo(total+1);
    };

    for(let i = 1; i <= resultEls.length; i++){
        const resultEl =  resultEls[i-1];
        const data = storedDatas[`content-3-question-${i}`];
        resultEl.classList.remove("wrong");
        resultEl.classList.remove("right");
        if(data === true){
            resultEl.classList.add("right");
            score++;
        } else {
            resultEl.classList.add("wrong");
        }
    }

    feedbackTexts.classList.remove("wrong");
    feedbackTexts.classList.remove("right");
    if(score > (total/2)){
        feedbackTexts.classList.add("right");
        buttonContinue.classList.remove("hidden");
        buttonRedo.classList.add("hidden");
    } else {
        feedbackTexts.classList.add("wrong");
        buttonContinue.classList.add("hidden");
        buttonRedo.classList.remove("hidden");
    }

    buttonContinue.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);
    buttonRedo.addEventListener(screen.utils.EVENTS.CLICK_TOUCH,handleRedo);

    screen.addDisposer(() => {
        buttonContinue.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);
        buttonRedo.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH,handleRedo);
    });

    init();
}

export default screen21;