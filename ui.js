"use strict";

/* =========================================================
   NEON HACKER
   UI SYSTEM
========================================================= */

class GameUI {

    constructor() {

        this.notifications = [];

        this.injectStyles();

    }


    /* =====================================================
       CREATE UI CSS
    ===================================================== */

    injectStyles() {

        if (
            document.getElementById(
                "neon-game-ui-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "neon-game-ui-styles";


        style.textContent = `

            .game-notification {
                position: fixed;
                top: 90px;
                left: 50%;
                transform: translate(-50%, -20px);
                background: rgba(5, 15, 30, 0.94);
                border: 1px solid #00e5ff;
                box-shadow: 0 0 25px rgba(0,229,255,.35);
                color: white;
                padding: 14px 22px;
                border-radius: 10px;
                font-family: monospace;
                z-index: 99999;
                opacity: 0;
                transition: .3s ease;
                min-width: 260px;
                text-align: center;
                pointer-events: none;
            }

            .game-notification.visible {
                opacity: 1;
                transform: translate(-50%, 0);
            }

            .game-notification strong {
                display: block;
                color: #00e5ff;
                font-size: 17px;
                margin-bottom: 5px;
            }

            .game-notification span {
                color: #b8dfff;
                font-size: 13px;
            }

            .level-announcement {
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,.75);
                z-index: 99998;
                opacity: 0;
                transition: .4s ease;
                pointer-events: none;
            }

            .level-announcement.visible {
                opacity: 1;
            }

            .level-announcement-content {
                text-align: center;
                font-family: monospace;
            }

            .level-announcement-content span {
                display: block;
                color: #00e5ff;
                font-size: 18px;
                letter-spacing: 5px;
            }

            .level-announcement-content strong {
                display: block;
                color: white;
                font-size: 42px;
                margin-top: 10px;
                text-shadow: 0 0 25px #00e5ff;
            }

            .damage-flash {
                position: fixed;
                inset: 0;
                background: rgba(255,0,50,.3);
                z-index: 99997;
                pointer-events: none;
                opacity: 0;
                transition: opacity .1s;
            }

            .damage-flash.active {
                opacity: 1;
            }

            .system-message {
                position: fixed;
                left: 50%;
                bottom: 70px;
                transform: translate(-50%, 20px);
                font-family: monospace;
                color: #00e5ff;
                background: rgba(0,0,0,.85);
                border: 1px solid #00e5ff;
                padding: 10px 18px;
                border-radius: 8px;
                z-index: 99996;
                opacity: 0;
                transition: .3s ease;
            }

            .system-message.visible {
                opacity: 1;
                transform: translate(-50%, 0);
            }

            .screen-shake {
                animation: neonScreenShake .35s;
            }

            @keyframes neonScreenShake {
                0% { transform: translate(0); }
                20% { transform: translate(-5px, 3px); }
                40% { transform: translate(5px, -3px); }
                60% { transform: translate(-4px, 2px); }
                80% { transform: translate(3px, -2px); }
                100% { transform: translate(0); }
            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =====================================================
       NOTIFY
    ===================================================== */

    notify(
        title,
        message = ""
    ) {

        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            "game-notification";


        const strong =
            document.createElement(
                "strong"
            );


        strong.textContent =
            title;


        const span =
            document.createElement(
                "span"
            );


        span.textContent =
            message;


        notification.appendChild(
            strong
        );


        notification.appendChild(
            span
        );


        document.body.appendChild(
            notification
        );


        requestAnimationFrame(
            () => {

                notification.classList.add(
                    "visible"
                );

            }
        );


        setTimeout(
            () => {

                notification.classList.remove(
                    "visible"
                );


                setTimeout(
                    () => {

                        notification.remove();

                    },
                    350
                );

            },
            2500
        );

    }


    /* =====================================================
       LEVEL ANNOUNCEMENT
    ===================================================== */

    showLevel(
        level,
        name
    ) {

        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "level-announcement";


        const content =
            document.createElement(
                "div"
            );


        content.className =
            "level-announcement-content";


        const number =
            document.createElement(
                "span"
            );


        number.textContent =
            "LEVEL " +
            String(level).padStart(
                2,
                "0"
            );


        const title =
            document.createElement(
                "strong"
            );


        title.textContent =
            name;


        content.appendChild(
            number
        );


        content.appendChild(
            title
        );


        overlay.appendChild(
            content
        );


        document.body.appendChild(
            overlay
        );


        requestAnimationFrame(
            () => {

                overlay.classList.add(
                    "visible"
                );

            }
        );


        setTimeout(
            () => {

                overlay.classList.remove(
                    "visible"
                );


                setTimeout(
                    () => {

                        overlay.remove();

                    },
                    450
                );

            },
            1800
        );

    }


    /* =====================================================
       FLOATING TEXT
    ===================================================== */

    floatingText(
        scene,
        x,
        y,
        text,
        color = "#00e5ff"
    ) {

        const floating =
            scene.add.text(

                x,
                y,

                text,

                {

                    fontFamily:
                        "monospace",

                    fontSize:
                        "17px",

                    fontStyle:
                        "bold",

                    color:
                        color,

                    stroke:
                        "#000000",

                    strokeThickness:
                        3

                }

            );


        floating.setOrigin(
            0.5
        );


        floating.setDepth(
            200
        );


        scene.tweens.add({

            targets:
                floating,

            y:
                y - 50,

            alpha:
                0,

            duration:
                700,

            ease:
                "Power2",

            onComplete:
                () => {

                    floating.destroy();

                }

        });

    }


    /* =====================================================
       DAMAGE FLASH
    ===================================================== */

    damageFlash() {

        const flash =
            document.createElement(
                "div"
            );


        flash.className =
            "damage-flash";


        document.body.appendChild(
            flash
        );


        requestAnimationFrame(
            () => {

                flash.classList.add(
                    "active"
                );

            }
        );


        setTimeout(
            () => {

                flash.classList.remove(
                    "active"
                );


                setTimeout(
                    () => {

                        flash.remove();

                    },
                    100
                );

            },
            120
        );

    }


    /* =====================================================
       SYSTEM MESSAGE
    ===================================================== */

    systemMessage(
        message
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "system-message";


        element.textContent =
            message;


        document.body.appendChild(
            element
        );


        requestAnimationFrame(
            () => {

                element.classList.add(
                    "visible"
                );

            }
        );


        setTimeout(
            () => {

                element.classList.remove(
                    "visible"
                );


                setTimeout(
                    () => {

                        element.remove();

                    },
                    300
                );

            },
            1800
        );

    }


    /* =====================================================
       SCREEN SHAKE
    ===================================================== */

    shake() {

        if (
            document.body.classList.contains(
                "screen-shake"
            )
        ) {

            return;

        }


        document.body.classList.add(
            "screen-shake"
        );


        setTimeout(
            () => {

                document.body.classList.remove(
                    "screen-shake"
                );

            },
            400
        );

    }

}


/* =========================================================
   GLOBAL UI
========================================================= */

const gameUI =
    new GameUI();
