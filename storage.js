"use strict";

/* =========================================================
   NEON HACKER: SYSTEM OVERLOAD
   SAVE / STORAGE SYSTEM
========================================================= */

const STORAGE_KEY =
    "neonHackerSystemOverloadSave";


/* =========================================================
   DEFAULT SAVE DATA
========================================================= */

const DEFAULT_SAVE_DATA = {

    version:
        1,

    level:
        1,

    highestLevel:
        1,

    totalData:
        0,

    crystals:
        0,

    deaths:
        0,

    playTime:
        0,

    soundEnabled:
        true,

    musicEnabled:
        true,

    masterVolume:
        0.4,

    unlockedLevels: [
        1
    ],

    completedLevels: [],

    settings: {

        particles:
            true,

        screenShake:
            true,

        fullscreen:
            false

    }

};


/* =========================================================
   STORAGE SYSTEM
========================================================= */

class GameStorage {

    constructor() {

        this.data =
            this.load();

    }


    /* =====================================================
       LOAD SAVE
    ===================================================== */

    load() {

        try {

            const savedData =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (
                !savedData
            ) {

                return this.cloneDefault();

            }


            const parsedData =
                JSON.parse(
                    savedData
                );


            return this.mergeData(
                this.cloneDefault(),
                parsedData
            );

        } catch (
            error
        ) {

            console.error(
                "SAVE LOAD ERROR:",
                error
            );


            return this.cloneDefault();

        }

    }


    /* =====================================================
       SAVE
    ===================================================== */

    save() {

        try {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(
                    this.data
                )

            );


            return true;

        } catch (
            error
        ) {

            console.error(
                "SAVE ERROR:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       CLONE DEFAULT
    ===================================================== */

    cloneDefault() {

        return JSON.parse(

            JSON.stringify(
                DEFAULT_SAVE_DATA
            )

        );

    }


    /* =====================================================
       MERGE DATA
    ===================================================== */

    mergeData(
        defaults,
        saved
    ) {

        const result =
            {

                ...defaults,

                ...saved

            };


        result.settings =
            {

                ...defaults.settings,

                ...(
                    saved.settings ||
                    {}
                )

            };


        if (
            !Array.isArray(
                result.unlockedLevels
            )
        ) {

            result.unlockedLevels =
                [1];

        }


        if (
            !Array.isArray(
                result.completedLevels
            )
        ) {

            result.completedLevels =
                [];

        }


        return result;

    }


    /* =====================================================
       CURRENT LEVEL
    ===================================================== */

    getLevel() {

        return this.data.level;

    }


    setLevel(
        level
    ) {

        this.data.level =
            level;


        this.save();

    }


    /* =====================================================
       HIGHEST LEVEL
    ===================================================== */

    getHighestLevel() {

        return this.data.highestLevel;

    }


    /* =====================================================
       UNLOCK LEVEL
    ===================================================== */

    unlockLevel(
        level
    ) {

        if (
            !this.data.unlockedLevels.includes(
                level
            )
        ) {

            this.data.unlockedLevels.push(
                level
            );

        }


        if (
            level >
            this.data.highestLevel
        ) {

            this.data.highestLevel =
                level;

        }


        this.save();

    }


    /* =====================================================
       CHECK IF LEVEL IS UNLOCKED
    ===================================================== */

    isLevelUnlocked(
        level
    ) {

        return (
            this.data.unlockedLevels.includes(
                level
            )
        );

    }


    /* =====================================================
       COMPLETE LEVEL
    ===================================================== */

    completeLevel(
        level,
        stats = {}
    ) {

        if (
            !this.data.completedLevels.includes(
                level
            )
        ) {

            this.data.completedLevels.push(
                level
            );

        }


        const nextLevel =
            level + 1;


        this.unlockLevel(
            nextLevel
        );


        if (
            stats.data
        ) {

            this.addData(
                stats.data
            );

        }


        if (
            stats.crystals
        ) {

            this.addCrystals(
                stats.crystals
            );

        }


        this.save();

    }


    /* =====================================================
       CHECK COMPLETION
    ===================================================== */

    isLevelComplete(
        level
    ) {

        return (
            this.data.completedLevels.includes(
                level
            )
        );

    }


    /* =====================================================
       DATA BITS
    ===================================================== */

    addData(
        amount = 1
    ) {

        this.data.totalData +=
            amount;


        this.save();

    }


    getData() {

        return this.data.totalData;

    }


    /* =====================================================
       CRYSTALS
    ===================================================== */

    addCrystals(
        amount = 1
    ) {

        this.data.crystals +=
            amount;


        this.save();

    }


    getCrystals() {

        return this.data.crystals;

    }


    /* =====================================================
       DEATHS
    ===================================================== */

    addDeath() {

        this.data.deaths++;


        this.save();

    }


    getDeaths() {

        return this.data.deaths;

    }


    /* =====================================================
       PLAY TIME
    ===================================================== */

    addPlayTime(
        seconds
    ) {

        this.data.playTime +=
            seconds;


        this.save();

    }


    getPlayTime() {

        return this.data.playTime;

    }


    /* =====================================================
       SOUND
    ===================================================== */

    setSoundEnabled(
        enabled
    ) {

        this.data.soundEnabled =
            enabled;


        this.save();

    }


    isSoundEnabled() {

        return this.data.soundEnabled;

    }


    /* =====================================================
       MUSIC
    ===================================================== */

    setMusicEnabled(
        enabled
    ) {

        this.data.musicEnabled =
            enabled;


        this.save();

    }


    isMusicEnabled() {

        return this.data.musicEnabled;

    }


    /* =====================================================
       VOLUME
    ===================================================== */

    setVolume(
        volume
    ) {

        this.data.masterVolume =
            Math.max(

                0,

                Math.min(
                    1,
                    volume
                )

            );


        this.save();

    }


    getVolume() {

        return this.data.masterVolume;

    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    setSetting(
        setting,
        value
    ) {

        if (
            !Object.prototype.hasOwnProperty.call(
                this.data.settings,
                setting
            )
        ) {

            console.warn(
                "Unknown setting:",
                setting
            );

            return;

        }


        this.data.settings[
            setting
        ] =
            value;


        this.save();

    }


    getSetting(
        setting
    ) {

        return this.data.settings[
            setting
        ];

    }


    /* =====================================================
       EXPORT SAVE
    ===================================================== */

    exportSave() {

        return JSON.stringify(

            this.data,

            null,

            2

        );

    }


    /* =====================================================
       IMPORT SAVE
    ===================================================== */

    importSave(
        saveString
    ) {

        try {

            const importedData =
                JSON.parse(
                    saveString
                );


            this.data =
                this.mergeData(

                    this.cloneDefault(),

                    importedData

                );


            this.save();


            return true;

        } catch (
            error
        ) {

            console.error(
                "IMPORT ERROR:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       RESET SAVE
    ===================================================== */

    reset() {

        this.data =
            this.cloneDefault();


        this.save();

    }


    /* =====================================================
       GET ALL SAVE DATA
    ===================================================== */

    getAll() {

        return JSON.parse(

            JSON.stringify(
                this.data
            )

        );

    }

}


/* =========================================================
   GLOBAL STORAGE INSTANCE
========================================================= */

const gameStorage =
    new GameStorage();
