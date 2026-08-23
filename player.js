"use strict";

/* =========================================================
   NEON PLAYER
========================================================= */

class NeonPlayer {

    constructor(scene, x, y) {

        this.scene = scene;

        this.speed = 260;

        this.maxEnergy = 100;

        this.energy = 100;

        this.dashCost = 20;

        this.dashReady = true;

        this.createTexture();

        this.sprite =
            scene.physics.add.sprite(
                x,
                y,
                "neonPlayer"
            );

        this.sprite.setSize(
            32,
            32
        );

        this.sprite.setCollideWorldBounds(
            true
        );

        this.sprite.setDepth(10);

        this.direction = {
            x: 1,
            y: 0
        };

    }


    createTexture() {

        if (
            this.scene.textures.exists(
                "neonPlayer"
            )
        ) {

            return;

        }

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 64;
        canvas.height = 64;

        const ctx =
            canvas.getContext("2d");


        ctx.beginPath();

        ctx.arc(
            32,
            32,
            22,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,170,255,0.18)";

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            32,
            32,
            16,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#00aaff";

        ctx.fill();


        ctx.lineWidth = 3;

        ctx.strokeStyle =
            "#9fefff";

        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
            32,
            32,
            6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();


        this.scene.textures.addCanvas(
            "neonPlayer",
            canvas
        );

    }


    update(input) {

        let x = 0;
        let y = 0;


        if (input.left) x--;
        if (input.right) x++;
        if (input.up) y--;
        if (input.down) y++;


        const length =
            Math.hypot(
                x,
                y
            );


        if (length > 0) {

            x /= length;
            y /= length;

            this.direction.x = x;
            this.direction.y = y;

        }


        this.sprite.setVelocity(
            x * this.speed,
            y * this.speed
        );

    }


    dash() {

        if (
            !this.dashReady ||
            this.energy <
            this.dashCost
        ) {

            return false;

        }


        this.energy -=
            this.dashCost;

        this.dashReady =
            false;


        this.sprite.setVelocity(
            this.direction.x * 800,
            this.direction.y * 800
        );


        setTimeout(
            () => {

                this.dashReady = true;

            },
            800
        );


        return true;

    }


    takeDamage(amount) {

        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.sprite.setTint(
            0xff3355
        );


        setTimeout(
            () => {

                if (
                    this.sprite &&
                    this.sprite.active
                ) {

                    this.sprite.clearTint();

                }

            },
            200
        );


        return (
            this.energy <= 0
        );

    }


    restoreEnergy(amount) {

        this.energy =
            Math.min(
                this.maxEnergy,
                this.energy + amount
            );

    }

}
