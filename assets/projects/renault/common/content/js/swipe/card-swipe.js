import EmitterMixin from "../emitter/emitter-mixin.js";
import {
    EVENTS,
    getElementsFrom,
    getElementFrom,
    getMousePosition,
    getPositionWithoutTransform,
    clamp,
} from "../utils/utils.js";

export default class CardSwipe extends EmitterMixin {
    #boundHandleMouseDown;
    #boundHandleMouseUp;
    #boundHandleMouseMove;
    #boundHandleCardTransitionEnd;

    static DOWN = "CardSwipe.down";
    static MOVE = "CardSwipe.move";
    static UP = "CardSwipe.up";
    static PLACING = "CardSwipe.placing";
    static PLACED = "CardSwipe.placed";
    static VALIDATE = "CardSwipe.validate";
    static SWIPE = "CardSwipe.swipe";
    static NEXT = "CardSwipe.next";
    static DONE = "CardSwipe.done";
    static DESTROY = "CardSwipe.destroy";
    static DIRECTIONS = {
        LEFT: 0,
        RIGHT: 1,
        MIDDLE: 2,
    };

    constructor(container, options = {}) {
        super();

        this.container = container;
        this.config = {
            cardSelector: ".card",
            cardScoreSelector: ".card-scores",
            cardScoreCurrentSelector: ".card-score-current",
            cardScoreMaxSelector: ".card-score-total",
            leftArea: ".card-game-left .card-placeholder-content",
            rightArea: ".card-game-right .card-placeholder-content",
            bullets: ".card-bullet",
            transitionEndProps: ["transform"],
            answers: [],
            threshold: 0.6,
            swipeLimit: 0.5,
            rotation: 5,
            validateOnSwipe: true,
            nextAfterSwipe: true,
            autoInit: true,
            showScore: true,
            ...options,
            cardPlacement: {
                left: "auto",
                right: "auto",
                ...options?.cardPlacement,
            },
        };

        this.elements = {};
        this.currentIndex = -1;
        this.current = null;
        this.datas = {
            correctCards: [],
        };

        if (this.config.autoInit) {
            this.init();
        }
    }

