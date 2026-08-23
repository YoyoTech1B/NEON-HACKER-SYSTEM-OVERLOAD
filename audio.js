"use strict";

/* =========================================================
   NEON HACKER
   AUDIO SYSTEM
========================================================= */


class AudioSystem {

    constructor() {

        this.enabled =
            true;

        this.volume =
            0.4;

        this.context =
            null;

        this.masterGain =
            null;

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize() {

        if (
            this.context
        ) {

            return;

        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (
            !AudioContext
        ) {

            this.enabled =
                false;

            return;

        }


        this.context =
            new AudioContext();


        this.masterGain =
            this.context.createGain();


        this.masterGain.gain.value =
            this.volume;


        this.masterGain.connect(

            this.context.destination

        );

    }


    /* =====================================================
       RESUME
    ===================================================== */

    resume() {

        if (
            this.context &&
            this.context.state ===
            "suspended"
        ) {

            this.context.resume();

        }

    }


    /* =====================================================
       PLAY TONE
    ===================================================== */

    playTone(
        frequency,
        duration,
        type = "sine",
        volume = 0.2
    ) {

        if (
            !this.enabled
        ) {

            return;

        }


        this.initialize();


        this.resume();


        const oscillator =
            this.context.createOscillator();


        const gain =
            this.context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.value =
            frequency;


        gain.gain.setValueAtTime(

            volume,

            this.context.currentTime

        );


        gain.gain.exponentialRampToValueAtTime(

            0.001,

            this.context.currentTime +
            duration

        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.masterGain
        );


        oscillator.start();


        oscillator.stop(

            this.context.currentTime +
            duration

        );

    }


    /* =====================================================
       COLLECT SOUND
    ===================================================== */

    collect() {

        this.playTone(
            700,
            0.08,
            "sine",
            0.2
        );


        setTimeout(

            () => {

                this.playTone(
                    1000,
                    0.12,
                    "sine",
                    0.2
                );

            },

            70

        );

    }


    /* =====================================================
       DASH SOUND
    ===================================================== */

    dash() {

        this.playTone(
            150,
            0.2,
            "sawtooth",
            0.15
        );

    }


    /* =====================================================
       DAMAGE SOUND
    ===================================================== */

    damage() {

        this.playTone(
            120,
            0.25,
            "square",
            0.2
        );

    }


    /* =====================================================
       COMPLETE SOUND
    ===================================================== */

    complete() {

        const notes = [

            523,
            659,
            784,
            1046

        ];


        notes.forEach(

            (
                note,
                index
            ) => {

                setTimeout(

                    () => {

                        this.playTone(

                            note,

                            0.2,

                            "sine",

                            0.2

                        );

                    },

                    index * 120

                );

            }

        );

    }


    /* =====================================================
       BOSS SOUND
    ===================================================== */

    boss() {

        this.playTone(
            60,
            0.6,
            "sawtooth",
            0.25
        );

    }


    /* =====================================================
       CLICK SOUND
    ===================================================== */

    click() {

        this.playTone(
            400,
            0.05,
            "square",
            0.08
        );

    }


    /* =====================================================
       TOGGLE
    ===================================================== */

    toggle() {

        this.enabled =
            !this.enabled;

        return this.enabled;

    }


    /* =====================================================
       SET VOLUME
    ===================================================== */

    setVolume(
        volume
    ) {

        this.volume =
            Math.max(

                0,

                Math.min(
                    1,
                    volume
                )

            );


        if (
            this.masterGain
        ) {

            this.masterGain.gain.value =
                this.volume;

        }

    }

}


/* =========================================================
   GLOBAL AUDIO SYSTEM
========================================================= */

const gameAudio =
    new AudioSystem();
