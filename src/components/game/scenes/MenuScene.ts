import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Player from "../entities/Player.ts";
import Shopkeeper from "../entities/Shopkeeper.ts";
import bg_music from "/assets/audio/music/menu.mp3";

export default class MenuScene extends Phaser.Scene {
    private player: Player | undefined;
    private bgMusic: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound | undefined;

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
        this.load.audio('bg_music', bg_music);
    }

    create() {
        const map = this.make.tilemap({key: 'menu'});
        const tileset = map.addTilesetImage('map', 'tiles');
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;
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

        // Display collision boxes for debugging
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        //         collisionLayer.renderDebug(debugGraphics, {
        //             tileColor: null,
        //             collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //             faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        //         })

        // Set the physics world bounds
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        // Set the camera bounds to match the tilemap dimensions
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        // Helper functions for positioning
        const tileSize = 16;
        const xPos = (tileX: number) => tileX * tileSize + tileSize / 2;
        const yPos = (tileY: number) => tileY * tileSize + tileSize / 2;

        new Shopkeeper(this, xPos(10), yPos(9));

        // Create and set up player
        this.player = new Player(this, xPos(18), yPos(12));
        this.physics.world.enable(this.player);
        if (collisionLayer) {
            this.physics.add.collider(this.player, collisionLayer);
        }

        if (this.player) {
            this.cameras.main.startFollow(this.player, true);
            // The parameters control the smoothness of camera movement (values between 0 and 1)
            this.cameras.main.setLerp(0.1, 0.1);
        }

        this.bgMusic = this.sound.add('bg_music');
        this.bgMusic.loop = true;
        this.bgMusic.play();
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }
}