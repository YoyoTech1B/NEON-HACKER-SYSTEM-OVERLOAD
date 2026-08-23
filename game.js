"use strict";

/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   MAIN GAME
========================================================= */

let game;
let mainScene;

/* =========================================================
   GAME CONFIG
========================================================= */

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const gameConfig = {
    type: Phaser.AUTO,

    width: GAME_WIDTH,
    height: GAME_HEIGHT,

    backgroundColor: "#050816",

    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


/* =========================================================
   START GAME
========================================================= */

window.addEventListener("load", () => {

    game = new Phaser.Game(gameConfig);

});


/* =========================================================
   PRELOAD
========================================================= */

function preload() {

    mainScene = this;

    createTextures(this);

}


/* =========================================================
   CREATE
========================================================= */

function create() {

    mainScene = this;

    initializeWorld(this);

    initializePlayer(this);

    initializeSystems(this);

    initializeInput(this);

    initializeUI(this);

    startLevel(
        gameStorage.getLevel()
    );

}


/* =========================================================
   CREATE TEXTURES
========================================================= */

function createTextures(scene) {

    /* PLAYER */

    if (!scene.textures.exists("player")) {

        const canvas =
            document.createElement("canvas");

        canvas.width = 64;
        canvas.height = 64;

        const ctx =
            canvas.getContext("2d");

        ctx.fillStyle = "#00e5ff";

        ctx.beginPath();

        ctx.moveTo(32, 5);
        ctx.lineTo(58, 32);
        ctx.lineTo(32, 59);
        ctx.lineTo(6, 32);

        ctx.closePath();

        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(32, 32, 7, 0, Math.PI * 2);

        ctx.fill();

        scene.textures.addCanvas(
            "player",
            canvas
        );

    }


    /* PROJECTILE */

    if (!scene.textures.exists("projectile")) {

        const canvas =
            document.createElement("canvas");

        canvas.width = 20;
        canvas.height = 20;

        const ctx =
            canvas.getContext("2d");

        ctx.fillStyle = "#00ffff";

        ctx.beginPath();

        ctx.arc(
            10,
            10,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        scene.textures.addCanvas(
            "projectile",
            canvas
        );

    }

}


/* =========================================================
   WORLD
========================================================= */

function initializeWorld(scene) {

    scene.add.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        GAME_WIDTH,
        GAME_HEIGHT,
        0x050816
    );

    /* GRID */

    for (
        let x = 0;
        x <= GAME_WIDTH;
        x += 40
    ) {

        scene.add.line(
            0,
            0,
            x,
            0,
            x,
            GAME_HEIGHT,
            0x12304a,
            0.35
        );

    }


    for (
        let y = 0;
        y <= GAME_HEIGHT;
        y += 40
    ) {

        scene.add.line(
            0,
            0,
            0,
            y,
            GAME_WIDTH,
            y,
            0x12304a,
            0.35
        );

    }


    /* BORDER */

    scene.add.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        GAME_WIDTH - 20,
        GAME_HEIGHT - 20
    )
    .setStrokeStyle(
        3,
        0x00e5ff,
        0.5
    );

}


/* =========================================================
   PLAYER
========================================================= */

function initializePlayer(scene) {

    scene.player = {

        sprite:
            scene.physics.add.sprite(
                GAME_WIDTH / 2,
                GAME_HEIGHT - 100,
                "player"
            ),

        speed:
            260,

        maxHealth:
            100,

        health:
            100,

        energy:
            100,

        maxEnergy:
            100,

        shield:
            0,

        invulnerable:
            false,

        shootCooldown:
            0,

        dashCooldown:
            0,

        restoreEnergy(amount) {

            this.energy =
                Math.min(
                    this.maxEnergy,
                    this.energy + amount
                );

        },

        takeDamage(amount) {

            if (this.invulnerable) {
                return;
            }

            if (this.shield > 0) {

                this.shield--;

                gameAudio.damage();

                gameUI.notify(
                    "SHIELD BLOCKED",
                    "Attack absorbed."
                );

                return;
            }

            this.health -= amount;

            gameAudio.damage();

            gameUI.damageFlash();

            if (
                this.health <= 0
            ) {

                this.health = 0;

                playerDeath();

            }

        }

    };


    scene.player.sprite.setDepth(20);

}


