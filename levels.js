"use strict";

/* =========================================================
   NEON HACKER LEVEL DATABASE
========================================================= */

const LEVELS = {

    1: {

        name:
            "THE COMPUTER WAKES UP",

        player: {
            x: 120,
            y: 580
        },

        portal: {
            x: 1130,
            y: 130
        },

        walls: [

            {
                x: 640,
                y: 40,
                width: 1200,
                height: 40
            },

            {
                x: 640,
                y: 680,
                width: 1200,
                height: 40
            },

            {
                x: 40,
                y: 360,
                width: 40,
                height: 640
            },

            {
                x: 1240,
                y: 360,
                width: 40,
                height: 640
            },

            {
                x: 400,
                y: 260,
                width: 300,
                height: 25
            },

            {
                x: 850,
                y: 470,
                width: 300,
                height: 25
            }

        ],

        data: [

            [180, 150],
            [300, 500],
            [500, 150],
            [650, 360],
            [760, 550],
            [950, 180],
            [1080, 400],
            [1100, 560]

        ],

        enemies: [

            {
                x: 600,
                y: 180
            },

            {
                x: 900,
                y: 550
            }

        ]

    },


    2: {

        name:
            "FIREWALL BREACH",

        player: {
            x: 120,
            y: 120
        },

        portal: {
            x: 1130,
            y: 580
        },

        walls: [

            {
                x: 640,
                y: 40,
                width: 1200,
                height: 40
            },

            {
                x: 640,
                y: 680,
                width: 1200,
                height: 40
            },

            {
                x: 40,
                y: 360,
                width: 40,
                height: 640
            },

            {
                x: 1240,
                y: 360,
                width: 40,
                height: 640
            },

            {
                x: 400,
                y: 200,
                width: 500,
                height: 25
            },

            {
                x: 900,
                y: 500,
                width: 400,
                height: 25
            }

        ],

        data: [

            [200, 560],
            [350, 350],
            [500, 500],
            [650, 150],
            [800, 350],
            [950, 150],
            [1080, 300],
            [1120, 450]

        ],

        enemies: [

            {
                x: 500,
                y: 350
            },

            {
                x: 750,
                y: 500
            },

            {
                x: 1000,
                y: 300
            }

        ]

    }

};
