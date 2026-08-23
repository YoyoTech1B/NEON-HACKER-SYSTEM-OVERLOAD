"use strict";

/* =========================================================
   NEON HACKER
   AUDIO SYSTEM
========================================================= */

class AudioSystem {

    constructor() {

        this.enabled = true;

        this.volume = 0.4;

        this.context = null;

        this.masterGain = null;

        this.ready = false;

    }


    /* =====================================================
       INITIALIZE AUDIO
       MUST BE CALLED AFTER A USER CLICK
    ===================================================== */

    initialize() {

        if (
            this.context
        ) {

            return true;

        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (
            !AudioContext
        ) {

            console.warn(
                "Web Audio is not supported."
            );


            this.enabled = false;

            return false;

        }


        try {

            this.context =
                new AudioContext();


            this.masterGain =
                this.context.createGain();


            this.masterGain.gain.value =
                this.volume;


            this.masterGain.connect(
                this.context.destination
            );


            this.ready = true;


            return true;

        } catch (
            error
        ) {

            console.error(
                "Audio initialization failed:",
                error
            );


            this.enabled = false;

            return false;

        }

    }


    /* =====================================================
       START AUDIO
       CALL THIS FROM THE START BUTTON
    ===================================================== */

    async start() {

        if (
            !this.enabled
        ) {

            return false;

        }


        const initialized =
            this.initialize();


        if (
            !initialized ||
            !this.context
        ) {

            return false;

        }


        try {

            if (
                this.context.state ===
                "suspended"
            ) {

                await this.context.resume();

            }


            console.log(
                "AUDIO SYSTEM ONLINE"
            );


            return true;

        } catch (
            error
        ) {

            console.warn(
                "Audio could not start:",
                error
            );


            return false;

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
            !this.enabled ||
            !this.ready ||
            !this.context ||
            !this.masterGain
        ) {

            return;

        }


        if (
            this.context.state !==
            "running"
        ) {

            return;

        }


        try {

            const oscillator =
                this.context.createOscillator();


            const gain =
                this.context.createGain();


            oscillator.type =
                type;


            oscillator.frequency.setValueAtTime(

                frequency,

                this.context.currentTime

            );


            gain.gain.setValueAtTime(

                Math.max(
                    0.0001,
                    volume
                ),

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


            oscillator.start(
                this.context.currentTime
            );


            oscillator.stop(

                this.context.currentTime +
                duration

            );

        } catch (
            error
        ) {

            console.warn(
                "Could not play audio:",
                error
            );

        }

    }


    /* =====================================================
       COLLECT
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
       DASH
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
       DAMAGE
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
       LEVEL COMPLETE
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
       BOSS
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
       CLICK
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
                    Number(volume)
                )

            );


        if (
            this.masterGain
        ) {

            this.masterGain.gain.value =
                this.volume;

        }

    }


    /* =====================================================
       STOP AUDIO
    ===================================================== */

    async stop() {

        if (
            !this.context
        ) {

            return;

        }


        try {

            await this.context.suspend();

        } catch (
            error
        ) {

            console.warn(
                "Could not suspend audio:",
                error
            );

        }

    }

}


/* =========================================================
   GLOBAL AUDIO SYSTEM
========================================================= */

const gameAudio =
    new AudioSystem();