/* =========================================================
   SYSTEMS
========================================================= */

function initializeSystems(scene) {

    scene.enemyManager =
        new EnemyManager(scene);

    scene.itemManager =
        new ItemManager(scene);

    scene.bossManager =
        new BossManager(scene);

}


/* =========================================================
   INPUT
========================================================= */

function initializeInput(scene) {

    scene.keys =
        scene.input.keyboard.addKeys({

            W:
                Phaser.Input.Keyboard.KeyCodes.W,

            A:
                Phaser.Input.Keyboard.KeyCodes.A,

            S:
                Phaser.Input.Keyboard.KeyCodes.S,

            D:
                Phaser.Input.Keyboard.KeyCodes.D,

            UP:
                Phaser.Input.Keyboard.KeyCodes.UP,

            DOWN:
                Phaser.Input.Keyboard.KeyCodes.DOWN,

            LEFT:
                Phaser.Input.Keyboard.KeyCodes.LEFT,

            RIGHT:
                Phaser.Input.Keyboard.KeyCodes.RIGHT,

            SPACE:
                Phaser.Input.Keyboard.KeyCodes.SPACE,

            SHIFT:
                Phaser.Input.Keyboard.KeyCodes.SHIFT

        });


    scene.input.on(
        "pointerdown",
        shoot
    );

}


/* =========================================================
   UI
========================================================= */

function initializeUI(scene) {

    scene.healthText =
        scene.add.text(
            30,
            25,
            "",
            {
                fontFamily:
                    "monospace",

                fontSize:
                    "18px",

                color:
                    "#ffffff",

                fontStyle:
                    "bold"
            }
        )
        .setDepth(100);


    scene.energyText =
        scene.add.text(
            30,
            52,
            "",
            {
                fontFamily:
                    "monospace",

                fontSize:
                    "16px",

                color:
                    "#00e5ff"
            }
        )
        .setDepth(100);


    scene.levelText =
        scene.add.text(
            GAME_WIDTH - 30,
            25,
            "",
            {
                fontFamily:
                    "monospace",

                fontSize:
                    "20px",

                color:
                    "#00e5ff",

                fontStyle:
                    "bold"
            }
        )
        .setOrigin(1, 0)
        .setDepth(100);


    scene.dataText =
        scene.add.text(
            GAME_WIDTH - 30,
            55,
            "",
            {
                fontFamily:
                    "monospace",

                fontSize:
                    "16px",

                color:
                    "#ffffff"
            }
        )
        .setOrigin(1, 0)
        .setDepth(100);

}


/* =========================================================
   START LEVEL
========================================================= */

