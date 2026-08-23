"use strict";

/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   MAIN GAME ENGINE
========================================================= */


const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;


/* =========================================================
   GAME STATE
========================================================= */

const gameState = {

    level: 1,

    running: false,

    paused: false,

    complete: false,

    dataCollected: 0,

    dataTotal: 0

};


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let game;
let scene;

let playerSystem;

let walls;
let dataBits;
let enemies;

let portal;

let cursors;
let wasd;


/* =========================================================
   DOM
========================================================= */

const bootScreen =
    document.getElementById(
        "bootScreen"
    );

const bootProgress =
    document.getElementById(
        "bootProgress"
    );

const startScreen =
    document.getElementById(
        "startScreen"
    );

const pauseScreen =
    document.getElementById(
        "pauseScreen"
    );

const completeScreen =
    document.getElementById(
        "completeScreen"
    );

const levelNumber =
    document.getElementById(
        "levelNumber"
    );

const dataCount =
    document.getElementById(
        "dataCount"
    );

const dataTotal =
    document.getElementById(
        "dataTotal"
    );

const energyCount =
    document.getElementById(
        "energyCount"
    );

const completeData =
    document.getElementById(
        "completeData"
    );

const completeEnergy =
    document.getElementById(
        "completeEnergy"
    );


/* =========================================================
   BOOT
========================================================= */

function bootGame() {

    let progress = 0;

    const timer =
        setInterval(
            () => {

                progress += 10;

                bootProgress.style.width =
                    progress + "%";


                if (
                    progress >= 100
                ) {

                    clearInterval(timer);


                    setTimeout(
                        () => {

                            bootScreen.classList.add(
                                "hidden"
                            );

                        },
                        400
                    );

                }

            },
            150
        );

}


/* =========================================================
   PHASER CONFIG
========================================================= */

const config = {

    type:
        Phaser.AUTO,

    parent:
        "gameContainer",

    width:
        GAME_WIDTH,

    height:
        GAME_HEIGHT,

    backgroundColor:
        "#030812",

    physics: {

        default:
            "arcade",

        arcade: {

            gravity: {
                y: 0
            },

            debug:
                false

        }

    },

    scale: {

        mode:
            Phaser.Scale.FIT,

        autoCenter:
            Phaser.Scale.CENTER_BOTH

    },

    scene: {

        create:
            create,

        update:
            update

    }

};


/* =========================================================
   START GAME
========================================================= */

window.addEventListener(
    "load",
    () => {

        game =
            new Phaser.Game(
                config
            );

        bootGame();

        setupButtons();

    }
);


/* =========================================================
   CREATE
========================================================= */

function create() {

    scene = this;

    createBackground();

    loadLevel(
        gameState.level
    );

    createInput();

}


/* =========================================================
   UPDATE
========================================================= */

function update() {

    if (
        !gameState.running ||
        gameState.paused ||
        gameState.complete ||
        !playerSystem
    ) {

        return;

    }


    playerSystem.update({

        up:
            cursors.up.isDown ||
            wasd.up.isDown,

        down:
            cursors.down.isDown ||
            wasd.down.isDown,

        left:
            cursors.left.isDown ||
            wasd.left.isDown,

        right:
            cursors.right.isDown ||
            wasd.right.isDown

    });


    if (
        Phaser.Input.Keyboard.JustDown(
            wasd.dash
        )
    ) {

        playerSystem.dash();

    }


    updateHUD();

}


/* =========================================================
   INPUT
========================================================= */

function createInput() {

    cursors =
        scene.input.keyboard.createCursorKeys();


    wasd =
        scene.input.keyboard.addKeys({

            up:
                Phaser.Input.Keyboard.KeyCodes.W,

            down:
                Phaser.Input.Keyboard.KeyCodes.S,

            left:
                Phaser.Input.Keyboard.KeyCodes.A,

            right:
                Phaser.Input.Keyboard.KeyCodes.D,

            dash:
                Phaser.Input.Keyboard.KeyCodes.SPACE

        });

}


/* =========================================================
   BACKGROUND
========================================================= */

function createBackground() {

    const graphics =
        scene.add.graphics();


    graphics.fillStyle(
        0x030812,
        1
    );


    graphics.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    graphics.lineStyle(
        1,
        0x0b3355,
        0.35
    );


    for (
        let x = 0;
        x < GAME_WIDTH;
        x += 50
    ) {

        graphics.lineBetween(
            x,
            0,
            x,
            GAME_HEIGHT
        );

    }


    for (
        let y = 0;
        y < GAME_HEIGHT;
        y += 50
    ) {

        graphics.lineBetween(
            0,
            y,
            GAME_WIDTH,
            y
        );

    }

}


/* =========================================================
   LOAD LEVEL
========================================================= */

function loadLevel(levelID) {

    const level =
        LEVELS[levelID];


    if (!level) {

        console.log(
            "GAME COMPLETE!"
        );

        return;

    }


    gameState.dataCollected = 0;

    gameState.dataTotal =
        level.data.length;


    levelNumber.textContent =
        String(levelID).padStart(
            2,
            "0"
        );


    createWalls(
        level.walls
    );


    createDataBits(
        level.data
    );


    createEnemies(
        level.enemies
    );


    createPortal(
        level.portal
    );


    playerSystem =
        new NeonPlayer(
            scene,
            level.player.x,
            level.player.y
        );


    createCollisions();

    updateHUD();

}


/* =========================================================
   WALLS
========================================================= */

