import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Player from "../entities/Player.ts";
import Shopkeeper from "../entities/Shopkeeper.ts";

export default class MenuScene extends Phaser.Scene {
    private player: Player | undefined;

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
        // Set up the tilemap
        const map = this.make.tilemap({key: 'menu'});
        const tileset = map.addTilesetImage('map', 'tiles');
        let backgroundLayer: TilemapLayer | null = null;
        let collisionLayer: TilemapLayer | null = null;

        if (tileset) {
            backgroundLayer = map.createLayer('Ground', tileset);
            collisionLayer = map.createLayer('Collision', tileset);
            map.createLayer('Foliage', tileset);
        }

        if (collisionLayer && backgroundLayer) {
            collisionLayer.setCollisionByProperty({collides: true});
            backgroundLayer.setDepth(0);
            collisionLayer.setDepth(2);
        }

        // Helper functions for positioning
        const tileSize = 16;
        const xPos = (tileX: number) => tileX * tileSize + tileSize / 2;
        const yPos = (tileY: number) => tileY * tileSize + tileSize / 2;

        new Shopkeeper(this, xPos(10), yPos(9));

        // Create and set up player
        this.player = new Player(this, 18, 12);
        this.player.setDepth(1);
        this.physics.world.enable(this.player);
        if (collisionLayer) {
            this.physics.add.collider(this.player, collisionLayer);
        }
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }
}