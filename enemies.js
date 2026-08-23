"use strict";

/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   ENEMY SYSTEM
========================================================= */


class NeonEnemy {

    constructor(
        scene,
        x,
        y,
        type = "drone"
    ) {

        this.scene = scene;

        this.type = type;

        this.speed =
            this.getSpeed();

        this.maxHealth =
            this.getHealth();

        this.health =
            this.maxHealth;

        this.damage =
            this.getDamage();

        this.direction = 1;

        this.startX = x;

        this.startY = y;

        this.createTexture();

        this.sprite =
            scene.physics.add.sprite(
                x,
                y,
                this.getTextureKey()
            );

        this.sprite.setDepth(8);

        this.sprite.setData(
            "enemySystem",
            this
        );

        this.createAI();

    }


    /* =====================================================
       ENEMY STATS
    ===================================================== */

    getSpeed() {

        const speeds = {

            drone: 70,

            hunter: 110,

            guardian: 50,

            glitch: 140,

            virus: 90

        };


        return (
            speeds[this.type] ||
            70
        );

    }


    getHealth() {

        const health = {

            drone: 30,

            hunter: 50,

            guardian: 100,

            glitch: 25,

            virus: 40

        };


        return (
            health[this.type] ||
            30
        );

    }


    getDamage() {

        const damage = {

            drone: 10,

            hunter: 15,

            guardian: 25,

            glitch: 8,

            virus: 20

        };


        return (
            damage[this.type] ||
            10
        );

    }


    getTextureKey() {

        return (
            "enemy_" +
            this.type
        );

    }


    getColor() {

        const colors = {

            drone:
                0xff3355,

            hunter:
                0xff7b00,

            guardian:
                0xa855f7,

            glitch:
                0x00ffff,

            virus:
                0x00ff88

        };


        return (
            colors[this.type] ||
            0xff3355
        );

    }


    getSize() {

        const sizes = {

            drone: 20,

            hunter: 22,

            guardian: 32,

            glitch: 16,

            virus: 24

        };


        return (
            sizes[this.type] ||
            20
        );

    }


    /* =====================================================
       CREATE TEXTURE
    ===================================================== */

