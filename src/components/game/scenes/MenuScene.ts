import Player from '../entities/Player';
import Shopkeeper from '../entities/Shopkeeper';
import bgMusicAsset from '/assets/audio/music/menu.mp3';
import setTilePos from "../../../utils/setTilePos.ts";

export default class MenuScene extends Phaser.Scene {
    private player?: Player;
    private backgroundMusic?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor() {
        super({ key: 'MenuScene' }); // Explicitly set the scene key
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
        this.load.spritesheet('tree_1', 'assets/sprites/environment/tree_1.png', {
            frameWidth: 22,
            frameHeight: 42,
        });
    }

    create(): void {
        const map = this.make.tilemap({ key: 'menu' });
        const tileset = map.addTilesetImage('map', 'tiles');

        // Create map layers
        const groundLayer = map.createLayer('Ground', tileset);
        const collisionLayer = map.createLayer('Collision', tileset);
        const treeTrunkLayer = map.createLayer('TreeTrunk', tileset);
        const treeTopLayer = map.createLayer('TreeTop', tileset);
        map.createLayer('Foliage', tileset);

        // Set layer depths for rendering order
        groundLayer?.setDepth(0);
        treeTrunkLayer?.setDepth(1); // Ensure tree trunks are above ground
        collisionLayer?.setDepth(2);
        treeTopLayer?.setDepth(3); // Ensure tree tops are above other elements

        this.createStaticObjects(map, 'Trees', (gameObject: Phaser.GameObjects.GameObject) => {
            const sprite = gameObject as Phaser.GameObjects.Sprite;
            sprite.setOrigin(0.5, 1);
            sprite.setDepth(sprite.y - 10);
        });

        // Enable collision on the collision layer
        collisionLayer?.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Create entities
        new Shopkeeper(this, setTilePos(10), setTilePos(9));
        this.player = new Player(this, setTilePos(18), setTilePos(12));

        // Add collider between player and collision layer
        if (this.player && collisionLayer) {
            this.physics.add.collider(this.player, collisionLayer);
        }

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

    private createStaticObjects(
        map: Phaser.Tilemaps.Tilemap,
        objectLayerName: string,
        creationCallback: (gameObject: Phaser.GameObjects.GameObject) => void
    ): void {
        const objectLayer = map.getObjectLayer(objectLayerName);
        if (!objectLayer) {
            console.warn(`Object layer "${objectLayerName}" not found.`);
            return;
        }

        objectLayer.objects.forEach((objData) => {
            if (objData.type) {
                let gameObject: Phaser.GameObjects.GameObject;
                const x = objData.x ?? 0;
                const y = objData.y ?? 0;

                switch (objData.type) {
                    case 'tree': {
                        const treeType = objData.properties?.find((p: { name: string }) => p.name === 'treeType')?.value || 'tree_1';
                        gameObject = this.add.sprite(x + (objData.width ?? 0) / 2, y + (objData.height ?? 0), treeType);
                        break;
                    }
                    default:
                        console.warn(`Unsupported object type: "${objData.type}"`);
                        return;
                }

                creationCallback(gameObject);
            }
        });
    }
}