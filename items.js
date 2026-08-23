"use strict";

/* =========================================================
   NEON HACKER
   ITEM SYSTEM
========================================================= */

class ItemManager {

    constructor(scene) {

        this.scene = scene;

        this.items = [];

    }


    /* =====================================================
       ITEM DATA
    ===================================================== */

    getItemData(type) {

        const data = {

            data: {
                color: 0x00e5ff,
                value: 1,
                size: 18
            },

            energy: {
                color: 0x00ff88,
                value: 25,
                size: 20
            },

            speed: {
                color: 0xffff00,
                value: 1,
                size: 20
            },

            shield: {
                color: 0xa855f7,
                value: 1,
                size: 22
            },

            key: {
                color: 0xffa500,
                value: 1,
                size: 20
            },

            crystal: {
                color: 0xff00ff,
                value: 5,
                size: 22
            }

        };


        return (
            data[type] ||
            data.data
        );

    }


    /* =====================================================
       CREATE ITEM
    ===================================================== */

    createItem(
        x,
        y,
        type = "data"
    ) {

        const data =
            this.getItemData(type);


        const item =
            this.scene.add.circle(

                x,
                y,

                data.size,

                data.color,

                1

            );


        this.scene.physics.add.existing(
            item
        );


        item.body.setAllowGravity(
            false
        );


        item.body.setImmovable(
            true
        );


        item.setDepth(
            10
        );


        item.setData(
            "itemType",
            type
        );


        item.setData(
            "value",
            data.value
        );


        item.setData(
            "baseY",
            y
        );


        /* GLOW */

        const glow =
            this.scene.add.circle(

                x,
                y,

                data.size + 10,

                data.color,

                0.12

            );


        glow.setDepth(
            9
        );


        item.setData(
            "glow",
            glow
        );


        /* FLOAT */

        this.scene.tweens.add({

            targets:
                item,

            y:
                y - 8,

            duration:
                700,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.easeInOut"

        });


        /* ROTATION */

        this.scene.tweens.add({

            targets:
                item,

            angle:
                360,

            duration:
                1800,

            repeat:
                -1

        });


        this.items.push(
            item
        );


        return item;

    }


    /* =====================================================
       COLLECT
    ===================================================== */

    collect(
        item,
        player
    ) {

        if (
            !item ||
            !item.active
        ) {

            return null;

        }


        const type =
            item.getData(
                "itemType"
            );


        const value =
            item.getData(
                "value"
            );


        switch (type) {

            case "data":

                return {
                    type: "data",
                    amount: value
                };


            case "energy":

                player.restoreEnergy(
                    value
                );

                return {
                    type: "energy",
                    amount: value
                };


            case "speed":

                player.speed += 30;

                return {
                    type: "speed",
                    amount: 1
                };


            case "shield":

                return {
                    type: "shield",
                    amount: 1
                };


            case "key":

                return {
                    type: "key",
                    amount: 1
                };


            case "crystal":

                return {
                    type: "crystal",
                    amount: value
                };


            default:

                return {
                    type: "data",
                    amount: 1
                };

        }

    }


    /* =====================================================
       DESTROY
    ===================================================== */

    destroyItem(item) {

        if (
            !item ||
            !item.active
        ) {

            return;

        }


        const glow =
            item.getData(
                "glow"
            );


        if (
            glow
        ) {

            glow.destroy();

        }


        const explosion =
            this.scene.add.circle(

                item.x,
                item.y,

                8,

                item.fillColor ||
                0xffffff,

                0.8

            );


        this.scene.tweens.add({

            targets:
                explosion,

            scale:
                4,

            alpha:
                0,

            duration:
                300,

            onComplete:
                () => {

                    explosion.destroy();

                }

        });


        item.destroy();


        this.items =
            this.items.filter(
                current =>
                    current !== item
            );

    }


    /* =====================================================
       CLEAR
    ===================================================== */

    clear() {

        this.items.forEach(
            item => {

                if (
                    item &&
                    item.active
                ) {

                    const glow =
                        item.getData(
                            "glow"
                        );

                    if (
                        glow
                    ) {

                        glow.destroy();

                    }

                    item.destroy();

                }

            }
        );


        this.items = [];

    }

}
