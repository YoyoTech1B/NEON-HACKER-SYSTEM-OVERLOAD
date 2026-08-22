// PLAYER SYSTEM VERSION 2
/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   GAME ENGINE
   LEVEL 1 PROTOTYPE
========================================================= */

"use strict";


/* =========================================================
   GAME SETTINGS
========================================================= */

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const PLAYER_SPEED = 260;
const DASH_SPEED = 850;
const DASH_DURATION = 140;
const DASH_COOLDOWN = 900;


/* =========================================================
   GAME STATE
========================================================= */

const gameState = {

    level: 1,

    data: 0,

    totalData: 0,

    energy: 100,

    maxEnergy: 100,

    gameStarted: false,

    paused: false,

    levelComplete: false,

    startTime: 0,

    dashReady: true,

    hacking: false

};


/* =========================================================
   DOM REFERENCES
========================================================= */

let dataCount;
let energyCount;
let levelNumber;

let bootScreen;
let bootStatus;
let bootProgressBar;

let levelIntro;
let introTitle;
let introDescription;
let startLevelButton;

let pauseMenu;
let pauseButton;
let resumeButton;
let restartButton;

let levelComplete;
let completeData;
let completeTime;
let nextLevelButton;

let hackButton;
let hackMessage;

let systemNotification;
let notificationTitle;
let notificationText;


/* =========================================================
   PHASER OBJECTS
========================================================= */

let game;

let scene;

let player;
let playerSystem;

let cursors;
let wasd;

let dataBits;
let enemies;

let exitPortal;

let walls;

let playerGlow;

let playerDirection = {
    x: 1,
    y: 0
};


/* =========================================================
   BOOT SYSTEM
========================================================= */

function startBootSequence() {

    bootScreen = document.getElementById("bootScreen");
    bootStatus = document.getElementById("bootStatus");
    bootProgressBar = document.getElementById("bootProgressBar");

    const messages = [
        "INITIALIZING NEURAL INTERFACE...",
        "CONNECTING TO SYSTEM...",
        "LOADING DIGITAL GRID...",
        "CALIBRATING ENERGY CORE...",
        "LOADING PLAYER PROFILE...",
        "CHECKING FIREWALL...",
        "SYSTEM CONNECTION ESTABLISHED."
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {

        progress += Math.floor(Math.random() * 12) + 8;

        if (progress > 100) {
            progress = 100;
        }

        bootProgressBar.style.width = `${progress}%`;

        if (messageIndex < messages.length) {
            bootStatus.textContent = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                bootScreen.classList.add("hidden");

                showLevelIntro();

            }, 700);
        }

    }, 350);
}


/* =========================================================
   LEVEL INTRO
========================================================= */

function showLevelIntro() {

    levelIntro.classList.remove("hidden");

    introTitle.textContent = "THE COMPUTER WAKES UP";

    introDescription.textContent =
        "Your connection has been detected. " +
        "Collect the Data Bits and reach the exit portal.";

    levelNumber.textContent = String(gameState.level).padStart(2, "0");
}


/* =========================================================
   START LEVEL
========================================================= */

function startLevel() {

    levelIntro.classList.add("hidden");

    gameState.gameStarted = true;

    gameState.paused = false;

    gameState.levelComplete = false;

    gameState.startTime = Date.now();

    updateHUD();

    showNotification(
        "SYSTEM ONLINE",
        "Level 01 has started."
    );

    if (scene && scene.physics) {
        scene.physics.resume();
    }
}


/* =========================================================
   PHASER BOOT
========================================================= */

function createGame() {

    const config = {

        type: Phaser.AUTO,

        parent: "gameContainer",

        width: GAME_WIDTH,

        height: GAME_HEIGHT,

        backgroundColor: "#030812",

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

            mode: Phaser.Scale.RESIZE,

            autoCenter: Phaser.Scale.CENTER_BOTH

        },

        render: {

            antialias: true,

            pixelArt: false

        },

        scene: {

            preload: preload,

            create: create,

            update: update

        }

    };

    game = new Phaser.Game(config);
}


/* =========================================================
   PRELOAD
========================================================= */