    addListeners() {
        this.#boundHandleMouseDown = this.handleMouseDown.bind(this);
        this.#boundHandleMouseUp = this.handleMouseUp.bind(this);
        this.#boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.#boundHandleCardTransitionEnd = this.handleCardTransitionEnd.bind(this);

        this.elements.cards.forEach((card) => {
            card.addEventListener(EVENTS.DOWN_TOUCHSTART, this.#boundHandleMouseDown);
        });
    }

    removeListeners() {
        this.elements.cards.forEach((card) => {
            card.removeEventListener(EVENTS.DOWN_TOUCHSTART, this.#boundHandleMouseDown);
            card.removeEventListener(EVENTS.TRANSITION_END, this.#boundHandleCardTransitionEnd);
            card.removeEventListener(EVENTS.TRANSITION_CANCEL, this.#boundHandleCardTransitionEnd);
        });

        document.removeEventListener(EVENTS.UP_TOUCHEND, this.#boundHandleMouseUp);
        document.removeEventListener(EVENTS.MOVE_TOUCHMOVE, this.#boundHandleMouseMove);
    }

    init() {
        const cards = getElementsFrom(this.config.cardSelector, this.container);
        const bullets = getElementsFrom(this.config.bullets, this.container);
        const cardScore = getElementFrom(this.config.cardScoreSelector, this.container);
        const leftArea = getElementFrom(this.config.leftArea, this.container);
        const rightArea = getElementFrom(this.config.rightArea, this.container);

        this.elements.cards = cards;
        this.elements.cardsContainer = this.elements.cards.map((card) => card.parentElement);
        this.elements.bullets = bullets;
        this.elements.leftArea = leftArea;
        this.elements.rightArea = rightArea;

        if (cardScore) {
            const scoreCurrent = getElementFrom(this.config.cardScoreCurrentSelector, cardScore);
            const scoreMax = getElementFrom(this.config.cardScoreMaxSelector, cardScore);

            this.elements.score = {
                element: cardScore,
                current: scoreCurrent,
                max: scoreMax,
            };
        }

        this.elements.cards.forEach((card, index) => {
            card.style.zIndex = this.elements.cards.length - index;

            this.datas.correctCards[index] = false;
        });

        this.addListeners();
        this.nextCard();
    }

    isElementVisible(element) {
        if (!element) {
            return false;
        }

        if (element.offsetParent === null) {
            return false;
        }

        const computedStyle = window.getComputedStyle(element);

        if (computedStyle.opacity === 0) {
            return false;
        }

        if (computedStyle.visibility !== "visible") {
            return false;
        }

        return true;
    }

    updateActiveBullet() {
        this.elements.bullets.forEach((bullet, index) => {
            if (index !== this.currentIndex) {
                bullet.classList.remove("active");
            } else {
                bullet.classList.add("active");
            }
        });
    }

    updateScore() {
        if (!this.elements.score) {
            return;
        }

        if (this.elements.score.current) {
            this.elements.score.current.innerText = this.datas.correctCards.filter(Boolean).length;
        }

        if (this.elements.score.max) {
            this.elements.score.max.innerText = this.datas.correctCards.length;
        }
    }

    nextCard() {
        this.currentIndex++;

        if (this.currentIndex >= this.elements.cards.length) {
            if (this.elements.score && this.elements.score.element && this.config.showScore) {
                this.elements.score.element.parentNode.classList.add("show-score");
            }

            this.emit(CardSwipe.DONE);
            return;
        }

        this.elements.cards.forEach((card, index) => {
            if (index !== this.currentIndex) {
                card.classList.remove("active");
            } else {
                card.classList.add("active");
            }
        });

        this.current = this.elements.cards[this.currentIndex];

        if (this.elements.leftArea) {
            this.elements.leftArea.dataset.id = this.currentIndex + 1;
        }

        if (this.elements.rightArea) {
            this.elements.rightArea.dataset.id = this.currentIndex + 1;
        }

        this.container.dataset.cardSwipeId = this.currentIndex + 1;

        this.updateActiveBullet();

        delete this.datas.cardSize;
        delete this.datas.swipeProgress;
        delete this.datas.swipeDirection;
        delete this.datas.rotation;
        delete this.datas.move;
        delete this.datas.start;

        this.updateScore();

        this.emit(CardSwipe.NEXT, {
            index: this.currentIndex,
            card: this.current,
        });
    }

    validate() {
        const answer = this.config.answers[this.currentIndex];
        const bullet = this.elements.bullets[this.currentIndex];
        const correct = answer === this.datas.swipeDirection;

        if (correct) {
            this.current.classList.add("right");

            if (bullet) {
                bullet.classList.add("right");
            }

            this.datas.correctCards[this.currentIndex] = true;
        } else {
            this.current.classList.add("wrong");

            if (bullet) {
                bullet.classList.add("wrong");
            }
        }

        this.updateScore();

        this.emit(CardSwipe.VALIDATE, {
            correct,
        });
    }

    handleCardTransitionEnd(event) {
        const propertyName = event.propertyName;

        if (!this.config.transitionEndProps.includes(propertyName)) {
            return;
        }

        this.elements.cards.forEach((card) => {
            const waitForEnd = card.dataset.waitForEnd;

            if (!waitForEnd) {
                return;
            }

            const direction = Number(card.dataset.direction);

            card.removeEventListener(EVENTS.TRANSITION_END, this.#boundHandleCardTransitionEnd);
            card.removeEventListener(EVENTS.TRANSITION_CANCEL, this.#boundHandleCardTransitionEnd);

            card.style.transform = "";
            card.style.width = "";
            card.style.height = "";
            card.style.opacity = "";
            card.style.zIndex = "";

            card.classList.remove("placing");
            card.classList.add("placed");

            if (this.currentIndex === 0) {
                card.classList.add("first");
            }

            if (this.currentIndex >= this.elements.cards.length) {
                card.classList.add("last");
            }

            if (direction === CardSwipe.DIRECTIONS.LEFT) {
                if (this.elements.leftArea) {
                    this.elements.leftArea.appendChild(card);
                }
            } else {
                if (this.elements.rightArea) {
                    this.elements.rightArea.appendChild(card);
                }
            }

            delete card.dataset.direction;
            delete card.dataset.waitForEnd;

            this.emit(CardSwipe.PLACED, {
                card,
                ...this.datas,
            });
        });
    }

    handleMouseDown(event) {
        const mousePosition = getMousePosition(event);
        const bounding = this.current.getBoundingClientRect();

        event.preventDefault();

        this.datas.start = {
            x: mousePosition.clientX,
            y: mousePosition.clientY,
        };

        this.datas.cardSize = {
            width: bounding.width,
            height: bounding.height,
        };

        this.current.classList.add("swipe-start");

        document.addEventListener(EVENTS.UP_TOUCHEND, this.#boundHandleMouseUp);
        document.addEventListener(EVENTS.MOVE_TOUCHMOVE, this.#boundHandleMouseMove);

        this.emit(CardSwipe.DOWN, {
            ...this.datas,
        });
    }

    handleMouseUp() {
        this.current.classList.remove("swipe-start");
        this.current.classList.remove("swiping");

        this.emit(CardSwipe.UP, {
            ...this.datas,
        });

        if (this.datas.swipeProgress >= this.config.threshold) {
            const swipeDirection = this.datas.swipeDirection;

            this.current.removeEventListener(EVENTS.DOWN_TOUCHSTART, this.#boundHandleMouseDown);

            if (swipeDirection === CardSwipe.DIRECTIONS.LEFT && this.elements.leftArea) {
                if (this.config.cardPlacement.left !== "auto") {
                    this.emit(CardSwipe.PLACING, {
                        card: this.current,
                        ...this.datas,
                    });
                } else {
                    this.current.dataset.waitForEnd = 1;
                    this.current.dataset.direction = CardSwipe.DIRECTIONS.LEFT;

                    this.current.classList.add("placing");

                    this.current.addEventListener(EVENTS.TRANSITION_END, this.#boundHandleCardTransitionEnd);
                    this.current.addEventListener(EVENTS.TRANSITION_CANCEL, this.#boundHandleCardTransitionEnd);

                    if (this.isElementVisible(this.elements.leftArea.offsetParent)) {
                        const leftAreaPosition = getPositionWithoutTransform(this.elements.leftArea);
                        const cardPosition = getPositionWithoutTransform(this.current);

                        const translateX = leftAreaPosition.x - cardPosition.x;
                        const translateY = leftAreaPosition.y - cardPosition.y;
                        const rotation = this.config.rotation * -1;

                        this.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
                        this.current.style.width = `${this.elements.leftArea.offsetWidth}px`;
                        this.current.style.height = `${this.elements.leftArea.offsetHeight}px`;
                    } else {
                        const cardBound = this.current.getBoundingClientRect();
                        const translateX = this.datas.move.x;
                        const cardLeft = cardBound.left - translateX;
                        const xDiff = 0 - cardLeft;

                        this.current.style.transform = `translateX(${xDiff}px) rotate(${this.datas.rotation}deg)`;
                        this.current.style.opacity = 0;
                    }

                    this.emit(CardSwipe.PLACING, {
                        card: this.current,
                        ...this.datas,
                    });
                }
            }

            if (swipeDirection === CardSwipe.DIRECTIONS.RIGHT && this.elements.rightArea) {
                if (this.config.cardPlacement.right !== "auto") {
                    this.emit(CardSwipe.PLACING, {
                        card: this.current,
                        ...this.datas,
                    });
                } else {
                    this.current.dataset.waitForEnd = 1;
                    this.current.dataset.direction = CardSwipe.DIRECTIONS.RIGHT;

                    this.current.classList.add("placing");

                    this.current.addEventListener(EVENTS.TRANSITION_END, this.#boundHandleCardTransitionEnd);
                    this.current.addEventListener(EVENTS.TRANSITION_CANCEL, this.#boundHandleCardTransitionEnd);

                    if (this.isElementVisible(this.elements.rightArea.offsetParent)) {
                        const rightAreaPosition = getPositionWithoutTransform(this.elements.rightArea);
                        const cardPosition = getPositionWithoutTransform(this.current);

                        const translateX = rightAreaPosition.x - cardPosition.x;
                        const translateY = rightAreaPosition.y - cardPosition.y;
                        const rotation = this.config.rotation;

                        this.current.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
                        this.current.style.width = `${this.elements.rightArea.offsetWidth}px`;
                        this.current.style.height = `${this.elements.rightArea.offsetHeight}px`;
                    } else {
                        const cardBound = this.current.getBoundingClientRect();
                        const translateX = this.datas.move.x;
                        const cardLeft = cardBound.left - translateX;
                        const xDiff = window.innerWidth - (cardLeft + cardBound.width);

                        this.current.style.transform = `translateX(${xDiff}px) rotate(${this.datas.rotation}deg)`;
                        this.current.style.opacity = 0;
                    }

                    this.emit(CardSwipe.PLACING, {
                        card: this.current,
                        ...this.datas,
                    });
                }
            }

            if (this.config.validateOnSwipe) {
                this.validate();
            }

            this.emit(CardSwipe.SWIPE, {
                ...this.datas,
            });

            if (this.config.nextAfterSwipe) {
                this.nextCard();
            }
        } else {
            this.current.style.transform = "";
        }

        document.removeEventListener(EVENTS.UP_TOUCHEND, this.#boundHandleMouseUp);
        document.removeEventListener(EVENTS.MOVE_TOUCHMOVE, this.#boundHandleMouseMove);
    }

    handleMouseMove(event) {
        const mousePosition = getMousePosition(event);

        const deltaX = mousePosition.clientX - this.datas.start.x;
        const swipeLimit = this.datas.cardSize.width * this.config.swipeLimit;
        const swipeProgress = clamp(0, Math.abs(deltaX) / swipeLimit, 1);
        let swipeDirection = deltaX > 0 ? CardSwipe.DIRECTIONS.RIGHT : CardSwipe.DIRECTIONS.LEFT;
        let rotation = this.config.rotation * swipeProgress;
        let moveX = clamp(-swipeLimit, deltaX, swipeLimit);

        if (swipeDirection === CardSwipe.DIRECTIONS.LEFT) {
            rotation *= -1;
        }

        if (swipeProgress < this.config.threshold) {
            swipeDirection = CardSwipe.DIRECTIONS.MIDDLE;
        }

        this.current.classList.remove("swipe-start");
        this.current.classList.add("swiping");

        this.current.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;

        this.datas.swipeProgress = swipeProgress;
        this.datas.swipeDirection = swipeDirection;
        this.datas.rotation = rotation;
        this.datas.move = {
            x: moveX,
        };

        this.emit(CardSwipe.MOVE, {
            ...this.datas,
        });
    }

    destroy() {
        this.emit(CardSwipe.DESTROY);

        this.removeListeners();
        this.off();

        if (this.elements.leftArea) {
            delete this.elements.leftArea.dataset.id;
        }

        if (this.elements.rightArea) {
            delete this.elements.rightArea.dataset.id;
        }

        delete this.container.dataset.cardSwipeId;

        this.elements.cards.forEach((card, index) => {
            const container = this.elements.cardsContainer[index];

            delete card.dataset.waitForEnd;
            delete card.dataset.direction;

            card.style.transform = "";
            card.style.width = "";
            card.style.height = "";
            card.style.opacity = "";
            card.style.zIndex = "";

            card.classList.remove("active");
            card.classList.remove("swipe-start");
            card.classList.remove("swiping");
            card.classList.remove("placed");
            card.classList.remove("placing");
            card.classList.remove("right");
            card.classList.remove("wrong");
            card.classList.remove("first");
            card.classList.remove("last");

            container.appendChild(card);
        });

        this.elements.bullets.forEach((bullet) => {
            bullet.classList.remove("active");
            bullet.classList.remove("right");
            bullet.classList.remove("wrong");
        });

        if (this.elements.score) {
            if (this.elements.score.element) {
                this.elements.score.element.parentNode.classList.remove("show-score");
            }

            if (this.elements.score.current) {
                this.elements.score.current.innerText = "";
            }

            if (this.elements.score.max) {
                this.elements.score.max.innerText = "";
            }
        }

        this.elements.cards.length = 0;
        this.elements.cardsContainer.length = 0;
        this.elements.bullets.length = 0;

        this.elements = {};
        this.datas = {};
    }
}
