function screen27(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const resultsContent = screen.utils.getElementFrom(".results-content", screenElement);
    const percentEl = screen.utils.getElementFrom(".percent", resultsContent);
    const levelEl = screen.utils.getElementFrom(".results-level", resultsContent);
    let score = 0;
    // ----- A MODFIER SELON CONTENU
    const total = 4;
    const questionName  = "content-1-question-";
    // -----

    console.log("storedDatas", storedDatas);

    for(const key in storedDatas) {
        if(key.startsWith(questionName)) {
            score = storedDatas[key] === true ? score + 1 : score;
        }
    }

    const percent = Math.round((score / total) * 100);
    const levelTag = percent >= 75 ? "best" : percent>=50 ? "good" : "average";
    
    resultsContent.setAttribute("level", levelTag);
    percentEl.textContent = percent + "%";
    levelEl.style.width = percent + "%";

    screen.enableNext();

    screen.soundManager.play("sound-quiz-"+levelTag);

    init();
    
}

export default screen27;