function createWalls(wallData) {

    walls =
        scene.physics.add.staticGroup();


    wallData.forEach(
        wall => {

            const block =
                walls.create(
                    wall.x,
                    wall.y
                );


            block.setSize(
                wall.width,
                wall.height
            );


            block.setDisplaySize(
                wall.width,
                wall.height
            );


            block.refreshBody();


            const graphics =
                scene.add.graphics();


            graphics.fillStyle(
                0x07192b,
                1
            );


            graphics.fillRect(
                wall.x -
                wall.width / 2,

                wall.y -
                wall.height / 2,

                wall.width,
                wall.height
            );


            graphics.lineStyle(
                2,
                0x087dbe,
                0.7
            );


            graphics.strokeRect(
                wall.x -
                wall.width / 2,

                wall.y -
                wall.height / 2,

                wall.width,
                wall.height
            );

        }
    );

}


/* =========================================================
   DATA BITS
========================================================= */

function createDataBits(positions) {

    dataBits =
        scene.physics.add.group();


    positions.forEach(
        position => {

            const bit =
                scene.add.rectangle(
                    position[0],
                    position[1],
                    20,
                    20,
                    0x00d9ff
                );


            scene.physics.add.existing(
                bit
            );


            dataBits.add(
                bit
            );


            bit.body.setCircle(
                10
            );

        }
    );

}


/* =========================================================
   ENEMIES
========================================================= */

function createEnemies(enemyData) {

    enemies =
        scene.physics.add.group();


    enemyData.forEach(
        enemyInfo => {

            const enemy =
                scene.add.circle(
                    enemyInfo.x,
                    enemyInfo.y,
                    20,
                    0xff3355
                );


            scene.physics.add.existing(
                enemy
            );


            enemy.body.setCircle(
                20
            );


            enemies.add(
                enemy
            );


            enemy.setData(
                "direction",
                1
            );

        }
    );

}


/* =========================================================
   PORTAL
========================================================= */

function createPortal(position) {

    portal =
        scene.add.circle(
            position.x,
            position.y,
            35,
            0x00aaff,
            0.25
        );


    portal.setStrokeStyle(
        4,
        0x00e5ff
    );


    scene.physics.add.existing(
        portal,
        true
    );


    scene.tweens.add({

        targets:
            portal,

        scale:
            1.2,

        duration:
            800,

        yoyo:
            true,

        repeat:
            -1

    });

}


/* =========================================================
   COLLISIONS
========================================================= */

function createCollisions() {

    scene.physics.add.collider(

        playerSystem.sprite,

        walls

    );


    scene.physics.add.overlap(

        playerSystem.sprite,

        dataBits,

        collectData

    );


    scene.physics.add.overlap(

        playerSystem.sprite,

        enemies,

        hitEnemy

    );


    scene.physics.add.overlap(

        playerSystem.sprite,

        portal,

        reachPortal

    );

}


/* =========================================================
   COLLECT DATA
========================================================= */

function collectData(
    player,
    bit
) {

    bit.destroy();


    gameState.dataCollected++;


    playerSystem.restoreEnergy(
        5
    );


    updateHUD();

}


/* =========================================================
   HIT ENEMY
========================================================= */

function hitEnemy() {

    const dead =
        playerSystem.takeDamage(
            15
        );


    if (dead) {

        restartLevel();

    }

}


/* =========================================================
   PORTAL
========================================================= */

function reachPortal() {

    if (

        gameState.dataCollected >=
        gameState.dataTotal

    ) {

        completeLevel();

    }

}


/* =========================================================
   COMPLETE LEVEL
========================================================= */

function completeLevel() {

    gameState.complete =
        true;


    completeData.textContent =
        `${gameState.dataCollected}/${gameState.dataTotal}`;


    completeEnergy.textContent =
        `${Math.round(
            playerSystem.energy
        )}%`;


    completeScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   RESTART
========================================================= */

function restartLevel() {

    gameState.running =
        false;


    gameState.complete =
        false;


    scene.scene.restart();

}


/* =========================================================
   NEXT LEVEL
========================================================= */

function nextLevel() {

    gameState.level++;


    if (
        !LEVELS[
            gameState.level
        ]
    ) {

        gameState.level = 1;

    }


    gameState.complete =
        false;


    completeScreen.classList.add(
        "hidden"
    );


    scene.scene.restart();


    setTimeout(
        () => {

            gameState.running =
                true;

        },
        100
    );

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    if (!playerSystem) {
        return;
    }


    dataCount.textContent =
        gameState.dataCollected;


    dataTotal.textContent =
        gameState.dataTotal;


    energyCount.textContent =
        Math.round(
            playerSystem.energy
        );

}


/* =========================================================
   BUTTONS
========================================================= */

function setupButtons() {

    document
        .getElementById(
            "startButton"
        )
        .addEventListener(
            "click",
            () => {

                gameState.running =
                    true;


                startScreen.classList.add(
                    "hidden"
                );

            }
        );


    document
        .getElementById(
            "pauseButton"
        )
        .addEventListener(
            "click",
            togglePause
        );


    document
        .getElementById(
            "resumeButton"
        )
        .addEventListener(
            "click",
            togglePause
        );


    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            restartLevel
        );


    document
        .getElementById(
            "nextButton"
        )
        .addEventListener(
            "click",
            nextLevel
        );

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (
        !gameState.running
    ) {

        return;

    }


    gameState.paused =
        !gameState.paused;


    if (
        gameState.paused
    ) {

        pauseScreen.classList.remove(
            "hidden"
        );

    } else {

        pauseScreen.classList.add(
            "hidden"
        );

    }

}
