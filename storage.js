"use strict";

/* =========================================================
   NEON HACKER
   SAVE SYSTEM
========================================================= */

const STORAGE_KEY =
    "neonHackerSystemOverloadSave";


const DEFAULT_SAVE_DATA = {

    version: 1,

    level: 1,

    highestLevel: 1,

    totalData: 0,

    crystals: 0,

    deaths: 0,

    playTime: 0,

    soundEnabled: true,

    musicEnabled: true,

    masterVolume: 0.4,

    unlockedLevels: [
        1
    ],

    completedLevels: [],

    settings: {

        particles: true,

        screenShake: true,

        fullscreen: false

    }

};


/* =========================================================
   STORAGE CLASS
========================================================= */

class GameStorage {

    constructor() {

        this.data =
            this.load();

    }


    /* =====================================================
       DEFAULT COPY
    ===================================================== */

    cloneDefault() {

        return JSON.parse(

            JSON.stringify(
                DEFAULT_SAVE_DATA
            )

        );

    }


    /* =====================================================
       MERGE
    ===================================================== */

    mergeData(
        defaults,
        saved
    ) {

        const result = {

            ...defaults,

            ...saved

        };


        result.settings = {

            ...defaults.settings,

            ...(saved.settings || {})

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
       LOAD
    ===================================================== */

    load() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (
                !raw
            ) {

                return this.cloneDefault();

            }


            const saved =
                JSON.parse(
                    raw
                );


            return this.mergeData(

                this.cloneDefault(),

                saved

            );

        } catch (
            error
        ) {

            console.error(
                "Could not load save:",
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
                "Could not save:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       LEVEL
    ===================================================== */

    getLevel() {

        return this.data.level;

    }


    setLevel(
        level
    ) {

        level =
            Math.max(
                1,
                Math.min(
                    100,
                    Number(level)
                )
            );


        this.data.level =
            level;


        if (
            level >
            this.data.highestLevel
        ) {

            this.data.highestLevel =
                level;

        }


        this.unlockLevel(
            level
        );


        this.save();

    }


    /* =====================================================
       HIGHEST LEVEL
    ===================================================== */

    getHighestLevel() {

        return this.data.highestLevel;

    }


    /* =====================================================
       UNLOCK
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
       IS UNLOCKED
    ===================================================== */

    isLevelUnlocked(
        level
    ) {

        return this.data.unlockedLevels.includes(
            level
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


        this.unlockLevel(
            level + 1
        );


        if (
            stats.data
        ) {

            this.data.totalData +=
                Number(stats.data);

        }


        if (
            stats.crystals
        ) {

            this.data.crystals +=
                Number(stats.crystals);

        }


        this.save();

    }


    /* =====================================================
       DATA
    ===================================================== */

    getData() {

        return this.data.totalData;

    }


    addData(
        amount = 1
    ) {

        this.data.totalData +=
            Number(amount);


        this.save();

    }


    /* =====================================================
       CRYSTALS
    ===================================================== */

    getCrystals() {

        return this.data.crystals;

    }


    addCrystals(
        amount = 1
    ) {

        this.data.crystals +=
            Number(amount);


        this.save();

    }


    /* =====================================================
       DEATHS
    ===================================================== */

    getDeaths() {

        return this.data.deaths;

    }


    addDeath() {

        this.data.deaths++;

        this.save();

    }


    /* =====================================================
       PLAY TIME
    ===================================================== */

    getPlayTime() {

        return this.data.playTime;

    }


    addPlayTime(
        seconds
    ) {

        this.data.playTime +=
            Number(seconds);


        this.save();

    }


    /* =====================================================
       SOUND
    ===================================================== */

    isSoundEnabled() {

        return this.data.soundEnabled;

    }


    setSoundEnabled(
        enabled
    ) {

        this.data.soundEnabled =
            Boolean(enabled);


        this.save();

    }


    /* =====================================================
       MUSIC
    ===================================================== */

    isMusicEnabled() {

        return this.data.musicEnabled;

    }


    setMusicEnabled(
        enabled
    ) {

        this.data.musicEnabled =
            Boolean(enabled);


        this.save();

    }


    /* =====================================================
       VOLUME
    ===================================================== */

    getVolume() {

        return this.data.masterVolume;

    }


    setVolume(
        volume
    ) {

        this.data.masterVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        this.save();

    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    getSetting(
        name
    ) {

        return this.data.settings[
            name
        ];

    }


    setSetting(
        name,
        value
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                this.data.settings,
                name
            )
        ) {

            this.data.settings[
                name
            ] =
                value;

            this.save();

        }

    }


    /* =====================================================
       GET EVERYTHING
    ===================================================== */

    getAll() {

        return JSON.parse(

            JSON.stringify(
                this.data
            )

        );

    }


    /* =====================================================
       EXPORT
    ===================================================== */

    exportSave() {

        return JSON.stringify(

            this.data,

            null,

            2

        );

    }


    /* =====================================================
       IMPORT
    ===================================================== */

    importSave(
        saveString
    ) {

        try {

            const imported =
                JSON.parse(
                    saveString
                );


            this.data =
                this.mergeData(

                    this.cloneDefault(),

                    imported

                );


            this.save();


            return true;

        } catch (
            error
        ) {

            console.error(
                "Save import failed:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       RESET
    ===================================================== */

    reset() {

        this.data =
            this.cloneDefault();


        this.save();

    }

}


/* =========================================================
   GLOBAL SAVE SYSTEM
========================================================= */

const gameStorage =
    new GameStorage();
