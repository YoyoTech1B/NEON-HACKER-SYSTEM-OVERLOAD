"use strict";

/* =========================================================
   NEON HACKER
   ITEM SYSTEM
========================================================= */


class NeonItem {

    constructor(
        scene,
        x,
        y,
        type = "data"
    ) {

        this.scene =
            scene;

        this.type =
            type;

        this.value =
            this.getValue();

        this.create();

    }


    /* =====================================================
       ITEM VALUES
    ===================================================== */

    getValue() {

        const values = {

            data: 1,

            energy: 25,

            speed: 1,

            shield: 1,

            key: 1,

            crystal: 5

        };


        return (
            values[
                this.type
            ] ||
            1
        );

    }


    /* =====================================================
       COLOR
    ===================================================== */

    getColor() {

        const colors = {

            data:
                0x00d9ff,

            energy:
                0x00ff88,

            speed:
                0xffff00,

            shield:
                0xa855f7,

            key:
                0xffa500,

            crystal:
                0xff00ff

        };


        return (
            colors[
                this.type
            ] ||
            0xffffff
        );

    }


    /* =====================================================
       CREATE
    ===================================================== */

    create() {

        const color =
            this.getColor();


        this.sprite =
            this.scene.add.rectangle(

                this.x,

                this.y,

                20,

                20,

                color

            );


        this.sprite.x =
            arguments[0] ?
            undefined :
            this.sprite.x;

    }


}


/* =========================================================
   ITEM MANAGER
========================================================= */

class ItemManager {

    constructor(
        scene
    ) {

        this.scene =
            scene;

        this.group =
            scene.physics.add.group();

        this.items =
            [];

    }


    createItem(
        x,
        y,
        type = "data"
    ) {

        const colors = {

            data:
                0x00d9ff,

            energy:
                0x00ff88,

            speed:
                0xffff00,

            shield:
                0xa855f7,

            key:
                0xffa500,

            crystal:
                0xff00ff

        };


        const values = {

            data: 1,

            energy: 25,

            speed: 1,

            shield: 1,

            key: 1,

            crystal: 5

        };


        const item =
            this.scene.add.rectangle(

                x,

                y,

                20,

                20,

                colors[type] ||
                0xffffff

            );


        this.scene.physics.add.existing(
            item
        );


        item.body.setAllowGravity(
            false
        );


        item.setData(
            "itemType",
            type
        );


        item.setData(
            "value",
            values[type] ||
            1
        );


        this.group.add(
            item
        );


        this.items.push(
            item
        );


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
                -1

        });


        this.scene.tweens.add({

            targets:
                item,

            angle:
                360,

            duration:
                2500,

            repeat:
                -1

        });


        return item;

    }


    /* =====================================================
       COLLECT
    ===================================================== */

    collect(
        item,
        player
    ) {

        const type =
            item.getData(
                "itemType"
            );


        const value =
            item.getData(
                "value"
            );


        switch (
            type
        ) {

            case "data":

                return {

                    type:
                        "data",

                    amount:
                        value

                };


            case "energy":

                player.restoreEnergy(
                    value
                );


                return {

                    type:
                        "energy",

                    amount:
                        value

                };


            case "speed":

                player.speed +=
                    50;


                return {

                    type:
                        "speed",

                    amount:
                        1

                };


            case "shield":

                return {

                    type:
                        "shield",

                    amount:
                        1

                };


            case "key":

                return {

                    type:
                        "key",

                    amount:
                        1

                };


            case "crystal":

                return {

                    type:
                        "crystal",

                    amount:
                        value

                };

        }

    }


    /* =====================================================
       DESTROY
    ===================================================== */

    destroyItem(
        item
    ) {

        const flash =
            this.scene.add.circle(

                item.x,

                item.y,

                10,

                item.fillColor,

                0.8

            );


        this.scene.tweens.add({

            targets:
                flash,

            scale:
                4,

            alpha:
                0,

            duration:
                300,

            onComplete:
                () => {

                    flash.destroy();

                }

        });


        item.destroy();


        this.items =
            this.items.filter(

                currentItem =>
                    currentItem !== item

            );

    }


    /* =====================================================
       CLEAR
    ===================================================== */

    clear() {

        this.items.forEach(

            item => {

                item.destroy();

            }

        );


        this.items = [];

    }

}
