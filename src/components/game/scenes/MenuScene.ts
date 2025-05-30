import Player from '../entities/Player';
import Shopkeeper from '../entities/Shopkeeper';
import bgMusicAsset from '/assets/audio/music/menu.mp3';
import setTilePos from "../../../utils/setTilePos.ts";
import createStaticObjects from "../../../utils/createStaticObjects.ts";

export default class MenuScene extends Phaser.Scene {
    private player?: Player;
    private backgroundMusic?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private collisionGroup: Phaser.Physics.Arcade.StaticGroup | undefined;

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload(): void {
        this.load.image('tiles', 'assets/tiles/base.png');
        this.load.tilemapTiledJSON('menu', 'assets/tiles/menu.json');
        this.load.audio('bg_music', bgMusicAsset);
        this.load.spritesheet('player', 'assets/sprites/characters/player.png', {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.spritesheet('shopkeeper', 'assets/sprites/characters/shopkeeper.png', {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.spritesheet('tree_0', 'assets/sprites/environment/tree_0.png', {
            frameWidth: 16,
            frameHeight: 27,
        });
        this.load.spritesheet('tree_1', 'assets/sprites/environment/tree_1.png', {
            frameWidth: 22,
            frameHeight: 42,
        });
        this.load.spritesheet('tree_2', 'assets/sprites/environment/tree_2.png', {
            frameWidth: 22,
            frameHeight: 54,
        });
        this.load.spritesheet('tree_3', 'assets/sprites/environment/tree_3.png', {
            frameWidth: 30,
            frameHeight: 43,
        });
        this.load.spritesheet('tree_4', 'assets/sprites/environment/tree_4.png', {
            frameWidth: 42,
            frameHeight: 43,
        });
        this.load.spritesheet('tree_5', 'assets/sprites/environment/tree_5.png', {
            frameWidth: 42,
            frameHeight: 43,
        });
        this.load.spritesheet('sign_big_light_wood_front', 'assets/sprites/environment/sign_big_light_wood_front.png', {
            frameWidth: 54,
            frameHeight: 46,
        });
        this.load.spritesheet('lantern_light_true', 'assets/sprites/environment/lantern_light_true.png', {
            frameWidth: 12,
            frameHeight: 45,
        });
    }

    create(): void {
        const map = this.make.tilemap({ key: 'menu' });
        const tileset = map.addTilesetImage('map', 'tiles');

        if (!tileset) {
            console.warn('Tileset not found.');
            return;
        }

        // Create map layers
        const groundLayer = map.createLayer('Ground', tileset);
        map.createLayer('Foliage', tileset);

        // Set layer depths for rendering order
        groundLayer?.setDepth(0);

        createStaticObjects(this, map, 'Trees');
        createStaticObjects(this, map, 'Environment');

        // Create static collision objects from the 'Collision' object layer
        this.collisionGroup = this.physics.add.staticGroup();
        this.createCollisionObjects(map, 'Collision', this.collisionGroup);

        // Enable collision on the world bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Create entities
        new Shopkeeper(this, setTilePos(10), setTilePos(9));
        this.player = new Player(this, setTilePos(18), setTilePos(12));
        this.physics.add.collider(this.player, this.collisionGroup);

        // Camera setup
        if (this.player) {
            this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        }

        // Background music
        this.backgroundMusic = this.sound.add('bg_music', { loop: true, volume: 0.5 }); // Added volume for better control
        this.backgroundMusic.play();
    }

    update(): void {
        this.player?.update();
    }

    // Create static collision object group
    private createCollisionObjects(
        map: Phaser.Tilemaps.Tilemap,
        objectLayerName: string,
        group: Phaser.Physics.Arcade.StaticGroup
    ): void {
        const collisionLayer = map.getObjectLayer(objectLayerName);

        if (!collisionLayer) {
            console.warn(`Object layer "${objectLayerName}" not found.`);
            return;
        }

        collisionLayer.objects.forEach(object => {
            const x = object.x ?? 0;
            const y = object.y ?? 0;
            const width = object.width ?? 0;
            const height = object.height ?? 0;

            const rectangle = this.add.rectangle(x + width/2, y + height/2, width, height);
            this.physics.add.existing(rectangle, true);
            group.add(rectangle);
        });
    }
}