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
    floorTiles: [
        new Floor(0, 140)
    ],

// function to continuously draw tiles as the game runs using a for loop
draw: function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.width, this.height);
    for (let tile of this.floorTiles) {
        let y = this.height - tile.height;
        ctx.fillStyle = "blue";
        ctx.fillRect(tile.x, y, tile.width, tile.height);
    }
}
};

// Call the draw function
world.draw();
