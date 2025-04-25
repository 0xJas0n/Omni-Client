import Phaser from "phaser";
import React from "react";
import MenuScene from "../../scenes/MenuScene.ts";

const GameConst = () => {
    React.useEffect(() => {
        const baseWidth = 800;
        const baseHeight = 600;
        const zoomX = window.innerWidth / baseWidth;
        const zoomY = window.innerHeight / baseHeight;
        const zoom = Math.min(zoomX, zoomY);

        const config = {
            type: Phaser.AUTO,
            width: baseWidth,
            height: baseHeight,
            parent: 'phaser-container',
            scene: [MenuScene],
            scale: {
                mode: Phaser.Scale.FIT,
                zoom: zoom
            }
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-container" />;
};

export default GameConst;