function preload() {

    scene = this;

}


/* =========================================================
   CREATE
========================================================= */

function create() {

    scene = this;

    createBackground();

    createWorld();

    createPlayer();

    createDataBits();

    createEnemies();

    createExitPortal();

    createControls();

    createCollisions();

    createKeyboardInput();

    createParticles();

    setupCamera();

}


/* =========================================================
   BACKGROUND
========================================================= */

function createBackground() {

    const graphics = scene.add.graphics();

    graphics.fillStyle(0x030812, 1);

    graphics.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* GRID */

    graphics.lineStyle(
        1,
        0x0b2a45,
        0.35
    );

    const gridSize = 50;

    for (
        let x = 0;
        x <= GAME_WIDTH;
        x += gridSize
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
        y <= GAME_HEIGHT;
        y += gridSize
    ) {

        graphics.lineBetween(
            0,
            y,
            GAME_WIDTH,
            y
        );

    }


    /* LARGE TECH CIRCLES */

    graphics.lineStyle(
        2,
        0x0066aa,
        0.18
    );

    graphics.strokeCircle(
        640,
        360,
        300
    );

    graphics.strokeCircle(
        640,
        360,
        210
    );

    graphics.strokeCircle(
        640,
        360,
        120
    );


    /* CENTER CORE */

    graphics.lineStyle(
        2,
        0x00aaff,
        0.25
    );

    graphics.strokeRect(
        520,
        240,
        240,
        240
    );

}


/* =========================================================
   WORLD
========================================================= */

function createWorld() {

    walls = scene.physics.add.staticGroup();


    createWall(
        640,
        40,
        1200,
        40
    );

    createWall(
        640,
        680,
        1200,
        40
    );

    createWall(
        40,
        360,
        40,
        640
    );

    createWall(
        1240,
        360,
        40,
        640
    );


    /* INNER WALLS */

    createWall(
        400,
        260,
        250,
        20
    );

    createWall(
        880,
        260,
        250,
        20
    );

    createWall(
        400,
        460,
        250,
        20
    );

    createWall(
        880,
        460,
        250,
        20
    );


    createWall(
        270,
        360,
        20,
        180
    );

    createWall(
        1010,
        360,
        20,
        180
    );

}


function createWall(x, y, width, height) {

    const wall = walls.create(
        x,
        y,
        null
    );

    wall.setSize(
        width,
        height
    );

    wall.setDisplaySize(
        width,
        height
    );

    wall.refreshBody();


    const graphics = scene.add.graphics();

    graphics.fillStyle(
        0x07192b,
        1
    );

    graphics.fillRect(
        x - width / 2,
        y - height / 2,
        width,
        height
    );

    graphics.lineStyle(
        2,
        0x087dbe,
        0.7
    );

    graphics.strokeRect(
        x - width / 2,
        y - height / 2,
        width,
        height
    );

}


/* =========================================================
   PLAYER
========================================================= */

function createPlayer() {

    const neonPlayer =
        createNeonPlayer(
            scene,
            150,
            580
        );

    player =
        neonPlayer.sprite;

    playerSystem =
        neonPlayer;

}
/* =========================================================
   DATA BITS
========================================================= */

function createDataBits() {

    dataBits = scene.physics.add.group();


    const positions = [

        [220, 160],
        [350, 380],
        [520, 150],
        [640, 570],
        [760, 150],
        [930, 380],
        [1080, 170],
        [1080, 560]

    ];


    positions.forEach(
        ([x, y]) => {

            createDataBit(x, y);

        }
    );


    gameState.totalData =
        positions.length;

}


function createDataBit(x, y) {

    const bit = dataBits.create(
        x,
        y
    );

    bit.setSize(
        20,
        20
    );

    bit.setDepth(8);


    const canvas =
        document.createElement("canvas");

    canvas.width = 32;
    canvas.height = 32;

    const ctx =
        canvas.getContext("2d");


    /* DIAMOND */

    ctx.beginPath();

    ctx.moveTo(16, 3);
    ctx.lineTo(29, 16);
    ctx.lineTo(16, 29);
    ctx.lineTo(3, 16);
    ctx.closePath();

    ctx.fillStyle = "#00d9ff";

    ctx.fill();

    ctx.lineWidth = 2;

    ctx.strokeStyle = "#ffffff";

    ctx.stroke();


    scene.textures.addCanvas(
        `data-${x}-${y}`,
        canvas
    );

    bit.setTexture(
        `data-${x}-${y}`
    );

}


