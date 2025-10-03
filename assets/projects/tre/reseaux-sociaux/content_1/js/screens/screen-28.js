function screen28(app, data, components) {
    const { screen, init } = data;
    const storedDatas = screen.getStoredScormDatas();
    const cardContainerFeedback = screen.element.querySelector(".card-game-placeholder .card-feedback");
    const swipeTutorial = screen.element.querySelector(".card-swipe-hint");
    const left = components.CardSwipe.DIRECTIONS.LEFT;
    const right = components.CardSwipe.DIRECTIONS.RIGHT;

    const cardSwipe = new components.CardSwipe(screen.element, {
        rotation: 4,
        answers: [right, right, right, right, right],
    });

    const picked = [];

    cardSwipe.on(components.CardSwipe.VALIDATE, (event) => {
        const target = event.target;
        const data = event.data;
        const correct = data.correct;
        let cardFeedback = target.current.querySelector(".card-feedback");

        if (!cardSwipe.isElementVisible(target.elements.leftArea)) {
            cardFeedback = cardContainerFeedback;

            screen.stopDelayedExecute("hide-feedback");
            screen.stopDelayedExecute("clean-feedback");
        }

        cardFeedback.classList.remove("correct");
        cardFeedback.classList.remove("incorrect");

        if (correct) {
            cardFeedback.classList.add("correct");
        } else {
            cardFeedback.classList.add("incorrect");
        }

        picked.push(correct);

        cardFeedback.classList.add("show");

        screen.executeDelayed(
            () => {
                cardFeedback.classList.remove("show");

                screen.executeDelayed(
                    () => {
                        cardFeedback.classList.remove("correct");
                        cardFeedback.classList.remove("incorrect");
                    },
                    300,
                    "clean-feedback"
                );
            },
            1000,
            "hide-feedback"
        );
    });

    cardSwipe.on(components.CardSwipe.MOVE, (event) => {
        const target = event.target;
        const data = event.data;

        if (!cardSwipe.isElementVisible(target.elements.leftArea)) {
            if (data.swipeDirection === left) {
                if (!target.current.classList.contains("move-to-left")) {
                    target.current.classList.remove("move-to-right");
                    target.current.classList.add("move-to-left");
                }
            } else if (data.swipeDirection === right) {
                if (!target.current.classList.contains("move-to-right")) {
                    target.current.classList.remove("move-to-left");
                    target.current.classList.add("move-to-right");
                }
            } else {
                target.current.classList.remove("move-to-left");
                target.current.classList.remove("move-to-right");
            }
        }

        swipeTutorial.classList.remove("show");
    });

    cardSwipe.on(components.CardSwipe.UP, (event) => {
        const target = event.target;

        target.current.classList.remove("move-to-left");
        target.current.classList.remove("move-to-right");
    });

    cardSwipe.on(components.CardSwipe.DESTROY, (event) => {
        const target = event.target;

        target.elements.cards.forEach((card) => {
            const cardFeedback = card.querySelector(".card-feedback");

            card.classList.remove("move-to-left");
            card.classList.remove("move-to-right");

            cardFeedback.classList.remove("correct");
            cardFeedback.classList.remove("incorrect");
            cardFeedback.classList.remove("show");
        });

        cardContainerFeedback.classList.remove("correct");
        cardContainerFeedback.classList.remove("incorrect");
        cardContainerFeedback.classList.remove("show");
    });

    cardSwipe.on(components.CardSwipe.DONE, async () => {
        storedDatas["content-1-cards"] = picked;
        await screen.storeScormDatas(storedDatas);
        screen.enableNext();
    });

    cardSwipe.on(components.CardSwipe.NEXT, (event) => {
        const data = event.data;
        const {index} = data;
        screen.soundManager.play("sound-"+screen.id+"-card-"+(index+1));
    });

    screen.addDisposer(() => {
        cardSwipe.destroy();
    });

    swipeTutorial.classList.add("show");

    screen.soundManager.play("sound-"+screen.id+"-card-1");

    init();
}

export default screen28;