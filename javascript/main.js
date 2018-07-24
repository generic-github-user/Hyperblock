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
            },
            "mouse": {
                  "x": 0,
                  "y": 0
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
                  },
                  "getPoints": function() {
                        var x = this.location.x;
                        var y = this.location.y;
                        var points = [
                              {
                                    "x": x,
                                    "y": y - 1
                              },
                              {
                                    "x": x + 1,
                                    "y": y
                              },
                              {
                                    "x": x,
                                    "y": y + 1
                              },
                              {
                                    "x": x - 1,
                                    "y": y
                              }
                        ];

                        return points;
                  }
            },
            "blocks": [],
            "projectiles": [],
            "time": 0
      }
};

function sameSign(num1, num2) {
      if ((num1 * num2) >= 0) {
            return true;
      }
      else {
            return false;
      }
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	var a1, a2, b1, b2, c1, c2;
	var r1, r2 , r3, r4;
	var denom, offset, num;

	// Compute a1, b1, c1, where line joining points 1 and 2
	// is "a1 x + b1 y + c1 = 0".
	a1 = y2 - y1;
	b1 = x1 - x2;
	c1 = (x2 * y1) - (x1 * y2);

	// Compute r3 and r4.
	r3 = ((a1 * x3) + (b1 * y3) + c1);
	r4 = ((a1 * x4) + (b1 * y4) + c1);

	// Check signs of r3 and r4. If both point 3 and point 4 lie on
	// same side of line 1, the line segments do not intersect.
	if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
		return 0; //return that they do not intersect
	}

	// Compute a2, b2, c2
	a2 = y4 - y3;
	b2 = x3 - x4;
	c2 = (x4 * y3) - (x3 * y4);

	// Compute r1 and r2
	r1 = (a2 * x1) + (b2 * y1) + c2;
	r2 = (a2 * x2) + (b2 * y2) + c2;

	// Check signs of r1 and r2. If both point 1 and point 2 lie
	// on same side of second line segment, the line segments do
	// not intersect.
	if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
		return 0; //return that they do not intersect
	}

	//Line segments intersect: compute intersection point.
	denom = (a1 * b2) - (a2 * b1);

	if (denom === 0) {
		return 1; //collinear
	}

	// lines_intersect
	return 1; //lines intersect, return true
}

var collide;
function checkCollision(shapes) {
      collide = false;
      var lines = [[], []];
      for (var i = 0; i < 2; i ++) {
            for (var j = 0; j < shapes[i].length - 1; j ++) {
                  lines[i].push([shapes[i][j], shapes[i][j + 1]]);
            }
            var len = shapes[i].length - 1;
            lines[i].push([shapes[i][len], shapes[i][0]]);
      }

      for (var i = 0; i < lines[0].length; i ++) {
            for (var j = 0; j < lines[1].length; j ++) {
                  var linesCollide = intersect(
                        lines[0][i][0].x,
                        lines[0][i][0].y,
                        lines[0][i][1].x,
                        lines[0][i][1].y,
                        lines[1][j][0].x,
                        lines[1][j][0].y,
                        lines[1][j][1].x,
                        lines[1][j][1].y,
                  );
                  if (linesCollide) {
                        collide = true;
                  }
            }
      }

      return collide;
}

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

// document.removeEventListener("mousemove", mouseMove, false);
function mouseMove(event) {
    data.input.mouse.x = event.clientX;
    data.input.mouse.y = event.clientY;
};

document.addEventListener("mousemove", mouseMove, false);