    createTexture() {

        const key =
            this.getTextureKey();


        if (
            this.scene.textures.exists(
                key
            )
        ) {

            return;

        }


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width = 80;

        canvas.height = 80;


        const ctx =
            canvas.getContext(
                "2d"
            );


        const color =
            "#" +
            this.getColor()
                .toString(16)
                .padStart(
                    6,
                    "0"
                );


        const size =
            this.getSize();


        /* GLOW */

        ctx.beginPath();

        ctx.arc(
            40,
            40,
            size + 12,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            color + "22";

        ctx.fill();


        /* BODY */

        ctx.beginPath();

        ctx.arc(
            40,
            40,
            size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            color;

        ctx.fill();


        /* OUTLINE */

        ctx.lineWidth = 3;

        ctx.strokeStyle =
            "#ffffff";

        ctx.stroke();


        /* CORE */

        ctx.beginPath();

        ctx.arc(
            40,
            40,
            6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();


        this.scene.textures.addCanvas(
            key,
            canvas
        );

    }


    /* =====================================================
       AI
    ===================================================== */

    createAI() {

        if (
            this.type ===
            "drone"
        ) {

            this.patrol();

        }


        if (
            this.type ===
            "hunter"
        ) {

            this.chaseTimer =
                0;

        }


        if (
            this.type ===
            "guardian"
        ) {

            this.guardAngle =
                0;

        }


        if (
            this.type ===
            "glitch"
        ) {

            this.teleportTimer =
                0;

        }


        if (
            this.type ===
            "virus"
        ) {

            this.pulseTimer =
                0;

        }

    }


    /* =====================================================
       PATROL
    ===================================================== */

    patrol() {

        this.scene.tweens.add({

            targets:
                this.sprite,

            x:
                this.startX + 120,

            duration:
                1600,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.easeInOut"

        });

    }


    /* =====================================================
       UPDATE
    ===================================================== */

    update(
        player,
        delta
    ) {

        if (
            !this.sprite ||
            !this.sprite.active
        ) {

            return;

        }


        if (
            !player ||
            !player.sprite
        ) {

            return;

        }


        switch (
            this.type
        ) {

            case "hunter":

                this.updateHunter(
                    player
                );

                break;


            case "guardian":

                this.updateGuardian(
                    delta
                );

                break;


            case "glitch":

                this.updateGlitch(
                    player,
                    delta
                );

                break;


            case "virus":

                this.updateVirus(
                    player,
                    delta
                );

                break;

        }

    }


    /* =====================================================
       HUNTER AI
    ===================================================== */

    updateHunter(
        player
    ) {

        const distance =
            Phaser.Math.Distance.Between(

                this.sprite.x,

                this.sprite.y,

                player.sprite.x,

                player.sprite.y

            );


        if (
            distance < 400
        ) {

            this.scene.physics.moveToObject(

                this.sprite,

                player.sprite,

                this.speed

            );

        } else {

            this.sprite.setVelocity(
                0,
                0
            );

        }

    }


    /* =====================================================
       GUARDIAN AI
    ===================================================== */

    updateGuardian(
        delta
    ) {

        this.guardAngle +=
            delta * 0.002;


        this.sprite.setVelocity(

            Math.cos(
                this.guardAngle
            ) *
            this.speed,

            Math.sin(
                this.guardAngle
            ) *
            this.speed

        );

    }


    /* =====================================================
       GLITCH AI
    ===================================================== */

    updateGlitch(
        player,
        delta
    ) {

        this.teleportTimer +=
            delta;


        if (
            this.teleportTimer >
            2500
        ) {

            this.teleportTimer =
                0;


            const angle =
                Phaser.Math.FloatBetween(
                    0,
                    Math.PI * 2
                );


            const distance =
                Phaser.Math.Between(
                    80,
                    180
                );


            this.sprite.x =
                player.sprite.x +
                Math.cos(angle) *
                distance;


            this.sprite.y =
                player.sprite.y +
                Math.sin(angle) *
                distance;

        }

    }


    /* =====================================================
       VIRUS AI
    ===================================================== */

    updateVirus(
        player,
        delta
    ) {

        this.pulseTimer +=
            delta;


        if (
            this.pulseTimer >
            1500
        ) {

            this.pulseTimer =
                0;


            this.scene.tweens.add({

                targets:
                    this.sprite,

                scale:
                    1.5,

                duration:
                    200,

                yoyo:
                    true

            });

        }


        const distance =
            Phaser.Math.Distance.Between(

                this.sprite.x,

                this.sprite.y,

                player.sprite.x,

                player.sprite.y

            );


        if (
            distance < 250
        ) {

            this.scene.physics.moveToObject(

                this.sprite,

                player.sprite,

                this.speed

            );

        }

    }


    /* =====================================================
       DAMAGE
    ===================================================== */

    takeDamage(
        amount
    ) {

        this.health -=
            amount;


        this.scene.tweens.add({

            targets:
                this.sprite,

            alpha:
                0.3,

            duration:
                80,

            yoyo:
                true

        });


        if (
            this.health <= 0
        ) {

            this.destroy();

            return true;

        }


        return false;

    }


    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        if (
            !this.sprite
        ) {

            return;

        }


        const explosion =
            this.scene.add.circle(

                this.sprite.x,

                this.sprite.y,

                10,

                this.getColor(),

                0.7

            );


        this.scene.tweens.add({

            targets:
                explosion,

            scale:
                4,

            alpha:
                0,

            duration:
                400,

            onComplete:
                () => {

                    explosion.destroy();

                }

        });


        this.sprite.destroy();

    }

}


/* =========================================================
   ENEMY MANAGER
========================================================= */

class EnemyManager {

    constructor(
        scene
    ) {

        this.scene =
            scene;

        this.enemies =
            [];

    }


    createEnemy(
        x,
        y,
        type
    ) {

        const enemy =
            new NeonEnemy(

                this.scene,

                x,

                y,

                type

            );


        this.enemies.push(
            enemy
        );


        return enemy;

    }


    update(
        player,
        delta
    ) {

        this.enemies.forEach(

            enemy => {

                enemy.update(

                    player,

                    delta

                );

            }

        );

    }


    clear() {

        this.enemies.forEach(

            enemy => {

                enemy.destroy();

            }

        );


        this.enemies = [];

    }

}
