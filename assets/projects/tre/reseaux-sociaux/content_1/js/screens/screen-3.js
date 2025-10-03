function screen3(app, data) {
    const { screen, init } = data;

    init();

    screen.soundManager.play("sound-"+screen.id);

    screen.enableNext();
}

export default screen3;