function shoot() {
      data.world.projectiles.push(
            {
                  // Separate strength and health?
                  "strength": random(2000, 2500),
                  "velocity": {
                        "x": (((data.input.mouse.x + data.settings.offset.x) / data.settings.zoom) - data.world.player.location.x) * random(10, 10),
                        "y": (((data.input.mouse.y + data.settings.offset.y) / data.settings.zoom) - data.world.player.location.y) * random(10, 10)
                  },
                  "location": {
                        "x": data.world.player.location.x,
                        "y": data.world.player.location.y
                  },
                  "getPoints": function() {
                        var x = this.location.x;
                        var y = this.location.y;
                        var points = [
                              {
                                    "x": x - 0.2,
                                    "y": y - 0.2,
                              },
                              {
                                    "x": x + 0.2,
                                    "y": y - 0.2
                              },
                              {
                                    "x": x + 0.2,
                                    "y": y + 0.2
                              },
                              {
                                    "x": x - 0.2,
                                    "y": y + 0.2
                              }
                        ];

                        return points;
                  }
            }
      );
}

document.addEventListener("mousedown", shoot, false);

for (var i = 0; i < 1000; i ++) {
      data.world.blocks.push(
            {
                  "strength": random(10000, 12500),
                  "location": {
                        "x": Math.round(Math.random() * 50),
                        "y": Math.round(Math.random() * 50)
                  },
                  "getPoints": function() {
                        var x = this.location.x;
                        var y = this.location.y;
                        var points = [
                              {
                                    "x": x - 0.5,
                                    "y": y - 0.5,
                              },
                              {
                                    "x": x + 0.5,
                                    "y": y - 0.5
                              },
                              {
                                    "x": x + 0.5,
                                    "y": y + 0.5
                              },
                              {
                                    "x": x - 0.5,
                                    "y": y + 0.5
                              }
                        ];

                        return points;
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
            data.settings.offset.x = -(canvas.width / 2) + (data.world.player.location.x * data.settings.zoom);
            data.settings.offset.y = -(canvas.height / 2) + (data.world.player.location.y * data.settings.zoom);
      }

      data.world.projectiles.forEach(
            (projectile) => {
                  projectile.location.x += projectile.velocity.x * 0.001;
                  projectile.location.y += projectile.velocity.y * 0.001;

                  projectile.velocity.x *= random(0.999, 1);
                  projectile.velocity.y *= random(0.999, 1);
            }
      );

      for (var i = 0; i < data.world.projectiles.length; i ++) {
            projectile = data.world.projectiles[i];
            projectile.strength -= Math.random();

            for (var j = 0; j < data.world.blocks.length; j ++) {
                  var block = data.world.blocks[j];

                  var shapes = [
                        projectile.getPoints(),
                        block.getPoints()
                  ];
                  if (checkCollision(shapes)) {
                        var blockStrength = block.strength;
                        block.strength -= projectile.strength;
                        projectile.strength -= blockStrength;
                  }
            }

            for (var j = 0; j < data.world.projectiles.length; j ++) {
                  var projectiles = [
                        projectile,
                        data.world.projectiles[j]
                  ];

                  var shapes = [
                        projectiles[0].getPoints(),
                        projectiles[1].getPoints()
                  ];
                  if (i !== j) {
                        if (checkCollision(shapes)) {
                              var projectileStrength = projectiles[0].strength;
                              projectiles[0].strength -= projectiles[1].strength;
                              projectiles[1].strength -= projectileStrength;
                        }
                  }
            }

            if (projectile.strength <= 0) {
                  data.world.projectiles.splice(i, 1);
            }
      }

      // Render projectiles
      data.world.projectiles.forEach(
            (projectile) => {
                  opacity = projectile.strength / 2000;
                  if (opacity > 1) {
                        opacity = 1;
                  }
                  else if (opacity < 0) {
                        opacity = 0;
                  }

                  l = projectile.getPoints();
                  l.forEach(
                        (point) => {
                              point.x *= data.settings.zoom;
                              point.y *= data.settings.zoom;
                              point.x -= data.settings.offset.x;
                              point.y -= data.settings.offset.y;
                        }
                  );

                  context.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                  context.beginPath();
                  context.moveTo(l[0].x, l[0].y);
                  context.lineTo(l[1].x, l[1].y);
                  context.lineTo(l[2].x, l[2].y);
                  context.lineTo(l[3].x, l[3].y);
                  context.fill();
            }
      );

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
                  var opacity = block.strength / 10000;
                  if (opacity > 1) {
                        opacity = 1;
                  }
                  else if (opacity < 0) {
                        opacity = 0;
                  }

                  context.fillStyle = "rgba(0, 0, 0, " + (block.strength / 10000) + ")";
                  context.fillRect(
                        (block.location.x * data.settings.zoom) - (data.settings.zoom / 2) - data.settings.offset.x,
                        (block.location.y * data.settings.zoom) - (data.settings.zoom / 2) - data.settings.offset.y,
                        data.settings.zoom,
                        data.settings.zoom
                  );
            }
      );

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

      data.world.player.location.x += data.world.player.velocity.x * 0.001;
      data.world.player.location.y += data.world.player.velocity.y * 0.001;

      data.world.player.velocity.x *= random(0.98, 1);
      data.world.player.velocity.y *= random(0.98, 1);

      var collide = false;
      for (var i = 0; i < data.world.blocks.length; i ++) {
            var shapes = [
                  data.world.player.getPoints(),
                  data.world.blocks[i].getPoints()
            ];
            if (checkCollision(shapes)) {
                  // data.world.player.location.x -= data.world.player.velocity.x * 0.001;
                  // data.world.player.location.y -= data.world.player.velocity.y * 0.001;
                  // data.world.player.velocity.x *= -1;
                  // data.world.player.velocity.y *= -1;
                  // data.world.player.velocity.x *= 1.1;
                  // data.world.player.velocity.y *= 1.1;
                  // data.world.player.velocity.x *= 0.1;
                  // data.world.player.velocity.y *= 0.1;
                  // var velxtemp = data.world.player.velocity.x;
                  // data.world.player.velocity.x = data.world.player.velocity.y;
                  // data.world.player.velocity.y = -velxtemp;

                  // var slope =
                  // (data.world.blocks[i].location.y - data.world.player.location.y) /
                  // (data.world.blocks[i].location.x - data.world.player.location.x);
                  // var inverse = -1 / slope;
                  //
                  // data.world.player.velocity.x *= inverse;
                  // data.world.player.velocity.y *= inverse;

                  // Add side-based collision detection

                  // data.world.player.location.x -= data.world.player.velocity.x * 0.001;
                  // data.world.player.location.y -= data.world.player.velocity.y * 0.001;

                  collide = true;
            }
      }
      if (collide) {
            data.world.player.velocity.x *= data.world.player.speed * 0.95;
            data.world.player.velocity.y *= data.world.player.speed * 0.95;
      }

      data.world.time ++;

      // Render player
      l = data.world.player.getPoints();
      // Not technically needed
      l.forEach(
            (point) => {
                  // point.x += data.world.player.location.x * data.settings.zoom;
                  // point.y += data.world.player.location.y * data.settings.zoom;
                  point.x *= data.settings.zoom;
                  point.y *= data.settings.zoom;
                  point.x -= data.settings.offset.x;
                  point.y -= data.settings.offset.y;
            }
      );

      context.fillStyle = "rgba(150, 150, 150, 1)";
      context.beginPath();
      context.moveTo(l[0].x, l[0].y);
      context.lineTo(l[1].x, l[1].y);
      context.lineTo(l[2].x, l[2].y);
      context.lineTo(l[3].x, l[3].y);
      context.fill();

      var weight = (Math.sin(data.world.time / 25) + 10) / 100;
      var x = (((data.world.player.location.x * data.settings.zoom) - data.settings.offset.x) * (1 - weight)) + (data.input.mouse.x * weight);
      var y = (((data.world.player.location.y * data.settings.zoom) - data.settings.offset.y) * (1 - weight)) + (data.input.mouse.y * weight);
      // var size = (Math.sin(data.world.time / 10) + 5) * 2;
      var size = 10;

      context.fillStyle = "rgba(0, 0, 0, " + (Math.sin(data.world.time / 25) + 1) + ")";
      context.save();
      context.translate(x, y);
      context.rotate(data.world.time / 25);
      context.fillRect(-(size / 2), -(size / 2), size, size);
      context.restore();
}

window.setInterval(update, 10);