function startLevel(level) {

    if (
        level < 1
    ) {

        level = 1;

    }


    if (
        level > 100
    ) {

        level = 100;

    }


    mainScene.currentLevel =
        level;


    gameStorage.setLevel(
        level
    );


    /* CLEAR OLD OBJECTS */

    mainScene.enemyManager.clear();

    mainScene.itemManager.clear();

    mainScene.bossManager.clear();


    /* RESET PLAYER */

    mainScene.player.health =
        mainScene.player.maxHealth;

    mainScene.player.energy =
        mainScene.player.maxEnergy;

    mainScene.player.sprite.x =
        GAME_WIDTH / 2;

    mainScene.player.sprite.y =
        GAME_HEIGHT - 100;


    /* LEVEL DIFFICULTY */

    const enemyCount =
        Math.min(
            3 +
            Math.floor(level * 0.7),
            20
        );


    const enemyTypes = [
        "drone",
        "hunter",
        "guardian",
        "glitch",
        "virus"
    ];


    for (
        let i = 0;
        i < enemyCount;
        i++
    ) {

        const type =
            enemyTypes[
                Math.min(
                    Math.floor(
                        (level - 1) / 8
                    ),
                    enemyTypes.length - 1
                )
            ];


        const x =
            Phaser.Math.Between(
                100,
                GAME_WIDTH - 100
            );


        const y =
            Phaser.Math.Between(
                120,
                GAME_HEIGHT / 2
            );


        mainScene.enemyManager.createEnemy(
            x,
            y,
            type
        );

    }


    /* ITEMS */

    const itemCount =
        4 +
        Math.floor(level / 5);


    for (
        let i = 0;
        i < itemCount;
        i++
    ) {

        const types = [
            "data",
            "energy",
            "data",
            "crystal"
        ];


        const type =
            types[
                Phaser.Math.Between(
                    0,
                    types.length - 1
                )
            ];


        mainScene.itemManager.createItem(

            Phaser.Math.Between(
                80,
                GAME_WIDTH - 80
            ),

            Phaser.Math.Between(
                120,
                GAME_HEIGHT - 100
            ),

            type

        );

    }


    /* BOSS EVERY 10 LEVELS */

    if (
        level % 10 === 0
    ) {

        const bossTypes = [

            "firewall",
            "sentinel",
            "core",
            "omega"

        ];


        const bossIndex =
            Math.min(
                Math.floor(
                    level / 10
                ) - 1,
                bossTypes.length - 1
            );


        mainScene.bossManager.spawn(

            GAME_WIDTH / 2,

            180,

            bossTypes[
                bossIndex
            ]

        );


        gameAudio.boss();

    }


    gameUI.showLevel(
        level,
        getLevelName(level)
    );

}


/* =========================================================
   LEVEL NAMES
========================================================= */

function getLevelName(level) {

    const names = [

        "BOOT SEQUENCE",
        "DIGITAL ALLEY",
        "DATA TUNNEL",
        "NEON GRID",
        "FIREWALL CITY",
        "CODE STORM",
        "VIRUS ZONE",
        "CYBER CORE",
        "SYSTEM BREACH",
        "THE FIREWALL",

        "GHOST NETWORK",
        "BLACK CIRCUIT",
        "ZERO SPACE",
        "QUANTUM GRID",
        "DEEP CODE",
        "OVERLOAD",
        "PHANTOM SERVER",
        "DARK PROTOCOL",
        "VOID NETWORK",
        "THE SENTINEL",

        "MEGA SERVER",
        "DATA OCEAN",
        "CRYPTO CITY",
        "NEXUS",
        "MACHINE DISTRICT",
        "CORE BREACH",
        "RED ALERT",
        "CYBER VOID",
        "SYSTEM ZERO",
        "OMEGA GATE"

    ];


    return (
        names[
            (level - 1) %
            names.length
        ]
    );

}


/* =========================================================
   UPDATE
========================================================= */

function update(
    time,
    delta
) {

    if (
        !mainScene ||
        !mainScene.player
    ) {

        return;

    }


    updatePlayer(delta);

    updateSystems(delta);

    updateUI();

}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(delta) {

    const player =
        mainScene.player;


    let vx = 0;
    let vy = 0;


    if (
        mainScene.keys.A.isDown ||
        mainScene.keys.LEFT.isDown
    ) {

        vx--;

    }


    if (
        mainScene.keys.D.isDown ||
        mainScene.keys.RIGHT.isDown
    ) {

        vx++;

    }


    if (
        mainScene.keys.W.isDown ||
        mainScene.keys.UP.isDown
    ) {

        vy--;

    }


    if (
        mainScene.keys.S.isDown ||
        mainScene.keys.DOWN.isDown
    ) {

        vy++;

    }


    if (
        vx !== 0 ||
        vy !== 0
    ) {

        const length =
            Math.sqrt(
                vx * vx +
                vy * vy
            );


        vx /=
            length;

        vy /=
            length;

    }


    player.sprite.setVelocity(

        vx *
        player.speed,

        vy *
        player.speed

    );


    /* DASH */

    if (
        Phaser.Input.Keyboard.JustDown(
            mainScene.keys.SHIFT
        ) &&
        player.dashCooldown <= 0
    ) {

        const dashX =
            vx ||
            0;

        const dashY =
            vy ||
            -1;


        player.sprite.x +=
            dashX * 180;

        player.sprite.y +=
            dashY * 180;


        player.dashCooldown =
            1000;

        gameAudio.dash();

    }


    player.dashCooldown -=
        delta;


    /* SPACE SHOOT */

    if (
        mainScene.keys.SPACE.isDown
    ) {

        shoot();

    }


    /* BOUNDS */

    player.sprite.x =
        Phaser.Math.Clamp(
            player.sprite.x,
            40,
            GAME_WIDTH - 40
        );


    player.sprite.y =
        Phaser.Math.Clamp(
            player.sprite.y,
            80,
            GAME_HEIGHT - 40
        );

}


