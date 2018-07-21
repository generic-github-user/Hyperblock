// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

var data = {
      "settings": {
            "zoom": 25
      },
      "world": {
            "player": {
                  "health": 100,
                  "location": {
                        "x": 0,
                        "y": 0
                  }
            },
            "blocks": []
      }
};

for (var i = 0; i < 100; i ++) {
      data.world.blocks.push(
            {
                  "strength": 10000 + Math.round(Math.random() * 2500),
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

      for (var i = 0; i < data.world.blocks.length; i ++) {
            // Render player
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.beginPath();
            context.moveTo(
                  data.world.player.location.x,
                  data.world.player.location.y - 25
            );
            context.lineTo(
                  data.world.player.location.x + 25,
                  data.world.player.location.y
            );
            context.lineTo(
                  data.world.player.location.x,
                  data.world.player.location.y + 25
            );
            context.lineTo(
                  data.world.player.location.x - 25,
                  data.world.player.location.y
            );
            context.fill();

            // Render blocks
            block = data.world.blocks[i];

            context.fillStyle = "rgba(0, 0, 0, " + (block.strength / 10000) + ")";
            context.fillRect(
                  block.location.x * data.settings.zoom,
                  block.location.y * data.settings.zoom,
                  data.settings.zoom,
                  data.settings.zoom
            );

            block.strength -= Math.random();

            if (block.strength <= 0) {
                  data.world.blocks.splice(i, 1);
            }
      }
}

window.setInterval(update, 10);
