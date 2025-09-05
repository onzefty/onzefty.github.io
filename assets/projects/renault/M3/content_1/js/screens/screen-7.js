function screen7(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const resultEls = screenElement.querySelectorAll(".result");
    const feedbackTxtsWrap = screenElement.querySelector(".feedback-txts");
    const feedbackTxts = feedbackTxtsWrap.querySelectorAll("p");
    let score = 0;
    const map = new Map();
    map.set(2, "results-txt-2");
    map.set(3, "results-txt-3");
    map.set(4, "results-txt-4");
    map.set(5, "results-txt-5");

    for (let i = 1; i <= feedbackTxts.length; i++) {
        const feedbackTxt = feedbackTxts[i - 1];
        feedbackTxt.classList.add("hidden");
    }

    for (let i = 1; i <= resultEls.length; i++) {
        const resultEl = resultEls[i - 1];
        const data = storedDatas[`content-1-question-${i}`];
        resultEl.classList.remove("wrong");
        resultEl.classList.remove("right");
        if (data === true) {
            resultEl.classList.add("right");
            score++;
        } else {
            resultEl.classList.add("wrong");
        }
    }

    const feedbackTxtClass = map.get(score) || "results-txt-2";
    const feedbackTxt = feedbackTxtsWrap.querySelector(`.${feedbackTxtClass}`);
    feedbackTxt.classList.remove("hidden");

    screen.enableNext();

    init();
}

export default screen7;
