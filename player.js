/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   PLAYER SYSTEM
========================================================= */

"use strict";


/* =========================================================
   PLAYER CONFIGURATION
========================================================= */

const PLAYER_CONFIG = {

    speed: 260,

    dashSpeed: 850,

    dashDuration: 140,

    dashCooldown: 900,

    maxEnergy: 100,

    dashEnergyCost: 20,

    hitEnergyCost: 15,

    dataEnergyReward: 5,

    size: 28,

    glowSize: 30

};


/* =========================================================
   PLAYER CLASS
========================================================= */

class NeonPlayer {

    constructor(scene, x, y) {

        this.scene = scene;

        this.x = x;

        this.y = y;

        this.speed =
            PLAYER_CONFIG.speed;

        this.dashSpeed =
            PLAYER_CONFIG.dashSpeed;

        this.maxEnergy =
            PLAYER_CONFIG.maxEnergy;

        this.energy =
            PLAYER_CONFIG.maxEnergy;

        this.dashReady = true;

        this.isHacking = false;

        this.isInvulnerable = false;

        this.direction = {
            x: 1,
            y: 0
        };

        this.create();

    }


    /* =====================================================
       CREATE PLAYER
    ===================================================== */

    create() {

        this.createTexture();

        this.sprite =
            this.scene.physics.add.sprite(
                this.x,
                this.y,
                "neonPlayer"
            );


        this.sprite.setSize(
            PLAYER_CONFIG.size,
            PLAYER_CONFIG.size
        );


        this.sprite.setCollideWorldBounds(
            true
        );


        this.sprite.setDepth(10);


        this.createGlow();

        this.createEnergyRing();

    }


    /* =====================================================
       PLAYER TEXTURE
    ===================================================== */

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


        /* OUTER GLOW */

        const gradient =
            ctx.createRadialGradient(
                32,
                32,
                5,
                32,
                32,
                32
            );


        gradient.addColorStop(
            0,
            "rgba(0,220,255,0.9)"
        );


        gradient.addColorStop(
            0.45,
            "rgba(0,130,255,0.4)"
        );


        gradient.addColorStop(
            1,
            "rgba(0,70,255,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            64,
            64
        );


        /* PLAYER CORE */

        ctx.beginPath();


        ctx.arc(
            32,
            32,
            19,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#008dff";


        ctx.fill();


        /* PLAYER OUTLINE */

        ctx.lineWidth = 3;

        ctx.strokeStyle =
            "#8deaff";


        ctx.stroke();


        /* CORE */

        ctx.beginPath();


        ctx.arc(
            32,
            32,
            7,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fill();


        /* ENERGY LINE */

        ctx.beginPath();


        ctx.moveTo(
            18,
            32
        );


        ctx.lineTo(
            46,
            32
        );


        ctx.strokeStyle =
            "rgba(255,255,255,0.7)";


        ctx.lineWidth = 2;


        ctx.stroke();


        this.scene.textures.addCanvas(
            "neonPlayer",
            canvas
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
                PLAYER_CONFIG.glowSize,
                0x008cff,
                0.10
            );


        this.glow.setDepth(5);

    }


    /* =====================================================
       ENERGY RING
    ===================================================== */

    createEnergyRing() {

        this.energyRing =
            this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                24,
                0x00d9ff,
                0
            );


        this.energyRing.setStrokeStyle(
            1,
            0x00d9ff,
            0.35
        );


        this.energyRing.setDepth(6);

    }


    /* =====================================================
       UPDATE
    ===================================================== */

    update(input) {

        if (
            !this.sprite ||
            !this.sprite.active
        ) {

            return;

        }


        this.updateGlow();

        this.updateEnergyRing();


        if (
            !input ||
            input.disabled
        ) {

            this.stop();

            return;

        }


        let x = 0;

        let y = 0;


        if (input.left) {

            x -= 1;

        }


        if (input.right) {

            x += 1;

        }


        if (input.up) {

            y -= 1;

        }


        if (input.down) {

            y += 1;

        }


        const magnitude =
            Math.sqrt(
                x * x +
                y * y
            );


        if (magnitude > 0) {

            x /= magnitude;

            y /= magnitude;


            this.direction.x =
                x;

            this.direction.y =
                y;


            this.sprite.setVelocity(
                x * this.speed,
                y * this.speed
            );


            this.animateMovement();

        } else {

            this.stop();

        }

    }


    /* =====================================================
       STOP
    ===================================================== */

    stop() {

        this.sprite.setVelocity(
            0,
            0
        );

    }


    /* =====================================================
       DASH
    ===================================================== */

    dash() {

        if (
            !this.dashReady
        ) {

            return false;

        }


        if (
            this.energy <
            PLAYER_CONFIG.dashEnergyCost
        ) {

            return false;

        }


        this.energy -=
            PLAYER_CONFIG.dashEnergyCost;


        this.dashReady =
            false;


        this.sprite.setVelocity(
            this.direction.x *
            this.dashSpeed,

            this.direction.y *
            this.dashSpeed
        );


        this.createDashEffect();


        setTimeout(
            () => {

                if (
                    this.sprite &&
                    this.sprite.active
                ) {

                    this.dashReady =
                        true;

                }

            },

            PLAYER_CONFIG.dashCooldown
        );


        return true;

    }


