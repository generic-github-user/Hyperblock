// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var data = {
      "world": {
            "blocks": []
      }
};

for (var i = 0; i < 100; i ++) {
      data.world.blocks.push(
            {
                  "location": {
                        "x": Math.random() * 1000,
                        "y": Math.random() * 1000
                  }
            }
      );
}

for (var i = 0; i < data.world.blocks.length; i ++) {
      // Render blocks
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.fillRect(
            data.world.blocks[i].location.x,
            data.world.blocks[i].location.y,
            10,
            10
      );
}
