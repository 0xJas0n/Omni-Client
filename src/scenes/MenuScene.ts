import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('tiles', 'assets/tiles/base.png');
        this.load.spritesheet('shopkeeper', 'assets/sprites/characters/shopkeeper.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        this.load.tilemapTiledJSON('menu', 'assets/tiles/menu.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'menu' });
        const tileset = map.addTilesetImage('map', 'tiles');

        if (tileset) {
            map.createLayer('Ground', tileset);
            map.createLayer('Foliage', tileset);
            map.createLayer('Collision', tileset);
        }

        const tileSize = 16;
        const tileX = 9;
        const tileY = 10;

        const x = tileX * tileSize + tileSize / 2;
        const y = tileY * tileSize + tileSize / 2;

        const shopkeeper = this.add.sprite(x, y, 'shopkeeper');

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('shopkeeper', { start: 36, end: 37 }),
            frameRate: 0.5,
            repeat: -1
        });

        shopkeeper.play('idle');
    }

    update() {
    }
}