/* =========================================================
   ENEMIES
========================================================= */

function createEnemies() {

    enemies = scene.physics.add.group();


    createEnemy(
        650,
        180,
        120
    );

    createEnemy(
        800,
        550,
        100
    );

}


function createEnemy(x, y, range) {

    const enemy = enemies.create(
        x,
        y
    );

    enemy.setSize(
        30,
        30
    );

    enemy.setDepth(9);

    enemy.enemyData = {

        startX: x,

        startY: y,

        range: range,

        direction: 1,

        speed: 80

    };


    const canvas =
        document.createElement("canvas");

    canvas.width = 44;
    canvas.height = 44;

    const ctx =
        canvas.getContext("2d");


    ctx.beginPath();

    ctx.arc(
        22,
        22,
        16,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff1744";

    ctx.fill();

    ctx.lineWidth = 3;

    ctx.strokeStyle = "#ff7a91";

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        22,
        22,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();


    const textureKey =
        `enemy-${x}-${y}`;

    scene.textures.addCanvas(
        textureKey,
        canvas
    );

    enemy.setTexture(
        textureKey
    );

}


/* =========================================================
   EXIT PORTAL
========================================================= */

function createExitPortal() {

    exitPortal =
        scene.physics.add.staticSprite(
            1120,
            600
        );


    const canvas =
        document.createElement("canvas");

    canvas.width = 100;
    canvas.height = 100;

    const ctx =
        canvas.getContext("2d");


    ctx.beginPath();

    ctx.arc(
        50,
        50,
        35,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#00d9ff";

    ctx.lineWidth = 5;

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        50,
        50,
        23,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#0077ff";

    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        50,
        50,
        10,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    scene.textures.addCanvas(
        "exitPortal",
        canvas
    );


    exitPortal.setTexture(
        "exitPortal"
    );

    exitPortal.setSize(
        60,
        60
    );

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    if (!scene.add.particles) {
        return;
    }

}


/* =========================================================
   CAMERA
========================================================= */

function setupCamera() {

    scene.cameras.main.setBounds(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );

}


/* =========================================================
   CONTROLS
========================================================= */

function createControls() {

    cursors =
        scene.input.keyboard.createCursorKeys();

    wasd =
        scene.input.keyboard.addKeys({

            up: Phaser.Input.Keyboard.KeyCodes.W,

            down: Phaser.Input.Keyboard.KeyCodes.S,

            left: Phaser.Input.Keyboard.KeyCodes.A,

            right: Phaser.Input.Keyboard.KeyCodes.D,

            dash: Phaser.Input.Keyboard.KeyCodes.SPACE,

            hack: Phaser.Input.Keyboard.KeyCodes.E

        });

}


/* =========================================================
   COLLISIONS
========================================================= */

function createCollisions() {

    scene.physics.add.collider(
        player,
        walls
    );


    scene.physics.add.overlap(
        player,
        dataBits,
        collectData,
        null,
        scene
    );


    scene.physics.add.overlap(
        player,
        enemies,
        hitEnemy,
        null,
        scene
    );


    scene.physics.add.overlap(
        player,
        exitPortal,
        reachExit,
        null,
        scene
    );

}


/* =========================================================
   UPDATE
========================================================= */

function update() {

    if (!player) {
        return;
    }


    updatePlayer();

    updateEnemies();

    updatePlayerGlow();

    updatePortal();

    updateKeyboardActions();

}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer() {

    if (
        !playerSystem ||
        !gameState.gameStarted ||
        gameState.paused ||
        gameState.levelComplete
    ) {

        if (player) {
            player.setVelocity(0, 0);
        }

        return;
    }


    const input = {

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
            wasd.right.isDown,

        disabled: false

    };


    playerSystem.update(input);


    if (
        Phaser.Input.Keyboard.JustDown(
            wasd.dash
        )
    ) {

        playerSystem.dash();

    }

}
/* =========================================================
   DASH
========================================================= */

function performDash() {

    if (
        !gameState.dashReady ||
        gameState.energy < 20
    ) {

        return;

    }


    gameState.dashReady = false;

    gameState.energy -= 20;

    updateHUD();


    player.setVelocity(
        playerDirection.x * DASH_SPEED,
        playerDirection.y * DASH_SPEED
    );


    showNotification(
        "DASH ACTIVATED",
        "Energy -20"
    );


    scene.tweens.add({

        targets: player,

        scaleX: 1.4,

        scaleY: 1.4,

        duration: 70,

        yoyo: true

    });


    setTimeout(() => {

        gameState.dashReady = true;

    }, DASH_COOLDOWN);

}


/* =========================================================
   KEYBOARD ACTIONS
========================================================= */

function updateKeyboardActions() {

    if (
        !playerSystem ||
        !gameState.gameStarted ||
        gameState.paused
    ) {

        return;
    }


    if (
        Phaser.Input.Keyboard.JustDown(
            wasd.hack
        )
    ) {

        playerSystem.hack();

        hackMessage.textContent =
            "ACCESS GRANTED";

        showNotification(
            "HACK SUCCESS",
            "System access granted."
        );


        setTimeout(() => {

            if (hackMessage) {

                hackMessage.textContent =
                    "READY";

            }

        }, 1000);

    }

}

/* =========================================================
   HACK
========================================================= */

function performHack() {

    if (
        gameState.hacking ||
        !gameState.gameStarted ||
        gameState.paused
    ) {

        return;

    }


    gameState.hacking = true;

    hackMessage.textContent =
        "SCANNING SYSTEM...";


    hackButton.disabled = true;


    setTimeout(() => {

        hackMessage.textContent =
            "ACCESS GRANTED";

        showNotification(
            "HACK SUCCESS",
            "Nearby system unlocked."
        );


    }, 500);


    setTimeout(() => {

        hackMessage.textContent =
            "READY";

        gameState.hacking = false;

        hackButton.disabled = false;

    }, 1600);

}


/* =========================================================
   DATA COLLECTION
========================================================= */

function collectData(playerObject, bit) {

    bit.destroy();


    gameState.data++;

    gameState.energy =
        Math.min(
            gameState.maxEnergy,
            gameState.energy + 5
        );


    updateHUD();


    showNotification(
        "DATA ACQUIRED",
        `Data Bit ${gameState.data}/${gameState.totalData}`
    );


    createCollectEffect(
        bit.x,
        bit.y
    );

}


/* =========================================================
   COLLECT EFFECT
========================================================= */

function createCollectEffect(x, y) {

    const ring =
        scene.add.circle(
            x,
            y,
            10,
            0x00cfff,
            0.25
        );

    scene.tweens.add({

        targets: ring,

        radius: 45,

        alpha: 0,

        duration: 400,

        onComplete: () => {

            ring.destroy();

        }

    });

}


/* =========================================================
   ENEMY COLLISION
========================================================= */

function hitEnemy(playerObject, enemy) {

    if (
        gameState.levelComplete
    ) {

        return;

    }


    gameState.energy -= 15;


    if (gameState.energy < 0) {
        gameState.energy = 0;
    }


    updateHUD();


    showNotification(
        "SYSTEM DAMAGE",
        "Enemy contact detected."
    );


    player.setTint(
        0xff3355
    );


    setTimeout(() => {

        if (player) {

            player.clearTint();

        }

    }, 250);


    if (gameState.energy <= 0) {

        restartLevel();

    }

}


/* =========================================================
   ENEMY AI
========================================================= */

function updateEnemies() {

    if (!enemies) {
        return;
    }


    enemies.children.iterate(
        enemy => {

            if (!enemy) {
                return;
            }


            const data =
                enemy.enemyData;


            enemy.x +=
                data.direction *
                data.speed *
                (1 / 60);


            if (
                enemy.x >
                data.startX + data.range
            ) {

                data.direction = -1;

            }


            if (
                enemy.x <
                data.startX - data.range
            ) {

                data.direction = 1;

            }


            enemy.rotation += 0.02;

        }
    );

}


/* =========================================================
   PLAYER GLOW
========================================================= */

function updatePlayerGlow() {

    if (!playerGlow) {
        return;
    }


    playerGlow.x =
        player.x;

    playerGlow.y =
        player.y;


    playerGlow.scale =
        1 +
        Math.sin(
            Date.now() * 0.005
        ) * 0.08;

}


/* =========================================================
   PORTAL ANIMATION
========================================================= */

function updatePortal() {

    if (!exitPortal) {
        return;
    }


    exitPortal.rotation +=
        0.01;


    exitPortal.scale =
        1 +
        Math.sin(
            Date.now() * 0.004
        ) * 0.05;

}


/* =========================================================
   EXIT
========================================================= */

function reachExit() {

    if (
        gameState.levelComplete ||
        !gameState.gameStarted
    ) {

        return;

    }


    if (
        gameState.data <
        gameState.totalData
    ) {

        showNotification(
            "ACCESS DENIED",
            "Collect all Data Bits first."
        );

        return;

    }


    completeLevel();

}


/* =========================================================
   COMPLETE LEVEL
========================================================= */

function completeLevel() {

    gameState.levelComplete = true;

    gameState.gameStarted = false;


    player.setVelocity(
        0,
        0
    );


    const elapsed =
        Math.floor(
            (Date.now() - gameState.startTime) /
            1000
        );


    const minutes =
        Math.floor(elapsed / 60);

    const seconds =
        elapsed % 60;


    completeData.textContent =
        `${gameState.data}/${gameState.totalData}`;


    completeTime.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    levelComplete.classList.add(
        "visible"
    );


    showNotification(
        "LEVEL COMPLETE",
        "System access successful."
    );


    scene.physics.pause();

}


/* =========================================================
   RESTART LEVEL
========================================================= */

function restartLevel() {

    gameState.data = 0;

    gameState.energy =
        gameState.maxEnergy;

    gameState.gameStarted = true;

    gameState.levelComplete = false;

    gameState.paused = false;

    gameState.startTime = Date.now();


    levelComplete.classList.remove(
        "visible"
    );

    pauseMenu.classList.remove(
        "visible"
    );


    scene.scene.restart();

}


/* =========================================================
   NEXT LEVEL
========================================================= */

function nextLevel() {

    gameState.level++;

    if (gameState.level > 100) {

        gameState.level = 1;

    }


    levelComplete.classList.remove(
        "visible"
    );


    gameState.data = 0;

    gameState.energy =
        gameState.maxEnergy;

    gameState.gameStarted = false;

    gameState.levelComplete = false;


    levelNumber.textContent =
        String(gameState.level).padStart(
            2,
            "0"
        );


    scene.scene.restart();


    setTimeout(() => {

        showLevelIntro();

    }, 200);

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (
        !gameState.gameStarted ||
        gameState.levelComplete
    ) {

        return;

    }


    gameState.paused =
        !gameState.paused;


    if (gameState.paused) {

        pauseMenu.classList.add(
            "visible"
        );

        scene.physics.pause();

    } else {

        pauseMenu.classList.remove(
            "visible"
        );

        scene.physics.resume();

    }

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    dataCount.textContent =
        gameState.data;

    energyCount.textContent =
        gameState.energy;

    levelNumber.textContent =
        String(gameState.level).padStart(
            2,
            "0"
        );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer;

function showNotification(
    title,
    message
) {

    notificationTitle.textContent =
        title;

    notificationText.textContent =
        message;


    systemNotification.classList.add(
        "visible"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(() => {

            systemNotification.classList.remove(
                "visible"
            );

        }, 2500);

}


/* =========================================================
   DOM EVENTS
========================================================= */

function setupDOM() {

    dataCount =
        document.getElementById(
            "dataCount"
        );

    energyCount =
        document.getElementById(
            "energyCount"
        );

    levelNumber =
        document.getElementById(
            "levelNumber"
        );


    bootScreen =
        document.getElementById(
            "bootScreen"
        );

    bootStatus =
        document.getElementById(
            "bootStatus"
        );

    bootProgressBar =
        document.getElementById(
            "bootProgressBar"
        );


    levelIntro =
        document.getElementById(
            "levelIntro"
        );

    introTitle =
        document.getElementById(
            "introTitle"
        );

    introDescription =
        document.getElementById(
            "introDescription"
        );

    startLevelButton =
        document.getElementById(
            "startLevelButton"
        );


    pauseMenu =
        document.getElementById(
            "pauseMenu"
        );

    pauseButton =
        document.getElementById(
            "pauseButton"
        );

    resumeButton =
        document.getElementById(
            "resumeButton"
        );

    restartButton =
        document.getElementById(
            "restartButton"
        );


    levelComplete =
        document.getElementById(
            "levelComplete"
        );

    completeData =
        document.getElementById(
            "completeData"
        );

    completeTime =
        document.getElementById(
            "completeTime"
        );

    nextLevelButton =
        document.getElementById(
            "nextLevelButton"
        );


    hackButton =
        document.getElementById(
            "hackButton"
        );

    hackMessage =
        document.getElementById(
            "hackMessage"
        );


    systemNotification =
        document.getElementById(
            "systemNotification"
        );

    notificationTitle =
        document.getElementById(
            "notificationTitle"
        );

    notificationText =
        document.getElementById(
            "notificationText"
        );


    /* START */

    startLevelButton.addEventListener(
        "click",
        startLevel
    );


    /* PAUSE */

    pauseButton.addEventListener(
        "click",
        togglePause
    );


    resumeButton.addEventListener(
        "click",
        togglePause
    );


    restartButton.addEventListener(
        "click",
        restartLevel
    );


    /* NEXT LEVEL */

    nextLevelButton.addEventListener(
        "click",
        nextLevel
    );


    /* HACK */

    hackButton.addEventListener(
        "click",
        performHack
    );


    /* ESCAPE */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                togglePause();

            }

        }
    );


    /* MOBILE HACK */

    const mobileHack =
        document.getElementById(
            "mobileHack"
        );

    if (mobileHack) {

        mobileHack.addEventListener(
            "click",
            performHack
        );

    }


    /* MOBILE DASH */

    const mobileDash =
        document.getElementById(
            "mobileDash"
        );

    if (mobileDash) {

        mobileDash.addEventListener(
            "click",
            performDash
        );

    }

}


/* =========================================================
   MOBILE MOVEMENT
========================================================= */

function setupMobileMovement() {

    const buttons = {

        moveUp: {
            x: 0,
            y: -1
        },

        moveDown: {
            x: 0,
            y: 1
        },

        moveLeft: {
            x: -1,
            y: 0
        },

        moveRight: {
            x: 1,
            y: 0
        }

    };


    Object.entries(buttons)
        .forEach(
            ([id, direction]) => {

                const button =
                    document.getElementById(id);

                if (!button) {
                    return;
                }


                const start =
                    event => {

                        event.preventDefault();

                        if (
                            !gameState.gameStarted ||
                            gameState.paused
                        ) {

                            return;

                        }


                        player.setVelocity(
                            direction.x *
                            PLAYER_SPEED,

                            direction.y *
                            PLAYER_SPEED
                        );


                        playerDirection.x =
                            direction.x;

                        playerDirection.y =
                            direction.y;

                    };


                const stop =
                    event => {

                        event.preventDefault();

                        if (player) {

                            player.setVelocity(
                                0,
                                0
                            );

                        }

                    };


                button.addEventListener(
                    "touchstart",
                    start,
                    {
                        passive: false
                    }
                );

                button.addEventListener(
                    "touchend",
                    stop,
                    {
                        passive: false
                    }
                );

                button.addEventListener(
                    "mousedown",
                    start
                );

                button.addEventListener(
                    "mouseup",
                    stop
                );

            }
        );

}


/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        setupDOM();

        setupMobileMovement();

        updateHUD();

        startBootSequence();

        createGame();

    }
);
