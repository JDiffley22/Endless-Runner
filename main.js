let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// defines the area for the floor
function Floor(x, height) {
    this.x = x;
    this.width = 700;
    this.height = height;
}

// define world parameters for the canvas
let world = {
    height: 480,
    width: 640,
    gravity: 2,
    speed: 2,
    distanceTravelled: 0,
    maxSpeed: 15,
    tilesPassed: 0,
    highestFloor: 100,
    autoScroll: true,
    floorTiles: [
        new Floor(0, 140)
    ],

    stop: function() {
        this.autoScroll = false;
    },

    // move floor loop to move continuously left (x axis)
    moveFloor: function() {
        for (let tile of this.floorTiles) {
            tile.x -= this.speed;
        }
        this.distanceTravelled += this.speed;
    },

    // function to create varying heights of the tiles as moveFloor progresses
    createFutureTiles: function() {
        if (this.floorTiles.length >= 3) {
            return;
        }
        let previousTile = this.floorTiles[this.floorTiles.length - 1];
        let biggestJumpableHeight = previousTile.height + player.height * 3.5;
        if (biggestJumpableHeight > this.highestFloor) {
            biggestJumpableHeight = this.highestFloor;
        }
        let randomHeight = Math.floor(Math.random() * biggestJumpableHeight) + player.height;
        let leftValue = previousTile.x + previousTile.width;
        let next = new Floor(leftValue, randomHeight);
        this.floorTiles.push(next);
    },

    // function to remove tiles once they move past "x" by checking if they're less than or equal to the value of "x" in the Floor function (Conserve Browser Memory)
    removeTiles: function() {
        for (let index in this.floorTiles) {
            if (this.floorTiles[index].x <= -this.floorTiles[index].width) {
                this.floorTiles.splice(index, 1);
                this.tilesPassed++;
                if (this.tilesPassed % 3 === 0 && this.speed < this.maxSpeed) {
                    this.speed++;
                }
            }
        }
    },

    // function to continuously draw tiles as the game runs using a for loop
    draw: function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        for (let tile of this.floorTiles) {
            let y = this.height - tile.height;
            ctx.fillStyle = "purple";
            ctx.fillRect(tile.x, y, tile.width, tile.height);
        }
    },

    getDistanceToFloor: function(playerX) {
        for (let tile of this.floorTiles) {
            if (tile.x <= playerX && tile.x + tile.width >= playerX) {
                return tile.height;
            }
        }
        return -1;
    },

    // Define a tick method to handle world updates
    tick: function() {
        if (!this.autoScroll) {
            return;
        }
        this.moveFloor();
        this.removeTiles();
        this.createFutureTiles();
    }
};

// player functions
let player = {
    x: 160,
    y: 340,
    height: 20,
    width: 20,
    downwardForce: 0,
    jumpHeight: 0,
    isJumping: false,

    tick: function() {
        this.applyGravity();
    },

    draw: function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
    },

    keyPress: function(event) {
        if ((event.key === " " || event.key === "ArrowUp") && !this.isJumping) {
            let floorHeight = world.getDistanceToFloor(this.x);
            let onTheFloor = world.height - this.y === floorHeight;
            if (onTheFloor) {
                this.downwardForce = -25;
                this.isJumping = true;
            }
        }
    },

    // apply gravity to the player
    applyGravity: function() {
        let platformBelow = world.getDistanceToFloor(this.x);
        let rightHandSideDistance = world.getDistanceToFloor(this.x + this.width);
        this.currentDistanceAboveGround = world.height - this.y - platformBelow;
        if (this.currentDistanceAboveGround < 0 || rightHandSideDistance < 0) {
            world.stop();
        } else {
            this.y += this.downwardForce;
            this.downwardForce += world.gravity;

            let floorHeight = world.getDistanceToFloor(this.x);
            let topOfPlatform = world.height - floorHeight;
            if (this.y > topOfPlatform) {
                this.y = topOfPlatform;
                this.downwardForce = 0;
                this.isJumping = false;
                this.jumpHeight = 0;
            }

            if (this.downwardForce < 0) {
                this.jumpHeight += Math.abs(this.downwardForce);
                if (this.jumpHeight >= player.height * 6) {
                    this.downwardForce = world.gravity;
                    this.jumpHeight = 0;
                }
            }
        }
    }
};

// Call the draw function and set timer
window.addEventListener("keydown", function(event) { player.keyPress(event); }, false);
function tick() {
    player.tick();
    world.tick();
    world.draw();
    player.draw();
    if (world.floorTiles[world.floorTiles.length - 1].x + world.floorTiles[world.floorTiles.length - 1].width < world.width) {
        world.createFutureTiles();
    }
    world.timer = window.setTimeout(tick, 1000 / 60);
}
tick();
