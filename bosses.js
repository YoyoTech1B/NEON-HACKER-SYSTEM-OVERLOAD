"use strict";

/* =========================================================
   NEON HACKER
   BOSS SYSTEM
========================================================= */


class NeonBoss {

    constructor(
        scene,
        x,
        y,
        type = "firewall"
    ) {

        this.scene =
            scene;

        this.type =
            type;

        this.maxHealth =
            this.getMaxHealth();

        this.health =
            this.maxHealth;

        this.phase =
            1;

        this.attackTimer =
            0;

        this.active =
            true;

        this.create();

    }


    /* =====================================================
       STATS
    ===================================================== */

    getMaxHealth() {

        const health = {

            firewall:
                500,

            sentinel:
                750,

            core:
                1000,

            omega:
                2000

        };


        return (
            health[
                this.type
            ] ||
            500
        );

    }


    getColor() {

        const colors = {

            firewall:
                0xff3355,

            sentinel:
                0xff7b00,

            core:
                0xa855f7,

            omega:
                0x00e5ff

        };


        return (
            colors[
                this.type
            ] ||
            0xff3355
        );

    }


    getSize() {

        const sizes = {

            firewall:
                55,

            sentinel:
                65,

            core:
                75,

            omega:
                100

        };


        return (
            sizes[
                this.type
            ] ||
            55
        );

    }


    /* =====================================================
       CREATE
    ===================================================== */

    create() {

        const size =
            this.getSize();


        const color =
            this.getColor();


        this.sprite =
            this.scene.add.circle(

                this.x,

                this.y,

                size,

                color,

                0.9

            );


        this.sprite.x =
            arguments[0] ?
            undefined :
            this.sprite.x;


        this.scene.physics.add.existing(
            this.sprite
        );


        this.sprite.body.setCircle(
            size
        );


        this.sprite.setData(
            "bossSystem",
            this
        );


        this.sprite.setDepth(
            12
        );


        this.createHealthBar();

        this.createGlow();

    }


    /* =====================================================
       HEALTH BAR
    ===================================================== */

    createHealthBar() {

        this.healthBackground =
            this.scene.add.rectangle(

                this.sprite.x,

                this.sprite.y - 100,

                160,

                14,

                0x111111

            );


        this.healthBar =
            this.scene.add.rectangle(

                this.sprite.x - 80,

                this.sprite.y - 100,

                160,

                14,

                this.getColor()

            );


        this.healthBar.setOrigin(
            0,
            0.5
        );


        this.healthText =
            this.scene.add.text(

                this.sprite.x,

                this.sprite.y - 130,

                this.type.toUpperCase(),

                {

                    fontFamily:
                        "monospace",

                    fontSize:
                        "16px",

                    color:
                        "#ffffff"

                }

            );


        this.healthText.setOrigin(
            0.5
        );

    }


    /* =====================================================
       GLOW
    ===================================================== */

    createGlow() {

        this.glow =
            this.scene.add.circle(

                this.sprite.x,

                this.sprite.y,

                this.getSize() + 30,

                this.getColor(),

                0.12

            );


        this.glow.setDepth(
            11
        );


        this.scene.tweens.add({

            targets:
                this.glow,

            scale:
                1.2,

            alpha:
                0.05,

            duration:
                800,

            yoyo:
                true,

            repeat:
                -1

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
            !this.active
        ) {

            return;

        }


        this.attackTimer +=
            delta;


        this.updatePhase();


        this.updateHealthBar();


        if (
            this.attackTimer >
            this.getAttackSpeed()
        ) {

            this.attackTimer =
                0;


            this.attack(
                player
            );

        }


        this.updateUIPosition();

    }


    /* =====================================================
       PHASE
    ===================================================== */

    updatePhase() {

        const percentage =
            this.health /
            this.maxHealth;


        if (
            percentage <= 0.66 &&
            this.phase === 1
        ) {

            this.phase = 2;

        }


        if (
            percentage <= 0.33 &&
            this.phase === 2
        ) {

            this.phase = 3;

        }

    }


    /* =====================================================
       ATTACK SPEED
    ===================================================== */

    getAttackSpeed() {

        if (
            this.phase === 1
        ) {

            return 1800;

        }


        if (
            this.phase === 2
        ) {

            return 1200;

        }


        return 700;

    }


    /* =====================================================
       ATTACK
    ===================================================== */

    attack(
        player
    ) {

        if (
            !player ||
            !player.sprite
        ) {

            return;

        }


        this.scene.tweens.add({

            targets:
                this.sprite,

            scale:
                1.25,

            duration:
                120,

            yoyo:
                true

        });


        const damage =
            10 +
            (
                this.phase * 5
            );


        const distance =
            Phaser.Math.Distance.Between(

                this.sprite.x,

                this.sprite.y,

                player.sprite.x,

                player.sprite.y

            );


        if (
            distance < 220
        ) {

            player.takeDamage(
                damage
            );

        }

    }


    /* =====================================================
       DAMAGE
    ===================================================== */

    takeDamage(
        amount
    ) {

        if (
            !this.active
        ) {

            return false;

        }


        this.health -=
            amount;


        this.sprite.setFillStyle(
            0xffffff
        );


        setTimeout(
            () => {

                if (
                    this.sprite &&
                    this.sprite.active
                ) {

                    this.sprite.setFillStyle(
                        this.getColor()
                    );

                }

            },
            80
        );


        if (
            this.health <= 0
        ) {

            this.health = 0;

            this.destroy();

            return true;

        }


        return false;

    }


    /* =====================================================
       HEALTH BAR UPDATE
    ===================================================== */

    updateHealthBar() {

        if (
            !this.healthBar
        ) {

            return;

        }


        const percent =
            Math.max(

                0,

                this.health /
                this.maxHealth

            );


        this.healthBar.width =
            160 * percent;

    }


    /* =====================================================
       UI POSITION
    ===================================================== */

    updateUIPosition() {

        this.glow.x =
            this.sprite.x;

        this.glow.y =
            this.sprite.y;


        this.healthBackground.x =
            this.sprite.x;

        this.healthBackground.y =
            this.sprite.y - 100;


        this.healthBar.x =
            this.sprite.x - 80;

        this.healthBar.y =
            this.sprite.y - 100;


        this.healthText.x =
            this.sprite.x;

        this.healthText.y =
            this.sprite.y - 130;

    }


    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        this.active =
            false;


        const explosion =
            this.scene.add.circle(

                this.sprite.x,

                this.sprite.y,

                this.getSize(),

                this.getColor(),

                0.8

            );


        this.scene.tweens.add({

            targets:
                explosion,

            scale:
                5,

            alpha:
                0,

            duration:
                1000,

            onComplete:
                () => {

                    explosion.destroy();

                }

        });


        this.glow.destroy();

        this.healthBackground.destroy();

        this.healthBar.destroy();

        this.healthText.destroy();

        this.sprite.destroy();

    }

}


/* =========================================================
   BOSS MANAGER
========================================================= */

class BossManager {

    constructor(
        scene
    ) {

        this.scene =
            scene;

        this.currentBoss =
            null;

    }


    spawn(
        x,
        y,
        type
    ) {

        this.currentBoss =
            new NeonBoss(

                this.scene,

                x,

                y,

                type

            );


        return this.currentBoss;

    }


    update(
        player,
        delta
    ) {

        if (
            this.currentBoss
        ) {

            this.currentBoss.update(

                player,

                delta

            );

        }

    }


    clear() {

        if (
            this.currentBoss
        ) {

            this.currentBoss.destroy();

            this.currentBoss =
                null;

        }

    }

}
