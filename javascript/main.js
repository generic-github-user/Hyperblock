// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

var data = {
      "settings": {
            "zoom": 25,
            "offset": {
                  "x": 0,
                  "y": 0
            },
            "follow": true
      },
      "input": {
            "keyboard": {
                  "up": false,
                  "down": false,
                  "left": false,
                  "right": false
            }
      },
      "world": {
            "player": {
                  "health": 100,
                  "speed": 1,
                  "velocity": {
                        "x": 0,
                        "y": 0
                  },
                  "location": {
                        "x": 0,
                        "y": 0
                  }
            },
            "blocks": []
      }
};

function random(min, max) {
      return (Math.random() * (max - min)) + min;
}

document.onkeydown = function (event) {
      if (event.key == "w" || event.key == "ArrowUp") {
            data.input.keyboard.up = true;
      }
      else if (event.key == "s" || event.key == "ArrowDown") {
            data.input.keyboard.down = true;
      }
      else if (event.key == "a" || event.key == "ArrowLeft") {
            data.input.keyboard.left = true;
      }
      else if (event.key == "d" || event.key == "ArrowRight") {
            data.input.keyboard.right = true;
      }
};

document.onkeyup = function (event) {
      if (event.key == "w" || event.key == "ArrowUp") {
            data.input.keyboard.up = false;
      }
      else if (event.key == "s" || event.key == "ArrowDown") {
            data.input.keyboard.down = false;
      }
      else if (event.key == "a" || event.key == "ArrowLeft") {
            data.input.keyboard.left = false;
      }
      else if (event.key == "d" || event.key == "ArrowRight") {
            data.input.keyboard.right = false;
      }
};

for (var i = 0; i < 1000; i ++) {
      data.world.blocks.push(
            {
                  "strength": 10000 + (Math.random() * 2500),
                  "location": {
                        "x": Math.round(Math.random() * 50),
                        "y": Math.round(Math.random() * 50)
                  }
            }
      );
}

function update() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      context.fillStyle = "rgba(255, 255, 255, 1)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (data.settings.follow) {
            data.settings.offset.x = -(canvas.width / 2) + data.world.player.location.x;
            data.settings.offset.y = -(canvas.height / 2) + data.world.player.location.y;
      }

      for (var i = 0; i < data.world.blocks.length; i ++) {
            block = data.world.blocks[i];

            block.strength -= Math.random();
            if (block.strength <= 0) {
                  data.world.blocks.splice(i, 1);
            }
      }

      // Render blocks
      data.world.blocks.forEach(
            (block) => {
                  context.fillStyle = "rgba(0, 0, 0, " + (block.strength / 10000) + ")";
                  context.fillRect(
                        (block.location.x * data.settings.zoom) - data.settings.offset.x,
                        (block.location.y * data.settings.zoom) - data.settings.offset.y,
                        data.settings.zoom,
                        data.settings.zoom
                  );
            }
      );

      if (data.input.keyboard.up) {
            data.world.player.velocity.y -= data.world.player.speed;
      }
      if (data.input.keyboard.down) {
            data.world.player.velocity.y += data.world.player.speed;
      }
      if (data.input.keyboard.left) {
            data.world.player.velocity.x -= data.world.player.speed;
      }
      if (data.input.keyboard.right) {
            data.world.player.velocity.x += data.world.player.speed;
      }

      // if (data.world.player.velocity.x > 0) {
      //       data.world.player.velocity.x -= 0.001;
      // }
      // else if (data.world.player.velocity.x < 0) {
      //       data.world.player.velocity.x = 0;
      // }
      // if (data.world.player.velocity.y > 0) {
      //       data.world.player.velocity.y -= 0.001;
      // }
      // else if (data.world.player.velocity.y < 0) {
      //       data.world.player.velocity.y = 0;
      // }

      data.world.player.velocity.x *= random(0.98, 1);
      data.world.player.velocity.y *= random(0.98, 1);

      data.world.player.location.x += data.world.player.velocity.x * 0.025;
      data.world.player.location.y += data.world.player.velocity.y * 0.025;

      // Render player
      x = data.world.player.location.x - data.settings.offset.x;
      y = data.world.player.location.y - data.settings.offset.y;

      context.fillStyle = "rgba(150, 150, 150, 1)";
      context.beginPath();
      context.moveTo(x, y - 25);
      context.lineTo(x + 25, y);
      context.lineTo(x, y + 25);
      context.lineTo(x - 25, y);
      context.fill();
}

window.setInterval(update, 10);
