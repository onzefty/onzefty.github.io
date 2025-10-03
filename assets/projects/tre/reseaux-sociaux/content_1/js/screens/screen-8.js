function screen8(app, data) {
    const { screen, init } = data;

    screen.enableNext();

    screen.soundManager.play("sound-"+screen.id);

    init();
}

export default screen8;