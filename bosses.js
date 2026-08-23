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

        this.scene = scene;

        this.x = x;

        this.y = y;

        this.type = type;

        this.maxHealth =
            this.getMaxHealth();

        this.health =
            this.maxHealth;

        this.phase = 1;

        this.attackTimer = 0;

        this.active = true;

        this.create();

    }


    /* =====================================================
       STATS
    ===================================================== */

    getMaxHealth() {

        const values = {

            firewall: 500,

            sentinel: 750,

            core: 1000,

            omega: 2000

        };


        return (
            values[this.type] ||
            500
        );

    }


    getColor() {

        const colors = {

            firewall: 0xff3355,

            sentinel: 0xff7b00,

            core: 0xa855f7,

            omega: 0x00e5ff

        };


        return (
            colors[this.type] ||
            0xff3355
        );

    }


    getSize() {

        const sizes = {

            firewall: 55,

            sentinel: 65,

            core: 75,

            omega: 100

        };


        return (
            sizes[this.type] ||
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


        this.glow =
            this.scene.add.circle(

                this.x,
                this.y,

                size + 30,

                color,

                0.12

            );


        this.glow.setDepth(
            11
        );


        this.sprite =
            this.scene.add.circle(

                this.x,
                this.y,

                size,

                color,

                1

            );


        this.scene.physics.add.existing(
            this.sprite
        );


        this.sprite.body.setCircle(
            size
        );


        this.sprite.body.setImmovable(
            true
        );


        this.sprite.setDepth(
            12
        );


        this.sprite.setData(
            "bossSystem",
            this
        );


        this.createHealthBar();


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


        this.scene.tweens.add({

            targets:
                this.sprite,

            angle:
                360,

            duration:
                5000,

            repeat:
                -1

        });

    }


    /* =====================================================
       HEALTH BAR
    ===================================================== */

    createHealthBar() {

        this.healthBackground =
            this.scene.add.rectangle(

                this.x,

                this.y - 100,

                180,

                14,

                0x111111,

                0.9

            );


        this.healthBar =
            this.scene.add.rectangle(

                this.x - 90,

                this.y - 100,

                180,

                14,

                this.getColor(),

                1

            );


        this.healthBar.setOrigin(
            0,
            0.5
        );


        this.healthText =
            this.scene.add.text(

                this.x,

                this.y - 130,

                this.type.toUpperCase(),

                {

                    fontFamily:
                        "monospace",

                    fontSize:
                        "16px",

                    color:
                        "#ffffff",

                    fontStyle:
                        "bold"

                }

            );


        this.healthText.setOrigin(
            0.5
        );


        this.healthBackground.setDepth(
            100
        );

        this.healthBar.setDepth(
            101
        );

        this.healthText.setDepth(
            101
        );

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

        this.updateUIPosition();


        if (
            this.attackTimer >=
            this.getAttackSpeed()
        ) {

            this.attackTimer = 0;

            this.attack(player);

        }

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

            gameUI.notify(
                "BOSS PHASE 2",
                "The system is adapting."
            );

        }


        if (
            percentage <= 0.33 &&
            this.phase === 2
        ) {

            this.phase = 3;

            gameUI.notify(
                "BOSS PHASE 3",
                "CRITICAL OVERLOAD."
            );

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

    attack(player) {

        if (
            !player ||
            !player.sprite ||
            !player.sprite.active
        ) {

            return;

        }


        const distance =
            Phaser.Math.Distance.Between(

                this.sprite.x,
                this.sprite.y,

                player.sprite.x,
                player.sprite.y

            );


        /* VISUAL ATTACK */

        const beam =
            this.scene.add.line(

                0,
                0,

                this.sprite.x,
                this.sprite.y,

                player.sprite.x,
                player.sprite.y,

                this.getColor(),
                0.8

            );


        beam.setLineWidth(
            4
        );


        beam.setDepth(
            14
        );


        this.scene.tweens.add({

            targets:
                beam,

            alpha:
                0,

            duration:
                250,

            onComplete:
                () => {

                    beam.destroy();

                }

        });


        /* DAMAGE */

        if (
            distance < 500
        ) {

            const damage =
                10 +
                this.phase * 5;


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


        gameUI.floatingText(

            this.scene,

            this.sprite.x,

            this.sprite.y,

            "-" + amount,

            "#ff3355"

        );


        this.scene.tweens.add({

            targets:
                this.sprite,

            alpha:
                0.35,

            duration:
                70,

            yoyo:
                true

        });


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
       HEALTH BAR
    ===================================================== */

    updateHealthBar() {

        if (
            !this.healthBar
        ) {

            return;

        }


        const percentage =
            Math.max(
                0,
                this.health /
                this.maxHealth
            );


        this.healthBar.width =
            180 * percentage;

    }


    /* =====================================================
       POSITION UI
    ===================================================== */

    updateUIPosition() {

        if (
            !this.sprite
        ) {

            return;

        }


        this.glow.x =
            this.sprite.x;

        this.glow.y =
            this.sprite.y;


        this.healthBackground.x =
            this.sprite.x;

        this.healthBackground.y =
            this.sprite.y - 100;


        this.healthBar.x =
            this.sprite.x - 90;

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

        if (
            !this.active
        ) {

            return;

        }


        this.active = false;


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
                900,

            onComplete:
                () => {

                    explosion.destroy();

                }

        });


        if (
            this.glow
        ) {

            this.glow.destroy();

        }


        if (
            this.healthBackground
        ) {

            this.healthBackground.destroy();

        }


        if (
            this.healthBar
        ) {

            this.healthBar.destroy();

        }


        if (
            this.healthText
        ) {

            this.healthText.destroy();

        }


        if (
            this.sprite
        ) {

            this.sprite.destroy();

        }

    }

}


/* =========================================================
   BOSS MANAGER
========================================================= */

class BossManager {

    constructor(scene) {

        this.scene = scene;

        this.currentBoss = null;

    }


    spawn(
        x,
        y,
        type
    ) {

        this.clear();


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
            this.currentBoss &&
            this.currentBoss.active
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
