// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var data = {
      "settings": {
            "zoom": 25
      },
      "world": {
            "blocks": []
      }
};

for (var i = 0; i < 100; i ++) {
      data.world.blocks.push(
            {
                  "location": {
                        "x": Math.round(Math.random() * 10),
                        "y": Math.round(Math.random() * 10)
                  }
            }
      );
}

for (var i = 0; i < data.world.blocks.length; i ++) {
      // Render blocks
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.fillRect(
            data.world.blocks[i].location.x * data.settings.zoom,
            data.world.blocks[i].location.y * data.settings.zoom,
            data.settings.zoom,
            data.settings.zoom
      );
}
