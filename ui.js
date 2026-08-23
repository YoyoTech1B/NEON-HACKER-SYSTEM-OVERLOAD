"use strict";

/* =========================================================
   NEON HACKER
   UI EFFECTS SYSTEM
========================================================= */


class GameUI {

    constructor() {

        this.notifications =
            [];

    }


    /* =====================================================
       NOTIFICATION
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


        notification.innerHTML =

            `<strong>${title}</strong>` +
            `<span>${message}</span>`;


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

                    300

                );

            },

            3000

        );

    }


    /* =====================================================
       LEVEL MESSAGE
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


        overlay.innerHTML =

            `<div class="level-announcement-content">` +

            `<span>LEVEL ${String(level).padStart(2, "0")}</span>` +

            `<strong>${name}</strong>` +

            `</div>`;


        document.body.appendChild(
            overlay
        );


        setTimeout(

            () => {

                overlay.classList.add(
                    "visible"
                );

            },

            100

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

                    500

                );

            },

            2500

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
                        "16px",

                    fontStyle:
                        "bold",

                    color

                }

            );


        floating.setOrigin(
            0.5
        );


        floating.setDepth(
            50
        );


        scene.tweens.add({

            targets:
                floating,

            y:
                y - 45,

            alpha:
                0,

            duration:
                700,

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

                flash.remove();

            },

            350

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


        setTimeout(

            () => {

                element.classList.add(
                    "visible"
                );

            },

            50

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

            2000

        );

    }


    /* =====================================================
       SHAKE SCREEN
    ===================================================== */

    shake(
        element =
            document.body
    ) {

        element.classList.add(
            "screen-shake"
        );


        setTimeout(

            () => {

                element.classList.remove(
                    "screen-shake"
                );

            },

            400

        );

    }

}


/* =========================================================
   GLOBAL UI SYSTEM
========================================================= */

const gameUI =
    new GameUI();
