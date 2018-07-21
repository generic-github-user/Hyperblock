// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

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
                  "strength": 100 + Math.round(Math.random() * 25),
                  "location": {
                        "x": Math.round(Math.random() * 10),
                        "y": Math.round(Math.random() * 10)
                  }
            }
      );
}

function update() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      context.fillStyle = "rgba(255, 255, 255, 1)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Render blocks
      for (var i = 0; i < data.world.blocks.length; i ++) {
            block = data.world.blocks[i];

            context.fillStyle = "rgba(0, 0, 0, " + (block.strength / 100) + ")";
            context.fillRect(
                  block.location.x * data.settings.zoom,
                  block.location.y * data.settings.zoom,
                  data.settings.zoom,
                  data.settings.zoom
            );

            block.strength -= Math.random() * 0.01;

            if (block.strength <= 0) {
                  data.world.blocks.splice(i, 1);
            }
      }
}

window.setInterval(update, 10);
