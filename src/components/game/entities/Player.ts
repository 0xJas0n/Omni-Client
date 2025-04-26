import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;
    private movementSpeed: number = 100;
    private keys: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    };
    private cursorPosition: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');

        // Add this sprite to the scene and physics world
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setDepth(1);
        this.body = this.body as Phaser.Physics.Arcade.Body;
        this.body.setSize(10, 14);
        this.body.setOffset(6, 8);
        this.body.collideWorldBounds = true;

        // Setup input
        if (!scene.input.keyboard) {
            throw new Error("Keyboard input is not available on the scene.");
        }
        this.keys = {
            w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Initialize cursor position tracking
        this.cursorPosition = new Phaser.Math.Vector2(0, 0);

        // Track cursor position
        scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.cursorPosition.x = pointer.x;
            this.cursorPosition.y = pointer.y;
        });

        // Create animations
        this.createAnimations();

        // Start with idle animation
        this.play('idle');
    }

    update(): boolean {
        // Reset velocity
        this.body?.velocity.set(0, 0);

        let isMoving = false;

        // Handle movement based on WASD keys
        if (this.keys.w.isDown) {
            this.body.velocity.y = -this.movementSpeed;
            this.play('walk-up', true);
            isMoving = true;
        } else if (this.keys.s.isDown) {
            this.body.velocity.y = this.movementSpeed;
            this.play('walk-down', true);
            isMoving = true;
        }

        if (this.keys.a.isDown) {
            this.body.velocity.x = -this.movementSpeed;
            // Only change animation if not already moving vertically
            if (!this.keys.w.isDown && !this.keys.s.isDown) {
                this.play('walk-left', true);
            }
            isMoving = true;
        } else if (this.keys.d.isDown) {
            this.body.velocity.x = this.movementSpeed;
            // Only change animation if not already moving vertically
            if (!this.keys.w.isDown && !this.keys.s.isDown) {
                this.play('walk-right', true);
            }
            isMoving = true;
        }

        // Normalize diagonal movement
        if (isMoving && Math.abs(this.body.velocity.x) > 0 && Math.abs(this.body.velocity.y) > 0) {
            this.body.velocity.normalize().scale(this.movementSpeed);
        } else if (!isMoving) {
            this.play('idle', true);
        }

        this.updateSpriteDirection();

        return isMoving;
    }

    getMovementSpeed(): number {
        return this.movementSpeed;
    }

    setMovementSpeed(speed: number): void {
        this.movementSpeed = speed;
    }

    private createAnimations(): void {
        const anims = this.scene.anims;

        if (!anims.exists('idle')) {
            // Idle animation
            anims.create({
                key: 'idle',
                frames: anims.generateFrameNumbers('player', {
                    start: 0,
                    end: 7
                }),
                frameRate: 8,
                repeat: -1
            });

            // Walking animations
            anims.create({
                key: 'walk-down',
                frames: anims.generateFrameNumbers('player', {
                    start: 9,
                    end: 12
                }),
                frameRate: 8,
                repeat: -1
            });

            anims.create({
                key: 'walk-left',
                frames: anims.generateFrameNumbers('player', {
                    start: 9,
                    end: 12
                }),
                frameRate: 8,
                repeat: -1
            });

            anims.create({
                key: 'walk-right',
                frames: anims.generateFrameNumbers('player', {
                    start: 9,
                    end: 12
                }),
                frameRate: 8,
                repeat: -1
            });

            anims.create({
                key: 'walk-up',
                frames: anims.generateFrameNumbers('player', {
                    start: 9,
                    end: 12
                }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    // Update sprite direction based on cursor position
    private updateSpriteDirection() {
        // Get the camera-adjusted player position
        const camera = this.scene.cameras.main;
        const playerScreenX = this.x - camera.scrollX;

        if (this.cursorPosition.x > playerScreenX) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
    }
}