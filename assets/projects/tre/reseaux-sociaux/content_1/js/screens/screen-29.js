function screen29(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const cardsResultsContent = screen.utils.getElementFrom(".cards-results-content", screenElement);
    const buttonQuit = screen.utils.getElementFrom(".button-quit",cardsResultsContent);
    const handleQuit = () => {
        app.scormInterface.scorm.suspend();
    };
    const keyName  = "content-1-cards";
    const picked = storedDatas[keyName] || [];
    const right = picked.filter((item) => item === true).length;
    const isRight = right >= picked.length-1;

    const levelTag = isRight ? "best"  : "average";
    cardsResultsContent.setAttribute("level", levelTag);
    buttonQuit.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleQuit);

    screen.addDisposer(() => {
        buttonQuit.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleQuit);
    });

    screen.soundManager.play("sound-cards-"+levelTag);
    

    init();
}

export default screen29;

