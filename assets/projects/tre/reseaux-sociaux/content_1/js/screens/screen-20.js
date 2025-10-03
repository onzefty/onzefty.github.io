function screen20(app, data) {
    const { screen, init } = data;

    screen.enableNext();

    screen.soundManager.play("sound-"+screen.id);

    init();
}

export default screen20;