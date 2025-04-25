import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, playerId) {
        super(scene, x, y, 'player');

        this.playerId = playerId;
        this.scene = scene;

        // Add player to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Movement properties
        this.moveSpeed = 200;
        this.isMoving = false;
        this.targetX = x;
        this.targetY = y;
        this.lastInputTime = 0;
        this.inputThrottleMs = 50; // Only send input every 50ms

        // Input keys
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update(time) {
        // Handle input and send to server if it's been long enough since last input
        const sendInput = time - this.lastInputTime > this.inputThrottleMs;

        let directionX = 0;
        let directionY = 0;

        // Check movement keys
        if (this.keys.up.isDown) {
            directionY = -1;
        } else if (this.keys.down.isDown) {
            directionY = 1;
        }

        if (this.keys.left.isDown) {
            directionX = -1;
        } else if (this.keys.right.isDown) {
            directionX = 1;
        }

        // If player is moving, send input to server
        if ((directionX !== 0 || directionY !== 0) && sendInput) {
            // Get normalized direction to handle diagonal movement properly
            if (directionX !== 0 && directionY !== 0) {
                const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
                directionX /= magnitude;
                directionY /= magnitude;
            }

            // Send movement input to server
            this.scene.socket.send(JSON.stringify({
                action: 'move',
                playerId: this.playerId,
                directionX: directionX,
                directionY: directionY,
                timestamp: time
            }));

            this.lastInputTime = time;
        }

        // Smooth movement to server-provided position if not yet there
        if (this.x !== this.targetX || this.y !== this.targetY) {
            // Simple linear interpolation for position
            this.x = Phaser.Math.Linear(this.x, this.targetX, 0.2);
            this.y = Phaser.Math.Linear(this.y, this.targetY, 0.2);

            // If close enough to target, snap to it
            if (Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY) < 0.5) {
                this.x = this.targetX;
                this.y = this.targetY;
            }
        }
    }

    // Update position based on server data
    setServerPosition(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
}
