import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Player from "../entities/Player.ts";
import Shopkeeper from "../entities/Shopkeeper.ts";
import bg_music from "/assets/audio/music/menu.mp3";
import setTilePos from "../../../utils/setTilePos.ts";

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
        let treeTrunkLayer: TilemapLayer | null = null;
        let treeToplayer: TilemapLayer | null = null;

        if (tileset) {
            backgroundLayer = map.createLayer('Ground', tileset);
            collisionLayer = map.createLayer('Collision', tileset);
            treeTrunkLayer = map.createLayer('TreeTrunk', tileset);
            treeToplayer = map.createLayer('TreeTop', tileset);
            map.createLayer('Foliage', tileset);
        }

        backgroundLayer?.setDepth(0);
        treeTrunkLayer?.setDepth(0)
        collisionLayer?.setDepth(2);
        treeToplayer?.setDepth(2);

        treeTrunkLayer?.setCollisionByProperty({collides: true});

        // Display collision boxes for debugging
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        //     treeToplayer?.renderDebug(debugGraphics, {
        //             tileColor: null,
        //             collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //             faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        //         })

        // Set the physics and camera world bounds
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        new Shopkeeper(this, setTilePos(10), setTilePos(9));
        this.player = new Player(this, setTilePos(18), setTilePos(12));

        if (treeTrunkLayer) {
            this.physics.add.collider(this.player, treeTrunkLayer);
        }

        if (this.player) {
            this.cameras.main.startFollow(this.player, true);
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