/* =========================================================
   SHOOT
========================================================= */

function shoot() {

    const player =
        mainScene.player;


    if (
        player.shootCooldown > 0
    ) {

        return;

    }


    if (
        player.energy < 5
    ) {

        return;

    }


    player.energy -=
        5;


    player.shootCooldown =
        180;


    const projectile =
        mainScene.physics.add.sprite(

            player.sprite.x,

            player.sprite.y - 35,

            "projectile"

        );


    projectile.setVelocityY(
        -700
    );


    projectile.setDepth(
        15
    );


    projectile.setData(
        "damage",
        25
    );


    mainScene.time.delayedCall(

        1500,

        () => {

            if (
                projectile.active
            ) {

                projectile.destroy();

            }

        }

    );

}


function updateProjectileCooldown() {

    if (
        mainScene.player.shootCooldown > 0
    ) {

        mainScene.player.shootCooldown--;

    }

}


/* =========================================================
   SYSTEM UPDATE
========================================================= */

function updateSystems(delta) {

    mainScene.enemyManager.update(

        mainScene.player,

        delta

    );


    mainScene.bossManager.update(

        mainScene.player,

        delta

    );


    mainScene.player.shootCooldown =
        Math.max(
            0,
            mainScene.player.shootCooldown - delta
        );


    /* ENEMY COLLISION */

    mainScene.enemyManager.enemies.forEach(

        enemy => {

            if (
                !enemy.sprite ||
                !enemy.sprite.active
            ) {

                return;

            }


            const distance =
                Phaser.Math.Distance.Between(

                    enemy.sprite.x,
                    enemy.sprite.y,

                    mainScene.player.sprite.x,
                    mainScene.player.sprite.y

                );


            if (
                distance < 30
            ) {

                mainScene.player.takeDamage(
                    enemy.damage
                );

            }

        }

    );


    /* ITEM COLLISION */

  mainScene.itemManager.items.slice().forEach(

        item => {

            if (
                !item.active
            ) {

                return;

            }


            const distance =
                Phaser.Math.Distance.Between(

                    item.x,
                    item.y,

                    mainScene.player.sprite.x,
                    mainScene.player.sprite.y

                );


            if (
                distance < 35
            ) {

                collectItem(item);

            }

        }

    );


    /* PROJECTILES */

    mainScene.children.list.forEach(

        object => {

            if (
                !object ||
                !object.active ||
                !object.getData
            ) {

                return;

            }


            const damage =
                object.getData(
                    "damage"
                );


            if (
                !damage
            ) {

                return;

            }


            mainScene.enemyManager.enemies.forEach(

                enemy => {

                    if (
                        !enemy.sprite ||
                        !enemy.sprite.active
                    ) {

                        return;

                    }


                    const distance =
                        Phaser.Math.Distance.Between(

                            object.x,
                            object.y,

                            enemy.sprite.x,
                            enemy.sprite.y

                        );


                    if (
                        distance < 35
                    ) {

                        enemy.takeDamage(
                            damage
                        );


                        object.destroy();


                        gameUI.floatingText(

                            mainScene,

                            enemy.sprite.x,

                            enemy.sprite.y,

                            "-" + damage,

                            "#ff3355"

                        );

                    }

                }

            );


            /* BOSS */

            const boss =
                mainScene.bossManager.currentBoss;


            if (
                boss &&
                boss.active &&
                object.active
            ) {

                const distance =
                    Phaser.Math.Distance.Between(

                        object.x,
                        object.y,

                        boss.sprite.x,
                        boss.sprite.y

                    );


                if (
                    distance <
                    boss.getSize()
                ) {

                    boss.takeDamage(
                        damage
                    );


                    object.destroy();

                }

            }

        }

    );


    /* =====================================================
   CHECK LEVEL
===================================================== */

if (
    !mainScene.levelCompleting &&
    !mainScene.playerDead
) {

    const enemiesAlive =
        mainScene.enemyManager.enemies.filter(
            enemy =>
                enemy &&
                enemy.sprite &&
                enemy.sprite.active
        ).length;


    const boss =
        mainScene.bossManager.currentBoss;


    const bossAlive =
        boss &&
        boss.active;


    if (
        enemiesAlive === 0 &&
        !bossAlive
    ) {

        levelComplete();

    }

}

/* =========================================================
   COLLECT ITEM
========================================================= */

function collectItem(item) {

    const result =
        mainScene.itemManager.collect(

            item,

            mainScene.player

        );


    if (
        !result
    ) {

        return;

    }


    mainScene.itemManager.destroyItem(
        item
    );


    gameAudio.collect();


    if (
        result.type ===
        "data"
    ) {

        gameStorage.addData(
            result.amount
        );


        gameUI.floatingText(

            mainScene,

            mainScene.player.sprite.x,

            mainScene.player.sprite.y,

            "+" +
            result.amount +
            " DATA",

            "#00e5ff"

        );

    }


    if (
        result.type ===
        "crystal"
    ) {

        gameStorage.addCrystals(
            result.amount
        );


        gameUI.floatingText(

            mainScene,

            mainScene.player.sprite.x,

            mainScene.player.sprite.y,

            "+" +
            result.amount +
            " CRYSTAL",

            "#ff00ff"

        );

    }


    if (
        result.type ===
        "shield"
    ) {

        mainScene.player.shield++;


        gameUI.notify(
            "SHIELD ONLINE",
            "Protection activated."
        );

    }


    if (
        result.type ===
        "speed"
    ) {

        gameUI.notify(
            "SPEED BOOST",
            "Movement increased."
        );

    }

}


/* =========================================================
   LEVEL COMPLETE
========================================================= */

function levelComplete() {

    if (
        mainScene.levelCompleting
    ) {

        return;

    }


    mainScene.levelCompleting =
        true;


    const level =
        mainScene.currentLevel;


    gameStorage.completeLevel(

        level,

        {
            data:
                level * 10,

            crystals:
                level >= 10 ?
                5 :
                1

        }

    );


    gameAudio.complete();


    gameUI.notify(
        "LEVEL COMPLETE!",
        "System secured."
    );


    mainScene.time.delayedCall(

        1800,

        () => {

            mainScene.levelCompleting =
                false;


            startLevel(
                level + 1
            );

        }

    );

}


/* =========================================================
   PLAYER DEATH
========================================================= */

function playerDeath() {

    if (
        mainScene.playerDead
    ) {

        return;

    }


    mainScene.playerDead =
        true;


    gameStorage.addDeath();


    gameUI.notify(
        "SYSTEM FAILURE",
        "Rebooting..."
    );


    mainScene.player.sprite.setVelocity(
        0,
        0
    );


    mainScene.time.delayedCall(

        1500,

        () => {

            mainScene.playerDead =
                false;

            startLevel(
                mainScene.currentLevel
            );

        }

    );

}


/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    const player =
        mainScene.player;


    mainScene.healthText.setText(

        "HP  " +
        player.health +
        " / " +
        player.maxHealth

    );


    mainScene.energyText.setText(

        "ENERGY  " +
        Math.floor(
            player.energy
        ) +
        " / " +
        player.maxEnergy

    );


    mainScene.levelText.setText(

        "LEVEL " +
        String(
            mainScene.currentLevel
        ).padStart(
            2,
            "0"
        )

    );


    mainScene.dataText.setText(

        "DATA  " +
        gameStorage.getData()

    );

}


/* =========================================================
   GLOBAL KEYBOARD INPUT FUNCTION
========================================================= */

function createKeyboardInput(scene) {

    initializeInput(scene);

}
