import Phaser from "phaser";
import Player from "../Player.ts";

export default class MenuScene extends Phaser.Scene {
    private player: Phaser.GameObjects.Sprite | undefined;

    constructor() {
        super();
    }

    preload() {
        this.load.image('tiles', 'assets/tiles/base.png');
        this.load.spritesheet('player', 'assets/sprites/characters/player.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        this.load.spritesheet('shopkeeper', 'assets/sprites/characters/shopkeeper.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        this.load.tilemapTiledJSON('menu', 'assets/tiles/menu.json');
    }

    create() {
        const map = this.make.tilemap({key: 'menu'});
        const tileset = map.addTilesetImage('map', 'tiles');

        if (tileset) {
            map.createLayer('Ground', tileset);
            map.createLayer('Foliage', tileset);
            map.createLayer('Collision', tileset);
        }

        const tileSize = 16;

        const xPos = (tileX: number) => {
            return tileX * tileSize + tileSize / 2
        };
        const yPos = (tileY: number) => {
            return tileY * tileSize + tileSize / 2
        };

        const shopkeeper = this.add.sprite(xPos(10), yPos(9), 'shopkeeper');
        this.player = new Player(this, 18, 12);

        this.physics.world.enable(this.player);

        this.anims.create({
            key: 'sit-idle',
            frames: this.anims.generateFrameNumbers('shopkeeper', {
                start: 36,
                end: 37
            }),
            frameRate: 0.5,
            repeat: -1
        });

        shopkeeper.play('sit-idle');
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }
}