    /* =====================================================
       DASH EFFECT
    ===================================================== */

    createDashEffect() {

        const ring =
            this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                12,
                0x00cfff,
                0.3
            );


        ring.setStrokeStyle(
            2,
            0x8ceaff,
            0.8
        );


        this.scene.tweens.add({

            targets: ring,

            radius: 65,

            alpha: 0,

            duration: 350,

            onComplete: () => {

                ring.destroy();

            }

        });


        this.scene.tweens.add({

            targets: this.sprite,

            scaleX: 1.35,

            scaleY: 0.8,

            duration: 70,

            yoyo: true

        });

    }


    /* =====================================================
       HACK
    ===================================================== */

    hack() {

        if (
            this.isHacking
        ) {

            return false;

        }


        this.isHacking =
            true;


        this.createHackEffect();


        setTimeout(
            () => {

                this.isHacking =
                    false;

            },

            1000
        );


        return true;

    }


    /* =====================================================
       HACK EFFECT
    ===================================================== */

    createHackEffect() {

        const ring =
            this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                15,
                0x00ffff,
                0
            );


        ring.setStrokeStyle(
            2,
            0x00ffff,
            0.9
        );


        this.scene.tweens.add({

            targets: ring,

            radius: 100,

            alpha: 0,

            duration: 700,

            onComplete: () => {

                ring.destroy();

            }

        });


        const text =
            this.scene.add.text(
                this.sprite.x,
                this.sprite.y - 45,
                "ACCESS",
                {
                    fontFamily:
                        "monospace",

                    fontSize:
                        "11px",

                    color:
                        "#67e8ff",

                    fontStyle:
                        "bold"
                }
            );


        text.setOrigin(
            0.5
        );


        this.scene.tweens.add({

            targets: text,

            y:
                text.y - 25,

            alpha: 0,

            duration: 700,

            onComplete: () => {

                text.destroy();

            }

        });

    }


    /* =====================================================
       TAKE DAMAGE
    ===================================================== */

    takeDamage(amount) {

        if (
            this.isInvulnerable
        ) {

            return false;

        }


        this.energy -=
            amount;


        if (
            this.energy < 0
        ) {

            this.energy = 0;

        }


        this.createDamageEffect();


        if (
            this.energy <= 0
        ) {

            return true;

        }


        return false;

    }


    /* =====================================================
       DAMAGE EFFECT
    ===================================================== */

    createDamageEffect() {

        this.isInvulnerable =
            true;


        this.sprite.setTint(
            0xff3158
        );


        this.scene.tweens.add({

            targets:
                this.sprite,

            alpha:
                0.35,

            duration:
                70,

            yoyo:
                true,

            repeat:
                3,

            onComplete: () => {

                if (
                    this.sprite &&
                    this.sprite.active
                ) {

                    this.sprite.clearTint();

                    this.sprite.alpha =
                        1;

                    this.isInvulnerable =
                        false;

                }

            }

        });

    }


    /* =====================================================
       RESTORE ENERGY
    ===================================================== */

    restoreEnergy(amount) {

        this.energy =
            Math.min(
                this.maxEnergy,
                this.energy + amount
            );

    }


    /* =====================================================
       MOVEMENT ANIMATION
    ===================================================== */

    animateMovement() {

        if (
            !this.sprite
        ) {

            return;

        }


        this.sprite.rotation =
            this.direction.x *
            0.08;


        this.scene.tweens.add({

            targets:
                this.sprite,

            scaleX:
                1.04,

            scaleY:
                0.96,

            duration:
                100,

            yoyo:
                true

        });

    }


    /* =====================================================
       GLOW UPDATE
    ===================================================== */

    updateGlow() {

        if (
            !this.glow
        ) {

            return;

        }


        this.glow.x =
            this.sprite.x;


        this.glow.y =
            this.sprite.y;


        this.glow.scale =
            1 +
            Math.sin(
                Date.now() * 0.005
            ) *
            0.08;

    }


    /* =====================================================
       ENERGY RING UPDATE
    ===================================================== */

    updateEnergyRing() {

        if (
            !this.energyRing
        ) {

            return;

        }


        this.energyRing.x =
            this.sprite.x;


        this.energyRing.y =
            this.sprite.y;


        const energyPercent =
            this.energy /
            this.maxEnergy;


        this.energyRing.alpha =
            0.15 +
            energyPercent *
            0.35;


        this.energyRing.scale =
            0.9 +
            energyPercent *
            0.1;

    }


    /* =====================================================
       POSITION
    ===================================================== */

    getPosition() {

        return {

            x:
                this.sprite.x,

            y:
                this.sprite.y

        };

    }


    /* =====================================================
       SET POSITION
    ===================================================== */

    setPosition(x, y) {

        this.sprite.setPosition(
            x,
            y
        );

    }


    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        if (
            this.glow
        ) {

            this.glow.destroy();

        }


        if (
            this.energyRing
        ) {

            this.energyRing.destroy();

        }


        if (
            this.sprite
        ) {

            this.sprite.destroy();

        }

    }

}


/* =========================================================
   GLOBAL PLAYER FACTORY
========================================================= */

function createNeonPlayer(
    scene,
    x,
    y
) {

    return new NeonPlayer(
        scene,
        x,
        y
    );

}
