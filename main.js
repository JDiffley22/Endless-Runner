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
    gravity: 10,
    speed: 2,
    distanceTravelled: 0,
    floorTiles: [
        new Floor(0, 140)
    ],

    // move floor
    moveFloor: function() {
        for (let tile of this.floorTiles) {
            tile.x -= this.speed;
            this.distanceTravelled += this.speed;
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
    }
};

// Call the draw function and set time
function tick() {
    world.draw();
    world.moveFloor();
    window.setTimeout(tick, 1000 / 60);
}
tick();
