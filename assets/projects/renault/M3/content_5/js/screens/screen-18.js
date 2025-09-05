function screen18(_, data, components) {
    const { screen, init } = data;

    const cardContainerFeedback = screen.element.querySelector(".card-game-placeholder .card-feedback");
    const swipeTutorial = screen.element.querySelector(".card-swipe-hint");
    const left = components.CardSwipe.DIRECTIONS.LEFT;
    const right = components.CardSwipe.DIRECTIONS.RIGHT;
    const criteriasWrap = screen.element.querySelector("#s18-criterias");
    const criterias = criteriasWrap.querySelectorAll("p");

    const cardSwipe = new components.CardSwipe(screen.element, {
        rotation: 4,
        answers: [right, left, left, right, right],
    });

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

        if(criteriasWrap.querySelector(".show")){
            criteriasWrap.querySelector(".show").classList.remove("show");
        }
        if(criterias[target.currentIndex+1]){
            criterias[target.currentIndex+1].classList.add("show");
        }
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

    cardSwipe.on(components.CardSwipe.DONE, () => {
        screen.enableNext();
    });

    screen.addDisposer(() => {
        cardSwipe.destroy();
        if(criteriasWrap.querySelector(".show")){
            criteriasWrap.querySelector(".show").classList.remove("show");
        }
    });

    swipeTutorial.classList.add("show");
    criterias[0].classList.add("show");

    init();
}

export default screen18;
